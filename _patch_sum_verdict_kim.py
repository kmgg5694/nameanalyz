# -*- coding: utf-8 -*-
from pathlib import Path
import subprocess
import sys
sys.stdout.reconfigure(encoding="utf-8")
p = Path(r"C:\Users\a8071\Projects\nameanalyz\assets\index-kw5.js")
kw = p.read_text(encoding="utf-8")

old = (
    'data-loc":"client/src/pages/Home.tsx:1193",className:"mt-3 text-sm leading-relaxed",'
    'style:{color:"#1c1917",borderTop:"1px solid #d97706",paddingTop:"10px"},'
    'children:"요약을 원형이정으로 보면 수리가 흉(빨간색)이면 고생하면서 버텨 나갈수 있지만 주역괘의 흉(빨간색)은 꼭 큰 생채기를 남기는 법이다. 이 괘는 사건, 사망, 중병, 도산 등으로 고생하게 됩니다."'
)

verdict = r'''(()=>{const nmHg=[G,mo,co,wo].map(v=>v?.gwe).filter(Boolean),nmHj=[_o,No,Mo,Ro].map(v=>v?.gwe).filter(Boolean),nmAll=nmHg.concat(nmHj),nmRed=nmAll.filter(g=>g.isTaboo).length,nmHgRed=nmHg.filter(g=>g.isTaboo).length,nmHjRed=nmHj.filter(g=>g.isTaboo).length,bdG=birthSuri&&bW&&bH&&bI&&bJ?[bW,bH,bI,bJ].map(v=>v?.gwe).filter(Boolean):[],bdRed=bdG.filter(g=>g.isTaboo).length,ps=[];ps.push("요약을 초년·장년·중년·말년으로 보면 수리가 흉(빨간색)이면 내가 몸으로 때워도 되지만, 주역괘의 흉(빨간색)은 꼭 상처를 남기니 피할 수가 없습니다.");if(nmRed>=3)ps.push("이 이름의 주역괘는 한문"+nmHjRed+"개, 한글"+nmHgRed+"개로 빨간 흉괘가 "+nmRed+"개나 되어, 이름이 사주의 멱살을 잡고 쥐락펴락 하니 암이나 교통사고사가 예상됩니다.");else if(nmRed>=1)ps.push("이름 주역괘에 빨간 흉괘가 "+nmRed+"개 있어, 그 시기에는 사건·중병·도산 등으로 고생하게 됩니다.");if(bdG.length){if(nmRed>=3&&bdRed<=2){ps.push("사주는 좋은 기운이 몰려오거나 부름을 받아 상류층 삶을 살아갈 수 있는 형국이더라도, 이름의 기운이 내 사주를 처벌하니 중도하차하는 형상입니다.");ps.push("결론은 잘못된 이름이 중간정도의 나의 사주를 짓밟는 형상이니 사주에 비해 아주 나쁜 이름의 소유자입니다.")}else if(nmRed>bdRed){ps.push("이름의 흉괘가 사주보다 더 강해 사주의 흐름을 눌러 버리는 형상입니다.");ps.push("결론은 잘못된 이름이 나의 사주를 짓밟는 형상이니 사주에 비해 나쁜 이름의 소유자입니다.")}else if(nmRed===0&&bdRed===0)ps.push("이름과 사주의 주역괘가 모두 크게 깨지지 않아, 이름과 사주가 서로 거스르지 않는 편입니다.")}else if(nmRed>=1)ps.push("이 괘는 사건, 사망, 중병, 도산 등으로 고생하게 됩니다.");return ps.join(" ")})()'''

new = (
    'data-loc":"client/src/pages/Home.tsx:1193",className:"mt-3 text-sm leading-relaxed",'
    'style:{color:"#1c1917",borderTop:"1px solid #d97706",paddingTop:"10px"},'
    'children:' + verdict
)

if old not in kw:
    j = kw.find("Home.tsx:1193")
    print(repr(kw[j:j+350]))
    raise SystemExit("miss")

kw = kw.replace(old, new, 1)
p.write_text(kw, encoding="utf-8")
r = subprocess.run(["node", "--check", str(p)], capture_output=True)
print("syntax", r.returncode)
if r.returncode:
    print(r.stderr.decode("utf-8", errors="replace")[-400:])
else:
    print("OK", "짓밟는" in kw, "몸으로 때워도" in kw)
