# -*- coding: utf-8 -*-
from pathlib import Path
kw5 = Path(r"C:\Users\a8071\Projects\nameanalyz\assets\index-kw5.js").read_text(encoding="utf-8")
etnx = Path(r"C:\Users\a8071\Projects\nameanalyz\assets\index-eTNXNndF.js").read_text(encoding="utf-8")
out = Path(r"C:\Users\a8071\Projects\nameanalyz\_kw5_snips")

# last Home result locs
import re
locs = sorted({int(x) for x in re.findall(r'Home\.tsx:(\d+)', kw5)})
print("home locs last", locs[-15:])
# result vs input
i = kw5.find('e==="gwe"')
(out/"v4_kw5_gwe.txt").write_text(kw5[i-400:i+200] if i>=0 else "none", encoding="utf-8")

# english male button
i = etnx.find("female")
print("female", i, etnx.count("female"))
(out/"v4_etnx_female.txt").write_text(etnx[i-500:i+700] if i>=0 else "none", encoding="utf-8")

i = etnx.find("useState(\"male\")")
print("en male state", i)
i = etnx.find('gender:')
print("en gender colon", i)

# EnglishName input start
i = etnx.find("EnglishName.tsx:1")
print("en1", i)
# find function that is the english page
i = etnx.find("EnglishName.tsx:400")
print("400", i)
for n in range(400, 700, 10):
    p = etnx.find(f"EnglishName.tsx:{n}")
    if p>=0:
        print("hit", n, p)
