# -*- coding: utf-8 -*-
from pathlib import Path
import sys
sys.stdout.reconfigure(encoding="utf-8")
kw = Path(r"C:\Users\a8071\Projects\nameanalyz\assets\index-kw5.js").read_text(encoding="utf-8")
j6 = kw.find("function j6()")
# find ao( usages
idx = j6
hits = []
while len(hits) < 20:
    j = kw.find("ao(", idx)
    if j < 0 or j > j6 + 120000:
        break
    hits.append(j)
    print(j, repr(kw[j:j+120]))
    idx = j + 3

# f init
i = kw.find("[f,ao]=N.useState")
print("\nf init", repr(kw[i:i+400]))
