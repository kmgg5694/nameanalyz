# -*- coding: utf-8 -*-
from pathlib import Path
import sys
sys.stdout.reconfigure(encoding="utf-8")
kw = Path("assets/index-kw5.js").read_text(encoding="utf-8")
i = kw.find('Home.tsx:1307')
print("1307", i)
# dump a large chunk
chunk = kw[i:i+6000]
Path("_nar_1307.txt").write_text(chunk, encoding="utf-8")
print(chunk[:3000])
print("\n==== marks ====")
for s in ["한글이름", "한문이름", "한자이름", "총운", "초년운", "장년", "자세한 이름풀이", "Home.tsx:1431", "birthSuri"]:
    print(s, chunk.find(s))
