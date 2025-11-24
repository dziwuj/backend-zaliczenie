# Multi-stage Dockerfile for Next.js app
# - deps: installs node modules
# - builder: runs next build
# - runner: production image that serves the built app

FROM node:20-slim AS base
RUN apt-get update && apt-get install -y openssl --no-install-recommends && rm -rf /var/lib/apt/lists/*
WORKDIR /app

FROM base AS deps
RUN apt-get update && apt-get install -y python3 make g++ build-essential --no-install-recommends && rm -rf /var/lib/apt/lists/*
COPY package.json yarn.lock ./
COPY prisma ./prisma
RUN yarn install --frozen-lockfile
RUN yarn prisma generate

FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN yarn build

FROM node:20-slim AS runner
RUN apt-get update && apt-get install -y openssl --no-install-recommends && rm -rf /var/lib/apt/lists/*
WORKDIR /app
ENV NODE_ENV=production

# copy built app and necessary files
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json
COPY --from=deps /app/node_modules ./node_modules
COPY --from=builder /app/prisma ./prisma

EXPOSE 3000
CMD ["yarn", "start"]
