# -*- coding: utf-8 -*-
from pathlib import Path
import subprocess, re
import sys
sys.stdout.reconfigure(encoding="utf-8")

p = Path("assets/index-kw5.js")
kw = p.read_text(encoding="utf-8")

# Replace broken ending with correct braces
# Find unique end of ohang IIFE
pat = 'hjShow&&side("한문 오행명",hjNames)'
i = kw.find(pat)
if i < 0:
    raise SystemExit("end marker miss")
# from end of pat to 1074
j = kw.find('m.jsx("div",{"data-loc":"client/src/pages/Home.tsx:1074"', i)
print("between", repr(kw[i+len(pat):j]))

# Correct close sequence after side(...):
# ]})  close row2 children+jsxs
# ]})  close Fragment children+jsxs  
# })() close IIFE
# ]}), close 980 children+jsxs
fixed = pat + ']})]})})()]}),'
kw2 = kw[:i] + fixed + kw[j:]
p.write_text(kw2, encoding="utf-8")
r = subprocess.run(["node", "--check", str(p)], capture_output=True)
print("syntax", r.returncode)
if r.returncode:
    print(r.stderr.decode("utf-8", errors="replace")[-500:])
    # show ending again
    i2 = kw2.find(pat)
    j2 = kw2.find("1074", i2)
    print(repr(kw2[i2:j2]))
    raise SystemExit(1)
print("SYNTAX OK")
html = Path("index.html").read_text(encoding="utf-8")
html = re.sub(r"index-kw5\.js\?v=[^\"]+", "index-kw5.js?v=20260911k", html)
Path("index.html").write_text(html, encoding="utf-8")
print([x for x in html.splitlines() if "index-kw5" in x][0])
