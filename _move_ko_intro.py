# -*- coding: utf-8 -*-
from pathlib import Path
import re

t = Path("assets/index-kw5.js").read_text(encoding="utf-8")
intro_start = t.find('m.jsxs("div",{className:"intro-sec"')
print("intro_start", intro_start)
if intro_start < 0:
    raise SystemExit("intro not found")

# find end of intro-sec: matching closing }]) after video preload
# The structure is: m.jsxs("div",{className:"intro-sec",children:[...]}),
# Find the pattern ending with video and }]}),
needle = 'preload:"auto"})})]}),'
# search from intro_start
rel = t.find(needle, intro_start)
print("end needle", rel)
if rel < 0:
    # try alternate
    for n in ['preload:"auto"})})]})', 'preload:"auto"})})]']:
        print(n, t.find(n, intro_start))

intro_end = rel + len(needle)  # includes comma
intro_block = t[intro_start:intro_end]
Path("_ko_intro_block.txt").write_text(intro_block, encoding="utf-8")
print("block len", len(intro_block))
print("block head", intro_block[:120])
print("block tail", intro_block[-80:])

# Find insertion point: after sticky nav, near start of main content
# Look for header+nav then first main content
# From earlier: sticky top-[58px] nav Home.tsx:527
nav_marker = 'data-loc:"client/src/pages/Home.tsx:527"'
nav_i = t.find(nav_marker)
print("nav", nav_i)

# After nav closes, look for main / max-w / padding content
# Search for common pattern after nav in Home
after_nav = t[nav_i:nav_i+3000]
Path("_ko_after_nav.txt").write_text(after_nav, encoding="utf-8")

# Also find "이름 입력" / form card start
for s in [
    'data-loc:"client/src/pages/Home.tsx:560"',
    'data-loc:"client/src/pages/Home.tsx:564"',
    'data-loc:"client/src/pages/Home.tsx:566"',
    'data-loc:"client/src/pages/Home.tsx:568"',
    'data-loc:"client/src/pages/Home.tsx:569"',
    'ink-card p-5 space-y-4',
    'koNameInput',
]:
    print(s, t.find(s, nav_i, intro_start))
