from pathlib import Path
kw5 = Path(r"C:\Users\a8071\Projects\nameanalyz\assets\index-kw5.js").read_text(encoding="utf-8")
out = Path(r"C:\Users\a8071\Projects\nameanalyz\_kw5_snips")
out.mkdir(exist_ok=True)

needles = [
    "scrollIntoView",
    "scrollTo",
    "scrollTop",
    "찾기",
    "Home.tsx:1537",
    "Home.tsx:1549",
    "한자 검색",
    "hanjaSearch",
    "setHanja",
]
print("=== counts ===")
for n in needles:
    print(f"  {kw5.count(n):4d}  {n}")

# dump around each scrollIntoView
start = 0
c = 0
parts = []
while True:
    i = kw5.find("scrollIntoView", start)
    if i < 0:
        break
    c += 1
    parts.append(f"\n===== scrollIntoView #{c} @{i} =====\n" + kw5[max(0,i-500):i+400])
    start = i + 1
(out/"scroll_hits.txt").write_text("\n".join(parts) if parts else "NONE", encoding="utf-8")

# 찾기 button click
i = kw5.find("🔍 찾기")
(out/"find_btn.txt").write_text(kw5[max(0,i-800):i+1200] if i>=0 else "NONE", encoding="utf-8")

# search panel around 1537
i = kw5.find("Home.tsx:1537")
(out/"hanja_panel.txt").write_text(kw5[max(0,i-1500):i+2500] if i>=0 else "NONE", encoding="utf-8")

# function that opens search - look for picker/modal
for label, n in [
    ("picker_open", "한자 자원오행"),
    ("search_modal", "전체 CSV 다운로드"),
    ("focus_search", "한자 또는 오행"),
]:
    j = kw5.find(n)
    (out/f"{label}.txt").write_text(kw5[max(0,j-600):j+800] if j>=0 else "NONE", encoding="utf-8")

print("wrote snips, scrollIntoView count", c)
