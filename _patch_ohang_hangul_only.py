# -*- coding: utf-8 -*-
"""오행: 생/극/비 한글만 + 화살표, 이름열 비율(1:1:2) 그리드 정렬."""
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
        'const mk=(r,d,up)=>{const tag=r==="sangsaeng"?"생":r==="sanggeuk"?"극":"비",col=r==="sangsaeng"?"#166534":r==="sanggeuk"?"#991b1b":"#a16207",ar=up?(d==="top_gives"||d==="top_takes"?"→":d==="me_gives_up"||d==="me_fights_up"?"←":"↔"):(d==="me_gives_down"||d==="me_takes"?"→":d==="down_drains"||d==="down_fights"?"←":"↔");'
        'return m.jsxs("div",{style:{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",lineHeight:1.1,minWidth:"1.8rem"},children:['
        'm.jsx("span",{style:{color:col,fontSize:"15px",fontWeight:900},children:tag}),'
        'm.jsx("span",{style:{color:col,fontSize:"14px",fontWeight:900,marginTop:"-1px"},children:ar})]'
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
if i < 0 or j < 0:
    raise SystemExit("hg %s %s" % (i, j))
kw = kw[:i] + new_hg + kw[j:]

i2 = kw.find('m.jsxs("tr",{"data-loc":"client/src/pages/Home.tsx:hjOhang"')
j2 = kw.find('m.jsxs("tr",{"data-loc":"client/src/pages/Home.tsx:hjStroke"', i2)
if i2 < 0 or j2 < 0:
    raise SystemExit("hj %s %s" % (i2, j2))
kw = kw[:i2] + new_hj + kw[j2:]

# Tn helper: ○ ✕ △ → 생 극 비
for old, new in [
    ('Tn=ho=>ho==="sangsaeng"?"○":ho==="sanggeuk"?"✕":"△"',
     'Tn=ho=>ho==="sangsaeng"?"생":ho==="sanggeuk"?"극":"비"'),
    ('Tn=ho=>ho==="sangsaeng"?"○":ho==="sanggeuk"?"✕":"상비"',
     'Tn=ho=>ho==="sangsaeng"?"생":ho==="sanggeuk"?"극":"비"'),
]:
    if old in kw:
        kw = kw.replace(old, new, 1)
        print("Tn updated")

# 오행명 row 1044/1063 if still using ○
kw = kw.replace('lab=r==="sangsaeng"?"○":r==="sanggeuk"?"✕":"△"', 'lab=r==="sangsaeng"?"생":r==="sanggeuk"?"극":"비"')
kw = kw.replace('const lab=r==="sangsaeng"?"○":r==="sanggeuk"?"✕":"△"', 'const lab=r==="sangsaeng"?"생":r==="sanggeuk"?"극":"비"')

# legend text if mentions ○(상생)
old_leg = '○(상생)은 서로 도움을 주고받는 좋은 관계, ✕(상극)은 서로 충돌하거나 막히는 관계, 상비는 같은 오행끼리(목목·화화·토토·금금·수수) 비슷하게 작용하는 관계입니다.'
new_leg = '생(상생)은 서로 도움을 주고받는 좋은 관계, 극(상극)은 서로 충돌하거나 막히는 관계, 비(상비)는 같은 오행끼리(목목·화화·토토·금금·수수) 비슷하게 작용하는 관계입니다.'
if old_leg in kw:
    kw = kw.replace(old_leg, new_leg, 1)
    print("legend updated")

p.write_text(kw, encoding="utf-8")
r = subprocess.run(["node", "--check", str(p)], capture_output=True)
print("syntax", r.returncode)
if r.returncode:
    print(r.stderr.decode("utf-8", errors="replace")[-500:])
else:
    print("OK")
    print("○ left in ohangRow", "○" in kw[kw.find("ohangRow"):kw.find("ohangRow")+800])
    print("생 in ohangRow", '"생"' in kw[kw.find("ohangRow"):kw.find("ohangRow")+800])
