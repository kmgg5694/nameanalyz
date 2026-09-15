from pathlib import Path
ko = Path(r"C:\Users\a8071\Projects\nameanalyz\assets\index-kw5.js").read_text(encoding="utf-8")
i = ko.find('Home.tsx:1113')
print("1113", i)
if i > 0:
    Path(r"C:\Users\a8071\Projects\nameanalyz\_kw5_snips\ko_home_sum_now.txt").write_text(ko[i:i+14000], encoding="utf-8")
print("한문수리", ko.count("한문수리"), "한글수리", ko.count("한글수리"))
print("Home birthSuri", "Home.tsx" in ko[ko.find("birthSuri")-200:ko.find("birthSuri")+80] if "birthSuri" in ko else False)
# find all 요약보기 near Home
idx = 0
while True:
    j = ko.find('children:"요약보기"', idx)
    if j < 0:
        break
    print("요약보기 at", j, ko[j-80:j+20].replace("\n"," "))
    idx = j + 1
