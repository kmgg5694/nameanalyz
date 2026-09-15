from pathlib import Path
t = Path("assets/index-kw5.js").read_text(encoding="utf-8")
for s in ["m.jsx(v6", "v6,{", "Home.tsx:207", "EnglishName.tsx:1113", "💬", "카카오톡"]:
    idx = 0
    cnt = 0
    while True:
        i = t.find(s, idx)
        if i < 0: break
        cnt += 1
        if s == "m.jsx(v6" or cnt <= 2:
            print(s, cnt, "at", i, repr(t[i:i+80]))
        idx = i + 1
    print(s, "total", cnt)
