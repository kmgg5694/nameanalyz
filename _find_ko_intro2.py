from pathlib import Path
import re
t = Path("assets/index-kw5.js").read_text(encoding="utf-8")
i = t.find('className:"intro-sec"')
# Find ink-card / form start before intro - look further back
before = t[max(0, i - 25000) : i]
locs = re.findall(r'data-loc:"client/src/pages/Home\.tsx:(\d+)"', before)
uniq = []
for x in locs:
    if not uniq or uniq[-1] != x:
        uniq.append(x)
print("locs sequence (last 40):", uniq[-40:])
# Find title header area
for needle in ["김만기 주역", "성명학 연구소", "ink-card p-5", "koNameInput", "본명", "이름 입력"]:
    print(needle, before.rfind(needle))
# dump around form start (first ink-card near end of before)
p = before.rfind('data-loc:"client/src/pages/Home.tsx:')
# find earliest Home.tsx loc in last 15k
seg = before[-15000:]
m = re.search(r'data-loc:"client/src/pages/Home\.tsx:(\d+)"', seg)
print("first loc in last 15k", m.group(1) if m else None)
# Find sticky header
hs = list(re.finditer(r'className:"[^"]*sticky[^"]*"', before))
print("sticky count", len(hs))
for h in hs[-3:]:
    print(before[h.start()-80:h.start()+120])
