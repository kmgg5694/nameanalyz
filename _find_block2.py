from pathlib import Path

good = Path("_good_en.js").read_text(encoding="utf-8")
cur = Path("assets/index-eTNXNndF.js").read_text(encoding="utf-8")

anchor = 'E.jsxs("div",{"data-loc":"client/src/pages/EnglishName.tsx:781"'
g = good.find(anchor)

# search backwards for sum section start markers
for mark in [
    "Reading Summary",
    "요약 보기",
    "요약보기",
    "EnglishName.tsx:740",
    "EnglishName.tsx:750",
    "EnglishName.tsx:760",
    "EnglishName.tsx:770",
    "EnglishName.tsx:775",
    "EnglishName.tsx:778",
    "EnglishName.tsx:780",
]:
    i = good.rfind(mark, 0, g)
    if i >= 0:
        print(mark, i, repr(good[i:i+120]))

# find what cur has that good doesn't - insertion point in good
# In good, find last `]},` pattern before 781 that's start of summary section
chunk = good[g-3000:g]
idx = chunk.rfind("children:[E.jsx")
print("last children jsx before 781 at", g-3000+idx if idx>=0 else -1)
