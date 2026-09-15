# -*- coding: utf-8 -*-
from pathlib import Path
import sys
sys.stdout.reconfigure(encoding="utf-8")
kw = Path(r"C:\Users\a8071\Projects\nameanalyz\assets\index-kw5.js").read_text(encoding="utf-8")
for s in ["intro-sec", "introPlayer", "introVideo", "이름풀이_한국어", ".mp4", "소개영상", "bindIntro"]:
    print(s, kw.find(s))
