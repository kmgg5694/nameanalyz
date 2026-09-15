# -*- coding: utf-8 -*-
"""Korean form: name → one big button first; intro/hanja secondary; quieter PWA."""
import sys
sys.stdout.reconfigure(encoding="utf-8")
from pathlib import Path

path = Path("assets/index-kw5.js")
t = path.read_text(encoding="utf-8")

# --- 1) subtitle ---
old_sub = 'children:"한글 이름을 입력하고 한자 오행을 선택하면 완전한 분석이 가능합니다."'
new_sub = 'children:"① 본명만 입력 → ② 큰 버튼 한 번 누르면 끝입니다. (한자는 선택)"'
assert t.count(old_sub) == 1, t.count(old_sub)
t = t.replace(old_sub, new_sub, 1)

# --- 2) move intro below the form (after start button) ---
intro = (
    'm.jsxs("div",{className:"intro-sec",children:[m.jsx("div",{className:"intro-ttl",children:"소개영상"}),'
    'm.jsx("div",{id:"introPlayerWrap",className:"intro-player",'
    'children:m.jsx("video",{id:"introVideo",controls:!0,playsInline:!0,muted:!0,autoPlay:!0,preload:"auto"})})]}),'
)
assert t.count(intro) == 1, "intro block count"
t = t.replace(intro, "", 1)

# --- 3) early easy tip + start button after name input ---
btn = (
    'm.jsx("button",{"data-loc":"client/src/pages/Home.tsx:703",onClick:bn,disabled:t.name.trim().length<2,'
    'className:"w-full py-4 rounded font-bold text-base transition-all gold-glow disabled:opacity-40 disabled:cursor-not-allowed",'
    'style:{background:"linear-gradient(135deg, oklch(0.48 0.14 68), oklch(0.58 0.14 75))",color:"#fff"},'
    'children:"☯ 이름 풀이 시작"})'
)
easy = (
    'm.jsxs("div",{"data-loc":"client/src/pages/Home.tsx:easyTip",className:"mt-3 mb-1 p-3 rounded-lg",'
    'style:{background:"#ecfdf5",border:"2px solid #16a34a"},children:['
    'm.jsx("div",{style:{fontSize:"1rem",fontWeight:800,color:"#166534",marginBottom:"4px"},children:"이렇게만 하세요"}),'
    'm.jsx("div",{style:{fontSize:"0.88rem",color:"#14532d",lineHeight:1.55},'
    'children:"호적상 본명을 넣고, 아래 큰 버튼을 한 번만 누르세요. 한자·성별은 없어도 됩니다."})]},),'
)

# Insert after name input closing `focus:ring-primary"}),` that precedes ro.length
marker = 'focus:ring-2 focus:ring-primary"}),ro.length>0&&m.jsxs("div",{"data-loc":"client/src/pages/Home.tsx:602"'
assert t.count(marker) == 1, t.count(marker)
t = t.replace(
    marker,
    'focus:ring-2 focus:ring-primary"}),' + easy + btn + ',ro.length>0&&m.jsxs("div",{"data-loc":"client/src/pages/Home.tsx:602"',
    1,
)

# --- 4) remove OLD start button (now second) and put intro after warnings area ---
# Old button still sits after hanja: `})]}),m.jsx("button",{...703...})`
old_btn_full = '}),' + btn
# after early insert, first btn is early; second is old
c = t.count(btn)
assert c == 2, f"expected 2 buttons, got {c}"
first = t.find(btn)
second = t.find(btn, first + 1)
# remove `,` + btn if preceded by comma — usually `})]}),` + btn → keep `})]})`
# context before second
pre = t[second - 10 : second]
print("pre-second-btn:", repr(pre))
if t[second - 1] == ",":
    t = t[: second - 1] + t[second + len(btn) :]
else:
    t = t[:second] + t[second + len(btn) :]

# Place intro after the remaining start button (the early one) — better after warnings end
# Find end of dueum warning block: Home.tsx:581 ... then before e==="result"
result_mark = 'e==="result"&&m.jsx("div",{"data-loc":"client/src/pages/Home.tsx:716"'
ri = t.find(result_mark)
assert ri > 0
# insert intro just before result section, after form closes
# look back for pattern ending form: likely `]})` before result
# Insert: `,` + intro without trailing issues — form already closed with `]})`
# Check chars before result
print("before result:", repr(t[ri - 30 : ri]))
# typically `]})),` or `]}),`
# If `]})),e===` then insert intro as sibling: `]}),INTRO,e===`
# If `]})e===` unusual
before = t[ri - 5 : ri]
if before.endswith("),"):
    # `...}),e===` → `...}),INTRO e===` but intro already has trailing comma
    t = t[:ri] + intro + t[ri:]
elif before.endswith("]}}"):
    t = t[:ri] + "," + intro + t[ri:]
else:
    # try common `]})),`
    t = t[:ri] + intro + t[ri:]

# --- 5) Enter to submit ---
old_in = 'id:"koNameInput",value:t.name,onChange:'
assert t.count(old_in) == 1
t = t.replace(
    old_in,
    'id:"koNameInput",value:t.name,onKeyDown:G=>{if(G.key==="Enter"&&t.name.trim().length>=2){G.preventDefault();bn()}},onChange:',
    1,
)

# --- 6) hanja optional labels ---
old_h = 'children:"한자 자원오행 선택"'
new_h = 'children:"한자 자원오행 (선택 — 한글만으로도 OK)"'
assert t.count(old_h) == 1
t = t.replace(old_h, new_h, 1)

old_hp = 'children:"※ 김(金)씨는 무조건 金 오행입니다. 🔍 찾기로 이름 한자를 검색하세요."'
new_hp = 'children:"※ 한자는 없어도 풀이됩니다. 김(金)씨는 무조건 金. 필요하면 🔍 찾기로 한자만 고르세요."'
assert t.count(old_hp) == 1
t = t.replace(old_hp, new_hp, 1)

path.write_text(t, encoding="utf-8")

# verify
t2 = path.read_text(encoding="utf-8")
print("easyTip", t2.count("Home.tsx:easyTip"))
print("btn703", t2.count('Home.tsx:703'))
print("intro count", t2.count('className:"intro-sec"'))
print("subtitle ok", "큰 버튼 한 번" in t2)
print("Enter", 'onKeyDown:G=>{if(G.key==="Enter"' in t2)

# intro should appear after easy tip / form, not before 577
i_intro = t2.find('className:"intro-sec"')
i_form = t2.find("Home.tsx:577")
print("intro after form?", i_intro > i_form, i_form, i_intro)
