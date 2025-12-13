const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

router.post("/register", authController.register);
router.post("/login", authController.login);
router.get("/user/:email", authController.getUserByEmail);
router.patch("/upgrade-to-tutor", authController.upgradeToTutor);

module.exports = router;
