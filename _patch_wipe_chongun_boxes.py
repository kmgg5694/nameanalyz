# -*- coding: utf-8 -*-
from pathlib import Path
import subprocess
import sys
sys.stdout.reconfigure(encoding="utf-8")

p = Path("assets/index-kw5.js")
kw = p.read_text(encoding="utf-8")

# 1) Remove Home.tsx 한글/한문 총운 boxes (1178, 1185)
# Find unique anchors
a = kw.find('m.jsx("div",{"data-loc":"client/src/pages/Home.tsx:1178"')
b = kw.find('m.jsx("div",{"data-loc":"client/src/pages/Home.tsx:1193"')
if a < 0 or b < 0 or b <= a:
    raise SystemExit(f"home anchors miss {a} {b}")
# also remove leading "})," pattern: ...children:Wo}),Yo&&m.jsxs...
# a points to start of 1178 div; need to include Yo&& and uo&&po&& wrappers
# look back for Yo&&
start = kw.rfind("Yo&&m.jsxs", 0, a)
if start < 0:
    start = a
print("remove home", start, b)
print("HEAD", kw[start:start+80])
print("BEFORE 1193", kw[b-30:b+40])
kw = kw[:start] + kw[b:]

# 2) Remove PrCard 한글/한문 총운 boxes
pa = kw.find('m.jsxs("div",{"data-loc":"client/src/components/PrCard.tsx:295"')
# end before q.length or next section - PrCard.tsx:315
pb = kw.find('q.length>0&&m.jsxs("div",{"data-loc":"client/src/components/PrCard.tsx:315"')
if pa < 0 or pb < 0:
    # try alternate
    print("prcard anchors", pa, pb)
else:
    # include L&& before 295
    pstart = kw.rfind("L&&m.jsxs", 0, pa)
    if pstart < 0:
        pstart = pa
    print("remove prcard", pstart, pb)
    kw = kw[:pstart] + kw[pb:]

# 3) Revert narrative 1307 judgment box — start from 초년 without 총운/without judge duplicate
# Current has secs.push((()=>{...판정...})()); then secs.push(row("초년...
# Replace judge push with nothing (just go to 초년)
marker = 'secs.push((()=>{const ages=["초년","장년","중년","말년"]'
mi = kw.find(marker)
if mi < 0:
    print("WARN no narrative judge marker")
else:
    # find end of this secs.push(...}); 
    # ends with `})());` after return m.jsxs
    end = kw.find('children:tx},ii))]})})());', mi)
    if end < 0:
        raise SystemExit("nar judge end miss")
    end = end + len('children:tx},ii))]})})();')
    print("strip nar judge", mi, end)
    kw = kw[:mi] + kw[end:]

# Ensure 1193 still has period judgment + 인생의 closing
if "내 인생의 말년" not in kw:
    raise SystemExit("missing closing at verdict")
if "이름기운 · 탄생일 나이대 판정" in kw:
    print("WARN title still in nar?")

# bump cache
html = Path("index.html").read_text(encoding="utf-8")
for oldv, newv in [("20260911f","20260911g"),("20260911e","20260911g"),("20260911d","20260911g")]:
    html = html.replace(f"?v={oldv}", f"?v={newv}")
Path("index.html").write_text(html, encoding="utf-8")

p.write_text(kw, encoding="utf-8")
r = subprocess.run(["node", "--check", str(p)], capture_output=True)
print("syntax", r.returncode)
if r.returncode:
    print(r.stderr.decode("utf-8", errors="replace")[-800:])
else:
    t = p.read_text(encoding="utf-8")
    print("home 한글 총운", "Home.tsx:1179" in t, t.count("한글 총운"))
    print("prcard 한글 총운", "PrCard.tsx:296" in t)
    print("has period 초년은", "초년은" in t)
    print("has closing", "내 인생의 말년" in t)
    print("has 이제 이 이름", "이제 이 이름이 가진" in t)
    print("html", [x for x in html.splitlines() if "index-kw5" in x][0])
