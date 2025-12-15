const pool = require("../db/pool");

const tutorModel = {
  /**
   * Search tutors with filters
   * Returns only approved and visible tutors
   * Uses tutor_availability table - NO availability_summary
   */
  async searchTutors(filters = {}) {
    let query = `
    SELECT DISTINCT
      tp.tutor_profile_id,
      tp.tutor_user_id,
      tp.display_name,
      tp.hourly_rate,
      tp.approval_status,
      tp.visibility,
      u.full_name,
      u.sfsu_email,
      GROUP_CONCAT(DISTINCT cn.code SEPARATOR ', ') as courses,
      GROUP_CONCAT(DISTINCT st.tag_name SEPARATOR ', ') as subject_tags,
      GROUP_CONCAT(DISTINCT l.language_name SEPARATOR ', ') as languages,
      MAX(tpp.file_path) as profile_photo,
      -- Build availability summary from availability table for backward compatibility
      GROUP_CONCAT(
        DISTINCT CONCAT(
          ta.day_of_week, 
          CASE 
            WHEN ta.time_slot IS NOT NULL THEN CONCAT(' ', ta.time_slot)
            WHEN ta.time_start IS NOT NULL AND ta.time_end IS NOT NULL 
              THEN CONCAT(' ', TIME_FORMAT(ta.time_start, '%h:%i %p'), '-', TIME_FORMAT(ta.time_end, '%h:%i %p'))
            ELSE ''
          END
        )
        SEPARATOR '; '
      ) as availability_summary
    FROM tutor_profile tp
    INNER JOIN user u ON tp.tutor_user_id = u.user_id
    LEFT JOIN tutor_profile_course tpc ON tp.tutor_profile_id = tpc.tutor_profile_id
    LEFT JOIN course_number cn ON tpc.course_id = cn.course_id
    LEFT JOIN tutor_profile_subject_tag tpst ON tp.tutor_profile_id = tpst.tutor_profile_id
    LEFT JOIN subject_tag st ON tpst.tag_id = st.tag_id
    LEFT JOIN tutor_profile_language tpl ON tp.tutor_profile_id = tpl.tutor_profile_id
    LEFT JOIN language l ON tpl.language_id = l.language_id
    LEFT JOIN tutor_profile_photo tpp ON tp.tutor_profile_id = tpp.tutor_profile_id AND tpp.policy_check = 'Approved'
    LEFT JOIN tutor_availability ta ON tp.tutor_profile_id = ta.tutor_profile_id
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

    // Free text search across multiple fields (NO availability_summary search)
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
        )
      `;
      params.push(like, like, like, like, like, like);
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

    // Filter by days - uses availability table
    if (filters.days && filters.days.trim()) {
      const days = filters.days.split(",").filter((d) => d.trim());
      if (days.length > 0) {
        const dayMapping = {
          Mon: "Monday",
          Tue: "Tuesday",
          Wed: "Wednesday",
          Thu: "Thursday",
          Fri: "Friday",
          Sat: "Saturday",
          Sun: "Sunday",
        };

        const dayConditions = days.map(() => `ta.day_of_week = ?`).join(" OR ");
        query += ` AND (${dayConditions})`;
        days.forEach((day) => {
          const fullDay = dayMapping[day.trim()] || day.trim();
          params.push(fullDay);
        });
      }
    }

    // Filter by times - uses availability table
    if (filters.times && filters.times.trim()) {
      const times = filters.times.split(",").filter((t) => t.trim());
      if (times.length > 0) {
        const timeConditions = times.map(() => `ta.time_slot = ?`).join(" OR ");
        query += ` AND (${timeConditions})`;
        times.forEach((time) => params.push(time.trim()));
      }
    }

    // Group results and sort alphabetically
    query += `
      GROUP BY 
        tp.tutor_profile_id, tp.display_name, tp.hourly_rate, 
        tp.approval_status, tp.visibility, 
        u.full_name, u.sfsu_email
      ORDER BY tp.display_name ASC
    `;

    const [rows] = await pool.execute(query, params);
    return rows;
  },

  /**
   * Get single tutor profile by ID
   * Returns structured availability data
   */
  async getTutorById(tutorId) {
    const query = `
    SELECT 
      tp.tutor_profile_id,
      tp.tutor_user_id,
      tp.display_name,
      tp.hourly_rate,
      tp.approval_status,
      tp.visibility,
      u.full_name,
      u.sfsu_email,
      GROUP_CONCAT(DISTINCT cn.code SEPARATOR ', ') as courses,
      GROUP_CONCAT(DISTINCT st.tag_name SEPARATOR ', ') as subject_tags,
      GROUP_CONCAT(DISTINCT l.language_name SEPARATOR ', ') as languages,
      MAX(tpp.file_path) as profile_photo,
      -- Build availability summary for backward compatibility
      GROUP_CONCAT(
        DISTINCT CONCAT(
          ta.day_of_week,
          CASE 
            WHEN ta.time_slot IS NOT NULL THEN CONCAT(' ', ta.time_slot)
            WHEN ta.time_start IS NOT NULL AND ta.time_end IS NOT NULL 
              THEN CONCAT(' ', TIME_FORMAT(ta.time_start, '%h:%i %p'), '-', TIME_FORMAT(ta.time_end, '%h:%i %p'))
            ELSE ''
          END
        )
        SEPARATOR '; '
      ) as availability_summary
    FROM tutor_profile tp
    INNER JOIN user u ON tp.tutor_user_id = u.user_id
    LEFT JOIN tutor_profile_course tpc ON tp.tutor_profile_id = tpc.tutor_profile_id
    LEFT JOIN course_number cn ON tpc.course_id = cn.course_id
    LEFT JOIN tutor_profile_subject_tag tpst ON tp.tutor_profile_id = tpst.tutor_profile_id
    LEFT JOIN subject_tag st ON tpst.tag_id = st.tag_id
    LEFT JOIN tutor_profile_language tpl ON tp.tutor_profile_id = tpl.tutor_profile_id
    LEFT JOIN language l ON tpl.language_id = l.language_id
    LEFT JOIN tutor_profile_photo tpp ON tp.tutor_profile_id = tpp.tutor_profile_id AND tpp.policy_check = 'Approved'
    LEFT JOIN tutor_availability ta ON tp.tutor_profile_id = ta.tutor_profile_id
    WHERE tp.tutor_profile_id = ?
      AND tp.approval_status = 'Approved'
      AND tp.visibility = 'Public'
    GROUP BY 
      tp.tutor_profile_id, tp.tutor_user_id, tp.display_name, tp.hourly_rate, 
      tp.approval_status, tp.visibility, 
      u.full_name, u.sfsu_email
  `;

    const [rows] = await pool.execute(query, [tutorId]);
    const tutor = rows[0] || null;

    // Get structured availability
    if (tutor) {
      tutor.availability = await this.getTutorAvailability(tutorId);
    }

    return tutor;
  },

  /**
   * Get structured availability for a tutor
   */
  async getTutorAvailability(tutorProfileId) {
    const query = `
      SELECT 
        availability_id,
        day_of_week,
        time_slot,
        time_start,
        time_end
      FROM tutor_availability
      WHERE tutor_profile_id = ?
      ORDER BY 
        FIELD(day_of_week, 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'),
        time_start ASC
    `;

    const [rows] = await pool.execute(query, [tutorProfileId]);
    return rows;
  },

  /**
   * Get tutor profile by tutor_user_id (any status)
   */
  async getTutorProfileByUserId(tutorUserId) {
    const [rows] = await pool.query(
      `SELECT 
         tp.tutor_profile_id,
         tp.tutor_user_id,
         tp.display_name,
         tp.hourly_rate,
         tp.approval_status,
         tp.visibility,
         tp.created_at,
         tp.updated_at
       FROM tutor_profile tp
       WHERE tp.tutor_user_id = ?
       ORDER BY tp.created_at DESC
       LIMIT 1`,
      [tutorUserId]
    );
    return rows[0] || null;
  },

  /**
   * Create new tutor profile
   * NO availability_summary in INSERT
   */
  async createTutorProfile(profileData) {
    const connection = await pool.getConnection();

    try {
      await connection.beginTransaction();

      const tutorUserId = profileData.tutorUserId; // Use the passed user ID

      // Insert tutor profile WITHOUT availability_summary
      const [profileResult] = await connection.execute(
        `INSERT INTO tutor_profile 
       (tutor_user_id, display_name, hourly_rate, 
        approval_status, visibility, created_by, updated_by) 
       VALUES (?, ?, ?, 'Pending', 'Public', ?, ?)`,
        [
          tutorUserId,
          profileData.displayName,
          parseFloat(profileData.hourlyRate),
          tutorUserId, // Use tutor's own ID as created_by
          tutorUserId, // Use tutor's own ID as updated_by
        ]
      );

      const tutorProfileId = profileResult.insertId;

      // If profile photo URL is provided, insert it
      if (profileData.profilePhotoUrl) {
        await connection.execute(
          `INSERT INTO tutor_profile_photo 
         (tutor_profile_id, file_path, caption, policy_check, uploaded_at) 
         VALUES (?, ?, ?, 'Approved', NOW())`,
          [
            tutorProfileId,
            profileData.profilePhotoUrl,
            "Profile photo",
            "Approved",
          ]
        );
      }

      // Handle courses (same as before)
      if (profileData.courses && profileData.courses.length > 0) {
        for (const courseName of profileData.courses) {
          const [courseRows] = await connection.execute(
            "SELECT course_id FROM course_number WHERE code LIKE ?",
            [`%${courseName.trim()}%`]
          );

          if (courseRows.length > 0) {
            await connection.execute(
              "INSERT INTO tutor_profile_course (tutor_profile_id, course_id) VALUES (?, ?)",
              [tutorProfileId, courseRows[0].course_id]
            );
          }
        }
      }

      // Handle subject tags (same as before)
      if (profileData.subjects && profileData.subjects.length > 0) {
        for (const subjectName of profileData.subjects) {
          const [subjectRows] = await connection.execute(
            "SELECT tag_id FROM subject_tag WHERE tag_name LIKE ?",
            [`%${subjectName.trim()}%`]
          );

          if (subjectRows.length > 0) {
            await connection.execute(
              "INSERT INTO tutor_profile_subject_tag (tutor_profile_id, tag_id) VALUES (?, ?)",
              [tutorProfileId, subjectRows[0].tag_id]
            );
          }
        }
      }

      // Handle languages
      if (profileData.languages && profileData.languages.length > 0) {
        for (const languageName of profileData.languages) {
          const [langRows] = await connection.execute(
            "SELECT language_id FROM language WHERE language_name LIKE ?",
            [`%${languageName.trim()}%`]
          );

          if (langRows.length > 0) {
            await connection.execute(
              "INSERT INTO tutor_profile_language (tutor_profile_id, language_id) VALUES (?, ?)",
              [tutorProfileId, langRows[0].language_id]
            );
          }
        }
      }

      // Handle availability - structured data
      if (profileData.availability && Array.isArray(profileData.availability)) {
        for (const avail of profileData.availability) {
          await connection.execute(
            `INSERT INTO tutor_availability 
             (tutor_profile_id, day_of_week, time_slot, time_start, time_end) 
             VALUES (?, ?, ?, ?, ?)`,
            [
              tutorProfileId,
              avail.day_of_week,
              avail.time_slot || null,
              avail.time_start || null,
              avail.time_end || null,
            ]
          );
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

  /**
   * Update existing tutor profile
   */
  async updateTutorProfile(profileId, profileData) {
    const connection = await pool.getConnection();

    try {
      await connection.beginTransaction();

      const tutorUserId = profileData.tutorUserId;

      // Update basic profile info
      await connection.execute(
        `UPDATE tutor_profile 
       SET display_name = ?, 
           hourly_rate = ?, 
           updated_by = ?,
           updated_at = NOW()
       WHERE tutor_profile_id = ?`,
        [
          profileData.displayName || null,
          parseFloat(profileData.hourlyRate),
          tutorUserId,
          profileId,
        ]
      );

      // Update profile photo if provided
      if (profileData.profilePhotoUrl) {
        // Check if photo exists
        const [existingPhoto] = await connection.execute(
          "SELECT media_id FROM tutor_profile_photo WHERE tutor_profile_id = ? LIMIT 1",
          [profileId]
        );

        if (existingPhoto.length > 0) {
          // Update existing photo
          await connection.execute(
            "UPDATE tutor_profile_photo SET file_path = ?, uploaded_at = NOW() WHERE media_id = ?",
            [profileData.profilePhotoUrl, existingPhoto[0].media_id]
          );
        } else {
          // Insert new photo
          await connection.execute(
            `INSERT INTO tutor_profile_photo 
           (tutor_profile_id, file_path, caption, policy_check, uploaded_at) 
           VALUES (?, ?, ?, 'Approved', NOW())`,
            [
              profileId,
              profileData.profilePhotoUrl,
              "Profile photo",
              "Approved",
            ]
          );
        }
      }

      // Update courses - delete old ones and insert new ones
      await connection.execute(
        "DELETE FROM tutor_profile_course WHERE tutor_profile_id = ?",
        [profileId]
      );

      if (profileData.courses && profileData.courses.length > 0) {
        for (const courseName of profileData.courses) {
          const cleanCourseName = courseName.trim();

          let [courseRows] = await connection.execute(
            "SELECT course_id FROM course_number WHERE code = ?",
            [cleanCourseName]
          );

          if (courseRows.length === 0) {
            [courseRows] = await connection.execute(
              "SELECT course_id FROM course_number WHERE REPLACE(code, ' ', '') LIKE REPLACE(?, ' ', '')",
              [`%${cleanCourseName}%`]
            );
          }

          if (courseRows.length === 0) {
            const match = cleanCourseName.match(/([A-Z]+)\s*(\d+)/i);
            if (match) {
              const [, dept, num] = match;
              [courseRows] = await connection.execute(
                "SELECT course_id FROM course_number WHERE code LIKE ? OR code LIKE ?",
                [`${dept}${num}%`, `${dept} ${num}%`]
              );
            }
          }

          if (courseRows.length > 0) {
            await connection.execute(
              "INSERT INTO tutor_profile_course (tutor_profile_id, course_id) VALUES (?, ?)",
              [profileId, courseRows[0].course_id]
            );
          }
        }
      }

      // Update subject tags
      await connection.execute(
        "DELETE FROM tutor_profile_subject_tag WHERE tutor_profile_id = ?",
        [profileId]
      );

      if (profileData.subjects && profileData.subjects.length > 0) {
        for (const subjectName of profileData.subjects) {
          const [subjectRows] = await connection.execute(
            "SELECT tag_id FROM subject_tag WHERE tag_name LIKE ?",
            [`%${subjectName.trim()}%`]
          );

          if (subjectRows.length > 0) {
            await connection.execute(
              "INSERT INTO tutor_profile_subject_tag (tutor_profile_id, tag_id) VALUES (?, ?)",
              [profileId, subjectRows[0].tag_id]
            );
          }
        }
      }

      // Update languages
      await connection.execute(
        "DELETE FROM tutor_profile_language WHERE tutor_profile_id = ?",
        [profileId]
      );

      if (profileData.languages && profileData.languages.length > 0) {
        for (const languageName of profileData.languages) {
          const [langRows] = await connection.execute(
            "SELECT language_id FROM language WHERE language_name LIKE ?",
            [`%${languageName.trim()}%`]
          );

          if (langRows.length > 0) {
            await connection.execute(
              "INSERT INTO tutor_profile_language (tutor_profile_id, language_id) VALUES (?, ?)",
              [profileId, langRows[0].language_id]
            );
          }
        }
      }

      // Update availability
      await connection.execute(
        "DELETE FROM tutor_availability WHERE tutor_profile_id = ?",
        [profileId]
      );

      if (profileData.availability && Array.isArray(profileData.availability)) {
        for (const avail of profileData.availability) {
          const dayMapping = {
            Mon: "Monday",
            Tue: "Tuesday",
            Wed: "Wednesday",
            Thu: "Thursday",
            Fri: "Friday",
            Sat: "Saturday",
            Sun: "Sunday",
          };

          const timeSlotMapping = {
            morning: {
              slot: "Morning",
              start: "09:00:00",
              end: "12:00:00",
            },
            afternoon: {
              slot: "Afternoon",
              start: "13:00:00",
              end: "17:00:00",
            },
            evening: {
              slot: "Evening",
              start: "18:00:00",
              end: "22:00:00",
            },
            Morning: {
              slot: "Morning",
              start: "09:00:00",
              end: "12:00:00",
            },
            Afternoon: {
              slot: "Afternoon",
              start: "13:00:00",
              end: "17:00:00",
            },
            Evening: {
              slot: "Evening",
              start: "18:00:00",
              end: "22:00:00",
            },
          };

          const dayOfWeek = dayMapping[avail.day] || avail.day;
          const timeInfo =
            timeSlotMapping[avail.slot] ||
            timeSlotMapping[avail.slot?.toLowerCase()];

          if (timeInfo) {
            await connection.execute(
              `INSERT INTO tutor_availability 
         (tutor_profile_id, day_of_week, time_slot, time_start, time_end) 
         VALUES (?, ?, ?, ?, ?)`,
              [
                profileId,
                dayOfWeek,
                timeInfo.slot,
                timeInfo.start,
                timeInfo.end,
              ]
            );
          }
        }
      }

      await connection.commit();
      return { tutorProfileId: profileId };
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  },

  /**
   * Update tutor availability
   */
  async updateTutorAvailability(tutorProfileId, availabilityArray) {
    const connection = await pool.getConnection();

    try {
      await connection.beginTransaction();

      // Delete existing availability
      await connection.execute(
        "DELETE FROM tutor_availability WHERE tutor_profile_id = ?",
        [tutorProfileId]
      );

      // Insert new availability
      if (availabilityArray && availabilityArray.length > 0) {
        for (const avail of availabilityArray) {
          await connection.execute(
            `INSERT INTO tutor_availability 
             (tutor_profile_id, day_of_week, time_slot, time_start, time_end) 
             VALUES (?, ?, ?, ?, ?)`,
            [
              tutorProfileId,
              avail.day_of_week,
              avail.time_slot || null,
              avail.time_start || null,
              avail.time_end || null,
            ]
          );
        }
      }

      await connection.commit();
      return { success: true };
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  },

  /**
   * Get all courses from database
   */
  async getAllCourses() {
    const query = `
      SELECT course_id, code, title, department
      FROM course_number
      ORDER BY code ASC
    `;
    const [rows] = await pool.execute(query);
    return rows;
  },

  /**
   * Get all subject tags from database
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
   * Get all languages from database
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
};

module.exports = tutorModel;
