from pathlib import Path
t = Path(r"C:\Users\a8071\Projects\nameanalyz\assets\index-eTNXNndF.js").read_text(encoding="utf-8")
print("sumTable", "EnglishName.tsx:sumTable" in t)
print("1043n", "EnglishName.tsx:1043n" in t)
print("tipMask", "EnglishName.tsx:tipMask" in t)
print("setTip", t.count("setTip"))
print("underline", t.count("textDecoration:\"underline\""))
i = t.find("EnglishName.tsx:1043n")
print("hint", t[i:i+350] if i>=0 else "NO HINT")
i = t.find("EnglishName.tsx:sumTable")
print("table head", t[i:i+400] if i>=0 else "NO TABLE")
i = t.find("textDecoration:\"underline\"")
# find underlines near sumTable
j = t.find("sumTable")
chunk = t[j:j+4000] if j>=0 else ""
print("table underline count", chunk.count("textDecoration:\"underline\""))
print("table setTip count", chunk.count("setTip"))
