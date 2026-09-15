# -*- coding: utf-8 -*-
from pathlib import Path
import sys
sys.stdout.reconfigure(encoding="utf-8")
kw = Path(r"C:\Users\a8071\Projects\nameanalyz\assets\index-kw5.js").read_text(encoding="utf-8")

for n in ["총평", "verdict", "중도하차", "재물운", "상생 2개", "Wo=", "이름 vs", "사주", "빨간색"]:
    hits = []
    idx = 0
    while len(hits) < 10:
        j = kw.find(n, idx)
        if j < 0:
            break
        hits.append(j)
        idx = j + 1
    print(n, hits[:8])

# Find summary IIFE end / verdict after 요약보기 table
i = kw.find('Home.tsx:1172"')
print("\n=== after 1172 ===")
print(kw[i:i+2500])
