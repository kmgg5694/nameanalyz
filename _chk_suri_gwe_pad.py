# -*- coding: utf-8 -*-
from pathlib import Path
import sys
sys.stdout.reconfigure(encoding="utf-8")

p = Path(r"C:\Users\a8071\Projects\nameanalyz\assets\index-kw5.js")
kw = p.read_text(encoding="utf-8")

# Find 종합표 hangul+hanja block
a = kw.find('children:"한글이름풀이"')
b = kw.find('children:"한문이름풀이"')
c = kw.find(',(()=>{const ho=vo=>vo==="taboo"', b)
print("positions", a, b, c)
print("hangul section sample padding counts py-1", kw[a:b].count("py-1"))
print("py-1.5", kw[a:c].count("py-1.5"))

# Show 수리/주역 related style snippets in 종합표
chunk = kw[a:c]
for key in ["수리", "주역", "수리뜻", "연령대"]:
    i = chunk.find(f'children:"{key}"')
    print(key, i, chunk[i-120:i+180].replace("\n"," ")[:200] if i>=0 else "missing")
