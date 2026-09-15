# -*- coding: utf-8 -*-
"""Strip 원형이정 and hanja from English name-reading life-stage UI."""
from pathlib import Path
import re

path = Path("assets/index-eTNXNndF.js")
t = path.read_text(encoding="utf-8")
orig = t

# Ensure English labels are the accessible keywords (idempotent)
label_map = {
    "Won Gyeok": "Early Fortune",
    "Hyeong Gyeok": "Prime Years",
    "Yi Gyeok": "Midlife Peak",
    "Jeong Gyeok": "Ultimate Destiny",
}
for m in list(re.finditer(r'labelEn:"(?:Won|Hyeong|Yi|Jeong) Gyeok[^"]*"', t)):
    old = m.group(0)
    for k, v in label_map.items():
        if k in old:
            t = t.replace(old, f'labelEn:"{v}"')
            break

replacements = [
    # Korean UI labels — drop phonetic + hanja
    ('label:"원격(元格) — 초년운"', 'label:"초년운"'),
    ('label:"형격(亨格) — 청년운"', 'label:"장년운"'),
    ('label:"이격(利格) — 중년운"', 'label:"중년운"'),
    ('label:"정격(貞格) — 총운"', 'label:"말년·총운"'),
    # Titles
    (
        'S?"탄생일 (원형이정 풀이용, 선택)":"Date of Birth (for life-stage reading, optional)"',
        'S?"탄생일 (인생 단계 풀이용, 선택)":"Date of Birth (for life-stage reading, optional)"',
    ),
    (
        'S?"탄생일 (원형이정 풀이용, 선택)":"Date of Birth (for Destiny Reading, optional)"',
        'S?"탄생일 (인생 단계 풀이용, 선택)":"Date of Birth (for life-stage reading, optional)"',
    ),
    (
        'S?"탄생일 원형이정 (元亨利貞) 풀이":"Birth Date Life Stages"',
        'S?"탄생일 인생 단계 풀이":"Birth Date Life Stages"',
    ),
    (
        'S?"탄생일 원형이정 (元亨利貞) 풀이":"Birth Date Destiny Reading (元亨利貞)"',
        'S?"탄생일 인생 단계 풀이":"Birth Date Life Stages"',
    ),
    # Bare strings if used outside ternary
    ("탄생일 (원형이정 풀이용, 선택)", "탄생일 (인생 단계 풀이용, 선택)"),
    ("탄생일 원형이정 (元亨利貞) 풀이", "탄생일 인생 단계 풀이"),
    ("Birth Date Destiny Reading (元亨利貞)", "Birth Date Life Stages"),
    # Share / summary text
    ("[탄생일 원형이정 4격]", "[탄생일 인생 단계 4격]"),
]

# Share pillar lines: 원격/형격/이격/정격 → 초년/장년/중년/말년
# Be careful not to break JS identifiers like birthWonData
# Only replace labeled lines in template strings
share_line_reps = [
    ("\n원격: ${", "\n초년: ${"),
    ("\n형격: ${", "\n장년: ${"),
    ("\n이격: ${", "\n중년: ${"),
    ("\n정격: ${", "\n말년: ${"),
]

report = []
for old, new in replacements:
    c = t.count(old)
    if c:
        t = t.replace(old, new)
        report.append(f"OK x{c}\t{old} → {new}")
    else:
        report.append(f"MISS\t{old}")

for old, new in share_line_reps:
    c = t.count(old)
    if c:
        t = t.replace(old, new)
        report.append(f"OK x{c}\t{repr(old)} → {repr(new)}")
    else:
        report.append(f"MISS\t{repr(old)}")

# Tip cleanup
t2, n = re.subn(
    r"The Destiny pillar \(Jeong Gyeok\) influences all life stages and fully manifests after age 55\.",
    "Ultimate Destiny influences all life stages and fully manifests after age 55.",
    t,
)
t = t2
report.append(f"tip x{n}")

# Summary headers if still old English short forms
for old, new in [
    ('S?"초년":"Early"', 'S?"초년":"Early Fortune"'),
    ('S?"장년":"Prime"', 'S?"장년":"Prime Years"'),
    ('S?"중년":"Middle"', 'S?"중년":"Midlife Peak"'),
    ('S?"말년":"Later"', 'S?"말년":"Ultimate Destiny"'),
]:
    c = t.count(old)
    if c:
        t = t.replace(old, new)
        report.append(f"OK x{c}\t{old} → {new}")

leftovers = []
for s in [
    "원형이정",
    "元亨利貞",
    "元格",
    "亨格",
    "利格",
    "貞格",
    "Won Gyeok",
    "Hyeong Gyeok",
    "Yi Gyeok",
    "Jeong Gyeok",
    "원격(元",
    "형격(亨",
    "이격(利",
    "정격(貞",
]:
    if s in t:
        leftovers.append(f"{s} x{t.count(s)}")

# Also check leftover 원격: in share (should be gone for newline pattern)
for s in ["\n원격:", "\n형격:", "\n이격:", "\n정격:"]:
    if s in t:
        leftovers.append(f"{repr(s)} x{t.count(s)}")

if t == orig:
    raise SystemExit("no changes made")

path.write_text(t, encoding="utf-8")
Path("_won_strip_report.txt").write_text(
    "\n".join(report) + "\n\nleftovers:\n" + "\n".join(leftovers or ["(none)"]),
    encoding="utf-8",
)
print("done leftovers", leftovers or ["(none)"])
