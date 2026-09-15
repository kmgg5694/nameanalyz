# -*- coding: utf-8 -*-
from pathlib import Path
kw = Path(r"C:\Users\a8071\Projects\nameanalyz\assets\index-kw5.js").read_text(encoding="utf-8")
out = Path(r"C:\Users\a8071\Projects\nameanalyz\_kw5_snips\suri8.txt")
parts = []
for m in ["수복겸전", "해성", "壽福", "8수", "suri:8", "id:8", "name:\"수"]:
    parts.append("%s -> %s count=%s" % (m, kw.find(m), kw.count(m)))

i = kw.find("수복")
parts.append("\n=== 수복 ===")
parts.append(kw[i:i+80] if i>=0 else "NONE")

# find suri data around number 8
import re
# typical {id:8 or suri:8, name:
for pat in [r'\{id:8,name:"[^"]+"', r'8,name:"[^"]+"', r'"수복[^"]*"']:
    ms = re.findall(pat, kw)
    parts.append("pat %s -> %s" % (pat, ms[:8]))

# fmtNm and 899 cells
j = kw.find("Home.tsx:899")
parts.append("\n=== 899 ===")
parts.append(kw[j:j+550] if j>=0 else "NONE")
j = kw.find("Home.tsx:883")
parts.append("\n=== 883 ===")
parts.append(kw[j:j+400] if j>=0 else "NONE")
j = kw.find("Home.tsx:905")
parts.append("\n=== 905 ===")
parts.append(kw[j:j+400] if j>=0 else "NONE")
j = kw.find("snBtn=")
parts.append("\n=== snBtn nearby ===")
parts.append(kw[j:j+200] if j>=0 else "NONE")
j = kw.find("fmtNm=")
parts.append("\n=== fmtNm ===")
parts.append(kw[j:j+280] if j>=0 else "NONE")
j = kw.find("Home.tsx:1139")
parts.append("\n=== 1139 요약 ===")
parts.append(kw[j:j+500] if j>=0 else "NONE")
out.write_text("\n".join(parts), encoding="utf-8")
print("ok")
