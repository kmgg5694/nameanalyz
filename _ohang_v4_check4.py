# -*- coding: utf-8 -*-
from pathlib import Path
etnx = Path(r"C:\Users\a8071\Projects\nameanalyz\assets\index-eTNXNndF.js").read_text(encoding="utf-8")
out = Path(r"C:\Users\a8071\Projects\nameanalyz\_ohang_v4_check4.txt")
i = etnx.find("EnglishName.tsx:615")
j = etnx.find("EnglishName.tsx:646")
out.write_text(etnx[i:j+80], encoding="utf-8")
print(j-i)
# share url
k = etnx.find('set("ln"')
print("set ln", k)
if k>=0:
    out.write_text(etnx[i:j+80]+"\n\nURL\n"+etnx[k-80:k+400], encoding="utf-8")
