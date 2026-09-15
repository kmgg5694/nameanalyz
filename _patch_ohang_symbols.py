# -*- coding: utf-8 -*-
import sys
import subprocess
from pathlib import Path
sys.stdout.reconfigure(encoding="utf-8")

p = Path(r"C:\Users\a8071\Projects\nameanalyz\assets\index-kw5.js")
kw = p.read_text(encoding="utf-8")

# Standardize relation label: 생→○, 극→✕, 비→△
# Patterns used in jonghap + 오행명 rows
old_lab = 'lab=r==="sangsaeng"?"생":r==="sanggeuk"?"극":"비"'
new_lab = 'lab=r==="sangsaeng"?"○":r==="sanggeuk"?"✕":"△"'
n = kw.count(old_lab)
print("lab patterns", n)
kw = kw.replace(old_lab, new_lab)

# Also with const lab=
old_lab2 = 'const lab=r==="sangsaeng"?"생":r==="sanggeuk"?"극":"비"'
new_lab2 = 'const lab=r==="sangsaeng"?"○":r==="sanggeuk"?"✕":"△"'
n2 = kw.count(old_lab2)
print("const lab patterns", n2)
kw = kw.replace(old_lab2, new_lab2)

# Tn helper: ○ ✕ 상비 → ○ ✕ △
old_tn = 'Tn=ho=>ho==="sangsaeng"?"○":ho==="sanggeuk"?"✕":"상비"'
new_tn = 'Tn=ho=>ho==="sangsaeng"?"○":ho==="sanggeuk"?"✕":"△"'
if old_tn in kw:
    kw = kw.replace(old_tn, new_tn, 1)
    print("Tn ok")
else:
    print("Tn miss", "상비" in kw[kw.find("Tn="):kw.find("Tn=")+80] if "Tn=" in kw else None)

# Any remaining 생/극/비 as relation-only short labels between ohang (careful not to break prose)
# Check leftover
for s in ['?"생":r==="sanggeuk"?"극":"비"', '?"생":', ':"상비"']:
    print("left", s, kw.count(s))

p.write_text(kw, encoding="utf-8")
r = subprocess.run(["node", "--check", str(p)], capture_output=True)
print("syntax", r.returncode)
if r.returncode:
    print(r.stderr.decode("utf-8", errors="replace")[-400:])
else:
    print("OK", kw.count(new_lab), kw.count(new_tn))
