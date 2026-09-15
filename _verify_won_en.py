# -*- coding: utf-8 -*-
from pathlib import Path
t = Path("assets/index-eTNXNndF.js").read_text(encoding="utf-8")
checks = [
    'labelEn:"Early Fortune"',
    'labelEn:"Prime Years"',
    'labelEn:"Midlife Peak"',
    'labelEn:"Ultimate Destiny"',
    'S?"초년":"Early Fortune"',
    'S?"장년":"Prime Years"',
    'S?"중년":"Midlife Peak"',
    'S?"말년":"Ultimate Destiny"',
    "Birth Date Life Stages",
    "for life-stage reading, optional",
    "Ultimate Destiny influences all life stages",
    "Won Gyeok",
    "Jeong Gyeok",
    "元亨利貞)",
]
lines = [f"{c}\t{t.count(c)}" for c in checks]
Path("_won_verify.txt").write_text("\n".join(lines), encoding="utf-8")
print("\n".join(lines))
