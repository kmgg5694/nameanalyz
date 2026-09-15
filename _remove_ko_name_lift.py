# -*- coding: utf-8 -*-
from pathlib import Path
import subprocess
import sys
sys.stdout.reconfigure(encoding="utf-8")
p = Path(r"C:\Users\a8071\Projects\nameanalyz\assets\index-kw5.js")
kw = p.read_text(encoding="utf-8")

i = kw.find('id:"koNameInput"')
# find onTouchStart after koNameInput
ts = kw.find(",onTouchStart:", i)
# find className after onFocus blur handler
# pattern ends with },className:"w-full
cls = kw.find(',className:"w-full', i)
if ts < 0 or cls < 0 or ts > cls:
    print("bounds", ts, cls)
    print(repr(kw[i:i+1200][-200:]))
    raise SystemExit(1)

print("removing", repr(kw[ts:cls][:80]), "... len", cls-ts)
# Remove onTouchStart and onFocus entirely
kw2 = kw[:ts] + kw[cls:]
p.write_text(kw2, encoding="utf-8")
r = subprocess.run(["node", "--check", str(p)], capture_output=True)
print("syntax", r.returncode)
# verify
j = kw2.find('id:"koNameInput"')
print(kw2[j:j+350])
