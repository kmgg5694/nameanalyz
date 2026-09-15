# -*- coding: utf-8 -*-
from pathlib import Path
import subprocess, tempfile, os
kw = Path("assets/index-kw5.js").read_text(encoding="utf-8")
a = kw.find('Home.tsx:978"')
b = kw.find('Home.tsx:1074"', a)
chunk = kw[a:b+200]
Path("_ohang978_broken.txt").write_text(chunk, encoding="utf-8")
# Also extract just the IIFE and try to parse
start = kw.find('(()=>{const cm={木:', a)
end = kw.find('Home.tsx:1074', start)
iife_area = kw[start:end]
Path("_ohang_iife_only.txt").write_text(iife_area, encoding="utf-8")
print("iife area len", len(iife_area))
print("start", iife_area[:80])
print("end", iife_area[-80:])

# brace balance from start of IIFE
s = iife_area
depth = 0
for i,ch in enumerate(s):
    if ch == '{': depth += 1
    elif ch == '}':
        depth -= 1
        if depth < 0:
            print("extra } at", i, repr(s[max(0,i-40):i+40]))
            break
else:
    print("final depth", depth)
