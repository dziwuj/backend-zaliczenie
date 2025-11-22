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
