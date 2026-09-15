# -*- coding: utf-8 -*-
from pathlib import Path
p = Path("assets/index-kw5.js")
t = p.read_text(encoding="utf-8")
old = '한자·성별은 없어도 됩니다."})]},),m.jsx'
new = '한자·성별은 없어도 됩니다."})]}),m.jsx'
c = t.count(old)
print("count", c)
if c != 1:
    # show nearby
    i = t.find("easyTip")
    print(repr(t[i : i + 400]))
    raise SystemExit("bad count")
p.write_text(t.replace(old, new, 1), encoding="utf-8")
print("fixed")
