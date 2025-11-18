const express = require("express");
const router = express.Router();
const messageController = require("../controllers/messageController");

// POST /api/messages  -> create a new in-site message
router.post("/", messageController.sendMessage);

// GET /api/messages/user/:userId  -> all messages for a specific user
router.get("/user/:userId", messageController.getMessagesForUser);

// POST /api/messages/:messageId/report  -> report a message
router.post("/:messageId/report", messageController.reportMessage);

module.exports = router;
