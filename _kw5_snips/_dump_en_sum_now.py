import pathlib
en = pathlib.Path(r"C:\Users\a8071\Projects\nameanalyz\assets\index-eTNXNndF.js").read_text(encoding="utf-8")
ko = pathlib.Path(r"C:\Users\a8071\Projects\nameanalyz\assets\index-kw5.js").read_text(encoding="utf-8")

def dump(s, needle, before, after, name):
    i = s.find(needle)
    print("===", name, "idx", i, "len", len(s))
    if i < 0:
        return
    pathlib.Path(rf"C:\Users\a8071\Projects\nameanalyz\_kw5_snips\{name}.txt").write_text(
        s[max(0, i - before): i + after], encoding="utf-8"
    )
    print(" wrote", name, "from", max(0, i - before), "to", i + after)

dump(en, "이름풀이 요약보기", 200, 12000, "en_sum_now2")
dump(en, "gwePeriod:\"주역괘 나이: 1~30세\"", 400, 2500, "en_gwe_period")
dump(ko, 'children:"요약보기"', 200, 9000, "ko_sum_now2")
dump(ko, "birthSuri", 80, 400, "ko_birth_hit")
print("en tipMask", "EnglishName.tsx:tipMask" in en)
print("en 1043n", "EnglishName.tsx:1043n" in en)
print("ko 한문수리", "한문수리" in ko)
print("ko 한글수리", "한글수리" in ko)
print("ko birthSuri count", ko.count("birthSuri"))
