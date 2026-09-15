# -*- coding: utf-8 -*-
"""Tighten 요약보기: 2-char labels, clear red/blue, add 탄생일 rows."""
from pathlib import Path
import subprocess
import sys

sys.stdout.reconfigure(encoding="utf-8")
p = Path(r"C:\Users\a8071\Projects\nameanalyz\assets\index-kw5.js")
kw = p.read_text(encoding="utf-8")

a = kw.find("snBtn=(ttl,bdy,col,kids)=>")
a = kw.rfind('(()=>{const ho=vo=>vo==="taboo"', 0, a)
b = kw.find('Home.tsx:1172"', a) + len('Home.tsx:1172"')
if a < 0 or b < len('Home.tsx:1172"'):
    raise SystemExit(f"bounds {a},{b}")
block = kw[a:b]

# colors: vivid red/blue + best blue for suri types
old_c = 'const ho=vo=>vo==="taboo"||vo==="bad"||vo==="caution"?"#cc0000":"#1c1917",bo=vo=>vo?vo.isTaboo?"#cc0000":vo.isBest?"#1a56db":"#1c1917":"#1c1917"'
new_c = 'const ho=vo=>vo==="taboo"||vo==="bad"||vo==="caution"?"#FF0000":vo==="best"?"#0000FF":"#1c1917",bo=vo=>vo?vo.isTaboo?"#FF0000":vo.isBest?"#0000FF":"#1c1917":"#1c1917"'
if old_c not in block:
    raise SystemExit("color miss")
block = block.replace(old_c, new_c, 1)

old_suri_kids = (
    'fmtNm(vo.data.name).map((nm,ii)=>m.jsx("span",{style:{display:"block",whiteSpace:"nowrap",'
    'textDecoration:"underline",textUnderlineOffset:"2px"},children:nm},ii))'
)
new_suri_kids = (
    '(String(vo.data.name||"").replace(/\\([^)]*\\)/g,"").replace(/\\s+/g,"").slice(0,2)||"-")'
)
if block.count(old_suri_kids) < 2:
    raise SystemExit("suri kids")
block = block.replace(old_suri_kids, new_suri_kids)

old_gwe_kids = (
    'wrap2(vo.gwe.name).map((nm,ii)=>m.jsx("span",{style:{display:"block",whiteSpace:"nowrap",'
    'textDecoration:"underline",textUnderlineOffset:"2px"},children:nm},ii))'
)
new_gwe_kids = '(String(vo.gwe.name||"").replace(/\\s+/g,"").slice(0,2)||"-")'
if block.count(old_gwe_kids) < 2:
    raise SystemExit("gwe kids")
block = block.replace(old_gwe_kids, new_gwe_kids)

# compact cells
block = block.replace(
    'fontSize:"10px",lineHeight:1.15,whiteSpace:"nowrap",padding:"1px 0"',
    'fontSize:"11px",lineHeight:1.05,whiteSpace:"nowrap",padding:"0px 1px"',
)
for lab in ("한글수리", "한글주역", "한문수리", "한문주역"):
    block = block.replace(
        f'style:{{color:"#92400e",padding:"1px 2px 1px 0"}},children:"{lab}"',
        f'style:{{color:"#92400e",padding:"0px 2px 0px 0",fontSize:"11px"}},children:"{lab}"',
    )

block = block.replace(
    'padding:"2px 0",margin:0,width:"100%",minHeight:"1.35em"',
    'padding:"0px 0",margin:0,width:"100%",minHeight:"1.1em"',
    1,
)

# header 원형이정 → short
for full, short in (("원(元)", "원"), ("형(亨)", "형"), ("이(利)", "이"), ("정(貞)", "정")):
    block = block.replace(
        f'className:"py-1 text-center font-bold",style:{{color:"#78350f"}},children:"{full}"',
        f'className:"text-center font-bold",style:{{color:"#78350f",padding:"1px 0",fontSize:"11px"}},children:"{short}"',
    )

# Insert birth rows as two sibling tr after 한문주역
old_end = (
    'style:{color:"#aaa"},children:"미입력"},Xo))]})]})]})}),m.jsx("div",{"data-loc":"client/src/pages/Home.tsx:1172"'
)
new_end = (
    'style:{color:"#aaa"},children:"미입력"},Xo))]}),'
    'birthSuri&&bW&&bH&&bI&&bJ&&m.jsxs("tr",{"data-loc":"client/src/pages/Home.tsx:bdSumSuri",'
    'style:{borderBottom:"1px solid #e5e7eb"},children:['
    'm.jsx("td",{className:"pr-1 font-bold whitespace-nowrap",style:{color:"#92400e",padding:"0px 2px 0px 0",fontSize:"11px"},children:"탄생수리"}),'
    '[bW,bH,bI,bJ].map((vo,Xo)=>m.jsxs("td",{className:"text-center font-bold",'
    'style:{color:ho(vo.data.type),fontSize:"11px",lineHeight:1.05,whiteSpace:"nowrap",padding:"0px 1px"},'
    'children:snBtn(vo.suri+"수 · "+String(vo.data.name||"").replace(/\\([^)]*\\)/g,""),vo.data.desc||vo.data.shortDesc||"",ho(vo.data.type),'
    '(String(vo.data.name||"").replace(/\\([^)]*\\)/g,"").replace(/\\s+/g,"").slice(0,2)||"-"))},Xo))]}),'
    'birthSuri&&bW&&bH&&bI&&bJ&&m.jsxs("tr",{"data-loc":"client/src/pages/Home.tsx:bdSumGwe",'
    'style:{borderBottom:"1px solid #e5e7eb"},children:['
    'm.jsx("td",{className:"pr-1 font-bold whitespace-nowrap",style:{color:"#92400e",padding:"0px 2px 0px 0",fontSize:"11px"},children:"탄생주역"}),'
    '[bW,bH,bI,bJ].map((vo,Xo)=>vo?.gwe?m.jsxs("td",{className:"text-center font-bold",'
    'style:{color:bo(vo.gwe),fontSize:"11px",lineHeight:1.05,whiteSpace:"nowrap",padding:"0px 1px"},'
    'children:snBtn(vo.gwe.name,vo.gwe.desc||"",bo(vo.gwe),(String(vo.gwe.name||"").replace(/\\s+/g,"").slice(0,2)||"-"))},Xo):'
    'm.jsx("td",{className:"text-center font-bold",style:{color:"#aaa"},children:"-"},Xo))]} )'
    ']})]})}),m.jsx("div",{"data-loc":"client/src/pages/Home.tsx:1172"'
)
new_end = new_end.replace("]} )", "]})")

if old_end not in block:
    i = block.find("1172")
    print(repr(block[i - 100 : i + 30]))
    raise SystemExit("end miss")
block = block.replace(old_end, new_end, 1)

kw2 = kw[:a] + block + kw[b:]
p.write_text(kw2, encoding="utf-8")
r = subprocess.run(["node", "--check", str(p)], capture_output=True)
print("syntax", r.returncode)
if r.returncode:
    print(r.stderr.decode("utf-8", errors="replace")[-400:])
    # show around 탄생
    t = kw2
    i = t.find("탄생수리")
    print(repr(t[i - 80 : i + 120]))
else:
    print("OK 탄생수리", kw2.find("탄생수리"), "FF0000", block.count("#FF0000"), "slice", block.count("slice(0,2)"))
