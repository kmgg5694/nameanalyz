# -*- coding: utf-8 -*-
from pathlib import Path
p = Path(r"C:\Users\a8071\Projects\nameanalyz\assets\index-eTNXNndF.js")
t = p.read_text(encoding="utf-8")
old = '[R,D]=j.useState("en"),S=R==="ko"'
new = '[R,D]=j.useState((()=>{try{const L=new URLSearchParams(window.location.search).get("lang");return L==="ko"?"ko":"en"}catch(e){return"en"}})()),S=R==="ko"'
c = t.count(old)
print("count", c)
if c != 1:
    raise SystemExit("marker not unique")
p.write_text(t.replace(old, new, 1), encoding="utf-8")
print("patched english lang from URL")
