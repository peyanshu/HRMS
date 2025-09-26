const User = require("../models/User.js");
const LeaveBalance = require("../models/LeaveBalance.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// REGISTER
exports.register = async (req, res) => {
  try {
    const { name, email, password, role, managerId} = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    if(role === "manager" || role === "admin") {
      const user = new User({ name, email, password: hashedPassword, role });
      await user.save();
    }

    if(role === "intern" || role === "employee") {
      const user = new User({ name, email, password: hashedPassword, role, managerId});
      await user.save();
      const defaultBalances = [
        { leave_type: "paid", total: 12 },
        { leave_type: "sick", total: 6 },
        { leave_type: "casual", total: 4 },
        { leave_type: "unpaid", total: 0 }
      ];

      // Insert leave balances
      await LeaveBalance.insertMany(
        defaultBalances.map(type => ({
          user_id: user._id,
          leave_type: type.leave_type,
          total: type.total,
          used: 0,
          remaining: type.total
        }))
      );
    }

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// LOGIN
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

    // JWT
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({ token, user: { id: user._id, name: user.name, role: user.role } });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
