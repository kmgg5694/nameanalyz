# -*- coding: utf-8 -*-
"""Extract English-facing UI strings that may confuse US users."""
from pathlib import Path
import re

t = Path(r"C:\Users\a8071\Projects\nameanalyz\assets\index-eTNXNndF.js").read_text(encoding="utf-8")
out = []

# English branches of ternaries S?ko:en
for m in re.finditer(r'S\?"[^"]{0,80}":"([^"]{8,120})"', t):
    en = m.group(1)
    if any(ord(c) > 127 for c in en):
        continue
    # skip pure URLs / CSS-like
    if en.startswith("http") or en.startswith("#") or "px" in en:
        continue
    out.append(en)

# labelEn
for m in re.finditer(r'labelEn:"([^"]+)"', t):
    out.append("LABEL " + m.group(1))

# children with only ASCII English-looking
for m in re.finditer(r'children:"([A-Za-z][^"]{2,80})"', t):
    out.append("CHILD " + m.group(1))

# suspicious phonetics / jargon
keys = [
    "Suri", "suri", "Gwe", "gwe", "Ohang", "Five Elements", "I Ching",
    "hexagram", "Hanja", "stroke", "taboo", "auspicious", "inauspicious",
    "pillar", "numerology", "Jeong", "Won ", "Hyeong", "Yi ", "元", "亨",
    "木", "火", "土", "金", "水", "sangsaeng", "sanggeuk", "ceo", "staff",
    "rank", "Name ·", "Type", "Early Fortune", "Prime Years",
]
hits = {k: t.count(k) for k in keys}

# unique English ternary strings
seen = []
for s in out:
    if s not in seen:
        seen.append(s)

Path("_en_ui_strings.txt").write_text("\n".join(seen[:400]), encoding="utf-8")
Path("_en_jargon_counts.txt").write_text(
    "\n".join(f"{k}\t{v}" for k, v in hits.items()), encoding="utf-8"
)
print("strings", len(seen), "wrote files")
