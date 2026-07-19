# Backend

Backend service built using Express, TypeScript, PostgreSQL, and Drizzle ORM.

## Tech Stack

* Node.js
* TypeScript
* Express.js
* PostgreSQL
* Drizzle ORM
* Docker

---

## Prerequisites

Make sure the following tools are installed:

* Node.js
* pnpm
* Docker Desktop

---

## Installation

Clone the repository:

```bash
git clone <repository-url>
cd <repository-name>
```

Install dependencies:

```bash
pnpm install
```

---

## Environment Variables

1. Copy `.env.example`
2. Rename it to `.env`
3. Replace the placeholder values with your own credentials.

> **Never commit your actual `.env` file or any real secrets to Git. Only commit `.env.example`.**

---

## Database Setup

### 1. Start PostgreSQL using Docker

```bash
docker compose up -d
```

Verify that the container is running:

```bash
docker ps
```

### Stop PostgreSQL

```bash
docker compose down
```

Stops and removes the running Docker containers.

### 2. Apply Database Migrations

```bash
pnpm db:migrate
```

### 3. Seed Initial Data

This will insert the default branches and semesters required by the application.

```bash
pnpm db:seed
```

### 4. Open Drizzle Studio (Optional)

```bash
pnpm studio
```

---

## Database Migration Workflow

> **Migration files are version-controlled and must always be committed to the repository.**

### First-Time Project Setup

After cloning or pulling the project:

```bash
pnpm db:migrate
pnpm db:seed
```

> **Note:** `db:seed` uses `ON CONFLICT DO NOTHING`, so it is safe to run multiple times.

---

### When You Modify the Database Schema

If you make changes to `src/db/schema.ts`, generate a new migration and apply it:

```bash
pnpm db:generate
pnpm db:migrate
```

Then commit the generated migration files:

```bash
git add .
git commit -m "feat(db): describe your schema change"
git push
```

---

### For Other Team Members

After pulling the latest changes:

```bash
git pull
pnpm db:migrate
pnpm db:seed
```

> **Do not run `pnpm db:generate` unless you have modified `src/db/schema.ts`.**

---

## Run Development Server

```bash
pnpm dev
```

The server should be available at:

```text
http://localhost:8080
```

---

## Available Routes

### Root Route

```http
GET /
```

Response:

```json
{
  "success": true,
  "message": "Backend server is running"
}
```

### Health Check Route

```http
GET /api/health
```

Response:

```json
{
  "status": "healthy"
}
```

---

## Build Project

```bash
pnpm build
```

Builds the application into the `dist` directory.

---

## Start Production Server

```bash
pnpm start
```

Runs the compiled production build.

---

## Project Structure

```text
.
├── drizzle/
│   ├── 0000_xxxxx.sql
│   └── meta/
│
├── src/
│   ├── app/
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
│   ├── cleanup.ts
│   ├── index.ts
│   └── seeds/
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

## Naming Convention

### Folders

Use lowercase or kebab-case.

Examples:

```text
auth/
students/
non-teaching-staff/
placement-cell/
```

### Files

Use the feature + suffix style.

Examples:

```text
auth.controller.ts
auth.service.ts
auth.routes.ts
auth.validator.ts
token.util.ts
hash.util.ts
```

### Database Columns

Use snake_case.

Examples:

```text
first_name
password_hash
created_at
updated_at
```

### Types, Interfaces, Classes

Use PascalCase.

Examples:

```ts
interface LoginRequest {}
type UserRole = ...
class AuthService {}
```

### Functions and Variables

Use camelCase.

Examples:

```ts
const loginUser = async () => {}
const passwordHash = "..."
```

---

## Available Scripts

```bash
pnpm dev
```

Runs the development server in watch mode.

```bash
pnpm build
```

Compiles TypeScript source code.

```bash
pnpm start
```

Runs the production build.

```bash
pnpm db:generate
```

Generates migration files from the Drizzle schema. Use only when the schema changes.

```bash
pnpm db:migrate
```

Applies pending database migrations.

```bash
pnpm db:seed
```

Seeds the database with default application data (e.g. branches and semesters).

```bash
pnpm studio
```

Opens Drizzle Studio for database inspection and management.
