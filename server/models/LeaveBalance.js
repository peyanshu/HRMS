const mongoose = require("mongoose");

const leaveBalanceSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    leave_type: {
        type: String,
        enum: ["paid", "unpaid", "sick", "casual"],
        required: true
    },
    total: {
        type: Number,
        required: true,
        default: 0
    },
    used: {
        type: Number,
        default: 0
    },
    remaining: {
        type: Number,
        default: function() {
            return this.total - this.used;
        }
    }
});

module.exports = mongoose.model('LeaveBalance', leaveBalanceSchema);