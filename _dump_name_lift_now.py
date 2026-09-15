# -*- coding: utf-8 -*-
from pathlib import Path
import sys
sys.stdout.reconfigure(encoding="utf-8")
t = Path("assets/index-kw5.js").read_text(encoding="utf-8")

i = t.find("function liftKoField")
print("=== liftKoField ===")
print(t[i:i+900])

j = t.find('id:"koNameInput"')
print("\n=== koNameInput handlers ===")
print(t[j:j+1200])

# index.html scroll margin for name
html = Path("index.html").read_text(encoding="utf-8")
print("\n=== html name css ===")
for line in html.splitlines():
    if "koName" in line or "scroll-margin" in line or "birth" in line:
        print(line)
