# -*- coding: utf-8 -*-
import sys
sys.stdout.reconfigure(encoding="utf-8")
from pathlib import Path
t = Path(r"C:\Users\a8071\Projects\nameanalyz\assets\index-kw5.js").read_text(encoding="utf-8")
out = Path(r"C:\Users\a8071\Projects\nameanalyz\_kw5_snips")

i = t.find('data-loc":"client/src/pages/Home.tsx:1307"')
# take a large chunk of narrative sections
chunk = t[i:i+20000]
(out / "narrative_1307.txt").write_text(chunk, encoding="utf-8")
print("len", len(chunk))
for s in ["총운", "초년", "장년", "중년", "말년", "탄생", "사주", "56", "41~", "24~"]:
    print(s, chunk.count(s), chunk.find(s))

# find color helper used as Eo(wo.data.type) - might be different Eo in scope
# search near 1307 for Eo=
idx = t.rfind("Eo=", 0, i)
print("Eo= before", idx, t[idx:idx+120] if idx>0 else None)
# also ho( type ) in summary
for s in ["function ho(", "const ho=", "ho=vo=>", "Eo=vo=>", "Eo=o=>"]:
    print(s, t.find(s))
