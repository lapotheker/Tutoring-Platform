const express = require("express");
const router = express.Router();
const authModel = require("../models/authModel");

/**
 * POST /api/auth/register
 * Register a new user
 */
router.post("/register", async (req, res) => {
  const { full_name, sfsu_email, password, role } = req.body;

  // Validation
  if (!full_name || !sfsu_email || !password) {
    return res.status(400).json({
      success: false,
      error: "full_name, sfsu_email, and password are required",
    });
  }

  // Validate SFSU email
  if (!sfsu_email.toLowerCase().endsWith("@sfsu.edu")) {
    return res.status(400).json({
      success: false,
      error: "Email must be an @sfsu.edu address",
    });
  }

  // Validate password length
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
      role: role || 1, // Default to Student
    });

    if (!result.success) {
      return res.status(400).json(result);
    }

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: result.user,
    });
  } catch (error) {
    console.error("Error in register route:", error);
    return res.status(500).json({
      success: false,
      error: "Failed to register user",
    });
  }
});

/**
 * POST /api/auth/login
 * Login user
 */
router.post("/login", async (req, res) => {
  const { sfsu_email, password } = req.body;

  // Validation
  if (!sfsu_email || !password) {
    return res.status(400).json({
      success: false,
      error: "Email and password are required",
    });
  }

  try {
    const result = await authModel.loginUser(
      sfsu_email.toLowerCase(),
      password
    );

    if (!result.success) {
      return res.status(401).json(result);
    }

    return res.status(200).json({
      success: true,
      message: "Login successful",
      user: result.user,
    });
  } catch (error) {
    console.error("Error in login route:", error);
    return res.status(500).json({
      success: false,
      error: "Failed to login",
    });
  }
});

/**
 * GET /api/auth/user/:email
 * Get user by email
 */
router.get("/user/:email", async (req, res) => {
  const { email } = req.params;

  try {
    const user = await authModel.getUserByEmail(email.toLowerCase());

    if (!user) {
      return res.status(404).json({
        success: false,
        error: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      user: user,
    });
  } catch (error) {
    console.error("Error getting user:", error);
    return res.status(500).json({
      success: false,
      error: "Failed to get user",
    });
  }
});

/**
 * PATCH /api/auth/upgrade-to-tutor
 * body: { user_id }
 */
router.patch("/upgrade-to-tutor", async (req, res) => {
  const { user_id } = req.body;

  if (!user_id) {
    return res.status(400).json({
      success: false,
      error: "user_id is required",
    });
  }

  try {
    const result = await authModel.upgradeToTutor(user_id);

    if (!result.success) {
      return res.status(400).json(result);
    }

    return res.status(200).json({
      success: true,
      message: result.alreadyTutor
        ? "User is already a tutor"
        : "Upgraded to tutor successfully",
    });
  } catch (error) {
    console.error("Error upgrading to tutor:", error);
    return res.status(500).json({
      success: false,
      error: "Failed to upgrade to tutor",
    });
  }
});

module.exports = router;
