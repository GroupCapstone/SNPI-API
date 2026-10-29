FROM node:22-alpine AS base

WORKDIR /app

# Copy root workspace configuration, lockfile, and shared packages
COPY package.json package-lock.json ./
COPY packages/ ./packages/
COPY apps/backend/package.json ./apps/backend/

# Install dependencies including backend workspace
RUN npm ci --workspace=apps/backend --include-workspace-root

# Copy backend application source
COPY apps/backend/ ./apps/backend/

# Build backend TypeScript
RUN npm run build --workspace=apps/backend

FROM node:22-alpine AS production
WORKDIR /app
ENV NODE_ENV=production

COPY package.json package-lock.json ./
COPY packages/ ./packages/
COPY apps/backend/package.json ./apps/backend/

RUN npm ci --omit=dev --workspace=apps/backend --include-workspace-root

COPY --from=base /app/apps/backend/dist ./apps/backend/dist

USER node
EXPOSE 4000
CMD ["node", "apps/backend/dist/server.js"]
