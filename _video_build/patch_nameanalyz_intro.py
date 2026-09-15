# -*- coding: utf-8 -*-
from pathlib import Path

js_path = Path(r"C:\Users\a8071\Projects\nameanalyz\assets\index-kw5.js")
s = js_path.read_text(encoding="utf-8")
marker = (
    'm.jsx("p",{"data-loc":"client/src/pages/Home.tsx:573",className:"text-sm text-muted-foreground",'
    'children:"한글 이름을 입력하고 한자 오행을 선택하면 완전한 분석이 가능합니다."})]}),'
    'm.jsxs("div",{"data-loc":"client/src/pages/Home.tsx:577"'
)
print("count", s.count(marker))
intro = (
    'm.jsx("p",{"data-loc":"client/src/pages/Home.tsx:573",className:"text-sm text-muted-foreground",'
    'children:"한글 이름을 입력하고 한자 오행을 선택하면 완전한 분석이 가능합니다."})]}),'
    'm.jsxs("div",{className:"intro-sec",children:['
    'm.jsx("div",{className:"intro-ttl",children:"소개영상"}),'
    'm.jsxs("div",{className:"intro-langs",children:['
    'm.jsx("button",{type:"button",className:"intro-btn","data-lang":"ko",onClick:()=>window.playIntro("ko"),children:"한국어"}),'
    'm.jsx("button",{type:"button",className:"intro-btn","data-lang":"en",onClick:()=>window.playIntro("en"),children:"English"})'
    ']}),'
    'm.jsx("div",{id:"introPlayerWrap",className:"intro-player hidden",children:'
    'm.jsx("video",{id:"introVideo",controls:!0,playsInline:!0,preload:"none"})'
    '})]}),'
    'm.jsxs("div",{"data-loc":"client/src/pages/Home.tsx:577"'
)
if s.count(marker) != 1:
    raise SystemExit("marker not unique")
js_path.write_text(s.replace(marker, intro, 1), encoding="utf-8")
print("patched", js_path)
