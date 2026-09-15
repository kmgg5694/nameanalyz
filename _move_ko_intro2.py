# -*- coding: utf-8 -*-
from pathlib import Path

t = Path("assets/index-kw5.js").read_text(encoding="utf-8")
intro_start = t.find('m.jsxs("div",{className:"intro-sec"')
needle = 'preload:"auto"})})]}),'
intro_end = t.find(needle, intro_start) + len(needle)
intro_block = t[intro_start:intro_end]

for s in [
    "Home.tsx:510",
    "Home.tsx:527",
    "sticky top-0",
    "sticky top-[58px]",
    "koNameInput",
    "ink-card p-5 space-y-4",
    "이름 입력",
    "본명을 입력",
]:
    print(repr(s), t.find(s))

# dump around sticky header
i = t.find("sticky top-0")
Path("_ko_sticky.txt").write_text(t[i : i + 2500], encoding="utf-8")
print("wrote sticky", i)

# find content after nav - look for main class after sticky top-[58px]
j = t.find("sticky top-[58px]")
Path("_ko_nav2.txt").write_text(t[j : j + 2000], encoding="utf-8")
print("wrote nav2", j)

# What comes right before intro currently
Path("_ko_before_intro.txt").write_text(t[intro_start - 200 : intro_start + 20], encoding="utf-8")
