from pathlib import Path

path = Path(r'C:\Users\a8071\Projects\nameanalyz\assets\index-kw5.js')
out = Path(r'C:\Users\a8071\Projects\nameanalyz\_find_ohang.txt')
text = path.read_text(encoding='utf-8', errors='replace')

patterns = [
    't.hanjaOhang',
    'children:ho||"?"',
    'children:el||"?"',
    'ze={木',
    '"은 "',
    'ohangHj',
    'ohangRow',
    'hjO[',
    'selfHj=q?',
]

lines = []
lines.append(f'File: {path}')
lines.append(f'Length: {len(text)} chars')
lines.append('=' * 80)

for pat in patterns:
    lines.append('')
    lines.append(f'PATTERN: {repr(pat)}')
    lines.append('-' * 80)
    start = 0
    count = 0
    while True:
        idx = text.find(pat, start)
        if idx == -1:
            break
        count += 1
        lo = max(0, idx - 100)
        hi = min(len(text), idx + len(pat) + 100)
        snippet = text[lo:hi]
        match_start = idx - lo
        marked = snippet[:match_start] + '>>>' + snippet[match_start:match_start+len(pat)] + '<<<' + snippet[match_start+len(pat):]
        lines.append(f'  Occurrence #{count} at index {idx}:')
        lines.append(f'  {marked}')
        start = idx + 1
    if count == 0:
        lines.append('  (no matches)')
    else:
        lines.append(f'  Total: {count}')

out.write_text('\n'.join(lines), encoding='utf-8')
print('Wrote', out)
