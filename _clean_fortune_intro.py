# -*- coding: utf-8 -*-
"""Finish removing intro leftovers from lucky-8 and app_iljin."""
from pathlib import Path
import re
import sys

sys.stdout.reconfigure(encoding="utf-8")


def clean(path: Path) -> None:
    t = path.read_text(encoding="utf-8")
    # leftover CSS lines
    t = re.sub(r"\n\s*\.intro-[^\n]*", "", t)
    t = re.sub(r"\n\s*@keyframes introCapScroll\{[\s\S]*?\n\}", "", t)
    # dead JS: bindIntroUnmute / playIntro / ensureIntroCaption / forEach intro-btn
    t = re.sub(
        r"\n\s*function bindIntroUnmute\([\s\S]*?\n\}\n",
        "\n",
        t,
        count=1,
    )
    t = re.sub(
        r"\n\s*function playIntro\([\s\S]*?\n\}\n",
        "\n",
        t,
        count=1,
    )
    t = re.sub(
        r"\n\s*function ensureIntroCaption\([\s\S]*?\n\}\n",
        "\n",
        t,
        count=1,
    )
    # remove blocks that only toggle .intro-btn
    t = re.sub(
        r"\n\s*document\.querySelectorAll\('\.intro-btn'\)\.forEach\(function\(b\)\{[\s\S]*?\}\);\n",
        "\n",
        t,
    )
    # autoplay calls
    t = re.sub(r"\n\s*playIntro\([^)]*\);\n", "\n", t)
    path.write_text(t, encoding="utf-8")
    left = len(re.findall(r"intro", t, flags=re.I))
    print(path.parent.name, "intro mentions left≈", left)


clean(Path(r"C:\Users\a8071\Projects\lucky-8\index.html"))
clean(Path(r"C:\Users\a8071\Projects\app_iljin\index.html"))
