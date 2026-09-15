# -*- coding: utf-8 -*-
from pathlib import Path
import sys
sys.stdout.reconfigure(encoding="utf-8")
kw = Path(r"C:\Users\a8071\Projects\nameanalyz\assets\index-kw5.js").read_text(encoding="utf-8")
r = kw.find('id:"result-full-capture"')
# dump from after share buttons to after name card - find pr-card end and On
j = kw.find('Home.tsx:739', r)
print(kw[j:j+2500])
print("\n\n===== CONT =====\n")
print(kw[j+2500:j+5000])
