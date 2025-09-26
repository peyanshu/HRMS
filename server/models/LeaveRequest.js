const mongoose = require("mongoose");

const leaveRequestSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    from_date: {
        type: Date,
        required: true
    },
    to_date: {
        type: Date,
        required: true
    },
    leave_type: {
        type: String,
        enum: ["paid", "unpaid", "sick", "casual"],
        required: true
    },
    is_paid: {
        type: Boolean,
        default: false
    },
    status: {
        type: String,
        enum: ["auto-approved"],
        default: "auto-approved"
    },
    reason: {
        type: String,
        trim: true
    },
    auto_approved: {
        type: Boolean,
        default: true
    }
});

module.exports = mongoose.model('LeaveRequest', leaveRequestSchema);