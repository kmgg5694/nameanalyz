# -*- coding: utf-8 -*-
from pathlib import Path
t = Path("assets/index-eTNXNndF.js").read_text(encoding="utf-8")
h = Path("english/index.html").read_text(encoding="utf-8")
checks = [
    "Month (1–12)",
    "Name Energy Elements",
    "Name Flow (You in the Middle)",
    "Share Link",
    "no strong wealth signs",
    "Name Numbers",
    "Name Hexagrams",
    "⚠ Caution",
    "help from elders or a partner is open",
    "English Name Reading",
    "Name Numbers & Life Cards",
    "Element Balance",
    "KakaoTalk",
    "Self-Centered",
    "Mo (1-12)",
    "blue wealth",
    "Inauspicious",
]
lines = [f"{c}\tjs={t.count(c)}\thtml={h.count(c)}" for c in checks]
Path("_en_access_verify.txt").write_text("\n".join(lines), encoding="utf-8")
print("\n".join(lines))
