# -*- coding: utf-8 -*-
"""Revert font-size shrinks; keep only vertical padding/gap reductions."""
from pathlib import Path
import sys
sys.stdout.reconfigure(encoding="utf-8")

p = Path(r"C:\Users\a8071\Projects\nameanalyz\assets\index-kw5.js")
kw = p.read_text(encoding="utf-8")

# Bounds: 종합표 hangul through before 요약보기 IIFE
a = kw.find('m.jsx("div",{"data-loc":"client/src/pages/Home.tsx:822"')
b = kw.find(',(()=>{const ho=vo=>vo==="taboo"', a)
if a < 0 or b < 0:
    raise SystemExit(f"bounds {a},{b}")

block = kw[a:b]

# Restore font sizes that were shrunk; keep tight padding
reps = [
    # titles: keep py-1 but restore 13px if we had 12px
    (
        'className:"py-1 text-center font-bold",style:{color:"#92400e",fontSize:"12px",letterSpacing:"1px"},children:"한글이름풀이"',
        'className:"py-1 text-center font-bold",style:{color:"#92400e",fontSize:"13px",letterSpacing:"1px",padding:"4px 0"},children:"한글이름풀이"',
    ),
    (
        'className:"py-1 text-center font-bold",style:{color:"#92400e",fontSize:"12px",letterSpacing:"1px"},children:"한문이름풀이"',
        'className:"py-1 text-center font-bold",style:{color:"#92400e",fontSize:"13px",letterSpacing:"1px",padding:"4px 0"},children:"한문이름풀이"',
    ),
    # labels: remove fontSize:11px shrink, keep padding only
    (
        'style:{color:"#92400e",width:"2.6rem",padding:"2px 1px",fontSize:"11px"},children:"이름"',
        'style:{color:"#92400e",width:"3rem",padding:"2px 2px 2px 0"},children:"이름"',
    ),
    (
        'style:{color:"#92400e",width:"2.6rem",padding:"1px",fontSize:"11px"},children:"오행"',
        'style:{color:"#92400e",width:"3rem",padding:"1px 2px 1px 0"},children:"오행"',
    ),
    (
        'style:{color:"#92400e",width:"2.6rem",padding:"1px",fontSize:"11px"},children:"획수"',
        'style:{color:"#92400e",width:"3rem",padding:"1px 2px 1px 0"},children:"획수"',
    ),
    (
        'style:{color:"#92400e",padding:"1px 2px 1px 0",fontSize:"11px",lineHeight:1.1},children:"수리"',
        'style:{color:"#92400e",padding:"1px 2px 1px 0",lineHeight:1.15},children:"수리"',
    ),
    (
        'style:{color:"#92400e",padding:"1px 2px 1px 0",fontSize:"11px",lineHeight:1.1},children:"수리뜻"',
        'style:{color:"#92400e",padding:"0px 2px 0px 0",lineHeight:1.15},children:"수리뜻"',
    ),
    (
        'style:{color:"#92400e",padding:"1px 2px 1px 0",fontSize:"11px",lineHeight:1.1},children:"연령대"',
        'style:{color:"#92400e",padding:"0px 2px 0px 0",lineHeight:1.1},children:"연령대"',
    ),
    (
        'style:{color:"#92400e",padding:"1px 2px 1px 0",fontSize:"11px",lineHeight:1.1},children:"주역"',
        'style:{color:"#92400e",padding:"0px 2px 0px 0",lineHeight:1.15},children:"주역"',
    ),
    # suri number: restore ~default size, keep padding
    (
        'style:{color:Eo(ho.data.type),padding:"1px",fontSize:"12px",lineHeight:1.1},children:ho.suri}',
        'style:{color:Eo(ho.data.type),padding:"1px 2px",lineHeight:1.15},children:ho.suri}',
    ),
    # 수리뜻: restore 10px, tight vertical only
    (
        'style:{color:Eo(ho.data.type),fontSize:"9px",lineHeight:1.05,whiteSpace:"nowrap",padding:"0px 1px"}',
        'style:{color:Eo(ho.data.type),fontSize:"10px",lineHeight:1.15,whiteSpace:"nowrap",padding:"0px 2px"}',
    ),
    # 연령대: restore 10px
    (
        'style:{color:"#78350f",fontSize:"8px",padding:"0px 1px",lineHeight:1},children:ho}',
        'style:{color:"#78350f",fontSize:"10px",padding:"0px 2px",lineHeight:1.1},children:ho}',
    ),
    # 주역: restore 10px
    (
        'style:{color:Go(ho.gwe),fontSize:"9px",lineHeight:1.05,whiteSpace:"nowrap",padding:"0px 1px"}',
        'style:{color:Go(ho.gwe),fontSize:"10px",lineHeight:1.15,whiteSpace:"nowrap",padding:"0px 2px"}',
    ),
    # 오행 data
    (
        'style:{color:col,fontSize:"11px",padding:"1px"},children:el||"?"}',
        'style:{color:col,fontSize:"11px",padding:"1px 2px"},children:el||"?"}',
    ),
    # 획수 hangul
    (
        'style:{color:"#374151",fontSize:"10px",fontWeight:600,padding:"1px"},children:x[bo]>0',
        'style:{color:"#374151",fontSize:"11px",fontWeight:600,padding:"1px 2px"},children:x[bo]>0',
    ),
    # 획수 hanja
    (
        'style:{color:po?"#b45309":"#374151",fontSize:"10px",fontWeight:600,padding:"1px"},children:Wo>0',
        'style:{color:po?"#b45309":"#374151",fontSize:"11px",fontWeight:600,padding:"1px 2px"},children:Wo>0',
    ),
    # name cell
    (
        'style:{color:"#1c1917",padding:"2px 1px"},children:ho},`hg-name-${bo}`)',
        'style:{color:"#1c1917",padding:"2px"},children:ho},`hg-name-${bo}`)',
    ),
]

for old, new in reps:
    n = block.count(old)
    if n == 0:
        print("MISS", old[:60])
    else:
        block = block.replace(old, new)
        print("OK", n, old[20:50] if len(old)>50 else old)

kw2 = kw[:a] + block + kw[b:]

# 요약보기: restore font 9->10, keep vertical padding tight; restore labels without smaller font
sum_a = kw2.find('Home.tsx:1136"')
sum_b = kw2.find('Home.tsx:1172"', sum_a)
sblock = kw2[sum_a:sum_b]
sreps = [
    (
        'fontSize:"9px",lineHeight:1.05,whiteSpace:"nowrap",padding:"1px 0"',
        'fontSize:"10px",lineHeight:1.15,whiteSpace:"nowrap",padding:"1px 0"',
    ),
    (
        'style:{color:"#92400e",padding:"1px 2px 1px 0",fontSize:"11px"},children:"한글수리"',
        'style:{color:"#92400e",padding:"1px 2px 1px 0"},children:"한글수리"',
    ),
    (
        'style:{color:"#92400e",padding:"1px 2px 1px 0",fontSize:"11px"},children:"한글주역"',
        'style:{color:"#92400e",padding:"1px 2px 1px 0"},children:"한글주역"',
    ),
    (
        'style:{color:"#92400e",padding:"1px 2px 1px 0",fontSize:"11px"},children:"한문수리"',
        'style:{color:"#92400e",padding:"1px 2px 1px 0"},children:"한문수리"',
    ),
    (
        'style:{color:"#92400e",padding:"1px 2px 1px 0",fontSize:"11px"},children:"한문주역"',
        'style:{color:"#92400e",padding:"1px 2px 1px 0"},children:"한문주역"',
    ),
]
for old, new in sreps:
    n = sblock.count(old)
    print("sum", n, old[:40])
    sblock = sblock.replace(old, new)
kw2 = kw2[:sum_a] + sblock + kw2[sum_b:]

# snBtn: keep minHeight 1.5em (vertical only) — ok; padding already 4px 0, reduce to 2px 0
if 'padding:"4px 0",margin:0,width:"100%",minHeight:"1.5em"' in kw2:
    kw2 = kw2.replace(
        'padding:"4px 0",margin:0,width:"100%",minHeight:"1.5em"',
        'padding:"2px 0",margin:0,width:"100%",minHeight:"1.35em"',
        1,
    )
    print("snBtn padding tightened")
elif 'padding:"4px 0",margin:0,width:"100%",minHeight:"2.4em"' in kw2:
    kw2 = kw2.replace(
        'padding:"4px 0",margin:0,width:"100%",minHeight:"2.4em"',
        'padding:"2px 0",margin:0,width:"100%",minHeight:"1.35em"',
        1,
    )
    print("snBtn from 2.4em")
else:
    print("snBtn pattern miss", kw2.count("minHeight:"))

p.write_text(kw2, encoding="utf-8")
print("done delta", len(kw2) - len(kw))
