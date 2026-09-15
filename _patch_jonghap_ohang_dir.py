# -*- coding: utf-8 -*-
import sys
import subprocess
from pathlib import Path
sys.stdout.reconfigure(encoding="utf-8")

p = Path(r"C:\Users\a8071\Projects\nameanalyz\assets\index-kw5.js")
kw = p.read_text(encoding="utf-8")

# Shared cell builder pattern for 3 ohang + 생/극/비 + small arrow
# Hangul row
old_hg = (
    'm.jsxs("tr",{"data-loc":"client/src/pages/Home.tsx:ohangRow",style:{borderBottom:"1px solid #e5e7eb"},children:['
    'm.jsx("td",{"data-loc":"client/src/pages/Home.tsx:ohangLab",className:"pr-1 font-bold text-right whitespace-nowrap",style:{color:"#92400e",width:"3rem",padding:"1px 2px 1px 0"},children:"오행"}),'
    'ro.map((ho,bo)=>{const el=K[bo],col=el?{木:"#166534",火:"#991b1b",土:"#92400e",金:"#374151",水:"#1e3a8a"}[el]||"#374151":"#9ca3af";'
    'return m.jsx("td",{"data-loc":"client/src/pages/Home.tsx:ohangHg",colSpan:bo===2?2:1,className:"text-center font-bold",style:{color:col,fontSize:"11px",padding:"1px 2px"},children:el||"?"},`hg-ohang-${bo}`)})]}),'
)

new_hg = (
    'm.jsxs("tr",{"data-loc":"client/src/pages/Home.tsx:ohangRow",style:{borderBottom:"1px solid #e5e7eb"},children:['
    'm.jsx("td",{"data-loc":"client/src/pages/Home.tsx:ohangLab",className:"pr-1 font-bold text-right whitespace-nowrap",style:{color:"#92400e",width:"3rem",padding:"1px 2px 1px 0"},children:"오행"}),'
    'm.jsx("td",{"data-loc":"client/src/pages/Home.tsx:ohangHg",colSpan:4,className:"text-center",style:{padding:"1px 2px"},children:'
    'm.jsx("div",{className:"flex items-center justify-center gap-1",children:K.map((el,bo)=>{const col=el?{木:"#166534",火:"#991b1b",土:"#92400e",金:"#374151",水:"#1e3a8a"}[el]||"#374151":"#9ca3af";'
    'return m.jsxs("span",{className:"inline-flex items-center gap-0.5",children:['
    'm.jsx("span",{style:{color:col,fontSize:"11px",fontWeight:700},children:el||"?"}),'
    'bo<2&&(()=>{const r=bo===0?W:_,lab=r==="sangsaeng"?"생":r==="sanggeuk"?"극":"비",'
    'rc=r==="sangsaeng"?"#166534":r==="sanggeuk"?"#991b1b":"#78350f",'
    'd=bo===0?Hd(K[0],K[1]):fd(K[1],K[2]),'
    'ar=bo===0?(d==="top_gives"||d==="top_takes"?"→":d==="me_gives_up"||d==="me_fights_up"?"←":""):(d==="me_gives_down"||d==="me_takes"?"→":d==="down_drains"||d==="down_fights"?"←":"");'
    'return m.jsxs("span",{style:{color:rc,fontSize:"10px",fontWeight:700,margin:"0 2px",whiteSpace:"nowrap"},children:[lab,ar&&m.jsx("span",{style:{fontSize:"8px",marginLeft:"1px",fontWeight:700},children:ar})]})})()'
    ']},`hg-oh-${bo}`)})})})]}),'
)

old_hj = (
    'm.jsxs("tr",{"data-loc":"client/src/pages/Home.tsx:hjOhang",style:{borderBottom:"1px solid #e5e7eb"},children:['
    'm.jsx("td",{"data-loc":"client/src/pages/Home.tsx:hjOhangLab",className:"pr-1 font-bold text-right whitespace-nowrap",style:{color:"#92400e",width:"3rem",padding:"1px 2px 1px 0"},children:"오행"}),'
    'ro.map((ho,bo)=>{const el=hjO[bo],col=el?{木:"#166534",火:"#991b1b",土:"#92400e",金:"#374151",水:"#1e3a8a"}[el]||"#374151":"#9ca3af";'
    'return m.jsx("td",{"data-loc":"client/src/pages/Home.tsx:hjOhangTd",colSpan:bo===2?2:1,className:"text-center font-bold",style:{color:col,fontSize:"11px",padding:"1px 2px"},children:el||"?"},`hj-ohang-${bo}`)})]}),'
)

new_hj = (
    'm.jsxs("tr",{"data-loc":"client/src/pages/Home.tsx:hjOhang",style:{borderBottom:"1px solid #e5e7eb"},children:['
    'm.jsx("td",{"data-loc":"client/src/pages/Home.tsx:hjOhangLab",className:"pr-1 font-bold text-right whitespace-nowrap",style:{color:"#92400e",width:"3rem",padding:"1px 2px 1px 0"},children:"오행"}),'
    'm.jsx("td",{"data-loc":"client/src/pages/Home.tsx:hjOhangTd",colSpan:4,className:"text-center",style:{padding:"1px 2px"},children:'
    'm.jsx("div",{className:"flex items-center justify-center gap-1",children:hjO.map((el,bo)=>{const col=el?{木:"#166534",火:"#991b1b",土:"#92400e",金:"#374151",水:"#1e3a8a"}[el]||"#374151":"#9ca3af";'
    'return m.jsxs("span",{className:"inline-flex items-center gap-0.5",children:['
    'm.jsx("span",{style:{color:col,fontSize:"11px",fontWeight:700},children:el||"?"}),'
    'bo<2&&(()=>{const r=bo===0?L:eo,lab=r==="sangsaeng"?"생":r==="sanggeuk"?"극":"비",'
    'rc=r==="sangsaeng"?"#166534":r==="sanggeuk"?"#991b1b":"#78350f",'
    'd=bo===0?Hd(hjO[0],hjO[1]):fd(hjO[1],hjO[2]),'
    'ar=bo===0?(d==="top_gives"||d==="top_takes"?"→":d==="me_gives_up"||d==="me_fights_up"?"←":""):(d==="me_gives_down"||d==="me_takes"?"→":d==="down_drains"||d==="down_fights"?"←":"");'
    'return m.jsxs("span",{style:{color:rc,fontSize:"10px",fontWeight:700,margin:"0 2px",whiteSpace:"nowrap"},children:[lab,ar&&m.jsx("span",{style:{fontSize:"8px",marginLeft:"1px",fontWeight:700},children:ar})]})})()'
    ']},`hj-oh-${bo}`)})})})]}),'
)

if old_hg not in kw:
    j = kw.find("Home.tsx:ohangRow")
    Path(r"C:\Users\a8071\Projects\nameanalyz\_kw5_snips\ohang_row_miss.txt").write_text(kw[j:j+600], encoding="utf-8")
    raise SystemExit("hg miss")
if old_hj not in kw:
    j = kw.find("Home.tsx:hjOhang")
    Path(r"C:\Users\a8071\Projects\nameanalyz\_kw5_snips\hj_ohang_miss.txt").write_text(kw[j:j+600], encoding="utf-8")
    raise SystemExit("hj miss")

kw = kw.replace(old_hg, new_hg, 1).replace(old_hj, new_hj, 1)

# Also upgrade 오행명 row (1044) to include small arrows next to 생/극/비
old1044 = (
    'bo<ro.length-1&&(()=>{const r=bo===0?W:_;const lab=r==="sangsaeng"?"생":r==="sanggeuk"?"극":"비";'
    'const col=r==="sangsaeng"?"#166534":r==="sanggeuk"?"#991b1b":"#78350f";'
    'return m.jsx("span",{"data-loc":"client/src/pages/Home.tsx:1044",style:{color:col,fontSize:"10px",fontWeight:700},children:lab})})()'
)
new1044 = (
    'bo<ro.length-1&&(()=>{const r=bo===0?W:_,lab=r==="sangsaeng"?"생":r==="sanggeuk"?"극":"비",'
    'col=r==="sangsaeng"?"#166534":r==="sanggeuk"?"#991b1b":"#78350f",'
    'd=bo===0?Hd(K[0],K[1]):fd(K[1],K[2]),'
    'ar=bo===0?(d==="top_gives"||d==="top_takes"?"→":d==="me_gives_up"||d==="me_fights_up"?"←":""):(d==="me_gives_down"||d==="me_takes"?"→":d==="down_drains"||d==="down_fights"?"←":"");'
    'return m.jsxs("span",{"data-loc":"client/src/pages/Home.tsx:1044",style:{color:col,fontSize:"10px",fontWeight:700,whiteSpace:"nowrap"},children:[lab,ar&&m.jsx("span",{style:{fontSize:"8px",marginLeft:"1px"},children:ar})]})})()'
)
if old1044 in kw:
    kw = kw.replace(old1044, new1044, 1)
    print("1044 ok")
else:
    print("1044 skip")

# hanja 오행명 side ~1063
old1063 = (
    'bo<2&&(()=>{const r=bo===0?L:eo;const lab=r==="sangsaeng"?"생":r==="sanggeuk"?"극":"비";'
    'const col=r==="sangsaeng"?"#166534":r==="sanggeuk"?"#991b1b":"#78350f";'
    'return m.jsx("span",{"data-loc":"client/src/pages/Home.tsx:1063"'
)
# find exact
i = kw.find('Home.tsx:1063"')
if i > 0:
    Path(r"C:\Users\a8071\Projects\nameanalyz\_kw5_snips\ohang_1063.txt").write_text(kw[i-200:i+250], encoding="utf-8")
    print("1063 ctx written")

# Try common pattern for hj side
old_hj_nm = (
    'bo<2&&(()=>{const r=bo===0?L:eo;const lab=r==="sangsaeng"?"생":r==="sanggeuk"?"극":"비";'
    'const col=r==="sangsaeng"?"#166534":r==="sanggeuk"?"#991b1b":"#78350f";'
    'return m.jsx("span",{"data-loc":"client/src/pages/Home.tsx:1063",style:{color:col,fontSize:"10px",fontWeight:700},children:lab})})()'
)
new_hj_nm = (
    'bo<2&&(()=>{const r=bo===0?L:eo,lab=r==="sangsaeng"?"생":r==="sanggeuk"?"극":"비",'
    'col=r==="sangsaeng"?"#166534":r==="sanggeuk"?"#991b1b":"#78350f",'
    'd=bo===0?Hd(hjO[0],hjO[1]):fd(hjO[1],hjO[2]),'
    'ar=bo===0?(d==="top_gives"||d==="top_takes"?"→":d==="me_gives_up"||d==="me_fights_up"?"←":""):(d==="me_gives_down"||d==="me_takes"?"→":d==="down_drains"||d==="down_fights"?"←":"");'
    'return m.jsxs("span",{"data-loc":"client/src/pages/Home.tsx:1063",style:{color:col,fontSize:"10px",fontWeight:700,whiteSpace:"nowrap"},children:[lab,ar&&m.jsx("span",{style:{fontSize:"8px",marginLeft:"1px"},children:ar})]})})()'
)
if old_hj_nm in kw:
    kw = kw.replace(old_hj_nm, new_hj_nm, 1)
    print("1063 ok")
else:
    print("1063 skip")

p.write_text(kw, encoding="utf-8")
r = subprocess.run(["node", "--check", str(p)], capture_output=True)
print("syntax", r.returncode)
if r.returncode:
    print(r.stderr.decode("utf-8", errors="replace")[-500:])
else:
    print("OK", "hg-oh-" in kw, 'lab,ar&&m.jsx' in kw or "lab,ar&&" in kw)
