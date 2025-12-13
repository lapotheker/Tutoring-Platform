const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");

router.get("/pending-tutors", adminController.getPendingTutors);
router.patch("/tutors/:id/status", adminController.updateTutorStatus);
router.get("/reports", adminController.getReports);
router.patch("/reports/:id/status", adminController.updateReportStatus);
router.get("/actions", adminController.getActions);
router.get("/tutors/:id/detail", adminController.getTutorProfileDetail);
router.get("/messages/:id/detail", adminController.getMessageDetail);

module.exports = router;
