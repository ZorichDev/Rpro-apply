# R-Pro Apply

Pan-African higher-education application platform. Students, Institutions,
Vendors, and Recruitment Partners in one ecosystem.

## Stack
- Frontend: React + Vite + TypeScript + Tailwind CSS
- Backend: Node.js + Express + TypeScript + MongoDB/Mongoose
- Auth: JWT (access + refresh tokens), RBAC
- Monorepo: pnpm workspaces + Turborepo

## Getting started
```bash
pnpm install
cp .env.example .env
pnpm dev
```

This starts the backend (port 5000), the main app (port 5173), and the admin
app (port 5174) together. To run the admin app on its own:
```bash
pnpm dev:admin
```

Admin accounts can't self-register — create the first one with:
```bash
pnpm --filter backend seed:admin -- admin@rprogroup.com.ng SomeStrongPassword123
```

## Testing
```bash
pnpm --filter backend test
```
Backend tests use `mongodb-memory-server` — a real MongoDB binary that runs
in-memory, so tests never touch your real database. The binary downloads
once on first run (needs network access); after that it's cached locally
and runs fast.

## Structure
- `packages/shared` — types, constants, and validation schemas shared across all three apps
- `packages/backend` — Express API
- `packages/frontend` — the main app: students, institutions, vendors, recruitment partners
- `packages/admin` — a genuinely separate app for platform admins, running on its own port, with its own login
