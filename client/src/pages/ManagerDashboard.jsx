import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import moment from "moment";
import { useNavigate } from "react-router-dom";

const ManagerDashboard = () => {
  const [timesheets, setTimesheets] = useState([]);
  const [selectedTimesheet, setSelectedTimesheet] = useState(null);
  const [loading, setLoading] = useState(false);

  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (selectedTimesheet) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    // Cleanup function to reset overflow when component unmounts
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [selectedTimesheet]);

  // Fetch pending timesheets
  const fetchTimesheets = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/timesheet/manager/pending", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await res.json();
      setTimesheets(data || []);
    } catch (error) {
      console.error("Error fetching timesheets:", error);
      setTimesheets([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch timesheets on component mount
  useEffect(() => {
    fetchTimesheets();
  }, []);

  // Approve timesheet
  const approveTimesheet = async (timesheet) => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/timesheet/manager/${timesheet.user._id}/approve`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            userId: timesheet.user._id,
            projectId: timesheet.project._id,
            week: timesheet.week
          }),
        }
      );

      if (res.ok) {
        alert("Timesheet approved successfully!");
        fetchTimesheets(); // Refresh the list
        setSelectedTimesheet(null); // Close the detail view
      } else {
        alert("Error approving timesheet");
      }
    } catch (error) {
      console.error("Error approving timesheet:", error);
      alert("Error approving timesheet");
    }
  };

  const formatWeekDisplay = (week) => {
    const [year, weekNum] = week.split('-W');
    return `Week ${weekNum}, ${year}`;
  };

  const Navigate = useNavigate();
  const handleRequest = () => {
    Navigate("/ManagerDashboard/leave-requests");
  };

  const TimesheetDetailModal = ({ timesheet, onClose, onApprove }) => {
    if (!timesheet) return null;

    // Handle backdrop click
    const handleBackdropClick = (e) => {
      if (e.target === e.currentTarget) {
        onClose();
      }
    };

    // Handle escape key press
    useEffect(() => {
      const handleEscape = (e) => {
        if (e.key === 'Escape') {
          onClose();
        }
      };

      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }, [onClose]);

    return (
      <motion.div
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4"
        style={{ zIndex: 9999 }} // Ensure it's above everything including navbar
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={handleBackdropClick}
      >
        <motion.div
          className="bg-white rounded-lg shadow-2xl max-w-4xl w-full max-h-[85vh] flex flex-col"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
        >
          {/* Fixed Header */}
          <div className="flex justify-between items-center p-6 border-b border-gray-200 rounded-t-lg">
            <h2 className="text-2xl font-bold text-gray-800">
              Timesheet Details - {timesheet.user.name}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-3xl font-bold w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
            >
              ×
            </button>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
              <div>
                <span className="font-semibold">Employee:</span>
                <p className="text-gray-700">{timesheet.user.name}</p>
              </div>
              <div>
                <span className="font-semibold">Project:</span>
                <p className="text-gray-700">{timesheet.project.name}</p>
              </div>
              <div>
                <span className="font-semibold">Week:</span>
                <p className="text-gray-700">{formatWeekDisplay(timesheet.week)}</p>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-4">Daily Entries</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Hours
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className=" bg-amber-100 divide-y divide-gray-200">
                    {timesheet.entries.map((entry, index) => (
                      <tr key={entry._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {moment(entry.date).format("MMM DD, YYYY (dddd)")}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-indigo-600">
                          {entry.hours} hrs
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              entry.status === "approved"
                                ? "bg-green-100 text-green-800"
                                : entry.status === "rejected"
                                ? "bg-red-100 text-red-800"
                                : entry.status === "submitted"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {entry.status.charAt(0).toUpperCase() + entry.status.slice(1)}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Fixed Footer */}
          <div className="flex justify-between items-center p-6 bg-gray-50 border-t border-gray-200 rounded-b-lg">
            <div className="text-lg font-semibold">
              Total Hours: <span className="text-indigo-600">{timesheet.totalHours} hrs</span>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={onClose}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition-colors"
              >
                Close
              </button>
              <button
                onClick={() => onApprove(timesheet)}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
              >
                Approve Timesheet
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    );
  };

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
        <h1 className="text-2xl font-bold text-gray-800">Manager Dashboard</h1>
        <div className="text-sm text-gray-600">
          Manage employee timesheets and approvals
        </div>
      </motion.div>

      {/* Filters */}
      <motion.div
        className="bg-white shadow rounded-lg p-6 mb-6 bg-amber-100"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Refresh Button */}
            <div>
              <label className="block mb-2 font-semibold text-gray-700">
                Actions
              </label>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={fetchTimesheets}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
              >
                Refresh Data
              </motion.button>
            </div>

            <div className="flex items-end">
              <span
                className="text-black py-2 px-4 rounded-md bg-slate-200 border border-black cursor-pointer font-semibold hover:bg-slate-300"
                onClick={handleRequest}
              >
                Leave Request
              </span>
            </div>
          </div>
      </motion.div>

      {/* Timesheet Table */}
      <AnimatePresence>
        <motion.div
          className="bg-white shadow rounded-lg overflow-hidden"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 40 }}
          transition={{ duration: 0.5 }}
        >
          <div className="px-6 py-4 bg-gray-50 border-b bg-amber-100">
            <h2 className="text-lg font-semibold text-gray-700">
              Pending Employee Timesheets
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Total entries: {timesheets.length}
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
          ) : timesheets.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No pending timesheets found</p>
              <p className="text-gray-400 text-sm mt-2">
                Try adjusting your filters or refresh the data
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Employee
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Project
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Week
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total Hours
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Entries
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {timesheets.map((timesheet, index) => (
                    <motion.tr
                      key={`${timesheet.user._id}-${timesheet.project._id}-${timesheet.week}`}
                      className="hover:bg-gray-50"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                              <span className="text-sm font-medium text-indigo-700">
                                {timesheet.user.name.charAt(0).toUpperCase()}
                              </span>
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {timesheet.user.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              Employee ID: {timesheet.user._id.slice(-6)}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {timesheet.project.name}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {formatWeekDisplay(timesheet.week)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-semibold text-indigo-600">
                          {timesheet.totalHours} hrs
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {timesheet.entries.length} days
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setSelectedTimesheet(timesheet)}
                            className="bg-blue-600 text-white px-3 py-1 rounded text-xs hover:bg-blue-700"
                          >
                            View Details
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => approveTimesheet(timesheet)}
                            className="bg-green-600 text-white px-3 py-1 rounded text-xs hover:bg-green-700"
                          >
                            Quick Approve
                          </motion.button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Timesheet Detail Modal */}
      <AnimatePresence>
        {selectedTimesheet && (
          <TimesheetDetailModal
            timesheet={selectedTimesheet}
            onClose={() => setSelectedTimesheet(null)}
            onApprove={approveTimesheet}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ManagerDashboard;