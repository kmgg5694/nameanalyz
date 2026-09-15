# -*- coding: utf-8 -*-
from pathlib import Path
t = Path("assets/index-eTNXNndF.js").read_text(encoding="utf-8")
checks = [
    "원형이정",
    "元亨利貞",
    'label:"초년운"',
    'label:"장년운"',
    'label:"중년운"',
    'label:"말년·총운"',
    'labelEn:"Early Fortune"',
    'labelEn:"Prime Years"',
    'labelEn:"Midlife Peak"',
    'labelEn:"Ultimate Destiny"',
    "Birth Date Life Stages",
    "인생 단계",
    "Won Gyeok",
    "원격(元",
    "형격(亨",
]
Path("_won_final_check.txt").write_text(
    "\n".join(f"{c}\t{t.count(c)}" for c in checks), encoding="utf-8"
)
