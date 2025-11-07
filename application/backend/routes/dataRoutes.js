const express = require("express");
const router = express.Router();
const tutorModel = require("../models/tutorModel");

// GET /api/data/courses - Get all courses for dropdown
router.get("/courses", async (req, res) => {
  try {
    const courses = await tutorModel.getAllCourses();
    res.json({ success: true, data: courses });
  } catch (error) {
    console.error("Error fetching courses:", error);
    res.status(500).json({ success: false, error: "Failed to fetch courses" });
  }
});

// GET /api/data/subjects - Get all subject tags for dropdown
router.get("/subjects", async (req, res) => {
  try {
    const subjects = await tutorModel.getAllSubjectTags();
    res.json({ success: true, data: subjects });
  } catch (error) {
    console.error("Error fetching subjects:", error);
    res.status(500).json({ success: false, error: "Failed to fetch subjects" });
  }
});

// GET /api/data/languages - Get all languages for dropdown
router.get("/languages", async (req, res) => {
  try {
    const languages = await tutorModel.getAllLanguages();
    res.json({ success: true, data: languages });
  } catch (error) {
    console.error("Error fetching languages:", error);
    res
      .status(500)
      .json({ success: false, error: "Failed to fetch languages" });
  }
});

module.exports = router;
