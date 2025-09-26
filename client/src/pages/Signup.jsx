// import React from "react";
// import { motion } from "framer-motion";
// import { Formik, Form, Field, ErrorMessage } from "formik";
// import { toFormikValidationSchema } from "zod-formik-adapter";
// import { signupSchema } from "../validation/validation.js";
// import { useNavigate } from "react-router-dom";

// const SignupPage = () => {
//   const navigate = useNavigate();

//   const handleSubmit = async (values, { setSubmitting }) => {
//     try {
//       const res = await fetch("http://localhost:5000/api/auth/register", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(values),
//       });

//       const data = await res.json();

//       if (res.ok) {
//         alert("Register successful!");
//         navigate("/login");
//       } else {
//         alert(data.message || "Register failed, please try again.");
//       }
//     } catch (error) {
//       console.error("Signup error:", error);
//       alert("Register failed. Please try again later. ☹️");
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-purple-600 via-pink-500 to-red-400">
//       <motion.div
//         initial={{ opacity: 0, y: -50, scale: 0.9 }}
//         animate={{ opacity: 1, y: 0, scale: 1 }}
//         transition={{ duration: 0.6, ease: "easeOut" }}
//         className="bg-white p-10 rounded-3xl shadow-2xl w-80 sm:w-96 flex flex-col items-center"
//       >
//         <motion.h2
//           initial={{ opacity: 0, y: -20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ delay: 0.2 }}
//           className="text-3xl font-bold mb-8 text-gray-800"
//         >
//           Create Account
//         </motion.h2>

//         <Formik
//           initialValues={{
//             username: "",
//             email: "",
//             password: "",
//             member: "",
//           }}
//           validationSchema={toFormikValidationSchema(signupSchema)}
//           onSubmit={handleSubmit}
//           validateOnBlur
//           validateOnChange
//         >
//           {({ isSubmitting, values }) => (
//             <Form className="w-full flex flex-col items-center">
//               {/* Username */}
//               <motion.div
//                 initial={{ opacity: 0, x: -50 }}
//                 animate={{ opacity: 1, x: 0 }}
//                 transition={{ delay: 0.3 }}
//                 className="w-full mb-4"
//               >
//                 <Field
//                   type="text"
//                   name="username"
//                   placeholder="Username"
//                   className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
//                 />
//                 <ErrorMessage
//                   name="username"
//                   component="div"
//                   className="text-red-500 text-sm mt-1"
//                 />
//               </motion.div>

//               {/* Email */}
//               <motion.div
//                 initial={{ opacity: 0, x: 50 }}
//                 animate={{ opacity: 1, x: 0 }}
//                 transition={{ delay: 0.4 }}
//                 className="w-full mb-4"
//               >
//                 <Field
//                   type="email"
//                   name="email"
//                   placeholder="Email"
//                   className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
//                 />
//                 <ErrorMessage
//                   name="email"
//                   component="div"
//                   className="text-red-500 text-sm mt-1"
//                 />
//               </motion.div>

//               {/* Password */}
//               <motion.div
//                 initial={{ opacity: 0, x: -50 }}
//                 animate={{ opacity: 1, x: 0 }}
//                 transition={{ delay: 0.5 }}
//                 className="w-full mb-6"
//               >
//                 <Field
//                   type="password"
//                   name="password"
//                   placeholder="Password"
//                   className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
//                 />
//                 <ErrorMessage
//                   name="password"
//                   component="div"
//                   className="text-red-500 text-sm mt-1"
//                 />
//               </motion.div>

//               {/* Member Type */}
//               <label htmlFor="member" className="self-start mb-1 text-gray-700">
//                 Member Type
//               </label>
//               <motion.div
//                 initial={{ opacity: 0, x: 50 }}
//                 animate={{ opacity: 1, x: 0 }}
//                 transition={{ delay: 0.6 }}
//                 className="w-full mb-6"
//               >
//                 <Field
//                   as="select"
//                   name="member"
//                   id="member"
//                   className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
//                 >
//                   <option value="">-- Select --</option>
//                   <option value="Manager">Manager</option>
//                   <option value="Admin">Admin</option>
//                   <option value="Employees">Employees</option>
//                 </Field>
//                 <ErrorMessage
//                   name="member"
//                   component="div"
//                   className="text-red-500 text-sm mt-1"
//                 />

//                 <p className="mt-2 text-sm text-gray-600">
//                   You are: <span className="font-medium">{values.member}</span>
//                 </p>
//               </motion.div>

//               {/* Submit */}
//               <motion.button
//                 type="submit"
//                 disabled={isSubmitting}
//                 whileHover={{ scale: 1.05 }}
//                 whileTap={{ scale: 0.95 }}
//                 initial={{ opacity: 0 }}
//                 animate={{ opacity: 1 }}
//                 transition={{ delay: 0.7 }}
//                 className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 rounded-xl font-semibold shadow-lg hover:shadow-2xl transition-all disabled:opacity-50"
//               >
//                 {isSubmitting ? "Signing up..." : "Sign Up"}
//               </motion.button>

//               {/* Login link */}
//               <motion.p
//                 initial={{ opacity: 0 }}
//                 animate={{ opacity: 1 }}
//                 transition={{ delay: 0.8 }}
//                 className="mt-4 text-sm text-gray-500"
//               >
//                 Already have an account?{" "}
//                 <a href="/login" className="text-purple-600 font-medium">
//                   Login
//                 </a>
//               </motion.p>
//             </Form>
//           )}
//         </Formik>
//       </motion.div>
//     </div>
//   );
// };

// export default SignupPage;
