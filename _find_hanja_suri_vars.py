# -*- coding: utf-8 -*-
from pathlib import Path
import sys
sys.stdout.reconfigure(encoding="utf-8")
kw = Path(r"C:\Users\a8071\Projects\nameanalyz\assets\index-kw5.js").read_text(encoding="utf-8")
out = Path(r"C:\Users\a8071\Projects\nameanalyz\_kw5_snips")

# Find definition of hanja suri vars _o,No,Mo,Ro near 종합표
i = kw.find("이름풀이 종합표")
# search backwards for where hanja pillars computed
chunk = kw[i - 8000 : i]
(out / "before_jonghap.txt").write_text(chunk, encoding="utf-8")

# find patterns
for s in ["_o=", "hanjaSuri", "hjSuri", "hanjaWon", "Io=", "정격", "calculateHanja", "hanjaResult"]:
    print(s, chunk.find(s) if s in ["_o=", "Io="] else kw.find(s))

# Look for assignment of _o near hjShow=
j = kw.find("hjShow=ro.length>=3")
print("around hjShow assign:\n", kw[j-500:j+1500])
(out / "hjshow_assign.txt").write_text(kw[j-800:j+2500], encoding="utf-8")
