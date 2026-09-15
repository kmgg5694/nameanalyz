# -*- coding: utf-8 -*-
from pathlib import Path

JS_PATH = Path(r"C:\Users\a8071\Projects\nameanalyz\assets\index-kw5.js")
raw = JS_PATH.read_bytes()
kw = raw.decode("utf-8")

old = 'm.jsx("span",{style:{flex:1,fontSize:"12px",color:"#57534e",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"},children:ao.meaning||""})'
new = 'm.jsxs("span",{style:{flex:1,minWidth:0,display:"flex",flexDirection:"column",gap:"1px",overflow:"hidden"},children:[m.jsx("span",{style:{fontSize:"12px",color:"#57534e",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"},children:ao.meaning||""}),ao.detail?m.jsx("span",{style:{fontSize:"10px",color:"#a8a29e",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"},children:"("+ao.detail+")"}):null]})'

c = kw.count(old)
if c != 1:
    raise SystemExit(f"expected 1 meaning span, found {c}")
out = kw.replace(old, new, 1)
JS_PATH.write_bytes(out.encode("utf-8"))
print("ui patched", len(kw), "->", len(out))

# spot-check 价
i = out.find('{char:"价"')
print("jia", out[i:i+220])
