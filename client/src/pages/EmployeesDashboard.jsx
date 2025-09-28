import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import moment from "moment";

const Dashboard = () => {
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const workingDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [timesheet, setTimesheet] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentWeek, setCurrentWeek] = useState(moment().isoWeek());
  const [currentYear, setCurrentYear] = useState(moment().year());

  // Fetch projects from backend
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await fetch("https://hrms-1-2jfq.onrender.com/api/project", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        const data = await res.json();
        setProjects(data);
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    };
    fetchProjects();
  }, []);

  // Fetch timesheet for selected project
  const fetchTimesheet = async (projectId) => {
    if (!projectId) return;
    setLoading(true);
    try {
      const weekString = `${currentYear}-W${currentWeek
        .toString()
        .padStart(2, "0")}`;
      const res = await fetch(
        `https://hrms-1-2jfq.onrender.com/api/timesheet/${weekString}?projectId=${projectId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      const data = await res.json();
      setTimesheet(data);
    } catch (error) {
      console.error("Error fetching timesheet:", error);
      setTimesheet([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch timesheet with specific week string (for navigation)
  const fetchTimesheetWithWeek = async (projectId, weekString) => {
    if (!projectId) return;
    
    setLoading(true);
    try {
      const res = await fetch(
        `https://hrms-1-2jfq.onrender.com/api/timesheet/${weekString}?projectId=${projectId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const data = await res.json();
      setTimesheet(data || []);
    } catch (error) {
      console.error("Error fetching timesheet:", error);
      setTimesheet([]);
    } finally {
      setLoading(false);
    }
  };

  // Submit timesheet
  const submitTimesheet = async () => {
    if (!selectedProject) {
      alert("Please select a project first");
      return;
    }
    const weekString = `${currentYear}-W${currentWeek
      .toString()
      .padStart(2, "0")}`;
    const submissionData = timesheet.map((entry) => ({
      date: entry.date,
      hours: entry.hours,
      status: entry.status === "draft"? "submitted" : entry.status,
    }));

    try {
      setLoading(true);
      const res = await fetch(
        `https://hrms-1-2jfq.onrender.com/api/timesheet/${weekString}?projectId=${selectedProject._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(submissionData),
        }
      );
      if (res.ok) {
        alert("Timesheet submitted successfully!");
        fetchTimesheet(selectedProject._id);
      } else {
        console.log(submissionData);
        alert("Error submitting timesheet");
      }
    } catch (error) {
      console.error("Error submitting timesheet:", error);
      alert("Error submitting timesheet");
    } finally {
      setLoading(false);
    }
  };

  const canNavigateToFuture = () => {
    const currentMoment = moment();
    const targetMoment = moment().year(currentYear).isoWeek(currentWeek + 1);
    return targetMoment.isSameOrBefore(currentMoment, "week");
  };

  const getDayName = (dateStr) => moment(dateStr).format("ddd");
  const formatDate = (dateStr) => moment(dateStr).format("MMM DD");

  return (
    <motion.div
      className="min-h-screen bg-gray-100 p-8 mb-20"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header */}
      <motion.div
        className="flex justify-between items-center mb-6 mt-16"
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-2xl font-bold text-gray-800">Employee Dashboard</h1>
        <div className="flex gap-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={submitTimesheet}
            disabled={loading || !selectedProject}
            className="bg-indigo-600 text-white px-5 py-2 rounded-lg hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {loading ? "Submitting..." : "Submit Timesheet"}
          </motion.button>

          <NavLink
            className="bg-indigo-600 text-white px-5 py-2 rounded-lg hover:bg-indigo-700"
            to="/timeoffrequest"
          >
            Leave Request
          </NavLink>
        </div>
      </motion.div>

      {/* Project Dropdown */}
      <motion.div
        className="mb-6 max-w-md"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <label className="block mb-2 font-semibold  bg-amber-100 p-2 text-gray-700">
          Select Project
        </label>
        <select
          className="w-full  px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          onChange={(e) => {
            const proj = projects.find((p) => p._id === e.target.value);
            setSelectedProject(proj || null);
            if (proj) fetchTimesheet(proj._id);
            else setTimesheet([]);
          }}
        >
          <option value="">-- Choose Project --</option>
          {projects.map((p) => (
            <option key={p._id} value={p._id}>
              {p.name}
            </option>
          ))}
        </select>
      </motion.div>

      {/* Week Navigation */}
      {selectedProject && (
        <motion.div
          className="mb-6  bg-amber-100 shadow rounded-lg p-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center justify-between">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                const newWeek = currentWeek - 1;
                let newYear = currentYear;
                let finalWeek = newWeek;
                
                if (newWeek < 1) {
                  newYear = currentYear - 1;
                  finalWeek = moment().year(newYear).isoWeeksInYear();
                  setCurrentYear(newYear);
                } else {
                  finalWeek = newWeek;
                }
                
                setCurrentWeek(finalWeek);
                
                // Fetch with the new values directly
                if (selectedProject) {
                  const weekString = `${newYear}-W${finalWeek.toString().padStart(2, "0")}`;
                  fetchTimesheetWithWeek(selectedProject._id, weekString);
                }
              }}
              className="px-3 py-1 border-black border bg-gray-200 rounded hover:bg-gray-300"
            >
              ← Previous Week
            </motion.button>

            <h3 className="text-lg font-semibold text-black">
              Week {currentWeek}, {currentYear}
            </h3>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                const newWeek = currentWeek + 1;
                const weeksInYear = moment().year(currentYear).isoWeeksInYear();
                let newYear = currentYear;
                let finalWeek = newWeek;
                
                if (newWeek > weeksInYear) {
                  newYear = currentYear + 1;
                  finalWeek = 1;
                  setCurrentYear(newYear);
                } else {
                  finalWeek = newWeek;
                }
                
                setCurrentWeek(finalWeek);
                
                // Fetch with the new values directly
                if (selectedProject) {
                  const weekString = `${newYear}-W${finalWeek.toString().padStart(2, "0")}`;
                  fetchTimesheetWithWeek(selectedProject._id, weekString);
                }
              }}
              disabled={!canNavigateToFuture()}
              className={`px-3 py-1 rounded ${
                canNavigateToFuture()
                  ? "bg-gray-200 hover:bg-gray-300 border-black border"
                  : "bg-gray-100 text-gray-400 cursor-not-allowed border-black border"
              }`}
            >
              Next Week →
            </motion.button>
          </div>
        </motion.div>
      )}

      {/* Timesheet Display */}
      {selectedProject && (
        <AnimatePresence>
          <motion.div
            className=" bg-amber-100 shadow rounded-lg p-6 mb-8"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-lg font-semibold mb-4 text-gray-700  bg-amber-100">
              Weekly Timesheet - {selectedProject.name}
            </h2>

            {loading ? (
              <div className="flex justify-center items-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-4">
                {timesheet.map((entry, index) => {
                  const dayName = getDayName(entry.date);
                  const isWorkingDay = workingDays.includes(dayName);

                  return (
                    <motion.div
                      key={entry.date}
                      className={`p-4 rounded-lg border-2 ${
                        isWorkingDay
                          ? "border-indigo-200 bg-indigo-50"
                          : "border-gray-200 bg-gray-50"
                      }`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ scale: 1.02 }}
                    >
                      <div className="text-center">
                        <h4 className="font-semibold text-gray-800 mb-1">
                          {dayName}
                        </h4>
                        <p className="text-sm text-gray-600 mb-2">
                          {formatDate(entry.date)}
                        </p>

                        {/* Editable hours input */}
                        <div className="mb-3">
                          <input
                            type="number"
                            min="0"
                            max="24"
                            value={entry.hours || 0}
                            onChange={(e) => {
                              const newHours = Number(e.target.value);
                              setTimesheet((prev) =>
                                prev.map((t) =>
                                  t.date === entry.date
                                    ? { ...t, hours: newHours }
                                    : t
                                )
                              );
                            }}
                            className="w-16 text-center border rounded px-1 py-0.5 text-indigo-600 font-bold"
                          />
                          <span className="text-sm text-gray-500 ml-1">hrs</span>
                        </div>

                        <span
                          className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                            entry.status === "submitted"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {entry.status.charAt(0).toUpperCase() +
                            entry.status.slice(1)}
                        </span>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      )}
    </motion.div>
  );
};

export default Dashboard;
