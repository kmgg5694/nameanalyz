# -*- coding: utf-8 -*-
from pathlib import Path
import sys
sys.stdout.reconfigure(encoding="utf-8")
kw = Path(r"C:\Users\a8071\Projects\nameanalyz\assets\index-kw5.js").read_text(encoding="utf-8")
i = kw.find("773b")
chunk = kw[i:i+400]
# show codepoints of Korean parts
for s in ["음력", "양력", "탄생일"]:
    print(s, s in chunk, [hex(ord(c)) for c in s])
# extract return string
j = chunk.find('return"')
print(repr(chunk[j:j+40]))
# check birthSuri display of actual date vs only nums
k = kw.find("탄생일 풀이")
print("탄생일 풀이", k)
print(repr(kw[k:k+80]) if k>0 else "")
