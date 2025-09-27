import React, { useState, useEffect } from "react";
import { Calendar, Clock, FileText, AlertCircle, CheckCircle } from "lucide-react";
import moment from "moment";

const TimeOffRequest = () => {
  const [leaveType, setLeaveType] = useState("sick");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);

  // Fetch projects on component mount
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

  // Function to get all weeks between from and to dates
  const getWeeksBetweenDates = (fromDate, toDate) => {
    const weeks = [];
    const startDate = moment(fromDate);
    const endDate = moment(toDate);
    
    let currentWeek = startDate.clone().startOf('isoWeek');
    
    while (currentWeek.isSameOrBefore(endDate, 'week')) {
      const weekString = `${currentWeek.year()}-W${currentWeek.isoWeek().toString().padStart(2, '0')}`;
      weeks.push(weekString);
      currentWeek.add(1, 'week');
    }
    
    return weeks;
  };

  // Function to update timesheet status to "leave" - EXCLUDES SUNDAYS
  const updateTimesheetForLeave = async (weekStrings, projectId) => {
    for (const weekString of weekStrings) {
      try {
        // Get the days between from and to date for this specific week
        const weekStart = moment(weekString, 'YYYY-[W]WW').startOf('isoWeek');
        const weekEnd = moment(weekString, 'YYYY-[W]WW').endOf('isoWeek');
        
        const actualFromDate = moment.max(moment(fromDate), weekStart);
        const actualToDate = moment.min(moment(toDate), weekEnd);
        
        const leaveDays = [];
        let currentDay = actualFromDate.clone();
        
        while (currentDay.isSameOrBefore(actualToDate, 'day')) {
          // EXCLUDE SUNDAYS - Sunday is day 0
          if (currentDay.day() !== 0) {
            leaveDays.push({
              date: currentDay.format('YYYY-MM-DD'),
              hours: 0, // Leave days have 0 hours
              status: 'leave'
            });
          }
          currentDay.add(1, 'day');
        }

        if (leaveDays.length > 0) {
          const res = await fetch(
            `https://hrms-1-2jfq.onrender.com/api/timesheet/${weekString}?projectId=${projectId}`,
            {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
              body: JSON.stringify(leaveDays),
            }
          );

          if (!res.ok) {
            const errorText = await res.text();
            console.error(`Failed to update timesheet for week ${weekString}:`, errorText);
            throw new Error(`Failed to update timesheet for week ${weekString}`);
          }
        }
      } catch (error) {
        console.error(`Error updating timesheet for week ${weekString}:`, error);
        throw error; // Re-throw to handle in main function
      }
    }
  };

  // Helper function to check if date range contains only Sundays
  const isOnlySundays = (fromDate, toDate) => {
    let start = moment(fromDate).startOf("day");
    let end = moment(toDate).endOf("day");
    let current = start.clone();
    let hasNonSunday = false;

    while (current.isSameOrBefore(end, "day")) {
      if (current.day() !== 0) {
        hasNonSunday = true;
        break;
      }
      current.add(1, "day");
    }

    return !hasNonSunday;
  };

  const handleSubmit = async () => {
    if (!fromDate || !toDate) {
      alert("Please select both from and to dates");
      return;
    }

    if (!selectedProject) {
      alert("Please select a project");
      return;
    }

    if (moment(fromDate).isAfter(moment(toDate))) {
      alert("From date cannot be after to date");
      return;
    }

    // Check if date range contains only Sundays
    if (isOnlySundays(fromDate, toDate)) {
      alert("Leave cannot be applied only for Sundays as Sunday is already a weekly off");
      return;
    }

    try {
      setLoading(true);

      const payload = {
        from_date: fromDate,
        to_date: toDate,
        leave_type: leaveType,
        reason: reason || "",
      };

      const res = await fetch("http://localhost:5000/api/leave/apply", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to submit request");
      }
      
      const data = await res.json();

      // Update timesheet status to "leave" for the affected weeks
      const weekStrings = getWeeksBetweenDates(fromDate, toDate);
      await updateTimesheetForLeave(weekStrings, selectedProject._id);

      alert(`Leave request submitted successfully! ${data.counted_days} day(s) approved and timesheet updated.`);
      console.log("Server Response:", data);

      // Reset form
      setFromDate("");
      setToDate("");
      setReason("");
      setSelectedProject(null);
    } catch (err) {
      console.error("Error:", err);
      alert(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen  py-28 bg-amber-100">
      <div className="max-w-2xl mx-auto p-6 rounded-lg shadow-md bg-amber-50">
        <div className="flex items-center gap-2 mb-6">
          <Calendar className="w-6 h-6 text-blue-600" />
          <h1 className="text-2xl font-semibold text-gray-800">Time Off Request</h1>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <p className="text-sm text-green-700">
              Leave requests are automatically approved and will update your timesheet. Sundays are excluded as they are weekly offs.
            </p>
          </div>
        </div>

        {/* Project Selection */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Project *
          </label>
          <select
            value={selectedProject?._id || ""}
            onChange={(e) => {
              const proj = projects.find((p) => p._id === e.target.value);
              setSelectedProject(proj || null);
            }}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          >
            <option value="">-- Choose Project --</option>
            {projects.map((p) => (
              <option key={p._id} value={p._id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>

        {/* Leave Type */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Leave Type *
          </label>
          <select
            value={leaveType}
            onChange={(e) => setLeaveType(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="sick">Sick Leave</option>
            <option value="casual">Casual Leave</option>
            <option value="paid">Paid Leave</option>
            <option value="unpaid">Unpaid Leave</option>
          </select>
        </div>

        {/* Dates */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Calendar className="w-4 h-4 inline mr-1" />
              From Date *
            </label>
            <input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Calendar className="w-4 h-4 inline mr-1" />
              To Date *
            </label>
            <input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
        </div>

{/* Duration Display - EXCLUDES SUNDAYS */}
{fromDate && toDate && moment(fromDate).isSameOrBefore(moment(toDate)) && (
  <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
    <div className="flex items-center gap-2">
      <Clock className="w-4 h-4 text-blue-600" />
      <span className="text-sm text-blue-700">
        Duration: {
          (() => {
            let start = moment(fromDate).startOf("day");
            let end = moment(toDate).endOf("day");
            let days = 0;
            let current = start.clone();

            while (current.isSameOrBefore(end, "day")) {
              if (current.day() !== 0) { // exclude Sundays
                days++;
              }
              current.add(1, "day");
            }

            return days;
          })()
        } working day(s) (excluding Sundays)
      </span>
    </div>
  </div>
)}

        {/* Reason */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <FileText className="w-4 h-4 inline mr-1" />
            Reason (Optional)
          </label>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            rows="3"
            placeholder="Enter reason for leave (optional)"
          />
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            onClick={handleSubmit}
            disabled={loading || !fromDate || !toDate || !selectedProject}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200 flex items-center gap-2"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Submitting...
              </>
            ) : (
              <>
                <CheckCircle className="w-4 h-4" />
                Submit Request
              </>
            )}
          </button>
        </div>

        {/* Form Validation Messages */}
        {fromDate && toDate && moment(fromDate).isAfter(moment(toDate)) && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-600" />
              <span className="text-sm text-red-700">
                From date cannot be after to date.
              </span>
            </div>
          </div>
        )}

        {/* Sunday-only warning */}
        {fromDate && toDate && moment(fromDate).isSameOrBefore(moment(toDate)) && isOnlySundays(fromDate, toDate) && (
          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-yellow-600" />
              <span className="text-sm text-yellow-700">
                Leave cannot be applied only for Sundays as Sunday is already a weekly off.
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TimeOffRequest;
