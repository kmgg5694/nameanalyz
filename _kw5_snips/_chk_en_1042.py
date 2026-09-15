# -*- coding: utf-8 -*-
from pathlib import Path
import sys
sys.stdout.reconfigure(encoding="utf-8", errors="replace")
en = Path(r"C:\Users\a8071\Projects\nameanalyz\assets\index-eTNXNndF.js").read_text(encoding="utf-8")
print("1042\"", en.find('EnglishName.tsx:1042"'))
print("1042m", en.find("EnglishName.tsx:1042m"))
print("1042,", en.count("EnglishName.tsx:1042"))
# context around original - search after 1175 backward
i = en.find("EnglishName.tsx:1175")
print("before 1175", en[i-120:i+30])
