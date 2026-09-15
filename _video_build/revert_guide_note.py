# -*- coding: utf-8 -*-
from pathlib import Path

js = Path(r"C:\Users\a8071\Projects\nameanalyz\assets\index-kw5.js")
html = Path(r"C:\Users\a8071\Projects\nameanalyz\index.html")

s = js.read_text(encoding="utf-8")
start = 'm.jsx("p",{"data-loc":"client/src/pages/Home.tsx:573",className:"guide-note",children:"'
end = '"})]}),m.jsxs("div",{className:"intro-sec"'
i = s.find(start)
j = s.find(end)
if i < 0 or j < 0 or j < i:
    raise SystemExit(f"guide block not found i={i} j={j}")
restored = (
    'm.jsx("p",{"data-loc":"client/src/pages/Home.tsx:573",'
    'className:"text-sm text-muted-foreground",'
    'children:"한글 이름을 입력하고 한자 오행을 선택하면 완전한 분석이 가능합니다."})]}),'
    'm.jsxs("div",{className:"intro-sec"'
)
js.write_text(s[:i] + restored + s[j + len(end):], encoding="utf-8")

h = html.read_text(encoding="utf-8")
css = (
    "      .guide-note{text-align:left;font-size:13px;line-height:1.75;font-weight:400;"
    "color:oklch(0.32 0.04 68);background:oklch(0.985 0.006 82);"
    "border:1px solid oklch(0.82 0.02 72);border-radius:10px;padding:12px 14px;"
    "white-space:pre-wrap;}\n"
)
if css not in h:
    raise SystemExit("guide-note css not found")
html.write_text(h.replace(css, "", 1), encoding="utf-8")
print("reverted guide text and css")
