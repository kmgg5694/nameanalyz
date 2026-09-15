# -*- coding: utf-8 -*-
from pathlib import Path
import subprocess
import sys
sys.stdout.reconfigure(encoding="utf-8")
kw = Path(r"C:\Users\a8071\Projects\nameanalyz\assets\index-kw5.js").read_text(encoding="utf-8")
print("773b", kw.find("Home.tsx:773b"))
print("탄생일 ", "탄생일 " in kw[kw.find("773b"):kw.find("773b")+400] if kw.find("773b")>0 else False)
i = kw.find("Home.tsx:773b")
print(kw[i:i+350] if i>0 else "missing")
print("birth lift left", kw.count("liftKoField(G.target)"))
print("liftKoField def", kw.find("function liftKoField"))
r = subprocess.run(["node", "--check", r"C:\Users\a8071\Projects\nameanalyz\assets\index-kw5.js"], capture_output=True)
print("syntax", r.returncode)
if r.returncode:
    print(r.stderr.decode("utf-8", errors="replace")[-300:])
