# -*- coding: utf-8 -*-
from pathlib import Path
import sys
sys.stdout.reconfigure(encoding="utf-8")
kw = Path(r"C:\Users\a8071\Projects\nameanalyz\assets\index-kw5.js").read_text(encoding="utf-8")

i = kw.find('Home.tsx:1136"')
# dump a large chunk of summary table
print(repr(kw[i:i+4500]))

print("\n\n=== snBtn def ===")
j = kw.find("snBtn=")
if j < 0:
    j = kw.find("const snBtn")
if j < 0:
    j = kw.rfind("snBtn=(", 0, i)
print("snBtn at", j)
print(repr(kw[j:j+600]) if j>=0 else None)

# find summary section title
k = kw.find("요약보기", 2300000)
print("\n요약 near result", k, repr(kw[k-100:k+80]) if k>=0 else None)
