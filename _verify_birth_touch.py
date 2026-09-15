# -*- coding: utf-8 -*-
from pathlib import Path
import subprocess
t = Path(r"C:\Users\a8071\Projects\nameanalyz\assets\index-kw5.js").read_text(encoding="utf-8")
old = "onTouchStart:G=>{const el=G.currentTarget,r=el.getBoundingClientRect(),d=r.top-100"
print("old birth onTouch", t.count(old))
print("birth lift", t.count('onFocus:G=>liftKoField(G.target),className:"birth-ymd"'))
r = subprocess.run(["node", "--check", r"C:\Users\a8071\Projects\nameanalyz\assets\index-kw5.js"], capture_output=True)
print("syntax", r.returncode)
