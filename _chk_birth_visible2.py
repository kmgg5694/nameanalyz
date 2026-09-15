# -*- coding: utf-8 -*-
from pathlib import Path
import sys
sys.stdout.reconfigure(encoding="utf-8")
kw = Path(r"C:\Users\a8071\Projects\nameanalyz\assets\index-kw5.js").read_text(encoding="utf-8")

# Structure: find 772 relative to result-full-capture and 요약보기
r = kw.find('id:"result-full-capture"')
s = kw.find('children:"요약보기"', r)
n = kw.find('Home.tsx:772', r)
print("result", r, "772", n, "요약보기", s)
print("772 before 요약?", n < s if n>0 and s>0 else None)

# What's between result start and 772 - look for early name display
chunk = kw[r:n]
print("len to 772", len(chunk))
# Find ink-card name-like displays
for needle in ["text-4xl", "ink-card p-6 text-center", "Home.tsx:77", "Home.tsx:78", "Home.tsx:79", "Home.tsx:80"]:
    print(needle, chunk.count(needle), chunk.find(needle))

# Print from 760 to 780 markers
for loc in range(760, 800):
    m = f'Home.tsx:{loc}"'
    j = kw.find(m, r)
    if j > 0 and j < s + 500:
        print(loc, j)

# Dump 768-780 area
j = kw.find('Home.tsx:768', r)
if j < 0:
    j = kw.find('Home.tsx:770', r)
print("\n=== 770 region ===")
print(kw[kw.find('Home.tsx:770', r)-100:kw.find('Home.tsx:775', r)+200])

# Is birth in scope? Check if name card is inside nested IIFE that doesn't close over birth
# Look backwards from 772 for (()=>{  and birthSuri
back = kw[n-2000:n]
print("\nbirth in 2k before 772?", "birth." in back)
print("IIFE starts", back.count("(()=>{"))
print("snippet before 772:")
print(kw[n-500:n+50])
