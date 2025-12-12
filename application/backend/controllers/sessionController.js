const sessionModel = require("../models/sessionModel");

const sessionController = {
  async getStudentSessions(req, res) {
    const { userId } = req.params;
    if (!userId)
      return res
        .status(400)
        .json({ success: false, error: "userId is required" });
    try {
      const sessions = await sessionModel.getStudentSessions(userId);
      return res.status(200).json({ success: true, data: sessions });
    } catch (err) {
      console.error("getStudentSessions error:", err);
      return res
        .status(500)
        .json({ success: false, error: "Failed to fetch sessions" });
    }
  },

  async getTutorSessions(req, res) {
    const { userId } = req.params;
    if (!userId)
      return res
        .status(400)
        .json({ success: false, error: "userId is required" });
    try {
      const sessions = await sessionModel.getTutorSessions(userId);
      return res.status(200).json({ success: true, data: sessions });
    } catch (err) {
      console.error("getTutorSessions error:", err);
      return res
        .status(500)
        .json({ success: false, error: "Failed to fetch sessions" });
    }
  },

  async createSession(req, res) {
    const sessionData = req.body;
    if (
      !sessionData.student_user_id ||
      !sessionData.tutor_user_id ||
      !sessionData.course_info ||
      !sessionData.session_datetime
    ) {
      return res
        .status(400)
        .json({ success: false, error: "Missing required fields" });
    }
    try {
      const result = await sessionModel.createSession(sessionData);
      return res.status(201).json({
        success: true,
        message: "Session created successfully",
        data: result,
      });
    } catch (err) {
      console.error("createSession error:", err);
      return res
        .status(500)
        .json({ success: false, error: "Failed to create session" });
    }
  },

  async updateSessionReview(req, res) {
    const { sessionId } = req.params;
    const { rating, notes } = req.body;
    try {
      await sessionModel.updateSessionReview(sessionId, rating, notes);
      return res
        .status(200)
        .json({ success: true, message: "Review updated successfully" });
    } catch (err) {
      console.error("updateSessionReview error:", err);
      return res
        .status(500)
        .json({ success: false, error: "Failed to update review" });
    }
  },
};

module.exports = sessionController;
