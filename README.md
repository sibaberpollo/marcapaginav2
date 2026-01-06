# Marcapagina — Spanish Literature Magazine

A modern monorepo for a Spanish literature magazine, built with Next.js 16, React 19, Tailwind CSS 4, and DaisyUI.

## Architecture

This is a **Turborepo monorepo** managed with pnpm workspaces. The structure separates concerns between applications and shared packages, with Turbo orchestrating builds, linting, and testing across all workspaces.

```
marcapagina/
├── apps/
│   └── web/                 # Main Next.js application
│       ├── src/
│       │   ├── app/         # Next.js App Router pages
│       │   └── components/  # React components
│       └── package.json
├── packages/
│   └── shared/              # Shared utilities (currently empty)
└── package.json             # Workspace root with Turbo scripts
```

## Tech Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| **Next.js** | 16.1.1 | React framework with App Router |
| **React** | 19.2.3 | UI library |
| **TypeScript** | 5.9.3 | Type safety |
| **Tailwind CSS** | 4 | Utility-first CSS framework |
| **DaisyUI** | 5.5.14 | Component library with themes |
| **Turbo** | 2.7.3 | Monorepo task orchestration |
| **pnpm** | 9.0.0+ | Package manager |
| **Node** | 24.6.0+ | Runtime |

## Getting Started

### Prerequisites

- Node.js >= 24.6.0
- pnpm >= 9.0.0

### Installation

```bash
# Install dependencies
pnpm install
```

### Development

Start the development server from the **root directory**:

```bash
pnpm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Commands

All commands should be run from the **root directory** to leverage Turbo's workspace orchestration.

```bash
# Development
pnpm run dev          # Start development server (all packages)

# Building
pnpm run build        # Build all packages

# Quality
pnpm run lint         # Lint all packages
pnpm run test         # Run tests (all packages)
pnpm run check-types  # TypeScript type checking
pnpm run format       # Format code with Prettier
```

## Project Structure

### `/apps/web` — Next.js Application

The main web application containing all frontend code.

**Key directories:**

- `src/app/` — Next.js App Router pages and layouts
  - `layout.tsx` — Root layout with fonts
  - `globals.css` — Theme variables and Tailwind imports
  - `page.tsx` — Homepage
  - Dynamic routes: `articulo/[slug]/`, `autor/[slug]/`, `relato/[slug]/`
- `src/components/` — React components organized by domain
  - `layout/` — Header, MobileNav, RelatoHeader
  - `feed/` — Feed, FeedTabs, PostCard, NewsCard
  - `sidebar/` — LeftSidebar, RightSidebar
  - `ads/` — Ad banners and placements
  - `ui/` — UI primitives (ThemeToggle)
- `lib/` — Utilities, types, and API clients

### `/packages/shared` — Shared Package

Placeholder for shared utilities, types, and configurations. Currently empty but structured for future use.

## Development Workflow

### Adding New Features

1. **Pages** — Add to `apps/web/src/app/{route}/page.tsx`
2. **Components** — Create in `apps/web/src/components/{domain}/`, then export in `index.ts`
3. **Styles** — Use Tailwind utilities; define theme variables in `globals.css`

### Component Conventions

```tsx
// Props interface (PascalCase + Props suffix)
interface PostCardProps {
  title: string;
  excerpt: string;
}

// Default export, function declaration
export default function PostCard({ title, excerpt }: PostCardProps) {
  return <article className="bg-bg-primary">...</article>;
}

// 'use client' only when needed (hooks, browser APIs)
'use client';
import { useState } from 'react';
```

### Import Patterns

```tsx
// ✅ CORRECT — use barrel export from @/components
import { Header, Feed, PostCard } from '@/components';

// ❌ AVOID — relative imports
import Header from '../components/layout/Header';
```

### Theme System

The app supports light/dark themes with CSS variables:

```css
--brand-yellow: #faff00;
--brand-gray: #4b4b4b;
--brand-black: #000000;
--surface: #f5f5f5;
--surface-2: #e8e8e8;
--bg-page: #f5f5f5;
```

Theme is controlled via `data-theme` attribute on the `<html>` element.

## CI/CD

GitHub Actions workflow (`.github/workflows/ci.yml`) runs on push/PR to main/master:

- **Lint** — ESLint across all packages
- **Test** — Run test suite
- **Build** — Production build of Next.js app (uploads artifacts)

All jobs use Node 24 and pnpm with caching for fast feedback.

## Known Issues

1. **Empty shared package** — The `packages/shared/` directory exists but contains no code
2. **Mock data** — Components currently use hardcoded data; no API/CMS integration
3. **Missing error boundaries** — No `not-found.tsx`, `error.tsx`, or `loading.tsx` files

## Contributing

- Follow existing code patterns and conventions
- Run `pnpm run lint` and `pnpm run check-types` before committing
- Use `pnpm run format` to ensure consistent code style
- Prefer Turbo commands from root over individual package scripts

## License

ISC
