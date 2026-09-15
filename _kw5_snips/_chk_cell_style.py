# -*- coding: utf-8 -*-
from pathlib import Path
t = Path(r"C:\Users\a8071\Projects\nameanalyz\assets\index-eTNXNndF.js").read_text(encoding="utf-8")
i = t.find("const cellBtn=")
j = t.find("const periods=")
Path(r"C:\Users\a8071\Projects\nameanalyz\_kw5_snips\cell_style.txt").write_text(t[i:j], encoding="utf-8")
print("len", j-i if j>i else -1)
