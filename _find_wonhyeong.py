# -*- coding: utf-8 -*-
from pathlib import Path
import re

t = Path("assets/index-eTNXNndF.js").read_text(encoding="utf-8")

# Find summary table headers and labels related to won/hyeong/i/jeong
patterns = [
    r'children:"[^"]{0,40}원[^"]{0,20}"',
    r'children:"[^"]{0,40}형[^"]{0,20}"',
    r'children:"[^"]{0,40}이[^"]{0,20}"',
    r'children:"[^"]{0,40}정[^"]{0,20}"',
    r'children:"[^"]*Yuan[^"]*"',
    r'children:"[^"]*Won[^"]*"',
    r'children:"[^"]*Hyeong[^"]*"',
    r'children:"[^"]*Jeong[^"]*"',
    r'children:"[^"]*Early[^"]*"',
    r'children:"[^"]*Prime[^"]*"',
    r'children:"[^"]*Youth[^"]*"',
    r'children:"[^"]*Late[^"]*"',
    r'"[^"]*원형이정[^"]*"',
    r'"[^"]*Wonhyeong[^"]*"',
    r'"[^"]*Yuan Heng[^"]*"',
    r'th>\s*[^<]*원',
]

hits = []
for p in patterns:
    for m in re.finditer(p, t):
        hits.append(m.group(0)[:120])

# Dedup preserve order
seen = set()
out = []
for h in hits:
    if h not in seen:
        seen.add(h)
        out.append(h)

Path("_won_hits.txt").write_text("\n".join(out), encoding="utf-8")
print("hits", len(out))

# Also extract around "원형이정"
i = t.find("원형이정")
while i >= 0:
    Path(f"_won_ctx_{i}.txt").write_text(t[max(0,i-200):i+400], encoding="utf-8")
    i = t.find("원형이정", i+1)

# Search for column headers Early/Youth style in English mode
for s in ["Early Years", "Youth", "Middle Age", "Later Years", "Late Years", "Childhood", "Adulthood", "Senior", "Won (", "Hyeong (", "Jeong (", "원(元)", "형(亨)", "이(利)", "정(貞)", "Yuan(", "Heng(", "Li(", "Zhen("]:
    print(repr(s), t.count(s), t.find(s))
