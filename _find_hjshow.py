# -*- coding: utf-8 -*-
from pathlib import Path
import sys
sys.stdout.reconfigure(encoding="utf-8")
kw = Path(r"C:\Users\a8071\Projects\nameanalyz\assets\index-kw5.js").read_text(encoding="utf-8")
out = Path(r"C:\Users\a8071\Projects\nameanalyz\_kw5_snips")

# hjShow definition near 종합표
i = kw.find("hjShow")
# find assignment
for pat in ["hjShow=", "const hjShow", "hjShow&&", "uo=", "호적"]:
    print(pat, kw.find(pat), kw.count(pat))

# context around first interesting hjShow assignment before 종합표
j = kw.rfind("hjShow", 0, kw.find("이름풀이 종합표"))
print("last hjShow before 종합", j)
print(kw[j-300:j+200])

# search 호적 / registry
for s in ["호적", "hjOnly", "hangulOnly", "registry", "hjMode", "nameMode"]:
    print("---", s, kw.count(s))
    k = kw.find(s)
    if k >= 0:
        print(kw[k-80:k+120].replace("\n", " "))
