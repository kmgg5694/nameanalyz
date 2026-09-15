# -*- coding: utf-8 -*-
from pathlib import Path
t = Path(r"C:\Users\a8071\Projects\nameanalyz\assets\index-eTNXNndF.js").read_text(encoding="utf-8")
a = t.find("function dy(")
b = t.find("EnglishName.tsx:sumTable")
chunk = t[a:b]
out = []
out.append("dy len %d" % len(chunk))
for s in ["de=", "C=", "P=", "H=", "nameEn", "C(N)", "function C", "const C", "de(N"]:
    out.append("%s count=%d first=%d" % (s, chunk.count(s), chunk.find(s)))
# find de= after dy
for s in ["const de=", "de=(N", "de=(n", ",de=", "de=N=>", "de=(Y"]:
    i = chunk.find(s)
    out.append("%s @%d %s" % (s, i, chunk[i:i+220].replace("\n"," ") if i>=0 else ""))
# C and P and H near result rendering
i = chunk.find("C=")
out.append("first C= @%d %s" % (i, chunk[max(0,i-30):i+180] if i>=0 else ""))
# search more specifically used in old table
i = chunk.find("descEn")
out.append("descEn @%d %s" % (i, chunk[max(0,i-80):i+80] if i>=0 else ""))
i = chunk.rfind("const C=")
out.append("rfind const C= %d" % i)
i = chunk.find("C=Y=>")
out.append("C=Y=> %d %s" % (i, chunk[i:i+150] if i>=0 else ""))
i = chunk.find("P=K=>")
out.append("P=K=> %d %s" % (i, chunk[i:i+150] if i>=0 else ""))
i = chunk.find("H=K=>")
out.append("H=K=> %d" % i)
i = chunk.find("H=(K")
out.append("H=(K %d %s" % (i, chunk[i:i+200] if i>=0 else ""))
Path(r"C:\Users\a8071\Projects\nameanalyz\_kw5_snips\d_helpers.txt").write_text("\n".join(out), encoding="utf-8")
print("ok", len(chunk))
