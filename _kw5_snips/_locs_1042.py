# -*- coding: utf-8 -*-
from pathlib import Path
import sys, re
sys.stdout.reconfigure(encoding="utf-8", errors="replace")
en = Path(r"C:\Users\a8071\Projects\nameanalyz\assets\index-eTNXNndF.js").read_text(encoding="utf-8")
a = en.find("EnglishName.tsx:1042")
b = en.find("EnglishName.tsx:1253")
chunk = en[a:b]
print("chunk", b-a)
for m in re.finditer(r'EnglishName.tsx:(\d+[a-z]*)', chunk):
    print(m.group(1), a+m.start())
print("---- around 1175 minus 30 ----")
i = en.find("EnglishName.tsx:1175")
print(en[i-50:i+60])
print("---- 1190 ----")
i = en.find("EnglishName.tsx:1190")
print("1190", i)
print(en[i-40:i+80] if i>=0 else "none")
