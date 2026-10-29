FROM node:22-alpine AS base

WORKDIR /app
COPY package.json package-lock.json ./

FROM base AS development
ENV NODE_ENV=development
RUN npm ci
COPY . .
EXPOSE 4000
CMD ["npm", "run", "dev"]

FROM development AS build
RUN npm run build

FROM base AS production
ENV NODE_ENV=production
RUN npm ci --omit=dev
COPY --from=build /app/dist ./dist
USER node
EXPOSE 4000
CMD ["node", "dist/server.js"]
