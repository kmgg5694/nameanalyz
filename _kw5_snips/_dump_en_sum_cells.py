# -*- coding: utf-8 -*-
from pathlib import Path
p = Path(r"C:\Users\a8071\Projects\nameanalyz\assets\index-eTNXNndF.js")
t = p.read_text(encoding="utf-8")
i = t.find('(()=>{const strip=x=>String(x||"").replace')
print("iife", i)
if i < 0:
    i = t.find("EnglishName.tsx:sumTable")
    print("sumTable", i)
    Path(r"C:\Users\a8071\Projects\nameanalyz\_kw5_snips\en_sum_now.txt").write_text(
        t[max(0, i - 4000): i + 200], encoding="utf-8"
    )
else:
    j = t.find('EnglishName.tsx:1175', i)
    print("end", j)
    Path(r"C:\Users\a8071\Projects\nameanalyz\_kw5_snips\en_sum_now.txt").write_text(
        t[i:j if j > i else i + 12000], encoding="utf-8"
    )
print("ok")
