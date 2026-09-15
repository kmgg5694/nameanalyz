# -*- coding: utf-8 -*-
from pathlib import Path
import sys
sys.stdout.reconfigure(encoding="utf-8")
kw = Path(r"C:\Users\a8071\Projects\nameanalyz\assets\index-kw5.js").read_text(encoding="utf-8")

# Extract from Home.tsx:1123 through after birth rows / 1172
a = kw.find('data-loc":"client/src/pages/Home.tsx:1123"')
b = kw.find('Home.tsx:1172"', a) + len('Home.tsx:1172"')
chunk = kw[a:b]
Path("_sum_table_full.txt").write_text(chunk, encoding="utf-8")
print("len", len(chunk))
# show end
print("---END---")
print(chunk[-800:])
print("---BD---")
i = chunk.find("탄생수리")
print(chunk[i-100:i+500] if i>=0 else "no")
