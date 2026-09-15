# -*- coding: utf-8 -*-
from pathlib import Path
import sys
sys.stdout.reconfigure(encoding="utf-8")
kw = Path(r"C:\Users\a8071\Projects\nameanalyz\assets\index-kw5.js").read_text(encoding="utf-8")
a = kw.find('snBtn=(ttl,bdy,col,kids)=>')
a = kw.rfind('(()=>{const ho=vo=>vo==="taboo"', 0, a)
i = kw.find("미입력", a)
print("미입력", i, repr(kw[i-80:i+200]))
j = kw.find("1172", a)
print("1172", j, repr(kw[j-100:j+80]))
