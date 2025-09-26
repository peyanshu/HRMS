module.exports = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false }); // ✅ show all issues
    if (error) {
      return res.status(400).json({ message: error.details.map(d => d.message).join(", ") });
    }
    next();
  };
};

