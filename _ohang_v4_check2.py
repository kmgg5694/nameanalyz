# -*- coding: utf-8 -*-
from pathlib import Path
etnx = Path(r"C:\Users\a8071\Projects\nameanalyz\assets\index-eTNXNndF.js").read_text(encoding="utf-8")
kw5 = Path(r"C:\Users\a8071\Projects\nameanalyz\assets\index-kw5.js").read_text(encoding="utf-8")
out = Path(r"C:\Users\a8071\Projects\nameanalyz\_ohang_v4_check2.txt")
parts = []
i = etnx.find('placeholder:"e.g. Kennedy"')
parts.append("KEN=" + etnx[i - 800 : i + 80])
# useState near Kennedy
j = etnx.rfind("useState", 0, i)
parts.append("US_NEAR=" + etnx[j - 120 : j + 400])
i = etnx.find("EnglishName.tsx:595")
parts.append("EN595=" + etnx[i : i + 350])
# 880 uses w.firstRep - show head vars
i = etnx.find("N=w.lastRep,Y=w.firstRep")
parts.append("880VARS=" + etnx[i : i + 200])
# kw5 기운이 강합니다 still 0?
parts.append("strong=" + str(kw5.count("기운이 강합니다")))
parts.append("weak=" + str(kw5.count("기운이 약합니다")))
out.write_text("\n\n====\n\n".join(parts), encoding="utf-8")
print("ok")
