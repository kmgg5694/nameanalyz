# -*- coding: utf-8 -*-
from pathlib import Path
import subprocess
import re
import sys
sys.stdout.reconfigure(encoding="utf-8")

root = Path(r"C:\Users\a8071\Projects\nameanalyz")
# Start from remote broken or local - first get good card bounds precisely
good = subprocess.check_output(
    ["git", "show", "f2fe029:assets/index-kw5.js"], cwd=root
).decode("utf-8")

ga = good.find('m.jsxs("div",{"data-loc":"client/src/pages/Home.tsx:978"')
marker = '획`]})})]}),'
ge = good.find(marker, ga)
if ge < 0:
    raise SystemExit("marker miss in good")
ge += len(marker)
good_card = good[ga:ge]
# Unique follow: next 80 chars after card - should NOT match 978
follow = good[ge:ge+80]
print("follow", repr(follow))
print("follow starts with 978?", follow.startswith('m.jsxs("div",{"data-loc":"client/src/pages/Home.tsx:978"'))

# Reset current file from origin broken - use working tree
cur = (root / "assets/index-kw5.js").read_text(encoding="utf-8")
# If current is from failed restore, also try HEAD
# Find ALL occurrences of 978
idxs = []
start = 0
while True:
    i = cur.find('Home.tsx:978"', start)
    if i < 0:
        break
    idxs.append(i)
    start = i + 1
print("978 hits", idxs)

# Find 한글 획수 after first 978
ca = cur.find('m.jsxs("div",{"data-loc":"client/src/pages/Home.tsx:978"')
stroke = cur.find("한글 획수:", ca)
print("stroke", stroke)
# Find end marker in current
ce = cur.find(marker, ca)
print("ce marker", ce)

# If broken without stroke, checkout file from f2fe029 entirely for the card region
# using: replace from ca to a unique AFTER that exists in BOTH
# Unique after in good: look at follow more carefully
print("good[ge:ge+200]", repr(good[ge:ge+200]))

# Strategy: checkout entire index-kw5.js from f2fe029, then apply center styles, then
# we lose period verdict changes after f2fe029! Bad.
# f2fe029 already has period judgment. 89bcea9 only broke ohang. 
# So: git show 89bcea9 parent is f2fe029... wait 89bcea9 is broken center.
# Best: take current HEAD but replace broken 978 section.
# Find start of broken 한글 오행 in current
br = cur.find("한글 오행")
print("한글 오행", br)
# Find from 978 to next stable unique string that appears after card in good
# From good after card - print first data-loc
import re as _re
m = _re.search(r'data-loc":"([^"]+)"', good[ge:ge+500])
print("next data-loc after card in good", m.group(1) if m else None)

# Use checkout of just... Actually simplest path:
# 1. Save current file
# 2. Extract from f2fe029 the card
# 3. In CURRENT, find ca = 978, and ce = position of NEXT data-loc that follows in good

next_loc = m.group(1) if m else None
if not next_loc:
    raise SystemExit("no next loc")
# Find that loc in current AFTER ca+100 (skip 978 itself)
ce = cur.find(f'data-loc":"{next_loc}"', ca + 50)
print("ce next loc", next_loc, ce)
# But we need to cut BEFORE that element starts - find m.jsx/m.jsxs before it
if ce > 0:
    # walk back to m.jsx or m.jsxs
    chunk = cur[ca:ce]
    # find last complete - the card should end with }]),
    # search backward from ce for }]),
    end = cur.rfind("})]}),", ca, ce)
    print("rfind })]),", end, repr(cur[end:end+40] if end>0 else ""))
    # The good card ends with }]), - so end+6 should be ce area
    if end > 0:
        ce2 = end + len("})]}),")
        print("ce2", ce2, "match follow?", cur[ce2:ce2+40] == follow[:40])
        new = cur[:ca] + good_card + cur[ce2:]
        (root / "assets/index-kw5.js").write_text(new, encoding="utf-8")
        r = subprocess.run(["node", "--check", str(root / "assets/index-kw5.js")], capture_output=True)
        print("syntax", r.returncode)
        if r.returncode:
            print(r.stderr.decode()[-300:])
            raise SystemExit(1)
        print("RESTORED OK")
    else:
        raise SystemExit("no end")
else:
    raise SystemExit("next loc not in cur")
