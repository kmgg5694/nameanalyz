from pathlib import Path
good = Path("_good_en.js").read_text(encoding="utf-8")
mark = 'return E.jsxs("div",{"data-loc":"client/src/pages/EnglishName.tsx:sumTable"'
e = good.find(mark)
out = []
out.append(f"mark at {e}\n")
out.append("before mark:\n" + good[e-400:e] + "\n")
for key in ["(()=>{const strip=", "(()=>{const", "EnglishName.tsx:1042m", "1042m"]:
    s = good.rfind(key, 0, e)
    out.append(f"{key} -> {s}\n")
Path("_cmp_out.txt").write_text("".join(out), encoding="utf-8")
