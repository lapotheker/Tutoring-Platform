const express = require("express");
const router = express.Router();
const dataController = require("../controllers/dataController");

router.get("/courses", dataController.getCourses);
router.get("/subjects", dataController.getSubjects);
router.get("/languages", dataController.getLanguages);

module.exports = router;
