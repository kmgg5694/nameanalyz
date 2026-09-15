# -*- coding: utf-8 -*-
from pathlib import Path
import subprocess
import sys
sys.stdout.reconfigure(encoding="utf-8")

p = Path("assets/index-kw5.js")
kw = p.read_text(encoding="utf-8")

old_start = 'm.jsxs("div",{"data-loc":"client/src/pages/Home.tsx:980"'
old_end = 'm.jsx("div",{"data-loc":"client/src/pages/Home.tsx:1074"'
a = kw.find(old_start)
b = kw.find(old_end, a)
if a < 0 or b < 0:
    raise SystemExit(f"anchors miss {a} {b}")

# New centered layout for 오행 + 오행명
new = r'''m.jsxs("div",{"data-loc":"client/src/pages/Home.tsx:980",style:{padding:"10px 6px 8px",display:"flex",flexDirection:"column",alignItems:"center",gap:"8px"},children:[(()=>{const cm={木:"#166534",火:"#991b1b",土:"#92400e",金:"#1c1917",水:"#1e3a8a"};const rel=(r)=>{const lab=r==="sangsaeng"?"생":r==="sanggeuk"?"극":"비",col=r==="sangsaeng"?"#166534":r==="sanggeuk"?"#991b1b":"#a16207";return m.jsx("span",{style:{display:"inline-flex",alignItems:"center",justifyContent:"center",minWidth:"1.35rem",fontSize:"12px",fontWeight:800,color:col},children:lab})};const badge=(ch,clickable,title,onClick)=>m.jsx("span",{className:"ohang-badge inline-flex items-center justify-center rounded-full text-xs font-bold border-2"+(clickable?" cursor-pointer":""),style:{backgroundColor:"white",color:"#374151",borderColor:"#9ca3af",borderRadius:"50%",width:"1.85rem",height:"1.85rem",flexShrink:0},title:title||"",onClick:onClick,children:ch});const chain=(nodes)=>m.jsx("div",{style:{display:"grid",gridTemplateColumns:"1.85rem 1.35rem 1.85rem 1.35rem 1.85rem",alignItems:"center",justifyItems:"center",columnGap:"2px"},children:nodes});const side=(label,body)=>m.jsxs("div",{style:{display:"flex",flexDirection:"column",alignItems:"center",gap:"4px",minWidth:"9.5rem"},children:[m.jsx("div",{style:{fontSize:"11px",fontWeight:700,color:"#92400e",letterSpacing:"1px"},children:label}),body]});const hgBadges=chain([badge(ro[0]),rel(W),badge(ro[1]),rel(_),badge(ro[2])]);const hjBadges=hjShow?chain(t.hanjaChars.flatMap((ho,bo)=>{const Wo=ho?(Ln.find(po=>po.char===ho&&po.ohang===t.hanjaOhang[bo])||Ln.find(po=>po.char===ho)):null,Yo=Wo&&Wo.meaning.split(" ").pop()||"",node=badge(ho||ro[bo],!!ho,ho?`클릭하면 한자 오행표에서 '${Yo}' 음 검색`:"",()=>{ho&&Yo&&(b(Yo),a("hanja"))});return bo<2?[node,rel(bo===0?L:eo)]:[node]})):null;const hgNames=chain([m.jsx("span",{style:{color:cm[K[0]]||"#9ca3af",fontSize:"13px",fontWeight:800},children:K[0]||"?"}),rel(W),m.jsx("span",{style:{color:cm[K[1]]||"#9ca3af",fontSize:"13px",fontWeight:800},children:K[1]||"?"}),rel(_),m.jsx("span",{style:{color:cm[K[2]]||"#9ca3af",fontSize:"13px",fontWeight:800},children:K[2]||"?"})]);const hjNames=hjShow?chain(hjO.flatMap((el,bo)=>{const node=m.jsx("span",{style:{color:cm[el]||"#9ca3af",fontSize:"13px",fontWeight:800},children:el||"?"});return bo<2?[node,rel(bo===0?L:eo)]:[node]})):null;return m.jsxs(m.Fragment,{children:[m.jsxs("div",{style:{display:"flex",alignItems:"flex-start",justifyContent:"center",gap:"10px",width:"100%",flexWrap:"wrap"},children:[side("한글 오행",hgBadges),hjShow&&m.jsx("span",{style:{color:"#d97706",fontWeight:700,paddingTop:"18px"},children:"|"}),hjShow&&side("한문 오행",hjBadges)]}),m.jsxs("div",{style:{display:"flex",alignItems:"flex-start",justifyContent:"center",gap:"10px",width:"100%",flexWrap:"wrap"},children:[side("한글 오행명",hgNames),hjShow&&m.jsx("span",{style:{color:"#d97706",fontWeight:700,paddingTop:"18px"},children:"|"}),hjShow&&side("한문 오행명",hjNames)]})]})}())]}),'''

kw2 = kw[:a] + new + kw[b:]
p.write_text(kw2, encoding="utf-8")
r = subprocess.run(["node", "--check", str(p)], capture_output=True)
print("syntax", r.returncode)
if r.returncode:
    print(r.stderr.decode("utf-8", errors="replace")[-800:])
    raise SystemExit(1)

html = Path("index.html").read_text(encoding="utf-8")
for o,n in [("20260911i","20260911j"),("20260911h","20260911j"),("20260911g","20260911j"),("20260911f","20260911j")]:
    html = html.replace(f"?v={o}", f"?v={n}")
Path("index.html").write_text(html, encoding="utf-8")
print("OK centered ohang", "한글 오행" in kw2)
print("html", [x for x in html.splitlines() if "index-kw5" in x][0])
