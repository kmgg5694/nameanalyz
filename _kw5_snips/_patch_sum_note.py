# -*- coding: utf-8 -*-
from pathlib import Path
p = Path(r"C:\Users\a8071\Projects\nameanalyz\assets\index-kw5.js")
kw = p.read_text(encoding="utf-8")
old = 'Home.tsx:1113",className:"text-base font-bold text-center mb-4",style:{color:"#92400e",letterSpacing:"3px",borderBottom:"2px solid #d97706",paddingBottom:"8px"},children:"요약보기"}),m.jsxs("div",{"data-loc":"client/src/pages/Home.tsx:1116"'
note = 'Home.tsx:1113",className:"text-base font-bold text-center mb-4",style:{color:"#92400e",letterSpacing:"3px",borderBottom:"2px solid #d97706",paddingBottom:"8px"},children:"요약보기"}),m.jsx("p",{"data-loc":"client/src/pages/Home.tsx:1114n",className:"text-center text-sm mb-3",style:{color:"#92400e",lineHeight:1.65},children:"요약보기에 밑줄표시 된 수리와 주역괘 를 누르면 그 뜻을 전부 볼 수가 있습니다."}),m.jsxs("div",{"data-loc":"client/src/pages/Home.tsx:1116"'
c = kw.count(old)
print("count", c)
if c != 1:
    raise SystemExit("not unique")
p.write_text(kw.replace(old, note, 1), encoding="utf-8")
print("ok")
