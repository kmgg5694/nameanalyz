# -*- coding: utf-8 -*-
import pathlib, re

path = pathlib.Path('assets/index-kw5.js')
s = path.read_text(encoding='utf-8')

old = 'id:52,name:"산뢰이",upper:7,lower:4,desc:"아무것도 남아 있는 것이 없었다.'
new = 'id:52,name:"산뢰이",upper:7,lower:4,desc:"산을 찌렁 찌렁 울릴 정도의 큰 우뢰 소리에 모두 놀라 우뢰가 떨어진 곳을 가보니 아무것도 남아 있는 것이 없었다.'

if old not in s:
    m = re.search(r'id:52,name:"산뢰이"[^}]+desc:"([^"]+)"', s)
    if m:
        print('CURRENT:', m.group(1)[:200])
    raise SystemExit('old string not found')

s2 = s.replace(old, new, 1)
path.write_text(s2, encoding='utf-8')
print('patched ok')

m = re.search(r'id:52,name:"산뢰이"[^}]+desc:"([^"]+)"', s2)
print('NEW:', m.group(1)[:250])
