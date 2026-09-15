# -*- coding: utf-8 -*-
import re
from pathlib import Path
kw = Path(r"C:\Users\a8071\Projects\nameanalyz\assets\index-kw5.js").read_text(encoding="utf-8")
out = Path(r"C:\Users\a8071\Projects\nameanalyz\_kw5_snips\empty_desc.txt")
# find {num:N,name:"...",type:"...",shortDesc:"...",desc:"..."}
pat = re.compile(r'\{num:(\d+),name:"([^"]+)",type:"[^"]+",shortDesc:"([^"]*)",desc:"([^"]*)"')
empty = []
for m in pat.finditer(kw):
    if m.group(4) == "":
        empty.append((m.group(1), m.group(2), m.group(3)[:80]))
out.write_text("empty count %s\n" % len(empty) + "\n".join("%s %s | %s" % x for x in empty), encoding="utf-8")
print("empty", len(empty))
