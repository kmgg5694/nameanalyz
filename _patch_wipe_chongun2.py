# -*- coding: utf-8 -*-
from pathlib import Path
import subprocess
import sys
sys.stdout.reconfigure(encoding="utf-8")

p = Path("assets/index-kw5.js")
kw = p.read_text(encoding="utf-8")

# Home: remove Yo&& ... 한글총운 ... and uo&&po&& ... 한문총운 ... before 1193
b = kw.find('{"data-loc":"client/src/pages/Home.tsx:1193"')
if b < 0:
    raise SystemExit("1193 miss")
# find start of Yo&& block before 1193
start = kw.rfind('Yo&&m.jsxs("div",{"data-loc":"client/src/pages/Home.tsx:1178"', 0, b)
if start < 0:
    start = kw.rfind("한글 총운 ", 0, b)
    start = kw.rfind("Yo&&", 0, start)
print("home start", start, "1193", b)
if start < 0:
    raise SystemExit("home Yo block miss")
# keep comma structure: ...children:Wo}),JUDGE/1193
# currently: Wo}),Yo&&m.jsxs(...),uo&&po&&m.jsxs(...),m.jsx(...1193
# after: Wo}),m.jsx(...1193
kw = kw[:start] + kw[b:]
# may have broken - check we have }),m.jsx or }),{"data-loc"
# Before start we should end with }),
print("join context", repr(kw[start-20:start+60]))

# PrCard
pb = kw.find('q.length>0&&m.jsxs("div",{"data-loc":"client/src/components/PrCard.tsx:315"')
pstart = kw.rfind('L&&m.jsxs("div",{"data-loc":"client/src/components/PrCard.tsx:295"', 0, pb if pb>0 else len(kw))
print("prcard", pstart, pb)
if pstart > 0 and pb > pstart:
    kw = kw[:pstart] + kw[pb:]

# Narrative: if judgment title exists there AND 총운 boxes gone from home, strip duplicate nar judge
if "이름기운 · 탄생일 나이대 판정" in kw:
    marker = 'secs.push((()=>{const ages=["초년","장년","중년","말년"]'
    mi = kw.find(marker)
    if mi > 0:
        end = kw.find('children:tx},ii))]})})();', mi)
        if end > 0:
            end = end + len('children:tx},ii))]})})();')
            kw = kw[:mi] + kw[end:]
            print("stripped nar duplicate judge")

# Ensure 초년 row still follows in narrative
nar = kw.find("Home.tsx:1307")
print("nar has 초년 row", "초년(1~23세)" in kw[nar:nar+2500] if nar>0 else False)
print("home 한글 총운 count", kw.count("한글 총운"))
print("has 1193 verdict ages", "초년은" in kw)
print("has closing", "내 인생의 말년" in kw)

html = Path("index.html").read_text(encoding="utf-8")
html = html.replace("?v=20260911g", "?v=20260911h").replace("?v=20260911f", "?v=20260911h").replace("?v=20260911e", "?v=20260911h")
Path("index.html").write_text(html, encoding="utf-8")
p.write_text(kw, encoding="utf-8")
r = subprocess.run(["node", "--check", str(p)], capture_output=True)
print("syntax", r.returncode)
if r.returncode:
    print(r.stderr.decode("utf-8", errors="replace")[-800:])
    raise SystemExit(1)
print("OK")
