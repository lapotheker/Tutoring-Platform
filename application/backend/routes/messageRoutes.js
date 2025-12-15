const express = require("express");
const router = express.Router();
const messageController = require("../controllers/messageController");

// POST /api/messages
router.post("/", messageController.sendMessage);

// POST /api/messages/reply - ADD THIS
router.post("/reply", messageController.replyToMessage);

// GET /api/messages/user/:userId
router.get("/user/:userId", messageController.getMessagesForUser);

// GET /api/messages/sent/:userId
router.get("/sent/:userId", messageController.getSentMessages);

// GET /api/messages/received/:userId
router.get("/received/:userId", messageController.getReceivedMessages);

// GET /api/messages/tutor/sent/:userId
router.get("/tutor/sent/:userId", messageController.getTutorSentMessages);

// GET /api/messages/tutor/received/:userId
router.get(
  "/tutor/received/:userId",
  messageController.getTutorReceivedMessages
);

// POST /api/messages/:messageId/report
router.post("/:messageId/report", messageController.reportMessage);

module.exports = router;
