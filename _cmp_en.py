import subprocess
from pathlib import Path

good = subprocess.check_output(
    ["git", "show", "56d7f68^:assets/index-eTNXNndF.js"], cwd=r"C:\Users\a8071\Projects\nameanalyz"
)
Path("_good_en.js").write_bytes(good)
cur = Path("assets/index-eTNXNndF.js").read_bytes()
print("good bytes", len(good), "cur bytes", len(cur))

# find first diff offset
for i, (a, b) in enumerate(zip(good, cur)):
    if a != b:
        print("first diff at", i, "good", repr(good[i:i+80]), "cur", repr(cur[i:i+80]))
        break
else:
    if len(good) != len(cur):
        print("prefix equal, len diff", len(good), len(cur))
