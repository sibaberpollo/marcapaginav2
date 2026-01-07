# Web Application — Marcapagina

The main Next.js 16 application for the Spanish literature magazine.

## Quick Start

```bash
# From monorepo root (recommended)
pnpm run dev

# Or directly from apps/web/
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## App-Specific Scripts

```bash
npm run dev      # Start development server (next dev)
npm run build    # Production build (next build)
npm run start    # Start production server (next start)
npm run lint     # Run ESLint
```

## Key Features

- **App Router** — Next.js 16 file-based routing
- **React 19** — Latest React features and hooks
- **Tailwind 4** — Utility-first CSS with new syntax
- **DaisyUI 5.5** — Pre-built components with dark theme
- **TypeScript** — Full type safety
- **Theme System** — Light/dark mode with CSS variables

## Project Structure

```
src/
├── app/
│   ├── layout.tsx           # Root layout (fonts, metadata)
│   ├── page.tsx             # Homepage
│   ├── globals.css          # Tailwind + theme variables
│   ├── articulo/[slug]/     # Article pages
│   ├── autor/[slug]/        # Author pages
│   ├── relato/[slug]/       # Short story pages
│   └── horoscopo/           # Horoscope pages
├── components/
│   ├── index.ts             # Barrel export
│   ├── layout/              # Header, MobileNav
│   ├── feed/                # Feed, PostCard, NewsCard
│   ├── sidebar/             # LeftSidebar, RightSidebar
│   ├── ads/                 # AdBanner, InFeedAd
│   └── ui/                  # ThemeToggle
└── lib/
    ├── types/               # TypeScript interfaces
    └── sanity.ts            # CMS client (placeholder)
```

## Development Guidelines

### Adding Routes

Create pages in `src/app/{route}/page.tsx` following the App Router convention.

### Adding Components

1. Create component in `src/components/{domain}/`
2. Export in `src/components/index.ts` (barrel export)
3. Import via `@/components`

```tsx
// ✅ Correct
import { Header, PostCard } from '@/components';

// ❌ Avoid
import Header from '@/components/layout/Header';
```

### Using 'use client'

Add `'use client'` only when using hooks or browser APIs:

```tsx
'use client';
import { useState } from 'react';

export default function InteractiveComponent() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(c => c + 1)}>{count}</button>;
}
```

## Theme System

Colors are defined as CSS variables in `globals.css`:

```css
--brand-yellow: #faff00;  /* Primary accent */
--brand-gray: #4b4b4b;    /* Secondary text */
--brand-black: #000000;   /* Primary text */
--surface: #f5f5f5;       /* Card backgrounds */
--surface-2: #e8e8e8;     /* Borders, dividers */
--bg-page: #f5f5f5;       /* Page background */
```

Toggle theme via `data-theme="light|dark"` on the `<html>` element.

## Styling Conventions

- **Tailwind 4** — CSS-first configuration via `@import "tailwindcss"`
- **DaisyUI** — Use `btn`, `badge`, `card`, `prose`, etc.
- **No tailwind.config** — v4 uses globals.css for configuration
- **Custom CSS** — Only when Tailwind utilities don't suffice

## Known Limitations

1. **Mock data** — All data is hardcoded in components
2. **No API layer** — CMS integration not implemented
3. **Missing error states** — No error boundaries or loading states
4. **AdSense** — Placeholder only, needs actual publisher ID

## Deployment

Build and start:

```bash
npm run build
npm run start
```

The app builds to `.next/` and runs on port 3000 by default.

For deployment, refer to the root README for CI/CD configuration.
