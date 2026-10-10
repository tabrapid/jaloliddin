# Jaloliddin — Digital Workshop

Personal portfolio of Jaloliddin, a student developer from Uzbekistan. Next.js App Router,
strict TypeScript, Tailwind CSS v4, Motion and a procedural React Three Fiber hero, in English
and Uzbek (Latin).

## Requirements

- Node.js ≥ 20.9 (developed on Node 22)
- pnpm 10 (`corepack enable` will pick the version pinned in `package.json`)

## Setup

```bash
pnpm install
```

## Local development

```bash
pnpm dev
```

- Site: <http://localhost:3000> (redirects to `/en`; Uzbek is at `/uz`)
- Component explorer (development only): <http://localhost:3000/explorer>
- Force a hero mode for testing: `/en?graphics=fallback` or `/en?graphics=webgl`

## Quality checks

```bash
pnpm typecheck     # next typegen + tsc --noEmit
pnpm lint          # ESLint (next/core-web-vitals + typescript)
pnpm test          # Vitest: logic, content integrity, DOM interactions
pnpm build         # production build
pnpm test:e2e      # Playwright against the production build (run `pnpm build` first)
pnpm check         # typecheck + lint + test + build
```

Playwright uses the `@playwright/test` version pinned in `package.json`. If its browser is
missing on your machine, run `pnpm exec playwright install chromium` once.

## Production build

```bash
pnpm build
pnpm start          # serves the build on http://localhost:3000
```

All pages are prerendered. The only runtime pieces are the locale proxy (redirects) and
on-demand 404s.

## Configuration

Copy `.env.example` to `.env.local` (or set the variables in your host):

| Variable | Purpose | Default |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Canonical origin for metadata, sitemap, Open Graph, JSON-LD | `http://localhost:3000` |
| `SITE_INDEXING` | Set to exactly `true` to allow search indexing. Leave unset for previews | indexing **off** |

Both are read at build time. Vercel preview builds are never indexable.

## Where things live

| To change… | Edit |
| --- | --- |
| Profile text, interests, capabilities | `src/content/profile.ts` |
| Projects (Bloodchain, School platform) | `src/content/projects/*.ts` |
| Contact links | `src/config/contact.ts` |
| Articles | `src/content/articles/<locale>/<slug>.md` |
| Milestones | `src/content/milestones.ts` |
| Interface translations | `src/i18n/dictionaries/{en,uz}.ts` |
| Colours, type scale, motion tokens | `src/styles/globals.css` |

## Documentation

- [`CLAUDE.md`](CLAUDE.md) — conventions for anyone (human or agent) working on the code
- [`docs/design-direction.md`](docs/design-direction.md) — references and creative direction
- [`docs/design-system.md`](docs/design-system.md) — tokens, typography, components, motion
- [`docs/architecture.md`](docs/architecture.md) — module boundaries, rendering, content flow
- [`docs/content-editing.md`](docs/content-editing.md) — add projects, articles, translations, links
- [`docs/component-reuse.md`](docs/component-reuse.md) — reuse components in other React projects
- [`CONTENT_TODO.md`](CONTENT_TODO.md) — facts and assets still needed
- [`PROGRESS.md`](PROGRESS.md) — status, decisions, remaining work

## Licences

Code: all rights reserved by the site owner unless stated otherwise. Fonts: Schibsted Grotesk
and Red Hat Mono under the SIL Open Font License 1.1 (`src/styles/fonts/OFL-*.txt`).
