const tutorModel = require("../models/tutorModel");

const dataController = {
  async getCourses(_req, res) {
    try {
      const courses = await tutorModel.getAllCourses();
      res.json({ success: true, data: courses });
    } catch (err) {
      console.error("Error fetching courses:", err);
      res
        .status(500)
        .json({ success: false, error: "Failed to fetch courses" });
    }
  },

  async getSubjects(_req, res) {
    try {
      const subjects = await tutorModel.getAllSubjectTags();
      res.json({ success: true, data: subjects });
    } catch (err) {
      console.error("Error fetching subjects:", err);
      res
        .status(500)
        .json({ success: false, error: "Failed to fetch subjects" });
    }
  },

  async getLanguages(_req, res) {
    try {
      const languages = await tutorModel.getAllLanguages();
      res.json({ success: true, data: languages });
    } catch (err) {
      console.error("Error fetching languages:", err);
      res
        .status(500)
        .json({ success: false, error: "Failed to fetch languages" });
    }
  },
};

module.exports = dataController;
