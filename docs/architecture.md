# Architecture

## Stack

| Concern | Choice | Version |
| --- | --- | --- |
| Framework | Next.js App Router (Turbopack) | 16.3.8 |
| UI runtime | React | 19.2.8 |
| Language | TypeScript (strict, `noUncheckedIndexedAccess`) | 5.9.3 |
| Styling | Tailwind CSS v4 (CSS-first `@theme`) | 4.3.3 |
| Primitives | Radix UI Dialog, Tabs, Accordion, Tooltip, Slot | 1.x |
| Animation | Motion (`motion/react`, `LazyMotion` + `domAnimation`) | 12.43.0 |
| 3D | three + @react-three/fiber (no drei; geometry and shaders are original) | 0.182.0 / 9.8.1 |
| Content | Typed TS records + Markdown (`yaml` + `marked`) | — |
| Tests | Vitest + Testing Library (unit/DOM), Playwright (e2e) | 4.1 / 1.56.1 |

Versions were checked against the npm registry and each package’s peer dependencies before
installation. Some newest majors were deliberately not used:

- Next 16.4 was four days old; 16.3.8 is the newest patch of the mature minor.
- Motion 13/14 were released in the last two months.
- TypeScript 7 is the native port and Next’s create-app template targets ^5.
- three ≥ 0.183 logs a deprecation warning for `THREE.Clock`, which R3F 9.8 still uses. 0.182.0
  keeps the console clean.

## Module boundaries

```
src/
  app/                    Routes only: params, metadata, composition. No business logic.
    [lang]/               Root layout (html lang), pages, localized not-found, OG image
    explorer/*.dev.tsx    Dev-only component explorer (excluded from production builds)
    global-not-found.tsx  404 for URLs outside the locale tree
    sitemap.ts robots.ts icon.svg apple-icon.tsx
  proxy.ts                Locale redirects (/ → /en, remembers explicit choice via cookie)
  components/             GENERIC, content-free building blocks
    ui/ layout/ motion/ graphics/
  features/               Site-specific modules (may use Next.js, content, i18n)
    site/                 Header, footer, nav, language switcher, page header, 404 view
    home/                 Hero + home sections
    portfolio/            Project preview, case-study template, diagrams, timeline
    lab/                  Experiment registry + binary-search (pure logic / UI split)
    writing/              Markdown loader, renderer, article preview
    explorer/             Explorer specimens and demos (dev-only consumers)
  content/                Personal facts: profile, projects/*, milestones, articles/
  config/                 site (origin, indexing), navigation, contact channels
  i18n/                   Locale config, path helpers, dictionaries (en is the shape)
  lib/                    Small utilities: cn, seo, structured data, contact validation, dates, OG card
  styles/                 globals.css (tokens), fonts.ts + self-hosted fonts
  types/                  Content types
tests/                    unit/ (content integrity), e2e/ (Playwright), fixtures/, stubs/
```

Dependency direction: `app → features → components/lib`, and `features → content/config/i18n`.
`components/*` never import from `features`, `content`, `config` or `i18n`.

## Rendering strategy

- **Static by default.** Every locale page is prerendered at build time (`generateStaticParams`
  on `[lang]`, projects, experiments and articles). Unknown slugs return 404
  (`dynamicParams = false`). The only dynamic route is the catch-all `[...rest]`, which
  renders the localized 404 inside the site layout.
- **Server Components first.** Pages, layouts, content, case studies and SVG artwork render on
  the server. Client boundaries are leaves:
  - nav links (active state) and the language switcher (current path);
  - mobile nav (Dialog);
  - Radix wrappers;
  - motion components;
  - the Lab visualizer;
  - the scene wrapper and the lazily loaded 3D scene.
- **First paint never waits for 3D.** The hero ships a server-generated SVG of the J. On the
  client, `SceneWrapper` decides:
  1. Reduced motion, save-data, low memory, no WebGL, or a software rasterizer (SwiftShader,
     llvmpipe… detected via `WEBGL_debug_renderer_info`) → keep the SVG.
  2. Otherwise load the Three.js chunk via `React.lazy` during idle time.
  3. Cross-fade once the first frame renders.
  4. Context loss or errors → back to SVG.

  The scene uses `frameloop="never"` offscreen or in hidden tabs, `"demand"` when paused, and
  caps the device pixel ratio at 1.75 (1.5 on lite). It reduces geometry on touch and small
  screens and disposes all GPU resources on unmount. Three.js is only part of the home page’s
  lazily loaded chunk.
- **Hydration safety.** No `Date.now()`/random values during render: Lab arrays use seeded
  PRNGs and dates are formatted in UTC. Client-only values use `useSyncExternalStore` with a
  server snapshot: reduced motion, graphics decision, live token values.
- **Fonts** are self-hosted through `next/font/local` (no network at build or runtime). The
  italic face is not preloaded.

## Content flow

```
src/content/*.ts (Localized<T> records)          src/i18n/dictionaries/{en,uz}.ts
            │  resolveProject(record, locale)                 │ getDictionary(locale)
            ▼                                                 ▼
  lib/projects.ts → Project (plain strings)  ─────►  pages/features (no locale conditionals)
src/content/articles/<locale>/*.md → features/writing/articles.ts (parse + validate + render)
src/config/contact.ts → lib/contact.ts (validate) → only valid links render
```

Components receive already-localized strings. The only locale-aware code is in
`src/i18n`, `src/lib/projects.ts` and page-level parameter handling.

## Internationalization

- Locales: `en` (default) and `uz` (Uzbek Latin, `<html lang="uz-Latn">`).
- Every route lives under `/[lang]`. `proxy.ts` redirects locale-less URLs to the saved
  choice (cookie set by the switcher) or English.
- The language switcher links to the same path in the other locale, so it works without JS.
- Metadata is per locale: canonical URL, `hreflang` alternates with `x-default`, Open Graph
  locale and a localized OG image.

## SEO and indexing

- `NEXT_PUBLIC_SITE_URL` sets the canonical origin (metadata, sitemap, JSON-LD).
- Indexing is **off unless `SITE_INDEXING=true`** (and never on Vercel previews). Off means
  `robots.txt` disallows all and pages carry `noindex, nofollow`.
- JSON-LD (`Person` + `WebSite`) contains only verified facts: name, URL, stated interests
  and configured public profiles.
