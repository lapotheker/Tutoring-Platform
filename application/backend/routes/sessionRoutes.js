const express = require("express");
const router = express.Router();
const sessionController = require("../controllers/sessionController");

router.get("/student/:userId", sessionController.getStudentSessions);
router.get("/tutor/:userId", sessionController.getTutorSessions);
router.post("/", sessionController.createSession);
router.patch("/:sessionId/review", sessionController.updateSessionReview);

module.exports = router;
