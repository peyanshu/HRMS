const mongoose = require("mongoose");

const timesheetSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    project: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Project",
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    hours: {
        type: Number,
        min: 0,
        max: 12,
        required: true
    },
    status: {
        type: String,
        enum: ["draft", "submitted", "approved", "weekend", "leave"],
        default: "draft"
    },
    week: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model("Timesheet", timesheetSchema);