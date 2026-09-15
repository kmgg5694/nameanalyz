# -*- coding: utf-8 -*-
from pathlib import Path
t = Path("assets/index-kw5.js").read_text(encoding="utf-8")
for s in [
    'Home.tsx:655',
    'Home.tsx:573',
    '한글 이름을 입력',
    '한자 자원오행 선택',
    '이름 풀이 시작',
    'Home.tsx:703',
    'Home.tsx:656',
    'Home.tsx:rankL',
    'id:"koNameInput"',
]:
    print(s, t.find(s), t.count(s))
# print around 655
i = t.find("Home.tsx:655")
print(repr(t[i-80:i+120]))
