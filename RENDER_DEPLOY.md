# Render Deployment

## Render Web Service

Use these settings if you create the service manually:

- **Environment:** Node
- **Build Command:** `corepack enable && pnpm install --frozen-lockfile && pnpm run render:build`
- **Start Command:** `corepack enable && pnpm run render:start`

## Required Environment Variables

- `NODE_ENV=production`
- `BASE_PATH=/`
- `DATABASE_URL=...`
- `JWT_SECRET=...`

## Optional

- `NODE_VERSION=22`

## Important

The backend serves the built frontend automatically, so you only need **one Render Web Service** for this project.
