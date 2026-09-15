# -*- coding: utf-8 -*-
import sys
import subprocess
from pathlib import Path
sys.stdout.reconfigure(encoding="utf-8")

p = Path(r"C:\Users\a8071\Projects\nameanalyz\assets\index-kw5.js")
kw = p.read_text(encoding="utf-8")

# Dump current broken ohang row for analysis
i = kw.find('m.jsxs("tr",{"data-loc":"client/src/pages/Home.tsx:ohangRow"')
j = kw.find('m.jsxs("tr",{"data-loc":"client/src/pages/Home.tsx:856"', i)
Path(r"C:\Users\a8071\Projects\nameanalyz\_kw5_snips\ohang_broken.txt").write_text(kw[i:j], encoding="utf-8")
print("broken len", j-i)
print(kw[i:j][-200:])
