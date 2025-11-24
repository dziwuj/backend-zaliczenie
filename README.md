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

### 2. Start Database & App

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

## 🧩 Postgres (node-postgres) — Implementation Details (no Prisma)

This branch uses the native `node-postgres` (`pg`) client and a small helper layer rather than Prisma. Key points and files:

-   **DB helper:** `src/lib/db-pg.ts` — contains the `pg.Pool` configuration and helper functions used throughout the app (user lookup, vehicle queries, rental CRUD). Use this file to tweak pooling options or logging.
-   **Auth integration:** NextAuth credentials provider is wired to the PG helper at `src/app/api/auth/[...nextauth]/route.ts` (it calls `getUserByEmail` from `src/lib/db-pg.ts` and verifies passwords with `bcryptjs`). There is also a compatibility local endpoint at `src/app/api/auth/local/route.ts` which performs the same validation and is useful for quick API testing.
-   **ID shape & mapping:** Database columns use conventional SQL snake_case names (for example `password_hash`, `created_at`). API layer maps DB fields to the app shapes where needed. Check `src/lib/db-pg.ts` and the API route implementations under `src/app/api/` for mapping details.
-   **Migrations / Schema changes:** This setup uses raw SQL in `docker/init.sql` for initial schema and seeding. If you need repeatable migrations consider adding a lightweight migration tool (like `node-pg-migrate` or `sqitch`) — none is included by default in this branch.

Troubleshooting & tips

-   If the app cannot connect to Postgres, verify `DATABASE_URL` and the Docker Compose service name (the example config uses `db` as the host inside the Compose network). When running the app outside Docker, use `localhost` and the published port.
-   To inspect the DB, use `psql` or a GUI and connect with the same `DATABASE_URL` used by the app.
-   To change seeded data, edit `docker/init.sql` then run:

```powershell
# stop containers, rebuild and start
yarn docker:rebuild
```

Auth / sign-in hints

-   NextAuth is configured with a Credentials provider; sign-in from the frontend should call `signIn('credentials', { email, password })` from `next-auth/react`.
-   The credentials provider validates users against the `users` table using `getUserByEmail` and `bcryptjs` for hashing.
-   The local test endpoint `/api/auth/local` returns minimal user info on success and is useful when testing API flows without NextAuth frontend helpers.

Example: test local auth endpoint with `curl` (replace email/password):

```powershell
curl -X POST http://localhost:3000/api/auth/local \
    -H "Content-Type: application/json" \
    -d '{"email":"user@rental.com","password":"password123"}'
```

If you want NextAuth to persist sessions in Postgres you can add a session store implementation; the project currently uses JWT sessions (no DB sessions).

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

### Example `.env` (current workspace)

The file below shows the `.env` currently used in this workspace. It is included here for documentation only — do NOT commit secrets to version control.

```dotenv
DATABASE_URL=postgresql://postgres:postgres@localhost:5433/rental
NEXTAUTH_SECRET="replace-with-a-secure-random-value"
NEXTAUTH_URL="http://localhost:3000"
```

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
