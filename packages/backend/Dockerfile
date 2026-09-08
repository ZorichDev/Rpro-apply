# FROM node:20-alpine
# WORKDIR /app
# COPY package.json ./
# RUN npm install --omit=dev
# COPY dist ./dist
# EXPOSE 5000
# CMD ["node", "dist/index.js"]


FROM node:20-alpine AS builder
WORKDIR /app

# Enable pnpm
RUN corepack enable

# Copy workspace manifests first (better layer caching)
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY packages/backend/package.json ./packages/backend/package.json
COPY packages/shared/package.json ./packages/shared/package.json

RUN pnpm install --frozen-lockfile

# Now copy source and build
COPY packages/backend ./packages/backend
COPY packages/shared ./packages/shared

RUN pnpm --filter shared build
RUN pnpm --filter backend build

# --- Runtime stage ---
FROM node:20-alpine
WORKDIR /app
RUN corepack enable

COPY --from=builder /app/pnpm-lock.yaml /app/pnpm-workspace.yaml /app/package.json ./
COPY --from=builder /app/packages/backend/package.json ./packages/backend/package.json
COPY --from=builder /app/packages/shared/package.json ./packages/shared/package.json

RUN pnpm install --frozen-lockfile --prod

COPY --from=builder /app/packages/backend/dist ./packages/backend/dist
COPY --from=builder /app/packages/shared/dist ./packages/shared/dist

EXPOSE 5000
CMD ["node", "packages/backend/dist/index.js"]