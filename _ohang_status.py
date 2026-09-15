from pathlib import Path

kw5 = Path(r"C:\Users\a8071\Projects\nameanalyz\assets\index-kw5.js").read_text(encoding="utf-8")
etnx = Path(r"C:\Users\a8071\Projects\nameanalyz\assets\index-eTNXNndF.js").read_text(encoding="utf-8")
out = Path(r"C:\Users\a8071\Projects\nameanalyz\_kw5_snips")
out.mkdir(exist_ok=True)

needles = [
    "기운이 강합니다","기운이 없습니다","Td={","ohangExt","hg-mid-ext","재물운 보존력",
    "양부모·관청","왕따","가장 강한","겉으로 드러내는","내적 기운","ohangCounts",
    "Strongest","Missing ","기운 결핍","function dy(","function B6(","function j6(",
]
lines = ["=== kw5 ==="]
for n in needles:
    lines.append(f"  {kw5.count(n):3d}  {n}")
lines.append("=== eTNX ===")
for n in needles:
    lines.append(f"  {etnx.count(n):3d}  {n}")
(out/"status.txt").write_text("\n".join(lines), encoding="utf-8")

# Home ohang IIFE
hx = kw5.find("Home.tsx:ohangExt")
(out/"home_ohang.txt").write_text(kw5[hx-2500:hx+4200] if hx>=0 else "NONE", encoding="utf-8")

# eTNX ohang UI around dominant / 강합니다
i = etnx.find("기운이 강합니다")
(out/"etnx_강합니다.txt").write_text(etnx[max(0,i-400):i+500] if i>=0 else "NONE", encoding="utf-8")
i = etnx.find("ohangCounts")
(out/"etnx_ohangCounts.txt").write_text(etnx[max(0,i-200):i+800] if i>=0 else "NONE", encoding="utf-8")

# find English result ohang section headings
for label, n in [
    ("etnx_strongest","Strongest"),
    ("etnx_겉","겉으로"),
    ("etnx_middle","middleRep"),
    ("etnx_상생","상생"),
    ("etnx_재물","재물운"),
]:
    i = etnx.find(n)
    (out/f"{label}.txt").write_text(etnx[max(0,i-300):i+900] if i>=0 else "NONE", encoding="utf-8")

print("kw5", len(kw5), "etnx", len(etnx))
print("\n".join(lines))
