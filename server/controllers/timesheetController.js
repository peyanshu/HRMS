const Timesheet = require("../models/Timesheet");
const moment = require("moment");
const User = require("../models/User");
const mongoose = require("mongoose");

//Get or Create Weekly Timesheet for selected project
exports.getWeeklyTimesheet = async (req, res) => {
  try {
    const { week } = req.params;               // "2025-W38"
    const { projectId } = req.query;
    const userId = req.user.id;

    if (!projectId) {
      return res.status(400).json({ message: "Project ID is required" });
    }

    let entries = await Timesheet.find({ user_id: userId, project: projectId, week });

    if (entries.length === 0) {

      const weekMoment = moment(week, "GGGG-[W]WW");
      const startOfIsoWeekLocal = weekMoment.startOf("isoWeek");

      const docs = [];
      for (let i = 0; i < 7; i++) {

        const dayLocal = startOfIsoWeekLocal.clone().add(i, "days");
        const dayYYYYMMDD = dayLocal.format("YYYY-MM-DD");               // e.g. "2025-09-15"
        const dayUtcMidnight = moment.utc(dayYYYYMMDD, "YYYY-MM-DD").toDate(); // 2025-09-15T00:00:00.000Z

        docs.push({
          user_id: userId,
          project: projectId,
          date: dayUtcMidnight,
          hours: (i <= 5 ? 8 : 0),            //Mon–Sat working
          status: (i <= 5 ? "draft" : "weekend"),
          week
        });
      }

      entries = await Timesheet.insertMany(docs);
    }

    entries = entries.sort((a, b) => new Date(a.date) - new Date(b.date));

    res.json(entries);
  } catch (error) {
    res.status(500).json({ message: "Error fetching timesheet", error: error.message });
  }
};

//Update Weekly Timesheet
exports.updateWeeklyTimesheet = async (req, res) => {
  try {
    const { week } = req.params;               // "2025-W38"
    const { projectId } = req.query;
    const userId = req.user.id;
    const updates = req.body;                  // expects an array

    if (!projectId) {
      return res.status(400).json({ message: "Project ID is required" });
    }
    if (!Array.isArray(updates)) {
      return res.status(400).json({ message: "Request body must be an array of entries" });
    }

    // parse the week param to get week number and year
    const paramMoment = moment(week, "GGGG-[W]WW");
    const paramWeekNum = paramMoment.isoWeek();
    const paramWeekYear = paramMoment.isoWeekYear();

    for (const entry of updates) {
      
      const entryUtc = moment.utc(entry.date, moment.ISO_8601).startOf("day");

      if (!entryUtc.isValid()) {
        return res.status(400).json({ message: `Invalid date: ${entry.date}` });
      }

      
      const entryWeekNum = entryUtc.isoWeek();
      const entryWeekYear = entryUtc.isoWeekYear();

      if (entryWeekNum !== paramWeekNum || entryWeekYear !== paramWeekYear) {
        return res.status(400).json({
          message: `Date ${entry.date} does not belong to week ${week}`
        });
      }

      
      await Timesheet.findOneAndUpdate(
        {
          user_id: userId,
          project: projectId,
          date: entryUtc.toDate(),
          week
        },
        {
          $set: { hours: entry.hours, status: entry.status }
        },
        { upsert: true, new: true }
      );
    }

    res.json({ message: "Timesheet updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error updating timesheet", error: error.message });
  }
};

//Manager: Get all submitted timesheets
exports.getPendingTimesheets = async (req, res) => {
  try {
    const managerId = req.user.id;

    if (req.user.role !== "manager") {
      return res.status(403).json({ message: "Access denied: Managers only" });
    }

    // interns under this manager
    const interns = await User.find({ managerId: managerId }, "_id");
    const internIds = interns.map(u => u._id);

    // aggregate timesheets
    const pending = await Timesheet.aggregate([
      { $match: { status: "submitted", user_id: { $in: internIds.map(id => new mongoose.Types.ObjectId(id)) } } },
      {
        $group: {
          _id: { user: "$user_id", project: "$project", week: "$week" },
          totalHours: { $sum: "$hours" },
          entries: { $push: { _id: "$_id", date: "$date", hours: "$hours", status: "$status" } }
        }
      },
      {
        $lookup: {
          from: "users",
          localField: "_id.user",
          foreignField: "_id",
          as: "user"
        }
      },
      { $unwind: "$user" },
      {
        $lookup: {
          from: "projects",
          localField: "_id.project",
          foreignField: "_id",
          as: "project"
        }
      },
      { $unwind: "$project" },
      {
        $project: {
          week: "$_id.week",
          totalHours: 1,
          entries: 1,
          "user._id": 1,
          "user.name": 1,
          "user.email": 1,
          "project._id": 1,
          "project.name": 1
        }
      },
      { $sort: { week: -1 } }
    ]);

    res.json(pending);
  } catch (error) {
    res.status(500).json({ message: "Error fetching pending timesheets", error: error.message });
  }
};

// Manager: Approve an entire week's timesheet for a user + project
exports.approveTimesheet = async (req, res) => {
  try {
    if (req.user.role !== "manager") {
      return res.status(403).json({ message: "Access denied: Managers only" });
    }

    const managerId = req.user.id;
    const { userId, projectId, week } = req.body; 

    // check if that user belongs to this manager
    const employee = await User.findById(userId);
    if (!employee || String(employee.managerId) !== String(managerId)) {
      return res.status(403).json({ message: "Access denied: Not your intern/employee" });
    }

    // update all submitted timesheets for that week/project
    const result = await Timesheet.updateMany(
      { user_id: userId, project: projectId, week, status: "submitted" },
      { $set: { status: "approved" } }
    );

    res.json({ 
      message: `Timesheet approved for ${result.modifiedCount} entries`, 
      week, 
      projectId, 
      userId 
    });

  } catch (error) {
    res.status(500).json({ message: "Error approving timesheet", error: error.message });
  }
};
