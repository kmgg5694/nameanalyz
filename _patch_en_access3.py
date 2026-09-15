# -*- coding: utf-8 -*-
from pathlib import Path
import re

t = Path("assets/index-eTNXNndF.js").read_text(encoding="utf-8")
orig = t

# Discover and replace English sides containing generating/controlling
pairs = []
for m in re.finditer(r'(S\?"[^"]*":")([^"]*(?:generating|controlling|natal wealth)[^"]*)(")', t):
    prefix, en, suf = m.group(1), m.group(2), m.group(3)
    new = en
    new = new.replace(
        "Above (Last→First) generating — parents, workplace, seniors, spouse fortune flow",
        "Above (last→first) supportive — parents, workplace, seniors, and partner support flow",
    )
    new = new.replace(
        "Below (self→end) generating — colleagues, juniors, children fortune open",
        "Below (self→end) supportive — colleagues, juniors, and children support are open",
    )
    new = new.replace(
        "One or zero generating links — even a strong natal wealth luck is cut down by the name. A poor name can fail to keep a large inheritance.",
        "One or zero supportive links — even strong birth-date wealth luck is cut down by the name. A weak name can fail to keep a large inheritance.",
    )
    new = new.replace(
        "Both links controlling — this name is prone to isolation or bullying at school.",
        "Both links clash — this name is prone to isolation or bullying at school.",
    )
    new = new.replace("generating", "supportive").replace("controlling", "clashing")
    if new != en:
        pairs.append((prefix + en + suf, prefix + new + suf))

# Also fix non-ternary English if any
extra = [
    (
        "Above (Last→First) generating — parents, workplace, seniors, spouse fortune flow",
        "Above (last→first) supportive — parents, workplace, seniors, and partner support flow",
    ),
    (
        "Below (self→end) generating — colleagues, juniors, children fortune open",
        "Below (self→end) supportive — colleagues, juniors, and children support are open",
    ),
]

report = []
for old, new in pairs + extra:
    c = t.count(old)
    if c:
        t = t.replace(old, new)
        report.append(f"OK x{c} {old[:70]}")
    else:
        report.append(f"MISS {old[:70]}")

# leftover
left = []
for s in ["KakaoTalk", "Self-Centered", "Mo (1-12)", "blue wealth", "Inauspicious", "Name · No.", "generating", "controlling"]:
    # generating in React stack is ok - check UI by looking at S? English only
    if s in ("generating", "controlling"):
        en_hits = re.findall(r'S\?"[^"]*":"[^"]*' + s + r'[^"]*"', t)
        if en_hits:
            left.append(f"{s} in EN ternary x{len(en_hits)}: {en_hits[0][:80]}")
    elif s in t:
        # 音靈 only in Korean side is fine
        if s == "音靈五行":
            continue
        left.append(f"{s} x{t.count(s)}")

if t != orig:
    Path("assets/index-eTNXNndF.js").write_text(t, encoding="utf-8")

Path("_en_access_fix3.txt").write_text("\n".join(report) + "\nLEFT\n" + "\n".join(left or ["(none)"]), encoding="utf-8")
print("done", left or "(none)")
