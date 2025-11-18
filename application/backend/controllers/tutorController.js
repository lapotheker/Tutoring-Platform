const tutorModel = require("../models/tutorModel");

const tutorController = {
  /**
   * Search tutors with optional filters
   * GET /api/tutors?course=CSC&search=John&subject=Math&language=English&minRate=0&maxRate=50&days=Mon,Tue&times=Morning
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
   * GET /api/tutors/:id
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
   * Create new tutor profile
   * POST /api/tutors/profile
   */
  async createTutorProfile(req, res) {
    try {
      const profileData = {
        displayName: req.body.fullName, // Map from frontend's fullName to display_name
        hourlyRate: req.body.hourlyRate,
        availabilitySummary: req.body.availability,
        courses: req.body.courses ? req.body.courses.split(',').map(c => c.trim()) : [],
        subjects: req.body.subjects ? req.body.subjects.split(',').map(s => s.trim()) : [],
        bio: req.body.bio,
        mode: req.body.mode
      };

      // Validate required fields
      if (!profileData.displayName || !profileData.hourlyRate || !profileData.availabilitySummary) {
        return res.status(400).json({
          success: false,
          error: "Missing required fields: fullName, hourlyRate, availability"
        });
      }

      const result = await tutorModel.createTutorProfile(profileData);

      res.json({
        success: true,
        message: "Tutor profile submitted for admin approval",
        tutorProfileId: result.tutorProfileId
      });

    } catch (error) {
      console.error("Error in createTutorProfile controller:", error);
      res.status(500).json({
        success: false,
        error: "Failed to create tutor profile"
      });
    }
  },
};

module.exports = tutorController;
