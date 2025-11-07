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
};

module.exports = tutorController;
