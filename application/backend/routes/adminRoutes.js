const express = require("express");
const router = express.Router();
const adminModel = require("../models/adminModel");

// Schema-enum allowlists
const TUTOR_STATUS = ["Pending", "Approved", "Rejected", "Removed"];
const REPORT_STATUS = ["New", "Under Review", "Resolved", "Dismissed"];
const ACTION_TYPES = [
  "ApproveProfile",
  "RejectProfile",
  "RemoveListing",
  "DisableUser",
  "ReenableUser",
  "RemoveMessage",
];

/**
 * GET /api/admin/pending-tutors
 */
router.get("/pending-tutors", async (_req, res) => {
  try {
    const tutors = await adminModel.getPendingTutors();
    res.status(200).json({ success: true, data: tutors });
  } catch (err) {
    console.error("Error fetching pending tutors:", err);
    res
      .status(500)
      .json({ success: false, error: "Failed to fetch pending tutors" });
  }
});

/**
 * PATCH /api/admin/tutors/:id/status
 * body: { status: 'Approved' | 'Rejected' | 'Removed', admin_user_id, notes? }
 */
router.patch("/tutors/:id/status", async (req, res) => {
  const { id } = req.params;
  const { status, admin_user_id, notes } = req.body;
  if (!status || !admin_user_id) {
    return res
      .status(400)
      .json({ success: false, error: "status and admin_user_id are required" });
  }
  if (!TUTOR_STATUS.includes(status)) {
    return res
      .status(400)
      .json({ success: false, error: "Invalid tutor status" });
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
    console.error("Error updating tutor status:", err);
    res
      .status(500)
      .json({ success: false, error: "Failed to update tutor status" });
  }
});

/**
 * GET /api/admin/reports
 */
router.get("/reports", async (_req, res) => {
  try {
    const reports = await adminModel.getReportedItems();
    res.status(200).json({ success: true, data: reports });
  } catch (err) {
    console.error("Error fetching reports:", err);
    res.status(500).json({ success: false, error: "Failed to fetch reports" });
  }
});

/**
 * PATCH /api/admin/reports/:id/status
 * body: { status: 'Under Review' | 'Resolved' | 'Dismissed', admin_user_id, notes? }
 */
router.patch("/reports/:id/status", async (req, res) => {
  const { id } = req.params;
  const { status, admin_user_id, notes } = req.body;
  if (!status || !admin_user_id) {
    return res
      .status(400)
      .json({ success: false, error: "status and admin_user_id are required" });
  }
  if (!REPORT_STATUS.includes(status)) {
    return res
      .status(400)
      .json({ success: false, error: "Invalid report status" });
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
    console.error("Error updating report status:", err);
    res
      .status(500)
      .json({ success: false, error: "Failed to update report status" });
  }
});

/**
 * GET /api/admin/actions?limit=20
 */
router.get("/actions", async (req, res) => {
  const limit = Number(req.query.limit) || 20;
  try {
    const actions = await adminModel.getActionLog(limit);
    res.status(200).json({ success: true, data: actions });
  } catch (err) {
    console.error("Error fetching admin actions:", err);
    res
      .status(500)
      .json({ success: false, error: "Failed to fetch admin actions" });
  }
});

// GET /api/admin/tutors/:id/detail
router.get("/tutors/:id/detail", async (req, res) => {
  try {
    const detail = await adminModel.getTutorProfileDetail(req.params.id);
    if (!detail)
      return res
        .status(404)
        .json({ success: false, error: "Profile not found" });
    res.status(200).json({ success: true, data: detail });
  } catch (err) {
    console.error("Error fetching tutor profile detail:", err);
    res
      .status(500)
      .json({ success: false, error: "Failed to fetch profile detail" });
  }
});

// GET /api/admin/messages/:id/detail
router.get("/messages/:id/detail", async (req, res) => {
  try {
    const detail = await adminModel.getMessageDetail(req.params.id);
    if (!detail)
      return res
        .status(404)
        .json({ success: false, error: "Message not found" });
    res.status(200).json({ success: true, data: detail });
  } catch (err) {
    console.error("Error fetching message detail:", err);
    res
      .status(500)
      .json({ success: false, error: "Failed to fetch message detail" });
  }
});

module.exports = router;
