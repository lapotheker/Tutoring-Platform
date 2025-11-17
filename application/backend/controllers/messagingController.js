const messageModel = require("../models/messageModel");

const messageController = {

  async sendMessage(req, res) {
    try {
      const { sender_user_id, recipient_user_id, message } = req.body;

      if (!sender_user_id || !recipient_user_id || !message) {
        return res.status(400).json({
          success: false,
          error:
            "sender_user_id, recipient_user_id, and message are all required",
        });
      }

      const trimmedMessage = message.trim();
      if (!trimmedMessage) {
        return res.status(400).json({
          success: false,
          error: "message must not be empty",
        });
      }

      const result = await messageModel.createMessage({
        senderUserId: Number(sender_user_id),
        recipientUserId: Number(recipient_user_id),
        messageText: trimmedMessage,
      });

      if (result.alreadyExists) {
        // One-round messaging doesn't create a second row
        return res.status(409).json({
          success: false,
          error:
            "A message between this student and tutor already exists (one-round messaging rule).",
          data: result.existingMessage,
        });
      }

      return res.status(201).json({
        success: true,
        data: result.message,
      });
    } catch (error) {
      console.error("Error in sendMessage controller:", error);
      return res.status(500).json({
        success: false,
        error: "Failed to send message",
      });
    }
  },

  /**
   * GET /api/messages/user/:userId
   *
   * Returns all messages where the user is either sender or recipient,
   * useful for a "My Messages" section on the dashboard.
   */
  async getMessagesForUser(req, res) {
    try {
      const userId = req.params.userId;

      if (!userId) {
        return res.status(400).json({
          success: false,
          error: "userId parameter is required",
        });
      }

      const messages = await messageModel.getMessagesForUser(Number(userId));

      return res.json({
        success: true,
        count: messages.length,
        data: messages,
      });
    } catch (error) {
      console.error("Error in getMessagesForUser controller:", error);
      return res.status(500).json({
        success: false,
        error: "Failed to fetch messages",
      });
    }
  },

  /**
   * POST /api/messages/:messageId/report
   *
   * Body JSON:
   *   {
   *     "report_reason": "Harassment/Abuse",
   *     "details": "Optional free-text explanation",
   *     "created_by": 123      // user_id of the reporter
   *   }
   *
   * report_reason MUST match one of the ENUM values in schema.sql:
   *   'Harassment/Abuse', 'Inappropriate Content',
   *   'Spam/Solicitation', 'Privacy/Safety', 'Other'
   */
  async reportMessage(req, res) {
    try {
      const messageId = req.params.messageId;
      const { report_reason, details, created_by } = req.body;

      if (!messageId || !report_reason || !created_by) {
        return res.status(400).json({
          success: false,
          error:
            "messageId (path), report_reason, and created_by are all required",
        });
      }

      const { reportId } = await messageModel.reportMessage({
        messageId: Number(messageId),
        reportReason: report_reason,
        details: details || null,
        createdBy: Number(created_by),
      });

      return res.status(201).json({
        success: true,
        report_id: reportId,
      });
    } catch (error) {
      console.error("Error in reportMessage controller:", error);
      return res.status(500).json({
        success: false,
        error: "Failed to report message",
      });
    }
  },
};

module.exports = messageController;
