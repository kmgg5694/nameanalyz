# -*- coding: utf-8 -*-
from pathlib import Path
import subprocess
import sys
sys.stdout.reconfigure(encoding="utf-8")

p = Path("assets/index-kw5.js")
kw = p.read_text(encoding="utf-8")

# Check if broken patch is in file
print("has 한글 오행", "한글 오행" in kw)
print("has old 980 flex", 'Home.tsx:980",className:"flex items-center py-2"' in kw)

# Find 978 section
i = kw.find('Home.tsx:978"')
print("978", i)
# Find syntax issue around Fragment return
j = kw.find("한글 오행")
if j > 0:
    print(repr(kw[j:j+200]))
    # find end of IIFE
    k = kw.find("Home.tsx:1074", j)
    print("before 1074", repr(kw[k-80:k+40]))

r = subprocess.run(["node", "--check", str(p)], capture_output=True)
print("syntax now", r.returncode)
if r.returncode:
    print(r.stderr.decode("utf-8", errors="replace")[-500:])
