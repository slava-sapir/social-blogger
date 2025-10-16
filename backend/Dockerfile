# backend/Dockerfile
# Multi-stage build (small and production-ready)
FROM node:20-alpine AS build

WORKDIR /app

# Install deps (use package-lock / yarn.lock from backend dir)
COPY package*.json ./
# If you use yarn, replace with: RUN yarn install --frozen-lockfile
RUN npm ci

# Copy source
COPY . .

# If you have a build step (e.g. TypeScript), run it:
# RUN npm run build

# ---- Runtime image ----
FROM node:20-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production

# Copy only what we need from build stage
COPY --from=build /app ./

# Ensure the app listens on process.env.PORT
EXPOSE 3000

# Use an explicit start command. Make sure package.json "start" exists.
CMD ["npm", "start"]
