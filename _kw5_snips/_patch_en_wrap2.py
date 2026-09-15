# -*- coding: utf-8 -*-
from pathlib import Path

p = Path(r"C:\Users\a8071\Projects\nameanalyz\assets\index-eTNXNndF.js")
t = p.read_text(encoding="utf-8")

old = r'''const wrapNm=nm=>{const h=String(nm||"").replace(/\([^)]*\)/g,"").replace(/[（）]/g,"").replace(/\s+/g," ").trim()||"-";if(!/[A-Za-z]/.test(h)){const a=[];for(let i=0;i<h.length;i+=2)a.push(h.slice(i,i+2));return a.length?a:["-"]}const w=h.split(" ");if(w.length<=2)return w;let b=1,d=1e9;for(let i=1;i<w.length;i++){const L=w.slice(0,i).join(" ").length,R=w.slice(i).join(" ").length,x=Math.abs(L-R);if(x<d){d=x;b=i}}return[w.slice(0,b).join(" "),w.slice(b).join(" ")]};'''

new = r'''const wrapNm=nm=>{const h=String(nm||"").replace(/\([^)]*\)/g,"").replace(/[（）]/g,"").replace(/\s+/g," ").trim()||"-";if(!/[A-Za-z]/.test(h)){const a=[];for(let i=0;i<h.length;i+=2)a.push(h.slice(i,i+2));return a.length?a:["-"]}const w=h.split(" ");if(w.length===1)return[h];if(w.length===2)return w;return[w.slice(0,2).join(" "),w.slice(2).join(" ")]};'''

if old not in t:
    raise SystemExit("wrapNm not found")
t = t.replace(old, new, 1)

old_lab = 'const lab={padding:"6px 2px 6px 0",textAlign:"left",color:"#5b21b6",fontWeight:700,whiteSpace:"nowrap",fontSize:S?"11px":"10px",width:S?"5.6rem":"3.4rem"};'
new_lab = 'const col0=S?"4.6rem":"2.9rem";const lab={padding:"6px 2px 6px 0",textAlign:"left",color:"#5b21b6",fontWeight:700,whiteSpace:"normal",fontSize:S?"11px":"10px",width:col0,verticalAlign:"middle",lineHeight:1.2};'
if old_lab not in t:
    raise SystemExit("lab not found")
t = t.replace(old_lab, new_lab, 1)

old_th0 = 'E.jsx("th",{style:{...th,textAlign:"left"},children:S?"구분":""})'
new_th0 = 'E.jsx("th",{style:{...th,textAlign:"left",width:col0},children:S?"구분":""})'
if old_th0 not in t:
    raise SystemExit("th0 not found")
t = t.replace(old_th0, new_th0, 1)

old_td = 'const td={padding:"4px 1px",textAlign:"center",verticalAlign:"top",overflow:"hidden",maxWidth:0};'
new_td = 'const td={padding:"6px 2px",textAlign:"center",verticalAlign:"middle",overflow:"hidden",maxWidth:0};'
if old_td not in t:
    raise SystemExit("td not found")
t = t.replace(old_td, new_td, 1)

old_btn = 'minHeight:"2.7em",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"flex-start",textAlign:"center",lineHeight:1.2,fontSize:S?"11px":"8.5px"'
new_btn = 'minHeight:"2.8em",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",textAlign:"center",lineHeight:1.25,fontSize:S?"11px":"9px"'
if old_btn not in t:
    raise SystemExit("cellBtn chunk not found")
t = t.replace(old_btn, new_btn, 1)

p.write_text(t, encoding="utf-8")
print("ok")
