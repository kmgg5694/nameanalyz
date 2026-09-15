# -*- coding: utf-8 -*-
from pathlib import Path
import subprocess
import re
import sys
sys.stdout.reconfigure(encoding="utf-8")

root = Path(r"C:\Users\a8071\Projects\nameanalyz")
js = (root / "assets/index-kw5.js").read_text(encoding="utf-8")

repls = [
(
'''m.jsx("div",{style:{fontSize:"1rem",fontWeight:800,color:"#166534",marginBottom:"4px"},children:"이렇게만 하세요"}),m.jsx("div",{style:{fontSize:"0.88rem",color:"#14532d",lineHeight:1.55},children:"① 본명 입력 → ② 한문 필요하면 아래 「한문 찾기」 → ③ 맨 아래 큰 버튼. 한문 없이도 됩니다."})''',
'''m.jsx("div",{style:{fontSize:"1rem",fontWeight:800,color:"#166534",marginBottom:"4px"},children:"한글이름만 넣어도 되나요?"}),m.jsx("div",{style:{fontSize:"0.88rem",color:"#14532d",lineHeight:1.55},children:"아니요. 한글칸에 한글을 넣으시고, 자기 성씨는 한문에서 찾아 넣어야 호적에 등록된 것과 같고 실제 이름기운을 볼 수가 있답니다."})'''
),
(
'"🔍 한문 찾기 (선택 — 한글만으로도 OK)"',
'"🔍 한문 찾기 (성씨는 꼭 한문으로)"'
),
(
'"※ 한자는 없어도 풀이됩니다. 김(金)씨는 무조건 金. 필요하면 🔍 찾기로 한자만 고르세요."',
'"※ 성씨는 한문에서 찾아 넣으세요. 김씨는 金. 이름 글자도 한문이 있으면 찾아 넣는 것이 호적과 같습니다."'
),
]

for a,b in repls:
    if a not in js:
        print("MISS", a[:60])
        raise SystemExit(1)
    js = js.replace(a, b, 1)
    print("OK", b[:40])

(root / "assets/index-kw5.js").write_text(js, encoding="utf-8")
r = subprocess.run(["node", "--check", str(root / "assets/index-kw5.js")], capture_output=True)
print("syntax", r.returncode)
if r.returncode:
    print(r.stderr.decode("utf-8", errors="replace")[-400:])
    raise SystemExit(1)

# bump cache in index.html via bytes
html = (root / "index.html").read_bytes()
html2, n = re.subn(br'index-kw5\.js\?v=[^"]+', b'index-kw5.js?v=20260911o', html, count=1)
if n != 1 or b"</title>" not in html2:
    raise SystemExit(f"html bump fail n={n} title={b'</title>' in html2}")
(root / "index.html").write_bytes(html2)
print("html ok", [ln.decode() for ln in html2.split(b"\n") if b"index-kw5" in ln][0].strip())
print("has tip", "한글이름만 넣어도 되나요?" in js)
print("no old", "한문 없이도 됩니다" not in js)
