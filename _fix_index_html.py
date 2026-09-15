# -*- coding: utf-8 -*-
import subprocess
from pathlib import Path
import sys
sys.stdout.reconfigure(encoding="utf-8")

root = Path(r"C:\Users\a8071\Projects\nameanalyz")
# Restore good UTF-8 HTML from last intact commit
good = subprocess.check_output(["git", "show", "5c836b6:index.html"])
# bump cache only via bytes replace
old = b'src="./assets/index-kw5.js?v=20260911d"'
new = b'src="./assets/index-kw5.js?v=20260911m"'
if old not in good:
    # try other versions in that file
    import re
    good2, n = re.subn(br'index-kw5\.js\?v=[^"]+', b'index-kw5.js?v=20260911m', good, count=1)
    if n != 1:
        raise SystemExit("script src not found")
    good = good2
else:
    good = good.replace(old, new, 1)

# verify title intact
if b"</title>" not in good:
    raise SystemExit("still broken title")
print("title ok", good[good.find(b"<title>"):good.find(b"</title>")+8].decode("utf-8"))
print("script", [ln.decode("utf-8") for ln in good.split(b"\n") if b"index-kw5" in ln][0].strip())

# write as UTF-8 without BOM
(root / "index.html").write_bytes(good)
# also check apple title etc
text = good.decode("utf-8")
print("has 김만기", "김만기" in text)
print("broken meta", "??/title>" in text)
