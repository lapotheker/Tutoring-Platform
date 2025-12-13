const messageModel = require("../models/messageModel");

const messageController = {
  async sendMessage(req, res) {
    const { sender_user_id, recipient_user_id, message } = req.body;

    if (!sender_user_id || !recipient_user_id || !message) {
      return res.status(400).json({
        success: false,
        error: "sender_user_id, recipient_user_id, and message are required",
      });
    }
    if (!message.trim()) {
      return res.status(400).json({
        success: false,
        error: "Message cannot be empty",
      });
    }

    try {
      const result = await messageModel.createMessage({
        senderUserId: sender_user_id,
        recipientUserId: recipient_user_id,
        messageText: message,
      });

      if (result.alreadyExists) {
        return res.status(400).json({
          success: false,
          error:
            "You have already sent a message to this tutor. Only one message per tutor is allowed.",
        });
      }

      return res.status(201).json({
        success: true,
        message: "Message sent successfully",
        data: result.message,
      });
    } catch (error) {
      console.error("Error sending message:", error);
      if (
        error.message === "Sender not found" ||
        error.message === "Recipient not found"
      ) {
        return res.status(404).json({ success: false, error: error.message });
      }
      return res.status(500).json({
        success: false,
        error: "Failed to send message",
      });
    }
  },

  async getMessagesForUser(req, res) {
    const { userId } = req.params;
    if (!userId) {
      return res.status(400).json({
        success: false,
        error: "userId is required",
      });
    }
    try {
      const messages = await messageModel.getMessagesForUser(userId);
      return res.status(200).json({ success: true, data: messages });
    } catch (error) {
      console.error("Error fetching messages:", error);
      return res.status(500).json({
        success: false,
        error: "Failed to fetch messages",
      });
    }
  },

  async reportMessage(req, res) {
    const { messageId } = req.params;
    const { reporter_user_id, reason, details } = req.body;

    if (!messageId || !reporter_user_id || !reason) {
      return res.status(400).json({
        success: false,
        error: "messageId, reporter_user_id, and reason are required",
      });
    }

    try {
      const result = await messageModel.reportMessage({
        messageId,
        reporterUserId: reporter_user_id,
        reason,
        details,
      });
      return res.status(201).json({
        success: true,
        message: "Message reported successfully",
        report_id: result.reportId,
      });
    } catch (error) {
      console.error("Error reporting message:", error);
      if (error.code === "INVALID_REASON") {
        return res
          .status(400)
          .json({ success: false, error: "Invalid reason" });
      }
      if (error.code === "NOT_FOUND") {
        return res
          .status(404)
          .json({ success: false, error: "Message not found" });
      }
      if (error.code === "ALREADY_REPORTED") {
        return res.status(400).json({
          success: false,
          error: "You have already reported this message",
        });
      }
      return res.status(500).json({
        success: false,
        error: "Failed to report message",
      });
    }
  },
};

module.exports = messageController;
