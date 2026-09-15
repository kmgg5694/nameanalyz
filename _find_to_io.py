# -*- coding: utf-8 -*-
import sys
sys.stdout.reconfigure(encoding="utf-8")
from pathlib import Path
t = Path(r"C:\Users\a8071\Projects\nameanalyz\assets\index-kw5.js").read_text(encoding="utf-8")
# find to= assignment near result computation
idx = 0
hits = []
while len(hits) < 15:
    j = t.find("to=", idx)
    if j < 0:
        break
    ctx = t[j:j+80]
    if "won" in ctx or "hyeong" in ctx or "pd(" in ctx or "U?" in ctx:
        hits.append((j, ctx))
    idx = j + 3
print("to hits", hits)
# Io=
idx = 0
hits2 = []
while len(hits2) < 10:
    j = t.find("Io=", idx)
    if j < 0:
        break
    ctx = t[j:j+80]
    if "won" in ctx or "hj" in ctx.lower() or "U?" in ctx or "pd" in ctx:
        hits2.append((j, ctx))
    idx = j + 3
print("Io hits", hits2)
# relative to W
w = t.find('W=K[0]&&K[1]?dk')
print("W at", w)
# search const to=
for s in ["to=U&&", "to=U?", "const to=", ",to=", "to={won"]:
    print(s, t.find(s))
