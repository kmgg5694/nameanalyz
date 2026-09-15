# -*- coding: utf-8 -*-
from pathlib import Path
etnx = Path(r"C:\Users\a8071\Projects\nameanalyz\assets\index-eTNXNndF.js").read_text(encoding="utf-8")
out = Path(r"C:\Users\a8071\Projects\nameanalyz\_ohang_v4_enfix.txt")
i = etnx.find("EnglishName.tsx:rank")
j = etnx.find("EnglishName.tsx:910")
k = etnx.find("← ME")
parts = [
    "RANK=" + etnx[i - 120 : i + 900],
    "ME910=" + etnx[j - 80 : j + 280] if j >= 0 else "no 910",
    "LASTNA=" + etnx[etnx.find("EnglishName.tsx:895") : etnx.find("EnglishName.tsx:895") + 500],
]
out.write_text("\n\n====\n\n".join(parts), encoding="utf-8")
print("ok")
