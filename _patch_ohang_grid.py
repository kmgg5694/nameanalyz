# -*- coding: utf-8 -*-
"""오행을 이름열 비율(1:1:2)에 맞춰 金|기호|金|기호|土 배치."""
import sys
import subprocess
from pathlib import Path
sys.stdout.reconfigure(encoding="utf-8")

p = Path(r"C:\Users\a8071\Projects\nameanalyz\assets\index-kw5.js")
kw = p.read_text(encoding="utf-8")

def make_row(tr_loc, lab_loc, td_loc, arr, r0, r1, a0, a1, b0, b1):
    return (
        'm.jsxs("tr",{"data-loc":"client/src/pages/Home.tsx:' + tr_loc + '",style:{borderBottom:"1px solid #e5e7eb"},children:['
        'm.jsx("td",{"data-loc":"client/src/pages/Home.tsx:' + lab_loc + '",className:"pr-1 font-bold text-right whitespace-nowrap",style:{color:"#92400e",width:"3rem",padding:"2px 2px 2px 0",verticalAlign:"middle"},children:"오행"}),'
        'm.jsx("td",{"data-loc":"client/src/pages/Home.tsx:' + td_loc + '",colSpan:4,style:{padding:"6px 0"},children:(()=>{'
        'const els=' + arr + ',cm={木:"#166534",火:"#991b1b",土:"#92400e",金:"#1c1917",水:"#1e3a8a"};'
        'const mk=(r,d,up)=>{const lab=r==="sangsaeng"?"○":r==="sanggeuk"?"✕":"△",tag=r==="sangsaeng"?"생":r==="sanggeuk"?"극":"비",col=r==="sangsaeng"?"#166534":r==="sanggeuk"?"#991b1b":"#a16207",ar=up?(d==="top_gives"||d==="top_takes"?"→":d==="me_gives_up"||d==="me_fights_up"?"←":"↔"):(d==="me_gives_down"||d==="me_takes"?"→":d==="down_drains"||d==="down_fights"?"←":"↔");'
        'return m.jsxs("div",{style:{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",lineHeight:1.05},children:['
        'm.jsxs("span",{style:{color:col,fontSize:"18px",fontWeight:900},children:[lab,ar]}),'
        'm.jsx("span",{style:{color:col,fontSize:"12px",fontWeight:800},children:tag})]'
        '})};'
        'const cell=(x)=>m.jsx("div",{style:{display:"flex",alignItems:"center",justifyContent:"center"},children:m.jsx("span",{style:{color:cm[x]||"#9ca3af",fontSize:"18px",fontWeight:800},children:x||"?"})});'
        'return m.jsxs("div",{style:{display:"grid",gridTemplateColumns:"1fr auto 1fr auto 2fr",alignItems:"center",width:"100%"},children:['
        'cell(els[0]),mk(' + r0 + ',Hd(' + a0 + ',' + a1 + '),!0),cell(els[1]),mk(' + r1 + ',fd(' + b0 + ',' + b1 + '),!1),cell(els[2])'
        ']});'
        '})()})]}),'
    )

new_hg = make_row("ohangRow", "ohangLab", "ohangHg", "K", "W", "_", "K[0]", "K[1]", "K[1]", "K[2]")
new_hj = make_row("hjOhang", "hjOhangLab", "hjOhangTd", "hjO", "L", "eo", "hjO[0]", "hjO[1]", "hjO[1]", "hjO[2]")

i = kw.find('m.jsxs("tr",{"data-loc":"client/src/pages/Home.tsx:ohangRow"')
j = kw.find('m.jsxs("tr",{"data-loc":"client/src/pages/Home.tsx:856"', i)
print("hg", i, j)
kw = kw[:i] + new_hg + kw[j:]

i2 = kw.find('m.jsxs("tr",{"data-loc":"client/src/pages/Home.tsx:hjOhang"')
j2 = kw.find('m.jsxs("tr",{"data-loc":"client/src/pages/Home.tsx:hjStroke"', i2)
print("hj", i2, j2)
kw = kw[:i2] + new_hj + kw[j2:]

p.write_text(kw, encoding="utf-8")
r = subprocess.run(["node", "--check", str(p)], capture_output=True)
print("syntax", r.returncode)
if r.returncode:
    print(r.stderr.decode("utf-8", errors="replace")[-400:])
else:
    print("OK grid 1fr auto 1fr auto 2fr")
