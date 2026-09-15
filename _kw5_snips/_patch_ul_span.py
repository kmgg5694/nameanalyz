# -*- coding: utf-8 -*-
from pathlib import Path
p = Path(r"C:\Users\a8071\Projects\nameanalyz\assets\index-kw5.js")
kw = p.read_text(encoding="utf-8")

old1 = 'fmtNm(vo.data.name).map((nm,ii)=>m.jsx("div",{style:{whiteSpace:"nowrap"},children:nm},ii))'
new1 = 'fmtNm(vo.data.name).map((nm,ii)=>m.jsx("span",{style:{display:"block",whiteSpace:"nowrap",textDecoration:"underline",textUnderlineOffset:"2px"},children:nm},ii))'
old2 = 'wrap2(vo.gwe.name).map((nm,ii)=>m.jsx("div",{style:{whiteSpace:"nowrap"},children:nm},ii))'
new2 = 'wrap2(vo.gwe.name).map((nm,ii)=>m.jsx("span",{style:{display:"block",whiteSpace:"nowrap",textDecoration:"underline",textUnderlineOffset:"2px"},children:nm},ii))'

c1 = kw.count(old1)
c2 = kw.count(old2)
print("fmtNm inner", c1)
print("wrap2 inner", c2)
if c1 != 1 or c2 != 1:
    raise SystemExit("count mismatch")
kw = kw.replace(old1, new1, 1).replace(old2, new2, 1)
p.write_text(kw, encoding="utf-8")
print("patched underline on 요약보기 lines")
