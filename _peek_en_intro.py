# -*- coding: utf-8 -*-
from pathlib import Path
import sys
sys.stdout.reconfigure(encoding="utf-8")
p = Path(r"C:\Users\a8071\Projects\nameanalyz\assets\index-eTNXNndF.js")
t = p.read_text(encoding="utf-8")
i = t.find('className:"intro-sec"')
print("idx", i)
print(repr(t[i-250:i+400]))
