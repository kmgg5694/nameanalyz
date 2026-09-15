# -*- coding: utf-8 -*-
import sys
sys.stdout.reconfigure(encoding="utf-8")
from pathlib import Path
t = Path(r"C:\Users\a8071\Projects\nameanalyz\assets\index-kw5.js").read_text(encoding="utf-8")
out = Path(r"C:\Users\a8071\Projects\nameanalyz\_kw5_snips")

# find Tn= and an= near On IIFE
i = t.find("On&&(()=>{const G=to")
chunk = t[i:i+2500]
(out / "on_helpers.txt").write_text(chunk, encoding="utf-8")
print(chunk[:1500])

# 1044 full rel display
i2 = t.find('Home.tsx:1031"')
(out / "ohang_1031.txt").write_text(t[i2:i2+2000], encoding="utf-8")
print("---1031---")
print(t[i2:i2+1800])
