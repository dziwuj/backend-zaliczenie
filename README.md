# Prisma Guide — Migration & Developer Notes

This README focuses only on the Prisma v7 parts of the project: schema, client generation, common commands, and troubleshooting guidance related to the Prisma migration.

Relevant files

-   `prisma/schema.prisma` — schema with models and UUID string IDs
-   `prisma.config.ts` — Prisma runtime configuration (adapter settings)
-   `src/lib/db-prisma.ts` — Prisma wrapper used by the app

Quick facts

-   This project uses Prisma v7 and `@prisma/adapter-pg` as the adapter for PostgreSQL.
-   Primary keys are UUID strings across the schema and API surface.
-   The app maps Prisma's camelCase model fields to the API's snake_case fields in `src/lib/db.ts`/`src/lib/db-prisma.ts`.

Essential commands (PowerShell)

```powershell
# install deps
yarn install

# generate Prisma client
yarn prisma:generate

# apply migrations (interactive)
yarn prisma:migrate dev --name init

# push schema to DB without migrations
yarn prisma db push

# open Prisma Studio (web UI)
yarn prisma studio
```

Notes on using Prisma in the app

-   Use a singleton `PrismaClient` to avoid multiple instances in development. See `src/lib/db-prisma.ts` for the project's pattern.
-   When you change the schema, run `yarn prisma:generate` to update the generated client.

Adapter & TypeScript notes

-   Runtime adapter: `@prisma/adapter-pg` is used to integrate Prisma with the project's Postgres Pool.
-   Type resolution: in some TypeScript setups the adapter's `.d.ts` may not be picked up automatically. If you see errors like "Cannot find module '@prisma/adapter-pg' or its corresponding type declarations", options to resolve:
    -   Add a local type declaration file: `src/types/prisma-adapter-pg.d.ts` with `declare module '@prisma/adapter-pg';`
    -   Ensure `tsconfig.json` includes `src/types` (or `node_modules/@prisma/adapter-pg/dist`) in `typeRoots`/`include`.

Schema conventions & API mapping

-   Database models use camelCase fields; the HTTP API exposes snake_case fields (for example the reservation model uses `fromTs` in Prisma but the API uses `from_ts`). Mapping helpers exist in `src/lib/db.ts`.
-   IDs are UUID strings (type `String` in Prisma schema with `@id @default(uuid())`). Make sure client code and route handlers accept string IDs.

Troubleshooting

-   Next/TypeScript validator errors after file moves:

    -   If Next's generated types reference moved files (errors under `.next/dev/types/validator.ts`), remove the `.next` directory and rebuild:
        ```powershell
        Remove-Item -Recurse -Force .next
        yarn build
        ```

-   Prisma DB connection issues:

    -   Verify `DATABASE_URL` in `.env.local` (or in the Docker Compose service). If running via Docker Compose, make sure the database container is healthy and accessible.

-   Schema changes:
    -   If you modify models, run `yarn prisma:generate` and either `yarn prisma:migrate dev` or `yarn prisma db push` depending on your workflow. Prefer `migrate dev` for repeatable migration history.

Best practices

-   Keep Prisma client generation part of your CI/build process so generated client code is always present.
-   Use explicit mapping functions between Prisma types and public API shapes to avoid leaking internal field names.

If you want this README expanded with examples of the Prisma schema, migration history, or the adapter wiring used in `src/lib/db-prisma.ts`, say the word and I will add those sections.

MIT

**Env example (.env)**

Below is an example of environment variables the app expects. The real `.env` file is not committed to source control — keep secrets out of the repo and replace placeholders with secure values for your environment.

```
# PostgreSQL connection used by Prisma. Example (Docker):
# postgres://USER:PASSWORD@HOST:PORT/DATABASE
DATABASE_URL=postgresql://postgres:postgres@db:5432/rental

# NextAuth / session secret
NEXTAUTH_SECRET="replace-with-a-secure-random-value"
NEXTAUTH_URL="http://localhost:3000"

```

Notes:

-   Replace any values containing `replace-` or example credentials with secure secrets before running in production.
-   When running in Docker Compose the DB host is typically the service name (example uses `db`); when running directly on your machine replace `db` with `localhost` and adjust the port.
-   If you change the Prisma schema, run `yarn prisma:generate` and apply migrations (`yarn prisma:migrate dev`) or `yarn prisma db push` as appropriate.

# 🚗 Car Rental App (Next.js + Prisma + PostgreSQL)

This repository is a full-stack car rental application using Next.js (App Router), Prisma v7, and PostgreSQL. It includes admin and user dashboards, vehicle management, and reservation workflows.

This README was updated to reflect the migration from node-postgres to Prisma and other build/runtime notes.

**Quick summary:**

-   Next.js 16 (App Router)
-   Prisma v7 with `@prisma/adapter-pg`
-   PostgreSQL (containerized via Docker Compose)
-   UUID string IDs for primary keys

--

**Requirements**

-   Node 18+ (use the Node version configured for the project)
-   Yarn (v1.x) or npm
-   Docker & Docker Compose (for running Postgres locally)

**Setup (local development)**

1. Install dependencies

```powershell
yarn install
```

2. Environment

Copy and edit environment file:

```powershell
copy .\.env.example .\.env.local
# Edit .env.local and set at least:
# NEXTAUTH_SECRET, DATABASE_URL (if not using docker-compose defaults)
```

3. Prisma client

Prisma client is generated automatically during Docker startup/build, but you can generate it locally if needed:

```powershell
yarn prisma:generate
```

4. Run in development

```powershell
yarn dev
```

Open http://localhost:3000

--

**Docker (recommended for local testing)**

The repo includes `docker-compose.yml` which starts Postgres and the web service. By default the DB is mapped to a non-conflicting host port (see `docker-compose.yml`).

Start containers:

```powershell
yarn docker:up
```

The web app will be reachable at `http://localhost:3000`.

--

**Database & Migrations**

-   The project uses Prisma v7. The schema lives in `prisma/schema.prisma` and expects UUID string IDs for primary keys.
-   Migrations (if used) and client generation are handled via Prisma CLI. To apply migrations locally run:

```powershell
yarn prisma:migrate
# or, if you prefer to just push the schema without migrations:
yarn prisma:db:push
```

--

**API & Admin**

-   Admin routes are under `src/app/api/admin/*` (cars, rentals, users, vehicles).
-   Demo accounts (seeded by the container) are available with password `password123`:
    -   `user@rental.com` (regular user)
    -   `admin@rental.com` (administrator)

**Important: request payloads**

-   The admin PATCH handler for rentals accepts either:
    -   a status-only update (JSON `{ "status": "approved" }`), or
    -   a full reservation edit (`user_id`, `vehicle_id`, `from_ts`, `to_ts`, optional `status`).

--

**Troubleshooting**

-   Build/type-check errors from Next's generated types (validator) can appear when file moves or route-group names change. If you hit a validator/import error you can try:
    -   Remove Next cache and rebuild:

```powershell
Remove-Item -Recurse -Force .next
yarn build
```

-   In this branch there are a few local `.d.ts` shims under `src/types/` added to avoid transient TypeScript issues with generated Next validator types. If you see type errors referencing `React.ReactNode` or the Prisma adapter type resolution, check `src/types/` and your `tsconfig.json` `typeRoots`/`include` settings.

-   Sass warnings about `darken()` are non-fatal but recommended to fix by replacing `darken()` with `color.adjust()` in `src/styles/globals.scss`.

--

**Scripts**

-   `yarn dev` — Start dev server (Next.js)
-   `yarn build` — Build production assets
-   `yarn start` — Start production server (after build)
-   `yarn prisma:generate` — Generate Prisma client
-   `yarn docker:up` — Start Postgres + app with Docker Compose
-   `yarn docker:down` — Stop containers

--

If anything in this README is out of date for your environment, open an issue or submit a PR with suggested changes.

---

MIT

# 🚗 Car Rental App (Next.js + PostgreSQL)

This is a full-stack car rental application built with Next.js 16, React 19, PostgreSQL 15, and node-postgres. It features authentication, admin/user dashboards, car management, and rental workflows. The project is ready for local development and includes Docker support for the database.

---

## 🚀 Quick Start

### 1. Clone & Install

```bash
git clone <repo-url>
cd backend-zaliczenie
yarn install
```

`

### 2. Environment Setup

Copy the example environment file and set a secret:

```powershell
copy .\.env.example .\.env.local
# Edit .env.local and set NEXTAUTH_SECRET to a random string
```

### 3. Start Database & App

Start PostgreSQL and the app using Docker Compose:

```bash
yarn docker:up
```

The app will be available at [http://localhost:3000](http://localhost:3000)

---

## 🧑‍💻 Demo Accounts

All demo accounts use the password: `password123`

### 👤 Regular User

-   **Email:** `user@rental.com`
-   **Password:** `password123`
-   **Access:** Browse cars, create reservations, view own rental history

### 👑 Administrator

-   **Email:** `admin@rental.com`
-   **Password:** `password123`
-   **Access:** Full access including:
    -   All user features
    -   Manage car inventory (add, edit, delete)
    -   View all rentals across all users
    -   Admin dashboard

---

## 🗂️ Project Structure

-   `src/app/` — Next.js app directory (public, dashboard, admin, API routes)
-   `src/components/` — Reusable UI components
-   `src/store/` — Zustand state management
-   `src/lib/` — Database adapters, auth, helpers
-   `src/styles/` — SCSS styles (utility, admin, global)
-   `docker/` — Database seed/init scripts

---

## 🐘 Database & Seed Data

-   PostgreSQL 15 runs in Docker (see `docker-compose.yml`)
-   On first run, the database is seeded with:
    -   2 demo users (see above)
    -   5 sample vehicles (Toyota Corolla, Ford Focus, Honda Civic, BMW 3 Series, Tesla Model 3)
-   Seed logic is in `docker/init.sql` (auto-run by Postgres container)

---

## 📝 Features

-   User authentication (local, session-based)
-   Browse, reserve, and view cars
-   User dashboard for rental history
-   Admin dashboard for car and rental management
-   Responsive UI, utility-first SCSS
-   TypeScript strict mode, no `any` types

---

## 🛠️ Scripts

-   `yarn dev` — Start Next.js in development mode
-   `yarn build` — Build for production
-   `yarn start` — Start production server
-   `yarn docker:up` — Start Postgres and app via Docker Compose
-   `yarn docker:down` — Stop Docker Compose services

---

## ⚙️ Configuration

-   Environment variables: see `.env.example`
-   Database connection: `DATABASE_URL` in `.env.local` (default works with provided Docker setup)

---

## 📚 Tech Stack

-   Next.js 16, React 19
-   PostgreSQL 15, node-postgres
-   Zustand (state), Auth.js (auth), bcryptjs (passwords)
-   TypeScript 5, SCSS

---

## 🐳 Docker

The included `docker-compose.yml` spins up both the app and a Postgres database. The database is seeded automatically on first run.

---

## License

MIT
