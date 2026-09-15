# -*- coding: utf-8 -*-
"""Apply 이름풀이_오행해석_수정요청 (4).md — 직위, 겉/속, 연락처, 영어 다수-중심. 수리·괘는 그대로."""
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


# ---------- Korean state: rank ----------
kw5 = once(
    kw5,
    'const co=G.get("gender")||"male",wo=G.get("hc")||",,",_o=G.get("ho")||",,",No=G.get("hs")||"0,0,0",Mo=wo.split(","),Ro=_o.split(","),Tn=No.split(",").map(an=>an==="0"?"":Number(an));return{name:mo,gender:co,hanjaChars:Mo,hanjaOhang:Ro,hanjaManualStrokes:Tn}',
    'const co=G.get("gender")||"male",rk=G.get("rk")==="ceo"?"ceo":"staff",wo=G.get("hc")||",,",_o=G.get("ho")||",,",No=G.get("hs")||"0,0,0",Mo=wo.split(","),Ro=_o.split(","),Tn=No.split(",").map(an=>an==="0"?"":Number(an));return{name:mo,gender:co,rank:rk,hanjaChars:Mo,hanjaOhang:Ro,hanjaManualStrokes:Tn}',
    "url init rank",
)
kw5 = once(
    kw5,
    'return{name:"",gender:"male",hanjaOhang:["","",""],hanjaChars:["","",""],hanjaManualStrokes:["","",""]}',
    'return{name:"",gender:"male",rank:"staff",hanjaOhang:["","",""],hanjaChars:["","",""],hanjaManualStrokes:["","",""]}',
    "empty init rank",
)
kw5 = once(
    kw5,
    'u({name:"",gender:"male",hanjaOhang:["","",""],hanjaChars:["","",""],hanjaManualStrokes:["","",""]})',
    'u({name:"",gender:"male",rank:"staff",hanjaOhang:["","",""],hanjaChars:["","",""],hanjaManualStrokes:["","",""]})',
    "tab reset rank",
)
kw5 = once(
    kw5,
    'g.set("name",a.name),g.set("gender",a.gender),g.set("hc",a.hanjaChars.join(","))',
    'g.set("name",a.name),g.set("gender",a.gender),g.set("rk",a.rank||"staff"),g.set("hc",a.hanjaChars.join(","))',
    "share url rk",
)

rank_ui = (
    'children:G==="male"?"👨 남성":"👩 여성"},G))})]}),'
    'm.jsxs("div",{"data-loc":"client/src/pages/Home.tsx:rank",children:['
    'm.jsx("label",{"data-loc":"client/src/pages/Home.tsx:rankL",className:"block text-sm font-medium mb-2 gold-text",children:"현재 직위"}),'
    'm.jsx("div",{"data-loc":"client/src/pages/Home.tsx:rankB",className:"flex gap-3",children:["staff","ceo"].map(G=>m.jsx("button",{"data-loc":"client/src/pages/Home.tsx:rankBtn",type:"button",onClick:()=>u(mo=>({...mo,rank:G})),className:`flex-1 py-2 rounded border text-sm transition-colors ${(t.rank||"staff")===G?"border-primary gold-text bg-primary/10":"border-border text-muted-foreground hover:border-primary/50"}`,children:G==="staff"?"일반직":"사장·회장급"},G))})]})'
)

kw5 = once(
    kw5,
    'children:G==="male"?"👨 남성":"👩 여성"},G))})]})',
    rank_ui,
    "rank buttons after gender",
)

# ---------- Korean 오행 block: 겉/속 + 직위 + 문구 ----------
iife_start = kw5.find("한글이름의 오행 관계를 보면")
if iife_start < 0:
    raise SystemExit("hangul ohang sentence missing")
p_start = kw5.rfind("m.jsxs(\"p\"", 0, iife_start)
if p_start < 0:
    raise SystemExit("hangul ohang p missing")
iife_end_mark = 'Home.tsx:1288",className:"mt-3 space-y-2",children:cards})})()'
end = kw5.find(iife_end_mark, p_start)
if end < 0:
    raise SystemExit("ohang iife end missing")
end += len(iife_end_mark)

card = (
    'style:{padding:"0.65rem 0.85rem",backgroundColor:BG,borderRadius:"0.5rem",border:BD},children:['
    'm.jsxs("div",{style:{fontWeight:700,fontSize:"0.88rem",color:TC,marginBottom:"0.3rem"},children:TTL}),'
    'm.jsx("p",{style:{fontSize:"0.84rem",color:"#333",margin:"0.1rem 0",lineHeight:1.6},children:BDY})'
)

new_ohang = r'''(()=>{const isCeo=(t.rank||"staff")==="ceo",selfHg=isCeo?K[0]:K[1],selfHj=q?t.hanjaOhang[isCeo?0:1]:null,nm={木:"木(목)",火:"火(화)",土:"土(토)",金:"金(금)",水:"水(수)"},ext={木:"성장과 시작을 이끄는 추진력을 겉으로 드러내는 사람입니다.",火:"열정과 표현력, 활동성과 사교성을 겉으로 드러내는 사람입니다.",土:"안정과 중재, 신뢰와 포용을 겉으로 드러내는 사람입니다.",金:"결단력과 원칙, 절제와 완성을 겉으로 드러내는 사람입니다.",水:"유연성과 지혜, 적응력과 소통을 겉으로 드러내는 사람입니다."},inn={木:"내면에서 성장·시작·확장의 힘이 움직입니다.",火:"내면에서 열정·표현·활동의 힘이 움직입니다.",土:"내면에서 안정·신뢰·포용의 힘이 움직입니다.",金:"내면에서 결단·원칙·절제의 힘이 움직입니다.",水:"내면에서 지혜·유연·소통의 힘이 움직입니다."},cards=[],relN=q?4:2,wealthOk=q?M>=3:M>=2,bully=q?z>=3:z>=2,balanced=q?M===2&&z===2:M===1&&z===1,upHg=W,dnHg=_,upHj=q?L:null,dnHj=q?eo:null,sgOf=G=>G&&_r[G],ssOf=G=>G&&Nr[G],hitCount=(me,a,b)=>{let n=0;const x=sgOf(me);if(x&&a===x)n++;if(x&&b===x)n++;return n},mk=(key,ttl,bdy,ok)=>{const col=ok===1?"#166534":ok===-1?"#991b1b":"#92400e",bg=ok===1?"#f0fdf4":ok===-1?"#fff1f2":"#fffbeb",bd=ok===1?"2px solid #166534":ok===-1?"2px solid #991b1b":"2px solid #a16207";cards.push(m.jsxs("div",{"data-loc":"client/src/pages/Home.tsx:"+key,style:{padding:"0.65rem 0.85rem",backgroundColor:bg,borderRadius:"0.5rem",border:bd},children:[m.jsx("div",{style:{fontWeight:700,fontSize:"0.88rem",color:col,marginBottom:"0.3rem"},children:ttl}),m.jsx("p",{style:{fontSize:"0.84rem",color:"#333",margin:"0.1rem 0",lineHeight:1.6},children:bdy})]},key))},tone=G=>G==="sangsaeng"?1:G==="sanggeuk"?-1:0,staffUp={ss:"유산상속·공무원·선배의 도움·배우자운이 원활합니다.",sg:"유산상속·공무원(직장/윗사람)·선배의 도움·배우자운이 막혀서 풀리지 않습니다.",bi:"유산상속·공무원·선배의 도움·배우자운이 경우에 따라 다르게 작용합니다."},staffDn={ss:"동료·후배·자녀운이 열려 있습니다.",sg:"동료·후배·자녀운이 막혀 있습니다.",bi:"동료·후배·자녀운이 경우에 따라 다르게 작용합니다."},ceoUp={ss:"나(위)와 가운데가 상생이라 조직·부하를 이끄는 기운이 원활합니다.",sg:"나(위)가 가운데를 극하는 형국이라 부하·실무를 감당하는 부담이 있습니다.",bi:"나(위)와 가운데의 관계는 경우에 따라 다르게 작용합니다."},ceoDn={ss:"가운데와 아래가 상생이라 하부 조직이 서로 돕습니다.",sg:"가운데와 아래가 상극이라 하부 조직이 부딪칩니다.",bi:"가운데와 아래의 관계는 경우에 따라 다르게 작용합니다."},code=G=>G==="sangsaeng"?"ss":G==="sanggeuk"?"sg":"bi",upMap=isCeo?ceoUp:staffUp,dnMap=isCeo?ceoDn:staffDn,dual=(outer,inner,ssT,sgT)=>{if(!inner)return null;if(outer==="sanggeuk"&&inner==="sangsaeng")return"겉으로는 "+sgT.replace("습니다."," 보이지만")+", 속마음으로는 "+ssT;if(outer==="sangsaeng"&&inner==="sanggeuk")return"겉으로는 "+ssT.replace("습니다."," 보이지만")+", 속으로는 "+sgT;return null};if(selfHg&&ext[selfHg])mk("ohangExt",isCeo?["한글 위쪽 글자(나) ",nm[selfHg]," — 외부로 발현하는 기운"]:["한글 가운데 글자 ",nm[selfHg]," — 외부로 발현하는 기운"],ext[selfHg],1);if(selfHj&&inn[selfHj])mk("ohangInn",isCeo?["한자 위쪽 글자(나) ",nm[selfHj]," — 내적 기운"]:["한자 가운데 글자 ",nm[selfHj]," — 내적 기운"],inn[selfHj],1);(()=>{const d=dual(upHg,upHj,staffUp.ss,staffUp.sg),bothSg=upHg==="sanggeuk"&&upHj==="sanggeuk",bothSs=upHg==="sangsaeng"&&upHj==="sangsaeng";if(q&&d&&!isCeo)mk("ohangUpDual","위쪽(성→나) — 겉과 속이 다름",d,0);else if(q&&bothSs&&!isCeo)mk("ohangUpBothSs","위쪽(유산상속·공무원·선배·배우자)","한글·한자 위쪽이 모두 상생으로 일치합니다. 위쪽 관계가 뚜렷하게 열려 있습니다.",1);else if(q&&bothSg&&!isCeo)mk("ohangUpBothSg","위쪽(유산상속·공무원·선배·배우자)","오행이 나를 중심으로 한글·한문 위쪽이 막히면 유산상속, 공무원, 선배의 도움, 배우자운이 막혀서 풀리지 않습니다. 설령 결혼을 하였더라도 배우자가 일을 많이 저지르게 됩니다.",-1);else mk("ohangUpHg",isCeo?"한글 나(위)→가운데":"한글 위쪽(성→나)",upMap[code(upHg)],tone(upHg));if(q&&!(d&&!isCeo)&&!bothSg&&!bothSs)mk("ohangUpHj",isCeo?"한자 나(위)→가운데":"한자 위쪽(성→나)",upMap[code(upHj)],tone(upHj))})();(()=>{const d=dual(dnHg,dnHj,"잘 통하고 있습니다.","다소 닫혀 있습니다.");if(q&&d&&!isCeo)mk("ohangDnDual","아래쪽(나→끝) — 겉과 속이 다름","동료·후배·자녀와의 관계가 "+d.replace("잘 통하고 있습니다.","속마음으로는 잘 통하고 있습니다.").replace("겉으로는 다소 닫혀 있습니다.","겉으로는 다소 닫혀 보이지만"),0);else{mk("ohangDnHg",isCeo?"한글 가운데→아래":"한글 아래쪽(나→끝)",dnMap[code(dnHg)],tone(dnHg));if(q)mk("ohangDnHj",isCeo?"한자 가운데→아래":"한자 아래쪽(나→끝)",dnMap[code(dnHj)],tone(dnHj))}})();if(isCeo){const nHg=hitCount(selfHg,K[1],K[2]),nHj=selfHj?hitCount(selfHj,t.hanjaOhang[1],t.hanjaOhang[2]):0;if(nHg>=2||nHj>=2)mk("ohangCeoBurden","사장·회장급 — 감당 부담","나(위쪽)가 아래쪽 같은 기운을 한꺼번에 극하는 형국입니다. 감당해야 할 기운이 두 겹이라 부담이 훨씬 큽니다.",-1)}if(t.gender==="female"&&!isCeo&&(upHg==="sanggeuk"||q&&upHj==="sanggeuk")&&!(upHg==="sanggeuk"&&upHj==="sanggeuk"))mk("ohangFemale","배우자운","결혼 적령기 여성의 경우 위쪽 오행이 상극이면 배우자운이 막혀 결혼이 잘 되지 않는 원인이 될 수 있습니다.",-1);mk("ohangWealth",wealthOk?["재물운 보존력 — 상생 ",String(M),"개 (",q?"3개 이상":"2개",", 원활)"]:balanced?["상생 ",String(M),"개 · 상극 ",String(z),"개 — 중간"]:["재물운 보존력 — 상생 ",String(M),"개 (",q?"2개 이하":"부족",")"],wealthOk?(q?"상생이 3개 이상이므로 재물운을 키우고 지켜 나갈 수 있는 이름입니다.":"상생 2개이므로 재물운을 키우고 지켜 나갈 수 있는 이름입니다."):balanced?(q?"상생 2개·상극 2개로 딱 반반입니다. 재물운과 인간관계가 특별히 좋지도, 특별히 나쁘지도 않은 중간 상태입니다.":"상생 1개·상극 1개로 반반입니다. 좋지도 나쁘지도 않은 중간 상태입니다."):"상생이 2개 이하입니다. 사주에 아무리 큰 재물운이 있어도, 이름이 뒷받침하지 못해 그 크기가 크게 꺾여 밥이나 먹고 사는 수준에 그칩니다. 나쁜 이름을 가진 사람은 수백억 유산을 상속받아도 지키지 못하고 나락으로 떨어질 수 있습니다.",wealthOk?1:balanced?0:-1);bully&&mk("ohangBully",["상극 ",String(z),"개 (",q?"3개 이상":"2개",") — 왕따 위험"],q?"상극이 3개 이상인 이름은 학창시절 왕따를 당하기 쉬운 기운입니다.":"상극이 2개인 이름은 학창시절 왕따를 당하기 쉬운 기운입니다.",-1);return m.jsxs("div",{"data-loc":"client/src/pages/Home.tsx:1288",className:"mt-3 space-y-2",children:cards})})()'''

# Fix dual-down text: the dual() for down is messy. Let me simplify down dual in the IIFE.
# I'll rewrite that small part more clearly after testing... keep and refine dual for down:

kw5 = kw5[:p_start] + new_ohang + kw5[end:]
print("patched korean ohang block", end - p_start, "->", len(new_ohang))

# Footer contact on result end + site footer
phone_card = (
    'm.jsxs("div",{"data-loc":"client/src/pages/Home.tsx:ohangCall",className:"ink-card p-5 mt-4 text-center",style:{border:"2px solid oklch(0.55 0.12 68)",background:"oklch(0.98 0.01 75)"},children:[m.jsx("p",{style:{fontSize:"0.95rem",lineHeight:1.7,color:"#1c1917",fontWeight:600,margin:0},children:"자세한 이름풀이, 작명의뢰를 하시려는 분은 010-5694-7817로 연락 주세요."})]})'
)
kw5 = once(
    kw5,
    '})()]}):m.jsxs("div",{"data-loc":"client/src/pages/Home.tsx:718"',
    '})(),' + phone_card + ']}):m.jsxs("div",{"data-loc":"client/src/pages/Home.tsx:718"',
    "result phone card",
)
kw5 = once(
    kw5,
    'm.jsx("p",{"data-loc":"client/src/pages/Home.tsx:1727",children:"정확한 이름 감정은 전문가 상담을 권장합니다."})',
    'm.jsx("p",{"data-loc":"client/src/pages/Home.tsx:1727",children:"정확한 이름 감정은 전문가 상담을 권장합니다."}),m.jsx("p",{"data-loc":"client/src/pages/Home.tsx:1728",children:"자세한 이름풀이, 작명의뢰를 하시려는 분은 010-5694-7817로 연락 주세요."})',
    "site footer phone",
)

# ---------- English: majority vs center, rank, phone ----------
# 880: insert majority card after title, before midSelf. Also ceo self.
old_880_mid = 'children:["🔮 ",S?"오행 3자 구조 해설 (나를 중심으로)":"Three-Element Structure Analysis (Self-Centered)"]}),E.jsxs("div",{"data-loc":"client/src/pages/EnglishName.tsx:midSelf"'
new_880_mid = (
    'children:["🔮 ",S?"오행 3자 구조 해설 (나를 중심으로)":"Three-Element Structure Analysis (Self-Centered)"]}),'
    '(w.dominant&&w.firstRep&&w.dominant!==w.firstRep&&ssMap[w.dominant]===w.firstRep)&&E.jsxs("div",{"data-loc":"client/src/pages/EnglishName.tsx:domGen",style:{padding:"0.6rem 0.75rem",marginBottom:"0.75rem",backgroundColor:"#f0fdf4",borderRadius:"0.5rem",border:"2px solid #166534"},children:[E.jsxs("div",{style:{fontWeight:700,fontSize:"0.88rem",color:"#166534",marginBottom:"0.3rem"},children:[S?"다수오행이 대표중심오행을 생(生)합니다":"Majority element generates the center"]}),E.jsx("p",{style:{fontSize:"0.85rem",color:"#333",lineHeight:1.7,margin:0},children:S?`이름 전체에 가장 많은 ${We[w.dominant]} 기운이 가운데(나) ${We[w.firstRep]}를 생하여, 외부 기운이 본인을 도와줍니다.`:`The majority ${Ie[w.dominant]} generates the center ${Ie[w.firstRep]}, so the name’s outer energy supports the self.`}])]}),'
    '(w.dominant&&w.firstRep&&sgMap[w.dominant]===w.firstRep)&&E.jsxs("div",{"data-loc":"client/src/pages/EnglishName.tsx:domCtl",style:{padding:"0.6rem 0.75rem",marginBottom:"0.75rem",backgroundColor:"#fff1f2",borderRadius:"0.5rem",border:"2px solid #991b1b"},children:[E.jsxs("div",{style:{fontWeight:700,fontSize:"0.88rem",color:"#991b1b",marginBottom:"0.3rem"},children:[S?"다수오행이 대표중심오행을 극(剋)합니다":"Majority element controls the center"]}),E.jsx("p",{style:{fontSize:"0.85rem",color:"#333",lineHeight:1.7,margin:0},children:S?`이름 전체에 넘치는 ${We[w.dominant]} 기운이 가운데(나) ${We[w.firstRep]}를 극하여, 스스로 내 몸을 치는 형국입니다.`:`The majority ${Ie[w.dominant]} controls the center ${Ie[w.firstRep]} — the overflowing energy turns against the self.`}])]}),'
    'E.jsxs("div",{"data-loc":"client/src/pages/EnglishName.tsx:midSelf"'
)
etnx = once(etnx, old_880_mid, new_880_mid, "en majority-center cards")

# English rank on form: loc 595 container, look for Last / First fields around 602
# Find a unique gender-like or name-row close.
en_rank_anchor = etnx.find('EnglishName.tsx:646"')
print("en 646", en_rank_anchor)

# Add rank to english analysis object if it has a visible form state.
# Search lastName useState
idx = etnx.find("lastName:")
print("lastName:", idx, "count", etnx.count("lastName"))

phone_en = (
    'E.jsxs("div",{"data-loc":"client/src/pages/EnglishName.tsx:ohangCall",style:{marginTop:"1.25rem",padding:"1rem",textAlign:"center",backgroundColor:"#f5f3ff",border:"2px solid #7c3aed",borderRadius:"0.75rem"},children:[E.jsx("p",{style:{fontSize:"0.95rem",lineHeight:1.7,color:"#1c1917",fontWeight:600,margin:0},children:S?"자세한 이름풀이, 작명의뢰를 하시려는 분은 010-5694-7817로 연락 주세요.":"For a detailed reading or naming request, call 010-5694-7817."})]})'
)

# Insert English phone near existing footer-ish text
if "010-5694-7817" not in etnx:
    # after 880 IIFE close: `})()]}),E.jsxs("div",{"data-loc":"client/src/pages/EnglishName.tsx:997"` or similar
    mark = etnx.find("EnglishName.tsx:997")
    mark2 = etnx.find("EnglishName.tsx:1043")
    print("en 997", mark, "1043", mark2)
    # put after the 880 block's closing })()
    close880 = "})()]}),E.jsxs(\"div\",{\"data-loc\":\"client/src/pages/EnglishName.tsx:"
    # find first such after midSelf
    i = etnx.find("EnglishName.tsx:midSelf")
    j = etnx.find("})()", i)
    print("after midSelf })()", j)
    # safer: unique wealth/bully end of 880
    if "학창시절 왕따" in etnx:
        k = etnx.find("학창시절 왕따")
        print("왕따 pos", k)

kw5_path.write_text(kw5, encoding="utf-8")
etnx_path.write_text(etnx, encoding="utf-8")
print("wrote kw5", len(kw5), "etnx", len(etnx))
print("kw5 phone", kw5.count("010-5694-7817"), "rank btn", kw5.count("사장·회장급"), "dual", kw5.count("겉으로는"), "bothSg", kw5.count("설령 결혼을"))
print("etnx gen", etnx.count("다수오행이 대표중심오행을 생"), "ctl", etnx.count("스스로 내 몸을 치는"))
