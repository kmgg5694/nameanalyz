# -*- coding: utf-8 -*-
from pathlib import Path
import sys
sys.stdout.reconfigure(encoding="utf-8")
kw = Path(r"C:\Users\a8071\Projects\nameanalyz\assets\index-kw5.js").read_text(encoding="utf-8")

# focus() near j6
for pos in [2257334, 2347648, 2389934]:
    print(f"\n===== focus at {pos} =====")
    print(kw[pos-300:pos+150])

# Find Korean form name inputs - look for setName or similar near birth
# j6 starts at birth state ~2259633
start = kw.find("function j6()")
end = kw.find("function ", start + 20)  # next function? might be far
# better: find the form inputs between birth and 풀이 button
form_start = kw.find("[birth,setBirth]")
# search for onFocus in this region until result view
region = kw[form_start:form_start+25000]
print("\nonFocus count in form region", region.count("onFocus"))
print("liftKoField in form", region.count("liftKoField"))
print("onTouchStart in form", region.count("onTouchStart"))

# find name-related input by looking for value:t or similar
# state: [e,a]=useState input/result, [birth,setBirth], [t,u]=URL name parse
# Need to understand state vars for 성/이름
chunk = kw[form_start:form_start+800]
print("\n=== state init ===")
print(chunk)

# Find where name inputs are rendered - search "한글이름" near form
idx = form_start
hits = []
while True:
    j = kw.find("한글이름", idx)
    if j < 0 or j > form_start + 80000:
        break
    hits.append(j)
    idx = j + 1
print("한글이름 near form", hits[:5])
for h in hits[:3]:
    print(kw[h-100:h+200])
    print("---")
