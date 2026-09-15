# -*- coding: utf-8 -*-
import re
from pathlib import Path
from collections import Counter

t = Path(r"C:\Users\a8071\Projects\nameanalyz\assets\index-eTNXNndF.js").read_text(encoding="utf-8")
out = []
for pat in [
    "nameEn",
    "suriEn",
    "SURI",
    "gwaEn",
    "hexName",
    "The Creative",
    "New Beginning",
    "Geonwi",
    "Hwaji",
    "Bakyak",
    "초년",
    "nameMap",
]:
    ms = list(re.finditer(re.escape(pat), t))
    out.append(f"{pat}: {len(ms)} @ {[m.start() for m in ms[:8]]}\n")

# dump around nameEn occurrences
for m in re.finditer(r"nameEn", t):
    i = m.start()
    out.append(f"\n--- nameEn @{i} ---\n")
    out.append(t[max(0, i - 80) : i + 400] + "\n")
    if len(out) > 40:
        break

# Look for objects that map numbers 1-81 to strings
# e.g. {1:"...",2:"..."}
for m in re.finditer(r"\{(?:1|\"1\")\s*:\s*\"([^\"]{2,40})\"", t):
    snippet = t[m.start() : m.start() + 200]
    if re.search(r"[\uAC00-\uD7A3]", snippet) or "Begin" in snippet or "수" in snippet:
        out.append(f"\nmap-like @{m.start()}: {snippet[:180]}\n")

Path(r"C:\Users\a8071\Projects\nameanalyz\_find_nameen.txt").write_text("".join(out), encoding="utf-8")
print("wrote", len(out))
