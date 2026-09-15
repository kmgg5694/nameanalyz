# -*- coding: utf-8 -*-
from pathlib import Path
import sys
sys.stdout.reconfigure(encoding="utf-8")

def dump(path, marker, before=200, after=1200):
    t = Path(path).read_text(encoding="utf-8")
    i = t.find(marker)
    print(f"=== {path} @ {i} ===")
    print(t[i - before : i + after])
    print()

dump(r"assets/index-kw5.js", 'intro-sec', 300, 1500)
dump(r"assets/index-eTNXNndF.js", 'intro-sec', 300, 1800)
