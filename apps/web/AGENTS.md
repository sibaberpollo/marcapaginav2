# WEB — NEXT.JS APP

## OVERVIEW

Main application. Next.js 16.1.1 App Router, React 19, Tailwind 4, DaisyUI 5. Spanish UI.

## STRUCTURE

```
src/
├── app/
│   ├── layout.tsx           # Root layout (Inter + JetBrains Mono fonts)
│   ├── page.tsx             # Homepage — 3-column grid
│   ├── globals.css          # Theme variables + Tailwind
│   └── articulo/[slug]/     # Dynamic article route
└── components/
    ├── index.ts             # Barrel export — import from here
    ├── layout/              # Header, MobileNav
    ├── sidebar/             # LeftSidebar, RightSidebar
    ├── feed/                # Feed, FeedTabs, PostCard, NewsCard, FeaturedPost
    ├── ads/                 # AdBanner, InFeedAd, MobileAnchorAd
    └── ui/                  # ThemeToggle
```

## WHERE TO LOOK

| Task                     | Location                                             |
| ------------------------ | ---------------------------------------------------- |
| Add route                | `src/app/{route}/page.tsx`                           |
| Add component            | `src/components/{domain}/` then export in `index.ts` |
| Modify colors            | `src/app/globals.css` — CSS variables                |
| Add client interactivity | Add `'use client'` directive at top                  |

## IMPORT PATTERN

```tsx
// ✅ CORRECT — shared components from Design System
import { Button, Card, Input, Badge } from "@marcapagina/ds";

// ✅ CORRECT — local components via barrel export
import { Header, Feed, PostCard } from "@/components";

// ❌ AVOID — relative imports for local components
import Header from "../components/layout/Header";
```

## COMPONENT CONVENTIONS

```tsx
// 1. Props interface (PascalCase + Props suffix)
interface PostCardProps {
  title: string;
  excerpt: string;
}

// 2. Default export, function declaration
export default function PostCard({ title, excerpt }: PostCardProps) {
  return <article className="bg-bg-primary">...</article>;
}

// 3. 'use client' only when needed (hooks, browser APIs)
("use client");
import { useState } from "react";
```

## THEME SYSTEM

**CSS Variables** (defined in globals.css):

```
brand-yellow: #faff00    — Primary accent
brand-gray: #4b4b4b      — Secondary text
brand-black: #000000     — Primary text (inverts in dark)
surface: #f5f5f5         — Card backgrounds
surface-2: #e8e8e8       — Borders, dividers
bg-page: #f5f5f5         — Page background
```

**Usage in Tailwind**:

```tsx
<div className="bg-bg-primary text-text-primary border-surface-2">
<span className="text-brand-yellow hover:text-brand-gray">
```

**Theme toggle**: `data-theme` attribute on `<html>`. Values: `light` | `dark`.

## STYLING

- **Tailwind 4** with `@import "tailwindcss"` syntax
- **DaisyUI** components: `btn`, `badge`, `swap`, `prose`
- **NO tailwind.config** — v4 uses CSS-first configuration
- **Custom classes**: `.line-clamp-2`, `.line-clamp-3` defined in globals.css

## AD SLOTS

```tsx
<AdBanner size="leaderboard" />           // 728x90
<AdBanner size="medium-rectangle" />      // 300x250
<AdBanner size="skyscraper" />            // 160x600
<InFeedAd />                              // Native in-feed
<MobileAnchorAd />                        // Sticky bottom (mobile)
```

AdSense integration commented out — replace `ca-pub-XXXXXXX` when ready.

## CLIENT VS SERVER

| Component            | Type   | Why                  |
| -------------------- | ------ | -------------------- |
| Header               | client | Scroll detection     |
| ThemeToggle          | client | localStorage + state |
| FeedTabs             | client | Tab selection state  |
| MobileAnchorAd       | client | Visibility toggle    |
| Feed, PostCard, etc. | server | No interactivity     |

## ANTI-PATTERNS

- Do NOT use relative imports for components — use `@/components`
- Do NOT add `'use client'` unless using hooks or browser APIs
- Do NOT modify theme colors without updating both light AND dark variants
- Do NOT add custom CSS when Tailwind utilities exist

## SHARED PACKAGES

All components should follow the Design System when possible:

```tsx
import { Button, Card, Input, Badge, Toast } from "@marcapagina/ds";
```

Use DaisyUI classes directly for custom components:

```tsx
<div className="card bg-base-100 shadow-xl">
  <div className="card-body">
    <h2 className="card-title">Title</h2>
  </div>
</div>
```

## COMMANDS

All commands run from root:

```bash
pnpm run build        # Build all packages (apps + shared)
pnpm run lint         # Lint all packages
pnpm run test         # Run tests (all packages)
pnpm run check-types  # TypeScript check (all packages)
```

## ARTICLES SYSTEM

Articles are stored as JSON files in `public/content/{category}/` and loaded via fetch.

**Structure:**
```
public/content/
├── a-pie-de-pagina/
│   ├── _manifest.json          # List of files: {"files": ["article.json"]}
│   ├── el-viejo-y-el-ron.json
│   └── la-paris-de-hemingway.json
├── listas/
│   ├── _manifest.json
│   └── ...
└── {other-categories}/
```

**To publish a new article:**
1. Create JSON file in `public/content/{category}/slug.json`
2. Add filename to `_manifest.json` in that category
3. Push to deploy

**Article types:**
- `standard` — Default article
- `travel-guide` — Has `locations[]` with coordinates for maps
- `recipe` — Has `ingredients[]`, `steps[]`, `literaryContent`
- `meme` — Has `memeImageUrl`

**Key files:**
- `src/lib/articles.ts` — Fetch and query articles
- `src/lib/types/article.ts` — Type definitions
- `src/app/articulo/[slug]/page.tsx` — Article page
- `src/components/recipe/RecipeLayout.tsx` — Recipe layout
- `src/components/travel/TravelGuideLayout.tsx` — Travel guide layout

**Fallback:** If article not found in local files, searches Sanity CMS (for Transtextos/relatos).

## GOTCHAS

1. **Fonts**: Inter (body) + JetBrains Mono (code) loaded via `next/font/google`
2. **Language**: `<html lang="es">` — Spanish content
3. **Path alias**: `@/*` resolves to `./src/*`
4. **Shared packages**: @marcapagina/ts-config, @marcapagina/eslint-config, @marcapagina/ds available
5. **Articles**: Stored in `public/content/`, require `_manifest.json` per category


## SUBAGENT DELEGATION

There are a number of specialized subagents available for delegation of tasks. **Don't assume anything**. Delegate them to one or more of the subagents for a quicker and efficient solution.

Subagents should ultrathink their approach before proposing a solution. **Always**.
