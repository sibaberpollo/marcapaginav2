# MARCAPAGINA — MONOREPO

**Generated:** 2026-01-06 | **Commit:** f93915c | **Branch:** add/monorepo

## OVERVIEW

Spanish literature magazine. Turborepo monorepo with Next.js 16 + React 19 + Tailwind 4 + DaisyUI.

## STRUCTURE

```
marcapagina/
├── apps/
│   └── web/             # Next.js app (the actual product)
├── packages/
│   └── shared/          # Shared utilities — empty placeholder
├── turbo.json           # Build orchestration
└── package.json         # Workspace root
```

## WHERE TO LOOK

| Task              | Location                       | Notes                        |
| ----------------- | ------------------------------ | ---------------------------- |
| Add pages         | `apps/web/src/app/`            | App Router                   |
| Add components    | `apps/web/src/components/`     | Barrel export via index.ts   |
| Modify theme      | `apps/web/src/app/globals.css` | CSS variables for light/dark |
| Build config      | `apps/web/next.config.ts`      | Currently minimal            |
| Monorepo tasks    | `turbo.json`                   | build, dev, lint, test       |
| Add/edit articles | `apps/web/content/{category}/` | JSON files by category slug  |

## CRITICAL RULES

These rules must ALWAYS be followed:

- **Type Safety**: NEVER use `any` type - use `unknown` and type guards
- **Type Assertions**: NEVER use `as` without runtime type guards
- **Pre-commit**: Always run `pnpm check-types && pnpm lint` before committing
- **Design System**: Never create new design system components unless explicitly requested

## COMMANDS

```bash
# From root (recommended)
npm run dev         # Start all packages
npm run build       # Build all packages
npm run lint        # Lint all packages
npm run format      # Prettier format
npm run check-types # TypeScript check

# From apps/web/
npm run dev      # next dev
npm run build    # next build
npm run lint     # eslint
```

## CONVENTIONS

- **Package manager**: npm 11.7+ (see engines in package.json)
- **Node**: >=24.6.0
- **Module type**: CommonJS at root (Next.js handles ESM internally)

## ANTI-PATTERNS

- Do NOT add code to `packages/shared/` without defining exports first
- Do NOT run commands from subdirectories when Turbo orchestration needed
- Package `web` is named `"app"` in package.json — don't assume name matches directory

## KNOWN ISSUES

1. **Empty shared package** — exists but has no code; consider removing or implementing
2. **Mock data everywhere** — components have hardcoded data; no API/CMS layer yet
3. **Missing error boundaries** — no `not-found.tsx`, `error.tsx`, `loading.tsx`

## PACKAGE DEPENDENCY

```
app (apps/web)
 └── shared (packages/shared) — currently unused
```
