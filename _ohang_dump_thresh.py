from pathlib import Path
kw5 = Path(r"C:\Users\a8071\Projects\nameanalyz\assets\index-kw5.js").read_text(encoding="utf-8")
etnx = Path(r"C:\Users\a8071\Projects\nameanalyz\assets\index-eTNXNndF.js").read_text(encoding="utf-8")
out = Path(r"C:\Users\a8071\Projects\nameanalyz\_kw5_snips")

needles = [
    "상극이 많은",
    "있는듯 없는듯",
    "딱 반반",
    "중간 상태",
    "3개 이상",
    "2개 이하",
    "wealthOk=",
    "balanced=",
    "bully=",
]
print("=== kw5 ===")
for n in needles:
    print(f"  {kw5.count(n):3d}  {n}")
print("=== etnx ===")
for n in needles:
    print(f"  {etnx.count(n):3d}  {n}")

i = kw5.find("wealthOk=q?")
(out/"now_wealth_logic.txt").write_text(kw5[i:i+2200] if i>=0 else "NONE", encoding="utf-8")
i = kw5.find("So=M>=")
(out/"now_so.txt").write_text(kw5[i:i+700] if i>=0 else "NONE", encoding="utf-8")
i = kw5.find("있는듯 없는듯")
(out/"now_indeok.txt").write_text(kw5[max(0,i-250):i+500] if i>=0 else "NONE", encoding="utf-8")
i = etnx.find("wealthOk=ssN")
(out/"now_en_wealth.txt").write_text(etnx[i-80:i+1800] if i>=0 else "NONE", encoding="utf-8")
print("wrote snips")
