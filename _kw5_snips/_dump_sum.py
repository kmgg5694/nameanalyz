# -*- coding: utf-8 -*-
from pathlib import Path
kw = Path(r"C:\Users\a8071\Projects\nameanalyz\assets\index-kw5.js").read_text(encoding="utf-8")
out = Path(r"C:\Users\a8071\Projects\nameanalyz\_kw5_snips")

i = kw.find('Home.tsx:1137')
print("1137", i)
(out/"now_sum_table.txt").write_text(kw[i:i+2200] if i>=0 else "MISS", encoding="utf-8")

print("한문수리 Home", kw.find('Home.tsx:1150'))
print("한문수리 children", [j for j in range(len(kw)) if False])
idx=0
hits=[]
while True:
    j=kw.find('children:"한문수리"', idx)
    if j<0: break
    hits.append(j)
    idx=j+1
print("한문수리 hits", hits)

print("snBtn def", kw.find("snBtn=(ttl"))
print("snBtn calls", kw.count("snBtn("))
print("1147 join", kw.find('Home.tsx:1147'))
