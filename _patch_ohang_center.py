# -*- coding: utf-8 -*-
"""오행 기호를 글자 사이 가운데에, 크게 표시."""
import sys
import subprocess
from pathlib import Path
sys.stdout.reconfigure(encoding="utf-8")

p = Path(r"C:\Users\a8071\Projects\nameanalyz\assets\index-kw5.js")
kw = p.read_text(encoding="utf-8")

def make_row(tr_loc, lab_loc, td_loc, arr, r0, r1, a0, a1, b0, b1):
    # One colspan cell: el — MARKER — el — MARKER — el
    return (
        'm.jsxs("tr",{"data-loc":"client/src/pages/Home.tsx:' + tr_loc + '",style:{borderBottom:"1px solid #e5e7eb"},children:['
        'm.jsx("td",{"data-loc":"client/src/pages/Home.tsx:' + lab_loc + '",className:"pr-1 font-bold text-right whitespace-nowrap",style:{color:"#92400e",width:"3rem",padding:"2px 2px 2px 0",verticalAlign:"middle"},children:"오행"}),'
        'm.jsx("td",{"data-loc":"client/src/pages/Home.tsx:' + td_loc + '",colSpan:4,style:{padding:"4px 2px"},children:'
        '(()=>{const els=' + arr + ';'
        'const mk=(r,d,up)=>{const lab=r==="sangsaeng"?"○":r==="sanggeuk"?"✕":"△";'
        'const tag=r==="sangsaeng"?"생":r==="sanggeuk"?"극":"비";'
        'const col=r==="sangsaeng"?"#166534":r==="sanggeuk"?"#991b1b":"#a16207";'
        'const ar=up?(d==="top_gives"||d==="top_takes"?"→":d==="me_gives_up"||d==="me_fights_up"?"←":"↔"):(d==="me_gives_down"||d==="me_takes"?"→":d==="down_drains"||d==="down_fights"?"←":"↔");'
        'return m.jsxs("span",{style:{display:"inline-flex",flexDirection:"column",alignItems:"center",justifyContent:"center",minWidth:"2.2rem",lineHeight:1.05,margin:"0 2px"},children:['
        'm.jsxs("span",{style:{color:col,fontSize:"16px",fontWeight:900,letterSpacing:"-0.5px"},children:[lab,ar]}),'
        'm.jsx("span",{style:{color:col,fontSize:"10px",fontWeight:800},children:tag})'
        ']});};'
        'const cmap={木:"#166534",火:"#991b1b",土:"#92400e",金:"#374151",水:"#1e3a8a"};'
        'return m.jsx("div",{style:{display:"flex",alignItems:"center",justifyContent:"center",gap:"2px",width:"100%"},children:['
        'm.jsx("span",{style:{color:cmap[els[0]]||"#9ca3af",fontSize:"16px",fontWeight:800,minWidth:"1.4rem",textAlign:"center"},children:els[0]||"?"}),'
        'mk(' + r0 + ',Hd(' + a0 + ',' + a1 + '),!0),'
        'm.jsx("span",{style:{color:cmap[els[1]]||"#9ca3af",fontSize:"16px",fontWeight:800,minWidth:"1.4rem",textAlign:"center"},children:els[1]||"?"}),'
        'mk(' + r1 + ',fd(' + b0 + ',' + b1 + '),!1),'
        'm.jsx("span",{style:{color:cmap[els[2]]||"#9ca3af",fontSize:"16px",fontWeight:800,minWidth:"1.4rem",textAlign:"center"},children:els[2]||"?"})'
        ']});})()'
        ')})]}),'
    )

# Fix closing - I may have messed up brackets. Build carefully.

def make_row2(tr_loc, lab_loc, td_loc, arr, r0, r1, a0, a1, b0, b1):
    return (
        'm.jsxs("tr",{"data-loc":"client/src/pages/Home.tsx:' + tr_loc + '",style:{borderBottom:"1px solid #e5e7eb"},children:['
        'm.jsx("td",{"data-loc":"client/src/pages/Home.tsx:' + lab_loc + '",className:"pr-1 font-bold text-right whitespace-nowrap",style:{color:"#92400e",width:"3rem",padding:"2px 2px 2px 0",verticalAlign:"middle"},children:"오행"}),'
        'm.jsx("td",{"data-loc":"client/src/pages/Home.tsx:' + td_loc + '",colSpan:4,style:{padding:"4px 2px"},children:(()=>{'
        'const els=' + arr + ';'
        'const mk=(r,d,up)=>{const lab=r==="sangsaeng"?"○":r==="sanggeuk"?"✕":"△",tag=r==="sangsaeng"?"생":r==="sanggeuk"?"극":"비",col=r==="sangsaeng"?"#166534":r==="sanggeuk"?"#991b1b":"#a16207",ar=up?(d==="top_gives"||d==="top_takes"?"→":d==="me_gives_up"||d==="me_fights_up"?"←":"↔"):(d==="me_gives_down"||d==="me_takes"?"→":d==="down_drains"||d==="down_fights"?"←":"↔");'
        'return m.jsxs("span",{style:{display:"inline-flex",flexDirection:"column",alignItems:"center",justifyContent:"center",minWidth:"2.4rem",padding:"0 2px",lineHeight:1.05},children:['
        'm.jsxs("span",{style:{color:col,fontSize:"17px",fontWeight:900},children:[lab,ar]}),'
        'm.jsx("span",{style:{color:col,fontSize:"11px",fontWeight:800,marginTop:"1px"},children:tag})]'
        '})};'
        'const cm={木:"#166534",火:"#991b1b",土:"#92400e",金:"#1c1917",水:"#1e3a8a"};'
        'const el=(x)=>m.jsx("span",{style:{color:cm[x]||"#9ca3af",fontSize:"17px",fontWeight:800,minWidth:"1.5rem",textAlign:"center",display:"inline-block"},children:x||"?"});'
        'return m.jsxs("div",{style:{display:"flex",alignItems:"center",justifyContent:"center",width:"100%",gap:"0"},children:['
        'el(els[0]),mk(' + r0 + ',Hd(' + a0 + ',' + a1 + '),!0),el(els[1]),mk(' + r1 + ',fd(' + b0 + ',' + b1 + '),!1),el(els[2])'
        ']});'
        '})()}]}),'
    )

new_hg = make_row2("ohangRow", "ohangLab", "ohangHg", "K", "W", "_", "K[0]", "K[1]", "K[1]", "K[2]")
new_hj = make_row2("hjOhang", "hjOhangLab", "hjOhangTd", "hjO", "L", "eo", "hjO[0]", "hjO[1]", "hjO[1]", "hjO[2]")

i = kw.find('m.jsxs("tr",{"data-loc":"client/src/pages/Home.tsx:ohangRow"')
j = kw.find('m.jsxs("tr",{"data-loc":"client/src/pages/Home.tsx:856"', i)
if i < 0 or j < 0:
    raise SystemExit("hg %s %s" % (i, j))
kw = kw[:i] + new_hg + kw[j:]

i2 = kw.find('m.jsxs("tr",{"data-loc":"client/src/pages/Home.tsx:hjOhang"')
j2 = kw.find('m.jsxs("tr",{"data-loc":"client/src/pages/Home.tsx:hjStroke"', i2)
if i2 < 0 or j2 < 0:
    raise SystemExit("hj %s %s" % (i2, j2))
kw = kw[:i2] + new_hj + kw[j2:]

p.write_text(kw, encoding="utf-8")
r = subprocess.run(["node", "--check", str(p)], capture_output=True)
print("syntax", r.returncode)
if r.returncode:
    print(r.stderr.decode("utf-8", errors="replace")[-500:])
else:
    print("OK centered")
    Path(r"C:\Users\a8071\Projects\nameanalyz\_kw5_snips\ohang_center.txt").write_text(new_hg, encoding="utf-8")
