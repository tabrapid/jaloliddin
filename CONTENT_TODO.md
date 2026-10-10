# Content checklist

Facts the site needs from Jaloliddin. Nothing below is shown publicly until it is confirmed;
missing items are omitted gracefully, never shown as “TODO”. Edit locations are in
`docs/content-editing.md`.

## Claims to confirm (currently shown)

- [ ] **Bloodchain status** is shown as **“In development”** (`src/content/projects/bloodchain.ts`).
      Change to `concept` if no code exists yet, or `prototype` if a working prototype exists.
- [ ] **Bloodchain role**: “Creator · product and system design”. Confirm, or name the team and
      your part if others contribute.
- [ ] **Bloodchain workflows, architecture and design considerations** are written as intended
      design derived from the stated scope (appointments, emergency requests, donation history,
      donor app, organization portals). Confirm they match your plan, or edit them.
- [ ] **School platform role**: “Creator · concept and system design”.
- [ ] **Narrative copy**: hero statement, intro, about chapters and the three “How I like to work”
      principles were drafted from your brief. Review them in your own voice (EN and UZ).
- [ ] **“Creative school” wording**: confirm that “creative school” is the right English term
      (art school / creative lyceum / design school?) and that the Uzbek wording “ijodiy maktab” is
      accurate.
- [ ] **Uzbek translations**: have a native speaker review `src/i18n/dictionaries/uz.ts` and the
      `uz` fields in `src/content/`.

## Missing personal facts (omitted for now)

- [ ] Contact channels: email, GitHub, Telegram, LinkedIn, Codeforces/LeetCode
      (`src/config/contact.ts`). The contact page currently shows an honest
      “coming soon” state.
- [ ] Verified milestones with dates (competitions, olympiads, certificates, releases), shown on
      the home page once added (`src/content/milestones.ts`).
- [ ] Competitive programming profile or results, only if you want them public.
- [ ] Bloodchain: which parts are actually implemented (`implemented`), and the tech stack (only
      if confirmed; the architecture currently shows responsibilities, not technologies).
- [ ] Bloodchain: public repository or demo URL, only if public (`links`).
- [ ] Bloodchain: verified outcomes (pilots, feedback, partner interest), only with evidence. Never
      invent numbers.
- [ ] Bloodchain next steps (`nextSteps`), if you want to share a roadmap.
- [ ] Year(s) for projects (`year`), optional.
- [ ] Production domain for `NEXT_PUBLIC_SITE_URL`.

## Missing assets

- [ ] Real Bloodchain screenshots (donor app, organization portal). Until then the site shows a
      clearly labelled conceptual illustration.
- [ ] Real School platform visuals, if it moves beyond the concept stage.
- [ ] Optional portrait photo for the About page. Not required; the design works without it.

## Writing

- [ ] No articles are published. Add genuine notes in `src/content/articles/` whenever ready;
      the Writing page shows a designed empty state meanwhile.

## Privacy (intentionally not shown)

Age, phone number, precise address and school records are deliberately excluded. Keep them out
of content files.
