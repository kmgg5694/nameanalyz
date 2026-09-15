path = r"assets/index-eTNXNndF.js"
with open(path, "r", encoding="utf-8") as f:
    lines = f.readlines()
# show end of line 87 and start of 88-95
L87 = lines[86]
print("line87 tail 800:", repr(L87[-800:]))
print("---")
for i in range(87, min(len(lines), 108)):
    L = lines[i]
    print(f"line {i+1} len={len(L)} head200={repr(L[:200])}")
