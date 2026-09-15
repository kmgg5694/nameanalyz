# -*- coding: utf-8 -*-
from pathlib import Path
import re
t = Path(r"C:\Users\a8071\Projects\nameanalyz\assets\index-eTNXNndF.js").read_text(encoding="utf-8")
a = t.find("EnglishName.tsx:1043n")
b = t.find("EnglishName.tsx:1175")
chunk = t[a:b] if a>=0 and b>a else ""
hangul = re.findall(r"[\uac00-\ud7a3]+", chunk)
# unique hangul tokens with a bit of context
seen = []
for m in re.finditer(r"[\uac00-\ud7a3]+", chunk):
    w = m.group()
    if w not in seen:
        seen.append(w)
Path(r"C:\Users\a8071\Projects\nameanalyz\_kw5_snips\sum_hangul.txt").write_text(
    "count %d unique %d\n%s\n\n---CHUNK HEAD---\n%s" % (len(hangul), len(seen), "\n".join(seen), chunk[:2500]),
    encoding="utf-8")
print("hangul tokens", len(hangul), "unique", len(seen))
print("\n".join(seen[:80]))
