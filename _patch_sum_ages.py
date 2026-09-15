# -*- coding: utf-8 -*-
from pathlib import Path
import subprocess
import sys
sys.stdout.reconfigure(encoding="utf-8")
p = Path(r"C:\Users\a8071\Projects\nameanalyz\assets\index-kw5.js")
kw = p.read_text(encoding="utf-8")

# Target live 요약보기 header (after compact patch)
markers = [
    ('Home.tsx:1128', '원', '초년'),
    ('Home.tsx:1129', '형', '장년'),
    ('Home.tsx:1130', '이', '중년'),
    ('Home.tsx:1131', '정', '말년(총운)'),
]

for loc, old, new in markers:
    # current compact form
    old_s = f'data-loc":"client/src/pages/Home.tsx:{loc[9:]}",className:"text-center font-bold",style:{{color:"#78350f",padding:"1px 0",fontSize:"11px"}},children:"{old}"'
    # loc in file is like 1128 without Home.tsx:
    pass

repls = [
    (
        'm.jsx("td",{"data-loc":"client/src/pages/Home.tsx:1128",className:"text-center font-bold",style:{color:"#78350f",padding:"1px 0",fontSize:"11px"},children:"원"})',
        'm.jsx("td",{"data-loc":"client/src/pages/Home.tsx:1128",className:"text-center font-bold",style:{color:"#78350f",padding:"1px 0",fontSize:"11px"},children:"초년"})',
    ),
    (
        'm.jsx("td",{"data-loc":"client/src/pages/Home.tsx:1129",className:"text-center font-bold",style:{color:"#78350f",padding:"1px 0",fontSize:"11px"},children:"형"})',
        'm.jsx("td",{"data-loc":"client/src/pages/Home.tsx:1129",className:"text-center font-bold",style:{color:"#78350f",padding:"1px 0",fontSize:"11px"},children:"장년"})',
    ),
    (
        'm.jsx("td",{"data-loc":"client/src/pages/Home.tsx:1130",className:"text-center font-bold",style:{color:"#78350f",padding:"1px 0",fontSize:"11px"},children:"이"})',
        'm.jsx("td",{"data-loc":"client/src/pages/Home.tsx:1130",className:"text-center font-bold",style:{color:"#78350f",padding:"1px 0",fontSize:"11px"},children:"중년"})',
    ),
    (
        'm.jsx("td",{"data-loc":"client/src/pages/Home.tsx:1131",className:"text-center font-bold",style:{color:"#78350f",padding:"1px 0",fontSize:"11px"},children:"정"})',
        'm.jsx("td",{"data-loc":"client/src/pages/Home.tsx:1131",className:"text-center font-bold",style:{color:"#78350f",padding:"1px 0",fontSize:"11px"},children:"말년(총운)"})',
    ),
]

for old, new in repls:
    n = kw.count(old)
    print(repr(old[-40:]), "count", n)
    if n != 1:
        # show nearby
        i = kw.find('Home.tsx:1128')
        print("ctx", repr(kw[i:i+200]))
        raise SystemExit(f"expected 1 got {n}")
    kw = kw.replace(old, new, 1)

p.write_text(kw, encoding="utf-8")
r = subprocess.run(["node", "--check", str(p)], capture_output=True)
print("syntax", r.returncode)
for s in ("초년", "장년", "중년", "말년(총운)"):
    print(s, kw.count(f'children:"{s}"'))
