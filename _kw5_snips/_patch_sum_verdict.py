# -*- coding: utf-8 -*-
from pathlib import Path
p = Path(r"C:\Users\a8071\Projects\nameanalyz\assets\index-eTNXNndF.js")
t = p.read_text(encoding="utf-8")
neu = Path(r"C:\Users\a8071\Projects\nameanalyz\_kw5_snips\_sum_iife_neu.js").read_text(encoding="utf-8").rstrip() + "\n"
mark = 'return E.jsxs("div",{"data-loc":"client/src/pages/EnglishName.tsx:sumTable"'
end = t.find(mark)
if end < 0:
    raise SystemExit("sumTable return not found")
start = t.rfind("(()=>{const strip=", 0, end)
if start < 0:
    raise SystemExit("IIFE start not found")
t = t[:start] + neu + t[end:]

old = 'lines.length>0&&E.jsxs("div",{style:{marginTop:"12px",fontSize:"0.9rem",lineHeight:1.7,color:"#1c1917"},children:[E.jsx("div",{style:{fontWeight:700,color:"#5b21b6",marginBottom:"4px"},children:S?"총평":"Summary"}),lines.map((ln,ii)=>E.jsx("div",{children:ln},ii))]})'
new = '(lines.length>0||verdict)&&E.jsxs("div",{style:{marginTop:"12px",fontSize:"0.9rem",lineHeight:1.75,color:"#1c1917"},children:[E.jsx("div",{style:{fontWeight:700,color:"#5b21b6",marginBottom:"6px"},children:S?"총평":"Summary"}),lines.map((ln,ii)=>E.jsx("div",{style:{marginBottom:"3px"},children:ln},ii)),verdict&&E.jsx("div",{style:{fontWeight:700,marginTop:"10px",color:"#5b21b6"},children:verdict})]})'
if old not in t:
    raise SystemExit("총평 JSX not found")
t = t.replace(old, new, 1)
p.write_text(t, encoding="utf-8")
print("patched", "verdict" in t, "결론:" in t, t.count("EnglishName.tsx:sumTable"))
