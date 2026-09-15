# -*- coding: utf-8 -*-
from pathlib import Path

kw = Path(r"C:\Users\a8071\Projects\nameanalyz\assets\index-kw5.js").read_text(encoding="utf-8")
out = Path(r"C:\Users\a8071\Projects\nameanalyz\_kw5_snips\table_suri.txt")
parts = []

for m in ["이름풀이 종합표", "총명지모", "總明", ".name", "suri", "data.name"]:
    parts.append("%s count=%s idx=%s" % (m, kw.count(m), kw.find(m)))

i = kw.find("이름풀이 종합표")
parts.append("\n=== 종합표 8000 chars ===")
parts.append(kw[i : i + 8000])

# how 수리 name is shown in table - look for data.desc or name with paren
j = kw.find('Home.tsx:880')
parts.append("\n=== 880 idx %s ===" % j)

out.write_text("\n".join(parts), encoding="utf-8")
print("wrote", out.stat().st_size)
