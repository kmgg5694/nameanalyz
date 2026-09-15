# -*- coding: utf-8 -*-
import sys
import subprocess
from pathlib import Path
sys.stdout.reconfigure(encoding="utf-8")

p = Path(r"C:\Users\a8071\Projects\nameanalyz\assets\index-kw5.js")
kw = p.read_text(encoding="utf-8")

def make_row(tr_loc, lab_loc, td_loc, arr_expr, r0, r1, key_prefix, a0, a1, b0, b1):
    # key as third arg to m.jsxs — use string concat to avoid template literal issues
    return (
        'm.jsxs("tr",{"data-loc":"client/src/pages/Home.tsx:' + tr_loc + '",style:{borderBottom:"1px solid #e5e7eb"},children:['
        'm.jsx("td",{"data-loc":"client/src/pages/Home.tsx:' + lab_loc + '",className:"pr-1 font-bold text-right whitespace-nowrap",style:{color:"#92400e",width:"3rem",padding:"1px 2px 1px 0"},children:"오행"}),'
        + arr_expr + '.map((el,bo)=>{const col=el?{木:"#166534",火:"#991b1b",土:"#92400e",金:"#374151",水:"#1e3a8a"}[el]||"#374151":"#9ca3af";'
        "const r=bo<2?(bo===0?" + r0 + ":" + r1 + "):null;"
        'const lab=r==null?null:r==="sangsaeng"?"○":r==="sanggeuk"?"✕":"△";'
        'const rc=r==null?null:r==="sangsaeng"?"#166534":r==="sanggeuk"?"#991b1b":"#78350f";'
        "const d=bo===0?Hd(" + a0 + "," + a1 + "):bo===1?fd(" + b0 + "," + b1 + "):null;"
        'const ar=d==null?"":bo===0?(d==="top_gives"||d==="top_takes"?"→":d==="me_gives_up"||d==="me_fights_up"?"←":"·"):(d==="me_gives_down"||d==="me_takes"?"→":d==="down_drains"||d==="down_fights"?"←":"·");'
        'const tag=r==null?"":r==="sangsaeng"?"생":r==="sanggeuk"?"극":"비";'
        'return m.jsxs("td",{"data-loc":"client/src/pages/Home.tsx:' + td_loc + '",colSpan:bo===2?2:1,className:"text-center",style:{padding:"2px 1px",verticalAlign:"middle"},children:['
        'm.jsx("span",{style:{color:col,fontSize:"13px",fontWeight:700},children:el||"?"}),'
        'lab?m.jsxs("span",{style:{display:"inline-block",marginLeft:"3px",color:rc,fontSize:"11px",fontWeight:800,whiteSpace:"nowrap"},children:[lab,ar,m.jsx("span",{style:{fontSize:"8px",marginLeft:"1px"},children:tag})]}):null'
        ']},"' + key_prefix + '-"+bo)})]}),'
    )

new_hg = make_row("ohangRow", "ohangLab", "ohangHg", "K", "W", "_", "hg-ohang", "K[0]", "K[1]", "K[1]", "K[2]")
new_hj = make_row("hjOhang", "hjOhangLab", "hjOhangTd", "hjO", "L", "eo", "hj-ohang", "hjO[0]", "hjO[1]", "hjO[1]", "hjO[2]")

i = kw.find('m.jsxs("tr",{"data-loc":"client/src/pages/Home.tsx:ohangRow"')
j = kw.find('m.jsxs("tr",{"data-loc":"client/src/pages/Home.tsx:856"', i)
if i < 0 or j < 0:
    raise SystemExit("hg bounds %s %s" % (i, j))
kw = kw[:i] + new_hg + kw[j:]

i2 = kw.find('m.jsxs("tr",{"data-loc":"client/src/pages/Home.tsx:hjOhang"')
j2 = kw.find('m.jsxs("tr",{"data-loc":"client/src/pages/Home.tsx:hjStroke"', i2)
if i2 < 0 or j2 < 0:
    raise SystemExit("hj bounds %s %s" % (i2, j2))
kw = kw[:i2] + new_hj + kw[j2:]

p.write_text(kw, encoding="utf-8")
r = subprocess.run(["node", "--check", str(p)], capture_output=True)
print("syntax", r.returncode)
if r.returncode:
    print(r.stderr.decode("utf-8", errors="replace")[-500:])
else:
    print("OK")
    print(new_hg[new_hg.find("return m.jsxs"):new_hg.find("return m.jsxs") + 280])
