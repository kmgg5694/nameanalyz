# -*- coding: utf-8 -*-
from pathlib import Path

js_path = Path(r"C:\Users\a8071\Projects\nameanalyz\assets\index-kw5.js")
s = js_path.read_text(encoding="utf-8")
old = (
    'm.jsxs("div",{className:"intro-sec",children:['
    'm.jsx("div",{className:"intro-ttl",children:"소개영상"}),'
    'm.jsxs("div",{className:"intro-langs",children:['
    'm.jsx("button",{type:"button",className:"intro-btn","data-lang":"ko",onClick:()=>window.playIntro("ko"),children:"한국어"}),'
    'm.jsx("button",{type:"button",className:"intro-btn","data-lang":"en",onClick:()=>window.playIntro("en"),children:"English"})'
    ']}),'
    'm.jsx("div",{id:"introPlayerWrap",className:"intro-player hidden",children:'
    'm.jsx("video",{id:"introVideo",controls:!0,playsInline:!0,preload:"none"})'
    '})]})'
)
new = (
    'm.jsxs("div",{className:"intro-sec",children:['
    'm.jsx("div",{className:"intro-ttl",children:"소개영상"}),'
    'm.jsx("div",{id:"introPlayerWrap",className:"intro-player",children:'
    'm.jsx("video",{id:"introVideo",controls:!0,playsInline:!0,muted:!0,autoPlay:!0,preload:"auto"})'
    '})]})'
)
n = s.count(old)
print("count", n)
if n != 1:
    raise SystemExit("marker not unique")
js_path.write_text(s.replace(old, new, 1), encoding="utf-8")
print("patched kw5")
