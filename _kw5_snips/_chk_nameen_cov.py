# -*- coding: utf-8 -*-
from pathlib import Path
import re
t = Path(r"C:\Users\a8071\Projects\nameanalyz\assets\index-eTNXNndF.js").read_text(encoding="utf-8")
# current list helpers
i = t.find("const listSuriBad=")
print("listSuri", t[i:i+500] if i>=0 else "MISSING")
# hangul in English-only string literals in IIFE (right side of S?:)
a = t.find("EnglishName.tsx:sumTable")
# find IIFE
s = t.rfind("(()=>{const strip=", 0, a)
chunk = t[s:a+800]
# English branches after :
# show any hangul that appears after :" and before next "
# simpler: find 「
print("corner quotes", chunk.count("「"), chunk.count("」"))
print("de( in iife", chunk.count("de("), "H(", chunk.count("H("))
# nameEn coverage for suri
suri = re.findall(r'\{num:(\d+),name:"([^"]+)"[^}]*?nameEn:"([^"]*)"', t)
print("suri with nameEn", len(suri))
suri_no = re.findall(r'\{num:(\d+),name:"([^"]+)",type:', t)
print("suri total-ish", len(suri_no))
# gwe nameEn
gwe = re.findall(r'\{id:(\d+),name:"([^"]+)"[^}]*?nameEn:"([^"]*)"', t)
print("gwe with nameEn", len(gwe))
# sample 재화연속 간위산
for nm in ["재화연속", "간위산", "수복겸전"]:
    j = t.find('name:"%s"' % nm)
    print(nm, "at", j, t[j:j+120].replace("\n"," ") if j>=0 else "")
