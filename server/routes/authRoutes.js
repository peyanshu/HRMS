const express = require("express");
const router = express.Router();
const { register, login } = require("../controllers/authController.js");
const adminOnly = require("../middleware/adminOnlyMiddleware.js");
const auth = require("../middleware/authMiddleware.js");
const validate = require("../middleware/validate.js");
const {registerValidation, loginValidation} = require("../validators/authValidator.js");

// Register a new user
router.post("/register", auth, validate(registerValidation), adminOnly, register);

// Login
router.post("/login", validate(loginValidation), login);

module.exports = router;