# -*- coding: utf-8 -*-
from pathlib import Path
kw = Path(r"C:\Users\a8071\Projects\nameanalyz\assets\index-kw5.js").read_text(encoding="utf-8")
out = Path(r"C:\Users\a8071\Projects\nameanalyz\_kw5_snips\summary_view.txt")
parts = []
for m in ["요약보기", "한글수리", "한문수리", "한글주역", "한문주역", "원(元)", "미입력"]:
    parts.append("%s count=%s idx=%s" % (m, kw.count(m), kw.find(m)))
i = kw.find("요약보기")
parts.append("\n=== 요약보기 5000 ===")
parts.append(kw[max(0, i - 200) : i + 5000])
i2 = kw.find("한글수리")
parts.append("\n=== 한글수리 4000 ===")
parts.append(kw[max(0, i2 - 400) : i2 + 4000] if i2 >= 0 else "NONE")
out.write_text("\n".join(parts), encoding="utf-8")
print("ok", out.stat().st_size)
