# Prisma Setup — Car Rental App

This repository uses Prisma as the primary database layer for a Next.js car rental application.

This README is a concise Prisma-focused guide: environment variables, common commands (Yarn, Prisma, Docker), and troubleshooting tips.

## Key files

-   `prisma/schema.prisma` — Prisma schema with models (uses UUID primary keys).
-   `prisma/` — migrations and Prisma configuration.
-   `src/lib/db-prisma.ts` — Prisma client wrapper (singleton) and DB helpers.

## Environment

Create a local `.env` file (do NOT commit secrets). Minimal example:

```env
DATABASE_URL=postgresql://postgres:postgres@db:5432/car_rental
NEXTAUTH_SECRET="replace-with-a-secure-random-value"
NEXTAUTH_URL="http://localhost:3000"
```

Notes:

-   When running with Docker Compose the DB host inside the compose network is usually the service name (`db`).
-   When running locally without Docker, replace `db` with `localhost` and the exposed port (for example `localhost:5433`).
-   Schema primary keys use UUIDs (Prisma `String` with `@id @default(uuid())`). Ensure code treats IDs as strings.

### Environment variables reference

-   `DATABASE_URL` (required): full PostgreSQL connection string used by Prisma.
    -   Example (Docker Compose): `postgresql://postgres:postgres@db:5432/car_rental`
    -   Example (local): `postgresql://postgres:postgres@localhost:5433/car_rental`
-   `NEXTAUTH_SECRET` (required for production): random string used to sign NextAuth tokens.
-   `NEXTAUTH_URL` (recommended): the base URL for NextAuth callbacks, e.g. `http://localhost:3000`.
-   `PORT` (optional): the port for the Next.js server when running in production (default `3000`).

If you need to set database-specific options (SSL, schema name, or connection limits), include them in the `DATABASE_URL` per the Prisma docs.

## Commands

### Yarn / Project

```powershell
yarn install        # install dependencies
yarn dev            # start Next.js in development mode
yarn build          # build for production
yarn start          # start the production server
yarn lint           # run ESLint (if configured)
```

### Prisma

```powershell
yarn prisma:generate                # generate Prisma client
yarn prisma migrate dev --name "describe-change"  # create & apply a migration (dev)
yarn prisma db push                 # push schema to DB without creating migrations
yarn prisma studio                  # open Prisma Studio (web UI)
```

You can also use `npx prisma <command>` directly.

### Docker (Compose)

```powershell
yarn docker:up        # docker compose up --build -d
yarn docker:down      # docker compose down
yarn docker:rebuild   # docker compose down && docker compose up --build -d
yarn docker:logs      # show container logs (if provided in scripts)
```

The included `docker-compose.yml` launches PostgreSQL and the web app. Inside Docker, the DB host is typically `db`.

## Run locally

Development:

```powershell
yarn dev
```

Build & run production:

```powershell
yarn build
yarn start
```

## Troubleshooting

-   Prisma client generation errors: confirm `DATABASE_URL` is correct and the DB is reachable. If using Docker, ensure the DB container is healthy and initialized.
-   Next.js type/validator issues after moving files: clear Next cache and rebuild:

```powershell
Remove-Item -Recurse -Force .next
yarn build
```

-   TypeScript module/type errors (for example, auth adapters): install required packages or add short module declarations under `src/types/` as a temporary workaround.

## Next steps and notes

-   Remove any temporary debug logging in API routes once behavior is verified.
-   Consider replacing temporary `.d.ts` shims with proper `@types` packages and adjusting `tsconfig.json` to include type roots.

---

MIT
