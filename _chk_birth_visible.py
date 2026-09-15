# -*- coding: utf-8 -*-
from pathlib import Path
import sys
sys.stdout.reconfigure(encoding="utf-8")
kw = Path(r"C:\Users\a8071\Projects\nameanalyz\assets\index-kw5.js").read_text(encoding="utf-8")

# Find all 773 / 773b / birth display on result
for n in ["773b", "탄생일 ", "탄생일 음력", "탄생일(음력)", "birth.lunar[0]&&birth.lunar[1]"]:
    print(n, kw.find(n), kw.count(n))

i = kw.find("Home.tsx:773")
print("\n=== around 773 ===")
print(kw[i:i+700])

# How many text-4xl name displays?
idx = 0
c = 0
while c < 5:
    j = kw.find('className:"text-4xl font-bold tracking-widest mb-2",children:t.name', idx)
    if j < 0:
        break
    print(f"\nname card #{c} at {j}")
    print(kw[j:j+500])
    idx = j + 1
    c += 1

# index.html script src
html = Path(r"C:\Users\a8071\Projects\nameanalyz\index.html").read_text(encoding="utf-8")
for line in html.splitlines():
    if "index-" in line or "kw5" in line or "script" in line.lower():
        if "script" in line or "kw5" in line or "index-" in line:
            print("HTML:", line.strip()[:200])
