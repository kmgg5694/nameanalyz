# -*- coding: utf-8 -*-
from pathlib import Path
kw = Path(r"C:\Users\a8071\Projects\nameanalyz\assets\index-kw5.js").read_text(encoding="utf-8")
out = Path(r"C:\Users\a8071\Projects\nameanalyz\_kw5_snips\summary_view3.txt")
parts = []
for n, pos in enumerate([1927599, 1993200]):
    parts.append("\n===== #%s =====" % n)
    parts.append(kw[pos - 80 : pos + 200])
# 요약 IIFE start
i = kw.find('data-loc":"client/src/pages/Home.tsx:1100')
parts.append("\n1100 idx %s" % i)
i = kw.find("Home.tsx:1120")
parts.append("1120 %s" % i)
# around 종합표 wrap2 for tap cells
j = kw.find("Home.tsx:883")
parts.append("\n=== 883 ===")
parts.append(kw[j : j + 450])
j = kw.find("Home.tsx:936")
parts.append("\n=== 936 ===")
parts.append(kw[j : j + 700])
out.write_text("\n".join(parts), encoding="utf-8")
print("ok")
