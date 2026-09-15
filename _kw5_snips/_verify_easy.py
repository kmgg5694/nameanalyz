# -*- coding: utf-8 -*-
import sys
sys.stdout.reconfigure(encoding="utf-8")
from pathlib import Path
t = Path("assets/index-kw5.js").read_text(encoding="utf-8")
# show order: title, form 577, easyTip, btn, ohang?, hanja, warnings, intro, result
for s in ["Home.tsx:573", "Home.tsx:577", "Home.tsx:easyTip", "Home.tsx:703", "Home.tsx:602", "Home.tsx:676", "Home.tsx:581b", 'className:"intro-sec"', "Home.tsx:716"]:
    print(f"{t.find(s):8d}  {s}")
# snippet around easy tip
i = t.find("Home.tsx:easyTip")
print(t[i-50:i+450])
