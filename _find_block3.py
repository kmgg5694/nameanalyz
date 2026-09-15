from pathlib import Path
good = Path("_good_en.js").read_text(encoding="utf-8")
for m in ["1042m", "1043", "1042", "Summary", "요약", "sumTable", "strip="]:
    print(m, good.find(m))

anchor = 'E.jsxs("div",{"data-loc":"client/src/pages/EnglishName.tsx:781"'
g = good.find(anchor)
print("before781 500 chars:\n", good[g-500:g])
