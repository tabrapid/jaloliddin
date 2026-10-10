# Progress

Last updated: 2026-10-10.

## Status: complete first release (local only, not deployed)

### Done

- **Foundation**: Next.js 16.3.8 App Router, React 19.2, strict TypeScript, Tailwind v4 tokens,
  pnpm lockfile, ESLint, Vitest, Playwright.
- **Design system**: three-layer colour tokens (primitives → roles → utilities), fluid type
  scale, two self-hosted fonts with Uzbek ʻ/ʼ support, spacing/radius/elevation/motion tokens.
- **Signature graphic**: procedural J with a khatam (eight-point star) cross-section.
  - WebGL scene (R3F + custom ribbon/point shaders): assembly, travelling pulses, pointer
    light, pauses offscreen/hidden, DPR cap, lite quality on touch/small screens, GPU cleanup.
  - Server-rendered SVG fallback from the same geometry, used for first paint, reduced
    motion, no or software WebGL, low memory, save-data and context loss.
  - Visible pause control.
- **Pages (EN + UZ)**: home (hero, selected work, about, capabilities, Lab preview,
  milestones-if-any, contact), work index, data-driven case studies (Bloodchain, School
  platform), about, Lab index + binary-search experiment, writing index/article template with
  empty state, contact (configured links only), localized 404 + global 404.
- **Lab**: binary search with pure trace logic, step player reducer, play/pause/next/previous/
  reset, target field with validation, present/missing picks, new array, live narration,
  low/mid/high pointers, arrow-key support, reduced-motion aware.
- **i18n**: `/[lang]` routing, proxy redirects with remembered choice, language switcher that
  preserves the page, localized metadata, `hreflang`, OG images.
- **SEO**: per-page titles/descriptions, canonical + alternates, OG/Twitter images (site +
  per project), favicon/apple icon, sitemap, robots, JSON-LD (verified facts only). Indexing is
  off unless `SITE_INDEXING=true`.
- **Component explorer** (dev only, `/explorer`): every component with live examples, states,
  snippets, props, a11y notes, tokens and motion/reduced-motion demos.
- **Docs**: README, CLAUDE.md, docs/* (design direction, design system, architecture, content
  editing, component reuse), CONTENT_TODO.md.

### Key decisions

- **Explorer gating**: runtime gating via the `NODE_ENV === "development"` branch plus dead-code
  elimination, not `pageExtensions`. Dev and production route types must match, or
  `pnpm build` fails after `pnpm dev`. Verified that explorer code is absent from the
  production output.
- **three pinned to 0.182.0**: newer versions log a `THREE.Clock` deprecation warning
  triggered by R3F 9.8.
- **Software WebGL counts as unsupported** (renderer string check). Lighthouse’s Chrome rendered
  the scene in SwiftShader, raising mobile TBT to 1.5s; after the fix it was 80ms.
- **Large first-viewport text uses a transform-only `settle` entrance**, so LCP is not delayed
  (observed LCP = FCP).
- **`action` tokens for filled buttons**: ivory on the brighter accent measured 3.6:1 (fails
  AA); the action blue gives 4.6:1, hover 5.7:1.
- **No `dynamicParams = false`**: in Next 16.3 it logs `NoFallbackError` for unknown slugs.
  Pages call `notFound()` instead (still prerendered for known slugs).
- **`TextEntrance` renders text once** (no screen-reader duplicate), so copy/search/SEO get
  clean text.

### Verification (this environment: Linux container, Node 22, headless Chromium 141 via Playwright 1.56)

- `pnpm check` (typecheck, lint, 57 Vitest tests, production build): passing.
- `pnpm test:e2e`: 60 passed, 8 skipped by design (each desktop-only or mobile-only check is skipped in the other project).
  Covers routes, internal-link crawl, 404s, explorer absent in production, SEO files, language
  switching and memory, Uzbek glyph coverage, skip link, mobile-menu focus trap, aria-current,
  touch targets, overflow, the Lab (play / keyboard / validation), reduced motion, WebGL init
  failure, pause control, forced WebGL scene, context-loss fallback and software-renderer
  rejection.
- Screenshots reviewed at 390 / 768 / 1440 px for all pages (no horizontal overflow).
- Lighthouse 12 (simulated mobile/desktop throttling, local `next start`): mobile performance 87–96, desktop 100; accessibility 100 and best practices 100 everywhere; CLS 0. Simulated mobile LCP 2.8–3.3s (observed LCP = FCP, 0.13–0.25s, unthrottled). Results vary between runs.
  SEO scores 66 only because indexing is disabled by default.

### Remaining / next

- Content from Jaloliddin: see `CONTENT_TODO.md` (contact links, status confirmations, real
  screenshots, milestones, Uzbek review).
- Optional: deploy and set `NEXT_PUBLIC_SITE_URL` + `SITE_INDEXING=true` for production only.
- Optional: real-device check of the WebGL scene on a phone GPU (only software GL was
  available here).
- Optional: ESLint 9 is in maintenance; move to ESLint 10 once `eslint-config-next` supports it.
