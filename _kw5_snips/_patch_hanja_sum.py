# -*- coding: utf-8 -*-
from pathlib import Path
p = Path(r"C:\Users\a8071\Projects\nameanalyz\assets\index-kw5.js")
kw = p.read_text(encoding="utf-8")

ul = '{display:"block",whiteSpace:"nowrap",textDecoration:"underline",textUnderlineOffset:"2px"}'
span = f'm.jsx("span",{{style:{ul},children:nm}},ii)'

hanja_suri = (
    'm.jsxs("tr",{"data-loc":"client/src/pages/Home.tsx:1150",style:{borderBottom:"1px solid #e5e7eb"},children:['
    'm.jsx("td",{"data-loc":"client/src/pages/Home.tsx:1151",className:"py-1.5 pr-2 font-bold whitespace-nowrap",style:{color:"#92400e"},children:"한문수리"}),'
    '[_o,No,Mo,Ro].map((vo,Xo)=>vo?m.jsxs("td",{"data-loc":"client/src/pages/Home.tsx:1153",className:"py-1.5 text-center font-bold",style:{color:ho(vo.data.type),fontSize:"10px",lineHeight:1.25,whiteSpace:"nowrap"},children:'
    'snBtn(vo.suri+"수 · "+String(vo.data.name||"").replace(/\\([^)]*\\)/g,""),vo.data.desc||vo.data.shortDesc||"",ho(vo.data.type),fmtNm(vo.data.name).map((nm,ii)=>'+span+'))'
    '},Xo):m.jsx("td",{"data-loc":"client/src/pages/Home.tsx:1154",className:"py-1.5 text-center font-bold",style:{color:"#aaa"},children:"미입력"},Xo))]})'
)

hanja_gwe = (
    'm.jsxs("tr",{"data-loc":"client/src/pages/Home.tsx:1159",style:{borderBottom:"1px solid #e5e7eb"},children:['
    'm.jsx("td",{"data-loc":"client/src/pages/Home.tsx:1160",className:"py-1.5 pr-2 font-bold whitespace-nowrap",style:{color:"#92400e"},children:"한문주역"}),'
    '[_o,No,Mo,Ro].map((vo,Xo)=>vo?.gwe?m.jsxs("td",{"data-loc":"client/src/pages/Home.tsx:1162",className:"py-1.5 text-center font-bold",style:{color:bo(vo.gwe),fontSize:"10px",lineHeight:1.25,whiteSpace:"nowrap"},children:'
    'snBtn(vo.gwe.name,vo.gwe.desc||"",bo(vo.gwe),wrap2(vo.gwe.name).map((nm,ii)=>'+span+'))'
    '},Xo):m.jsx("td",{"data-loc":"client/src/pages/Home.tsx:1163",className:"py-1.5 text-center font-bold",style:{color:"#aaa"},children:"미입력"},Xo))]})'
)

old = 'Home.tsx:1147"},Xo))]})]})]})}),m.jsx("div",{"data-loc":"client/src/pages/Home.tsx:1172"'
new = 'Home.tsx:1147"},Xo))]}),' + hanja_suri + ',' + hanja_gwe + ']})]})}),m.jsx("div",{"data-loc":"client/src/pages/Home.tsx:1172"'
c = kw.count(old)
print("join count", c)
if c != 1:
    raise SystemExit("join not unique")
kw = kw.replace(old, new, 1)

# Distinguish Hangul vs Hanja row labels
old_s = 'Home.tsx:1137",className:"py-1.5 pr-2 font-bold whitespace-nowrap",style:{color:"#92400e"},children:"수리"}'
new_s = 'Home.tsx:1137",className:"py-1.5 pr-2 font-bold whitespace-nowrap",style:{color:"#92400e"},children:"한글수리"}'
old_g = 'Home.tsx:1144",className:"py-1.5 pr-2 font-bold whitespace-nowrap",style:{color:"#92400e"},children:"주역"}'
new_g = 'Home.tsx:1144",className:"py-1.5 pr-2 font-bold whitespace-nowrap",style:{color:"#92400e"},children:"한글주역"}'
assert kw.count(old_s)==1, kw.count(old_s)
assert kw.count(old_g)==1, kw.count(old_g)
kw = kw.replace(old_s, new_s, 1).replace(old_g, new_g, 1)

assert kw.count('children:"한문수리"')==2  # PrCard + 요약보기
assert kw.count('children:"한문주역"')==2
assert kw.count("snBtn(")==4  # def? wait snBtn( calls: 4 uses + 0 defs. def is snBtn=(
print("snBtn uses", kw.count("snBtn("))
print("한문수리", kw.count('children:"한문수리"'))
print("한글수리", kw.count('children:"한글수리"'))

p.write_text(kw, encoding="utf-8")
print("written", len(kw))
