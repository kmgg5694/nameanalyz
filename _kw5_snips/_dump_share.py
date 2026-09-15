# -*- coding: utf-8 -*-
from pathlib import Path
import sys
sys.stdout.reconfigure(encoding="utf-8", errors="replace")

root = Path(r"C:\Users\a8071\Projects\nameanalyz")
out = root / "_kw5_snips"

kw = (root / "assets/index-kw5.js").read_text(encoding="utf-8")
en = (root / "assets/index-eTNXNndF.js").read_text(encoding="utf-8")

# Korean Home share around line 99-101
i = kw.find("링크를 열면")
out.joinpath("ko_share_kakao.txt").write_text(kw[max(0,i-2500):i+800], encoding="utf-8")
print("kakao alert", i)

i = kw.find('G.get("name")')
out.joinpath("ko_url_restore.txt").write_text(kw[i-200:i+1200], encoding="utf-8")
print("restore", i)

# 공유하기 buttons
for s in ["shareNative", "📤 공유하기", "navigator.share", "result-full-capture", "pr-card-capture", "g.set(\"name\""]:
    print(s, "kw", kw.find(s), "en", en.find(s), "kwc", kw.count(s), "enc", en.count(s))

i = kw.find("📤 공유하기")
print("ko share btn ctx", kw[i-400:i+200] if i>=0 else "none")

i = en.find("shareNative")
out.joinpath("en_share_native.txt").write_text(en[i-200:i+1800] if i>=0 else "none", encoding="utf-8")
print("en shareNative", i)
