# -*- coding: utf-8 -*-
from pathlib import Path

t = Path("assets/index-kw5.js").read_text(encoding="utf-8")
intro_start = t.find('m.jsxs("div",{className:"intro-sec"')
needle = 'preload:"auto"})})]}),'
intro_end = t.find(needle, intro_start) + len(needle)
intro_block = t[intro_start:intro_end]

marker = 'client/src/pages/Home.tsx:570",className:"max-w-lg mx-auto space-y-6",style:{scrollMarginTop:"110px"},children:['
mi = t.find(marker)
if mi < 0 or intro_start < 0:
    raise SystemExit(f"markers missing mi={mi} intro={intro_start}")

print("BEFORE", repr(t[intro_start - 20 : intro_start]))
print("AFTER", repr(t[intro_end : intro_end + 30]))

without = t[:intro_start] + t[intro_end:]
mi2 = without.find(marker)
insert_at = mi2 + len(marker)
new_t = without[:insert_at] + intro_block + without[insert_at:]

pos_intro = new_t.find('className:"intro-sec"')
pos_title = new_t.find('children:"이름 분석"')
assert new_t.count('className:"intro-sec"') == 1
assert pos_intro < pos_title
assert pos_intro > 0

Path("assets/index-kw5.js").write_text(new_t, encoding="utf-8")
print("OK intro", pos_intro, "title", pos_title)
