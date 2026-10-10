# Design system

Everything visual is driven by tokens in `src/styles/globals.css`. Components use semantic
utilities only; the dev-only explorer (`/explorer`) renders every token and component live.

## Tokens

### Colour (three layers)

1. **Primitives** — `--palette-*` raw values (graphite, ivory, silver, blue, ember, mint).
2. **Semantic roles** — what components mean, e.g. `--canvas`, `--ink`, `--accent`, `--action`.
3. **Tailwind bridge** — `@theme inline` exposes roles as utilities (`bg-canvas`, `text-ink-2`,
   `border-line`, `bg-action`). The default Tailwind palette is removed (`--color-*: initial`)
   so off-system colours cannot creep in.

| Role | Use | Contrast on canvas |
| --- | --- | --- |
| `canvas`, `canvas-deep`, `raised`, `surface`, `surface-strong` | Graphite depth steps | — |
| `ink` | Primary text (warm ivory) | 17.1:1 |
| `ink-2` | Secondary text | 12.9:1 |
| `ink-3` | Muted labels, metadata | 7.7:1 |
| `accent` | Electric blue for graphics, glows, borders, decorative lines | not for text backgrounds |
| `accent-ink` | Blue text on graphite | 7.0:1 |
| `accent-glow` / `focus` | Glow, focus ring | 10.2:1 |
| `action` / `action-hover` | Filled buttons (ivory text 4.6:1 / 5.7:1) | — |
| `line`, `line-strong` | Hairlines (silver at 18% / 34%) | — |
| `success`, `danger` | Found / live; errors | 11.8:1 / 8.5:1 |

Ratios were computed with the WCAG 2 formula from the token values. **Never put small text
on `accent`** (3.6:1 with ivory). Use `action` instead.

To re-theme, edit primitives (or remap roles) in `:root`. No component changes are needed.
The WebGL scene reads `--accent`, `--accent-glow`, `--accent-deep` and `--ink` at runtime.

### Typography

| Utility | Size | Use |
| --- | --- | --- |
| `text-display-xl` | clamp(3.75rem, 14.5vw, 15rem) | Hero name, project titles |
| `text-display-lg` | clamp(2.75rem, 7.4vw, 7rem) | Section and page titles |
| `text-display-md` | clamp(2.125rem, 4.6vw, 4.25rem) | Statements, chapter titles |
| `text-heading` | clamp(1.5rem, 2.3vw, 2.125rem) | Card and section headings |
| `text-lead` | clamp(1.1875rem, 1.55vw, 1.4375rem) | Introductions |
| `text-body` | 1.0625rem / 1.65 | Reading text (default) |
| `text-small` | 0.9375rem | Supporting text |
| `text-label` | 0.75rem mono, uppercase, +0.08em | Labels, metadata, indexes |

Families come from `src/styles/fonts.ts` (`--font-schibsted`, `--font-redhat-mono`), both
self-hosted woff2 under SIL OFL. Display sizes carry built-in negative tracking. Headings use
`text-wrap: balance` and paragraphs `pretty`.

### Spacing, radius, elevation

- Component spacing uses Tailwind’s 4px scale. Sections use `py-section` (fluid,
  5.5–10.5rem) or `py-section-tight`. The side gutter is `px-gutter` (fluid, 1.25–3rem). Max
  width is `max-w-site` (92rem).
- Radii stay small for an editorial feel: `rounded-xs` 2px, `sm` 4px, `md` 8px, `lg` 14px,
  `pill`.
- Elevation is rare. `shadow-raised` gives an inset highlight and a soft drop; `shadow-glow`
  is for primary hover and the current Lab cell.
- Texture utilities: `atmosphere` (soft blue/silver radial light), `blueprint` (48px grid),
  `glass` (header), `hairline-t` / `hairline-b`.

## Component conventions

- **Generic components** (`src/components/ui`, `layout`, `motion`, `graphics`) take typed
  props and never import site content, routes or dictionaries. Text such as labels is passed
  in.
- **Variants are explicit unions** (`variant`, `size`, `tone`, `layout`). Avoid boolean
  flags; when a component grows several, split it.
- **Router-agnostic links**: use `<Button asChild><Link …/></Button>`. Features may use
  `next/link` directly.
- **Polymorphism is limited** to a short list of intrinsic elements (`as`) to keep types
  strict.
- **Client boundaries are small**: only interactive leaves carry `"use client"` (nav links,
  language switcher, mobile nav, Radix wrappers, motion, the Lab, the 3D scene). Pages,
  layouts, content and most components are Server Components.
- **Accessibility is part of the API**: required labels (`closeLabel`, Field `label`),
  `aria-disabled` for controls that become unavailable while focused, stretched-link cards
  with one accessible name, and a visible `:focus-visible` ring everywhere.

## Motion rules

| Motion | Implementation | Without motion |
| --- | --- | --- |
| Text entrance (large text) | `TextEntrance` (default `settle`) / `.entrance-settle`: transform-only glide, ~1.1s, staggered per word. The text is painted on the first frame, so LCP is unaffected | Not applied; text simply shows |
| Text entrance (small accents) | `variant="rise"` / `.entrance` / `.entrance-fade`: opacity + rise for eyebrows and button groups only | Not applied |
| Section reveal | `Reveal` / `Stagger` (Motion). Hides only elements that start below the fold, after hydration | Never hides anything |
| Hover | `HoverSurface` pointer light + spring lift (fine pointers only) | Light only, no movement |
| Controls | 160–280ms colour/transform transitions | Transitions reduced to ~0ms |
| Hero J | WebGL scene: assembly (2.6s), pulses, pointer light; pauses offscreen and in hidden tabs | Static SVG, no pulses |
| Ornament | Rosette spins over 180s; light pulses travel the fallback SVG | Static |

Rules:

1. Never hijack scrolling, force an intro or autoplay sound.
2. Content must be visible and usable if animation or JavaScript fails.
3. Anything looping longer than 5s needs a pause control (the hero toggle pauses the scene and
   all `.motion-decor` CSS animation).
4. Respect `prefers-reduced-motion` everywhere. `MotionProvider` sets
   `reducedMotion="user"`, CSS uses `@media (prefers-reduced-motion)`, and
   `usePrefersReducedMotion()` is the hydration-safe hook.
5. Never fade in large first-viewport text (headings, intros). Opacity or clip entrances
   delay Largest Contentful Paint; use `settle`.
6. Durations and easings come from tokens (`--duration-*`, `--ease-out-expo`,
   `src/components/motion/tokens.ts`).
