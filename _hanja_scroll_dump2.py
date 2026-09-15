from pathlib import Path
kw5 = Path(r"C:\Users\a8071\Projects\nameanalyz\assets\index-kw5.js").read_text(encoding="utf-8")
out = Path(r"C:\Users\a8071\Projects\nameanalyz\_kw5_snips")

start = 0
hits = []
c = 0
while True:
    i = kw5.find("scrollTo", start)
    if i < 0:
        break
    c += 1
    hits.append(f"\n===== scrollTo #{c} @{i} =====\n" + kw5[max(0,i-250):i+200])
    start = i + 1
(out/"scrollTo_hits.txt").write_text("\n".join(hits), encoding="utf-8")

start = 0
hits = []
c = 0
while True:
    i = kw5.find("scrollTop", start)
    if i < 0:
        break
    c += 1
    hits.append(f"\n===== scrollTop #{c} @{i} =====\n" + kw5[max(0,i-200):i+180])
    start = i + 1
(out/"scrollTop_hits.txt").write_text("\n".join(hits), encoding="utf-8")

# second 찾기
i1 = kw5.find("🔍 찾기")
i2 = kw5.find("🔍 찾기", i1+1)
(out/"find_btn2.txt").write_text(kw5[max(0,i2-1000):i2+1500] if i2>=0 else "NONE", encoding="utf-8")

print("scrollTo", kw5.count("scrollTo"), "scrollTop", kw5.count("scrollTop"), "찾기", kw5.count("🔍 찾기"))
print("i1", i1, "i2", i2)
