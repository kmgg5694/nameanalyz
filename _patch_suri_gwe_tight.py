# -*- coding: utf-8 -*-
"""Tighten 수리/주역 spacing in 종합표 + 요약보기."""
from pathlib import Path
import sys
sys.stdout.reconfigure(encoding="utf-8")

p = Path(r"C:\Users\a8071\Projects\nameanalyz\assets\index-kw5.js")
kw = p.read_text(encoding="utf-8")

a = kw.find('children:"한글이름풀이"')
# start a bit earlier at the hangul overflow div
a = kw.rfind('m.jsx("div",{"data-loc":"client/src/pages/Home.tsx:822"', 0, a)
b = kw.find(',(()=>{const ho=vo=>vo==="taboo"', a)
if a < 0 or b < 0:
    raise SystemExit(f"bounds {a} {b}")

block = kw[a:b]
orig = block

def once(s, old, new, label):
    n = s.count(old)
    if n != 1:
        raise SystemExit(f"{label}: count={n}")
    return s.replace(old, new, 1)

# Title rows tighter
block = block.replace(
    'className:"py-2 text-center font-bold",style:{color:"#92400e",fontSize:"13px",letterSpacing:"1px"},children:"한글이름풀이"',
    'className:"py-1 text-center font-bold",style:{color:"#92400e",fontSize:"12px",letterSpacing:"1px"},children:"한글이름풀이"',
)
block = block.replace(
    'className:"py-2 text-center font-bold",style:{color:"#92400e",fontSize:"13px",letterSpacing:"1px"},children:"한문이름풀이"',
    'className:"py-1 text-center font-bold",style:{color:"#92400e",fontSize:"12px",letterSpacing:"1px"},children:"한문이름풀이"',
)

# Hanja wrap less gap
block = block.replace(
    'className:"overflow-x-auto",style:{marginTop:"14px"}',
    'className:"overflow-x-auto",style:{marginTop:"8px"}',
)

# Global py-1 -> compact padding in this block only for cells
# Careful: replace className py-1 patterns with tighter style padding
block = block.replace('className:"py-1 pr-2 font-bold text-right whitespace-nowrap"',
                      'className:"pr-1 font-bold text-right whitespace-nowrap"')
block = block.replace('className:"py-1 text-center font-bold text-base"',
                      'className:"text-center font-bold text-base"')
block = block.replace('className:"py-1 text-center font-bold"',
                      'className:"text-center font-bold"')
block = block.replace('className:"py-1 text-center"',
                      'className:"text-center"')
block = block.replace('className:"py-1 text-center font-semibold"',
                      'className:"text-center font-semibold"')
block = block.replace('className:"py-1 px-2 text-center"',
                      'className:"text-center"')

# Add compact padding via style on label cells that lost py-1 - inject padding into existing style objects for 수리/주역 rows
# After removing py-1, add padding:"1px 2px" into style objects for data cells

# For styles that have color and fontSize already, prepend padding
replacements = [
    # name cells
    ('style:{color:"#1c1917"},children:ho},`hg-name-${bo}`)',
     'style:{color:"#1c1917",padding:"2px 1px"},children:ho},`hg-name-${bo}`)'),
    # hangul label column base
    ('style:{color:"#92400e",width:"3rem"},children:"이름"',
     'style:{color:"#92400e",width:"2.6rem",padding:"2px 1px",fontSize:"11px"},children:"이름"'),
    ('style:{color:"#92400e",width:"3rem"},children:"오행"',
     'style:{color:"#92400e",width:"2.6rem",padding:"1px",fontSize:"11px"},children:"오행"'),
    ('style:{color:"#92400e",width:"3rem"},children:"획수"',
     'style:{color:"#92400e",width:"2.6rem",padding:"1px",fontSize:"11px"},children:"획수"'),
]
for old, new in replacements:
    if block.count(old) >= 1:
        block = block.replace(old, new)

# Tighten 수리 / 수리뜻 / 연령대 / 주역 specifically — both hangul and hanja tables
# Label styles without width
for lab in ["수리", "수리뜻", "연령대", "주역"]:
    old = f'style:{{color:"#92400e"}},children:"{lab}"'
    new = f'style:{{color:"#92400e",padding:"1px 2px 1px 0",fontSize:"11px",lineHeight:1.1}},children:"{lab}"'
    cnt = block.count(old)
    if cnt:
        block = block.replace(old, new)
        print("label", lab, cnt)

# Data cell paddings for 수리 numbers
block = block.replace(
    'style:{color:Eo(ho.data.type)},children:ho.suri}',
    'style:{color:Eo(ho.data.type),padding:"1px",fontSize:"12px",lineHeight:1.1},children:ho.suri}',
)
# 수리뜻
block = block.replace(
    'style:{color:Eo(ho.data.type),fontSize:"10px",lineHeight:1.25,whiteSpace:"nowrap"}',
    'style:{color:Eo(ho.data.type),fontSize:"9px",lineHeight:1.05,whiteSpace:"nowrap",padding:"0px 1px"}',
)
# 연령대 cells
block = block.replace(
    'style:{color:"#78350f",fontSize:"10px"},children:ho}',
    'style:{color:"#78350f",fontSize:"8px",padding:"0px 1px",lineHeight:1},children:ho}',
)
# 주역 cells
block = block.replace(
    'style:{color:Go(ho.gwe),fontSize:"10px",lineHeight:1.25,whiteSpace:"nowrap"}',
    'style:{color:Go(ho.gwe),fontSize:"9px",lineHeight:1.05,whiteSpace:"nowrap",padding:"0px 1px"}',
)
# 오행/획수 data
block = block.replace(
    'style:{color:col,fontSize:"11px"},children:el||"?"}',
    'style:{color:col,fontSize:"11px",padding:"1px"},children:el||"?"}',
)
block = block.replace(
    'style:{color:"#374151",fontSize:"11px",fontWeight:600},children:x[bo]>0',
    'style:{color:"#374151",fontSize:"10px",fontWeight:600,padding:"1px"},children:x[bo]>0',
)
block = block.replace(
    'style:{color:po?"#b45309":"#374151",fontSize:"11px",fontWeight:600},children:Wo>0',
    'style:{color:po?"#b45309":"#374151",fontSize:"10px",fontWeight:600,padding:"1px"},children:Wo>0',
)

# border between 수리뜻 and 연령대 / 주역 — use thinner lighter borders for middle rows
# Change 연령대 before 주역 borderBottom 2px solid to 1px so 수리 block feels closer to 주역
block = block.replace(
    'Home.tsx:912",style:{borderBottom:"2px solid #d97706"}',
    'Home.tsx:912",style:{borderBottom:"1px solid #e5e7eb"}',
)
block = block.replace(
    'Home.tsx:hjAge",style:{borderBottom:"2px solid #d97706"}',
    'Home.tsx:hjAge",style:{borderBottom:"1px solid #e5e7eb"}',
)

kw2 = kw[:a] + block + kw[b:]

# 요약보기: tighten 한글/한문 수리·주역 rows
sum_a = kw2.find('Home.tsx:1136"')
sum_b = kw2.find('Home.tsx:1172"', sum_a)
if sum_a < 0 or sum_b < 0:
    raise SystemExit("요약 bounds")
sblock = kw2[sum_a:sum_b]
sblock2 = sblock.replace('className:"py-1.5 pr-2 font-bold whitespace-nowrap"',
                         'className:"pr-1 font-bold whitespace-nowrap"')
sblock2 = sblock2.replace('className:"py-1.5 text-center font-bold"',
                          'className:"text-center font-bold"')
sblock2 = sblock2.replace('fontSize:"10px",lineHeight:1.25,whiteSpace:"nowrap"',
                          'fontSize:"9px",lineHeight:1.05,whiteSpace:"nowrap",padding:"1px 0"')
# label padding
sblock2 = sblock2.replace('style:{color:"#92400e"},children:"한글수리"',
                          'style:{color:"#92400e",padding:"1px 2px 1px 0",fontSize:"11px"},children:"한글수리"')
sblock2 = sblock2.replace('style:{color:"#92400e"},children:"한글주역"',
                          'style:{color:"#92400e",padding:"1px 2px 1px 0",fontSize:"11px"},children:"한글주역"')
sblock2 = sblock2.replace('style:{color:"#92400e"},children:"한문수리"',
                          'style:{color:"#92400e",padding:"1px 2px 1px 0",fontSize:"11px"},children:"한문수리"')
sblock2 = sblock2.replace('style:{color:"#92400e"},children:"한문주역"',
                          'style:{color:"#92400e",padding:"1px 2px 1px 0",fontSize:"11px"},children:"한문주역"')
kw2 = kw2[:sum_a] + sblock2 + kw2[sum_b:]

# snBtn minHeight 2.4em -> 1.5em (요약보기 tap cells)
old_btn = 'minHeight:"2.4em"'
if kw2.count(old_btn) != 1:
    print("warn snBtn minHeight count", kw2.count(old_btn))
else:
    kw2 = kw2.replace(old_btn, 'minHeight:"1.5em"', 1)

p.write_text(kw2, encoding="utf-8")
print("OK delta", len(kw2) - len(kw))
print("block changed", block != orig)
