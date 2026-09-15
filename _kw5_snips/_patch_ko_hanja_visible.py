# -*- coding: utf-8 -*-
"""Move start button below hanja; keep tip; clarify 한문 찾기 label."""
import sys
sys.stdout.reconfigure(encoding="utf-8")
from pathlib import Path

path = Path("assets/index-kw5.js")
t = path.read_text(encoding="utf-8")

btn = (
    'm.jsx("button",{"data-loc":"client/src/pages/Home.tsx:703",onClick:bn,disabled:t.name.trim().length<2,'
    'className:"w-full py-4 rounded font-bold text-base transition-all gold-glow disabled:opacity-40 disabled:cursor-not-allowed",'
    'style:{background:"linear-gradient(135deg, oklch(0.48 0.14 68), oklch(0.58 0.14 75))",color:"#fff"},'
    'children:"☯ 이름 풀이 시작"})'
)

# Remove button from after easy tip: `})]}),BTN,ro.length` or `})]}),BTN,ro`
old_early = '})]}),' + btn + ',ro.length>0&&'
if t.count(old_early) != 1:
    # try without expecting exact
    print("early pattern count", t.count(old_early))
    i = t.find(btn)
    print("btn at", i, repr(t[i - 20 : i + 40]))
    raise SystemExit("early pattern not found")
t = t.replace(old_early, '})]}),ro.length>0&&', 1)

# Insert button after hanja card, before warnings (581b)
warn = 'm.jsxs("div",{"data-loc":"client/src/pages/Home.tsx:581b"'
wi = t.find(warn)
if wi < 0:
    raise SystemExit("warn not found")
# ensure only one button
if t.count(btn) != 0:
    raise SystemExit(f"btn still present count={t.count(btn)}")

t = t[:wi] + btn + "," + t[wi:]

# Update tip text to mention 한문 찾기 below
old_tip = 'children:"호적상 본명을 넣고, 아래 큰 버튼을 한 번만 누르세요. 한자·성별은 없어도 됩니다."'
new_tip = 'children:"① 본명 입력 → ② 한문 필요하면 아래 「한문 찾기」 → ③ 맨 아래 큰 버튼. 한문 없이도 됩니다."'
if t.count(old_tip) != 1:
    raise SystemExit(f"tip count={t.count(old_tip)}")
t = t.replace(old_tip, new_tip, 1)

# Clearer hanja header
old_h = 'children:"한자 자원오행 (선택 — 한글만으로도 OK)"'
new_h = 'children:"🔍 한문 찾기 (선택 — 한글만으로도 OK)"'
if t.count(old_h) != 1:
    raise SystemExit(f"hanja header count={t.count(old_h)}")
t = t.replace(old_h, new_h, 1)

# subtitle
old_sub = 'children:"① 본명만 입력 → ② 큰 버튼 한 번 누르면 끝입니다. (한자는 선택)"'
new_sub = 'children:"본명 입력 → (선택) 한문 찾기 → 이름 풀이 시작 버튼"'
if t.count(old_sub) != 1:
    raise SystemExit(f"sub count={t.count(old_sub)}")
t = t.replace(old_sub, new_sub, 1)

path.write_text(t, encoding="utf-8")
t2 = path.read_text(encoding="utf-8")
print("btn count", t2.count('Home.tsx:703'))
print("order tip,602,676,703,581b:")
for s in ["easyTip", "Home.tsx:602", "Home.tsx:676", "Home.tsx:703", "Home.tsx:581b"]:
    print(f"  {t2.find(s):8d} {s}")
print("hanmun title", "한문 찾기" in t2)
