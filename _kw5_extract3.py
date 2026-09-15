from pathlib import Path
t = Path(r"C:\Users\a8071\Projects\nameanalyz\assets\index-kw5.js").read_text(encoding="utf-8")
out = Path(r"C:\Users\a8071\Projects\nameanalyz\_kw5_snips")

# early dominant-
i = t.find("dominant-")
(out/"early_dominant.txt").write_text(t[max(0,i-400):i+600], encoding="utf-8")
i2 = t.find("missing-")
(out/"early_missing.txt").write_text(t[max(0,i2-400):i2+600], encoding="utf-8")

# Td[ usages
idx = 0
hits = []
while True:
    idx = t.find("Td[", idx)
    if idx < 0:
        break
    hits.append(t[idx-80:idx+80])
    idx += 3
(out/"td_bracket_hits.txt").write_text("\n---\n".join(hits), encoding="utf-8")

# how B6 computes ohangCounts - around first ohangCounts in B6
oc = t.find("ohangCounts")
(out/"ohangCounts_def.txt").write_text(t[oc-600:oc+900], encoding="utf-8")

# T6 end -> Td start: is Td inside T6 or after j6 closed?
t6 = t.find("function T6(")
(out/"t6_end.txt").write_text(t[t6:t6+200] + "\n...\n" + t[1965000:1965300], encoding="utf-8")

# Check Home still has 강합니다 besides Td
j6, b6 = t.find("function j6("), t.find("function B6(")
home = t[j6:t.find("function xk(")]
(out/"home_강합니다.txt").write_text(
    f"강합니다 in j6 body before xk: {home.count('강합니다')}\n"
    f"결핍 in j6: {home.count('결핍')}\n"
    f"Td in j6 body: {home.count('Td')}\n"
    f"ohangCounts in j6: {home.count('ohangCounts')}\n"
    f"j6_len={len(home)}\n",
    encoding="utf-8",
)

print("ok")
