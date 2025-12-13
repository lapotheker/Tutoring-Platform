const authModel = require("../models/authModel");

const authController = {
  async register(req, res) {
    const { full_name, sfsu_email, password, role } = req.body;
    if (!full_name || !sfsu_email || !password) {
      return res.status(400).json({
        success: false,
        error: "full_name, sfsu_email, and password are required",
      });
    }
    if (!sfsu_email.toLowerCase().endsWith("@sfsu.edu")) {
      return res
        .status(400)
        .json({ success: false, error: "Email must be @sfsu.edu" });
    }
    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        error: "Password must be at least 8 characters",
      });
    }
    try {
      const result = await authModel.registerUser({
        full_name,
        sfsu_email: sfsu_email.toLowerCase(),
        password,
        role: role || 1,
      });
      if (!result.success) return res.status(400).json(result);
      return res.status(201).json({
        success: true,
        message: "User registered successfully",
        user: result.user,
      });
    } catch (err) {
      console.error("register error:", err);
      return res
        .status(500)
        .json({ success: false, error: "Failed to register user" });
    }
  },

  async login(req, res) {
    const { sfsu_email, password } = req.body;
    if (!sfsu_email || !password) {
      return res
        .status(400)
        .json({ success: false, error: "Email and password are required" });
    }
    try {
      const result = await authModel.loginUser(
        sfsu_email.toLowerCase(),
        password
      );
      if (!result.success) return res.status(401).json(result);
      return res.status(200).json({
        success: true,
        message: "Login successful",
        user: result.user,
      });
    } catch (err) {
      console.error("login error:", err);
      return res.status(500).json({ success: false, error: "Failed to login" });
    }
  },

  async getUserByEmail(req, res) {
    const { email } = req.params;
    try {
      const user = await authModel.getUserByEmail(email.toLowerCase());
      if (!user)
        return res
          .status(404)
          .json({ success: false, error: "User not found" });
      return res.status(200).json({ success: true, user });
    } catch (err) {
      console.error("getUserByEmail error:", err);
      return res
        .status(500)
        .json({ success: false, error: "Failed to get user" });
    }
  },

  async upgradeToTutor(req, res) {
    const { user_id } = req.body;
    if (!user_id)
      return res
        .status(400)
        .json({ success: false, error: "user_id is required" });
    try {
      const result = await authModel.upgradeToTutor(user_id);
      if (!result.success) return res.status(400).json(result);
      return res.status(200).json({
        success: true,
        message: result.alreadyTutor
          ? "User is already a tutor"
          : "Upgraded to tutor successfully",
      });
    } catch (err) {
      console.error("upgradeToTutor error:", err);
      return res
        .status(500)
        .json({ success: false, error: "Failed to upgrade to tutor" });
    }
  },
};

module.exports = authController;
