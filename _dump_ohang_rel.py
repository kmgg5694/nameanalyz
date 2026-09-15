# -*- coding: utf-8 -*-
from pathlib import Path
import sys
sys.stdout.reconfigure(encoding="utf-8")
kw = Path(r"C:\Users\a8071\Projects\nameanalyz\assets\index-kw5.js").read_text(encoding="utf-8")

# Dump ohang interpretation IIFE around Home.tsx:1210
i = kw.find('Home.tsx:1210"')
print("=== before 1210 ===")
print(kw[i-2500:i+800])

# Find how relations between positions are labeled
j = kw.find('Tn=ho=>ho==="sangsaeng"')
print("\n=== Tn label ===", j)
print(kw[j:j+200] if j>0 else "")

# Find where hangul vs hanja ohang shown side by side
for needle in ["한글 오행", "한문 오행", "겉", "속", "hjO", "K[", "ohangCounts"]:
    idx = kw.find("function j6()")
    hits = []
    while len(hits) < 5:
        k = kw.find(needle, idx)
        if k < 0 or k > idx + 150000:
            break
        hits.append(k)
        idx = k + 1
    print(needle, hits)
