# -*- coding: utf-8 -*-
from pathlib import Path
import sys
sys.stdout.reconfigure(encoding="utf-8")
kw = Path(r"C:\Users\a8071\Projects\nameanalyz\assets\index-kw5.js").read_text(encoding="utf-8")

# Find result view birth usage
needles = [
    "birthSuri", "birth.lunar", "birth.solar", "탄생일", "이름풀이", "bn()",
    "liftKoField(G.target)", "e===\"result\"", "e===\"input\"",
]
for n in needles:
    hits = []
    idx = 0
    while len(hits) < 12:
        j = kw.find(n, idx)
        if j < 0:
            break
        hits.append(j)
        idx = j + 1
    print(n, hits)

# dump bn function and result header area
j6 = kw.find("function j6()")
# find bn=
i = kw.find("const bn=", j6)
if i < 0:
    i = kw.find("bn=", j6)
print("\nbn at", i)
print(kw[i:i+800] if i>0 else "no bn")

# find where birth note shows under hanja table
i = kw.find("탄생일은 음력")
print("\n음력기준 note", i)
if i > 0:
    print(kw[i-200:i+400])

# result start / input form birth table - does result hide input form?
i = kw.find('e==="input"')
print("\ninput branch samples")
idx = j6
c = 0
while c < 6:
    j = kw.find('e==="input"', idx)
    if j < 0 or j > j6 + 100000:
        break
    print(c, repr(kw[j-80:j+120]))
    idx = j + 1
    c += 1
