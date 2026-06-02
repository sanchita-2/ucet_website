# Architecture

This document explains the project structure, module boundaries, and naming conventions for the backend.

---

## 1) High-Level Architecture

The backend follows a **feature-based modular architecture**.

Each feature owns its own:

* controller
* service
* routes
* validators
* types

This keeps the codebase clean, scalable, and easy to work on as a team.

---

## 2) Main Layers

### App Layer

Contains the HTTP/API modules.

Examples:

* `auth`
* `students`
* `teachers`
* `non-teaching-staff`
* `branch`
* `semester`
* `subject`
* `timetable`
* `enrollment`
* `marks`
* `placement-cell`
* `placement`

### Database Layer

Contains Drizzle schema, relations, and migrations.

Examples:

* `schema.ts`
* `relations.ts`
* `index.ts`
* `migrations/`

### Shared Layer

Contains reusable code used across modules.

Examples:

* constants
* types
* utils
* validators

### Config Layer

Contains application configuration.

Examples:

* environment variables
* CORS settings
* JWT config
* app config

---

## 3) The project follows a feature-based modular architecture:

```text
src/
├── app/
│   ├── auth/
│   ├── students/
│   ├── teachers/
│   ├── non-teaching-staff/
│   ├── branch/
│   ├── semester/
│   ├── subject/
│   ├── timetable/
│   ├── enrollment/
│   ├── marks/
│   ├── placement-cell/
│   ├── placement/
│   ├── middlewares/
│   └── index.ts
│
├── db/
│   ├── schema.ts
│   ├── relations.ts
│   ├── index.ts
│   └── migrations/
│
├── shared/
│   ├── constants/
│   ├── types/
│   ├── utils/
│   └── validators/
│
├── config/
│
└── index.ts
```

---

## 4) Module Responsibilities

### auth

Handles authentication and authorization.

Responsibilities:

* register
* login
* logout
* refresh token
* forgot password
* reset password
* email verification
* role-based access control

### students

Handles student profile and student-specific APIs.

Responsibilities:

* student profile
* academic details
* student dashboard data

### teachers

Handles teacher profile and teacher-specific APIs.

Responsibilities:

* teacher profile
* assigned subjects
* teacher dashboard data

### non-teaching-staff

Handles staff profile and staff-specific APIs.

Responsibilities:

* staff profile
* department-related access

### branch

Handles branch master data.

### semester

Handles semester master data.

### subject

Handles subject master data.

### timetable

Handles timetable creation and management.

### enrollment

Handles student subject enrollment.

### marks

Handles student marks and result data.

### placement-cell

Handles placement coordination setup.

### placement

Handles placement records for students.

---

## 5) File Naming Convention

### Folder Naming

Use lowercase or kebab-case.

Examples:

* `auth/`
* `students/`
* `non-teaching-staff/`
* `placement-cell/`

### File Naming

Use feature + suffix naming.

Examples:

* `auth.controller.ts`
* `auth.service.ts`
* `auth.routes.ts`
* `auth.validator.ts`
* `token.util.ts`
* `hash.util.ts`

### Database Column Naming

Use snake_case.

Examples:

* `first_name`
* `password_hash`
* `created_at`
* `updated_at`

### TypeScript Types, Interfaces, and Classes

Use PascalCase.

Examples:

* `LoginRequest`
* `UserRole`
* `AuthService`

### Functions and Variables

Use camelCase.

Examples:

* `loginUser`
* `passwordHash`
* `isVerified`

---

## 6) Auth Flow Summary

1. User registers or is created by admin.
2. Password is hashed before saving.
3. JWT access token and refresh token are issued on login.
4. Protected routes use authentication middleware.
5. Authorization middleware checks the user role.
6. Role-based modules handle the rest of the request.

---

## 7) Database Design Summary

The database schema follows a normalized design to ensure scalability, consistency, and maintainability.

Key tables include:

* `users`
* `refresh_tokens`
* `password_reset_tokens`
* `email_verification_tokens`
* `teachers`
* `students`
* `non_teaching_staff`
* `academic_details`
* `branches`
* `semesters`
* `subjects`
* `teacher_subjects`
* `timetables`
* `enrollments`
* `marks`
* `placement_cells`
* `placements`

This separation supports clean auth, clear role mapping, and scalable ERP features.

---

## 8) Team Working Rule

To keep the codebase clean:

* one module per folder
* one responsibility per file
* consistent naming across the team
* schema changes only by one owner or one agreed process

This reduces merge conflicts and keeps feature development parallel.
