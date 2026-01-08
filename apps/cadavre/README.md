# Cadavre — Micronarrativas Colaborativas

Juego colaborativo de escritura creativa donde los participantes escriben historias sin ver el contexto previo.

## Quick Start

```bash
# From monorepo root (recommended)
pnpm run dev --filter=cadavre

# Or directly from apps/cadavre/
cd apps/cadavre
pnpm run dev
```

Open [http://localhost:3001](http://localhost:3001) to view the application.

## App-Specific Scripts

```bash
pnpm run dev      # Start development server (next dev) - runs on port 3001
pnpm run build    # Production build (next build)
pnpm run start    # Start production server (next start)
pnpm run lint     # Run ESLint
pnpm run check-types  # TypeScript type checking
```

## Project Structure

```
apps/cadavre/
├── src/
│   ├── app/                 # Next.js App Router pages
│   │   ├── layout.tsx       # Root layout with fonts, metadata
│   │   ├── page.tsx         # Landing page (placeholder)
│   │   ├── globals.css      # Tailwind + theme variables
│   │   ├── api/             # API routes (future)
│   │   └── session/         # Session routes (future)
│   ├── components/          # React components
│   │   ├── index.ts         # Barrel export
│   │   └── ui/              # UI components (future)
│   ├── lib/                 # Utilities (future)
│   └── hooks/               # React hooks (future)
├── public/                  # Static assets
├── package.json
├── next.config.ts
├── tsconfig.json
├── eslint.config.mjs
└── vitest.config.ts
```

## Theme System

Colors are defined as CSS variables in `globals.css`:

```css
--brand-yellow: #faff00;
--brand-gray: #4b4b4b;
--brand-black: #000000;
--surface: #f5f5f5;
--surface-2: #e8e8e8;
--bg-page: #f5f5f5;
```

Toggle theme via `data-theme="light|dark"` on the `<html>` element.

## Development Notes

- This is a placeholder structure for the Cadavre MVP
- Landing page is a temporary placeholder until T6
- No components created yet (future tasks)
- No tests yet (covered in T26-T27)

## Related Documentation

- [Monorepo Root README](../../README.md)
- [Web App Documentation](../web/README.md)
- [MVP Engineering Plan](../docs/mvp-plan.md)

## Tech Stack

| Technology       | Version | Purpose                         |
| ---------------- | ------- | ------------------------------- |
| **Next.js**      | 16.1.1  | React framework with App Router |
| **React**        | 19.2.3  | UI library                      |
| **TypeScript**   | 5       | Type safety                     |
| **Tailwind CSS** | 4       | Utility-first CSS framework     |
| **DaisyUI**      | 5.5.14  | Component library with themes   |
