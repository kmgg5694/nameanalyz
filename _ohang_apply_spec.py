# Apply 이름풀이_오행해석_수정요청 (1).md
# Korean: delete dead Td/Nd/A6/R6 강약 tables (new UI already present).
# English: restore count 강/약, then 가운데 + 상생상극 + 재물운 + 왕따.
from pathlib import Path

root = Path(r"C:\Users\a8071\Projects\nameanalyz")
kw5_path = root / "assets" / "index-kw5.js"
etnx_path = root / "assets" / "index-eTNXNndF.js"
kw5 = kw5_path.read_text(encoding="utf-8")
etnx = etnx_path.read_text(encoding="utf-8")


def extract_obj(s, start_eq):
    i = s.find("{", start_eq)
    depth = 0
    in_str = None
    esc = False
    for k, ch in enumerate(s[i:], i):
        if in_str:
            if esc:
                esc = False
            elif ch == "\\":
                esc = True
            elif ch == in_str:
                in_str = None
            continue
        if ch in ("'", '"', "`"):
            in_str = ch
            continue
        if ch == "{":
            depth += 1
        elif ch == "}":
            depth -= 1
            if depth == 0:
                return k + 1
    raise SystemExit("unbalanced object")


# --- Korean: remove unused 강약 tables ---
td = kw5.find(",Td={")
nd = kw5.find(",Nd={", td)
a6 = kw5.find(",A6={", nd)
r6 = kw5.find(",R6={", a6)
if min(td, nd, a6, r6) < 0:
    raise SystemExit(f"table markers missing td={td} nd={nd} a6={a6} r6={r6}")
r6_end = extract_obj(kw5, r6)
tables = kw5[td:r6_end]
assert "기운이 강합니다" in tables and "기운이 없습니다" in tables
assert kw5[r6_end:r6_end + 20].startswith(";function yg"), kw5[r6_end:r6_end + 40]
assert kw5.count("Td[") == 0 and kw5.count("Nd[") == 0
kw5 = kw5[:td] + kw5[r6_end:]
print("kw5 removed Td/Nd/A6/R6", r6_end - td, "chars")

# --- English patches ---
old793 = '["★ ",S?"이름(나)이 겉으로 드러내는 기운":"The energy this given name shows outwardly",": ",E.jsx("strong",{"data-loc":"client/src/pages/EnglishName.tsx:794",style:{color:mt[w.dominant]},children:se(w.firstRep)}),S?` — 이름(나)이 ${We[w.firstRep]}의 성질을 겉으로 드러냅니다.`:` — This given name shows ${Ie[w.firstRep]} (${w.firstRep}) outwardly.`]'
new793 = '["★ ",S?`${We[w.dominant]} 기운이 강합니다`:`Strong ${Ie[w.dominant]} (${w.dominant}) Energy`,": ",E.jsx("strong",{"data-loc":"client/src/pages/EnglishName.tsx:794",style:{color:mt[w.dominant]},children:se(w.dominant)}),S?` — 이 이름에서 ${We[w.dominant]}의 기운을 ${w.ohangCounts[w.dominant]}개로 가장 많이 받습니다.`:` — This name carries the most ${Ie[w.dominant]} energy (${w.ohangCounts[w.dominant]}x).`]'
if old793 not in etnx:
    raise SystemExit("793 block not found")
etnx = etnx.replace(old793, new793, 1)
print("patched 793 강합니다")

# Drop the Last-vs-First paragraph that currently sits BEFORE 강약 cards.
p799 = etnx.find('E.jsxs("p",{"data-loc":"client/src/pages/EnglishName.tsx:799"')
p815 = etnx.find('E.jsxs("div",{"data-loc":"client/src/pages/EnglishName.tsx:815"')
if p799 < 0 or p815 < 0 or p815 <= p799:
    raise SystemExit(f"799/815 markers p799={p799} p815={p815}")
assert "양부모·관청" in etnx[p799:p815]
etnx = etnx[:p799] + etnx[p815:]
print("removed 799 relationship paragraph (moved after 강약)")

old815_title = '["🌟 ",S?`${We[w.firstRep]} — 겉으로 드러내는 기운`:`${Ie[w.firstRep]} (${w.firstRep}) — energy shown outwardly`]'
new815_title = '["🌟 ",S?`${We[w.dominant]} 기운이 강합니다`:`Strong ${Ie[w.dominant]} (${w.dominant}) Energy`,E.jsxs("span",{"data-loc":"client/src/pages/EnglishName.tsx:816b",style:{marginLeft:"0.5rem",fontSize:"0.8rem",fontWeight:400,color:"#666"},children:["(",w.ohangCounts[w.dominant],S?"개":"x",")"]})]'
if old815_title not in etnx:
    raise SystemExit("815 title not found")
etnx = etnx.replace(old815_title, new815_title, 1)
print("patched 815 title")

old815_body = '(S?{木:"성장과 시작을 이끄는 추진력을 겉으로 드러내는 사람입니다.",火:"열정과 표현력, 활동성과 사교성을 겉으로 드러내는 사람입니다.",土:"안정과 중재, 신뢰와 포용을 겉으로 드러내는 사람입니다.",金:"결단력과 원칙, 절제와 완성을 겉으로 드러내는 사람입니다.",水:"유연성과 지혜, 적응력과 소통을 겉으로 드러내는 사람입니다."}:{木:"This name shows Wood outwardly — growth, beginnings, and forward drive.",火:"This name shows Fire outwardly — passion, expression, and sociability.",土:"This name shows Earth outwardly — stability, mediation, and trust.",金:"This name shows Metal outwardly — decisiveness, principle, and completion.",水:"This name shows Water outwardly — flexibility, wisdom, and communication."})[w.firstRep]'
new815_body = '(S?uy[w.dominant]:cy[w.dominant]).map((Y,K)=>E.jsx("p",{"data-loc":"client/src/pages/EnglishName.tsx:817",style:{fontSize:"0.88rem",color:"#222",margin:"0.2rem 0",lineHeight:1.6},children:Y},K))'
if old815_body not in etnx:
    raise SystemExit("815 body not found")
etnx = etnx.replace(old815_body, new815_body, 1)
print("patched 815 body -> uy/cy 강약")

old_iife_f = "B=x.filter(N=>w.ohangCounts[N]>=3&&N!==w.dominant),z=x.filter(N=>!1)"
new_iife_f = "B=x.filter(N=>w.ohangCounts[N]>=3&&N!==w.dominant),z=x.filter(N=>w.ohangCounts[N]===0)"
if old_iife_f not in etnx:
    raise SystemExit("IIFE filter not found")
etnx = etnx.replace(old_iife_f, new_iife_f, 1)
print("re-enabled missing 오행 약/없음")

old_dom_title = 'S?`${We[N]} — 겉으로 드러내는 기운`:`${Ie[N]} (${N}) — energy shown outwardly`'
new_dom_title = 'S?`${We[N]} 기운이 강합니다`:`Strong ${Ie[N]} (${N}) Energy`'
if old_dom_title not in etnx:
    raise SystemExit("IIFE dominant title not found")
etnx = etnx.replace(old_dom_title, new_dom_title, 1)
print("patched extra >=3 titles to 강합니다")

old_miss_title = 'S?`${We[N]} 기운 결핍`:`Missing ${Ie[N]} (${N}) Energy`'
new_miss_title = 'S?`${We[N]} 기운이 약합니다`:`Weak / missing ${Ie[N]} (${N}) Energy`'
if old_miss_title not in etnx:
    raise SystemExit("missing title not found")
etnx = etnx.replace(old_miss_title, new_miss_title, 1)
print("patched missing titles to 약합니다")

# 880 IIFE: always 2 relationships, directional 상생/상극 counts, 가운데 성질, 재물운, 왕따
old_880_head = '(()=>{const x={木:"土",土:"水",水:"火",火:"金",金:"木"},B=(Le,Ye)=>x[Le]===Ye||x[Ye]===Le,z=!!w.middleName,N=w.lastRep,Y=w.firstRep,K=z?w.middleRep:null,I=B(N,Y),fe=K?B(Y,K):!1,be={木:"🌳",火:"🔥",土:"🌍",金:"⚙️",水:"💧"};return E.jsxs("div",{"data-loc":"client/src/pages/EnglishName.tsx:880"'
new_880_head = (
    '(()=>{const ssMap={木:"火",火:"土",土:"金",金:"水",水:"木"},sgMap={木:"土",土:"水",水:"火",火:"金",金:"木"},'
    'rel=(Le,Ye)=>!Le||!Ye||Le===Ye?"bi":ssMap[Le]===Ye||ssMap[Ye]===Le?"ss":"sg",'
    'N=w.lastRep,Y=w.firstRep,'
    'belowLetter=w.firstOhangs&&w.firstOhangs.length?w.firstOhangs[w.firstOhangs.length-1]:null,'
    'K=w.middleRep||(belowLetter?belowLetter.ohang:null),'
    'belowName=w.middleName||(belowLetter?belowLetter.letter:""),'
    'up=rel(N,Y),dn=K?rel(Y,K):null,'
    'ssN=(up==="ss"?1:0)+(dn==="ss"?1:0),sgN=(up==="sg"?1:0)+(dn==="sg"?1:0),'
    'I=up==="sg",fe=dn==="sg",wealthOk=ssN>=2,bully=sgN>=2,'
    'be={木:"🌳",火:"🔥",土:"🌍",金:"⚙️",水:"💧"},'
    'midKo={木:"성장과 시작을 이끄는 추진력을 겉으로 드러내는 사람입니다.",火:"열정과 표현력, 활동성과 사교성을 겉으로 드러내는 사람입니다.",土:"안정과 중재, 신뢰와 포용을 겉으로 드러내는 사람입니다.",金:"결단력과 원칙, 절제와 완성을 겉으로 드러내는 사람입니다.",水:"유연성과 지혜, 적응력과 소통을 겉으로 드러내는 사람입니다."},'
    'midEn={木:"Wood energy — growth, beginnings, and forward drive.",火:"Fire energy — passion, expression, and sociability.",土:"Earth energy — stability, mediation, and trust.",金:"Metal energy — decisiveness, principle, and completion.",水:"Water energy — flexibility, wisdom, and communication."};'
    'return E.jsxs("div",{"data-loc":"client/src/pages/EnglishName.tsx:880"'
)
if old_880_head not in etnx:
    raise SystemExit("880 head not found")
etnx = etnx.replace(old_880_head, new_880_head, 1)
print("patched 880 head (2-rel + counts)")

# Show last-letter label instead of middleName when no middle
old_mid_label = 'E.jsxs("span",{"data-loc":"client/src/pages/EnglishName.tsx:924",style:{fontSize:"0.8rem",color:"#555"},children:["(",w.middleName,")"]})'
new_mid_label = 'E.jsxs("span",{"data-loc":"client/src/pages/EnglishName.tsx:924",style:{fontSize:"0.8rem",color:"#555"},children:["(",belowName,")"]})'
if old_mid_label not in etnx:
    raise SystemExit("middleName label not found")
etnx = etnx.replace(old_mid_label, new_mid_label, 1)

# Insert 가운데 성질 + 상생 원활 + 재물운 + 왕따 after the 980 원활 card.
# Find unique 980 closing then the 935/880 closings: }]})]})})(),E.jsxs("div"...997
old_980_end = (
    'S?`위쪽(${We[N]})·나(${We[Y]})${K?`·아래쪽(${We[K]})`:""} 사이에 극 관계가 없습니다. 배우자운·부모 관계${K?"·자녀운":""}이 원활하게 흐릅니다.`:'
    '`No Controlling relationship exists between Above (${Ie[N]} ${N}) · Self (${Ie[Y]} ${Y})${K?` · Below (${Ie[K]} ${K})`:""}. Spouse fortune, parental relationships${K?", and children fortune":""} flow harmoniously.`})]})]})]})})()'
)
insert_after_980 = (
    'S?`위쪽(${We[N]})·나(${We[Y]})${K?`·아래쪽(${We[K]})`:""} 사이에 극 관계가 없습니다. 배우자운·부모 관계${K?"·자녀운":""}이 원활하게 흐릅니다.`:'
    '`No Controlling relationship exists between Above (${Ie[N]} ${N}) · Self (${Ie[Y]} ${Y})${K?` · Below (${Ie[K]} ${K})`:""}. Spouse fortune, parental relationships${K?", and children fortune":""} flow harmoniously.`})]}),'
    'E.jsxs("div",{"data-loc":"client/src/pages/EnglishName.tsx:midSelf",style:{padding:"0.6rem 0.75rem",backgroundColor:`${mt[Y]}14`,borderRadius:"0.5rem",border:`2px solid ${mt[Y]}`},children:['
    'E.jsxs("div",{style:{fontWeight:700,fontSize:"0.88rem",color:mt[Y],marginBottom:"0.3rem"},children:[S?`가운데(나) ${We[Y]} — 이 사람이 겉으로 드러내는 기운`:`Middle (self) ${Ie[Y]} (${Y}) — energy shown outwardly`]}),'
    'E.jsx("p",{style:{fontSize:"0.85rem",color:"#333",lineHeight:1.7,margin:0},children:S?midKo[Y]:midEn[Y]})]}),'
    'up==="ss"&&E.jsxs("div",{"data-loc":"client/src/pages/EnglishName.tsx:upSs",style:{padding:"0.6rem 0.75rem",backgroundColor:"#f0fdf4",borderRadius:"0.5rem",border:"1px solid #86efac"},children:['
    'E.jsxs("div",{style:{fontWeight:700,fontSize:"0.88rem",color:"#166534",marginBottom:"0.3rem"},children:[S?"위쪽(성→나) 상생 — 양부모·관청·선배·배우자 운이 원활함":"Above (Last→First) generating — parents, workplace, seniors, spouse fortune flow"]}),'
    'E.jsx("p",{style:{fontSize:"0.85rem",color:"#333",lineHeight:1.7,margin:0},children:S?"성(위)과 이름(나)이 상생이라 윗사람 운이 열려 있습니다.":"Last→First is generating, so senior/spouse fortune is open."})]}),'
    'dn==="ss"&&E.jsxs("div",{"data-loc":"client/src/pages/EnglishName.tsx:dnSs",style:{padding:"0.6rem 0.75rem",backgroundColor:"#f0fdf4",borderRadius:"0.5rem",border:"1px solid #86efac"},children:['
    'E.jsxs("div",{style:{fontWeight:700,fontSize:"0.88rem",color:"#166534",marginBottom:"0.3rem"},children:[S?"아래쪽(나→끝) 상생 — 동료·후배·자녀운이 열려 있음":"Below (self→end) generating — colleagues, juniors, children fortune open"]}),'
    'E.jsx("p",{style:{fontSize:"0.85rem",color:"#333",lineHeight:1.7,margin:0},children:S?"이름(나)과 아래가 상생이라 아랫사람 운이 열려 있습니다.":"Self→end is generating, so junior/children fortune is open."})]}),'
    'E.jsxs("div",{"data-loc":"client/src/pages/EnglishName.tsx:wealth",style:{padding:"0.6rem 0.75rem",backgroundColor:wealthOk?"#f0fdf4":"#fff7ed",borderRadius:"0.5rem",border:wealthOk?"2px solid #166534":"2px solid #c2410c"},children:['
    'E.jsxs("div",{style:{fontWeight:700,fontSize:"0.88rem",color:wealthOk?"#166534":"#c2410c",marginBottom:"0.3rem"},children:[S?`재물운 보존력 — 상생 ${ssN}/2`:`Wealth preservation — generating ${ssN}/2`]}),'
    'E.jsx("p",{style:{fontSize:"0.85rem",color:"#333",lineHeight:1.7,margin:0},children:wealthOk?(S?"상생 2개 — 재물운을 키우고 지켜 나갈 수 있는 이름입니다.":"Two generating links — this name can grow and keep wealth."):(S?"상생이 1개 이하입니다. 사주에 아무리 큰 재물운이 있어도 이름이 뒷받침하지 못해 밥이나 먹고 사는 수준에 그칩니다. 나쁜 이름을 가진 사람은 수백억 유산을 상속받아도 지키지 못하고 나락으로 떨어질 수 있습니다.":"One or zero generating links — even a strong natal wealth luck is cut down by the name. A poor name can fail to keep a large inheritance.")})]}),'
    'bully&&E.jsxs("div",{"data-loc":"client/src/pages/EnglishName.tsx:bully",style:{padding:"0.6rem 0.75rem",backgroundColor:"#fff1f2",borderRadius:"0.5rem",border:"2px solid #dc2626"},children:['
    'E.jsxs("div",{style:{fontWeight:700,fontSize:"0.88rem",color:"#dc2626",marginBottom:"0.3rem"},children:[S?`상극 ${sgN}/2 — 왕따 위험`:`Controlling ${sgN}/2 — bullying risk`]}),'
    'E.jsx("p",{style:{fontSize:"0.85rem",color:"#333",lineHeight:1.7,margin:0},children:S?"위·아래가 모두 상극인 이름은 학창시절 왕따를 당하기 쉬운 기운입니다.":"Both links controlling — this name is prone to isolation or bullying at school."})]})'
    ']})]})})()'
)
if old_980_end not in etnx:
    raise SystemExit("980 end not found")
etnx = etnx.replace(old_980_end, insert_after_980, 1)
print("inserted 가운데/상생원활/재물운/왕따")

# Verify
kw5_n = {
    "기운이 강합니다": kw5.count("기운이 강합니다"),
    "Td={": kw5.count("Td={"),
    "ohangExt": kw5.count("ohangExt"),
    "재물운 보존력": kw5.count("재물운 보존력"),
    "j6": kw5.count("function j6("),
    "B6": kw5.count("function B6("),
}
etnx_n = {
    "기운이 강합니다": etnx.count("기운이 강합니다"),
    "기운이 약합니다": etnx.count("기운이 약합니다"),
    "재물운 보존력": etnx.count("재물운 보존력"),
    "midSelf": etnx.count("EnglishName.tsx:midSelf"),
    "ohangCounts[N]===0": etnx.count("ohangCounts[N]===0"),
    "겉으로 드러내는 기운": etnx.count("겉으로 드러내는 기운"),
}
print("kw5", kw5_n)
print("etnx", etnx_n)
assert kw5_n["기운이 강합니다"] == 0, kw5_n
assert kw5_n["Td={"] == 0
assert kw5_n["ohangExt"] == 1
assert etnx_n["기운이 강합니다"] >= 5
assert etnx_n["재물운 보존력"] >= 1
assert etnx_n["ohangCounts[N]===0"] == 1
assert etnx_n["midSelf"] == 1

kw5_path.write_text(kw5, encoding="utf-8")
etnx_path.write_text(etnx, encoding="utf-8")
print("wrote kw5", len(kw5), "etnx", len(etnx))
