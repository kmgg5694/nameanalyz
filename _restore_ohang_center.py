# -*- coding: utf-8 -*-
"""Restore 978 card from f2fe029, then center it with a clean rewrite."""
from pathlib import Path
import subprocess
import re
import sys
sys.stdout.reconfigure(encoding="utf-8")

root = Path(r"C:\Users\a8071\Projects\nameanalyz")
good = subprocess.check_output(
    ["git", "show", "f2fe029:assets/index-kw5.js"], cwd=root
).decode("utf-8")
cur = (root / "assets/index-kw5.js").read_text(encoding="utf-8")

ga = good.find('m.jsxs("div",{"data-loc":"client/src/pages/Home.tsx:978"')
ge_marker = '획`]})})]}),'
ge = good.find(ge_marker, ga)
if ga < 0 or ge < 0:
    raise SystemExit(f"good anchors {ga} {ge}")
ge += len(ge_marker)
good_card = good[ga:ge]
print("good card len", len(good_card))

ca = cur.find('m.jsxs("div",{"data-loc":"client/src/pages/Home.tsx:978"')
# End marker: same follow-up text after card in good
follow = good[ge:ge + 40]
ce = cur.find(follow, ca)
if ca < 0 or ce < 0:
    # broken file may not have 획 line; cut until follow-ish next section
    # try finding unique next data-loc that appears after 978 in good
    follow2 = '"data-loc":"client/src/pages/Home.tsx:1112"'
    # In good, is 1112 after 978?
    print("1112 in good after", good.find(follow2, ga))
    print("follow", repr(follow))
    # Search for 인덕 summary tip / setTip area - actually after 978 comes tip from summary IIFE end
    # Use: look for Home.tsx:1112 or ink-card after
    for cand in [
        follow,
        'm.jsxs("div",{"data-loc":"client/src/pages/Home.tsx:1112"',
        'className:"ink-card p-4 border-2"',
    ]:
        x = cur.find(cand, ca + 10)
        print("cand", cand[:40], x)
    raise SystemExit(f"cur anchors {ca} {ce}")

print("cur range", ca, ce)

# Build new centered card. Keep stroke footer from good.
stroke_i = good_card.find('m.jsx("div",{"data-loc":"client/src/pages/Home.tsx:1074"')
stroke = good_card[stroke_i:]  # includes closing }]),

new_card = r'''m.jsxs("div",{"data-loc":"client/src/pages/Home.tsx:978",className:"mt-2 border rounded",style:{borderColor:"#d97706",padding:"10px 8px"},children:[m.jsxs("div",{"data-loc":"client/src/pages/Home.tsx:980",style:{display:"flex",flexDirection:"column",alignItems:"center",width:"100%",gap:"10px"},children:[m.jsxs("div",{style:{display:"flex",alignItems:"center",justifyContent:"center",gap:"14px",flexWrap:"wrap"},children:[m.jsxs("div",{style:{display:"flex",flexDirection:"column",alignItems:"center",gap:"4px"},children:[m.jsx("div",{style:{fontSize:"11px",fontWeight:700,color:"#92400e"},children:"한글 오행"}),m.jsxs("div",{style:{display:"grid",gridTemplateColumns:"1.85rem 1.4rem 1.85rem 1.4rem 1.85rem",alignItems:"center",justifyItems:"center"},children:[m.jsx("span",{className:"ohang-badge inline-flex items-center justify-center rounded-full text-xs font-bold border-2",style:{backgroundColor:"#fff",color:"#374151",borderColor:"#9ca3af",borderRadius:"50%",width:"1.85rem",height:"1.85rem"},children:ro[0]}),m.jsx("span",{style:{color:an(W),fontWeight:800,fontSize:"12px"},children:Tn(W)}),m.jsx("span",{className:"ohang-badge inline-flex items-center justify-center rounded-full text-xs font-bold border-2",style:{backgroundColor:"#fff",color:"#374151",borderColor:"#9ca3af",borderRadius:"50%",width:"1.85rem",height:"1.85rem"},children:ro[1]}),m.jsx("span",{style:{color:an(_),fontWeight:800,fontSize:"12px"},children:Tn(_)}),m.jsx("span",{className:"ohang-badge inline-flex items-center justify-center rounded-full text-xs font-bold border-2",style:{backgroundColor:"#fff",color:"#374151",borderColor:"#9ca3af",borderRadius:"50%",width:"1.85rem",height:"1.85rem"},children:ro[2]})]})]}),hjShow&&m.jsx("div",{style:{color:"#d97706",fontWeight:700,fontSize:"18px",paddingTop:"14px"},children:"|"}),hjShow&&m.jsxs("div",{style:{display:"flex",flexDirection:"column",alignItems:"center",gap:"4px"},children:[m.jsx("div",{style:{fontSize:"11px",fontWeight:700,color:"#92400e"},children:"한문 오행"}),m.jsx("div",{style:{display:"grid",gridTemplateColumns:"1.85rem 1.4rem 1.85rem 1.4rem 1.85rem",alignItems:"center",justifyItems:"center"},children:t.hanjaChars.reduce((acc,ho,bo)=>{const Wo=ho?(Ln.find(po=>po.char===ho&&po.ohang===t.hanjaOhang[bo])||Ln.find(po=>po.char===ho)):null,Yo=Wo&&Wo.meaning.split(" ").pop()||"";acc.push(m.jsx("span",{key:"hb"+bo,className:"ohang-badge inline-flex items-center justify-center rounded-full text-xs font-bold border-2 cursor-pointer",style:{backgroundColor:"#fff",color:"#374151",borderColor:"#9ca3af",borderRadius:"50%",width:"1.85rem",height:"1.85rem"},title:ho?`클릭하면 한자 오행표에서 '${Yo}' 음 검색`:"",onClick:()=>{ho&&Yo&&(b(Yo),a("hanja"))},children:ho||ro[bo]}));bo<2&&acc.push(m.jsx("span",{key:"hr"+bo,style:{color:an(bo===0?L:eo),fontWeight:800,fontSize:"12px"},children:Tn(bo===0?L:eo)}));return acc},[])})]})]}),m.jsxs("div",{style:{display:"flex",alignItems:"center",justifyContent:"center",gap:"14px",flexWrap:"wrap"},children:[m.jsxs("div",{style:{display:"flex",flexDirection:"column",alignItems:"center",gap:"4px"},children:[m.jsx("div",{style:{fontSize:"11px",fontWeight:700,color:"#92400e"},children:"한글 오행명"}),m.jsxs("div",{style:{display:"grid",gridTemplateColumns:"1.85rem 1.4rem 1.85rem 1.4rem 1.85rem",alignItems:"center",justifyItems:"center"},children:[m.jsx("span",{style:{color:({木:"#166534",火:"#991b1b",土:"#92400e",金:"#1c1917",水:"#1e3a8a"}[K[0]]||"#9ca3af"),fontSize:"13px",fontWeight:800},children:K[0]||"?"}),m.jsx("span",{style:{color:an(W),fontWeight:800,fontSize:"12px"},children:Tn(W)}),m.jsx("span",{style:{color:({木:"#166534",火:"#991b1b",土:"#92400e",金:"#1c1917",水:"#1e3a8a"}[K[1]]||"#9ca3af"),fontSize:"13px",fontWeight:800},children:K[1]||"?"}),m.jsx("span",{style:{color:an(_),fontWeight:800,fontSize:"12px"},children:Tn(_)}),m.jsx("span",{style:{color:({木:"#166534",火:"#991b1b",土:"#92400e",金:"#1c1917",水:"#1e3a8a"}[K[2]]||"#9ca3af"),fontSize:"13px",fontWeight:800},children:K[2]||"?"})]})]}),hjShow&&m.jsx("div",{style:{color:"#d97706",fontWeight:700,fontSize:"18px",paddingTop:"14px"},children:"|"}),hjShow&&m.jsxs("div",{style:{display:"flex",flexDirection:"column",alignItems:"center",gap:"4px"},children:[m.jsx("div",{style:{fontSize:"11px",fontWeight:700,color:"#92400e"},children:"한문 오행명"}),m.jsx("div",{style:{display:"grid",gridTemplateColumns:"1.85rem 1.4rem 1.85rem 1.4rem 1.85rem",alignItems:"center",justifyItems:"center"},children:hjO.reduce((acc,el,bo)=>{const cm={木:"#166534",火:"#991b1b",土:"#92400e",金:"#1c1917",水:"#1e3a8a"};acc.push(m.jsx("span",{key:"hn"+bo,style:{color:cm[el]||"#9ca3af",fontSize:"13px",fontWeight:800},children:el||"?"}));bo<2&&acc.push(m.jsx("span",{key:"hnr"+bo,style:{color:an(bo===0?L:eo),fontWeight:800,fontSize:"12px"},children:Tn(bo===0?L:eo)}));return acc},[])})]})]})]},''' + stroke

# First restore good card if we can't find end - safer path: restore good then replace within good
# Always: set cur section to new_card by replacing using good's follow
# If current is broken, locate ce via searching from 한글 획수 or from follow in good after restoring temporarily

# Restore good card first to stabilize
cur2 = cur[:ca] + good_card + cur[ce:] if ce > 0 else None
'''
# Actually if ce failed we already exited. Wait - we exited above. Need to fix ce finding.

# Re-find ce more carefully without exit
'''
# Fix ce finding without raise earlier - rewrite script flow
print("redo locate")
