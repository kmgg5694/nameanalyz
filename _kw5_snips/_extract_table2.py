# -*- coding: utf-8 -*-
from pathlib import Path

kw = Path(r"C:\Users\a8071\Projects\nameanalyz\assets\index-kw5.js").read_text(encoding="utf-8")
out = Path(r"C:\Users\a8071\Projects\nameanalyz\_kw5_snips\table_suri2.txt")
parts = []

# y6 / print card
for m in ["수리뜻", "suriname", "function y6", "y6=function", "function y6("]:
    parts.append("%s -> %s" % (m, kw.find(m)))

i = kw.find("수리뜻")
parts.append("\ncount 수리뜻 %s" % kw.count("수리뜻"))
idx = 0
n = 0
while n < 8:
    j = kw.find("수리뜻", idx)
    if j < 0:
        break
    parts.append("\n=== 수리뜻 #%s at %s ===" % (n, j))
    parts.append(kw[j - 80 : j + 220])
    idx = j + 3
    n += 1

# how many ho.data.name in table
parts.append("\ncount ho.data.name %s" % kw.count("ho.data.name"))
parts.append("count hg-suriname %s" % kw.count("hg-suriname"))
parts.append("count hj-suriname %s" % kw.count("hj-suriname"))

# IIFE start unique
k = kw.find("On&&(()=>{const G=to?.won")
parts.append("\n=== iife start ===")
parts.append(kw[k : k + 200] if k >= 0 else "NONE")

out.write_text("\n".join(parts), encoding="utf-8")
print("ok")
