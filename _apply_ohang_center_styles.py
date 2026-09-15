# -*- coding: utf-8 -*-
from pathlib import Path
import subprocess
import re
import sys
sys.stdout.reconfigure(encoding="utf-8")

root = Path(r"C:\Users\a8071\Projects\nameanalyz")
cur = (root / "assets/index-kw5.js").read_text(encoding="utf-8")
print("978 count", cur.count('Home.tsx:978"'))
print("한글 오행 count", cur.count("한글 오행"))
print("old 980 flex", 'Home.tsx:980",className:"flex items-center py-2"' in cur)

# Apply center styles on restored good layout
repls = [
(
'Home.tsx:978",className:"mt-2 border rounded",style:{borderColor:"#d97706"}',
'Home.tsx:978",className:"mt-2 border rounded",style:{borderColor:"#d97706",padding:"10px 6px"}'
),
(
'Home.tsx:980",className:"flex items-center py-2",style:{borderBottom:"1px solid #e5e7eb"}',
'Home.tsx:980",className:"flex items-center justify-center py-2",style:{borderBottom:"1px solid #e5e7eb",width:"100%",gap:"6px",flexWrap:"wrap"}'
),
(
'Home.tsx:1031",className:"flex items-center py-1"',
'Home.tsx:1031",className:"flex items-center justify-center py-1",style:{width:"100%",gap:"6px",flexWrap:"wrap"}'
),
(
'Home.tsx:981",className:"pr-2 font-bold text-right whitespace-nowrap",style:{color:"#92400e",fontSize:"12px",width:"3.5rem",flexShrink:0}',
'Home.tsx:981",className:"pr-2 font-bold text-right whitespace-nowrap",style:{color:"#92400e",fontSize:"12px",width:"2.6rem",flexShrink:0}'
),
(
'Home.tsx:1032",className:"pr-2 font-bold text-right whitespace-nowrap",style:{color:"#92400e",fontSize:"10px",width:"3.5rem",flexShrink:0}',
'Home.tsx:1032",className:"pr-2 font-bold text-right whitespace-nowrap",style:{color:"#92400e",fontSize:"10px",width:"2.6rem",flexShrink:0}'
),
(
'Home.tsx:983",className:"flex items-center justify-center gap-1",style:{flex:1}',
'Home.tsx:983",className:"flex items-center justify-center gap-1.5",style:{flex:"0 1 auto",minWidth:"8.5rem"}'
),
(
'Home.tsx:1002",className:"flex items-center justify-center gap-1",style:{flex:1}',
'Home.tsx:1002",className:"flex items-center justify-center gap-1.5",style:{flex:"0 1 auto",minWidth:"8.5rem"}'
),
(
'Home.tsx:1034",className:"flex items-center justify-center gap-1",style:{flex:1}',
'Home.tsx:1034",className:"flex items-center justify-center gap-1.5",style:{flex:"0 1 auto",minWidth:"8.5rem"}'
),
(
'Home.tsx:1054",className:"flex items-center justify-center gap-1",style:{flex:1}',
'Home.tsx:1054",className:"flex items-center justify-center gap-1.5",style:{flex:"0 1 auto",minWidth:"8.5rem"}'
),
(
'Home.tsx:985",className:"flex items-center gap-1"',
'Home.tsx:985",className:"flex items-center gap-1.5"'
),
(
'Home.tsx:1007",className:"flex items-center gap-1"',
'Home.tsx:1007",className:"flex items-center gap-1.5"'
),
(
'Home.tsx:1039",className:"flex items-center gap-1"',
'Home.tsx:1039",className:"flex items-center gap-1.5"'
),
(
'Home.tsx:1058",className:"flex items-center gap-1"',
'Home.tsx:1058",className:"flex items-center gap-1.5"'
),
]
for a,b in repls:
    if a not in cur:
        print("MISS", a[:60])
    else:
        cur = cur.replace(a, b, 1)
        print("OK", a[10:30])

(root / "assets/index-kw5.js").write_text(cur, encoding="utf-8")
r = subprocess.run(["node", "--check", str(root / "assets/index-kw5.js")], capture_output=True)
print("syntax", r.returncode)
if r.returncode:
    print(r.stderr.decode()[-300:])
    raise SystemExit(1)

html = (root / "index.html").read_text(encoding="utf-8")
html = re.sub(r"index-kw5\.js\?v=[^\"]+", "index-kw5.js?v=20260911k", html)
(root / "index.html").write_text(html, encoding="utf-8")
print("html", [x for x in html.splitlines() if "index-kw5" in x][0])
