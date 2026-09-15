# -*- coding: utf-8 -*-
import sys
sys.stdout.reconfigure(encoding="utf-8")
from pathlib import Path
t = Path(r"C:\Users\a8071\Projects\nameanalyz\assets\index-kw5.js").read_text(encoding="utf-8")
out = Path(r"C:\Users\a8071\Projects\nameanalyz\_kw5_snips")

i = t.find("Home.tsx:ohangRow")
print("ohangRow", i)
(out / "ohang_debug.txt").write_text(t[i:i+1600], encoding="utf-8")

i2 = t.find("Home.tsx:hjOhang")
print("hjOhang", i2)
(out / "hj_ohang_debug.txt").write_text(t[i2:i2+1600], encoding="utf-8")

# index.html script src
html = Path(r"C:\Users\a8071\Projects\nameanalyz\index.html").read_text(encoding="utf-8")
for line in html.splitlines():
    if "index-" in line or "script" in line.lower():
        if "index" in line or "script" in line:
            print("html:", line.strip()[:120])

# which js files exist
for f in Path(r"C:\Users\a8071\Projects\nameanalyz\assets").glob("index-*.js"):
    print("asset:", f.name, f.stat().st_size)
