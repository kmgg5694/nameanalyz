# -*- coding: utf-8 -*-
from pathlib import Path
etnx = Path(r"C:\Users\a8071\Projects\nameanalyz\assets\index-eTNXNndF.js").read_text(encoding="utf-8")
kw5 = Path(r"C:\Users\a8071\Projects\nameanalyz\assets\index-kw5.js").read_text(encoding="utf-8")
out = Path(r"C:\Users\a8071\Projects\nameanalyz\_ohang_v4_check5.txt")
parts = []
for label, s, needle in [
    ("upSs", etnx, "EnglishName.tsx:upSs"),
    ("dnSs", etnx, "EnglishName.tsx:dnSs"),
    ("wealth", etnx, "EnglishName.tsx:ohangCall"),
    ("dualDn", kw5, "ohangDnDual"),
    ("rankKo", kw5, "현재 직위"),
]:
    i = s.find(needle)
    parts.append(f"{label}@{i}=" + (s[i : i + 420] if i >= 0 else "NONE"))
out.write_text("\n\n====\n\n".join(parts), encoding="utf-8")
print("ok")
