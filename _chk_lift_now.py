# -*- coding: utf-8 -*-
from pathlib import Path
import sys
sys.stdout.reconfigure(encoding="utf-8")
kw = Path(r"C:\Users\a8071\Projects\nameanalyz\assets\index-kw5.js").read_text(encoding="utf-8")
html = Path(r"C:\Users\a8071\Projects\nameanalyz\index.html").read_text(encoding="utf-8")

i = kw.find("function liftKoField")
print(kw[i:i+700])
print("---")
# birth field end - className birth-ymd style
j = kw.find('className:"birth-ymd"')
print(kw[j-80:j+200])
print("---")
# css
for line in html.splitlines():
    if "birth" in line.lower() or "scroll-margin" in line:
        print(line.strip())
