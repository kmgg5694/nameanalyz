# -*- coding: utf-8 -*-
import sys
sys.stdout.reconfigure(encoding="utf-8")
from pathlib import Path
t = Path(r"C:\Users\a8071\Projects\nameanalyz\assets\index-kw5.js").read_text(encoding="utf-8")
out = Path(r"C:\Users\a8071\Projects\nameanalyz\_kw5_snips")
out.mkdir(exist_ok=True)

for s in ["ohang-rel-symbol", "data-rel", "생", "극", "비", "sangsaeng", "종합표", "한글오행", "한문오행", "Home.tsx:1044", "Home.tsx:978", "ohang-badge"]:
    print(s, t.count(s), t.find(s))

# dump ohang bar section around 978
i = t.find('data-loc":"client/src/pages/Home.tsx:978"')
(out / "ohang_bar_now.txt").write_text(t[i:i+3500] if i>=0 else "miss978", encoding="utf-8")

# also search 종합
i2 = t.find("종합표")
print("종합 context", t[i2-50:i2+200] if i2>=0 else None)

# find where hangul ohang row in jonghap
for s in ["한글오행", "한자오행", "한문오행", "hjO", "ohangCounts"]:
    j = t.find(s)
    print("loc", s, j)
