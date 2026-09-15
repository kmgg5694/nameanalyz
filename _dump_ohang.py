# -*- coding: utf-8 -*-
from pathlib import Path
t = Path(r"C:\Users\a8071\Projects\nameanalyz\assets\index-kw5.js").read_text(encoding="utf-8")
i = t.find("ohangInn")
Path(r"C:\Users\a8071\Projects\nameanalyz\_dump_ohang.txt").write_text(t[i-800:i+3500], encoding="utf-8")
# also find ze[ and nm=
for p in ["nm={", "ze[", "children:\"?\"", 'el||"?"', "hjO[", "t.hanjaOhang[isCeo"]:
    print(p, t.count(p))
