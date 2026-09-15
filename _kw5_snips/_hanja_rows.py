# -*- coding: utf-8 -*-
from pathlib import Path
kw = Path(r"C:\Users\a8071\Projects\nameanalyz\assets\index-kw5.js").read_text(encoding="utf-8")
i = kw.find('children:"한문수리"')
print("한문수리", i)
Path(r"C:\Users\a8071\Projects\nameanalyz\_kw5_snips\hanja_rows.txt").write_text(kw[i-80:i+900] if i>=0 else "GONE", encoding="utf-8")
print("한문주역", kw.find('children:"한문주역"'))
print("요약 snBtn", kw.find("WebkitTapHighlightColor") )
print("한글수리 leftover", kw.find('children:"한글수리"'))
print("children 수리", kw.find('children:"수리"}'))
