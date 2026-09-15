# -*- coding: utf-8 -*-
"""종합표 오행: 이름 열 정렬 유지 + 글자 사이 ○/✕/△ + 화살표 확실히 표시."""
import sys
import subprocess
from pathlib import Path
sys.stdout.reconfigure(encoding="utf-8")

p = Path(r"C:\Users\a8071\Projects\nameanalyz\assets\index-kw5.js")
kw = p.read_text(encoding="utf-8")

# Replace hangul ohang row (current flex colspan version)
old_hg_start = 'm.jsxs("tr",{"data-loc":"client/src/pages/Home.tsx:ohangRow"'
i = kw.find(old_hg_start)
if i < 0:
    raise SystemExit("ohangRow miss")
# find end: next tr after this one starts with 획수 Home.tsx:856
j = kw.find('m.jsxs("tr",{"data-loc":"client/src/pages/Home.tsx:856"', i)
if j < 0:
    raise SystemExit("856 miss")
old_hg = kw[i:j]
print("old_hg len", len(old_hg))

new_hg = (
    'm.jsxs("tr",{"data-loc":"client/src/pages/Home.tsx:ohangRow",style:{borderBottom:"1px solid #e5e7eb"},children:['
    'm.jsx("td",{"data-loc":"client/src/pages/Home.tsx:ohangLab",className:"pr-1 font-bold text-right whitespace-nowrap",style:{color:"#92400e",width:"3rem",padding:"1px 2px 1px 0"},children:"오행"}),'
    'K.map((el,bo)=>{const col=el?{木:"#166534",火:"#991b1b",土:"#92400e",金:"#374151",水:"#1e3a8a"}[el]||"#374151":"#9ca3af";'
    'const r=bo<2?(bo===0?W:_):null;'
    'const lab=r==null?null:r==="sangsaeng"?"○":r==="sanggeuk"?"✕":"△";'
    'const rc=r==null?null:r==="sangsaeng"?"#166534":r==="sanggeuk"?"#991b1b":"#78350f";'
    'const d=bo===0?Hd(K[0],K[1]):bo===1?fd(K[1],K[2]):null;'
    'const ar=d==null?"":bo===0?(d==="top_gives"||d==="top_takes"?"→":d==="me_gives_up"||d==="me_fights_up"?"←":"·"):(d==="me_gives_down"||d==="me_takes"?"→":d==="down_drains"||d==="down_fights"?"←":"·");'
    'const tag=r==null?null:r==="sangsaeng"?"생":r==="sanggeuk"?"극":"비";'
    'return m.jsxs("td",{"data-loc":"client/src/pages/Home.tsx:ohangHg",colSpan:bo===2?2:1,className:"text-center font-bold",style:{padding:"2px 1px",verticalAlign:"middle"},children:['
    'm.jsx("span",{style:{color:col,fontSize:"13px",fontWeight:700},children:el||"?"}),'
    'lab&&m.jsxs("span",{style:{display:"inline-block",marginLeft:"3px",color:rc,fontSize:"11px",fontWeight:800,lineHeight:1,whiteSpace:"nowrap"},children:[lab,ar,m.jsx("span",{style:{fontSize:"8px",marginLeft:"1px",fontWeight:700},children:tag})])'
    ']},`hg-ohang-${bo}`)})]}),'
)

# Replace hanja ohang row
old_hj_start = 'm.jsxs("tr",{"data-loc":"client/src/pages/Home.tsx:hjOhang"'
i2 = kw.find(old_hj_start)
if i2 < 0:
    raise SystemExit("hjOhang miss")
j2 = kw.find('m.jsxs("tr",{"data-loc":"client/src/pages/Home.tsx:hjStroke"', i2)
if j2 < 0:
    raise SystemExit("hjStroke miss")
old_hj = kw[i2:j2]
print("old_hj len", len(old_hj))

new_hj = (
    'm.jsxs("tr",{"data-loc":"client/src/pages/Home.tsx:hjOhang",style:{borderBottom:"1px solid #e5e7eb"},children:['
    'm.jsx("td",{"data-loc":"client/src/pages/Home.tsx:hjOhangLab",className:"pr-1 font-bold text-right whitespace-nowrap",style:{color:"#92400e",width:"3rem",padding:"1px 2px 1px 0"},children:"오행"}),'
    'hjO.map((el,bo)=>{const col=el?{木:"#166534",火:"#991b1b",土:"#92400e",金:"#374151",水:"#1e3a8a"}[el]||"#374151":"#9ca3af";'
    'const r=bo<2?(bo===0?L:eo):null;'
    'const lab=r==null?null:r==="sangsaeng"?"○":r==="sanggeuk"?"✕":"△";'
    'const rc=r==null?null:r==="sangsaeng"?"#166534":r==="sanggeuk"?"#991b1b":"#78350f";'
    'const d=bo===0?Hd(hjO[0],hjO[1]):bo===1?fd(hjO[1],hjO[2]):null;'
    'const ar=d==null?"":bo===0?(d==="top_gives"||d==="top_takes"?"→":d==="me_gives_up"||d==="me_fights_up"?"←":"·"):(d==="me_gives_down"||d==="me_takes"?"→":d==="down_drains"||d==="down_fights"?"←":"·");'
    'const tag=r==null?null:r==="sangsaeng"?"생":r==="sanggeuk"?"극":"비";'
    'return m.jsxs("td",{"data-loc":"client/src/pages/Home.tsx:hjOhangTd",colSpan:bo===2?2:1,className:"text-center font-bold",style:{padding:"2px 1px",verticalAlign:"middle"},children:['
    'm.jsx("span",{style:{color:col,fontSize:"13px",fontWeight:700},children:el||"?"}),'
    'lab&&m.jsxs("span",{style:{display:"inline-block",marginLeft:"3px",color:rc,fontSize:"11px",fontWeight:800,lineHeight:1,whiteSpace:"nowrap"},children:[lab,ar,m.jsx("span",{style:{fontSize:"8px",marginLeft:"1px",fontWeight:700},children:tag})])'
    ']},`hj-ohang-${bo}`)})]}),'
)

kw = kw[:i] + new_hg + kw[j:]
# re-find hj after hg replace (length may change)
i2 = kw.find(old_hj_start)
j2 = kw.find('m.jsxs("tr",{"data-loc":"client/src/pages/Home.tsx:hjStroke"', i2)
kw = kw[:i2] + new_hj + kw[j2:]

p.write_text(kw, encoding="utf-8")
r = subprocess.run(["node", "--check", str(p)], capture_output=True)
print("syntax", r.returncode)
if r.returncode:
    print(r.stderr.decode("utf-8", errors="replace")[-500:])
else:
    print("OK", '"생"' in kw[kw.find("ohangRow"):kw.find("ohangRow")+800])
    # show sample for 김주혁 relations
    print("sample expect: 金△·생 金○←생 土 | 金✕→극 木○→생 火")
