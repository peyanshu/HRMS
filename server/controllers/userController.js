const User = require("../models/User");

exports.getAllManagers = async(req, res) => {
    try{
        const managers = await User.find({role: "manager"})
        .select("_id name email");
        res.json(managers);
    } catch (error) {
        res.status(500).json({ message: "Error fetching managers", error: error.message });
    }
};