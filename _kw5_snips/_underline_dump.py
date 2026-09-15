# -*- coding: utf-8 -*-
from pathlib import Path
kw = Path(r"C:\Users\a8071\Projects\nameanalyz\assets\index-kw5.js").read_text(encoding="utf-8")
out = Path(r"C:\Users\a8071\Projects\nameanalyz\_kw5_snips\underline_move.txt")
parts = []
for loc in ["883", "889", "899", "905", "936", "947", "1136", "1139", "1143", "1146", "1150", "1153"]:
    k = 'Home.tsx:' + loc
    i = kw.find(k)
    parts.append("\n=== %s idx=%s ===" % (k, i))
    if i >= 0:
        parts.append(kw[i : i + 420])
out.write_text("\n".join(parts), encoding="utf-8")
print("ok")
