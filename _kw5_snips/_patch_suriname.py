# -*- coding: utf-8 -*-
from pathlib import Path

p = Path(r"C:\Users\a8071\Projects\nameanalyz\assets\index-kw5.js")
s = p.read_text(encoding="utf-8")


def once(src, old, new, label):
    n = src.count(old)
    if n != 1:
        raise SystemExit("%s: count=%s" % (label, n))
    return src.replace(old, new, 1)


s = once(
    s,
    "On&&(()=>{const G=to?.won,mo=to?.hyeong,co=to?.i,wo=to?.jeong,_o=Io?.won,No=Io?.hyeong,Mo=Io?.i,Ro=Io?.jeong,Tn=",
    'On&&(()=>{const G=to?.won,mo=to?.hyeong,co=to?.i,wo=to?.jeong,_o=Io?.won,No=Io?.hyeong,Mo=Io?.i,Ro=Io?.jeong,fmtNm=n=>{const h=String(n||"").replace(/\\([^)]*\\)/g,"").replace(/\\s+/g,"");const a=[];for(let i=0;i<h.length;i+=2)a.push(h.slice(i,i+2));return a.length?a:["-"]},Tn=',
    "fmtNm helper",
)

old_cell = (
    'm.jsx("td",{"data-loc":"client/src/pages/Home.tsx:899",className:"py-1 text-center",'
    'style:{color:Eo(ho.data.type),fontSize:"10px"},children:ho.data.name},`hg-suriname-${bo}`)'
)
new_cell = (
    'm.jsxs("td",{"data-loc":"client/src/pages/Home.tsx:899",className:"py-1 text-center",'
    'style:{color:Eo(ho.data.type),fontSize:"10px",lineHeight:1.25,whiteSpace:"nowrap"},'
    "children:fmtNm(ho.data.name).map((nm,ii)=>m.jsx(\"div\",{style:{whiteSpace:\"nowrap\"},children:nm},ii))},`hg-suriname-${bo}`)"
)
s = once(s, old_cell, new_cell, "hg suriname")

old_cell2 = (
    'm.jsx("td",{"data-loc":"client/src/pages/Home.tsx:905",className:"py-1 text-center",'
    'style:{color:Eo(ho.data.type),fontSize:"10px"},children:ho.data.name},`hj-suriname-${bo}`)'
)
new_cell2 = (
    'm.jsxs("td",{"data-loc":"client/src/pages/Home.tsx:905",className:"py-1 text-center",'
    'style:{color:Eo(ho.data.type),fontSize:"10px",lineHeight:1.25,whiteSpace:"nowrap"},'
    "children:fmtNm(ho.data.name).map((nm,ii)=>m.jsx(\"div\",{style:{whiteSpace:\"nowrap\"},children:nm},ii))},`hj-suriname-${bo}`)"
)
s = once(s, old_cell2, new_cell2, "hj suriname")

p.write_text(s, encoding="utf-8")
print("fmtNm", s.count("fmtNm="), "hg", s.count("hg-suriname"), "nowrap cells", s.count('whiteSpace:"nowrap"},children:nm'))
