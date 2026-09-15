# -*- coding: utf-8 -*-
from pathlib import Path
import subprocess
import sys
sys.stdout.reconfigure(encoding="utf-8")
p = Path(r"C:\Users\a8071\Projects\nameanalyz\assets\index-kw5.js")
subprocess.run(["git", "checkout", "HEAD", "--", "assets/index-kw5.js"], check=True)
kw = p.read_text(encoding="utf-8")

a = kw.find('m.jsx("div",{"data-loc":"client/src/pages/Home.tsx:1123"')
b = kw.find('m.jsx("div",{"data-loc":"client/src/pages/Home.tsx:1172"', a)
old = kw[a:b]

i_hg = old.find('m.jsxs("tr",{"data-loc":"client/src/pages/Home.tsx:1136"')
i_bd = old.find(',birthSuri&&bW&&bH&&bI&&bJ&&m.jsxs("tr"')
name_rows = old[i_hg:i_bd]

i_bd2 = old.find('birthSuri&&bW&&bH&&bI&&bJ&&m.jsxs("tr",{"data-loc":"client/src/pages/Home.tsx:bdSumSuri"')
i_gwe = old.find('birthSuri&&bW&&bH&&bI&&bJ&&m.jsxs("tr",{"data-loc":"client/src/pages/Home.tsx:bdSumGwe"')
end_gwe = old.find('children:"-"},Xo))]})', i_gwe) + len('children:"-"},Xo))]})')
parts = old[i_bd2:end_gwe].split(",birthSuri&&bW&&bH&&bI&&bJ&&")
suri_tr = parts[0][len("birthSuri&&bW&&bH&&bI&&bJ&&"):]
gwe_tr = parts[1]

box = '{border:"1px solid #d97706",borderRadius:"8px",padding:"8px 6px",background:"#fffef9"}'
age = (
    'm.jsx("td",{className:"py-1 pr-2 font-bold",style:{color:"#92400e",width:"4rem"}}),'
    'm.jsx("td",{className:"text-center font-bold",style:{color:"#78350f",padding:"1px 0",fontSize:"11px"},children:"초년"}),'
    'm.jsx("td",{className:"text-center font-bold",style:{color:"#78350f",padding:"1px 0",fontSize:"11px"},children:"장년"}),'
    'm.jsx("td",{className:"text-center font-bold",style:{color:"#78350f",padding:"1px 0",fontSize:"11px"},children:"중년"}),'
    'm.jsx("td",{className:"text-center font-bold",style:{color:"#78350f",padding:"1px 0",fontSize:"11px"},children:"말년"})'
)

new = (
    'm.jsxs("div",{"data-loc":"client/src/pages/Home.tsx:1123",style:{display:"flex",flexDirection:"column",gap:"10px",marginBottom:"1rem"},children:['
    'm.jsx("div",{"data-loc":"client/src/pages/Home.tsx:sumNameBox",style:' + box + ',children:'
    'm.jsx("div",{className:"overflow-x-auto",children:'
    'm.jsxs("table",{"data-loc":"client/src/pages/Home.tsx:1124",className:"w-full text-xs",style:{borderCollapse:"collapse",minWidth:"280px"},children:['
    'm.jsx("thead",{"data-loc":"client/src/pages/Home.tsx:1125",children:'
    'm.jsxs("tr",{"data-loc":"client/src/pages/Home.tsx:1126",style:{borderBottom:"2px solid #d97706"},children:['
    'm.jsx("td",{"data-loc":"client/src/pages/Home.tsx:1127",className:"py-1 pr-2 font-bold",style:{color:"#92400e",width:"4rem"}}),'
    'm.jsx("td",{"data-loc":"client/src/pages/Home.tsx:1128",className:"text-center font-bold",style:{color:"#78350f",padding:"1px 0",fontSize:"11px"},children:"초년"}),'
    'm.jsx("td",{"data-loc":"client/src/pages/Home.tsx:1129",className:"text-center font-bold",style:{color:"#78350f",padding:"1px 0",fontSize:"11px"},children:"장년"}),'
    'm.jsx("td",{"data-loc":"client/src/pages/Home.tsx:1130",className:"text-center font-bold",style:{color:"#78350f",padding:"1px 0",fontSize:"11px"},children:"중년"}),'
    'm.jsx("td",{"data-loc":"client/src/pages/Home.tsx:1131",className:"text-center font-bold",style:{color:"#78350f",padding:"1px 0",fontSize:"11px"},children:"말년"})'
    ']})}),'
    'm.jsxs("tbody",{"data-loc":"client/src/pages/Home.tsx:1134",children:['
    + name_rows
    + ']})]})})}),'
    'birthSuri&&bW&&bH&&bI&&bJ&&m.jsxs("div",{"data-loc":"client/src/pages/Home.tsx:bdSumBox",style:' + box + ',children:['
    'm.jsx("div",{style:{textAlign:"center",fontSize:"12px",fontWeight:700,color:"#92400e",letterSpacing:"2px",marginBottom:"4px"},children:"탄생일"}),'
    'm.jsx("div",{className:"overflow-x-auto",children:'
    'm.jsxs("table",{className:"w-full text-xs",style:{borderCollapse:"collapse",minWidth:"280px"},children:['
    'm.jsx("thead",{children:m.jsxs("tr",{style:{borderBottom:"2px solid #d97706"},children:['
    + age
    + ']})}),'
    'm.jsxs("tbody",{children:['
    + suri_tr + ',' + gwe_tr
    + ']})]})})]})'
    ']}),'
)

kw2 = kw[:a] + new + kw[b:]
p.write_text(kw2, encoding="utf-8")
r = subprocess.run(["node", "--check", str(p)], capture_output=True, text=True, encoding="utf-8", errors="replace")
print("syntax", r.returncode)
if r.returncode:
    print(r.stderr[-400:])
    i = kw2.find("1172")
    print("before 1172", repr(kw2[i-80:i+30]))
else:
    print("OK", "말년(총운)", kw2.count("말년(총운)"), "bdSumBox", kw2.count("bdSumBox"), "말년", kw2.count('children:"말년"'))
