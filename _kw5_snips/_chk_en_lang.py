from pathlib import Path
t = Path(r"C:\Users\a8071\Projects\nameanalyz\assets\index-eTNXNndF.js").read_text(encoding="utf-8")
print("sumTable", "EnglishName.tsx:sumTable" in t)
print("lang hits")
for s in ["useState(\"en\")", "useState(\"ko\")", "get(\"lang\")", "ln=ko", "setLang", "R===\"ko\""]:
    print(s, t.find(s))
i = t.find("[R,D]=j.useState")
print("R state", t[i:i+80] if i>=0 else None)
i = t.find("EnglishName.tsx:sumTable")
print("table around", t[i:i+200])
