const tutorModel = require("../models/tutorModel");

const tutorController = {
  /**
   * Search tutors with optional filters
   */
  async searchTutors(req, res) {
    try {
      const filters = {
        course: req.query.course,
        search: req.query.search,
        subject: req.query.subject,
        language: req.query.language,
        minRate: req.query.minRate,
        maxRate: req.query.maxRate,
        days: req.query.days,
        times: req.query.times,
      };

      const tutors = await tutorModel.searchTutors(filters);

      res.json({
        success: true,
        count: tutors.length,
        data: tutors,
      });
    } catch (error) {
      console.error("Error in searchTutors controller:", error);
      res.status(500).json({
        success: false,
        error: "Failed to search tutors",
      });
    }
  },

  /**
   * Get single tutor by ID
   */
  async getTutorById(req, res) {
    try {
      const tutorId = req.params.id;
      const tutor = await tutorModel.getTutorById(tutorId);

      if (!tutor) {
        return res.status(404).json({
          success: false,
          error: "Tutor not found",
        });
      }

      res.json({
        success: true,
        data: tutor,
      });
    } catch (error) {
      console.error("Error in getTutorById controller:", error);
      res.status(500).json({
        success: false,
        error: "Failed to get tutor",
      });
    }
  },

  /**
   * Get tutor profile by user id (any status)
   * GET /api/tutors/profile/by-user/:userId
   */
  async getTutorProfileByUser(req, res) {
    try {
      const userId = req.params.userId;
      const profile = await tutorModel.getTutorProfileByUserId(userId);

      if (!profile) {
        return res.status(404).json({
          success: false,
          error: "Tutor profile not found",
        });
      }

      res.json({
        success: true,
        data: profile,
      });
    } catch (error) {
      console.error("Error in getTutorProfileByUser controller:", error);
      res.status(500).json({
        success: false,
        error: "Failed to get tutor profile",
      });
    }
  },

  /**
   * Create new tutor profile
   * POST /api/tutors/profile
   */
  async createTutorProfile(req, res) {
    try {
      const profileData = {
        tutorUserId: req.body.tutorUserId,
        displayName: req.body.fullName,
        hourlyRate: req.body.hourlyRate,
        availability: req.body.availability, // Now an array
        profilePhotoUrl: req.body.profilePhotoUrl,
        courses: req.body.courses
          ? req.body.courses.split(",").map((c) => c.trim())
          : [],
        subjects: req.body.subjects
          ? req.body.subjects.split(",").map((s) => s.trim())
          : [],
        languages: req.body.languages
          ? req.body.languages.split(",").map((l) => l.trim())
          : [],
        bio: req.body.bio,
        mode: req.body.mode,
      };

      // Validate required fields
      if (
        !profileData.tutorUserId ||
        !profileData.displayName ||
        !profileData.hourlyRate ||
        !profileData.availability
      ) {
        return res.status(400).json({
          success: false,
          error:
            "Missing required fields: tutorUserId, fullName, hourlyRate, availability",
        });
      }

      const result = await tutorModel.createTutorProfile(profileData);

      res.json({
        success: true,
        message: "Tutor profile submitted for admin approval",
        tutorProfileId: result.tutorProfileId,
      });
    } catch (error) {
      console.error("Error in createTutorProfile controller:", error);
      res.status(500).json({
        success: false,
        error: "Failed to create tutor profile",
      });
    }
  },

  /**
   * Update existing tutor profile
   * PUT /api/tutors/profile/:profileId
   */
  async updateTutorProfile(req, res) {
    try {
      const { profileId } = req.params;
      const profileData = {
        tutorUserId: req.body.tutorUserId,
        displayName: req.body.fullName,
        hourlyRate: req.body.hourlyRate,
        profilePhotoUrl: req.body.profilePhotoUrl,
        courses: req.body.courses
          ? req.body.courses.split(",").map((c) => c.trim())
          : [],
        subjects: req.body.subjects
          ? req.body.subjects.split(",").map((s) => s.trim())
          : [],
        languages: req.body.languages
          ? req.body.languages.split(",").map((l) => l.trim())
          : [],
        availability: req.body.availability, // Array of {day, slot} objects
      };

      // Validate required fields
      if (!profileData.tutorUserId || !profileData.hourlyRate) {
        return res.status(400).json({
          success: false,
          error: "Missing required fields: tutorUserId, hourlyRate",
        });
      }

      const result = await tutorModel.updateTutorProfile(
        profileId,
        profileData
      );

      res.json({
        success: true,
        message: "Tutor profile updated successfully",
        tutorProfileId: result.tutorProfileId,
      });
    } catch (error) {
      console.error("Error in updateTutorProfile controller:", error);
      res.status(500).json({
        success: false,
        error: "Failed to update tutor profile",
      });
    }
  },
};

module.exports = tutorController;
