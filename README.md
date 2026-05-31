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

Create a `.env` file in the project root using `.env.example`.

Example:

```env
PORT=5000

DATABASE_URL=postgresql://<username>:<password>@<host>:<port>/<database_name>
```

---

## Database Setup

Start PostgreSQL using Docker:

```bash
docker compose up -d
```

Verify that the container is running:

```bash
docker ps
```

Apply database migrations:

```bash
pnpm db:migrate
```

Open Drizzle Studio:

```bash
pnpm studio
```

---

## Important Note About Migrations

Migration files are already tracked in the repository.

For normal project setup, run:

```bash
pnpm db:migrate
```

Do **not** run:

```bash
pnpm db:generate
```

unless you have modified the database schema.

`db:generate` should only be used when making changes to `src/db/schema.ts`.

Workflow for schema changes:

```bash
pnpm db:generate
pnpm db:migrate
git add .
git commit
git push
```

Workflow for teammates after pulling changes:

```bash
git pull
pnpm db:migrate
```

---

## Run Development Server

```bash
pnpm dev
```

The server should be available at:

```text
http://localhost:5000
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
GET /health
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

Compiles TypeScript source code into the `dist` directory.

---

## Start Production Server

```bash
pnpm start
```

Runs the compiled production build.

---

## Project Structure

```text
src/
├── app/
│   ├── auth/
│   │   ├── middleware/
│   │   │   └── auth-middleware.ts
│   │   ├── controller.ts
│   │   ├── models.ts
│   │   ├── routes.ts
│   │   └── utils/
│   │       └── token.ts
│   │
│   ├── middlewares/
│   │   └── error-handler.ts
│   │
│   └── index.ts
│
├── db/
│   ├── index.ts
│   └── schema.ts
│
└── index.ts
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
pnpm studio
```

Opens Drizzle Studio for database inspection and management.