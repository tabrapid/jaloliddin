# Design direction — “Jaloliddin — Digital Workshop”

Creative expression meets engineering precision: an editorial, technical, atmospheric site
that still feels personal. This file records the references studied, what was learned from
each, and how the site applies those ideas without copying anyone’s work.

## Research method and limitations (October 2026)

- Research was done by a research sub-agent using web search plus direct reads where possible.
- **Direct page fetches were blocked in this environment** (DNS/proxy refusals) for every site
  except GitHub. Two references were verified from source (`bchiang7/v4` stylesheet,
  `brunosimon/folio-2025` README). The remaining principles come from search-result
  descriptions, the authors’ own published articles as indexed by search, and third-party
  write-ups. Treat specific values (e.g. Linear’s colours) as approximate.
- 2026 award galleries (Awwwards portfolio winners) could not be browsed visually. Browse
  <https://www.awwwards.com/websites/winner_category_portfolio/> by hand before a redesign.

## References and principles

| Reference | Principle learned | How it is adapted here |
| --- | --- | --- |
| Brittany Chiang v4 — <https://v4.brittanychiang.com> (source: <https://github.com/bchiang7/v4>) | Auto-numbered section headings set in mono and one accent; mono reserved for metadata. | Every section opens with a mono index + label (`01 —— SELECTED WORK`) in a narrow left rail, offset from an oversized title. This creates the asymmetric grid. Blue replaces v4’s teal, and reduced-motion handling is built in (v4 had none). |
| Linear — <https://linear.app> (third-party analyses) | Dark-first palette with a few closely spaced near-black steps; accent only for interaction; tight tracking at display sizes. | Four graphite steps (`canvas-deep → canvas → raised → surface`) provide depth without heavy shadows. Electric blue marks actions, focus and the current page. Negative tracking applies only to display sizes. |
| Bruno Simon folio-2025 — <https://bruno-simon.com> (README: <https://github.com/brunosimon/folio-2025>; case study: <https://www.awwwards.com/brunos-portfolio-case-study.html>) | When 3D is the concept, commit to one strong object. The repo documents no fallback or accessibility path. | One sculptural object (the J), never a world. Name and headline stay in real HTML. A server-rendered SVG of the same geometry is the first paint and the fallback. The 3D loads only after idle. |
| Stripe Press — <https://press.stripe.com> (reviews) | Tactile objects on a dark field, with restrained, meaningful hover. | Project previews lift slightly and catch a soft light that follows the pointer (`HoverSurface`). Colour stays restricted so blue remains the only accent. |
| Rauno Freiberg — <https://rauno.me> and his essay on invisible details of interaction design | Put the motion budget into small, robust interaction details, and keep experiments separate from projects. | Motion is spent on focus rings, toggles, the copy feedback and pointer response. The Lab is its own section, separate from Work. No scroll-jacking, no forced intro, no sound. |
| Lynn Fisher — <https://lynnandtonic.com> (case study: <https://lynnandtonic.com/thoughts/entries/case-study-2017-refresh/>) | Keep content separate so the design can be rebuilt freely. | All personal content lives in typed records under `src/content` and dictionaries under `src/i18n`. The presentation can be replaced without touching facts. |
| Josh Comeau on `prefers-reduced-motion` — <https://www.joshwcomeau.com/react/prefers-reduced-motion/> | The OS setting does nothing unless the site honours it. | CSS entrances only run under `no-preference`. Motion uses `reducedMotion="user"`. The hero falls back to the static SVG, and every loop has a visible pause control (WCAG 2.2.2). |

## The resulting direction

**Palette.** Deep graphite backgrounds, warm ivory text, electric blue for action and light,
restrained silver for hairlines and ornament. Defined once as primitives, then mapped to
semantic roles (see `docs/design-system.md`).

**Typography.** Two families only:

- **Schibsted Grotesk** — an editorial grotesk (originally drawn for a news publisher). It is
  oversized and tight for display, comfortable for reading.
- **Red Hat Mono** — technical labels and metadata.

Both include the Uzbek modifier letters ʻ (U+02BB) and ʼ (U+02BC). Several popular candidates
were rejected because they lack those letters; Bricolage Grotesque, Instrument Sans and Sora
were among the fonts checked.

**Composition.** A 4/8/12-column grid with intentional asymmetry: narrow mono rails against
wide titles, chapters that alternate their starting column, and sections that alternate
between spacious editorial pages (hero, about, contact) and dense technical ones
(capabilities, architecture, work index, Lab). Cards are used sparingly. Hairlines,
blueprint grids and a single glass header carry most of the structure.

**Signature graphic.** A sculptural “J” swept with an eight-pointed-star cross-section (the
khatam motif found in Uzbek and wider Islamic geometric ornament). The star twists by one
symmetry step along the stroke. Luminous rails, star ribs and converging particles suggest
ideas forming into a system. A faint girih rosette sits behind it. The same geometry module
drives both the WebGL scene and the SVG fallback.

**Ornament, restrained.** The khatam appears only where it carries meaning:

- the J’s cross-section;
- the logo mark and list bullets;
- the core node of system illustrations;
- a faint rosette behind headers;
- a tile band at the top of the footer.

**Motion.** Brief text entrances (CSS), gentle in-view reveals that never hide content by
default, refined hover light, and a 3D scene that pauses offscreen and on request. Native
scrolling is always preserved.

## Original work

No layout, artwork or code was copied from the references. The J geometry, ornament,
illustrations and components are generated procedurally in this repository.
