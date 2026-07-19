import { sql } from "drizzle-orm";
import {
  pgTable,
  pgEnum,
  uuid,
  varchar,
  integer,
  boolean,
  timestamp,
  date,
  time,
  decimal,
  uniqueIndex,
  index,
  check,
  unique,
} from "drizzle-orm/pg-core";

export const roleEnum = pgEnum("user_role", [
  "admin",
  "teacher",
  "student",
  "non_teaching_staff",
]);

export const enrollmentStatusEnum = pgEnum("enrollment_status", [
  "active",
  "completed",
  "dropped",
]);

export const placementStatusEnum = pgEnum("placement_status", [
  "pending",
  "interviewing",
  "offered",
  "placed",
  "rejected",
  "unplaced",
]);

export const genderEnum = pgEnum("gender_type", [
  "male",
  "female",
  "other",
  "prefer_not_to_say",
]);

export const teacherDesignationEnum = pgEnum("teacher_designation", [
  "assistant_professor",
  "associate_professor",
  "professor",
  "hod",
]);

export const staffRoleEnum = pgEnum("staff_role", [
  "clerk",
  "librarian",
  "lab_assistant",
  "admin_staff",
  "maintenance",
]);

export const dayOfWeekEnum = pgEnum("day_of_week", [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
]);

export const placementTypeEnum = pgEnum("placement_type", [
  "on_campus",
  "off_campus",
  "internship",
  "ppo",
]);

export const admissionTypeEnum = pgEnum("admission_type", [
  "regular",
  "lateral_entry",
]);

export const users = pgTable(
  "users",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    firstName: varchar("first_name", { length: 100 }).notNull(),
    lastName: varchar("last_name", { length: 100 }).notNull(),
    email: varchar("email", { length: 322 }).notNull().unique(),
    phone: varchar("phone", { length: 20 }).notNull().unique(),
    gender: genderEnum("gender").notNull(),
    passwordHash: varchar("password_hash", { length: 255 }).notNull(),
    passwordVersion: integer("password_version").default(1).notNull(),
    role: roleEnum("role").notNull(),
    isActive: boolean("is_active").default(true).notNull(),
    isVerified: boolean("is_verified").default(false).notNull(),
    emailVerifiedAt: timestamp("email_verified_at"),
    lastLoginAt: timestamp("last_login_at"),
    failedLoginAttempts: integer("failed_login_attempts").default(0).notNull(),
    lockedUntil: timestamp("locked_until"),
    passwordChangedAt: timestamp("password_changed_at"),
    deletedAt: timestamp("deleted_at"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    check(
      "failed_login_attempts_check",
      sql`${table.failedLoginAttempts} >= 0`,
    ),
  ],
);

export const notificationCategoryEnum = pgEnum("notification_category", [
  "general",
  "academic",
  "exam",
  "placement",
  "event",
  "holiday",
]);

export const notificationPriorityEnum = pgEnum("notification_priority", [
  "normal",
  "high",
  "urgent",
]);

export const refreshTokens = pgTable(
  "refresh_tokens",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    tokenHash: varchar("token_hash", { length: 255 }).notNull().unique(),
    expiresAt: timestamp("expires_at").notNull(),
    revoked: boolean("revoked").default(false).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [index("idx_refresh_tokens_user_id").on(table.userId)],
);

export const passwordResetTokens = pgTable(
  "password_reset_tokens",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    tokenHash: varchar("token_hash", { length: 255 }).notNull().unique(),
    expiresAt: timestamp("expires_at").notNull(),
    used: boolean("used").default(false).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [index("idx_pwd_tokens_user_id").on(table.userId)],
);

export const emailVerificationTokens = pgTable(
  "email_verification_tokens",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    tokenHash: varchar("token_hash", { length: 255 }).notNull().unique(),
    expiresAt: timestamp("expires_at").notNull(),
    used: boolean("used").default(false).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [index("idx_email_tokens_user_id").on(table.userId)],
);

export const branches = pgTable("branches", {
  id: uuid("id").defaultRandom().primaryKey(),
  branchCode: varchar("branch_code", { length: 20 }).notNull().unique(),
  branchName: varchar("branch_name", { length: 255 }).notNull().unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

export const semesters = pgTable(
  "semesters",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    semesterNumber: integer("semester_number").notNull().unique(),

    year: integer("year").notNull(),

    createdAt: timestamp("created_at").defaultNow().notNull(),

    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    check(
      "semester_number_check",
      sql`${table.semesterNumber} >= 1 AND ${table.semesterNumber} <= 8`,
    ),
    check("year_check", sql`${table.year} >= 1 AND ${table.year} <= 4`),
    check(
      "semester_year_match",
      sql`
    (
      (${table.semesterNumber} IN (1,2) AND ${table.year}=1)
      OR
      (${table.semesterNumber} IN (3,4) AND ${table.year}=2)
      OR
      (${table.semesterNumber} IN (5,6) AND ${table.year}=3)
      OR
      (${table.semesterNumber} IN (7,8) AND ${table.year}=4)
    )
  `,
    ),
  ],
);

export const teachers = pgTable("teachers", {
  userId: uuid("user_id")
    .primaryKey()
    .references(() => users.id, { onDelete: "cascade" }),
  designation: teacherDesignationEnum("designation").notNull(),
  branchId: uuid("branch_id")
    .notNull()
    .references(() => branches.id, { onDelete: "restrict" }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

export const students = pgTable("students", {
  userId: uuid("user_id")
    .primaryKey()
    .references(() => users.id, {
      onDelete: "cascade",
    }),

  regNo: varchar("reg_no", { length: 50 }).notNull().unique(),

  branchId: uuid("branch_id")
    .notNull()
    .references(() => branches.id, {
      onDelete: "restrict",
    }),

  currentSemesterId: uuid("current_semester_id")
    .notNull()
    .references(() => semesters.id, {
      onDelete: "restrict",
    }),

  createdAt: timestamp("created_at").defaultNow().notNull(),

  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

export const nonTeachingStaff = pgTable("non_teaching_staff", {
  userId: uuid("user_id")
    .primaryKey()
    .references(() => users.id, { onDelete: "cascade" }),
  staffRole: staffRoleEnum("staff_role").notNull(),
  department: varchar("department", { length: 100 }).notNull(),
  branchId: uuid("branch_id")
    .notNull()
    .references(() => branches.id, { onDelete: "restrict" }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

export const academicYears = pgTable(
  "academic_years",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    startYear: integer("start_year").notNull(),

    endYear: integer("end_year").notNull(),

    isCurrent: boolean("is_current").default(false).notNull(),

    createdAt: timestamp("created_at").defaultNow().notNull(),

    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    unique("academic_year_unique").on(table.startYear, table.endYear),

    check(
      "academic_year_check",
      sql`${table.endYear} = ${table.startYear} + 1`,
    ),
  ],
);

export const academicDetails = pgTable("academic_details", {
  userId: uuid("user_id")
    .primaryKey()
    .references(() => students.userId, {
      onDelete: "cascade",
    }),

  rollNo: varchar("roll_no", { length: 50 }).notNull().unique(),

  dateOfAdmission: date("date_of_admission", {
    mode: "date",
  }).notNull(),

  admissionType: admissionTypeEnum("admission_type").notNull(),

  entrySemesterId: uuid("entry_semester_id")
    .notNull()
    .references(() => semesters.id, {
      onDelete: "restrict",
    }),

  createdAt: timestamp("created_at").defaultNow().notNull(),

  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

export const subjects = pgTable(
  "subjects",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    subjectCode: varchar("subject_code", { length: 50 }).notNull().unique(),
    subjectName: varchar("subject_name", { length: 255 }).notNull(),
    branchId: uuid("branch_id")
      .notNull()
      .references(() => branches.id, { onDelete: "restrict" }),
    semesterId: uuid("semester_id")
      .notNull()
      .references(() => semesters.id, { onDelete: "restrict" }),
    credits: integer("credits").notNull(),
    isActive: boolean("is_active").default(true).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [check("credits_check", sql`${table.credits} > 0`)],
);

export const teacherSubjects = pgTable(
  "teacher_subjects",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    teacherId: uuid("teacher_id")
      .notNull()
      .references(() => teachers.userId, { onDelete: "cascade" }),
    subjectId: uuid("subject_id")
      .notNull()
      .references(() => subjects.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    uniqueIndex("idx_teacher_subjects_unique").on(
      table.teacherId,
      table.subjectId,
    ),
  ],
);

export const timetables = pgTable(
  "timetables",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    subjectId: uuid("subject_id")
      .notNull()
      .references(() => subjects.id, { onDelete: "restrict" }),
    teacherId: uuid("teacher_id")
      .notNull()
      .references(() => teachers.userId, { onDelete: "restrict" }),
    branchId: uuid("branch_id")
      .notNull()
      .references(() => branches.id, { onDelete: "restrict" }),
    semesterId: uuid("semester_id")
      .notNull()
      .references(() => semesters.id, { onDelete: "restrict" }),
    section: varchar("section", { length: 10 }).notNull(),
    day: dayOfWeekEnum("day").notNull(),
    startTime: time("start_time", { precision: 0 }).notNull(),
    endTime: time("end_time", { precision: 0 }).notNull(),
    roomNo: varchar("room_no", { length: 50 }).notNull(),
    academicYearId: uuid("academic_year_id")
      .notNull()
      .references(() => academicYears.id, {
        onDelete: "restrict",
      }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    uniqueIndex("idx_timetable_section_slot").on(
      table.academicYearId,
      table.branchId,
      table.semesterId,
      table.section,
      table.day,
      table.startTime,
      table.endTime,
    ),
    uniqueIndex("idx_timetable_teacher_slot").on(
      table.academicYearId,
      table.teacherId,
      table.day,
      table.startTime,
      table.endTime,
    ),
    uniqueIndex("idx_timetable_room_slot").on(
      table.academicYearId,
      table.roomNo,
      table.day,
      table.startTime,
      table.endTime,
    ),
  ],
);

export const enrollments = pgTable(
  "enrollments",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    studentId: uuid("student_id")
      .notNull()
      .references(() => students.userId, { onDelete: "cascade" }),
    subjectId: uuid("subject_id")
      .notNull()
      .references(() => subjects.id, { onDelete: "restrict" }),
    semesterId: uuid("semester_id")
      .notNull()
      .references(() => semesters.id, { onDelete: "restrict" }),
    academicYearId: uuid("academic_year_id")
      .notNull()
      .references(() => academicYears.id, {
        onDelete: "restrict",
      }),
    status: enrollmentStatusEnum("status").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    uniqueIndex("idx_student_enrollment_unique").on(
      table.studentId,
      table.subjectId,
      table.semesterId,
      table.academicYearId,
    ),
  ],
);

export const marks = pgTable(
  "marks",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    enrollmentId: uuid("enrollment_id")
      .notNull()
      .unique()
      .references(() => enrollments.id, { onDelete: "cascade" }),
    internalMarks: integer("internal_marks").notNull(),
    externalMarks: integer("external_marks").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    check(
      "internal_marks_check",
      sql`${table.internalMarks} >= 0 AND ${table.internalMarks} <= 30`,
    ),
    check(
      "external_marks_check",
      sql`${table.externalMarks} >= 0 AND ${table.externalMarks} <= 70`,
    ),
  ],
);

export const placementCells = pgTable(
  "placement_cells",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    coordinatorId: uuid("coordinator_id")
      .notNull()
      .references(() => teachers.userId, { onDelete: "restrict" }),
    branchId: uuid("branch_id")
      .notNull()
      .references(() => branches.id, { onDelete: "restrict" }),
    academicYearId: uuid("academic_year_id")
      .notNull()
      .references(() => academicYears.id, {
        onDelete: "restrict",
      }),
    isActive: boolean("is_active").default(true).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    uniqueIndex("idx_placement_cell_unique").on(
      table.coordinatorId,
      table.branchId,
      table.academicYearId,
    ),
  ],
);

export const placements = pgTable(
  "placements",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    studentId: uuid("student_id")
      .notNull()
      .references(() => students.userId, { onDelete: "cascade" }),
    cellId: uuid("cell_id")
      .notNull()
      .references(() => placementCells.id, { onDelete: "restrict" }),
    companyName: varchar("company_name", { length: 255 }).notNull(),
    jobRole: varchar("job_role", { length: 255 }).notNull(),
    package: decimal("package", { precision: 10, scale: 2 }).notNull(),
    academicYearId: uuid("academic_year_id")
      .notNull()
      .references(() => academicYears.id, {
        onDelete: "restrict",
      }),
    status: placementStatusEnum("status").notNull(),
    placementType: placementTypeEnum("placement_type").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [check("package_check", sql`${table.package} >= 0`)],
);

export const notifications = pgTable("notifications", {
  id: uuid("id").defaultRandom().primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  content: varchar("content", { length: 5000 }).notNull(),
  category: notificationCategoryEnum("category").notNull(),
  priority: notificationPriorityEnum("priority").default("normal").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});
