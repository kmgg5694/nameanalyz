# -*- coding: utf-8 -*-
"""요약보기 아래 해설: 총운(수리+주역) → 초/장/중/말년 축약 → 사주 초~말년."""
import sys
import subprocess
from pathlib import Path
sys.stdout.reconfigure(encoding="utf-8")

p = Path(r"C:\Users\a8071\Projects\nameanalyz\assets\index-kw5.js")
kw = p.read_text(encoding="utf-8")

start = 'm.jsxs("div",{"data-loc":"client/src/pages/Home.tsx:1307",children:['
end = 'm.jsx("div",{"data-loc":"client/src/pages/Home.tsx:1431",className:"pt-2 border-t"'

si = kw.find(start)
ei = kw.find(end)
if si < 0 or ei < 0 or ei <= si:
    raise SystemExit(f"bounds miss si={si} ei={ei}")

# Keep the contact div; replace only 1307..before 1431
# Find closing of 중년 section: ends with `})]})]}),` before 1431
# Actually start includes 1307 div open; we need to replace through the sibling divs for 초년장년중년
# Structure: 1307총운, 1338초년, 1369장년, 1400중년 — then 1431
# Replace from start through just before 1431

old = kw[si:ei]
print("old len", len(old))
print("old head", old[:80])
print("old tail", old[-80:])

# New narrative as one IIFE returning fragment of sections
new = r'''m.jsxs("div",{"data-loc":"client/src/pages/Home.tsx:1307",className:"mt-2 space-y-1",children:(()=>{const ax=s=>{s=String(s||"").replace(/\s+/g," ").trim();if(!s)return"";const parts=s.match(/[^.!?。]+[.!?。]?/g)||[s];let out=parts.slice(0,2).join("").trim();if(out.length>110){out=out.slice(0,108);const cut=Math.max(out.lastIndexOf("다"),out.lastIndexOf("요"),out.lastIndexOf("음"),out.lastIndexOf(" "));if(cut>40)out=out.slice(0,cut+(out[cut]==="다"||out[cut]==="요"||out[cut]==="음"?1:0));if(!/[다요음임.]$/.test(out))out+="…"}return out},gc=g=>g?g.isTaboo?"#FF0000":g.isBest?"#0000FF":"#92400e":"#1c1917",metaC=(data,gwe)=>{const bad=data&&(data.type==="taboo"||data.type==="bad"||data.type==="caution")||gwe&&gwe.isTaboo,good=data&&data.type==="best"||gwe&&gwe.isBest;return bad?"총운은 내가 살아가는 모습으로 아주 중요합니다. 빨간색이면 인생 전반에 영향력을 발휘하다가 본기운 55세 이후에 본격적으로 발현되는 기운입니다.":good?"총운은 내가 살아가는 모습으로 아주 중요합니다. 파란색이면 인생 전반에 좋은 영향력이 됩니다.":"총운은 내가 살아가는 모습으로 아주 중요한 기운입니다."},row=(ttl,item,who)=>{if(!item||!item.data)return null;const sd=ax(item.data.desc),gd=item.gwe?ax(item.gwe.desc):"";return m.jsxs("div",{className:"mt-3",children:[m.jsx("p",{style:{color:"#78350f",fontWeight:700,fontSize:"0.95rem"},children:ttl}),m.jsxs("p",{className:"mt-1",style:{color:"#1c1917",lineHeight:1.65,fontSize:"0.9rem"},children:[who," 수리는 ",m.jsxs("span",{style:{color:Eo(item.data.type),fontWeight:"bold"},children:[item.suri,"수(",item.data.name,")"]}),sd?" — "+sd:""]}),item.gwe&&m.jsxs("p",{className:"mt-1",style:{color:"#1c1917",lineHeight:1.65,fontSize:"0.9rem"},children:["주역괘는 ",m.jsx("span",{style:{color:gc(item.gwe),fontWeight:"bold"},children:item.gwe.name}),gd?" — "+gd:""]})]})},secs=[];secs.push(m.jsx("p",{style:{color:"#1c1917",fontWeight:700},children:"이제 이 이름이 가진 전체적인 기운, 총운을 알아 보겠습니다."}));secs.push(m.jsx("p",{className:"mt-2",style:{color:"#1c1917",lineHeight:1.7},children:metaC(wo?.data,wo?.gwe)}));secs.push(row("한글 총운 (수리·주역)",wo,"한글이름의 총운"));uo&&Ro&&secs.push(row("한문 총운 (수리·주역)",Ro,"한자이름의 총운"));secs.push(row("초년(1~23세) — 한글 수리·주역",G,"한글이름의 초년"));uo&&_o&&secs.push(row("초년 — 한문 수리·주역",_o,"한자이름의 초년"));secs.push(row("장년(24~40세) — 한글 수리·주역",mo,"한글이름의 장년"));uo&&No&&secs.push(row("장년 — 한문 수리·주역",No,"한자이름의 장년"));secs.push(row("중년(41~55세) — 한글 수리·주역",co,"한글이름의 중년"));uo&&Mo&&secs.push(row("중년 — 한문 수리·주역",Mo,"한자이름의 중년"));secs.push(m.jsx("p",{className:"mt-3",style:{color:"#78350f",fontWeight:700},children:"말년으로 이어지는 기운이 중요합니다."}));secs.push(row("말년(56세~) — 한글 수리·주역",wo,"한글이름의 말년"));uo&&Ro&&secs.push(row("말년 — 한문 수리·주역",Ro,"한자이름의 말년"));if(birthSuri&&bW){secs.push(m.jsx("p",{className:"mt-4",style:{color:"#78350f",fontWeight:700,borderTop:"1px solid #d97706",paddingTop:"10px"},children:"마지막으로 사주(탄생일) 초년·장년·중년·말년을 보겠습니다."}));secs.push(row("사주 초년(1~23세)",bW,"사주 초년"));bH&&secs.push(row("사주 장년(24~40세)",bH,"사주 장년"));bI&&secs.push(row("사주 중년(41~55세)",bI,"사주 중년"));bJ&&secs.push(row("사주 말년(56세~)",bJ,"사주 말년"))}return secs})()}),'''

kw = kw[:si] + new + kw[ei:]
p.write_text(kw, encoding="utf-8")

r = subprocess.run(["node", "--check", str(p)], capture_output=True)
print("syntax", r.returncode)
if r.returncode:
    print(r.stderr.decode("utf-8", errors="replace")[-800:])
else:
    for s in ["본기운 55세", "파란색이면 인생 전반", "말년으로 이어지는", "사주(탄생일)", "ax=s=>"]:
        print(s, s in kw)
