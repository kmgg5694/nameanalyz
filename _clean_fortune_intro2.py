# -*- coding: utf-8 -*-
"""Remove leftover intro caption JS from lucky-8 / app_iljin."""
from pathlib import Path
import re
import sys

sys.stdout.reconfigure(encoding="utf-8")


def clean(path: Path) -> None:
    t = path.read_text(encoding="utf-8")
    orig = t
    # Remove INTRO_CAPTIONS object
    t = re.sub(
        r"\n\s*var INTRO_CAPTIONS = \{[\s\S]*?\n\};\n",
        "\n",
        t,
        count=1,
    )
    # Remove setIntroCaption function
    t = re.sub(
        r"\n\s*function setIntroCaption\([\s\S]*?\n\}\n",
        "\n",
        t,
        count=1,
    )
    # Remove any remaining playIntro / bindIntroUnmute / ensureIntroCaption
    for fn in ("bindIntroUnmute", "playIntro", "ensureIntroCaption"):
        t = re.sub(
            rf"\n\s*function {fn}\([\s\S]*?\n\}\n",
            "\n",
            t,
            count=1,
        )
    t = re.sub(r"\n\s*playIntro\([^)]*\);\n", "\n", t)
    t = re.sub(r"\n\s*\.intro-[^\n]*", "", t)
    t = re.sub(r"\n\s*@keyframes introCapScroll\{[\s\S]*?\n\}", "", t)
    path.write_text(t, encoding="utf-8")
    left = len(re.findall(r"intro-(sec|caption|video|player|ttl|btn|langs)", t, flags=re.I))
    print(path.parent.name, "changed", t != orig, "intro-ui left", left)


for p in (
    Path(r"C:\Users\a8071\Projects\lucky-8\index.html"),
    Path(r"C:\Users\a8071\Projects\app_iljin\index.html"),
):
    clean(p)
