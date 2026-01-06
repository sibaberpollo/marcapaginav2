# MARCAPAGINA — MONOREPO

**Generated:** 2026-01-06 | **Commit:** 7696ade | **Branch:** add/monorepo

## OVERVIEW

Spanish literature magazine. Turborepo monorepo with Next.js 16 + React 19 + Tailwind 4 + DaisyUI.

## STRUCTURE

```
marcapagina/
├── pkgs/
│   ├── web/              # Next.js app (the actual product)
│   └── shared/          # Empty placeholder — no code yet
├── turbo.json           # Build orchestration
└── package.json         # Workspace root
```

## WHERE TO LOOK

| Task | Location | Notes |
|------|----------|-------|
| Add pages | `pkgs/web/src/app/` | App Router |
| Add components | `pkgs/web/src/components/` | Barrel export via index.ts |
| Modify theme | `pkgs/web/src/app/globals.css` | CSS variables for light/dark |
| Build config | `pkgs/web/next.config.ts` | Currently minimal |
| Monorepo tasks | `turbo.json` | build, dev, lint, test |

## COMMANDS

```bash
# From root (recommended)
npm run dev      # Start all packages
npm run build    # Build all packages
npm run lint     # Lint all packages

# From pkgs/web/
npm run dev      # next dev
npm run build    # next build
npm run lint     # eslint
```

## CONVENTIONS

- **Package manager**: npm 11.7+ (see engines in package.json)
- **Node**: >=24.6.0
- **Module type**: CommonJS at root (Next.js handles ESM internally)

## ANTI-PATTERNS

- Do NOT add code to `pkgs/shared/` without defining exports first
- Do NOT run commands from subdirectories when Turbo orchestration needed
- Package `web` is named `"app"` in package.json — don't assume name matches directory

## KNOWN ISSUES

1. **Empty shared package** — exists but has no code; consider removing or implementing
2. **Mock data everywhere** — components have hardcoded data; no API/CMS layer yet
3. **Missing error boundaries** — no `not-found.tsx`, `error.tsx`, `loading.tsx`

## PACKAGE DEPENDENCY

```
app (pkgs/web)
 └── shared (pkgs/shared) — currently unused
```
