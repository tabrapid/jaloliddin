#!/usr/bin/env python3
"""
Fix the Uzbek oʻ/gʻ spacing in the self-hosted Schibsted Grotesk files.

Schibsted Grotesk draws U+02BB (MODIFIER LETTER TURNED COMMA, the Uzbek
ʻ in oʻ and gʻ) as a 0.5 em spacing glyph, which renders as a visible gap:
"G ʻoyalarni". This script maps U+02BB to the font's own quoteleft (U+2018)
glyph, which has the same turned-comma shape and normal width. Only the
character map changes; outlines, metrics and variations are untouched.
Text keeps the correct codepoint, so copy/paste and search are unaffected.

Schibsted Grotesk is licensed under the SIL OFL 1.1 without a Reserved Font
Name, so modified copies may keep the name. U+02BC (ʼ) is already fine.

Usage (one-off, idempotent):  python3 -m pip install fonttools brotli
                              python3 scripts/patch-uzbek-okina.py
"""
from pathlib import Path

from fontTools.ttLib import TTFont

ROOT = Path(__file__).resolve().parent.parent
FILES = [
    ROOT / "src/styles/fonts/SchibstedGrotesk-latin-wght.woff2",
    ROOT / "src/styles/fonts/SchibstedGrotesk-latin-wght-italic.woff2",
    ROOT / "src/assets/og/SchibstedGrotesk-ExtraBold.ttf",
    ROOT / "src/assets/og/SchibstedGrotesk-Regular.ttf",
]
OKINA, QUOTELEFT = 0x02BB, 0x2018

for path in FILES:
    font = TTFont(path)
    target = font.getBestCmap().get(QUOTELEFT)
    if target is None:
        raise SystemExit(f"{path.name}: no glyph for U+2018")
    changed = 0
    for table in font["cmap"].tables:
        if table.isUnicode() and OKINA in table.cmap and table.cmap[OKINA] != target:
            table.cmap[OKINA] = target
            changed += 1
    if changed:
        font.save(path)
    print(f"{path.name}: U+02BB -> {target} ({'patched' if changed else 'already patched'})")
