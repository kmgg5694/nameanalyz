from pathlib import Path
t = Path(r"C:\Users\a8071\Projects\nameanalyz\assets\index-eTNXNndF.js").read_text(encoding="utf-8")
# around S=R==="ko"
i = t.find('[R,D]=j.useState("en"),S=R==="ko"')
print("state", t[i:i+200])
# find D( near language
idx = 0
n = 0
while n < 15:
    j = t.find("D(", idx)
    if j < 0:
        break
    snippet = t[j:j+30]
    if "ko" in snippet or "en" in snippet or "lang" in snippet.lower():
        print("D at", j, snippet)
        n += 1
    idx = j + 1
    if idx > i + 80000 and n > 3:
        break
# search Korean button for page lang
for s in ["한국어 전환", "한글로", "children:\"한글\"", "🇺🇸", "setR", "onClick:()=>D("]:
    print("==", s, t.find(s))
i = t.find("onClick:()=>D(")
print("onclick D", t[i-80:i+80] if i>=0 else "none")
# more
import re
hits = list(re.finditer(r"onClick:\(\)=>D\([^)]{0,20}\)", t))
print("onclick D count", len(hits))
for h in hits[:10]:
    print(h.group(), "at", h.start())
