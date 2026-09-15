# -*- coding: utf-8 -*-
import sys
import subprocess
from pathlib import Path
sys.stdout.reconfigure(encoding="utf-8")

p = Path(r"C:\Users\a8071\Projects\nameanalyz\assets\index-kw5.js")
kw = p.read_text(encoding="utf-8")

# Fix both rows: wrong ending })()}]}),  →  })()})]}),
old_end = "]});})()}]}),"
new_end = "]});})()})]}),"
n = kw.count(old_end)
print("fix count", n)
if n < 2:
    # show nearby
    i = kw.find("ohangRow")
    print(repr(kw[i:i+50]))
    i2 = kw.find("el(els[2])")
    print("tail", repr(kw[i2:i2+80]))
kw = kw.replace(old_end, new_end)
p.write_text(kw, encoding="utf-8")
r = subprocess.run(["node", "--check", str(p)], capture_output=True)
print("syntax", r.returncode)
if r.returncode:
    print(r.stderr.decode("utf-8", errors="replace")[-400:])
else:
    print("OK", kw.count(new_end))
