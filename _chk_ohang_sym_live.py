# -*- coding: utf-8 -*-
import sys
sys.stdout.reconfigure(encoding="utf-8")
from pathlib import Path
t = Path(r"C:\Users\a8071\Projects\nameanalyz\assets\index-kw5.js").read_text(encoding="utf-8")
out = Path(r"C:\Users\a8071\Projects\nameanalyz\_kw5_snips")
for key in ["Home.tsx:ohangRow", "Home.tsx:hjOhang", "hg-oh-", "lab=r===", "○"]:
    print(key, t.find(key), t.count(key))
i = t.find("Home.tsx:ohangRow")
(out / "ohang_row_live.txt").write_text(t[i:i+1200] if i>=0 else "miss", encoding="utf-8")
i2 = t.find("Home.tsx:hjOhang")
(out / "hj_ohang_live.txt").write_text(t[i2:i2+1200] if i2>=0 else "miss", encoding="utf-8")
print("done")
