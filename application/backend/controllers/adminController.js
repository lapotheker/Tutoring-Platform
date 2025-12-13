const adminModel = require("../models/adminModel");

const adminController = {
  async getPendingTutors(_req, res) {
    try {
      const tutors = await adminModel.getPendingTutors();
      res.status(200).json({ success: true, data: tutors });
    } catch (err) {
      console.error("getPendingTutors error:", err);
      res
        .status(500)
        .json({ success: false, error: "Failed to fetch pending tutors" });
    }
  },

  async updateTutorStatus(req, res) {
    const { id } = req.params;
    const { status, admin_user_id, notes } = req.body;
    if (!status || !admin_user_id) {
      return res.status(400).json({
        success: false,
        error: "status and admin_user_id are required",
      });
    }
    try {
      await adminModel.updateTutorStatus(id, status, admin_user_id);
      await adminModel.logAction({
        action_type:
          status === "Approved"
            ? "ApproveProfile"
            : status === "Rejected"
            ? "RejectProfile"
            : "RemoveListing",
        target_type: "Tutor Profile",
        target_id: id,
        reason_notes: notes,
        performed_by: admin_user_id,
      });
      res.status(200).json({ success: true });
    } catch (err) {
      console.error("updateTutorStatus error:", err);
      res
        .status(500)
        .json({ success: false, error: "Failed to update tutor status" });
    }
  },

  async getReports(_req, res) {
    try {
      const reports = await adminModel.getReportedItems();
      res.status(200).json({ success: true, data: reports });
    } catch (err) {
      console.error("getReports error:", err);
      res
        .status(500)
        .json({ success: false, error: "Failed to fetch reports" });
    }
  },

  async updateReportStatus(req, res) {
    const { id } = req.params;
    const { status, admin_user_id, notes } = req.body;
    if (!status || !admin_user_id) {
      return res.status(400).json({
        success: false,
        error: "status and admin_user_id are required",
      });
    }
    try {
      await adminModel.updateReportStatus(id, status, admin_user_id, notes);
      await adminModel.logAction({
        action_type: status === "Resolved" ? "ResolveReport" : "UpdateReport",
        target_type: "In-Site Message",
        target_id: id,
        reason_notes: notes,
        performed_by: admin_user_id,
        originating_report_id: id,
      });
      res.status(200).json({ success: true });
    } catch (err) {
      console.error("updateReportStatus error:", err);
      res
        .status(500)
        .json({ success: false, error: "Failed to update report status" });
    }
  },

  async getActions(req, res) {
    const limit = Number(req.query.limit) || 20;
    try {
      const actions = await adminModel.getActionLog(limit);
      res.status(200).json({ success: true, data: actions });
    } catch (err) {
      console.error("getActions error:", err);
      res
        .status(500)
        .json({ success: false, error: "Failed to fetch admin actions" });
    }
  },

  async getTutorProfileDetail(req, res) {
    try {
      const detail = await adminModel.getTutorProfileDetail(req.params.id);
      if (!detail)
        return res
          .status(404)
          .json({ success: false, error: "Profile not found" });
      res.status(200).json({ success: true, data: detail });
    } catch (err) {
      console.error("getTutorProfileDetail error:", err);
      res
        .status(500)
        .json({ success: false, error: "Failed to fetch profile detail" });
    }
  },

  async getMessageDetail(req, res) {
    try {
      const detail = await adminModel.getMessageDetail(req.params.id);
      if (!detail)
        return res
          .status(404)
          .json({ success: false, error: "Message not found" });
      res.status(200).json({ success: true, data: detail });
    } catch (err) {
      console.error("getMessageDetail error:", err);
      res
        .status(500)
        .json({ success: false, error: "Failed to fetch message detail" });
    }
  },
};

module.exports = adminController;
