import { db } from "../../db/index.js"; // Ensure this path is correct
import { users, nonTeachingStaff } from "../../db/schema.js"; // Ensure this path is correct
import { eq } from "drizzle-orm";
import bcrypt from "bcrypt";
// Fixed: Using 'import type' for TypeScript types
import type { CreateStaffInput, UpdateStaffInput } from "./non-teaching-staff.validator.js";

export class NonTeachingStaffService {
  async createStaff(data: CreateStaffInput) {
    return await db.transaction(async (tx) => {
      const hashedPassword = await bcrypt.hash(data.password, 10);

      // 1. Create User entry
      const insertedUsers = await tx.insert(users).values({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        gender: data.gender,
        passwordHash: hashedPassword,
        role: "non_teaching_staff",
        isVerified: true,
      }).returning({ id: users.id });

      const newUser = insertedUsers[0];
      // Fixed: Safety check to ensure newUser is defined
      if (!newUser) {
        throw new Error("Failed to create user record");
      }

      // 2. Create Staff entry
      const insertedStaff = await tx.insert(nonTeachingStaff).values({
        userId: newUser.id,
        staffRole: data.staffRole,
        department: data.department,
        branchId: data.branchId,
      }).returning();

      const staff = insertedStaff[0];
      if (!staff) {
        throw new Error("Failed to create staff record");
      }

      return { ...newUser, ...staff };
    });
  }

  async getAllStaff() {
    return await db
      .select({
        id: users.id,
        firstName: users.firstName,
        lastName: users.lastName,
        email: users.email,
        phone: users.phone,
        staffRole: nonTeachingStaff.staffRole,
        department: nonTeachingStaff.department,
        branchId: nonTeachingStaff.branchId,
        isActive: users.isActive,
      })
      .from(nonTeachingStaff)
      .innerJoin(users, eq(nonTeachingStaff.userId, users.id));
  }

  async getStaffById(userId: string) {
    const result = await db
      .select()
      .from(nonTeachingStaff)
      .where(eq(nonTeachingStaff.userId, userId))
      .innerJoin(users, eq(nonTeachingStaff.userId, users.id))
      .limit(1);
    
    return result[0] || null;
  }

  async updateStaff(userId: string, data: UpdateStaffInput) {
    return await db.transaction(async (tx) => {
      if (data.firstName || data.lastName || data.email || data.phone || data.gender) {
        await tx.update(users)
          .set({
            ...data,
            updatedAt: new Date(),
          })
          .where(eq(users.id, userId));
      }

      if (data.staffRole || data.department || data.branchId) {
        await tx.update(nonTeachingStaff)
          .set({
            staffRole: data.staffRole,
            department: data.department,
            branchId: data.branchId,
            updatedAt: new Date(),
          })
          .where(eq(nonTeachingStaff.userId, userId));
      }

      return { message: "Staff updated successfully" };
    });
  }

  async deleteStaff(userId: string) {
    return await db.delete(users).where(eq(users.id, userId));
  }
}