const pool = require("../db/pool");
const bcrypt = require("bcrypt");

const authModel = {
  /**
   * Register a new user
   */
  async registerUser(userData) {
    const { full_name, sfsu_email, password, role = 1 } = userData; // Default role is Student (1)

    try {
      // Check if user already exists
      const [existing] = await pool.query(
        "SELECT user_id FROM user WHERE sfsu_email = ?",
        [sfsu_email]
      );

      if (existing.length > 0) {
        return { success: false, error: "Email already registered" };
      }

      // Hash password
      const password_hash = await bcrypt.hash(password, 10);

      // Insert new user
      const [result] = await pool.query(
        `INSERT INTO user (full_name, sfsu_email, password_hash, role, account_status)
         VALUES (?, ?, ?, ?, 'Active')`,
        [full_name, sfsu_email, password_hash, role]
      );

      // Return user data (without password)
      const [newUser] = await pool.query(
        `SELECT user_id, full_name, sfsu_email, role, account_status, created_at
         FROM user WHERE user_id = ?`,
        [result.insertId]
      );

      return { success: true, user: newUser[0] };
    } catch (error) {
      console.error("Error registering user:", error);
      throw error;
    }
  },

  /**
   * Login user
   */
  async loginUser(sfsu_email, password) {
    try {
      // Get user by email
      const [users] = await pool.query(
        `SELECT user_id, full_name, sfsu_email, password_hash, role, account_status
         FROM user WHERE sfsu_email = ?`,
        [sfsu_email]
      );

      if (users.length === 0) {
        return { success: false, error: "Invalid email or password" };
      }

      const user = users[0];

      // Check if account is active
      if (user.account_status !== "Active") {
        return { success: false, error: "Account is disabled" };
      }

      // Verify password
      const passwordMatch = await bcrypt.compare(password, user.password_hash);

      if (!passwordMatch) {
        return { success: false, error: "Invalid email or password" };
      }

      // Update last login
      await pool.query(
        "UPDATE user SET last_login_at = NOW() WHERE user_id = ?",
        [user.user_id]
      );

      // Return user data (without password_hash)
      const { password_hash, ...userWithoutPassword } = user;
      return { success: true, user: userWithoutPassword };
    } catch (error) {
      console.error("Error logging in:", error);
      throw error;
    }
  },

  /**
   * Get user by email
   */
  async getUserByEmail(sfsu_email) {
    try {
      const [users] = await pool.query(
        `SELECT user_id, full_name, sfsu_email, role, account_status, created_at, last_login_at
         FROM user WHERE sfsu_email = ?`,
        [sfsu_email]
      );

      if (users.length === 0) {
        return null;
      }

      return users[0];
    } catch (error) {
      console.error("Error getting user by email:", error);
      throw error;
    }
  },

  /**
   * Upgrade a user to tutor role (role = 2)
   */
  async upgradeToTutor(userId) {
    const [users] = await pool.query(
      "SELECT user_id, role FROM user WHERE user_id = ?",
      [userId]
    );

    if (users.length === 0) {
      return { success: false, error: "User not found" };
    }

    const user = users[0];

    // Prevent changing admins
    if (user.role === 3) {
      return { success: false, error: "Admins cannot be converted to tutor" };
    }

    // Already tutor
    if (user.role === 2) {
      return { success: true, alreadyTutor: true };
    }

    await pool.query("UPDATE user SET role = 2 WHERE user_id = ?", [userId]);
    return { success: true, upgraded: true };
  },
};

module.exports = authModel;
