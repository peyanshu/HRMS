import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { UserPlus, Users, Shield, Mail, Lock, User, ChevronDown, Plus } from "lucide-react";
import AddProjects from "@/Components/AddProjects";

const AdminDashboard = () => {
  // ---------------- States ----------------
  const [showManagerForm, setShowManagerForm] = useState(false);
  const [showEmployeeForm, setShowEmployeeForm] = useState(true);
  const [managers, setManagers] = useState([]);
  const [activeTab, setActiveTab] = useState(null);


  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
    managerId: "",
  });
  const [loading, setLoading] = useState(false);
  const Naviagte = useNavigate() ;

  // ---------------- Handlers ----------------
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const resetForm = () => {
    setForm({ name: "", email: "", password: "", role: "", managerId: "" });
  };

  // Register new user
  const handleRegister = async () => {
    if (!form.name || !form.email || !form.password || !form.role) {
      alert("All fields are required");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch("https://hrms-1-2jfq.onrender.com/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(form),
      });

      const data = await response.json();
      setLoading(false);

      if (!response.ok) {
        alert(data.message || "Registration failed");
        return;
      }

      alert("User registered successfully ✅");
      resetForm();
      setShowEmployeeForm(false);
      setShowManagerForm(false);
      setActiveTab(null);

      // Refresh manager list if a manager was added
      if (form.role === "manager") fetchManagers();
    } catch (error) {
      setLoading(false);
      console.error("Error registering user:", error);
      alert("Error registering user");
    }
  };
const  AddProject=()=>{
   Naviagte("/AdminDashboard/add-projects") ;
}
  // Fetch managers
  const fetchManagers = async () => {
    try {
     const response = await fetch("https://hrms-1-2jfq.onrender.com/api/get/all-managers", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(errText);
      }

      const data = await response.json();
      setManagers(data);
      console.log("Managers fetched:", data);
    } catch (error) {
      console.error("Error fetching managers:", error);
    }
  };

  const handleEmployeeClick = () => {
    setActiveTab('employee');
    setShowEmployeeForm(true);
    setShowManagerForm(false);
    resetForm();
    fetchManagers();
  };

  const handleManagerClick = () => {
    setActiveTab('manager');
    setShowManagerForm(true);
    setShowEmployeeForm(false);
    resetForm();
  };
  const handleRequest = () => {
    // window.location.href = "/AdminDashboard/leave-requests";
    Naviagte("/AdminDashboard/leave-requests") ;
  } ;

  // Fetch managers on component mount
  useEffect(() => {
    fetchManagers();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-blue-400/20 to-cyan-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 container mx-auto px-6 py-12 mt-10">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl mb-6 shadow-lg shadow-blue-500/25">
            <Shield className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent mb-4">
            Admin Dashboard
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            See leave requests here - <span
            className="text-blue-700 text-decoration cursor-pointer underline  font-semibold"
            onClick={handleRequest}
            >Leave Request</span>
          </p>
        </div>
        <div className="flex justify-center items-center mb-5 mt-5">
          <button 
            onClick={AddProject}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow-lg hover:bg-blue-700 active:bg-blue-800 transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
          <span className="font-medium">Add Project</span>
          </button>
        </div>
        {/* Action Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-12">
          <div 
            onClick={handleEmployeeClick}
            className={`group cursor-pointer transform transition-all duration-300 hover:scale-105 ${
              activeTab === 'employee' ? 'scale-105' : ''
            }`}
          >
            <div className={`p-8 rounded-3xl shadow-xl transition-all duration-300 ${
              activeTab === 'employee' 
                ? 'bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-blue-500/25' 
                : 'bg-white/80 backdrop-blur-sm hover:bg-white text-gray-700 hover:shadow-2xl'
            }`}>
              <div className="flex items-center justify-between mb-6">
                <div className={`p-4 rounded-2xl ${
                  activeTab === 'employee' ? 'bg-white/20' : 'bg-gradient-to-br from-blue-500 to-purple-600'
                }`}>
                  <UserPlus className={`w-8 h-8 ${
                    activeTab === 'employee' ? 'text-white' : 'text-white'
                  }`} />
                </div>
                
                </div>
              <h3 className="text-2xl font-bold mb-2">Add Employee</h3>
              <p className={`${activeTab === 'employee' ? 'text-white/80' : 'text-gray-600'}`}>
                Register new employees and assign them to managers
              </p>
            </div>
          </div>

          <div 
            onClick={handleManagerClick}
            className={`group cursor-pointer transform transition-all duration-300 hover:scale-105 ${
              activeTab === 'manager' ? 'scale-105' : ''
            }`}
          >
            <div className={`p-8 rounded-3xl shadow-xl transition-all duration-300 ${
              activeTab === 'manager' 
                ? 'bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-emerald-500/25' 
                : 'bg-white/80 backdrop-blur-sm hover:bg-white text-gray-700 hover:shadow-2xl'
            }`}>
              <div className="flex items-center justify-between mb-6">
                <div className={`p-4 rounded-2xl ${
                  activeTab === 'manager' ? 'bg-white/20' : 'bg-gradient-to-br from-emerald-500 to-teal-600'
                }`}>
                  <Users className={`w-8 h-8 ${
                    activeTab === 'manager' ? 'text-white' : 'text-white'
                  }`} />
                </div>
                <ChevronDown className={`w-5 h-5 transform transition-transform duration-300 ${
                  activeTab === 'manager' ? 'rotate-180' : ''
                } ${activeTab === 'manager' ? 'text-white' : 'text-gray-400'}`} />
              </div>
              <h3 className="text-2xl font-bold mb-2">Add Manager</h3>
              <p className={`${activeTab === 'manager' ? 'text-white/80' : 'text-gray-600'}`}>
                Create new manager accounts with administrative privileges
              </p>
            </div>
          </div>
        </div>

        {/* Registration Forms */}
        <div className="max-w-2xl mx-auto">
          {/* Manager Form */}
          {showManagerForm && (
            <div className="transform transition-all duration-500 ease-out animate-in slide-in-from-bottom-8">
              <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
                <div className="bg-gradient-to-r from-emerald-500 to-teal-600 p-8">
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-white/20 rounded-xl">
                      <Users className="w-6 h-6 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-white">Register Manager</h2>
                  </div>
                </div>
                
                <div className="p-8 space-y-6">
                  <div className="relative group">
                    <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-emerald-500 transition-colors" />
                    <input
                      type="text"
                      name="name"
                      placeholder="Full Name"
                      className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 text-gray-700 placeholder-gray-400"
                      value={form.name}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-emerald-500 transition-colors" />
                    <input
                      type="email"
                      name="email"
                      placeholder="Email Address"
                      className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 text-gray-700 placeholder-gray-400"
                      value={form.email}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-emerald-500 transition-colors" />
                    <input
                      type="password"
                      name="password"
                      placeholder="Password"
                      className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 text-gray-700 placeholder-gray-400"
                      value={form.password}
                      onChange={handleChange}
                    />
                  </div>

                  <select
                    name="role"
                    className="w-full px-4 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 text-gray-700"
                    value={form.role}
                    onChange={handleChange}
                  >
                    <option value="">Select Role</option>
                    <option value="manager">Manager</option>
                  </select>

                  <button
                    onClick={handleRegister}
                    disabled={loading}
                    className="w-full py-4 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-semibold rounded-xl transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                  >
                    {loading ? (
                      <div className="flex items-center justify-center space-x-2">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Registering...</span>
                      </div>
                    ) : (
                      "Register Manager"
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Employee Form */}
          {showEmployeeForm && (
            <div className="transform transition-all duration-500 ease-out animate-in slide-in-from-bottom-8">
              <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
                <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-8">
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-white/20 rounded-xl">
                      <UserPlus className="w-6 h-6 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-white">Register Employee</h2>
                  </div>
                </div>
                
                <div className="p-8 space-y-6">
                  <div className="relative group">
                    <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                    <input
                      type="text"
                      name="name"
                      placeholder="Full Name"
                      className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-700 placeholder-gray-400"
                      value={form.name}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                    <input
                      type="email"
                      name="email"
                      placeholder="Email Address"
                      className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-700 placeholder-gray-400"
                      value={form.email}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                    <input
                      type="password"
                      name="password"
                      placeholder="Password"
                      className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-700 placeholder-gray-400"
                      value={form.password}
                      onChange={handleChange}
                    />
                  </div>

                  <select
                    name="role"
                    className="w-full px-4 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-700"
                    value={form.role}
                    onChange={handleChange}
                  >
                    <option value="">Select Role</option>
                    <option value="intern">Intern</option>
                    <option value="employee">Employee</option>
                  </select>

                  <select
                    name="managerId"
                    className="w-full px-4 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-700"
                    value={form.managerId}
                    onChange={handleChange}
                  >
                    <option value="">Select Manager</option>
                    {managers.map((manager) => (
                      <option key={manager._id} value={manager._id}>
                        {manager.name}
                      </option>
                    ))}
                  </select>

                  <button
                    onClick={handleRegister}
                    disabled={loading}
                    className="w-full py-4 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold rounded-xl transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                  >
                    {loading ? (
                      <div className="flex items-center justify-center space-x-2">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Registering...</span>
                      </div>
                    ) : (
                      "Register Employee"
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
