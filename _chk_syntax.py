import re
path = r"assets/index-eTNXNndF.js"
with open(path, "r", encoding="utf-8") as f:
    lines = f.readlines()
print("total lines", len(lines))
for i in range(max(0, 84), min(len(lines), 92)):
    L = lines[i]
    print(f"--- line {i+1} len={len(L)} ---")
    print(L[:500])
    if len(L) > 500:
        print("... [truncated]")
