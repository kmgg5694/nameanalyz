# -*- coding: utf-8 -*-
from pathlib import Path
kw = Path(r"C:\Users\a8071\Projects\nameanalyz\assets\index-kw5.js").read_text(encoding="utf-8")
i = kw.find('Home.tsx:1137')
Path(r"C:\Users\a8071\Projects\nameanalyz\_kw5_snips\verify_hanja_sum.txt").write_text(kw[i:i+2800], encoding="utf-8")
print("ok", i)
