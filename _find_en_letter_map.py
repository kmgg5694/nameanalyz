# -*- coding: utf-8 -*-
"""Find English letter→element/stroke mapping near EnglishName logic."""
from pathlib import Path
import re

t = Path("assets/index-eTNXNndF.js").read_text(encoding="utf-8")
# search for common patterns
needles = [
    "A:1", "a:1", '"A"', "letterMap", "enMap", "alphaMap",
    "Wood", "Metal", "Fire", "Earth", "Water",
    "firstname", "lastName", "middleName",
    "charCode", "toUpperCase",
]
for n in needles:
    print(n, t.find(n), t.count(n))

# dump around Wood if related to letter
for m in re.finditer(r'.{0,40}Wood.{0,40}', t):
    s = m.group(0)
    if any(c.isalpha() and c.isascii() for c in s) and ("Fire" in s or "A" in s or "letter" in s.lower() or "{" in s):
        Path("_wood_hit.txt").write_text(s, encoding="utf-8")
        break

# Find object like {A:"木" or A:"Wood"
m = re.search(r'\{[A-Z]:["\'][^"\']+["\'](?:,[A-Z]:["\'][^"\']+["\']){10,}', t)
if m:
    Path("_letter_map.txt").write_text(m.group(0)[:2000], encoding="utf-8")
    print("map found", len(m.group(0)))
else:
    # try unicode wood
    m = re.search(r'A:["\']木["\']', t)
    print("A wood", m.group(0) if m else None)
    m2 = re.search(r'.{0,200}A:["\']木["\'].{0,400}', t)
    if m2:
        Path("_letter_map.txt").write_text(m2.group(0), encoding="utf-8")
        print("partial map")
