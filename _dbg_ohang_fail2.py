# -*- coding: utf-8 -*-
import sys
sys.stdout.reconfigure(encoding="utf-8")
from pathlib import Path
t = Path(r"C:\Users\a8071\Projects\nameanalyz\assets\index-kw5.js").read_text(encoding="utf-8")
out = Path(r"C:\Users\a8071\Projects\nameanalyz\_kw5_snips")

# all ohang rows in jonghap
idx = 0
n = 0
while n < 10:
    j = t.find('children:"오행"', idx)
    if j < 0:
        break
    ctx = t[j-80:j+200]
    print(n, j, ctx[:120].replace("\n"," "))
    (out / f"ohang_hit_{n}.txt").write_text(t[j-100:j+900], encoding="utf-8")
    idx = j + 1
    n += 1

# extract full current ohangRow
i = t.find('data-loc":"client/src/pages/Home.tsx:ohangRow"')
(out / "ohang_full_now.txt").write_text(t[i:i+1800], encoding="utf-8")
print("Wrote ohang_full_now")

# Check if Hd is in scope - is On block inside j6?
on = t.find("On&&(()=>{const G=to")
print("On at", on, "ohangRow at", i, "On before ohang", on < i)

# Check node can evaluate the map expression briefly
print("has lab?", "const lab=" in t[i:i+1200])
print("has tag 생?", '"생"' in t[i:i+1200])
