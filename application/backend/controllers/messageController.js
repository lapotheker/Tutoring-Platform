const db = require("../config/db");

/**
 * POST /api/messages
 * Create a new message from student to tutor
 * Enforces: one message per student-tutor pair to prevent spam
 */
exports.sendMessage = async (req, res) => {
  const { sender_user_id, recipient_user_id, message } = req.body;

  if (!sender_user_id || !recipient_user_id || !message) {
    return res.status(400).json({
      success: false,
      error: "sender_user_id, recipient_user_id, and message are required",
    });
  }

  if (!message.trim()) {
    return res.status(400).json({
      success: false,
      error: "Message cannot be empty",
    });
  }

  try {
    const [existing] = await db.query(
      `SELECT message_id 
       FROM in_site_message 
       WHERE sender_user_id = ? AND recipient_user_id = ?
       LIMIT 1`,
      [sender_user_id, recipient_user_id]
    );

    if (existing.length > 0) {
      return res.status(400).json({
        success: false,
        error: "You have already sent a message to this tutor. Only one message per tutor is allowed.",
      });
    }

    const [senderResult] = await db.query(
      "SELECT user_id, full_name, sfsu_email FROM user WHERE user_id = ?",
      [sender_user_id]
    );

    const [recipientResult] = await db.query(
      "SELECT user_id, full_name, sfsu_email FROM user WHERE user_id = ?",
      [recipient_user_id]
    );

    if (senderResult.length === 0) {
      return res.status(404).json({ success: false, error: "Sender not found" });
    }

    if (recipientResult.length === 0) {
      return res.status(404).json({ success: false, error: "Recipient not found" });
    }

    const [result] = await db.query(
      `INSERT INTO in_site_message (sender_user_id, recipient_user_id, message, message_status, created_at)
       VALUES (?, ?, ?, 'Sent', NOW())`,
      [sender_user_id, recipient_user_id, message.trim()]
    );

    const [newMessage] = await db.query(
      `SELECT 
        m.message_id,
        m.sender_user_id,
        m.recipient_user_id,
        m.message,
        m.message_status,
        m.created_at,
        s.full_name AS sender_name,
        r.full_name AS recipient_name
       FROM in_site_message m
       JOIN user s ON m.sender_user_id = s.user_id
       JOIN user r ON m.recipient_user_id = r.user_id
       WHERE m.message_id = ?`,
      [result.insertId]
    );

    return res.status(201).json({
      success: true,
      message: "Message sent successfully",
      data: newMessage[0],
    });
  } catch (error) {
    console.error("Error sending message:", error);
    
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({
        success: false,
        error: "You have already sent a message to this tutor.",
      });
    }
    
    return res.status(500).json({
      success: false,
      error: "Failed to send message",
    });
  }
};

/**
 * GET /api/messages/user/:userId
 * Get all messages for a specific user (sent and received)
 */
exports.getMessagesForUser = async (req, res) => {
  const { userId } = req.params;

  if (!userId) {
    return res.status(400).json({
      success: false,
      error: "userId is required",
    });
  }

  try {
    const [messages] = await db.query(
      `SELECT 
        m.message_id,
        m.sender_user_id,
        m.recipient_user_id,
        m.message,
        m.message_status,
        m.created_at,
        s.full_name AS sender_name,
        r.full_name AS recipient_name
       FROM in_site_message m
       JOIN user s ON m.sender_user_id = s.user_id
       JOIN user r ON m.recipient_user_id = r.user_id
       WHERE (m.sender_user_id = ? OR m.recipient_user_id = ?)
         AND m.message_status != 'Removed'
       ORDER BY m.created_at DESC`,
      [userId, userId]
    );

    return res.status(200).json({
      success: true,
      data: messages,
    });
  } catch (error) {
    console.error("Error fetching messages:", error);
    return res.status(500).json({
      success: false,
      error: "Failed to fetch messages",
    });
  }
};

/**
 * POST /api/messages/:messageId/report
 * Report a message for review (creates entry in reported_item table)
 */
exports.reportMessage = async (req, res) => {
  const { messageId } = req.params;
  const { reporter_user_id, reason, details } = req.body;

  if (!messageId || !reporter_user_id || !reason) {
    return res.status(400).json({
      success: false,
      error: "messageId, reporter_user_id, and reason are required",
    });
  }

  const validReasons = ['Harassment/Abuse', 'Inappropriate Content', 'Spam/Solicitation', 'Privacy/Safety', 'Other'];
  if (!validReasons.includes(reason)) {
    return res.status(400).json({
      success: false,
      error: "Invalid reason. Must be one of: " + validReasons.join(', '),
    });
  }

  try {
    // Check if message exists
    const [messageExists] = await db.query(
      "SELECT message_id FROM in_site_message WHERE message_id = ?",
      [messageId]
    );

    if (messageExists.length === 0) {
      return res.status(404).json({
        success: false,
        error: "Message not found",
      });
    }

    // Check if already reported by this user
    const [alreadyReported] = await db.query(
      `SELECT report_id FROM reported_item 
       WHERE target_type = 'In-Site Message' 
         AND target_id = ? 
         AND created_by = ?`,
      [messageId, reporter_user_id]
    );

    if (alreadyReported.length > 0) {
      return res.status(400).json({
        success: false,
        error: "You have already reported this message",
      });
    }
    
    const [reportResult] = await db.query(
      `INSERT INTO reported_item (target_type, target_id, report_reason, details, status, created_by, created_at)
       VALUES ('In-Site Message', ?, ?, ?, 'New', ?, NOW())`,
      [messageId, reason, details || null, reporter_user_id]
    );

    await db.query(
      `UPDATE in_site_message 
       SET message_status = 'Reported', linked_report_id = ?
       WHERE message_id = ?`,
      [reportResult.insertId, messageId]
    );

    return res.status(201).json({
      success: true,
      message: "Message reported successfully. An administrator will review it.",
      report_id: reportResult.insertId,
    });
  } catch (error) {
    console.error("Error reporting message:", error);
    return res.status(500).json({
      success: false,
      error: "Failed to report message",
    });
  }
};