# -*- coding: utf-8 -*-
from pathlib import Path
import sys
sys.stdout.reconfigure(encoding="utf-8")
kw = Path(r"C:\Users\a8071\Projects\nameanalyz\assets\index-kw5.js").read_text(encoding="utf-8")
form_start = kw.find("[birth,setBirth]")
region = kw[form_start:form_start+35000]

# find all onFocus with context
idx = 0
n = 0
while True:
    j = region.find("onFocus", idx)
    if j < 0:
        break
    n += 1
    print(f"\n--- onFocus #{n} at +{j} ---")
    print(region[max(0,j-180):j+120])
    idx = j + 1

# Find O.current / w.current / sr usage in j6
j6 = kw.find("function j6()")
# approximate end: next major function after j6 - search for "function T6" or similar
# dump refs usage near form_start
for needle in ["O.current", "w.current", "sr.current", "scrollIntoView", "useEffect"]:
    print(f"\n### {needle} in first 40k of j6")
    chunk = kw[j6:j6+40000]
    idx = 0
    c = 0
    while c < 8:
        j = chunk.find(needle, idx)
        if j < 0:
            break
        print(repr(chunk[j:j+200]))
        idx = j + len(needle)
        c += 1
