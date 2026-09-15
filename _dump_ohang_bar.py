# -*- coding: utf-8 -*-
from pathlib import Path
import sys
sys.stdout.reconfigure(encoding="utf-8")
kw = Path(r"C:\Users\a8071\Projects\nameanalyz\assets\index-kw5.js").read_text(encoding="utf-8")

i = kw.find('Home.tsx:1034"')
print(kw[i-400:i+1200])
print("\n====\n")

# relation helper sgOf or similar
for needle in ["sangsaeng", "function", "sgOf", "relOf", "ohangRel", "상비"]:
    pass

# find how W,_,L,eo (up/down relations) computed
j = kw.find("const isCeo=(t.rank||\"staff\")===\"ceo\"")
# earlier ohang relation computation near M,z counts
k = kw.find("ssCount")
print("near M z", kw.find("M===", 2262000))

# search ohRel or pair relation
idx = kw.find("function j6()")
chunk = kw[idx:idx+25000]
# find sangsaeng assignment
import re
for m in re.finditer(r'.{0,40}sangsaeng.{0,40}', chunk):
    print(m.group(0)[:100])
    if m.start() > 5000:
        break
