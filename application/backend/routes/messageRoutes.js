const db = require("../config/db");

/**
 * POST /api/messages
 * Create a new message from student to tutor
 * Enforces: one message per student-tutor pair to prevent spam
 */
exports.sendMessage = async (req, res) => {
  const { sender_user_id, recipient_user_id, message } = req.body;

  // Validation
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
    // Check if student has already sent a message to this tutor
    const [existing] = await db.query(
      `SELECT message_id 
       FROM messages 
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
      "SELECT user_id, full_name, email FROM users WHERE user_id = ?",
      [sender_user_id]
    );

    const [recipientResult] = await db.query(
      "SELECT user_id, full_name, email FROM users WHERE user_id = ?",
      [recipient_user_id]
    );

    if (senderResult.length === 0) {
      return res.status(404).json({ success: false, error: "Sender not found" });
    }

    if (recipientResult.length === 0) {
      return res.status(404).json({ success: false, error: "Recipient not found" });
    }

    const sender = senderResult[0];
    const recipient = recipientResult[0];

    const [result] = await db.query(
      `INSERT INTO messages (sender_user_id, recipient_user_id, message, created_at)
       VALUES (?, ?, ?, NOW())`,
      [sender_user_id, recipient_user_id, message.trim()]
    );

    const [newMessage] = await db.query(
      `SELECT 
        m.message_id,
        m.sender_user_id,
        m.recipient_user_id,
        m.message,
        m.created_at,
        s.full_name AS sender_name,
        r.full_name AS recipient_name
       FROM messages m
       JOIN users s ON m.sender_user_id = s.user_id
       JOIN users r ON m.recipient_user_id = r.user_id
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
    // Get all messages where user is sender or recipient
    const [messages] = await db.query(
      `SELECT 
        m.message_id,
        m.sender_user_id,
        m.recipient_user_id,
        m.message,
        m.created_at,
        s.full_name AS sender_name,
        r.full_name AS recipient_name
       FROM messages m
       JOIN users s ON m.sender_user_id = s.user_id
       JOIN users r ON m.recipient_user_id = r.user_id
       WHERE m.sender_user_id = ? OR m.recipient_user_id = ?
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
 * Report a message for review
 */
exports.reportMessage = async (req, res) => {
  const { messageId } = req.params;
  const { reporter_user_id, reason } = req.body;

  if (!messageId || !reporter_user_id) {
    return res.status(400).json({
      success: false,
      error: "messageId and reporter_user_id are required",
    });
  }

  try {
    // Check if message exists
    const [messageExists] = await db.query(
      "SELECT message_id FROM messages WHERE message_id = ?",
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
      `SELECT report_id FROM message_reports 
       WHERE message_id = ? AND reporter_user_id = ?`,
      [messageId, reporter_user_id]
    );

    if (alreadyReported.length > 0) {
      return res.status(400).json({
        success: false,
        error: "You have already reported this message",
      });
    }

    await db.query(
      `INSERT INTO message_reports (message_id, reporter_user_id, reason, created_at)
       VALUES (?, ?, ?, NOW())`,
      [messageId, reporter_user_id, reason || "No reason provided"]
    );

    return res.status(201).json({
      success: true,
      message: "Message reported successfully",
    });
  } catch (error) {
    console.error("Error reporting message:", error);
    return res.status(500).json({
      success: false,
      error: "Failed to report message",
    });
  }
};