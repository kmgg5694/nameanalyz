# -*- coding: utf-8 -*-
import sys
sys.stdout.reconfigure(encoding="utf-8")
from pathlib import Path
t = Path(r"C:\Users\a8071\Projects\nameanalyz\assets\index-kw5.js").read_text(encoding="utf-8")
out = Path(r"C:\Users\a8071\Projects\nameanalyz\_kw5_snips")

i = t.find("본기운 55세")
print("chongun patch present", i >= 0)
j = t.find('Home.tsx:1307"')
print("1307", j)
(out / "narrative_now.txt").write_text(t[j:j+4500] if j >= 0 else "miss", encoding="utf-8")

# check if old full desc still used
print("full desc pattern", t.count("wo.data.desc&&m.jsxs"))
print("ax=s=>", "ax=s=>" in t)
print("parts.slice(0,2)", "parts.slice(0,2)" in t)

# sample: does narrative still dump full gwe.desc?
chunk = t[j:j+4500] if j >= 0 else ""
print("uses ax(", "ax(" in chunk)
print("item.gwe.desc raw", "item.gwe.desc" in chunk and "ax(item.gwe.desc)" in chunk)
print("gd=item.gwe?ax", "gd=item.gwe?ax" in chunk)
print(chunk[:800])
