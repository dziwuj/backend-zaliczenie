This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Project structure and branches (rental app)

This repository is prepared as a single Next.js project that will later contain two separate branches with different database implementations:

- `pg` — implementation using `node-postgres` (pg)
- `prisma` — implementation using `Prisma` and `@prisma/client`

Right now the project intentionally does not include database code. The repo contains scaffolding for authentication (`Auth.js`), state management (`Zustand`), and a placeholder `docker-compose.yml` with an optional Postgres service commented out.

## Running locally (no DB)

1. Copy the example env: create a `.env.local` from `.env.example` and set `NEXTAUTH_SECRET`.

```powershell
copy .\.env.example .\.env.local
```

2. Install and run:

```powershell
npm install
npm run dev
```

3. Open `http://localhost:3000`.

## Adding the database later

When you're ready to add the database implementation, follow these steps:

1. Create a new branch `pg` or `prisma`.
2. Add the DB client dependency (e.g. `pg` or `@prisma/client` + `prisma`).
3. Implement the DB adapter under `src/lib/db/` and update API routes to use the chosen adapter.
4. If using Prisma, add `prisma/schema.prisma` and run migrations or `prisma db push`.

This project keeps the DB layer isolated so the two branches can diverge only in `src/lib/db` and related API handlers.
