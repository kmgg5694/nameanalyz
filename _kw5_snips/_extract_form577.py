# -*- coding: utf-8 -*-
from pathlib import Path

kw = Path(r"C:\Users\a8071\Projects\nameanalyz\assets\index-kw5.js").read_text(encoding="utf-8")
out = Path(r"C:\Users\a8071\Projects\nameanalyz\_kw5_snips\form_start.txt")
parts = []

markers = [
    "이름풀이 시작",
    "한문찾기",
    "한문 찾기",
    "두음법칙",
    "경고",
    "Home.tsx:577",
    "Home.tsx:581",
    "Home.tsx:602",
    "Home.tsx:655",
    "Home.tsx:718",
    "onSearchClick",
    "분석 시작",
]
for m in markers:
    i = kw.find(m)
    parts.append("%s -> %s count=%s" % (m, i, kw.count(m)))

# dump around 이름풀이 시작
i = kw.find("이름풀이 시작")
parts.append("\n=== 이름풀이 시작 context 2500 before, 800 after ===")
parts.append(kw[max(0, i - 2500) : i + 800])

# dump around 한문찾기 / 한자 검색 UI - the CSV download is near picker
j = kw.find("⬇ 전체 CSV 다운로드")
# find where the hanja picker modal/section starts relative to input form
# search 한자 찾기 button on the form
for m in ["한자 찾기", "한문 찾기", "한자를 고르", "한자찾기"]:
    parts.append("\n=== %s idx %s ===" % (m, kw.find(m)))
    k = kw.find(m)
    if k >= 0:
        parts.append(kw[max(0, k - 200) : k + 200])

out.write_text("\n".join(parts), encoding="utf-8")
print("wrote", out.stat().st_size)
