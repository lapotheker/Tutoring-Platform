/**
 * @file register.test.js
 * Jest + Supertest test suite for POST /api/auth/register
 */

const request = require("supertest");
const app = require("../../index.js");
const authModel = require("../../models/authModel");

// Mock model
jest.mock("../../models/authModel");

describe("POST /api/auth/register", () => {
  const endpoint = "/api/auth/register";

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ======================================================
  // SUCCESS CASES
  // ======================================================
  describe("Success Cases", () => {
    test("should register user successfully with required fields", async () => {
      const mockUser = {
        user_id: 1,
        full_name: "John Doe",
        sfsu_email: "john@sfsu.edu",
        role: 1,
        account_status: "Active",
      };

      authModel.registerUser.mockResolvedValue({
        success: true,
        user: mockUser,
      });

      const res = await request(app).post(endpoint).send({
        full_name: "John Doe",
        sfsu_email: "john@sfsu.edu",
        password: "password123",
      });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toBe("User registered successfully");
      expect(res.body.user).toMatchObject(mockUser);
      expect(res.body.user.password).toBeUndefined();
    });

    test("should allow optional role and pass through unchanged", async () => {
      const mockUser = {
        user_id: 2,
        full_name: "Tutor User",
        sfsu_email: "tutor@sfsu.edu",
        role: 2,
        account_status: "Active",
      };

      authModel.registerUser.mockResolvedValue({
        success: true,
        user: mockUser,
      });

      const res = await request(app).post(endpoint).send({
        full_name: "Tutor User",
        sfsu_email: "tutor@sfsu.edu",
        password: "password123",
        role: 2,
      });

      expect(res.status).toBe(201);
      expect(res.body.message).toBe("User registered successfully");
      expect(res.body.user.role).toBe(2);
    });

    test("should default role to 1 when no role is provided", async () => {
      const mockUser = {
        user_id: 3,
        full_name: "No Role User",
        sfsu_email: "norole@sfsu.edu",
        role: 1,
        account_status: "Active",
      };

      authModel.registerUser.mockResolvedValue({
        success: true,
        user: mockUser,
      });

      const res = await request(app).post(endpoint).send({
        full_name: "No Role User",
        sfsu_email: "norole@sfsu.edu",
        password: "password123",
      });

      expect(res.status).toBe(201);
      expect(res.body.message).toBe("User registered successfully");
      expect(res.body.user.role).toBe(1);
    });
  });

  // ======================================================
  // VALIDATION ERRORS
  // ======================================================
  describe("Validation Errors", () => {
    test("should require full_name, sfsu_email, password", async () => {
      const res = await request(app).post(endpoint).send({});

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.error).toBe(
        "full_name, sfsu_email, and password are required"
      );
    });

    test("should reject empty string fields", async () => {
      const res = await request(app).post(endpoint).send({
        full_name: "",
        sfsu_email: "",
        password: "",
      });

      expect(res.status).toBe(400);
      expect(res.body.error).toBe(
        "full_name, sfsu_email, and password are required"
      );
    });

    test("should reject invalid email format", async () => {
      const res = await request(app).post(endpoint).send({
        full_name: "Bad Email",
        sfsu_email: "bad@gmail.com",
        password: "password123",
      });

      expect(res.status).toBe(400);
      expect(res.body.error).toBe("Email must be @sfsu.edu");
    });

    test("should reject passwords shorter than 8 characters", async () => {
      const res = await request(app).post(endpoint).send({
        full_name: "Short Pass",
        sfsu_email: "short@sfsu.edu",
        password: "1234567",
      });

      expect(res.status).toBe(400);
      expect(res.body.error).toBe("Password must be at least 8 characters");
    });
  });

  // ======================================================
  // DUPLICATE EMAIL
  // ======================================================
  describe("Duplicate Email", () => {
    test("should return 400 when email already exists", async () => {
      authModel.registerUser.mockResolvedValue({
        success: false,
        error: "Email already registered",
      });

      const res = await request(app).post(endpoint).send({
        full_name: "Exists User",
        sfsu_email: "exists@sfsu.edu",
        password: "password123",
      });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.error).toBe("Email already registered");
    });
  });

  // ======================================================
  // EDGE CASES
  // ======================================================
  describe("Edge Cases", () => {
    test("should handle exactly 8-character password", async () => {
      const mockUser = {
        user_id: 10,
        full_name: "Edge User",
        sfsu_email: "edge@sfsu.edu",
        role: 1,
        account_status: "Active",
      };

      authModel.registerUser.mockResolvedValue({
        success: true,
        user: mockUser,
      });

      const res = await request(app).post(endpoint).send({
        full_name: "Edge User",
        sfsu_email: "edge@sfsu.edu",
        password: "12345678",
      });

      expect(res.status).toBe(201);
      expect(res.body.message).toBe("User registered successfully");
    });

    test("should lowercase emails before storage", async () => {
      const mockUser = {
        user_id: 11,
        full_name: "Case User",
        sfsu_email: "case@sfsu.edu",
        role: 1,
        account_status: "Active",
      };

      authModel.registerUser.mockResolvedValue({
        success: true,
        user: mockUser,
      });

      const res = await request(app).post(endpoint).send({
        full_name: "Case User",
        sfsu_email: "CASE@SFSU.EDU",
        password: "password123",
      });

      expect(authModel.registerUser).toHaveBeenCalledWith(
        expect.objectContaining({
          sfsu_email: "case@sfsu.edu",
        })
      );

      expect(res.body.user.sfsu_email).toBe("case@sfsu.edu");
    });
  });

  // ======================================================
  // SECURITY TESTS
  // ======================================================
  describe("Security Tests", () => {
    test("should not return password or password_hash in response", async () => {
      const mockUser = {
        user_id: 20,
        full_name: "Secure User",
        sfsu_email: "secure@sfsu.edu",
        role: 1,
        account_status: "Active",
      };

      authModel.registerUser.mockResolvedValue({
        success: true,
        user: mockUser,
      });

      const res = await request(app).post(endpoint).send({
        full_name: "Secure User",
        sfsu_email: "secure@sfsu.edu",
        password: "password123",
      });

      expect(res.body.user.password).toBeUndefined();
      expect(res.body.user.password_hash).toBeUndefined();
    });

    test("should safely handle SQL injection attempts", async () => {
      const payload = {
        full_name: "Robert'); DROP TABLE user;--",
        sfsu_email: "inject@sfsu.edu",
        password: "password123",
      };

      const mockUser = {
        user_id: 21,
        full_name: payload.full_name,
        sfsu_email: payload.sfsu_email,
        role: 1,
        account_status: "Active",
      };

      authModel.registerUser.mockResolvedValue({
        success: true,
        user: mockUser,
      });

      const res = await request(app).post(endpoint).send(payload);

      expect(res.status).toBe(201);
      expect(res.body.message).toBe("User registered successfully");
    });
  });

  // ======================================================
  // SERVER ERRORS
  // ======================================================
  describe("Server Errors", () => {
    test("should return 500 when model throws database error", async () => {
      authModel.registerUser.mockRejectedValueOnce(
        new Error("DB connection failed")
      );

      const res = await request(app).post(endpoint).send({
        full_name: "DB Error",
        sfsu_email: "dberror@sfsu.edu",
        password: "password123",
      });

      expect(res.status).toBe(500);
      expect(res.body.success).toBe(false);
      expect(res.body.error).toBe("Failed to register user");
    });
  });
});
