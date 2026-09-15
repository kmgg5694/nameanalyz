# -*- coding: utf-8 -*-
from pathlib import Path
import subprocess
import sys
sys.stdout.reconfigure(encoding="utf-8")
p = Path(r"C:\Users\a8071\Projects\nameanalyz\assets\index-kw5.js")
kw = p.read_text(encoding="utf-8")

old = (
    'children:"탄생일은 음력기준입니다."}),'
    'm.jsx("div",{style:{textAlign:"center",fontSize:"14px",fontWeight:700,color:"#78350f",marginBottom:"4px"},'
    'children:"음력 "+birth.lunar[0]+"."+(+birth.lunar[1])+"."+(+birth.lunar[2])}),'
    'm.jsx("div",{style:{textAlign:"center",fontSize:"13px",fontWeight:700,color:"#92400e",letterSpacing:"1px",marginBottom:"6px"},children:"탄생일 풀이"}),'
)
new = 'children:"탄생일은 음력기준입니다."}),'

if old not in kw:
    i = kw.find("탄생일은 음력기준입니다")
    print(repr(kw[i:i+450]))
    raise SystemExit("miss")

kw = kw.replace(old, new, 1)
p.write_text(kw, encoding="utf-8")
r = subprocess.run(["node", "--check", str(p)], capture_output=True)
print("syntax", r.returncode)
i = kw.find("탄생일은 음력기준입니다")
print(repr(kw[i:i+220]))
print("탄생일 풀이 left", kw.count("탄생일 풀이"))
print("음력 \"+birth.lunar", 'children:"음력 "+birth.lunar[0]' in kw)
