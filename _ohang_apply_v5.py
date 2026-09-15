# -*- coding: utf-8 -*-
"""Remaining spec (4): Korean intro/dual/share rk; English brackets, 상극 cards, CEO copy."""
from pathlib import Path

root = Path(r"C:\Users\a8071\Projects\nameanalyz")
kw5_path = root / "assets" / "index-kw5.js"
etnx_path = root / "assets" / "index-eTNXNndF.js"
kw5 = kw5_path.read_text(encoding="utf-8")
etnx = etnx_path.read_text(encoding="utf-8")


def once(s, old, new, label):
    n = s.count(old)
    if n != 1:
        raise SystemExit(f"{label}: count={n}")
    return s.replace(old, new, 1)


# ----- Korean intro -----
kw5 = once(
    kw5,
    'children:"오행은 주변 사람들과 어떤 인간관계를 맺는지를 나타냅니다. 한글이름 가운데 글자를 본인으로 보고, 위쪽(성씨)은 양부모·선배·배우자·관청운을, 아래쪽(끝자)은 동료·후배·자녀를 나타냅니다. 한자이름도 같은 방식으로 봅니다."',
    'children:(t.rank||"staff")==="ceo"?"사장·회장급은 위쪽 글자(성)를 본인(나)으로 봅니다. 나(위)와 가운데, 가운데와 아래의 상생상극으로 조직·부하 관계를 해석합니다. 한자이름도 같은 방식으로 봅니다.":"오행은 주변 사람들과 어떤 인간관계를 맺는지를 나타냅니다. 한글이름 가운데 글자를 본인으로 보고, 위쪽(성씨)은 유산상속·공무원·선배의 도움·배우자운을, 아래쪽(끝자)은 동료·후배·자녀를 나타냅니다. 한자이름도 같은 방식으로 봅니다."',
    "kw intro",
)

kw5 = once(
    kw5,
    '(()=>{const d=dual(upHg,upHj,staffUp.ss,staffUp.sg),bothSg=upHg==="sanggeuk"&&upHj==="sanggeuk",bothSs=upHg==="sangsaeng"&&upHj==="sangsaeng";if(q&&d&&!isCeo)mk("ohangUpDual","위쪽(성→나) — 겉과 속이 다름",d,0);else if(q&&bothSs&&!isCeo)mk("ohangUpBothSs","위쪽(유산상속·공무원·선배·배우자)","한글·한자 위쪽이 모두 상생으로 일치합니다. 위쪽 관계가 뚜렷하게 열려 있습니다.",1);else if(q&&bothSg&&!isCeo)mk("ohangUpBothSg","위쪽(유산상속·공무원·선배·배우자)","오행이 나를 중심으로 한글·한문 위쪽이 막히면 유산상속, 공무원, 선배의 도움, 배우자운이 막혀서 풀리지 않습니다. 설령 결혼을 하였더라도 배우자가 일을 많이 저지르게 됩니다.",-1);else mk("ohangUpHg",isCeo?"한글 나(위)→가운데":"한글 위쪽(성→나)",upMap[code(upHg)],tone(upHg));if(q&&!(d&&!isCeo)&&!bothSg&&!bothSs)mk("ohangUpHj",isCeo?"한자 나(위)→가운데":"한자 위쪽(성→나)",upMap[code(upHj)],tone(upHj))})();',
    '(()=>{const bothSg=upHg==="sanggeuk"&&upHj==="sanggeuk",bothSs=upHg==="sangsaeng"&&upHj==="sangsaeng",upSplit=q&&!isCeo&&((upHg==="sanggeuk"&&upHj==="sangsaeng")||(upHg==="sangsaeng"&&upHj==="sanggeuk"));if(upSplit)mk("ohangUpDual","위쪽(성→나) — 겉과 속이 다름",upHg==="sanggeuk"?"겉으로는 유산상속·공무원·선배의 도움·배우자운이 막혀 보이지만, 속마음으로는 원활합니다.":"겉으로는 유산상속·공무원·선배의 도움·배우자운이 원활해 보이지만, 속으로는 막혀 있습니다.",0);else if(q&&bothSs&&!isCeo)mk("ohangUpBothSs","위쪽(유산상속·공무원·선배·배우자)","한글·한자 위쪽이 모두 상생으로 일치합니다. 위쪽 관계가 뚜렷하게 열려 있습니다.",1);else if(q&&bothSg&&!isCeo)mk("ohangUpBothSg","위쪽(유산상속·공무원·선배·배우자)","오행이 나를 중심으로 한글·한문 위쪽이 막히면 유산상속, 공무원, 선배의 도움, 배우자운이 막혀서 풀리지 않습니다. 설령 결혼을 하였더라도 배우자가 일을 많이 저지르게 됩니다.",-1);else mk("ohangUpHg",isCeo?"한글 나(위)→가운데":"한글 위쪽(성→나)",upMap[code(upHg)],tone(upHg));if(q&&!upSplit&&!bothSg&&!bothSs)mk("ohangUpHj",isCeo?"한자 나(위)→가운데":"한자 위쪽(성→나)",upMap[code(upHj)],tone(upHj))})();',
    "kw up dual",
)

kw5 = once(
    kw5,
    '(()=>{const d=dual(dnHg,dnHj,"잘 통하고 있습니다.","다소 닫혀 있습니다.");if(q&&d&&!isCeo)mk("ohangDnDual","아래쪽(나→끝) — 겉과 속이 다름","동료·후배·자녀와의 관계가 "+d.replace("잘 통하고 있습니다.","속마음으로는 잘 통하고 있습니다.").replace("겉으로는 다소 닫혀 있습니다.","겉으로는 다소 닫혀 보이지만"),0);else{mk("ohangDnHg",isCeo?"한글 가운데→아래":"한글 아래쪽(나→끝)",dnMap[code(dnHg)],tone(dnHg));if(q)mk("ohangDnHj",isCeo?"한자 가운데→아래":"한자 아래쪽(나→끝)",dnMap[code(dnHj)],tone(dnHj))}})();',
    '(()=>{if(q&&!isCeo&&dnHg==="sanggeuk"&&dnHj==="sangsaeng")mk("ohangDnDual","아래쪽(나→끝) — 겉과 속이 다름","동료·후배·자녀와의 관계가 겉으로는 다소 닫혀 보이지만, 속마음으로는 잘 통하고 있습니다.",0);else if(q&&!isCeo&&dnHg==="sangsaeng"&&dnHj==="sanggeuk")mk("ohangDnDual","아래쪽(나→끝) — 겉과 속이 다름","동료·후배·자녀와의 관계가 겉으로는 잘 통하는 듯하지만, 속으로는 막혀 있습니다.",0);else{mk("ohangDnHg",isCeo?"한글 가운데→아래":"한글 아래쪽(나→끝)",dnMap[code(dnHg)],tone(dnHg));if(q)mk("ohangDnHj",isCeo?"한자 가운데→아래":"한자 아래쪽(나→끝)",dnMap[code(dnHj)],tone(dnHj))}})();',
    "kw dn dual",
)

kw5 = once(
    kw5,
    'g.set("name",t.name);g.set("gender",t.gender||"male");g.set("hc",(t.hanjaChars||[]).join(","));',
    'g.set("name",t.name);g.set("gender",t.gender||"male");g.set("rk",t.rank||"staff");g.set("hc",(t.hanjaChars||[]).join(","));',
    "kw native share rk",
)

# ----- English majority card closes (match working upSs: })]} ) -----
etnx = once(
    etnx,
    "supports the self.`})]})]}),(w.dominant)&&center&&sgMap[w.dominant]===center)&&",
    "supports the self.`})]}),(w.dominant&&center&&sgMap[w.dominant]===center)&&",
    "en gen close",
)
etnx = once(
    etnx,
    "against the self.`})]})]}),E.jsxs(\"div\",{\"data-loc\":\"client/src/pages/EnglishName.tsx:midSelf\"",
    "against the self.`})]}),E.jsxs(\"div\",{\"data-loc\":\"client/src/pages/EnglishName.tsx:midSelf\"",
    "en ctl close",
)

etnx = once(
    etnx,
    'backgroundColor:`${mt[Y]}14`,borderRadius:"0.5rem",border:`2px solid ${mt[Y]}`',
    'backgroundColor:`${mt[center]}14`,borderRadius:"0.5rem",border:`2px solid ${mt[center]}`',
    "en midSelf color",
)

etnx = once(
    etnx,
    'S?"▲ 위 (본가·처가·부모·배우자·관청·선배)":"▲ Above (Family · Parents · Spouse · Authority · Seniors)"',
    'S?isCeo?"▲ 위 (나·성)":"▲ 위 (유산상속·공무원·선배·배우자)":isCeo?"▲ Above (self · Last)":"▲ Above (inheritance · office · seniors · spouse)"',
    "en diagram above",
)

rel_old = (
    'up==="ss"&&E.jsxs("div",{"data-loc":"client/src/pages/EnglishName.tsx:upSs",style:{padding:"0.6rem 0.75rem",backgroundColor:"#f0fdf4",borderRadius:"0.5rem",border:"1px solid #86efac"},children:[E.jsxs("div",{style:{fontWeight:700,fontSize:"0.88rem",color:"#166534",marginBottom:"0.3rem"},children:[S?"위쪽(성→나) 상생 — 양부모·관청·선배·배우자 운이 원활함":"Above (Last→First) generating — parents, workplace, seniors, spouse fortune flow"]}),E.jsx("p",{style:{fontSize:"0.85rem",color:"#333",lineHeight:1.7,margin:0},children:S?"성(위)과 이름(나)이 상생이라 윗사람 운이 열려 있습니다.":"Last→First is generating, so senior/spouse fortune is open."})]}),dn==="ss"&&E.jsxs("div",{"data-loc":"client/src/pages/EnglishName.tsx:dnSs",style:{padding:"0.6rem 0.75rem",backgroundColor:"#f0fdf4",borderRadius:"0.5rem",border:"1px solid #86efac"},children:[E.jsxs("div",{style:{fontWeight:700,fontSize:"0.88rem",color:"#166534",marginBottom:"0.3rem"},children:[S?"아래쪽(나→끝) 상생 — 동료·후배·자녀운이 열려 있음":"Below (self→end) generating — colleagues, juniors, children fortune open"]}),E.jsx("p",{style:{fontSize:"0.85rem",color:"#333",lineHeight:1.7,margin:0},children:S?"이름(나)과 아래가 상생이라 아랫사람 운이 열려 있습니다.":"Self→end is generating, so junior/children fortune is open."})]}),E.jsxs("div",{"data-loc":"client/src/pages/EnglishName.tsx:wealth"'
)

st = '{padding:"0.6rem 0.75rem",backgroundColor:'
rel_new = (
    'up==="ss"&&E.jsxs("div",{"data-loc":"client/src/pages/EnglishName.tsx:upSs",style:'
    + st
    + '"#f0fdf4",borderRadius:"0.5rem",border:"1px solid #86efac"},children:[E.jsxs("div",{style:{fontWeight:700,fontSize:"0.88rem",color:"#166534",marginBottom:"0.3rem"},children:[S?isCeo?"나(위)→가운데 상생 — 조직·부하를 이끄는 기운이 원활함":"위쪽(성→나) 상생 — 유산상속·공무원·선배의 도움·배우자운이 원활함":isCeo?"Self (Last)→middle generating — leadership flows":"Above (Last→First) generating — inheritance, office, seniors, spouse fortune flow"]}),E.jsx("p",{style:{fontSize:"0.85rem",color:"#333",lineHeight:1.7,margin:0},children:S?isCeo?"나(위)와 가운데가 상생이라 조직을 이끄는 기운이 원활합니다.":"유산상속·공무원·선배의 도움·배우자운이 원활합니다.":isCeo?"Last to First generates, so leading the middle flows.":"Last→First is generating, so inheritance/office/senior/spouse fortune is open."})]}),'
    'up==="sg"&&E.jsxs("div",{"data-loc":"client/src/pages/EnglishName.tsx:upSg",style:'
    + st
    + '"#fff1f2",borderRadius:"0.5rem",border:"1px solid #fda4af"},children:[E.jsxs("div",{style:{fontWeight:700,fontSize:"0.88rem",color:"#991b1b",marginBottom:"0.3rem"},children:[S?isCeo?"나(위)→가운데 상극 — 부하·실무를 감당하는 부담":"위쪽(성→나) 상극 — 유산상속·공무원·선배의 도움·배우자운이 막힘":isCeo?"Self (Last)→middle controlling — burden of leading":"Above (Last→First) controlling — inheritance, office, seniors, spouse fortune blocked"]}),E.jsx("p",{style:{fontSize:"0.85rem",color:"#333",lineHeight:1.7,margin:0},children:S?isCeo?"나(위)가 가운데를 극하는 형국이라 부하·실무를 감당하는 부담이 있습니다.":"유산상속·공무원(직장/윗사람)·선배의 도움·배우자운이 막혀서 풀리지 않습니다.":isCeo?"Last controls First — the load of leading the middle is heavy.":"Last→First is controlling, so inheritance/office/senior/spouse fortune is blocked."})]}),'
    'dn==="ss"&&E.jsxs("div",{"data-loc":"client/src/pages/EnglishName.tsx:dnSs",style:'
    + st
    + '"#f0fdf4",borderRadius:"0.5rem",border:"1px solid #86efac"},children:[E.jsxs("div",{style:{fontWeight:700,fontSize:"0.88rem",color:"#166534",marginBottom:"0.3rem"},children:[S?isCeo?"가운데→아래 상생 — 하부 조직이 서로 돕음":"아래쪽(나→끝) 상생 — 동료·후배·자녀운이 열려 있음":isCeo?"Middle→end generating — the lower organization helps":"Below (self→end) generating — colleagues, juniors, children fortune open"]}),E.jsx("p",{style:{fontSize:"0.85rem",color:"#333",lineHeight:1.7,margin:0},children:S?isCeo?"가운데와 아래가 상생이라 하부 조직이 서로 돕습니다.":"이름(나)과 아래가 상생이라 동료·후배·자녀운이 열려 있습니다.":isCeo?"Middle to end generates — the lower ranks support each other.":"Self→end is generating, so junior/children fortune is open."})]}),'
    'dn==="sg"&&E.jsxs("div",{"data-loc":"client/src/pages/EnglishName.tsx:dnSg",style:'
    + st
    + '"#fff1f2",borderRadius:"0.5rem",border:"1px solid #fda4af"},children:[E.jsxs("div",{style:{fontWeight:700,fontSize:"0.88rem",color:"#991b1b",marginBottom:"0.3rem"},children:[S?isCeo?"가운데→아래 상극 — 하부 조직이 부딪침":"아래쪽(나→끝) 상극 — 동료·후배·자녀운이 막혀 있음":isCeo?"Middle→end controlling — the lower organization clashes":"Below (self→end) controlling — colleagues, juniors, children fortune blocked"]}),E.jsx("p",{style:{fontSize:"0.85rem",color:"#333",lineHeight:1.7,margin:0},children:S?isCeo?"가운데와 아래가 상극이라 하부 조직이 부딪칩니다.":"이름(나)과 아래가 상극이라 동료·후배·자녀운이 막혀 있습니다.":isCeo?"Middle to end controls — the lower ranks clash.":"Self→end is controlling, so junior/children fortune is blocked."})]}),'
    '(isCeo&&N&&Y&&K&&sgMap[N]===Y&&sgMap[N]===K)&&E.jsxs("div",{"data-loc":"client/src/pages/EnglishName.tsx:ceoBurden",style:'
    + st
    + '"#fff1f2",borderRadius:"0.5rem",border:"2px solid #991b1b"},children:[E.jsxs("div",{style:{fontWeight:700,fontSize:"0.88rem",color:"#991b1b",marginBottom:"0.3rem"},children:[S?"사장·회장급 — 감당 부담":"CEO / Chair — doubled burden"]}),E.jsx("p",{style:{fontSize:"0.85rem",color:"#333",lineHeight:1.7,margin:0},children:S?"나(위쪽)가 아래쪽 같은 기운을 한꺼번에 극하는 형국입니다. 감당해야 할 기운이 두 겹이라 부담이 훨씬 큽니다.":"The self (Last) controls the same element in both the middle and the end — the load is twice as heavy."})]}),'
    'E.jsxs("div",{"data-loc":"client/src/pages/EnglishName.tsx:wealth"'
)

etnx = once(etnx, rel_old, rel_new, "en rel cards")

kw5_path.write_text(kw5, encoding="utf-8")
etnx_path.write_text(etnx, encoding="utf-8")
print("kw intro ceo", kw5.count("사장·회장급은 위쪽"))
print("kw dual 겉으로는", kw5.count("겉으로는 유산상속"))
print("kw share rk native", kw5.count('g.set("rk",t.rank'))
print("en upSg", etnx.count("EnglishName.tsx:upSg"))
print("en dnSg", etnx.count("EnglishName.tsx:dnSg"))
print("en ceoBurden", etnx.count("EnglishName.tsx:ceoBurden"))
print("en 유산상속", etnx.count("유산상속"))
