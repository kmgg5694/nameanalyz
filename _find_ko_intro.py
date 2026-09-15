from pathlib import Path
t = Path("assets/index-kw5.js").read_text(encoding="utf-8")
i = t.find('className:"intro-sec"')
print("intro at", i)
chunk = t[max(0, i - 4000) : i + 250]
Path("_ko_intro_before.txt").write_text(chunk, encoding="utf-8")
# markers near home layout
for s in [
    "김만기",
    "주역 성명학",
    "intro-sec",
    'data-loc:"client/src/pages/Home.tsx:570"',
    'data-loc:"client/src/pages/Home.tsx:573"',
    'data-loc:"client/src/pages/Home.tsx:598"',
    'data-loc:"client/src/pages/Home.tsx:640"',
    'data-loc:"client/src/pages/Home.tsx:680"',
    "두음법칙",
]:
    print(repr(s), t.find(s))
