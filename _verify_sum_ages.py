# -*- coding: utf-8 -*-
from pathlib import Path
import subprocess
import sys
sys.stdout.reconfigure(encoding="utf-8")
kw = Path(r"C:\Users\a8071\Projects\nameanalyz\assets\index-kw5.js").read_text(encoding="utf-8")
i = kw.find("Home.tsx:1128")
print(kw[i:i+420])
for s in ("초년", "장년", "중년", "말년(총운)"):
    # only in header cells near 1128
    print(s, f'children:"{s}"' in kw[i:i+500])
# ensure old 원/형/이/정 headers gone from this spot
snip = kw[i:i+500]
print("old원", 'children:"원"' in snip)
r = subprocess.run(["node", "--check", r"C:\Users\a8071\Projects\nameanalyz\assets\index-kw5.js"], capture_output=True)
print("syntax", r.returncode)
