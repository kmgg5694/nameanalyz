# -*- coding: utf-8 -*-
import re
import json
from pathlib import Path

t = Path(r"C:\Users\a8071\Projects\nameanalyz\assets\index-eTNXNndF.js").read_text(encoding="utf-8")
out = []

# Extract sy={1:{nameEn:...}, ...} object - find start
m = re.search(r"\bsy=\{1:\{nameEn:", t)
if not m:
    m = re.search(r"sy=\{1:\{nameEn:", t)
out.append(f"sy start {m.start() if m else None}\n")

# Extract all nameEn from sy-like block - find from first to near end of 81
start = t.find('sy={1:{nameEn:"')
if start < 0:
    start = t.find("sy={1:{nameEn:'")
# brace match for sy=
i = t.find("{", start)
depth = 0
end = None
for j in range(i, min(i + 500000, len(t))):
    if t[j] == "{":
        depth += 1
    elif t[j] == "}":
        depth -= 1
        if depth == 0:
            end = j + 1
            break
block = t[i:end]
names = re.findall(r"nameEn:\"([^\"]+)\"", block)
out.append(f"sy nameEn count={len(names)}\n")
for idx, n in enumerate(names, 1):
    out.append(f"{idx}\t{n}\n")

# Find hexagram English names - look for 건위천 patterns or hex maps
for pat in [r"nameEn:\"[^\"]{0,40}cheon", r"Geonwi", r"乾", r"hex64", r"gwaNames", r"HEX_EN", r"卦"]:
    ms = list(re.finditer(pat, t, re.I))
    out.append(f"pat {pat}: {len(ms)}\n")

# Search romanized hex like Hwajijin
for word in ["Hwajijin", "Jisusa", "Sanroei", "Geonwicheon", "Gonwiji", "Suroedun", "Dongin", "Daeyu"]:
    out.append(f"{word}: {t.find(word)}\n")

# Find objects with 64 Korean hex keys and English values
# HAENGUN style
for key in ["건위천", "화지진", "지수사"]:
    pos = t.find(f'"{key}"')
    out.append(f'key {key} @{pos}\n')
    if pos > 0:
        out.append(t[pos : pos + 120] + "\n")

Path(r"C:\Users\a8071\Projects\nameanalyz\_suri_nameen_list.txt").write_text("".join(out), encoding="utf-8")
print("ok", len(names) if names else 0)
