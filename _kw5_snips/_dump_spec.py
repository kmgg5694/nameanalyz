# -*- coding: utf-8 -*-
from pathlib import Path

kw = Path(r"C:\Users\a8071\Projects\nameanalyz\assets\index-kw5.js").read_text(encoding="utf-8")
en = Path(r"C:\Users\a8071\Projects\nameanalyz\assets\index-eTNXNndF.js").read_text(encoding="utf-8")
out = Path(r"C:\Users\a8071\Projects\nameanalyz\_kw5_snips\_spec_status2.txt")
parts = []

i = kw.find("ceoDn=")
parts.append("=== KW5 from ceoDn ===")
parts.append(kw[i : i + 5000])

k = kw.find("재물운을")
parts.append("\n=== idx 재물운을 %s ===" % k)
if k >= 0:
    parts.append(kw[k - 250 : k + 900])

k2 = kw.find("왕따")
parts.append("\n=== idx 왕따 %s ===" % k2)
if k2 >= 0:
    parts.append(kw[k2 - 200 : k2 + 700])

u = en.find('up==="ss"')
parts.append("\n=== EN from up ss idx=%s ===" % u)
if u >= 0:
    parts.append(en[u : u + 6000])

# majority card close structure
g = en.find("supports the self")
parts.append("\n=== EN supports close ===")
parts.append(repr(en[g : g + 220]))
c = en.find("against the self")
parts.append("\n=== EN against close ===")
parts.append(repr(en[c : c + 220]))

out.write_text("\n".join(parts), encoding="utf-8")
print("wrote", out.stat().st_size)
