import React from "react";
import { motion } from "framer-motion";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { toFormikValidationSchema } from "zod-formik-adapter";
import { loginSchema } from "../validation/validation.js";
import { useNavigate } from "react-router-dom";
import {triggerAuthUpdate} from "../Components/Nav.jsx"

const Login = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-purple-600 via-pink-500 to-red-400">
      <motion.div
        initial={{ opacity: 0, y: -50, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="bg-white p-10 rounded-3xl shadow-2xl w-80 sm:w-96 flex flex-col items-center"
      >
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-3xl font-bold mb-8 text-gray-800"
        >
          Welcome Back
        </motion.h2>

        <Formik
          initialValues={{ email: "", password: "" }}
          validationSchema={toFormikValidationSchema(loginSchema)}
          onSubmit={async (values, { setSubmitting }) => {
            try {
              const res = await fetch("http://localhost:5000/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(values),
              });

              const data = await res.json();
              console.log("Server response:", data);

              if (res.ok) {
                alert("Login successful");

                // Save token + user in localStorage
                if (data.token) localStorage.setItem("token", data.token);
                if (data.user) localStorage.setItem("user", JSON.stringify(data.user));

                // Get role from response (universal handling)
                const role = (
                  data.role ||
                  data.user?.role ||
                  data.userRole ||
                  ""
                ).toLowerCase();

                localStorage.setItem("role", role);
                triggerAuthUpdate();

                // Navigate based on role
                if (role === "admin") {
                  navigate("/adminDashboard");
                } else if (role === "manager") {
                  navigate("/managerDashboard");
                } else if (role === "employee" || role === "intern") {
                  navigate("/EmployeesDashboard");
                } else {
                  alert("Unknown role 🚫: " + role);
                }
              } else {
                alert(data.message || "Login failed ☹️");
              }
            } catch (err) {
              console.error("Login error:", err);
              alert("Login unsuccessful ☹️");
            } finally {
              setSubmitting(false);
            }
          }}
          validateOnBlur
          validateOnChange
        >
          {({ isSubmitting }) => (
            <Form className="w-full flex flex-col items-center">
              {/* Email */}
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="w-full mb-4"
              >
                <Field
                  type="email"
                  name="email"
                  placeholder="Email"
                  className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                />
                <ErrorMessage
                  name="email"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </motion.div>

              {/* Password */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="w-full mb-6"
              >
                <Field
                  type="password"
                  name="password"
                  placeholder="Password"
                  className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                />
                <ErrorMessage
                  name="password"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </motion.div>

              {/* Submit */}
              <motion.button
                type="submit"
                disabled={isSubmitting}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 rounded-xl font-semibold shadow-lg hover:shadow-2xl transition-all disabled:opacity-50"
              >
                {isSubmitting ? "Logging in..." : "Login"}
              </motion.button>

              {/* Signup link */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="mt-4 text-sm text-gray-500 text-center"
              >
              If you Don&apos;t have an account<br/> Please contact to Admin{" "}
                {/* <a href="/signup" className="text-purple-600 font-medium">
                  Sign Up
                </a> */}
              </motion.p>
            </Form>
          )}
        </Formik>
      </motion.div>
    </div>
  );
};

export default Login;
