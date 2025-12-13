const express = require("express");
const router = express.Router();
const tutorController = require("../controllers/tutorController");

// GET /api/tutors - Search tutors with optional filters
router.get("/", tutorController.searchTutors);

// GET get tutor profile by user id (any status)
router.get("/profile/by-user/:userId", tutorController.getTutorProfileByUser);

// GET /api/tutors/:id - Get single tutor profile (approved/public)
router.get("/:id", tutorController.getTutorById);

// POST /api/tutors/profile - Create new tutor profile
router.post("/profile", tutorController.createTutorProfile);

module.exports = router;
