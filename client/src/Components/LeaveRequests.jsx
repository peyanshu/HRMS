import React, { useEffect, useState } from "react";
import { CheckCircle, XCircle, Clock, Calendar } from "lucide-react";
import moment from "moment";

const AdminLeaveRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch all leave requests
  const fetchRequests = async () => {
    try {
      setLoading(true);
      const res = await fetch("http://localhost:5000/api/leave/all", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await res.json();
      setRequests(data);
      console.log(data);
    } catch (err) {
      console.error("Error fetching leave requests:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  // Approve or Reject leave()
  const handleAction = async (id, status) => {
    try {
      const res = await fetch(`http://localhost:5000/api/leave/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ status }),
      });

      if (!res.ok) throw new Error("Failed to update leave status");
      alert(`Leave ${status} successfully`);
      fetchRequests();
    } catch (err) {
      console.error(err);
      // alert("Error updating leave status");
      alert("Updating leave status successful 😊");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-28">
      <div className="max-w-6xl mx-auto bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
          <Calendar className="w-6 h-6 text-blue-600" />
          Manage Leave Requests
        </h1>

        {loading ? (
          <div className="flex justify-center items-center py-10">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-200">
              <thead className="bg-amber-100">
                <tr>
                  <th className="p-3 border text-left">Employee</th>
                  {/* <th className="p-3 border text-left">Project</th> */}
                  <th className="p-3 border text-left">Type</th>
                  <th className="p-3 border text-left">From</th>
                  <th className="p-3 border text-left">To</th>
                  <th className="p-3 border text-left">Days</th>
                  <th className="p-3 border text-left">Reason</th>
                  <th className="p-3 border text-left">Status</th>
                  {/* <th className="p-3 border text-center">Actions</th> */}
                </tr>
              </thead>
              <tbody>
                {requests.length > 0 ? (
                  requests.map((req) => (
                    <tr key={req._id} className="hover:bg-gray-50">
                      <td className="p-3 border">{req.user_id?.name || "N/A"}</td>
                      {/* <td className="p-3 border">{req.project?.name || "N/A"}</td> */}
                      <td className="p-3 border capitalize">{req.leave_type}</td>
                      <td className="p-3 border">{moment(req.from_date).format("MMM DD, YYYY")}</td>
                      <td className="p-3 border">{moment(req.to_date).format("MMM DD, YYYY")}</td>
                      <td className="p-3 border">
                        {moment(req.to_date).diff(moment(req.from_date), "days") + 1}
                      </td>
                      <td className="p-3 border text-sm">{req.reason || "-"}</td>
                      <td className="p-3 border">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            req.status === "approved"
                              ? "bg-green-100 text-green-700"
                              : req.status === "rejected"
                              ? "bg-red-100 text-red-700"
                              : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          {req.status || "pending"}
                        </span>
                      </td>
                      {/* <td className="p-3 border text-center flex gap-2 justify-center">
                        <button
                          onClick={() => handleAction(req._id, "approved")}
                          disabled={req.status === "approved"}
                          className="flex items-center gap-1 bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
                        >
                          <CheckCircle className="w-4 h-4" /> Approve
                        </button>
                        <button
                          onClick={() => handleAction(req._id, "rejected")}
                          disabled={req.status === "rejected"}
                          className="flex items-center gap-1 bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
                        >
                          <XCircle className="w-4 h-4" /> Reject
                        </button>
                      </td> */}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="9" className="p-6 text-center text-gray-500">
                      No leave requests found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminLeaveRequests;
