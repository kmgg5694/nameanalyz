# -*- coding: utf-8 -*-
from pathlib import Path
t = Path(r"C:\Users\a8071\Projects\nameanalyz\assets\index-eTNXNndF.js").read_text(encoding="utf-8")
i = t.find("EnglishName.tsx:sumTable")
# search backwards for de= C= P= H= in dy
chunk = t[i-25000:i]
Path(r"C:\Users\a8071\Projects\nameanalyz\_kw5_snips\d_helpers.txt").write_text(chunk[:3000], encoding="utf-8")
# find last occurrences of helper defs before sumTable
for s in ["const de=", "de=(", ",de=", "const C=", "C=n=>", "const P=", "P=n=>", "const H=", "H=(", "nameEn"]:
    print(s, "last before sum", chunk.rfind(s), "count", chunk.count(s))
# find dy function start
print("function dy", t.find("function dy("))
# look near EnglishName.tsx:1048 or 1043
j = t.find("EnglishName.tsx:1043n")
print("1043n", j)
print("around 1040 helpers", t[j-800:j][:400] if j>0 else "")
# nameEn on gwe
k = t.find('nameEn:"Hwa')
print("gwe nameEn hwa", k)
k = t.find("nameEn:", t.find("화천대유"))
print("after 화천대유", t[t.find("화천대유"):t.find("화천대유")+180] if t.find("화천대유")>=0 else "")
