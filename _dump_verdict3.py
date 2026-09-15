# -*- coding: utf-8 -*-
from pathlib import Path
import sys
sys.stdout.reconfigure(encoding="utf-8")
kw = Path(r"C:\Users\a8071\Projects\nameanalyz\assets\index-kw5.js").read_text(encoding="utf-8")
j = kw.find('Home.tsx:1193"')
# extract children string
start = kw.find('children:"', j)
end = kw.find('"}})})})()', start)
print(repr(kw[start:end+1]))
print("---")
print(kw[start+10:end])

# Also check what gwe taboo detection exists for summary cells
# bo/ho for gwe colors, isTaboo
print("\nbW near summary", "bW=birthSuri" in kw[kw.find("snBtn=")-500:kw.find("snBtn=")+200] or "bW=birthSuri" in kw)

# Find how many name gwe are taboo - need variables G,mo,co,wo,_o,No,Mo,Ro and birth bW..
# Look at tip/verdict construction opportunities after tables
k = kw.find("한글 총운")
print("한글 총운", k)
print(kw[k-50:k+200] if k>0 else "")
