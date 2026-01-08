# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build & Development Commands

This is a Turborepo monorepo. **Run all commands from the repository root**, not from subdirectories.

```bash
# Development
pnpm dev              # Start Next.js dev server (apps/web on port 3000)

# Build & Validation
pnpm build            # Build all packages and apps
pnpm check-types      # TypeScript validation across workspace
pnpm lint             # ESLint across workspace
pnpm format           # Prettier formatting

# Testing
pnpm test             # Run Vitest unit tests
pnpm test:coverage    # Run tests with coverage report
pnpm e2e              # Run Playwright E2E tests (in apps/web)
```

## Architecture Overview

**Monorepo Structure:**
- `apps/web/` — Next.js 16 main application (React 19, App Router)
- `packages/ds/` — Design system (@marcapagina/ds)
- `packages/eslint-config/` — Shared ESLint config
- `packages/ts-config/` — Shared TypeScript config

**Tech Stack:** Next.js 16.1, React 19, TypeScript 5.9 (strict), Tailwind CSS 4, DaisyUI 5, Vitest, Playwright

**Package Manager:** pnpm 9.0.0+ (required)

## Key Patterns

### Component Imports
Always use barrel exports from `@/components`:
```tsx
// CORRECT
import { Header, Feed, PostCard } from "@/components";

// AVOID relative imports
import Header from "../components/layout/Header";
```

Design system imports:
```tsx
import { Button, Card, Input, Badge } from "@marcapagina/ds";
```

### Component Style
Use function declarations with typed props interfaces:
```tsx
interface MyComponentProps {
  title: string;
  optional?: boolean;
}

export default function MyComponent({ title, optional = false }: MyComponentProps) {
  return <div>{title}</div>;
}
```

Add `"use client"` only when using hooks or browser APIs. Prefer server components.

### Type Safety
- Use `unknown` instead of `any`
- Use type guards before type assertions
- Never use `as` without runtime checks

## Content & Data

**Articles** are stored as local JSON files in `apps/web/src/content/{category}/` and typed via `Article` interface in `lib/types/article.ts`.

**Article Types:**
- `standard` — Default article
- `travel-guide` — Includes `locations[]` with coordinates for Leaflet maps
- `recipe` — Includes `ingredients[]` and `steps[]`
- `meme` — Includes `memeImageUrl`

Type guards available: `isTravelGuide()`, `isRecipe()`

**Secondary CMS:** Sanity with ISR (60s revalidation) configured in `lib/sanity.ts`

## Styling

Tailwind CSS 4 with DaisyUI. Configuration is in `globals.css` via `@theme` block (no tailwind.config.js).

Brand colors as CSS variables:
- `--color-brand-yellow: #faff00`
- `--color-brand-gray`, `--color-brand-black`, `--color-surface`

Theme switching via `data-theme="light|dark"` on `<html>`.

## Project Structure (apps/web/src)

```
app/                  # Next.js App Router pages
  articulo/[slug]/    # Article detail pages
  autor/[slug]/       # Author pages
  relato/[slug]/      # Short story pages
components/
  index.ts            # Barrel export (always add new components here)
  layout/             # Header, MobileNav
  feed/               # Feed, PostCard, NewsCard
  sidebar/            # LeftSidebar, RightSidebar
  travel/             # Travel guide maps (react-leaflet)
  recipe/             # Recipe components
lib/
  articles.ts         # Article CRUD functions
  sanity.ts           # Sanity CMS client
  types/article.ts    # Article type definitions
content/              # Local JSON articles by category
```

## External Services

Environment variables needed (in `.env.local`):
- Cloudinary — Image hosting
- Sanity — CMS
- Google Analytics — GA_MEASUREMENT_ID
- Neon PostgreSQL — Database URL
- Turnstile — Bot protection
- Gmail — Email sending
