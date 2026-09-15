# -*- coding: utf-8 -*-
from pathlib import Path

js_path = Path(r"C:\Users\a8071\Projects\nameanalyz\assets\index-eTNXNndF.js")
s = js_path.read_text(encoding="utf-8")
marker = (
    'E.jsxs("div",{"data-loc":"client/src/pages/EnglishName.tsx:595",'
    'style:{maxWidth:"800px",margin:"0 auto",padding:"1.5rem 1rem"},children:['
    'E.jsxs("div",{"data-loc":"client/src/pages/EnglishName.tsx:598"'
)
print("count", s.count(marker))
intro = (
    'E.jsxs("div",{"data-loc":"client/src/pages/EnglishName.tsx:595",'
    'style:{maxWidth:"800px",margin:"0 auto",padding:"1.5rem 1rem"},children:['
    'E.jsxs("div",{className:"intro-sec",children:['
    'E.jsx("div",{className:"intro-ttl",children:"Intro"}),'
    'E.jsxs("div",{className:"intro-langs",children:['
    'E.jsx("button",{type:"button",className:"intro-btn","data-lang":"en",onClick:()=>window.playIntro("en"),children:"English"}),'
    'E.jsx("button",{type:"button",className:"intro-btn","data-lang":"ko",onClick:()=>window.playIntro("ko"),children:"한국어"})'
    ']}),'
    'E.jsx("div",{id:"introPlayerWrap",className:"intro-player",children:'
    'E.jsx("video",{id:"introVideo",controls:!0,playsInline:!0,muted:!0,autoPlay:!0,preload:"auto"})'
    '})]}),'
    'E.jsxs("div",{"data-loc":"client/src/pages/EnglishName.tsx:598"'
)
if s.count(marker) != 1:
    raise SystemExit("marker not unique")
js_path.write_text(s.replace(marker, intro, 1), encoding="utf-8")
print("patched english js")
