# -*- coding: utf-8 -*-
from pathlib import Path
t = Path(r"C:\Users\a8071\Projects\nameanalyz\assets\index-eTNXNndF.js").read_text(encoding="utf-8")
i = t.find("let verdict=")
Path(r"C:\Users\a8071\Projects\nameanalyz\_kw5_snips\verdict_now.txt").write_text(t[i:i+1200], encoding="utf-8")
print("idx", i)
