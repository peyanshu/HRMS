const Joi = require("joi");

exports.leaveValidation = Joi.object({
  from_date: Joi.date().required(),
  to_date: Joi.date().min(Joi.ref("from_date")).required(),
  leave_type: Joi.string().valid("paid", "unpaid", "sick", "casual").required(),
  reason: Joi.string().max(200).allow("")
});
