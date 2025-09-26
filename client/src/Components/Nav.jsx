import React, { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { NavLink, useNavigate } from "react-router-dom";

// Helper function to trigger auth state update with proper localStorage setting
export const triggerAuthUpdate = (token = null, role = null) => {
  // If token and role are provided, set them first
  if (token && role) {
    localStorage.setItem("token", token);
    localStorage.setItem("role", role);
  }
  
  // Add a small delay to ensure localStorage has been updated
  setTimeout(() => {
    window.dispatchEvent(new Event('authChange'));
  }, 100);
};

const Nav = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState("");
  const navigate = useNavigate();

  // Function to check authentication status
  const checkAuthStatus = () => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    
    if (token && role) {
      const normalizedRole = role.toLowerCase().trim();
      const validRoles = ["admin", "employee", "manager", "intern"];
      
      if (validRoles.includes(normalizedRole)) {
        setIsLoggedIn(true);
        setUserRole(normalizedRole);
      } else {
        setIsLoggedIn(false);
        setUserRole("");
      }
    } else {
      setIsLoggedIn(false);
      setUserRole("");
    }
  };

  // Check token and role when component mounts and listen for changes
  useEffect(() => {
    checkAuthStatus();

    // Listen for storage changes (when user logs in/out in another tab)
    const handleStorageChange = () => {
      checkAuthStatus();
    };

    window.addEventListener('storage', handleStorageChange);
    
    // Custom event listener for same-tab login/logout
    const handleAuthChange = () => {
      // Add a small delay to ensure localStorage operations are complete
      setTimeout(() => {
        checkAuthStatus();
      }, 50);
    };
    
    window.addEventListener('authChange', handleAuthChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('authChange', handleAuthChange);
    };
  }, []);

  // Function to handle dashboard navigation based on role
  const handleDashboardClick = () => {
    const normalizedRole = userRole.toLowerCase().trim();
    
    switch (normalizedRole) {
      case "admin":
        navigate("/AdminDashboard");
        break;
      case "manager":
        navigate("/ManagerDashboard");
        break;
      case "employee":
        navigate("/EmployeesDashboard");
        break;
      case "intern":
        navigate("/EmployeesDashboard");
        break;
      default:
        navigate("/login");
    }
    setMenuOpen(false);
  };

  // Function to handle logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    setIsLoggedIn(false);
    setUserRole("");
    
    // Dispatch custom event to notify other components
    window.dispatchEvent(new Event('authChange'));
    
    navigate("/");
    setMenuOpen(false);
  };

  return (
    <div
      className="
        fixed top-0 w-full z-[999] 
        flex justify-between items-center 
        px-2 md:px-12 py-2 md:py-2
        backdrop-blur-md bg-black/50 
        border-b border-white/10
      "
    >
      {/* Logo */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 700 220"
        width="200"
        height="70"
        role="img"
        aria-label="WhiteCircle HRMS logo"
        className="w-32 h-10 sm:w-40 sm:h-12 md:w-48 md:h-14 lg:w-52 lg:h-16"
      >
        <title>WhiteCircle HRMS</title>
        <g
          fill="none"
          stroke="#ffffff"
          strokeWidth="6"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="110" cy="110" r="70" />
        </g>
        <text
          x="110"
          y="128"
          textAnchor="middle"
          fontFamily="Helvetica, Arial, sans-serif"
          fontWeight="700"
          fontSize="56"
          fill="#ffffff"
        >
          HR
        </text>
        <g fontFamily="Helvetica, Arial, sans-serif" fill="#ffffff">
          <text
            x="220"
            y="95"
            fontSize="48"
            fontWeight="700"
            letterSpacing="0.5"
          >
            WhiteCircle
          </text>
          <text x="220" y="140" fontSize="30" fontWeight="600" opacity="0.95">
            HRMS
          </text>
        </g>
      </svg>

      {/* Desktop Links */}
      <div className="hidden md:flex space-x-4 lg:space-x-6 text-white text-sm lg:text-base items-center">
        <NavLink to="/" className="hover:text-gray-300 transition-colors py-1">
          Home
        </NavLink>
        {isLoggedIn && (
          <button 
            onClick={handleDashboardClick}
            className="hover:text-gray-300 transition-colors cursor-pointer py-1"
          >
            Dashboard
          </button>
        )}
        {isLoggedIn ? (
          <button 
            onClick={handleLogout}
            className="transition-all duration-200 cursor-pointer border backdrop-blur-sm px-3 py-1 rounded-lg"
          >
            Logout
          </button>
        ) : (
          <NavLink to="/login" className="hover:text-gray-300 transition-colors py-1">
            Login
          </NavLink>
        )}
      </div>

      {/* Mobile Menu Button */}
      <button
        onClick={() => setMenuOpen(!menuOpen)}
        className="md:hidden text-white p-1"
        aria-label="Toggle menu"
      >
        {menuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Mobile Menu with Animation */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="absolute text-white top-full left-0 w-full bg-black/90 backdrop-blur-md flex flex-col items-center py-4 space-y-4 md:hidden border-b border-white/10"
          >
            <NavLink 
              to="/" 
              onClick={() => setMenuOpen(false)}
              className="hover:text-gray-300 transition-colors py-2 px-4 rounded"
            >
              Home
            </NavLink>
            {isLoggedIn && (
              <button 
                onClick={handleDashboardClick}
                className="hover:text-gray-300 transition-colors py-2 px-4 rounded cursor-pointer"
              >
                Dashboard
              </button>
            )}
            {isLoggedIn ? (
              <button 
                onClick={handleLogout}
                className="text-red-300 hover:text-red-200 transition-all duration-200 py-2 px-4 rounded cursor-pointer border border-red-400/30 hover:border-red-300/40 bg-red-500/10 hover:bg-red-500/20 backdrop-blur-sm"
              >
                Logout
              </button>
            ) : (
              <NavLink 
                to="/login" 
                onClick={() => setMenuOpen(false)}
                className="hover:text-gray-300 transition-colors py-2 px-4 rounded"
              >
                Login
              </NavLink>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Nav;