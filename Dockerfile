FROM node:26-alpine AS base

WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./

# Install all dependencies (including dev for building)
RUN npm ci

# Copy source and configuration
COPY tsconfig.json ./
COPY src/ ./src/

# Compile TypeScript
RUN npm run build

FROM node:26-alpine AS production
WORKDIR /app
ENV NODE_ENV=production

COPY package.json package-lock.json ./

RUN npm ci --omit=dev --ignore-scripts

COPY --from=base /app/dist ./dist

USER node
EXPOSE 4000
CMD ["node", "dist/server.js"]
