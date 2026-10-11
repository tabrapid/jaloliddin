@AGENTS.md

# Jaloliddin — Digital Workshop: working agreement

Personal portfolio for Jaloliddin (student developer, Uzbekistan). Read `docs/architecture.md`
and `docs/design-system.md` before structural changes. Next.js 16 differs from older versions:
check `node_modules/next/dist/docs/` before using an API (see AGENTS.md).

## Commands

```bash
pnpm dev            # http://localhost:3000 (explorer at /explorer, dev only)
pnpm typecheck      # next typegen && tsc --noEmit
pnpm lint
pnpm test           # Vitest (unit + DOM + content-integrity tests)
pnpm build
pnpm test:e2e       # Playwright against the production build (build first)
pnpm check          # typecheck + lint + test + build
```

## Content truthfulness (non-negotiable)

- Never invent clients, testimonials, employers, partnerships, user counts, revenue, impact
  metrics, launch status, clinical approval, app-store availability, awards, publications,
  dates or credentials.
- The project is spelled **Bloodchain** (slug `bloodchain`). Never “Bloodchainga”; a test
  enforces this.
- Bloodchain: describe intended scope only. Do not imply deployment or clinical readiness.
  `implemented`, `outcomes` and `links` stay empty until Jaloliddin verifies them.
- Do not fabricate product screenshots. Use the labelled conceptual illustration.
- Never expose age, phone number, precise address or school records.
- Missing facts go to `CONTENT_TODO.md`. Public pages must never show “TODO”, placeholders,
  broken links or fake form success. Content tests check for this.
- Do not publish essays under Jaloliddin’s name; the Writing page has an empty state.

## Architecture conventions

- `src/components/*` are generic: no imports from `features`, `content`, `config` or `i18n`.
  Labels come in as props.
- `src/features/*` are site-specific and may use Next.js, content and dictionaries.
- Content is data: projects are typed `ProjectRecord`s with `{ en, uz }` fields, resolved by
  `src/lib/projects.ts`. Add a project by adding a record, never by copying a page.
- No locale conditionals in components: dictionaries (`src/i18n/dictionaries`) plus resolved
  content. `en.ts` defines the dictionary shape.
- Server Components by default. Add `"use client"` only to interactive leaves; never to
  layouts or pages.
- All routes live under `src/app/[lang]`. Use `localizePath()` / `LocaleLink` for internal
  links.
- Lab experiments: pure logic (+ tests) separate from UI, registered in
  `src/features/lab/registry.ts`.
- The explorer (`src/app/explorer`) renders only under `NODE_ENV=development`; keep its code
  behind the dev-only dynamic import.
- No new state libraries, databases, auth, CMS or admin features.

## Design rules

- Palette changes happen only in `src/styles/globals.css`. Use semantic utilities
  (`bg-canvas`, `text-ink-2`, `border-line`, `bg-action`); never hex values in components.
  Small text never sits on `accent` (fails AA); filled buttons use `action`.
- Two font families only: Schibsted Grotesk and Red Hat Mono (`text-label` for metadata).
  Both support Uzbek ʻ/ʼ. The Schibsted files are patched so ʻ (U+02BB) is not drawn as a wide
  gap. Re-run `scripts/patch-uzbek-okina.py` if you replace a font file.
- `<html>` carries `data-scroll-behavior="smooth"` so Next 16 disables smooth scrolling during
  navigation. Keep it whenever `scroll-behavior: smooth` is set.
- Editorial asymmetry on the 4/8/12 grid. Use cards sparingly and prefer hairlines. The
  khatam ornament appears only where it carries meaning.
- Motion supports hierarchy. Large text uses the `settle` entrance (no fade, LCP-safe).
  Never hide content without JS, never hijack scroll, give loops a pause control, and honour
  `prefers-reduced-motion`.
- 3D must never block first paint: SVG fallback first, lazy scene, pause offscreen, fallback
  on reduced motion / no hardware WebGL / context loss.

## Verification expectations

Before handing off:

1. Run `pnpm check` and `pnpm test:e2e`.
2. Inspect pages at 390, 768 and 1440 px (no horizontal overflow) and check the browser
   console (no errors or warnings).
3. Test keyboard navigation, the mobile menu, language switching and the Lab controls.
4. Check reduced-motion and WebGL-failure behaviour.

Report honestly: if a tool or check could not run, say so. Never claim an inspection that did
not happen. Update `PROGRESS.md` with decisions and remaining work.
