# -*- coding: utf-8 -*-
from pathlib import Path
import sys
sys.stdout.reconfigure(encoding="utf-8")
kw = Path(r"C:\Users\a8071\Projects\nameanalyz\assets\index-kw5.js").read_text(encoding="utf-8")
# find birthSuri near summary
i = kw.find("탄생수리")
# search backwards for birthSuri / bW definitions relative to summary IIFE
a = kw.rfind("birthSuri", 0, i)
print("last birthSuri before 탄생수리 display:", a)
# find definition
for name in ["birthSuri", "bW=", "bH=", "bI=", "bJ="]:
    # look in window before summary IIFE start
    start = kw.rfind('(()=>{const ho=vo=>vo==="taboo"', 0, i)
    chunk = kw[max(0, start-8000):start]
    print(name, "in pre-scope", name.rstrip("=") in chunk or name in chunk)
    # also in the IIFE itself
    end = kw.find('Home.tsx:1172"', start) 
    print("  in IIFE", name.rstrip("=") in kw[start:end] or name in kw[start:end])

# find where bW is assigned
idx = 0
hits = []
while True:
    j = kw.find("bW=", idx)
    if j < 0 or len(hits) > 8:
        break
    hits.append((j, kw[j:j+80].replace("\n"," ")))
    idx = j + 3
print("bW= hits:")
for h in hits[:6]:
    print(h[0], repr(h[1][:70]))
