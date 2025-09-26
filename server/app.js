const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
require('dotenv').config();

const authRoutes = require("./routes/authRoutes");
const projectRoutes = require("./routes/projectRoutes");
const timesheetRoutes = require("./routes/timesheetRoutes");
const leaveRoutes = require("./routes/leaveRoutes");
const userRoutes = require("./routes/userRoutes");

app.use(express.json());
app.use(cors());


app.use("/api/auth", authRoutes);
app.use("/api/project", projectRoutes);
app.use("/api/timesheet", timesheetRoutes);
app.use("/api/leave", leaveRoutes);
app.use("/api/get", userRoutes);

const User = require("./models/User");

const PORT = process.env.PORT || 5000;
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch(err => {
    console.error("Connection error:", err);
  });