# -*- coding: utf-8 -*-
"""오행: 이름 열(김/주/혁)에 金·金·土 정렬, 기호는 열 사이 경계 가운데."""
import sys
import subprocess
from pathlib import Path
sys.stdout.reconfigure(encoding="utf-8")

p = Path(r"C:\Users\a8071\Projects\nameanalyz\assets\index-kw5.js")
kw = p.read_text(encoding="utf-8")

def make_row(tr_loc, lab_loc, td_loc, arr, r0, r1, a0, a1, b0, b1, key_prefix):
    # 3 cells matching name row colSpans; element centered; marker on right border (between cols)
    return (
        'm.jsxs("tr",{"data-loc":"client/src/pages/Home.tsx:' + tr_loc + '",style:{borderBottom:"1px solid #e5e7eb"},children:['
        'm.jsx("td",{"data-loc":"client/src/pages/Home.tsx:' + lab_loc + '",className:"pr-1 font-bold text-right whitespace-nowrap",style:{color:"#92400e",width:"3rem",padding:"2px 2px 2px 0",verticalAlign:"middle"},children:"오행"}),'
        + arr + '.map((el,bo)=>{'
        'const cm={木:"#166534",火:"#991b1b",土:"#92400e",金:"#1c1917",水:"#1e3a8a"};'
        'const r=bo===0?' + r0 + ':bo===1?' + r1 + ':null;'
        'const d=bo===0?Hd(' + a0 + ',' + a1 + '):bo===1?fd(' + b0 + ',' + b1 + '):null;'
        'let mark=null;'
        'if(r&&d){const lab=r==="sangsaeng"?"○":r==="sanggeuk"?"✕":"△";'
        'const tag=r==="sangsaeng"?"생":r==="sanggeuk"?"극":"비";'
        'const col=r==="sangsaeng"?"#166534":r==="sanggeuk"?"#991b1b":"#a16207";'
        'const up=bo===0;'
        'const ar=up?(d==="top_gives"||d==="top_takes"?"→":d==="me_gives_up"||d==="me_fights_up"?"←":"↔"):(d==="me_gives_down"||d==="me_takes"?"→":d==="down_drains"||d==="down_fights"?"←":"↔");'
        'mark=m.jsxs("span",{style:{position:"absolute",right:0,top:"50%",transform:"translate(50%,-50%)",zIndex:2,display:"inline-flex",flexDirection:"column",alignItems:"center",lineHeight:1.05,background:"#fffdf5",padding:"0 2px"},children:['
        'm.jsxs("span",{style:{color:col,fontSize:"18px",fontWeight:900},children:[lab,ar]}),'
        'm.jsx("span",{style:{color:col,fontSize:"11px",fontWeight:800},children:tag})'
        ']})}'
        'return m.jsxs("td",{"data-loc":"client/src/pages/Home.tsx:' + td_loc + '",colSpan:bo===2?2:1,className:"text-center",style:{padding:"6px 2px",verticalAlign:"middle",position:"relative",overflow:"visible"},children:['
        'm.jsx("span",{style:{color:cm[el]||"#9ca3af",fontSize:"18px",fontWeight:800,display:"inline-block"},children:el||"?"}),'
        'mark'
        ']},"' + key_prefix + '-"+bo)'
        '})]}),'
    )

new_hg = make_row("ohangRow", "ohangLab", "ohangHg", "K", "W", "_", "K[0]", "K[1]", "K[1]", "K[2]", "hg-oh")
new_hj = make_row("hjOhang", "hjOhangLab", "hjOhangTd", "hjO", "L", "eo", "hjO[0]", "hjO[1]", "hjO[1]", "hjO[2]", "hj-oh")

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
    Path(r"C:\Users\a8071\Projects\nameanalyz\_kw5_snips\ohang_align_fail.txt").write_text(new_hg, encoding="utf-8")
else:
    print("OK aligned")
