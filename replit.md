# Meisterverbund Workspace

## Overview

Full-stack Austrian web platform for master craftsman businesses (Meisterbetriebe).
pnpm workspace monorepo using TypeScript.

## Project Goal

A complete platform with:
- Public website: blog, news, ads/classifieds, business directory
- User registration/login with JWT auth
- 5-star ratings and comments per content item
- Full admin dashboard for content/user management

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)
- **Frontend**: React + Vite + TailwindCSS v4 + Wouter routing
- **Auth**: JWT (stored in localStorage as `mv_token`), bcryptjs

## Architecture

```
artifacts/
  api-server/     - Express 5 REST API (port 8080)
  meisterverbund/ - React+Vite frontend (port varies)
  mockup-sandbox/ - Canvas mockup server
lib/
  api-spec/       - openapi.yaml
  api-client-react/ - Generated React Query hooks + Zod schemas
  db/             - Drizzle schema + migrations
scripts/          - Standalone scripts (seed, etc.)
```

## Database Schema

- `users` — id, name, email, password_hash, role (user|admin), is_blocked, created_at, updated_at
- `blog_posts` — id, title, slug, excerpt, content, cover_image, category, published, ...
- `news_posts` — same as blog_posts
- `ad_posts` — same as blog_posts (classifieds/jobs/business sales)
- `businesses` — id, name, slug, bundesland, stadt, branche, description, telefon, email, website, ...
- `comments` — id, content, content_type, content_id, user_id, created_at, updated_at
- `ratings` — id, stars, content_type, content_id, user_id, unique (user_id, content_type, content_id)

## Admin Credentials (Development)

- Email: `admin@meisterverbund.at`
- Password: `admin123`

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks from OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)

## Features Implemented

- Public pages: Home, Blog (list/detail), News (list/detail), Ads (list/detail), Businesses (list/detail)
- Auth: Register, Login, Profile page with JWT
- Interactive: 5-star ratings + comment CRUD (own comments or admin)
- Admin dashboard: Stats overview, User management (block/unblock), Blog/News/Ads/Businesses CRUD, Comments management
- Footer with Impressum/Datenschutz/Uber uns/Kontakt static pages
- Austrian design: forest green + warm cream color scheme, no emojis

## Content Types

For comments/ratings: `"blog" | "news" | "ad" | "business"`

## API Notes

- JWT sent as `Authorization: Bearer <token>` header (configured in custom-fetch.ts)
- Admin routes protected by `requireAdmin` middleware
- User routes protected by `requireAuth` middleware
- Public routes have no auth requirement
