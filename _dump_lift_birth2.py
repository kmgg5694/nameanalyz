# -*- coding: utf-8 -*-
from pathlib import Path
import sys
sys.stdout.reconfigure(encoding="utf-8")
kw = Path(r"C:\Users\a8071\Projects\nameanalyz\assets\index-kw5.js").read_text(encoding="utf-8")

# Find Korean name input near birth table - look for setBirth and name field together
# Find birth state init
for needle in ["useState({lunar", "setBirth", "birth.lunar", "autoFocus", "focus()", "이름", "placeholder:\"성\"", "placeholder:\"이름\""]:
    idx = 0
    hits = []
    while True:
        j = kw.find(needle, idx)
        if j < 0:
            break
        hits.append(j)
        idx = j + 1
        if len(hits) > 15:
            break
    print(f"{needle}: {hits[:10]}")

# dump name input onFocus / lift near first liftKoField call after function def
# first call at 2258173 was function def; next calls are usages
usages = []
idx = kw.find("function liftKoField")
idx = kw.find("liftKoField(", idx + 10)
while idx > 0 and len(usages) < 10:
    usages.append(idx)
    idx = kw.find("liftKoField(", idx + 10)

out = []
for u in usages:
    out.append(f"\n===== lift at {u} =====\n")
    out.append(kw[u-400:u+200])
Path("_lift_usages.txt").write_text("".join(out), encoding="utf-8")
print("wrote usages", len(usages))

# Find form structure: birth table then name
i = kw.find('children:"탄생일"')
if i < 0:
    i = kw.find("birth.lunar[0]")
print("birth.lunar[0]", kw.find("birth.lunar[0]"))
# dump larger form block from birth table start
j = kw.find("setBirth")
# find useState for birth
k = kw.find("birth,setBirth")
if k < 0:
    k = kw.find("[birth,setBirth]")
print("birth state", k)
if k > 0:
    print(kw[k-80:k+200])

# Search for focus on name after render
for needle in [".focus()", "autoFocus", "nameRef", "ref:e", "성씨", "한글이름"]:
    print(needle, kw.count(needle) if len(needle)>3 else "skip")
