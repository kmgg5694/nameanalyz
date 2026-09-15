import re
for p in [
    r"C:\Users\a8071\Projects\nameanalyz\assets\index-eTNXNndF.js",
    r"C:\Users\a8071\Projects\nameanalyz\assets\index-kw5.js",
]:
    print("====", p.split("\\")[-1])
    t = open(p, encoding="utf-8").read()
    for pat in [r"주역괘 나이:[^\"']+", r"gwePeriod:\"[^\"]+\"", r"period:\"[^\"]+\"", r"초년\([^)]+\)", r"장년\([^)]+\)", r"중년\([^)]+\)", r"말년\([^)]+\)", r"청년\([^)]+\)", r"총운\([^)]+\)"]:
        hits = re.findall(pat, t)
        if hits:
            print(pat, sorted(set(hits))[:20])
