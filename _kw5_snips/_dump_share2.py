# -*- coding: utf-8 -*-
from pathlib import Path
import sys
sys.stdout.reconfigure(encoding="utf-8", errors="replace")
kw = Path(r"C:\Users\a8071\Projects\nameanalyz\assets\index-kw5.js").read_text(encoding="utf-8")
out = Path(r"C:\Users\a8071\Projects\nameanalyz\_kw5_snips")

i = kw.find("shareNative")
print("shareNative", i)
out.joinpath("ko_share_native.txt").write_text(kw[i-800:i+1400], encoding="utf-8")

i = kw.find("result-full-capture")
print("capture", i)
out.joinpath("ko_capture.txt").write_text(kw[max(0,i-400):i+600], encoding="utf-8")

i = kw.find("html2canvas")
print("html2canvas", i, kw.count("html2canvas"), kw.count("toBlob"), kw.count("toDataURL"))

# English kakao yellow copies location.href
i = en_find = Path(r"C:\Users\a8071\Projects\nameanalyz\assets\index-eTNXNndF.js").read_text(encoding="utf-8")
print("en location.href share", en_find.find("window.location.href"))
