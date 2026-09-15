# -*- coding: utf-8 -*-
"""Replace inaccessible 원형이정 English labels with clear life-stage keywords."""
from pathlib import Path

path = Path("assets/index-eTNXNndF.js")
t = path.read_text(encoding="utf-8")
orig = t

import re

# Discover exact labelEn strings starting with Won/Hyeong/Yi/Jeong Gyeok
discovered = []
for m in re.finditer(r'labelEn:"(?:Won|Hyeong|Yi|Jeong) Gyeok[^"]*"', t):
    discovered.append(m.group(0))

def map_label(s: str) -> str:
    if s.startswith('labelEn:"Won Gyeok'):
        return 'labelEn:"Early Fortune"'
    if s.startswith('labelEn:"Hyeong Gyeok'):
        return 'labelEn:"Prime Years"'
    if s.startswith('labelEn:"Yi Gyeok'):
        return 'labelEn:"Midlife Peak"'
    if s.startswith('labelEn:"Jeong Gyeok'):
        return 'labelEn:"Ultimate Destiny"'
    return s

replacements = [(old, map_label(old)) for old in dict.fromkeys(discovered)]

# Summary table headers (English branch)
replacements += [
    ('S?"초년":"Early"', 'S?"초년":"Early Fortune"'),
    ('S?"장년":"Prime"', 'S?"장년":"Prime Years"'),
    ('S?"중년":"Middle"', 'S?"중년":"Midlife Peak"'),
    ('S?"말년":"Later"', 'S?"말년":"Ultimate Destiny"'),
    (
        'S?"탄생일 원형이정 (元亨利貞) 풀이":"Birth Date Destiny Reading (元亨利貞)"',
        'S?"탄생일 원형이정 (元亨利貞) 풀이":"Birth Date Life Stages"',
    ),
    (
        'S?"탄생일 (원형이정 풀이용, 선택)":"Date of Birth (for Destiny Reading, optional)"',
        'S?"탄생일 (원형이정 풀이용, 선택)":"Date of Birth (for life-stage reading, optional)"',
    ),
]

# Tip about Jeong Gyeok — replace phonetic with clear English
tip_re = re.compile(
    r'The Destiny pillar \(Jeong Gyeok\) influences all life stages and fully manifests after age 55\.'
)
t2, n_tip = tip_re.subn(
    "Ultimate Destiny influences all life stages and fully manifests after age 55.",
    t,
)
t = t2
Path("_won_patch_report.txt").write_text(
    "discovered:\n" + "\n".join(discovered) + f"\n\ntip_repl={n_tip}\n",
    encoding="utf-8",
)

report = []
for old, new in replacements:
    c = t.count(old)
    if c == 0:
        report.append(f"MISS\t{old[:80]}")
    else:
        t = t.replace(old, new)
        report.append(f"OK x{c}\t{old[:60]} → {new[:60]}")

# Sanity: leftover phonetic English labels
leftovers = []
for s in [
    "Won Gyeok",
    "Hyeong Gyeok",
    "Yi Gyeok",
    "Jeong Gyeok",
    "Birth Date Destiny Reading (元亨利貞)",
    'S?"초년":"Early"',
    'S?"장년":"Prime"',
    'S?"중년":"Middle"',
    'S?"말년":"Later"',
]:
    if s in t:
        leftovers.append(f"{s} x{t.count(s)}")

if t == orig:
    raise SystemExit("no changes")

path.write_text(t, encoding="utf-8")
Path("_won_patch_report.txt").write_text(
    "\n".join(report) + "\n\nleftovers:\n" + "\n".join(leftovers or ["(none)"]),
    encoding="utf-8",
)
print("done", len(report), "leftovers", leftovers)
