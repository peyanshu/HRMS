const express = require("express");
const {
  getWeeklyTimesheet,
  updateWeeklyTimesheet,
  getPendingTimesheets,
  approveTimesheet
} = require("../controllers/timesheetController");
const auth = require("../middleware/authMiddleware");
const validate = require("../middleware/validate.js");
const {approveTimesheetValidation, updateWeeklyTimesheetValidation} = require("../validators/timesheetValidator.js");

const router = express.Router();

// Intern/Employee
router.get("/:week", auth, getWeeklyTimesheet);   // requires ?projectId=xxxx
router.put("/:week", auth, validate(updateWeeklyTimesheetValidation), updateWeeklyTimesheet); // requires ?projectId=xxxx

// Manager
router.get("/manager/pending", auth, getPendingTimesheets);
router.put("/manager/:id/approve", auth, validate(approveTimesheetValidation), approveTimesheet);

module.exports = router;
