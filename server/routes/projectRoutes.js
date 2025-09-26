const express = require("express");
const auth = require("../middleware/authMiddleware");
const adminOnly = require("../middleware/adminOnlyMiddleware");
const { createProject, getAllProjects, updateProject, deleteProject } = require("../controllers/projectController");
const validate = require("../middleware/validate.js");
const {projectValidation} = require("../validators/projectValidator");
const router = express.Router();

// Admin: Create project
router.post("/", auth, adminOnly,validate(projectValidation), createProject);

// Get all projects
router.get("/", auth, getAllProjects);

// Admin: Update project
router.put("/:id", auth, adminOnly, validate(projectValidation), updateProject);

// Admin: Delete project
router.delete("/:id", auth, adminOnly, deleteProject)

module.exports = router;
