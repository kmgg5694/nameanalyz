# -*- coding: utf-8 -*-
from pathlib import Path
kw = Path(r"C:\Users\a8071\Projects\nameanalyz\assets\index-kw5.js").read_text(encoding="utf-8")
out = Path(r"C:\Users\a8071\Projects\nameanalyz\_kw5_snips")

print("len", len(kw))
print("Home 1150", kw.find("Home.tsx:1150"))
print("한문수리 count", kw.count('children:"한문수리"'))
print("한문주역 count", kw.count('children:"한문주역"'))
print("snBtn defs", kw.count("snBtn=(ttl"))
print("snBtn calls", kw.count("snBtn("))
print("underline", kw.count('textDecoration:"underline"'))
print("종합표 수리뜻 snBtn nearby", "snBtn" in kw[kw.find('children:"수리뜻"'):kw.find('children:"수리뜻"')+800] if kw.find('children:"수리뜻"')>=0 else "no")

i = kw.find('Home.tsx:1137')
(out/"verify_sum.txt").write_text(kw[i:i+1800], encoding="utf-8")
i2 = kw.find('children:"수리뜻"')
(out/"verify_jong.txt").write_text(kw[i2:i2+900], encoding="utf-8")
i3 = kw.find("fmtNm=")
(out/"verify_fmt1.txt").write_text(kw[i3:i3+400], encoding="utf-8")
print("wrote verify")
