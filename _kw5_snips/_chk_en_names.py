# -*- coding: utf-8 -*-
from pathlib import Path
t = Path(r"C:\Users\a8071\Projects\nameanalyz\assets\index-eTNXNndF.js").read_text(encoding="utf-8")
# find de= and H= helpers near EnglishName
for s in ["function de(", "const de=", "de=(", "function H(", "const H=", "H=(", "descEn", "nameEn"]:
    print(s, t.find(s), t.count(s))
# dump around EnglishName tip / de definition
i = t.find("function de(")
if i < 0:
    i = t.find("de=(n,")
print("de idx", i)
Path(r"C:\Users\a8071\Projects\nameanalyz\_kw5_snips\d_fmtNm2.txt").write_text(
    (t[i:i+800] if i>=0 else "NO de") + "\n---\n" + t[t.find("function H("):t.find("function H(")+500] if t.find("function H(")>=0 else "",
    encoding="utf-8")
# also find C= and P=
for s in ["const C=", "C=n=>", "function C(", "const P=", "P=n=>"]:
    print("fn", s, t.find(s))
