# -*- coding: utf-8 -*-
from pathlib import Path
import sys
sys.stdout.reconfigure(encoding="utf-8")
kw = Path(r"C:\Users\a8071\Projects\nameanalyz\assets\index-kw5.js").read_text(encoding="utf-8")

for n in ["상생", "상극", "sangsaeng", "sanggeuk", "오행", "hjO", "hanjaOhang", "hangeulOhang", "전체 오행", "오행 분포"]:
    hits = []
    idx = 0
    while len(hits) < 8:
        j = kw.find(n, idx)
        if j < 0:
            break
        hits.append(j)
        idx = j + 1
    print(n, hits[:6])

# Find result ohang section
for needle in ["Home.tsx:1210", "Home.tsx:ohang", "겉으로는", "오행은", "전체 오행"]:
    j = kw.find(needle)
    print(needle, j)
    if j > 0:
        print(repr(kw[j:j+200]))
