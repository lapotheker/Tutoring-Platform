const pool = require("../db/pool");

const tutorModel = {
  /**
   * Search tutors with filters
   * Returns only approved and visible tutors
   */
  async searchTutors(filters = {}) {
    let query = `
      SELECT DISTINCT
        tp.tutor_profile_id,
        tp.display_name,
        tp.hourly_rate,
        tp.availability_summary,
        tp.approval_status,
        tp.visibility,
        u.full_name,
        u.sfsu_email,
        GROUP_CONCAT(DISTINCT cn.code SEPARATOR ', ') as courses,
        GROUP_CONCAT(DISTINCT st.tag_name SEPARATOR ', ') as subject_tags,
        GROUP_CONCAT(DISTINCT l.language_name SEPARATOR ', ') as languages,
        MAX(tpp.file_path) as profile_photo
      FROM tutor_profile tp
      INNER JOIN user u ON tp.tutor_user_id = u.user_id
      LEFT JOIN tutor_profile_course tpc ON tp.tutor_profile_id = tpc.tutor_profile_id
      LEFT JOIN course_number cn ON tpc.course_id = cn.course_id
      LEFT JOIN tutor_profile_subject_tag tpst ON tp.tutor_profile_id = tpst.tutor_profile_id
      LEFT JOIN subject_tag st ON tpst.tag_id = st.tag_id
      LEFT JOIN tutor_profile_language tpl ON tp.tutor_profile_id = tpl.tutor_profile_id
      LEFT JOIN language l ON tpl.language_id = l.language_id
      LEFT JOIN tutor_profile_photo tpp ON tp.tutor_profile_id = tpp.tutor_profile_id AND tpp.policy_check = 'Approved'
      WHERE tp.approval_status = 'Approved'
        AND tp.visibility = 'Public'
    `;

    const params = [];

    // Filter by course code
    if (filters.course && filters.course.trim()) {
      query += ` AND cn.code LIKE ?`;
      params.push(`%${filters.course}%`);
    }

    // Filter by subject tag
    if (filters.subject && filters.subject.trim()) {
      query += ` AND st.tag_name LIKE ?`;
      params.push(`%${filters.subject}%`);
    }

    // Filter by language
    if (filters.language && filters.language.trim()) {
      query += ` AND l.language_name LIKE ?`;
      params.push(`%${filters.language}%`);
    }

    // Free text search across multiple fields
    if (filters.search && filters.search.trim()) {
      const like = `%${filters.search}%`;
      query += `
        AND (
          tp.display_name LIKE ?
          OR u.full_name LIKE ?
          OR cn.code LIKE ?
          OR cn.title LIKE ?
          OR st.tag_name LIKE ?
          OR l.language_name LIKE ?
          OR tp.availability_summary LIKE ?
        )
      `;
      params.push(like, like, like, like, like, like, like);
    }

    // Filter by hourly rate range
    if (filters.minRate && filters.minRate !== "") {
      const minRate = Number(filters.minRate);
      if (!isNaN(minRate)) {
        query += ` AND CAST(tp.hourly_rate AS DECIMAL(10,2)) >= ?`;
        params.push(minRate);
      }
    }
    if (filters.maxRate && filters.maxRate !== "") {
      const maxRate = Number(filters.maxRate);
      if (!isNaN(maxRate)) {
        query += ` AND CAST(tp.hourly_rate AS DECIMAL(10,2)) <= ?`;
        params.push(maxRate);
      }
    }

    // Filter by days (matches within availability summary)
    if (filters.days && filters.days.trim()) {
      const days = filters.days.split(",").filter((d) => d.trim());
      if (days.length > 0) {
        const dayConditions = days.map(() => `tp.availability_summary LIKE ?`).join(" OR ");
        query += ` AND (${dayConditions})`;
        days.forEach((day) => params.push(`%${day.trim()}%`));
      }
    }

    // Filter by times (matches within availability summary)
    if (filters.times && filters.times.trim()) {
      const times = filters.times.split(",").filter((t) => t.trim());
      if (times.length > 0) {
        const timeConditions = times.map(() => `tp.availability_summary LIKE ?`).join(" OR ");
        query += ` AND (${timeConditions})`;
        times.forEach((time) => params.push(`%${time.trim()}%`));
      }
    }

    // Group results and sort alphabetically
    query += `
      GROUP BY 
        tp.tutor_profile_id, tp.display_name, tp.hourly_rate, 
        tp.availability_summary, tp.approval_status, tp.visibility, 
        u.full_name, u.sfsu_email
      ORDER BY tp.display_name ASC
    `;

    const [rows] = await pool.execute(query, params);
    return rows;
  },

  /**
   * Get single tutor profile by ID
   */
  async getTutorById(tutorId) {
    const query = `
      SELECT 
        tp.tutor_profile_id,
        tp.display_name,
        tp.hourly_rate,
        tp.availability_summary,
        tp.approval_status,
        tp.visibility,
        u.full_name,
        u.sfsu_email,
        GROUP_CONCAT(DISTINCT cn.code SEPARATOR ', ') as courses,
        GROUP_CONCAT(DISTINCT st.tag_name SEPARATOR ', ') as subject_tags,
        GROUP_CONCAT(DISTINCT l.language_name SEPARATOR ', ') as languages,
        MAX(tpp.file_path) as profile_photo
      FROM tutor_profile tp
      INNER JOIN user u ON tp.tutor_user_id = u.user_id
      LEFT JOIN tutor_profile_course tpc ON tp.tutor_profile_id = tpc.tutor_profile_id
      LEFT JOIN course_number cn ON tpc.course_id = cn.course_id
      LEFT JOIN tutor_profile_subject_tag tpst ON tp.tutor_profile_id = tpst.tutor_profile_id
      LEFT JOIN subject_tag st ON tpst.tag_id = st.tag_id
      LEFT JOIN tutor_profile_language tpl ON tp.tutor_profile_id = tpl.tutor_profile_id
      LEFT JOIN language l ON tpl.language_id = l.language_id
      LEFT JOIN tutor_profile_photo tpp ON tp.tutor_profile_id = tpp.tutor_profile_id AND tpp.policy_check = 'Approved'
      WHERE tp.tutor_profile_id = ?
        AND tp.approval_status = 'Approved'
        AND tp.visibility = 'Public'
      GROUP BY 
        tp.tutor_profile_id, tp.display_name, tp.hourly_rate, 
        tp.availability_summary, tp.approval_status, tp.visibility, 
        u.full_name, u.sfsu_email
    `;

    const [rows] = await pool.execute(query, [tutorId]);
    return rows[0] || null;
  },

  /**
   * Get all unique courses for dropdown
   */
  async getAllCourses() {
    const query = `
      SELECT DISTINCT code, title, department
      FROM course_number
      ORDER BY code ASC
    `;
    const [rows] = await pool.execute(query);
    return rows;
  },

  /**
   * Get all subject tags for dropdown
   */
  async getAllSubjectTags() {
    const query = `
      SELECT tag_id, tag_name, description
      FROM subject_tag
      WHERE status = 'Active'
      ORDER BY tag_name ASC
    `;
    const [rows] = await pool.execute(query);
    return rows;
  },

  /**
   * Get all languages for dropdown
   */
  async getAllLanguages() {
    const query = `
      SELECT language_id, language_name
      FROM language
      WHERE status = 'Active'
      ORDER BY language_name ASC
    `;
    const [rows] = await pool.execute(query);
    return rows;
  },

    /**
   * Create new tutor profile
   */
  async createTutorProfile(profileData) {
    const connection = await pool.getConnection();
    
    try {
      await connection.beginTransaction();

      // For demo - using existing tutor user (Darien)
      // In real app, this would come from authentication
      const tutorUserId = 2; // Darien's user_id
      const adminUserId = 1; // Alice Admin's user_id

      // 1. Insert tutor profile
      const [profileResult] = await connection.execute(
        `INSERT INTO tutor_profile 
         (tutor_user_id, display_name, hourly_rate, availability_summary, 
          approval_status, visibility, created_by, updated_by) 
         VALUES (?, ?, ?, ?, 'Pending', 'Public', ?, ?)`,
        [
          tutorUserId, 
          profileData.displayName, 
          parseFloat(profileData.hourlyRate), 
          profileData.availabilitySummary,
          adminUserId, 
          adminUserId
        ]
      );

      const tutorProfileId = profileResult.insertId;

      // 2. Handle courses
      if (profileData.courses && profileData.courses.length > 0) {
        for (const courseName of profileData.courses) {
          const [courseRows] = await connection.execute(
            'SELECT course_id FROM course_number WHERE code LIKE ?',
            [`%${courseName.trim()}%`]
          );
          
          if (courseRows.length > 0) {
            await connection.execute(
              'INSERT INTO tutor_profile_course (tutor_profile_id, course_id) VALUES (?, ?)',
              [tutorProfileId, courseRows[0].course_id]
            );
          }
        }
      }

      // 3. Handle subject tags
      if (profileData.subjects && profileData.subjects.length > 0) {
        for (const subjectName of profileData.subjects) {
          const [subjectRows] = await connection.execute(
            'SELECT tag_id FROM subject_tag WHERE tag_name LIKE ?',
            [`%${subjectName.trim()}%`]
          );
          
          if (subjectRows.length > 0) {
            await connection.execute(
              'INSERT INTO tutor_profile_subject_tag (tutor_profile_id, tag_id) VALUES (?, ?)',
              [tutorProfileId, subjectRows[0].tag_id]
            );
          }
        }
      }

      await connection.commit();
      return { success: true, tutorProfileId };

    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  },
};


module.exports = tutorModel;
