const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ["intern", "employee", "manager", "admin"],
        default: "intern"
    },
    managerId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User",
    required: function() { return this.role === "intern" || this.role === "employee"; }
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('User', userSchema);