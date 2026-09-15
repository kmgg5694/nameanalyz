# -*- coding: utf-8 -*-
from pathlib import Path
import sys
sys.stdout.reconfigure(encoding="utf-8")
kw = Path(r"C:\Users\a8071\Projects\nameanalyz\assets\index-kw5.js").read_text(encoding="utf-8")

# dump liftKoField
i = kw.find("function liftKoField")
print("=== liftKoField ===")
print(kw[i:i+1200])
print()

# find birth-ymd and onFocus nearby
for needle in ["birth-ymd", "liftKoField(", "syncBirth", "placeholder:\"년\"", "placeholder:\"월\"", "placeholder:\"일\"", "음력", "양력"]:
    idx = 0
    hits = []
    while True:
        j = kw.find(needle, idx)
        if j < 0:
            break
        hits.append(j)
        idx = j + 1
        if len(hits) > 12:
            break
    print(f"{needle}: {len(hits)} @ {hits[:8]}")

# dump around first birth-ymd
j = kw.find("birth-ymd")
print("\n=== around birth-ymd ===")
print(kw[j-200:j+2500])
