# -*- coding: utf-8 -*-
from pathlib import Path
t = Path(r"C:\Users\a8071\Projects\nameanalyz\assets\index-eTNXNndF.js").read_text(encoding="utf-8")
out = Path(r"C:\Users\a8071\Projects\nameanalyz\_kw5_snips\color_flags.txt")
parts = []
# current 총평 pieces
i = t.find("(()=>{const strip=")
j = t.find('EnglishName.tsx:sumTable')
parts.append("=== IIFE HEAD ===")
parts.append(t[i:i+2500] if i>=0 else "NO IIFE")
parts.append("\n=== IIFE MID ===")
parts.append(t[i+2500:i+5200] if i>=0 else "")
parts.append("\n=== FLAGS ===")
for s in ["isTaboo:!0","isBest:!0","isTaboo:true","isBest:true","type:\"best\"","type:\"taboo\"","type:\"caution\""]:
    parts.append(f"{s} count={t.count(s)}")
# sample isBest nearby names
idx = 0
n = 0
while n < 8:
    k = t.find("isBest:!0", idx)
    if k < 0:
        k = t.find("isBest:true", idx)
    if k < 0:
        break
    parts.append("BEST@"+str(k)+" "+t[max(0,k-80):k+40])
    idx = k + 8
    n += 1
idx = 0
n = 0
while n < 6:
    k = t.find("isTaboo:!0", idx)
    if k < 0:
        k = t.find("isTaboo:true", idx)
    if k < 0:
        break
    parts.append("TABOO@"+str(k)+" "+t[max(0,k-80):k+40])
    idx = k + 8
    n += 1
# wealth in summary / ohang
for s in ["재물", "wealth", "isBest", "청색"]:
    parts.append(f"find {s}={t.find(s)}")
out.write_text("\n".join(parts), encoding="utf-8")
print("wrote", out, "iife", i, "sum", j)
