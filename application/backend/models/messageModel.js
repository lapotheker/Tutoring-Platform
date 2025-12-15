const pool = require("../db/pool");

/**
 * Data access for in_site_message + reported_item tables.
 * Returns sender/recipient names where appropriate.
 */
const messageModel = {
  /**
   * Create a one-round in-site message (enforces one per sender→recipient).
   * Returns the inserted row with names.
   */
  async createMessage({ senderUserId, recipientUserId, messageText }) {
    // Check existing
    const [existing] = await pool.query(
      `SELECT message_id FROM in_site_message
       WHERE sender_user_id = ? AND recipient_user_id = ?
       LIMIT 1`,
      [senderUserId, recipientUserId]
    );
    if (existing.length > 0) {
      return { alreadyExists: true };
    }

    // Validate users
    const [sender] = await pool.query(
      "SELECT user_id, full_name FROM user WHERE user_id = ?",
      [senderUserId]
    );
    const [recipient] = await pool.query(
      "SELECT user_id, full_name FROM user WHERE user_id = ?",
      [recipientUserId]
    );
    if (sender.length === 0) throw new Error("Sender not found");
    if (recipient.length === 0) throw new Error("Recipient not found");

    // Insert
    const [result] = await pool.query(
      `INSERT INTO in_site_message
         (sender_user_id, recipient_user_id, message, message_status, created_at)
       VALUES (?, ?, ?, 'Sent', NOW())`,
      [senderUserId, recipientUserId, messageText.trim()]
    );

    // Return with names
    const [rows] = await pool.query(
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

    return { message: rows[0] };
  },

  /**
   * Get all messages (sent or received) for a user, with names.
   * Excludes Removed.
   */
  async getMessagesForUser(userId) {
    const [rows] = await pool.query(
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
    return rows;
  },

  /**
   * Get messages sent by a user TO TUTORS ONLY, with names.
   * Excludes Removed.
   */
  async getSentMessages(userId) {
    const [rows] = await pool.query(
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
     WHERE m.sender_user_id = ?
       AND r.role = 2
       AND m.message_status != 'Removed'
     ORDER BY m.created_at DESC`,
      [userId]
    );
    return rows;
  },

  /**
   * Get messages received by a user FROM TUTORS ONLY, with names.
   * Excludes Removed.
   */
  async getReceivedMessages(userId) {
    const [rows] = await pool.query(
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
     WHERE m.recipient_user_id = ?
       AND s.role = 2
       AND m.message_status != 'Removed'
     ORDER BY m.created_at DESC`,
      [userId]
    );
    return rows;
  },

  /**
   * Report a message; inserts into reported_item and marks message as Reported.
   */
  async reportMessage({ messageId, reporterUserId, reason, details }) {
    const validReasons = [
      "Harassment/Abuse",
      "Inappropriate Content",
      "Spam/Solicitation",
      "Privacy/Safety",
      "Other",
    ];
    if (!validReasons.includes(reason)) {
      const err = new Error("Invalid reason");
      err.code = "INVALID_REASON";
      throw err;
    }

    const conn = await pool.getConnection();
    try {
      await conn.beginTransaction();

      // Ensure message exists
      const [exists] = await conn.query(
        "SELECT message_id FROM in_site_message WHERE message_id = ?",
        [messageId]
      );
      if (exists.length === 0) {
        const err = new Error("Message not found");
        err.code = "NOT_FOUND";
        throw err;
      }

      // Already reported by this user?
      const [already] = await conn.query(
        `SELECT report_id FROM reported_item 
         WHERE target_type = 'In-Site Message' 
           AND target_id = ? 
           AND created_by = ?`,
        [messageId, reporterUserId]
      );
      if (already.length > 0) {
        const err = new Error("Already reported");
        err.code = "ALREADY_REPORTED";
        throw err;
      }

      // Insert report
      const [reportResult] = await conn.query(
        `INSERT INTO reported_item
           (target_type, target_id, report_reason, details, status, created_by, created_at)
         VALUES ('In-Site Message', ?, ?, ?, 'New', ?, NOW())`,
        [messageId, reason, details || null, reporterUserId]
      );

      // Update message status
      await conn.query(
        `UPDATE in_site_message
         SET message_status = 'Reported', linked_report_id = ?
         WHERE message_id = ?`,
        [reportResult.insertId, messageId]
      );

      await conn.commit();
      return { reportId: reportResult.insertId };
    } catch (err) {
      await conn.rollback();
      throw err;
    } finally {
      conn.release();
    }
  },

  /**
   * Get messages sent by a TUTOR to STUDENTS, with names.
   * Shows messages where the user is ACTING AS A TUTOR (replying to student inquiries).
   * Excludes Removed.
   */
  async getTutorSentMessages(userId) {
    const [rows] = await pool.query(
      `SELECT 
     m.message_id,
     m.sender_user_id,
     m.recipient_user_id,
     m.message,
     m.message_status,
     m.created_at,
     s.full_name AS sender_name,
     r.full_name AS recipient_name,
     CAST((SELECT COUNT(*) FROM in_site_message m2 
      WHERE m2.sender_user_id = m.recipient_user_id 
      AND m2.recipient_user_id = m.sender_user_id 
      AND m2.created_at < m.created_at) AS SIGNED) as prior_count
   FROM in_site_message m
   JOIN user s ON m.sender_user_id = s.user_id
   JOIN user r ON m.recipient_user_id = r.user_id
   WHERE m.sender_user_id = ?
     AND m.message_status != 'Removed'
   ORDER BY m.created_at DESC`,
      [userId]
    );

    // Filter and clean up the results
    const filtered = rows.filter((row) => Number(row.prior_count) > 0);

    // Remove the extra field before returning
    return filtered.map((row) => {
      const { prior_count, ...cleanRow } = row;
      return cleanRow;
    });
  },

  /**
   * Get messages received by a TUTOR from STUDENTS, with names.
   * Shows student inquiries where the user is ACTING AS A TUTOR.
   * Excludes Removed.
   */
  async getTutorReceivedMessages(userId) {
    const [rows] = await pool.query(
      `SELECT 
     m.message_id,
     m.sender_user_id,
     m.recipient_user_id,
     m.message,
     m.message_status,
     m.created_at,
     s.full_name AS sender_name,
     r.full_name AS recipient_name,
     CAST((SELECT COUNT(*) FROM in_site_message m2 
      WHERE m2.sender_user_id = m.recipient_user_id 
      AND m2.recipient_user_id = m.sender_user_id 
      AND m2.created_at < m.created_at) AS SIGNED) as prior_count
   FROM in_site_message m
   JOIN user s ON m.sender_user_id = s.user_id
   JOIN user r ON m.recipient_user_id = r.user_id
   WHERE m.recipient_user_id = ?
     AND m.message_status != 'Removed'
   ORDER BY m.created_at DESC`,
      [userId]
    );

    // Filter and clean up the results
    const filtered = rows.filter((row) => Number(row.prior_count) === 0);

    // Remove the extra field before returning
    return filtered.map((row) => {
      const { prior_count, ...cleanRow } = row;
      return cleanRow;
    });
  },

  /**
   * Tutor replies to student and optionally confirms session
   */
  async replyToMessage({
    tutorUserId,
    studentUserId,
    messageText,
    confirmSession,
    courseInfo,
    sessionDatetime,
    locationMode,
  }) {
    // Check if tutor already replied
    const [existing] = await pool.query(
      `SELECT message_id FROM in_site_message
     WHERE sender_user_id = ? AND recipient_user_id = ?
     LIMIT 1`,
      [tutorUserId, studentUserId]
    );

    if (existing.length > 0) {
      throw new Error("You have already replied to this student");
    }

    const conn = await pool.getConnection();
    try {
      await conn.beginTransaction();

      // Insert reply message
      const [messageResult] = await conn.query(
        `INSERT INTO in_site_message
         (sender_user_id, recipient_user_id, message, message_status, created_at)
       VALUES (?, ?, ?, 'Sent', NOW())`,
        [tutorUserId, studentUserId, messageText.trim()]
      );

      let sessionId = null;

      // If confirmed, create session
      if (confirmSession && courseInfo && sessionDatetime && locationMode) {
        const [sessionResult] = await conn.query(
          `INSERT INTO tutoring_sessions 
         (student_user_id, tutor_user_id, course_info, session_datetime, location_mode, status)
         VALUES (?, ?, ?, ?, ?, 'upcoming')`,
          [
            studentUserId,
            tutorUserId,
            courseInfo,
            sessionDatetime,
            locationMode,
          ]
        );
        sessionId = sessionResult.insertId;
      }

      await conn.commit();

      // Return message with names
      const [rows] = await pool.query(
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
        [messageResult.insertId]
      );

      return {
        message: rows[0],
        sessionId: sessionId,
      };
    } catch (err) {
      await conn.rollback();
      throw err;
    } finally {
      conn.release();
    }
  },
};

module.exports = messageModel;
