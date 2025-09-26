import * as z from "zod";

// ✅ Zod schema
export const signupSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});



// ✅ Zod schema
export const loginSchema = z.object({
  email: z.string().email("Invalid email address").min(3, "Username must be at least 3 characters"),
  password: z.string().min(6, "Password must be at least 6 characters").max(20, "Password must be at most 20 characters"),
});


