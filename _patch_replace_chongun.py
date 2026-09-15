# -*- coding: utf-8 -*-
from pathlib import Path
import subprocess
import sys
sys.stdout.reconfigure(encoding="utf-8")

p = Path("assets/index-kw5.js")
kw = p.read_text(encoding="utf-8")

# Confirm period verdict exists at 1193
print("has 내 인생의 말년", "내 인생의 말년" in kw)
print("has 한글 총운", "한글 총운" in kw)
print("has 한문 총운", "한문 총운" in kw)

# Replace 총운 intro+meta+한글+한문 with judgment block that reuses same scoring
old = (
    'secs.push(m.jsx("p",{style:{color:"#1c1917",fontWeight:700},children:"이제 이 이름이 가진 전체적인 기운, 총운을 알아 보겠습니다."}));'
    'secs.push(m.jsx("p",{className:"mt-2",style:{color:"#1c1917",lineHeight:1.7},children:metaC(wo?.data,wo?.gwe)}));'
    'secs.push(row("한글 총운 (수리·주역)",wo,"한글이름의 총운"));'
    'uo&&Ro&&secs.push(row("한문 총운 (수리·주역)",Ro,"한자이름의 총운"));'
)
if old not in kw:
    # try find pieces
    for part in [
        '이제 이 이름이 가진 전체적인 기운',
        '한글 총운 (수리·주역)',
        '한문 총운 (수리·주역)',
        'metaC(wo',
    ]:
        print("part", part, kw.find(part))
    raise SystemExit("old block miss")

# Judgment text builder — same rules as summary verdict
judge = r'''secs.push((()=>{const ages=["초년","장년","중년","말년"],nmHgG=[G,mo,co,wo].map(v=>v&&v.gwe),nmHjG=[_o,No,Mo,Ro].map(v=>v&&v.gwe),nmHgS=[G,mo,co,wo].map(v=>v&&v.data),nmHjS=[_o,No,Mo,Ro].map(v=>v&&v.data),hasB=!!(birthSuri&&bW&&bH&&bI&&bJ),bdG=hasB?[bW,bH,bI,bJ].map(v=>v&&v.gwe):[],bdS=hasB?[bW,bH,bI,bJ].map(v=>v&&v.data):[],suriBad=Y=>!!Y&&(Y.type==="taboo"||Y.type==="caution"||Y.type==="bad"),gScore=g=>!g?0:g.isTaboo?-2:g.isBest?1:0,sScore=Y=>suriBad(Y)?-1:0,nmScore=ii=>gScore(nmHgG[ii])+gScore(nmHjG[ii])+sScore(nmHgS[ii])+sScore(nmHjS[ii]),bdScore=ii=>hasB?gScore(bdG[ii])+sScore(bdS[ii]):0,nmAll=nmHgG.concat(nmHjG).filter(Boolean),nmRed=nmAll.filter(g=>g.isTaboo).length,nmBlue=nmAll.filter(g=>g.isBest).length,nmHgRed=nmHgG.filter(g=>g&&g.isTaboo).length,nmHjRed=nmHjG.filter(g=>g&&g.isTaboo).length,bdRed=bdG.filter(g=>g&&g.isTaboo).length,bdBlue=bdG.filter(g=>g&&g.isBest).length,upBlk=typeof J==="boolean"&&J,dnOpen=typeof D==="boolean"&&D,ps=[];ps.push("이름기운과 탄생일을 초년·장년·중년·말년으로 비교합니다. 수리가 흉(빨간색)이면 몸으로 때워도 되지만, 주역괘의 흉(빨간색)은 꼭 상처를 남깁니다.");ages.forEach((ag,ii)=>{const ns=nmScore(ii),bs=bdScore(ii),nR=(nmHgG[ii]&&nmHgG[ii].isTaboo?1:0)+(nmHjG[ii]&&nmHjG[ii].isTaboo?1:0)+(suriBad(nmHgS[ii])?1:0)+(suriBad(nmHjS[ii])?1:0),nB=(nmHgG[ii]&&nmHgG[ii].isBest?1:0)+(nmHjG[ii]&&nmHjG[ii].isBest?1:0),bR=hasB?((bdG[ii]&&bdG[ii].isTaboo?1:0)+(suriBad(bdS[ii])?1:0)):0,bB=hasB&&bdG[ii]&&bdG[ii].isBest?1:0;if(!hasB){if(nR)ps.push(ag+"은 이름 기운에 흉이 있어 위기·고생이 겹치기 쉬운 때입니다.");else if(nB)ps.push(ag+"은 이름 주역에 길·재물 기운이 있어 발전이 열리기 쉬운 때입니다.");else ps.push(ag+"은 이름 기운이 평이한 편입니다.");return}if(ns<bs-1||(nR>bR&&nB<=bB))ps.push(ag+"은 탄생일보다 이름 쪽이 더 거칠어, 그 시기에 이름 때문에 위기가 생기기 쉽습니다.");else if(ns>bs+1||(bR>nR&&nB>=bB))ps.push(ag+"은 사주보다 이름이 받쳐 주어, 그 시기에 발전·재물운이 열리기 쉽습니다.");else if(nR||bR)ps.push(ag+"은 이름과 탄생일이 서로 비슷한 수준으로, 흉이 있는 쪽을 조심하면 됩니다.");else if(nB||bB)ps.push(ag+"은 이름과 탄생일 모두 크게 깨지지 않고 길한 기운도 있어 무난한 발전기입니다.");else ps.push(ag+"은 이름과 탄생일이 모두 평이한 편입니다.")});if(nmRed>=3)ps.push("이 이름의 주역괘는 한문"+nmHjRed+"개, 한글"+nmHgRed+"개로 빨간 흉괘가 "+nmRed+"개나 되어, 이름이 사주의 멱살을 잡고 쥐락펴락 하니 암이나 교통사고사가 예상됩니다.");else if(nmRed>=1)ps.push("이름 주역괘에 빨간 흉괘가 "+nmRed+"개 있어, 그 시기에는 사건·중병·도산 등으로 고생하게 됩니다.");if(upBlk)ps.push("한글오행 위쪽(성→나)이 상극이라 양부모·관청·선배·배우자운이 막혀, 결혼도 못하고 이름에 결혼운이 막혀 있는 형상입니다.");if(dnOpen)ps.push("대신 아래쪽(나→끝자) 동료·후배·자녀운은 열려 있습니다.");if(hasB){if(nmRed>=3&&bdRed<=2){ps.push("사주는 좋은 기운이 몰려오거나 부름을 받아 상류층 삶을 살아갈 수 있는 형국이더라도, 이름의 기운이 내 사주를 처벌하니 중도하차하는 형상입니다.");ps.push("결론은 잘못된 이름이 중간정도의 나의 사주를 짓밟는 형상이니 사주에 비해 아주 나쁜 이름의 소유자입니다.")}else if(nmRed>bdRed){ps.push("이름의 흉괘가 사주보다 더 강해 사주의 흐름을 눌러 버리는 형상입니다.");ps.push("결론은 잘못된 이름이 나의 사주를 짓밟는 형상이니 사주에 비해 나쁜 이름의 소유자입니다.")}else if(bdRed>=3&&nmRed<=1){ps.push("사주는 흉이 많아 매우 나쁜 형국이어도, 이름의 주역괘에 출세운과 재물운이 받쳐 주어 아주 잘 나가는 삶을 살 수 있는 경우도 있습니다.");ps.push("이런 경우에는 사주에 비해 좋은 이름을 가졌네요.")}else if(nmRed<bdRed||nmBlue>bdBlue){ps.push("사주의 흉보다 이름의 주역괘가 더 받쳐 주어, 출세운과 재물운이 사주를 도와주는 형상입니다.");ps.push("이런 경우에는 사주에 비해 좋은 이름을 가졌네요.")}else if(nmRed===0&&bdRed===0)ps.push("이름과 사주의 주역괘가 모두 크게 깨지지 않아, 이름과 사주가 서로 거스르지 않는 편입니다.")}else if(nmRed>=1)ps.push("이 괘는 사건, 사망, 중병, 도산 등으로 고생하게 됩니다.");ps.push("이름이나 탄생일의 말년(총운)이 좋아야 내 인생의 말년, 건강이, 재물이 좋아집니다.");return m.jsxs("div",{className:"mt-2 p-3 rounded-lg",style:{background:"#fff7ed",border:"1px solid #d97706"},children:[m.jsx("p",{style:{color:"#78350f",fontWeight:700,fontSize:"0.95rem",marginBottom:"6px"},children:"이름기운 · 탄생일 나이대 판정"}),ps.map((tx,ii)=>m.jsx("p",{className:"mt-1",style:{color:"#1c1917",lineHeight:1.7,fontSize:"0.9rem"},children:tx},ii))]})})());'''

kw = kw.replace(old, judge, 1)

# Remove unused metaC if no longer referenced in this IIFE - check
# metaC still might be unused - leave for now to avoid breaking, or remove metaC def
# Clean dead metaC to avoid lint noise - optional. If metaC only used there, remove it.
nar_i = kw.find('Home.tsx:1307')
nar = kw[nar_i:nar_i+5500]
if "metaC(" not in nar.split("metaC=")[1] if "metaC=" in nar else nar:
    pass
# if metaC definition remains but unused, remove definition
if "metaC(" not in kw[kw.find("const gc=g=>"):kw.find("return secs")]:
    # only definition left
    pass

# Actually check: after replace, is metaC still called?
seg = kw[kw.find('children:(()=>{const gc=g=>'):kw.find("return secs})()}")]
print("metaC calls in nar", seg.count("metaC("))
if seg.count("metaC(") == 0 and "metaC=" in seg:
    # strip metaC definition
    a = seg.find("metaC=")
    # find end at ,row=
    b = seg.find(",row=")
    if a > 0 and b > a:
        newseg = seg[:a] + seg[b+1:]  # leave row=
        kw = kw.replace(seg, newseg, 1)
        print("stripped metaC")

p.write_text(kw, encoding="utf-8")
r = subprocess.run(["node", "--check", str(p)], capture_output=True)
print("syntax", r.returncode)
if r.returncode:
    print(r.stderr.decode("utf-8", errors="replace")[-600:])
else:
    print("OK no 한글 총운", "한글 총운" not in p.read_text(encoding="utf-8"))
    print("OK no 한문 총운", "한문 총운" not in p.read_text(encoding="utf-8"))
    print("OK judge title", "이름기운 · 탄생일 나이대 판정" in p.read_text(encoding="utf-8"))
    print("OK closing", "내 인생의 말년" in p.read_text(encoding="utf-8"))

# bump cache
html = Path("index.html").read_text(encoding="utf-8")
html2 = html.replace("?v=20260911e", "?v=20260911f").replace("?v=20260911d", "?v=20260911f")
Path("index.html").write_text(html2, encoding="utf-8")
print("html", [x for x in html2.split("\n") if "index-kw5.js" in x][0])
