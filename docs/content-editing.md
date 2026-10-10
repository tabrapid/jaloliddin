# Editing content

All personal content is data. You should never need to copy a page to change what the site
says. After editing, run `pnpm test`; the content tests catch missing translations, broken
references and misleading claims.

**Truthfulness rule:** only publish what is true and confirmed. If you don’t have a fact yet,
leave the field empty or omit the claim, and note it in `CONTENT_TODO.md`.

## Edit profile details

File: `src/content/profile.ts`

- `heroStatement`, `heroIntro` — first viewport.
- `aboutTeaser` — home “About” section.
- `capabilities` — home “What I work on”. Each one needs a `context` that names where it shows
  up on the site, plus an optional `href`.
- `aboutLead`, `aboutChapters`, `principles`, `interests` — About page.

Every text field is `{ en: "…", uz: "…" }`.

## Add a project

1. Copy `src/content/projects/school-platform.ts` to `src/content/projects/<slug>.ts`.
2. Fill in the `ProjectRecord` (types in `src/types/content.ts`):
   - `slug` — lowercase-hyphenated, used in `/work/<slug>`.
   - `status` — `concept` | `in-development` | `prototype` | `live`. Use `live` only with a
     real `links.live`.
   - `scope` is what the project is *designed* to do. `implemented` lists only verified
     functionality; leave it empty until confirmed and the page explains this.
   - `outcomes`, `nextSteps` and `links` render only when non-empty. Never invent metrics.
   - `media`: `{ kind: "diagram", illustration: … }` draws a labelled conceptual illustration
     from `architecture`. For a real screenshot, use
     `{ kind: "screenshot", src: "/images/…png", width, height, alt, caption }` and put the
     file in `public/images/`.
3. Register it in `src/content/projects/index.ts`.

The work index, detail page, sitemap, OG image and metadata pick it up automatically.

## Add an article

Create `src/content/articles/<locale>/<slug>.md`:

```md
---
title: How binary search thinks
summary: One sentence for lists and search results.
date: 2026-11-02
tags: [algorithms]
draft: false
---

Markdown body…
```

- Use the same slug in `en/` and `uz/` for a translation. An article may exist in only one
  language.
- `draft: true` shows it only in `pnpm dev`.
- Raw HTML is shown as text. The Writing page shows a designed empty state while there are
  no articles.

## Update translations

- Interface strings live in `src/i18n/dictionaries/en.ts` (the source of truth for the shape)
  and `uz.ts`.
- TypeScript requires `uz` to have every key in `en`. Tests also check placeholders such as
  `{count}` match.
- Uzbek typography: use ʻ (U+02BB) in oʻ/gʻ and ʼ (U+02BC) for the tutuq belgisi. Both fonts
  support them.
- Content records carry their own `{ en, uz }` pairs.

## Add contact links

File: `src/config/contact.ts`. Set `value` for a channel:

```ts
{ kind: "email", value: "you@domain.com" },
{ kind: "github", value: "https://github.com/your-username" },
```

Values are validated (correct host and path format, https only). Anything invalid simply does
not render. Configured links appear on the contact page, the home contact band, the footer
and in JSON-LD `sameAs`. Supported kinds: email, github, telegram, linkedin, x, leetcode,
codeforces. Add new kinds in `src/config/contact.ts`, `src/lib/contact.ts` and both
dictionaries (`contactLabels`).

## Add a milestone

File: `src/content/milestones.ts`. Add `{ date: "2026-05", title: { en, uz }, detail?, href? }`
for verified milestones only. The home page shows the section automatically once the list is
non-empty.

## Add a Lab experiment

1. Put pure logic and tests in `src/features/lab/<slug>/` and the client UI next to them.
2. Add strings to both dictionaries.
3. Register it in `src/features/lab/registry.ts` and map its view in
   `src/features/lab/views.tsx`.
