const express = require("express");
const router = express.Router();
const sessionModel = require("../models/sessionModel");

/**
 * GET /api/sessions/student/:userId
 * Get all sessions for a student
 */
router.get("/student/:userId", async (req, res) => {
  const { userId } = req.params;

  if (!userId) {
    return res.status(400).json({
      success: false,
      error: "userId is required",
    });
  }

  try {
    const sessions = await sessionModel.getStudentSessions(userId);
    return res.status(200).json({
      success: true,
      data: sessions,
    });
  } catch (error) {
    console.error("Error fetching sessions:", error);
    return res.status(500).json({
      success: false,
      error: "Failed to fetch sessions",
    });
  }
});

/**
 * GET /api/sessions/tutor/:userId
 * Get all sessions for a tutor
 */
router.get("/tutor/:userId", async (req, res) => {
  const { userId } = req.params;

  if (!userId) {
    return res.status(400).json({
      success: false,
      error: "userId is required",
    });
  }

  try {
    const sessions = await sessionModel.getTutorSessions(userId);
    return res.status(200).json({
      success: true,
      data: sessions,
    });
  } catch (error) {
    console.error("Error fetching tutor sessions:", error);
    return res.status(500).json({
      success: false,
      error: "Failed to fetch sessions",
    });
  }
});

/**
 * POST /api/sessions
 * Create a new session (for future use)
 */
router.post("/", async (req, res) => {
  const sessionData = req.body;

  if (
    !sessionData.student_user_id ||
    !sessionData.tutor_user_id ||
    !sessionData.course_info ||
    !sessionData.session_datetime
  ) {
    return res.status(400).json({
      success: false,
      error: "Missing required fields",
    });
  }

  try {
    const result = await sessionModel.createSession(sessionData);
    return res.status(201).json({
      success: true,
      message: "Session created successfully",
      data: result,
    });
  } catch (error) {
    console.error("Error creating session:", error);
    return res.status(500).json({
      success: false,
      error: "Failed to create session",
    });
  }
});

module.exports = router;
