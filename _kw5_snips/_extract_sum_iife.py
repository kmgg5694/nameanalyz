# -*- coding: utf-8 -*-
from pathlib import Path
kw = Path(r"C:\Users\a8071\Projects\nameanalyz\assets\index-kw5.js").read_text(encoding="utf-8")
out = Path(r"C:\Users\a8071\Projects\nameanalyz\_kw5_snips\summary_iife.txt")
pos = kw.find('data-loc":"client/src/pages/Home.tsx:1116"')
out.write_text(kw[pos - 1200 : pos + 100], encoding="utf-8")
print("pos", pos)
