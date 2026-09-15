# -*- coding: utf-8 -*-
from pathlib import Path

etnx_path = Path(r"C:\Users\a8071\Projects\nameanalyz\assets\index-eTNXNndF.js")
etnx = etnx_path.read_text(encoding="utf-8")


def once(s, old, new, label):
    n = s.count(old)
    if n != 1:
        raise SystemExit(f"{label}: count={n}")
    return s.replace(old, new, 1)


etnx = once(
    etnx,
    '[O,A]=j.useState(_sp.get("result")==="1"&&!!_sp.get("ln")&&!!_sp.get("fn")),[R,D]=j.useState("en")',
    '[O,A]=j.useState(_sp.get("result")==="1"&&!!_sp.get("ln")&&!!_sp.get("fn")),[rk,setRk]=j.useState(_sp.get("rk")==="ceo"?"ceo":"staff"),[R,D]=j.useState("en")',
    "en rank state",
)

etnx = once(
    etnx,
    'g.set("result","1")}var shareUrl=n&&s?',
    'g.set("result","1");g.set("rk",rk)}var shareUrl=n&&s?',
    "en share rk",
)

rank_ui = (
    'boxSizing:"border-box"}})]})]}),'
    'E.jsxs("div",{"data-loc":"client/src/pages/EnglishName.tsx:rank",style:{marginBottom:"1rem"},children:['
    'E.jsx("div",{style:{fontSize:"0.8rem",fontWeight:600,color:"#5c2d00",marginBottom:"0.4rem"},children:S?"현재 직위":"Current position"}),'
    'E.jsxs("div",{style:{display:"flex",gap:"0.75rem"},children:['
    'E.jsx("button",{type:"button",onClick:()=>setRk("staff"),style:{flex:1,padding:"0.55rem 0.5rem",border:rk!=="ceo"?"2px solid #7c3aed":"2px solid #aaa",borderRadius:"0.4rem",background:rk!=="ceo"?"#f5f3ff":"#fff",color:"#5b21b6",fontWeight:700,cursor:"pointer"},children:S?"일반직":"Staff"}),'
    'E.jsx("button",{type:"button",onClick:()=>setRk("ceo"),style:{flex:1,padding:"0.55rem 0.5rem",border:rk==="ceo"?"2px solid #7c3aed":"2px solid #aaa",borderRadius:"0.4rem",background:rk==="ceo"?"#f5f3ff":"#fff",color:"#5b21b6",fontWeight:700,cursor:"pointer"},children:S?"사장·회장급":"CEO / Chair"})]})]}),'
    'E.jsxs("div",{"data-loc":"client/src/pages/EnglishName.tsx:642"'
)
etnx = once(
    etnx,
    'boxSizing:"border-box"}})]})]}),E.jsxs("div",{"data-loc":"client/src/pages/EnglishName.tsx:642"',
    rank_ui,
    "en rank buttons",
)

etnx = once(
    etnx,
    'rel=(Le,Ye)=>!Le||!Ye||Le===Ye?"bi":ssMap[Le]===Ye||ssMap[Ye]===Le?"ss":"sg",N=w.lastRep,Y=w.firstRep,',
    'rel=(Le,Ye)=>!Le||!Ye||Le===Ye?"bi":ssMap[Le]===Ye||ssMap[Ye]===Le?"ss":"sg",isCeo=rk==="ceo",N=w.lastRep,Y=w.firstRep,center=isCeo?N:Y,',
    "en 880 isCeo center",
)

# majority cards used w.firstRep — switch to center
etnx = once(
    etnx,
    "(w.dominant&&w.firstRep&&w.dominant!==w.firstRep&&ssMap[w.dominant]===w.firstRep)",
    "(w.dominant&&center&&w.dominant!==center&&ssMap[w.dominant]===center)",
    "en dom gen center",
)
etnx = once(
    etnx,
    "(w.dominant&&w.firstRep&&sgMap[w.dominant]===w.firstRep)",
    "(w.dominant&&center&&sgMap[w.dominant]===center)",
    "en dom ctl center",
)
etnx = once(
    etnx,
    "`이름 전체에 가장 많은 ${We[w.dominant]} 기운이 가운데(나) ${We[w.firstRep]}를 생하여, 외부 기운이 본인을 도와줍니다.`:`The majority ${Ie[w.dominant]} generates the center ${Ie[w.firstRep]}, so the name’s outer energy supports the self.`",
    "`이름 전체에 가장 많은 ${We[w.dominant]} 기운이 대표중심(나) ${We[center]}를 생하여, 외부 기운이 본인을 도와줍니다.`:`The majority ${Ie[w.dominant]} generates the center ${Ie[center]}, so the name’s outer energy supports the self.`",
    "en gen copy center",
)
etnx = once(
    etnx,
    "`이름 전체에 넘치는 ${We[w.dominant]} 기운이 가운데(나) ${We[w.firstRep]}를 극하여, 스스로 내 몸을 치는 형국입니다.`:`The majority ${Ie[w.dominant]} controls the center ${Ie[w.firstRep]} — the overflowing energy turns against the self.`",
    "`이름 전체에 넘치는 ${We[w.dominant]} 기운이 대표중심(나) ${We[center]}를 극하여, 스스로 내 몸을 치는 형국입니다.`:`The majority ${Ie[w.dominant]} controls the center ${Ie[center]} — the overflowing energy turns against the self.`",
    "en ctl copy center",
)

etnx = once(
    etnx,
    'children:[S?`가운데(나) ${We[Y]} — 이 사람이 겉으로 드러내는 기운`:`Middle (self) ${Ie[Y]} (${Y}) — energy shown outwardly`]}),E.jsx("p",{style:{fontSize:"0.85rem",color:"#333",lineHeight:1.7,margin:0},children:S?midKo[Y]:midEn[Y]})',
    'children:[S?`${isCeo?"위쪽(나·성)":"가운데(나)"} ${We[center]} — 이 사람이 겉으로 드러내는 기운`:`${isCeo?"Above (self)":"Middle (self)"} ${Ie[center]} (${center}) — energy shown outwardly`]}),E.jsx("p",{style:{fontSize:"0.85rem",color:"#333",lineHeight:1.7,margin:0},children:S?midKo[center]:midEn[center]})',
    "en midSelf uses center",
)

# 나 marker: hide on first when ceo; add on last when ceo
etnx = once(
    etnx,
    'E.jsx("span",{"data-loc":"client/src/pages/EnglishName.tsx:910",style:{fontSize:"0.75rem",fontWeight:700,color:"#ca8a04",marginLeft:"0.3rem"},children:S?"← 나":"← ME"})',
    '(!isCeo)&&E.jsx("span",{"data-loc":"client/src/pages/EnglishName.tsx:910",style:{fontSize:"0.75rem",fontWeight:700,color:"#ca8a04",marginLeft:"0.3rem"},children:S?"← 나":"← ME"})',
    "en hide 나 on first if ceo",
)
etnx = once(
    etnx,
    'E.jsxs("span",{"data-loc":"client/src/pages/EnglishName.tsx:895",style:{fontSize:"0.8rem",color:"#555"},children:["(",w.lastName,")"]})]})]})',
    'E.jsxs("span",{"data-loc":"client/src/pages/EnglishName.tsx:895",style:{fontSize:"0.8rem",color:"#555"},children:["(",w.lastName,")"]}),isCeo&&E.jsx("span",{style:{fontSize:"0.75rem",fontWeight:700,color:"#ca8a04",marginLeft:"0.3rem"},children:S?"← 나":"← ME"})]})]})',
    "en 나 on last if ceo",
)

phone = (
    'E.jsxs("div",{"data-loc":"client/src/pages/EnglishName.tsx:ohangCall",style:{marginTop:"1.25rem",padding:"1rem",textAlign:"center",backgroundColor:"#f5f3ff",border:"2px solid #7c3aed",borderRadius:"0.75rem"},children:[E.jsx("p",{style:{fontSize:"0.95rem",lineHeight:1.7,color:"#1c1917",fontWeight:600,margin:0},children:S?"자세한 이름풀이, 작명의뢰를 하시려는 분은 010-5694-7817로 연락 주세요.":"For a detailed reading or naming request, call 010-5694-7817."})]})'
)
etnx = once(
    etnx,
    '})(),E.jsxs("div",{"data-loc":"client/src/pages/EnglishName.tsx:997"',
    "})()," + phone + ',E.jsxs("div",{"data-loc":"client/src/pages/EnglishName.tsx:997"',
    "en result phone",
)

etnx_path.write_text(etnx, encoding="utf-8")
print("en rk", etnx.count("[rk,setRk]"), "사장", etnx.count("사장·회장급"), "phone", etnx.count("010-5694-7817"), "center=", etnx.count("center=isCeo"))
