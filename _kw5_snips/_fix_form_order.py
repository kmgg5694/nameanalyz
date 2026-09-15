# -*- coding: utf-8 -*-
from pathlib import Path

kw_path = Path(r"C:\Users\a8071\Projects\nameanalyz\assets\index-kw5.js")
kw = kw_path.read_text(encoding="utf-8")

start = kw.find('m.jsxs("div",{"data-loc":"client/src/pages/Home.tsx:581b"')
if start < 0:
    raise SystemExit("581b missing")
btn = kw.find('m.jsx("button",{"data-loc":"client/src/pages/Home.tsx:703"')
if btn < 0:
    raise SystemExit("703 missing")
btn_end = kw.find('children:"☯ 이름 풀이 시작"})', btn)
if btn_end < 0:
    raise SystemExit("button text missing")
btn_end += len('children:"☯ 이름 풀이 시작"})')

warn_dueum = kw[start:btn]  # includes 581b and 581, ends before button
button = kw[btn:btn_end]
# warn_dueum currently ends with `),` before button
if not warn_dueum.endswith(","):
    raise SystemExit("expected comma before button, got %r" % warn_dueum[-20:])

# After reorder: button, then warn_dueum (which already has trailing comma from old `),m.jsx button`)
# Currently: warn_dueum + button
# warn_dueum is `...581...})],`  wait let's see
# 581 closes `})]}),m.jsx("button"`
# so warn_dueum = from 581b through `)},`  i.e. dueum close + comma

new = button + "," + warn_dueum.rstrip(",")
# warn_dueum includes trailing comma: `...})],` no - `})]},`  the comma separates from button
# new: button + "," + warn_dueum without the trailing comma that was before button
# If we do button + "," + warn_dueum:
# `button,581b...581,`  leftover trailing comma is OK if next is `e==="result"` - currently after button is `]}),e===`
# After original button there's NO comma: `시작"})]}),e===`
# So after reorder we need: `시작"}),581b...581})]}),e===`
# meaning: button, warn_dueum (without extra comma at end of warn if warn already ends with `),`)

# Original: warn_dueum + button + `]}),e===`
# warn_dueum ends with comma (separator before button)
# After: button + "," + warn_dueum[:-1]  if warn ends with comma
# then next is `]}),e===` from original after button

if not warn_dueum.endswith(","):
    raise SystemExit("warn_dueum should end with comma")
reordered = button + "," + warn_dueum[:-1]

old = kw[start:btn_end]
if old.count("Home.tsx:581b") != 1 or old.count("Home.tsx:703") != 1:
    raise SystemExit("marker counts off")

kw2 = kw[:start] + reordered + kw[btn_end:]
if kw2.count('Home.tsx:581b') != kw.count('Home.tsx:581b'):
    raise SystemExit("lost 581b")

# verify order in a window
win = kw2[start : start + 2500]
i581b = win.find("Home.tsx:581b")
i581 = win.find("Home.tsx:581\"")
i703 = win.find("Home.tsx:703")
print("order in window: 703=%s 581b=%s 581=%s" % (i703, i581b, i581))
if not (i703 < i581b < i581):
    raise SystemExit("order wrong")

kw_path.write_text(kw2, encoding="utf-8")
print("ok", len(old), "->", len(reordered))
