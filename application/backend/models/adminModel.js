const pool = require("../db/pool");

const adminModel = {
  async getPendingTutors() {
    const [rows] = await pool.query(
      `SELECT 
         tp.tutor_profile_id,
         tp.tutor_user_id,
         tp.display_name,
         tp.hourly_rate,
         tp.approval_status,
         tp.visibility,
         tp.created_at,
         u.full_name,
         u.sfsu_email
       FROM tutor_profile tp
       JOIN user u ON tp.tutor_user_id = u.user_id
       WHERE tp.approval_status = 'Pending'
       ORDER BY tp.created_at ASC`
    );
    return rows;
  },

  async updateTutorStatus(tutorProfileId, status, adminUserId) {
    await pool.query(
      `UPDATE tutor_profile
       SET approval_status = ?, updated_by = ?, updated_at = NOW()
       WHERE tutor_profile_id = ?`,
      [status, adminUserId, tutorProfileId]
    );
    return { success: true };
  },

  async getReportedItems() {
    const [rows] = await pool.query(
      `SELECT 
         r.report_id,
         r.target_type,
         r.target_id,
         r.report_reason,
         r.details,
         r.status,
         r.created_at,
         u.full_name AS reporter_name,
         u.sfsu_email AS reporter_email
       FROM reported_item r
       JOIN user u ON r.created_by = u.user_id
       ORDER BY r.created_at DESC`
    );
    return rows;
  },

  async updateReportStatus(reportId, status, adminUserId, notes = null) {
    await pool.query(
      `UPDATE reported_item
       SET status = ?, resolved_by = ?, resolved_at = NOW(), resolution_notes = ?
       WHERE report_id = ?`,
      [status, adminUserId, notes, reportId]
    );
    return { success: true };
  },

  async getActionLog(limit = 20) {
    const [rows] = await pool.query(
      `SELECT 
         a.admin_action_id,
         a.action_type,
         a.target_type,
         a.target_id,
         a.reason_notes,
         a.timestamp,
         admin.full_name AS admin_name,
         admin.sfsu_email AS admin_email
       FROM admin_action a
       JOIN user admin ON a.performed_by = admin.user_id
       ORDER BY a.timestamp DESC
       LIMIT ?`,
      [limit]
    );
    return rows;
  },

  async logAction({
    action_type,
    target_type,
    target_id,
    reason_notes,
    performed_by,
    originating_report_id = null,
  }) {
    await pool.query(
      `INSERT INTO admin_action
       (action_type, target_type, target_id, reason_notes, performed_by, originating_report_id)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        action_type,
        target_type,
        target_id,
        reason_notes || null,
        performed_by,
        originating_report_id,
      ]
    );
    return { success: true };
  },

  async getTutorProfileDetail(profileId) {
    const [rows] = await pool.query(
      `SELECT 
         tp.tutor_profile_id,
         tp.tutor_user_id,
         tp.display_name,
         tp.hourly_rate,
         tp.approval_status,
         tp.visibility,
         tp.created_at,
         tp.updated_at,
         u.full_name,
         u.sfsu_email,
         GROUP_CONCAT(DISTINCT cn.code ORDER BY cn.code SEPARATOR ', ') AS courses,
         GROUP_CONCAT(DISTINCT st.tag_name ORDER BY st.tag_name SEPARATOR ', ') AS subjects,
         GROUP_CONCAT(DISTINCT l.language_name ORDER BY l.language_name SEPARATOR ', ') AS languages
       FROM tutor_profile tp
       JOIN user u ON tp.tutor_user_id = u.user_id
       LEFT JOIN tutor_profile_course tpc ON tp.tutor_profile_id = tpc.tutor_profile_id
       LEFT JOIN course_number cn ON tpc.course_id = cn.course_id
       LEFT JOIN tutor_profile_subject_tag tpst ON tp.tutor_profile_id = tpst.tutor_profile_id
       LEFT JOIN subject_tag st ON tpst.tag_id = st.tag_id
       LEFT JOIN tutor_profile_language tpl ON tp.tutor_profile_id = tpl.tutor_profile_id
       LEFT JOIN language l ON tpl.language_id = l.language_id
       WHERE tp.tutor_profile_id = ?
       GROUP BY tp.tutor_profile_id`,
      [profileId]
    );
    return rows[0] || null;
  },

  async getMessageDetail(messageId) {
    const [rows] = await pool.query(
      `SELECT 
         m.message_id,
         m.message,
         m.created_at,
         m.message_status,
         s.user_id AS sender_user_id,
         s.full_name AS sender_name,
         s.sfsu_email AS sender_email,
         r.user_id AS recipient_user_id,
         r.full_name AS recipient_name,
         r.sfsu_email AS recipient_email
       FROM in_site_message m
       JOIN user s ON m.sender_user_id = s.user_id
       JOIN user r ON m.recipient_user_id = r.user_id
       WHERE m.message_id = ?`,
      [messageId]
    );
    return rows[0] || null;
  },
};

module.exports = adminModel;
