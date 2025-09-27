import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./Components/ProtectedRoute";

import Nav from "./Components/Nav";
import Landing from "./Components/Landing";
import Abouts from "./Components/Abouts";

import Footer from "./Components/Footer";
import LocomotiveScroll from 'locomotive-scroll';

import Login from "./pages/Login";
// import Signup from "./pages/Signup";
import TimeOffRequest from "./pages/TimeOffRequest";
import EmployeesDashboard from "./pages/EmployeesDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import ManagerDashboard from "./pages/ManagerDashboard";
import AdminLeaveRequests from "./Components/LeaveRequests";
import AddProjects from "./Components/AddProjects";



const App = () => {
  const locomotiveScroll = new LocomotiveScroll();
  
  return (
    <Router>
      <AuthProvider>
        <Nav />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/abouts" element={<Abouts />} />
          <Route path="/EmployeesDashboard" element={<EmployeesDashboard/>} />
          <Route path="/managerDashboard" element={<ManagerDashboard/>} />
          <Route path="/AdminDashboard" element={<AdminDashboard/>} />
          <Route path="/AdminDashboard/add-projects" element={<AddProjects/>} />
          <Route path="/AdminDashboard/leave-requests" element={<AdminLeaveRequests/>} />
          <Route path="/ManagerDashboard/leave-requests" element={<AdminLeaveRequests/>} />
          <Route path="/timeoffrequest" element={<TimeOffRequest/>} />
   

          <Route path="/login" element={<Login />} />
          {/* <Route path="/signup" element={<Signup />} /> */}

          <Route
            path="/Employeesdashboard"
            element={
              <ProtectedRoute>
                <EmployeesDashboard/>
              </ProtectedRoute>
            }
          />
        </Routes>
        <Footer />
      </AuthProvider>
    </Router>
  );
};

export default App;
