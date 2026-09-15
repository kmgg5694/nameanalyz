# -*- coding: utf-8 -*-
from pathlib import Path
import sys
sys.stdout.reconfigure(encoding="utf-8", errors="replace")
en = Path(r"C:\Users\a8071\Projects\nameanalyz\assets\index-eTNXNndF.js").read_text(encoding="utf-8")
a = en.find("EnglishName.tsx:1190")
b = en.find("EnglishName.tsx:1253")
print(en[a:b])
print("LEN", b-a)
