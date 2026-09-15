# -*- coding: utf-8 -*-
from pathlib import Path
kw5 = Path(r"C:\Users\a8071\Projects\nameanalyz\assets\index-kw5.js").read_text(encoding="utf-8")
etnx = Path(r"C:\Users\a8071\Projects\nameanalyz\assets\index-eTNXNndF.js").read_text(encoding="utf-8")
out = Path(r"C:\Users\a8071\Projects\nameanalyz\_kw5_snips")
(out/"v4_kw5_1714.txt").write_text(kw5[kw5.find("Home.tsx:1714")-200:kw5.find("Home.tsx:1714")+900], encoding="utf-8")
(out/"v4_etnx_470.txt").write_text(etnx[etnx.find("EnglishName.tsx:470")-80:etnx.find("EnglishName.tsx:470")+1800], encoding="utf-8")
(out/"v4_etnx_680.txt").write_text(etnx[etnx.find("EnglishName.tsx:680")-80:etnx.find("EnglishName.tsx:680")+800], encoding="utf-8")
# english state init
i = etnx.find("lastName")
(out/"v4_etnx_state.txt").write_text(etnx[i-400:i+500] if i>=0 else "none", encoding="utf-8")
print("ok", i)
