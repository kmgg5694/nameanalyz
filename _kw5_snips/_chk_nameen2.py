# -*- coding: utf-8 -*-
from pathlib import Path
t = Path(r"C:\Users\a8071\Projects\nameanalyz\assets\index-eTNXNndF.js").read_text(encoding="utf-8")
print("nameEn count", t.count("nameEn:"))
print("nameEn:\" count", t.count('nameEn:"'))
# write a small utf8 sample around first nameEn
i = t.find("nameEn:")
Path(r"C:\Users\a8071\Projects\nameanalyz\_kw5_snips\nameen_sample.txt").write_text(t[i-80:i+160], encoding="utf-8")
# IIFE list line
j = t.find("const listSuriBad=")
Path(r"C:\Users\a8071\Projects\nameanalyz\_kw5_snips\list_line.txt").write_text(t[j:j+700], encoding="utf-8")
