const Joi = require("joi");

exports.timesheetValidation = Joi.object({
  date: Joi.date().required(),
  hours: Joi.number().min(0).max(12).required(),
  status: Joi.string().valid("draft", "submitted", "approved", "weekend", "leave").required()
});

exports.updateWeeklyTimesheetValidation = Joi.array().items(exports.timesheetValidation);

exports.approveTimesheetValidation = Joi.object({
  userId: Joi.string().hex().length(24).required().messages({
    "string.base": "User ID must be a string",
    "string.hex": "User ID must be a valid ObjectId (24 hex characters)",
    "string.length": "User ID must be 24 characters long",
    "any.required": "User ID is required"
  }),

  projectId: Joi.string().hex().length(24).required().messages({
    "string.base": "Project ID must be a string",
    "string.hex": "Project ID must be a valid ObjectId (24 hex characters)",
    "string.length": "Project ID must be 24 characters long",
    "any.required": "Project ID is required"
  }),

  week: Joi.string()
    .pattern(/^\d{4}-W\d{2}$/)
    .required()
    .messages({
      "string.pattern.base": "Week must be in format YYYY-Www (e.g., 2025-W38)",
      "any.required": "Week is required"
    })
});