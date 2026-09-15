# -*- coding: utf-8 -*-
from pathlib import Path
import re

t = Path("assets/index-eTNXNndF.js").read_text(encoding="utf-8")

for s in ["Youth", "Middle Age", "Early Fortune", "Prime", "원형이정", "탄생일"]:
    i = 0
    n = 0
    while True:
        i = t.find(s, i)
        if i < 0:
            break
        n += 1
        Path(f"_ctx_{s.replace(' ','_')}_{n}.txt").write_text(t[max(0,i-150):i+250], encoding="utf-8")
        i += len(s)
    print(s, n)

# Find table headers near won/hyeong summary
# Look for children:"원 or English age labels in sum table
for m in re.finditer(r'children:"(원|형|이|정|Youth|Middle|Early|Late|Prime|Senior|Childhood|Adulthood|Fortune|Destiny|Legacy|Foundational|Growth|Harvest|Ultimate)[^"]*"', t):
    print("CHILD", m.group(0))

# Also search for labels used when S is false (English)
for m in re.finditer(r'S\?"[^"]{1,20}":"[^"]{1,40}"', t):
    g = m.group(0)
    if any(x in g for x in ("원", "형", "이", "정", "Youth", "Middle", "Early", "Late", "Won", "Hyeong", "Jeong", "元", "亨", "利", "貞", "Prime", "Fortune")):
        print("TERN", g)
