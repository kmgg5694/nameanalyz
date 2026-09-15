# -*- coding: utf-8 -*-
from pathlib import Path
import subprocess
import sys
sys.stdout.reconfigure(encoding="utf-8")

p = Path("assets/index-kw5.js")
kw = p.read_text(encoding="utf-8")

bad = 'hjNames)]})]})}())]}),m.jsx("div",{"data-loc":"client/src/pages/Home.tsx:1074"'
good = 'hjNames)]})})()]}),m.jsx("div",{"data-loc":"client/src/pages/Home.tsx:1074"'
if bad not in kw:
    # show actual nearby
    j = kw.find("한문 오행명")
    print(repr(kw[j:j+120]))
    raise SystemExit("pattern miss")
kw = kw.replace(bad, good, 1)
p.write_text(kw, encoding="utf-8")
r = subprocess.run(["node", "--check", str(p)], capture_output=True)
print("syntax", r.returncode)
if r.returncode:
    print(r.stderr.decode("utf-8", errors="replace")[-500:])
    raise SystemExit(1)

html = Path("index.html").read_text(encoding="utf-8")
html = html.replace("?v=20260911i", "?v=20260911j").replace("?v=20260911h", "?v=20260911j")
if "?v=20260911j" not in html:
    html = html.replace("index-kw5.js?v=20260911", "index-kw5.js?v=20260911j")
    # safer
    import re
    html = re.sub(r"index-kw5\.js\?v=[^\"]+", "index-kw5.js?v=20260911j", html)
Path("index.html").write_text(html, encoding="utf-8")
print("OK", [x for x in html.splitlines() if "index-kw5" in x][0])
