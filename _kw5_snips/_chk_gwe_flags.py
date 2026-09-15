# -*- coding: utf-8 -*-
from pathlib import Path
import re
t = Path(r"C:\Users\a8071\Projects\nameanalyz\assets\index-eTNXNndF.js").read_text(encoding="utf-8")
# objects like {id:19,name:"이위화"...isTaboo:!0,isBest:!1}
pat = re.compile(r'\{id:(\d+),name:"([^"]+)"[^}]*?isTaboo:(!0|!1),isBest:(!0|!1)')
rows = []
for m in pat.finditer(t):
    rows.append((int(m.group(1)), m.group(2), m.group(3)=="!0", m.group(4)=="!0"))
# unique by id
seen = {}
for r in rows:
    seen.setdefault(r[0], r)
out = Path(r"C:\Users\a8071\Projects\nameanalyz\_kw5_snips\gwe_flags.txt")
lines = [f"{i:2d} {nm} taboo={tb} best={bs}" for i,nm,tb,bs in sorted(seen.values())]
best = [x for x in seen.values() if x[3]]
taboo = [x for x in seen.values() if x[2]]
lines.append("\nBEST: " + ", ".join(x[1] for x in best))
lines.append("TABOO: " + ", ".join(x[1] for x in taboo))
# kennedy names
for nm in ["화지진","이위화","화산려","산택손","간위산","산뢰이","화천대유","화풍정"]:
    hit = [x for x in seen.values() if x[1]==nm]
    lines.append(f"lookup {nm}: {hit}")
out.write_text("\n".join(lines), encoding="utf-8")
print("gwe objs", len(seen), "best", len(best), "taboo", len(taboo))
