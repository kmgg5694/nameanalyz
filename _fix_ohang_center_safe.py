# -*- coding: utf-8 -*-
from pathlib import Path
import subprocess
import re
import sys
sys.stdout.reconfigure(encoding="utf-8")

root = Path(r"C:\Users\a8071\Projects\nameanalyz")
good = subprocess.check_output(
    ["git", "show", "f2fe029:assets/index-kw5.js"], cwd=root
).decode("utf-8")
cur = (root / "assets/index-kw5.js").read_text(encoding="utf-8")

marker = '획`]})})]}),'
ga = good.find('m.jsxs("div",{"data-loc":"client/src/pages/Home.tsx:978"')
ge = good.find(marker, ga) + len(marker)
good_card = good[ga:ge]
follow = good[ge:ge+48]
print("follow", repr(follow))

ca = cur.find('m.jsxs("div",{"data-loc":"client/src/pages/Home.tsx:978"')
ce = cur.find(follow, ca)
print("ca,ce", ca, ce)
if ca < 0:
    raise SystemExit("no 978 in current")
if ce < 0:
    # broken: find follow by searching later unique string after card in good
    # After 978 in f2fe029, tip setTip / 1193 already before 978... 
    # follow should be next sibling. Print nearby from good
    print("good after card", repr(good[ge:ge+120]))
    # Try finding 자세한 이름풀이 or ohangCall which is AFTER narrative - too far
    # Search for start of next m.jsxs after stroke in CURRENT by 인덕? 
    # Just find 'Home.tsx:1112' or similar that exists in both after 978
    for s in ['Home.tsx:1112', 'Home.tsx:1113', 'setTip', '이름기운 ·', '요약을 초년']:
        print(s, "good", good.find(s, ge), "cur", cur.find(s, ca))
    raise SystemExit("no follow in current")

# Restore good card first
cur = cur[:ca] + good_card + cur[ce:]
r = subprocess.run(["node", "--check", str(root / "assets/index-kw5.js")], cwd=root, input=None, capture_output=True)
# write first
(root / "assets/index-kw5.js").write_text(cur, encoding="utf-8")
r = subprocess.run(["node", "--check", str(root / "assets/index-kw5.js")], capture_output=True)
print("syntax after restore", r.returncode)
if r.returncode:
    print(r.stderr.decode("utf-8", errors="replace")[-400:])
    raise SystemExit(1)

# Now center: wrap 980/1031 rows
cur = (root / "assets/index-kw5.js").read_text(encoding="utf-8")

# 1) Add padding + center to 978 card style
old978 = 'Home.tsx:978",className:"mt-2 border rounded",style:{borderColor:"#d97706"}'
new978 = 'Home.tsx:978",className:"mt-2 border rounded",style:{borderColor:"#d97706",padding:"10px 6px"}'
if old978 not in cur:
    raise SystemExit("978 style miss")
cur = cur.replace(old978, new978, 1)

# 2) Center row 980
old980 = 'Home.tsx:980",className:"flex items-center py-2",style:{borderBottom:"1px solid #e5e7eb"}'
new980 = 'Home.tsx:980",className:"flex items-center justify-center py-2",style:{borderBottom:"1px solid #e5e7eb",width:"100%",gap:"6px",flexWrap:"wrap"}'
if old980 not in cur:
    raise SystemExit("980 miss")
cur = cur.replace(old980, new980, 1)

# 3) Center row 1031
old1031 = 'Home.tsx:1031",className:"flex items-center py-1"'
new1031 = 'Home.tsx:1031",className:"flex items-center justify-center py-1",style:{width:"100%",gap:"6px",flexWrap:"wrap"}'
if old1031 not in cur:
    raise SystemExit("1031 miss")
cur = cur.replace(old1031, new1031, 1)

# 4) Labels: don't take huge left space - shrink and keep
cur = cur.replace(
    'Home.tsx:981",className:"pr-2 font-bold text-right whitespace-nowrap",style:{color:"#92400e",fontSize:"12px",width:"3.5rem",flexShrink:0}',
    'Home.tsx:981",className:"pr-2 font-bold text-right whitespace-nowrap",style:{color:"#92400e",fontSize:"12px",width:"2.6rem",flexShrink:0}',
    1,
)
cur = cur.replace(
    'Home.tsx:1032",className:"pr-2 font-bold text-right whitespace-nowrap",style:{color:"#92400e",fontSize:"10px",width:"3.5rem",flexShrink:0}',
    'Home.tsx:1032",className:"pr-2 font-bold text-right whitespace-nowrap",style:{color:"#92400e",fontSize:"10px",width:"2.6rem",flexShrink:0}',
    1,
)

# 5) Give hangul/hanja sides equal centered min width so | stays middle
cur = cur.replace(
    'Home.tsx:983",className:"flex items-center justify-center gap-1",style:{flex:1}',
    'Home.tsx:983",className:"flex items-center justify-center gap-1",style:{flex:"1 1 9rem",minWidth:"9rem",maxWidth:"11rem"}',
    1,
)
cur = cur.replace(
    'Home.tsx:1002",className:"flex items-center justify-center gap-1",style:{flex:1}',
    'Home.tsx:1002",className:"flex items-center justify-center gap-1",style:{flex:"1 1 9rem",minWidth:"9rem",maxWidth:"11rem"}',
    1,
)
cur = cur.replace(
    'Home.tsx:1034",className:"flex items-center justify-center gap-1",style:{flex:1}',
    'Home.tsx:1034",className:"flex items-center justify-center gap-1",style:{flex:"1 1 9rem",minWidth:"9rem",maxWidth:"11rem"}',
    1,
)
cur = cur.replace(
    'Home.tsx:1054",className:"flex items-center justify-center gap-1",style:{flex:1}',
    'Home.tsx:1054",className:"flex items-center justify-center gap-1",style:{flex:"1 1 9rem",minWidth:"9rem",maxWidth:"11rem"}',
    1,
)

# 6) Clearer gap between badge and 생/극/비
cur = cur.replace(
    'Home.tsx:985",className:"flex items-center gap-1"',
    'Home.tsx:985",className:"flex items-center gap-1.5"',
)
cur = cur.replace(
    'Home.tsx:1007",className:"flex items-center gap-1"',
    'Home.tsx:1007",className:"flex items-center gap-1.5"',
)
cur = cur.replace(
    'Home.tsx:1039",className:"flex items-center gap-1"',
    'Home.tsx:1039",className:"flex items-center gap-1.5"',
)
cur = cur.replace(
    'Home.tsx:1058",className:"flex items-center gap-1"',
    'Home.tsx:1058",className:"flex items-center gap-1.5"',
)

(root / "assets/index-kw5.js").write_text(cur, encoding="utf-8")
r = subprocess.run(["node", "--check", str(root / "assets/index-kw5.js")], capture_output=True)
print("syntax final", r.returncode)
if r.returncode:
    print(r.stderr.decode("utf-8", errors="replace")[-400:])
    raise SystemExit(1)

html = (root / "index.html").read_text(encoding="utf-8")
html = re.sub(r"index-kw5\.js\?v=[^\"]+", "index-kw5.js?v=20260911k", html)
(root / "index.html").write_text(html, encoding="utf-8")
print("OK", [x for x in html.splitlines() if "index-kw5" in x][0])
print("has justify-center 980", "justify-center py-2" in cur)
