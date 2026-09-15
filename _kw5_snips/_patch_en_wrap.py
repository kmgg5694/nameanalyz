# -*- coding: utf-8 -*-
from pathlib import Path

p = Path(r"C:\Users\a8071\Projects\nameanalyz\assets\index-eTNXNndF.js")
t = p.read_text(encoding="utf-8")

old_fmt = r'''const fmtNm=nm=>S?nm:String(nm||"").replace(/\s+(\S+)$/,"\n$1");const cellBtn={background:"none",border:"none",padding:0,cursor:"pointer",font:"inherit",fontWeight:700,textDecoration:S?"underline":"none",textUnderlineOffset:"3px",textDecorationThickness:"2px",borderBottom:S?"none":"1.5px solid currentColor",paddingBottom:S?0:"2px",whiteSpace:S?"nowrap":"pre-line",wordBreak:S?"keep-all":"break-word",overflowWrap:"anywhere",lineHeight:1.2,maxWidth:"100%",width:"100%",minHeight:S?"auto":"2.5em",display:"block",textAlign:"center",fontSize:S?"11px":"8px",letterSpacing:S?"0":"-0.15px"};'''

new_fmt = r'''const wrapNm=nm=>{const h=String(nm||"").replace(/\([^)]*\)/g,"").replace(/[（）]/g,"").replace(/\s+/g," ").trim()||"-";if(!/[A-Za-z]/.test(h)){const a=[];for(let i=0;i<h.length;i+=2)a.push(h.slice(i,i+2));return a.length?a:["-"]}const w=h.split(" ");if(w.length<=2)return w;let b=1,d=1e9;for(let i=1;i<w.length;i++){const L=w.slice(0,i).join(" ").length,R=w.slice(i).join(" ").length,x=Math.abs(L-R);if(x<d){d=x;b=i}}return[w.slice(0,b).join(" "),w.slice(b).join(" ")]};const cellBtn={background:"none",border:"none",padding:"1px 0",margin:0,cursor:"pointer",font:"inherit",fontWeight:700,textDecoration:"underline",textUnderlineOffset:"2px",width:"100%",maxWidth:"100%",minHeight:"2.7em",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"flex-start",textAlign:"center",lineHeight:1.2,fontSize:S?"11px":"8.5px",letterSpacing:S?"0":"-0.15px",overflow:"hidden",boxSizing:"border-box"};const lnSt={display:"block",width:"100%",lineHeight:1.2,textAlign:"center",wordBreak:"keep-all",overflowWrap:"anywhere"};'''

if old_fmt not in t:
    raise SystemExit("fmtNm/cellBtn block not found")

t = t.replace(old_fmt, new_fmt, 1)

old_kids = "children:fmtNm(nm)"
new_kids = 'children:wrapNm(nm).map((ln,k)=>E.jsx("span",{style:lnSt,children:ln},k))'
n = t.count(old_kids)
if n < 2:
    raise SystemExit("fmtNm children count %s" % n)
t = t.replace(old_kids, new_kids)

old_td = 'const td={padding:"5px 2px",textAlign:"center",verticalAlign:"top",overflow:"hidden"};'
new_td = 'const td={padding:"4px 1px",textAlign:"center",verticalAlign:"top",overflow:"hidden",maxWidth:0};'
if old_td not in t:
    raise SystemExit("td style not found")
t = t.replace(old_td, new_td, 1)

p.write_text(t, encoding="utf-8")
print("patched", t.count("wrapNm"), t.count("lnSt"), t.count("fmtNm(nm)"))
