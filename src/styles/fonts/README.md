# Fonts

| File | Family | Licence |
| --- | --- | --- |
| `SchibstedGrotesk-latin-wght.woff2`, `-italic.woff2` | Schibsted Grotesk (variable 400–900) | SIL OFL 1.1 (`OFL-SchibstedGrotesk.txt`) |
| `RedHatMono-latin-wght.woff2` | Red Hat Mono (variable 300–700) | SIL OFL 1.1 (`OFL-RedHatMono.txt`) |

Source: Fontsource packages (`@fontsource-variable/*`, latin subset).

## Modification

The Schibsted Grotesk files (and the static OG copies in `src/assets/og/`) are **modified**.
U+02BB (ʻ, used in Uzbek oʻ / gʻ) is mapped to the font’s own `quoteleft` glyph, because the
original `uni02BB` glyph is half an em wide and renders as a gap (“G ʻoyalarni”). Only the
character map changed. The OFL allows this; the font declares no Reserved Font Name. To
re-apply after updating a font file, run `python3 scripts/patch-uzbek-okina.py`.
