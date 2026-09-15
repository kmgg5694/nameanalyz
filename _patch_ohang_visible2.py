# -*- coding: utf-8 -*-
import sys
import subprocess
from pathlib import Path
sys.stdout.reconfigure(encoding="utf-8")

p = Path(r"C:\Users\a8071\Projects\nameanalyz\assets\index-kw5.js")
kw = p.read_text(encoding="utf-8")

# Fix broken closing: children:tag})])  → children:tag})]})
# find ohang rows and rewrite cleanly
def make_row(tr_loc, lab_loc, td_loc, arr_expr, r0, r1, key_prefix, hd0, hd1, fd0, fd1):
    # arr_expr e.g. K or hjO
    return (
        f'm.jsxs("tr",{{"data-loc":"client/src/pages/Home.tsx:{tr_loc}",style:{{borderBottom:"1px solid #e5e7eb"}},children:['
        f'm.jsx("td",{{"data-loc":"client/src/pages/Home.tsx:{lab_loc}",className:"pr-1 font-bold text-right whitespace-nowrap",style:{{color:"#92400e",width:"3rem",padding:"1px 2px 1px 0"}},children:"오행"}}),'
        f'{arr_expr}.map((el,bo)=>{{const col=el?{{木:"#166534",火:"#991b1b",土:"#92400e",金:"#374151",水:"#1e3a8a"}}[el]||"#374151":"#9ca3af";'
        f'const r=bo<2?(bo===0?{r0}:{r1}):null;'
        f'const lab=r==null?null:r==="sangsaeng"?"○":r==="sanggeuk"?"✕":"△";'
        f'const rc=r==null?null:r==="sangsaeng"?"#166534":r==="sanggeuk"?"#991b1b":"#78350f";'
        f'const d=bo===0?Hd({hd0},{hd1}):bo===1?fd({fd0},{fd1}):null;'
        f'const ar=d==null?"":bo===0?(d==="top_gives"||d==="top_takes"?"→":d==="me_gives_up"||d==="me_fights_up"?"←":"·"):(d==="me_gives_down"||d==="me_takes"?"→":d==="down_drains"||d==="down_fights"?"←":"·");'
        f'const tag=r==null?"":r==="sangsaeng"?"생":r==="sanggeuk"?"극":"비";'
        f'return m.jsxs("td",{{"data-loc":"client/src/pages/Home.tsx:{td_loc}",colSpan:bo===2?2:1,className:"text-center",style:{{padding:"2px 1px",verticalAlign:"middle"}},children:['
        f'm.jsx("span",{{style:{{color:col,fontSize:"13px",fontWeight:700}},children:el||"?"}}),'
        f'lab?m.jsxs("span",{{style:{{display:"inline-block",marginLeft:"3px",color:rc,fontSize:"11px",fontWeight:800,whiteSpace:"nowrap"}},children:[lab,ar,m.jsx("span",{{style:{{fontSize:"8px",marginLeft:"1px"}},children:tag}})]}):null'
        f']}},`{key_prefix}-${{bo}}`)}})]}}),'
    )

new_hg = make_row("ohangRow", "ohangLab", "ohangHg", "K", "W", "_", "hg-ohang", "K[0]", "K[1]", "K[1]", "K[2]")
new_hj = make_row("hjOhang", "hjOhangLab", "hjOhangTd", "hjO", "L", "eo", "hj-ohang", "hjO[0]", "hjO[1]", "hjO[1]", "hjO[2]")

i = kw.find('m.jsxs("tr",{"data-loc":"client/src/pages/Home.tsx:ohangRow"')
j = kw.find('m.jsxs("tr",{"data-loc":"client/src/pages/Home.tsx:856"', i)
print("hg", i, j, j-i)
kw = kw[:i] + new_hg + kw[j:]

i2 = kw.find('m.jsxs("tr",{"data-loc":"client/src/pages/Home.tsx:hjOhang"')
j2 = kw.find('m.jsxs("tr",{"data-loc":"client/src/pages/Home.tsx:hjStroke"', i2)
print("hj", i2, j2, j2-i2)
kw = kw[:i2] + new_hj + kw[j2:]

p.write_text(kw, encoding="utf-8")
r = subprocess.run(["node", "--check", str(p)], capture_output=True)
print("syntax", r.returncode)
if r.returncode:
    err = r.stderr.decode("utf-8", errors="replace")
    print(err[-600:])
    # extract around error if possible
else:
    print("OK")
    Path(r"C:\Users\a8071\Projects\nameanalyz\_kw5_snips\ohang_fixed.txt").write_text(
        kw[kw.find("ohangRow"):kw.find("ohangRow")+900], encoding="utf-8"
    )
