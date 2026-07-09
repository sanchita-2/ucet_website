import { and, desc, eq, isNull } from "drizzle-orm";

import { db } from "../../../db/index.js";
import { users } from "../../../db/schema.js";

import type {
  UpdateUserInput,
} from "../validators/user.validator.js";


export const getMyProfile = async (
  userId: string,
) => {
  const [user] = await db
    .select({
      id: users.id,
      firstName: users.firstName,
      lastName: users.lastName,
      email: users.email,
      phone: users.phone,
      gender: users.gender,
      role: users.role,
      isActive: users.isActive,
      isVerified: users.isVerified,
      createdAt: users.createdAt,
    })
    .from(users)
    .where(
      and(
        eq(users.id, userId),
        isNull(users.deletedAt),
      ),
    );

  if (!user) {
    throw new Error("User not found.");
  }

  return user;
};


export const getUserById = async (
  id: string,
) => {
  const [user] = await db
    .select({
      id: users.id,
      firstName: users.firstName,
      lastName: users.lastName,
      email: users.email,
      phone: users.phone,
      gender: users.gender,
      role: users.role,
      isActive: users.isActive,
      isVerified: users.isVerified,
      createdAt: users.createdAt,
    })
    .from(users)
    .where(
      and(
        eq(users.id, id),
        isNull(users.deletedAt),
      ),
    );

  if (!user) {
    throw new Error("User not found.");
  }

  return user;
};

export const getAllUsers = async () => {
  return await db
    .select({
      id: users.id,
      firstName: users.firstName,
      lastName: users.lastName,
      email: users.email,
      phone: users.phone,
      gender: users.gender,
      role: users.role,
      isActive: users.isActive,
      isVerified: users.isVerified,
      createdAt: users.createdAt,
    })
    .from(users)
    .where(isNull(users.deletedAt))
    .orderBy(desc(users.createdAt));
};


export const updateUser = async (
  id: string,
  data: UpdateUserInput,
) => {
  // Check if user exists
  const [existingUser] = await db
    .select()
    .from(users)
    .where(
      and(
        eq(users.id, id),
        isNull(users.deletedAt),
      ),
    );

  if (!existingUser) {
    throw new Error("User not found.");
  }


  if (
    data.phone &&
    data.phone !== existingUser.phone
  ) {
    const [phoneExists] = await db
      .select({
        id: users.id,
      })
      .from(users)
      .where(
        and(
          eq(users.phone, data.phone),
          isNull(users.deletedAt),
        ),
      );

    if (phoneExists) {
      throw new Error(
        "Phone number already exists.",
      );
    }
  }

  const [updatedUser] = await db
    .update(users)
    .set({
      ...data,
      updatedAt: new Date(),
    })
    .where(eq(users.id, id))
    .returning({
      id: users.id,
      firstName: users.firstName,
      lastName: users.lastName,
      email: users.email,
      phone: users.phone,
      gender: users.gender,
      role: users.role,
      isActive: users.isActive,
      isVerified: users.isVerified,
      createdAt: users.createdAt,
      updatedAt: users.updatedAt,
    });

  return updatedUser;
};


  
export const deleteUser = async (
  id: string,
) => {
  const [existingUser] = await db
    .select({
      id: users.id,
    })
    .from(users)
    .where(
      and(
        eq(users.id, id),
        isNull(users.deletedAt),
      ),
    );

  if (!existingUser) {
    throw new Error("User not found.");
  }

  await db
    .update(users)
    .set({
      isActive: false,
      deletedAt: new Date(),
      updatedAt: new Date(),
    })
    .where(
      and(
        eq(users.id, id),
        isNull(users.deletedAt),
      ),
    );

  return {
    message: "User deleted successfully.",
  };
};