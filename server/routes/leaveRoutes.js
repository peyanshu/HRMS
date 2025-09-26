const express = require("express");
const { applyLeave, getMyLeaves, getAllLeaves } = require("../controllers/leaveController");
const auth = require("../middleware/authMiddleware");
const adminOnly = require("../middleware/adminOnlyMiddleware");
const validate = require("../middleware/validate.js");
const {leaveValidation} = require("../validators/leaveValidator.js");

const router = express.Router();

// Intern/Employee
router.post("/apply", auth, validate(leaveValidation), applyLeave);
router.get("/my", auth, getMyLeaves);

// Admin/Manager
router.get("/all", auth, getAllLeaves);

module.exports = router;
