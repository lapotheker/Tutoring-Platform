const pool = require("../db/pool");

/**
 * Data access for the in_site_message + reported_item tables.
 */
const messageModel = {
  /**
   * Create a one-round in-site message from a student to a tutor
   * Enforces one row per (sender_user_id, recipient_user_id)
   *
   * Input:
   *   senderUserId: number (must exist in user table)
   *   recipientUserId: number (must exist in user table)
   *   messageText: string (non-empty)
   *
   * Returns:
   *   { alreadyExists: true, existingMessage: row }  if a row already exists
   *   { message: row }                              if a new row is created
   */
  async createMessage({ senderUserId, recipientUserId, messageText }) {
    // Check if there is already a message between this sender and recipient
    const [existingRows] = await pool.execute(
      `
      SELECT
        message_id,
        sender_user_id,
        recipient_user_id,
        message,
        created_at,
        message_status,
        linked_report_id
      FROM in_site_message
      WHERE sender_user_id = ?
        AND recipient_user_id = ?
      `,
      [senderUserId, recipientUserId]
    );

    if (existingRows.length > 0) {
      return {
        alreadyExists: true,
        existingMessage: existingRows[0],
      };
    }

    // Insert new message
    const [insertResult] = await pool.execute(
      `
      INSERT INTO in_site_message
        (sender_user_id, recipient_user_id, message)
      VALUES (?, ?, ?)
      `,
      [senderUserId, recipientUserId, messageText]
    );

    const newId = insertResult.insertId;

    // Fetch the inserted row so we return consistent data
    const [rows] = await pool.execute(
      `
      SELECT
        message_id,
        sender_user_id,
        recipient_user_id,
        message,
        created_at,
        message_status,
        linked_report_id
      FROM in_site_message
      WHERE message_id = ?
      `,
      [newId]
    );

    return { message: rows[0] };
  },

  /**
   * Get all messages where the user is either sender or recipient.
   */
  async getMessagesForUser(userId) {
    const [rows] = await pool.execute(
      `
      SELECT
        message_id,
        sender_user_id,
        recipient_user_id,
        message,
        created_at,
        message_status,
        linked_report_id
      FROM in_site_message
      WHERE sender_user_id = ?
         OR recipient_user_id = ?
      ORDER BY created_at DESC
      `,
      [userId, userId]
    );

    return rows;
  },

  /**
   * Get a single message by ID.
   */
  async getMessageById(messageId) {
    const [rows] = await pool.execute(
      `
      SELECT
        message_id,
        sender_user_id,
        recipient_user_id,
        message,
        created_at,
        message_status,
        linked_report_id
      FROM in_site_message
      WHERE message_id = ?
      `,
      [messageId]
    );

    return rows[0] || null;
  },

  /**
   * Report a message.
   *   1. Inserts into reported_item with target_type 'In-Site Message'
   *   2. Updates in_site_message.message_status to 'Reported'
   *      and sets linked_report_id.
   *
   * Input:
   *   messageId: number
   *   reportReason: one of the ENUM values in schema.sql:
   *       'Harassment/Abuse', 'Inappropriate Content',
   *       'Spam/Solicitation', 'Privacy/Safety', 'Other'
   *   details: string | null
   *   createdBy: user_id of reporter
   */
  async reportMessage({ messageId, reportReason, details, createdBy }) {
    const conn = await pool.getConnection();
    try {
      await conn.beginTransaction();

      // 1. Insert into reported_item
      const [reportResult] = await conn.execute(
        `
        INSERT INTO reported_item
          (target_type, target_id, report_reason, details, status, created_by)
        VALUES ('In-Site Message', ?, ?, ?, 'New', ?)
        `,
        [messageId, reportReason, details || null, createdBy]
      );

      const reportId = reportResult.insertId;

      // 2. Update in_site_message with status + linked_report_id
      await conn.execute(
        `
        UPDATE in_site_message
        SET message_status = 'Reported',
            linked_report_id = ?
        WHERE message_id = ?
        `,
        [reportId, messageId]
      );

      await conn.commit();

      return { reportId };
    } catch (err) {
      await conn.rollback();
      throw err;
    } finally {
      conn.release();
    }
  },
};

module.exports = messageModel;
