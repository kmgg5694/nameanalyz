# -*- coding: utf-8 -*-
from pathlib import Path

kw = Path(r"C:\Users\a8071\Projects\nameanalyz\assets\index-kw5.js").read_text(encoding="utf-8")
out = Path(r"C:\Users\a8071\Projects\nameanalyz\_kw5_snips\gwe_name.txt")
i = kw.find('children:"주역"}')
j = kw.find("Home.tsx:954")
out.write_text(kw[i:j] if i >= 0 else "NONE", encoding="utf-8")
print("fmtNm", kw.count("fmtNm="), "len", j - i if i >= 0 and j >= 0 else -1)
