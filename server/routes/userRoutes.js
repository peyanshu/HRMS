const express = require("express");
const auth = require("../middleware/authMiddleware");
const {getAllManagers} = require("../controllers/userController.js");
const adminOnly = require("../middleware/adminOnlyMiddleware");

const router = express.Router();

// Intern/Employee

// Admin/Manager
router.get("/all-managers", auth, adminOnly , getAllManagers);

module.exports = router;