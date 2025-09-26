const User = require("../models/User");
const LeaveRequest = require("../models/LeaveRequest");
const LeaveBalance = require("../models/LeaveBalance");
const moment = require("moment");

// Apply for leave
exports.applyLeave = async (req, res) => {
  try {
    const { from_date, to_date, leave_type, reason } = req.body;
    const userId = req.user.id;

    if (!from_date || !to_date || !leave_type) {
      return res.status(400).json({ message: "Please provide from_date, to_date, and leave_type" });
    }

    // Calculate leave days excluding Sundays
    let start = moment(from_date).startOf("day");
    let end = moment(to_date).endOf("day");

    if (end.isBefore(start)) {
      return res.status(400).json({ message: "Invalid date range" });
    }

    let days = 0;
    let current = start.clone();
    while (current.isSameOrBefore(end, "day")) {
      if (current.day() !== 0) {   // skip Sundays (0 = Sunday)
        days++;
      }
      current.add(1, "day");
    }
    if (days === 0) {
      return res.status(400).json({ message: "Leave cannot be applied only for Sundays" });
    }


    // Check balance only for paid/sick/casual
    if (leave_type !== "unpaid") {
      let balance = await LeaveBalance.findOne({ user_id: userId, leave_type });

      if (!balance) {
        return res.status(400).json({ message: `No leave balance set for ${leave_type}` });
      }

      if (balance.remaining < days) {
        return res.status(400).json({ message: `Insufficient ${leave_type} balance` });
      }

      balance.used += days;
      balance.remaining = balance.total - balance.used;
      await balance.save();
    }

    const leave = new LeaveRequest({
      user_id: userId,
      from_date,
      to_date,
      leave_type,
      is_paid: leave_type === "paid",
      status: "auto-approved",
      reason,
      auto_approved: true
    });

    await leave.save();

    res.status(201).json({ message: "Leave auto-approved", leave, counted_days: days });

  } catch (error) {
    res.status(500).json({ message: "Error applying for leave", error: error.message });
  }
};



//leave requests of logged-in user
exports.getMyLeaves = async (req, res) => {
  try {
    const userId = req.user.id;
    const leaves = await LeaveRequest.find({ user_id: userId }).sort({ from_date: -1 });
    res.json(leaves);
  } catch (error) {
    res.status(500).json({ message: "Error fetching leaves", error: error.message });
  }
};

//Admin/Manager view leave requests
exports.getAllLeaves = async (req, res) => {
  try {
    if (req.user.role === "admin") {
      // Admin sees all leaves
      const leaves = await LeaveRequest.find()
        .populate("user_id", "name email role")
        .sort({ from_date: -1 });
      return res.json(leaves);
    }

    if (req.user.role === "manager") {
      const managerId = req.user.id;
      const interns = await User.find({ managerId: managerId }, "_id");
      const internIds = interns.map(u => u._id);

      const leaves = await LeaveRequest.find({ user_id: { $in: internIds } })
        .populate("user_id", "name email role")
        .sort({ from_date: -1 });

      return res.json(leaves);
    }

    return res.status(403).json({ message: "Access denied" });

  } catch (error) {
    res.status(500).json({ message: "Error fetching leaves", error: error.message });
  }
};
