from pathlib import Path
t = Path(r"C:\Users\a8071\Projects\nameanalyz\assets\index-eTNXNndF.js").read_text(encoding="utf-8")
for s in ['children:"한국어"', "D(\"ko\")", "D('ko')", "setLang", "lang===", "R==="]:
    print(s, t.count(s), t.find(s))
i = t.find('children:"한국어"')
print(t[i-250:i+180] if i>=0 else "no")
i = t.find("S=R===\"ko\"")
print("S=R", i, t[i-80:i+40] if i>=0 else "")
