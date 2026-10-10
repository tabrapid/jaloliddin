# Articles

Write each article as Markdown in `<locale>/<slug>.md`, e.g. `en/how-binary-search-thinks.md`.
A translation uses the same slug in the other locale folder (`uz/how-binary-search-thinks.md`).

```md
---
title: How binary search thinks
summary: One sentence that appears in the article list and in search results.
date: 2026-11-02
tags: [algorithms, lab]
draft: false
---

Your text in Markdown…
```

- `draft: true` keeps an article visible only in `pnpm dev`.
- Slugs use lowercase letters, numbers and hyphens.
- Raw HTML is shown as text, not rendered.
- Files starting with `_` are ignored.

Only publish writing that is genuinely yours.
