const pool = require("../db/pool");

const sessionModel = {
  /**
   * Get all sessions for a student
   */
  async getStudentSessions(studentUserId) {
    try {
      const [sessions] = await pool.query(
        `SELECT 
          s.session_id,
          s.course_info,
          s.session_datetime,
          s.location_mode,
          s.status,
          s.created_at,
          u.full_name AS tutor_name,
          s.tutor_user_id
         FROM tutoring_sessions s
         JOIN user u ON s.tutor_user_id = u.user_id
         WHERE s.student_user_id = ?
         ORDER BY s.session_datetime DESC`,
        [studentUserId]
      );
      return sessions;
    } catch (error) {
      console.error("Error fetching sessions:", error);
      throw error;
    }
  },

  /**
   * Create a new session (for future booking functionality)
   */
  async createSession(sessionData) {
    const {
      student_user_id,
      tutor_user_id,
      course_info,
      session_datetime,
      location_mode,
    } = sessionData;

    try {
      const [result] = await pool.query(
        `INSERT INTO tutoring_sessions 
         (student_user_id, tutor_user_id, course_info, session_datetime, location_mode, status)
         VALUES (?, ?, ?, ?, ?, 'upcoming')`,
        [
          student_user_id,
          tutor_user_id,
          course_info,
          session_datetime,
          location_mode,
        ]
      );

      return { success: true, sessionId: result.insertId };
    } catch (error) {
      console.error("Error creating session:", error);
      throw error;
    }
  },
};

module.exports = sessionModel;
