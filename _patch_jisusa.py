# -*- coding: utf-8 -*-
import pathlib, re

path = pathlib.Path('assets/index-kw5.js')
s = path.read_text(encoding='utf-8')

m = re.search(r'id:(\d+),name:"지수사"[^}]+desc:"([^"]+)"', s)
if not m:
    raise SystemExit('지수사 not found')
print('ID:', m.group(1))
print('CURRENT:', m.group(2)[:300])

intro = '군사, 전쟁을 뜻한다(이순신 장군의 이름에 있다), 산사태를 일으키고 홍수가 되어 '
old = f'id:{m.group(1)},name:"지수사",upper:8,lower:5,desc:"'
# find exact object start
obj_m = re.search(r'id:\d+,name:"지수사",upper:\d+,lower:\d+,desc:"', s)
if not obj_m:
    raise SystemExit('object pattern not found')
start = obj_m.end()
if s[start:start+len(intro)] == intro:
    print('already patched')
    raise SystemExit(0)

desc_start = s[start:]
if desc_start.startswith(intro):
    print('already has intro')
    raise SystemExit(0)

s2 = s[:start] + intro + s[start:]
path.write_text(s2, encoding='utf-8')
m2 = re.search(r'id:\d+,name:"지수사"[^}]+desc:"([^"]+)"', s2)
print('NEW:', m2.group(1)[:350])
