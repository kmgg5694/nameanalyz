# -*- coding: utf-8 -*-
from pathlib import Path
import subprocess
import sys
sys.stdout.reconfigure(encoding="utf-8")

p = Path("assets/index-kw5.js")
kw = p.read_text(encoding="utf-8")

# Fix missing m.jsx("div", before 1193
bad = 'children:Wo}),{"data-loc":"client/src/pages/Home.tsx:1193"'
good = 'children:Wo}),m.jsx("div",{"data-loc":"client/src/pages/Home.tsx:1193"'
if bad not in kw:
    # maybe already has m.jsx
    print("bad join not found", "m.jsx div 1193", 'm.jsx("div",{"data-loc":"client/src/pages/Home.tsx:1193"' in kw)
else:
    kw = kw.replace(bad, good, 1)
    print("fixed 1193 join")

# Fix PrCard similar issue?
# after remove: children:ro}),q.length>0
# or children:ro}),L&& removed leaving broken
i = kw.find("PrCard.tsx:289")
print("prcard around", repr(kw[i:i+200]) if i>0 else "miss")
# look for }),q.length
j = kw.find('}),q.length>0&&m.jsxs("div",{"data-loc":"client/src/components/PrCard.tsx:315"')
print("prcard join ok", j > 0, repr(kw[j-40:j+50]) if j>0 else "")

# Check narrative 초년
nar = kw.find("Home.tsx:1307")
snip = kw[nar:nar+800] if nar>0 else ""
print("nar snip", snip[:500])
print("has 초년(1~23세)", "초년(1~23세)" in kw)

# If narrative lost 초년 rows, restore from structure
if "초년(1~23세)" not in kw:
    # find return secs
    rs = kw.find("return secs})()})", nar if nar>0 else 0)
    print("return secs at", rs, repr(kw[rs-200:rs+20]) if rs>0 else "")

p.write_text(kw, encoding="utf-8")
r = subprocess.run(["node", "--check", str(p)], capture_output=True)
print("syntax", r.returncode)
if r.returncode:
    err = r.stderr.decode("utf-8", errors="replace")
    print(err[-1000:])
    # try to find line - node check on minified is hard
else:
    print("SYNTAX OK")

html = Path("index.html").read_text(encoding="utf-8")
html = html.replace("?v=20260911h", "?v=20260911i").replace("?v=20260911g", "?v=20260911i")
Path("index.html").write_text(html, encoding="utf-8")
