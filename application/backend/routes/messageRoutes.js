const express = require("express");
const router = express.Router();
const messageController = require("../controllers/messageController");

// POST /api/messages
router.post("/", messageController.sendMessage);

// GET /api/messages/user/:userId
router.get("/user/:userId", messageController.getMessagesForUser);

// POST /api/messages/:messageId/report
router.post("/:messageId/report", messageController.reportMessage);

module.exports = router;
