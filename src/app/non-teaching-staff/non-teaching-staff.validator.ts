import { z } from "zod";

export const createStaffSchema = z.object({
  // User fields
  firstName: z.string().min(1).max(100),
  lastName: z.string().min(1).max(100),
  email: z.string().email().max(322),
  phone: z.string().min(10).max(20),
  gender: z.enum(["male", "female", "other", "prefer_not_to_say"]),
  password: z.string().min(8),
  
  // Staff specific fields
  staffRole: z.enum(["clerk", "librarian", "lab_assistant", "admin_staff", "maintenance"]),
  department: z.string().min(1).max(100),
  branchId: z.string().uuid(),
});

export const updateStaffSchema = createStaffSchema.partial().omit({ password: true });

export type CreateStaffInput = z.infer<typeof createStaffSchema>;
export type UpdateStaffInput = z.infer<typeof updateStaffSchema>;