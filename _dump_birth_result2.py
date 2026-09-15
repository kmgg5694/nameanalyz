# -*- coding: utf-8 -*-
from pathlib import Path
import sys
sys.stdout.reconfigure(encoding="utf-8")
kw = Path(r"C:\Users\a8071\Projects\nameanalyz\assets\index-kw5.js").read_text(encoding="utf-8")

# result view start - find e==="result"
i = kw.find('e==="result"&&')
print("result branches:")
idx = kw.find("function j6()")
c = 0
while c < 8:
    j = kw.find('e==="result"', idx)
    if j < 0:
        break
    print(c, j, repr(kw[j:j+200]))
    idx = j + 1
    c += 1

# Find result header with name display
for needle in ["result-full-capture", "t.name", "다시", "입력으로", "다시입력"]:
    j = kw.find(needle, kw.find("function j6()"))
    print(needle, j)

# dump around result-full-capture
j = kw.find('id:"result-full-capture"')
if j < 0:
    j = kw.find("result-full-capture")
print("\n=== result-full-capture ===")
print(kw[j:j+1200])

# birth table block start - to understand structure for maybe keeping visible
j = kw.find("birth.lunar[0]")
# go back to find wrapper of birth table
print("\n=== birth table wrapper ===")
print(kw[j-900:j-200])

# birthSuri computation
j = kw.find("birthSuri=")
print("\n=== birthSuri def ===")
print(kw[j:j+600])
