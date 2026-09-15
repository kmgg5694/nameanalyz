# -*- coding: utf-8 -*-
from pathlib import Path
import sys
sys.stdout.reconfigure(encoding="utf-8")
bak = Path(r"C:\Users\a8071\Projects\nameanalyz\_kw5_snips\_kw5_before_hanja_cut.js").read_text(encoding="utf-8")
kw = Path(r"C:\Users\a8071\Projects\nameanalyz\assets\index-kw5.js").read_text(encoding="utf-8")
out = Path(r"C:\Users\a8071\Projects\nameanalyz\_kw5_snips")

bi = bak.find("이름풀이 종합표")
be = bak.find("요약보기", bi)
(out / "jonghap_bak.txt").write_text(bak[bi:be], encoding="utf-8")

# row labels in bak vs live
import re
def labels(s):
    return re.findall(r'children:"([^"]{1,20})"', s)

print("BAK labels unique sample:")
bl = labels(bak[bi:be])
print([x for x in bl if x in ("이름","오행","획수","수리","수리뜻","연령대","주역","|","한문","한글") or "한" in x or "한글" in x or "한문" in x])
print("all bak children short:", [x for x in bl if len(x)<=6][:40])

ki = kw.find("이름풀이 종합표")
ke = kw.find("요약보기", ki)
print("LIVE short:", [x for x in labels(kw[ki:ke]) if len(x)<=6][:40])

# Diff: does bak always show hanja without hjShow?
print("bak hjShow in section", bak[bi:be].count("hjShow"))
print("bak uo in section", bak[bi:be].count("uo"))
print("live hjShow", kw[ki:ke].count("hjShow"), "uo", kw[ki:ke].count("uo"))
