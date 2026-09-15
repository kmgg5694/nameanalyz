# -*- coding: utf-8 -*-
from pathlib import Path

kw = Path(r"C:\Users\a8071\Projects\nameanalyz\assets\index-kw5.js").read_text(encoding="utf-8")
en = Path(r"C:\Users\a8071\Projects\nameanalyz\assets\index-eTNXNndF.js").read_text(encoding="utf-8")
out = Path(r"C:\Users\a8071\Projects\nameanalyz\_kw5_snips\_spec_status3.txt")
parts = []

# old korean wealth around 772
i = kw.find('data-loc":"client/src/pages/Home.tsx:772"')
parts.append("=== KW5 around 772 (800 before) ===")
parts.append(kw[max(0, i - 2500) : i + 200])

# phone in korean result
p = kw.find("자세한 이름풀이, 작명의뢰")
parts.append("\n=== KW5 phone count %s first idx %s ===" % (kw.count("자세한 이름풀이, 작명의뢰"), p))
if p >= 0:
    parts.append(kw[p - 180 : p + 120])
p2 = kw.find("자세한 이름풀이, 작명의뢰", p + 1) if p >= 0 else -1
parts.append("\n=== KW5 phone2 idx %s ===" % p2)
if p2 >= 0:
    parts.append(kw[p2 - 180 : p2 + 80])

# english upSs full cards
for key in ["upSs", "upSg", "dnSs", "dnSg", "wealth", "bully", "ohangCall"]:
    m = en.find('EnglishName.tsx:' + key)
    parts.append("\n=== EN loc %s idx=%s ===" % (key, m))
    if m >= 0:
        parts.append(en[m : m + 700])

# extract 880 return children structure by finding from 880 to 997
a = en.find('data-loc":"client/src/pages/EnglishName.tsx:880"')
b = en.find('data-loc":"client/src/pages/EnglishName.tsx:997"')
parts.append("\n=== EN 880 to 997 length %s ===" % (b - a))
chunk = en[a:b]
# find card markers
for marker in ["domGen", "domCtl", "midSelf", "upSs", "upSg", "dnSs", "dnSg", "ohangWealth", "ohangBully", "ohangCall"]:
    parts.append("marker %s -> %s" % (marker, chunk.find(marker)))

out.write_text("\n".join(parts), encoding="utf-8")
print("ok", out.stat().st_size)
