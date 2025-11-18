const express = require("express");
const router = express.Router();
const tutorController = require("../controllers/tutorController");

// GET /api/tutors - Search tutors with optional filters
router.get("/", tutorController.searchTutors);

// GET /api/tutors/:id - Get single tutor profile
router.get("/:id", tutorController.getTutorById);


// POST /api/tutors/profile - Create new tutor profile
router.post("/profile", tutorController.createTutorProfile);

module.exports = router;

