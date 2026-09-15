# -*- coding: utf-8 -*-
from pathlib import Path
import sys
sys.stdout.reconfigure(encoding="utf-8")
kw = Path(r"C:\Users\a8071\Projects\nameanalyz\assets\index-kw5.js").read_text(encoding="utf-8")

# Find birth 주역 sections: 요약보기 bdSum + 탄생일 풀이 under hanja table
for n in ["bdSumBox", "bdSumGwe", "bdSumSuri", "탄생주역", "탄생일 풀이", "birthRead", "birthSuri"]:
    print(n, kw.find(n), kw.count(n))

# Dump 탄생일 풀이 block (birthRead)
i = kw.find("Home.tsx:birthRead")
if i < 0:
    i = kw.find("탄생일은 음력")
print("\n=== birthRead/풀이 ===")
print(kw[i-80:i+1800] if i>0 else "miss")

print("\n=== bdSumBox ===")
j = kw.find("bdSumBox")
print(kw[j-50:j+1200] if j>0 else "miss")
