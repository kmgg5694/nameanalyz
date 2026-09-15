from pathlib import Path
t = Path(r"C:\Users\a8071\Projects\nameanalyz\assets\index-kw5.js").read_text(encoding="utf-8")
needles = [
    "기운이 강합니다",
    "기운이 없습니다",
    "기운 결핍",
    "가장 강한",
    "Td={",
    "Nd={",
    "A6={",
    "ohangCounts",
    "hg-dominant",
    "hg-missing",
    "Home.tsx:ohangExt",
    "한글 가운데 글자",
    "function B6(",
    "EnglishName.tsx:826",
]
for n in needles:
    print(f"{n!r:30} {t.count(n)}")

print("\n--- 강합니다 contexts ---")
start = 0
for i in range(t.count("기운이 강합니다")):
    j = t.find("기운이 강합니다", start)
    print(i, j, t[max(0,j-70):j+40].replace("\n"," "))
    start = j+1

print("\n--- Td= ---")
j = t.find("Td={")
print("at", j)
print(t[j:j+180] if j>=0 else "none")

print("\n--- B6 ohang render ---")
j = t.find("EnglishName.tsx:826")
print(t[j-100:j+500] if j>=0 else "none")
