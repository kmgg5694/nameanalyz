# -*- coding: utf-8 -*-
import pathlib
css = pathlib.Path('assets/index-D-uQpcUF.css').read_text(encoding='utf-8')
i = css.find('@media print')
print('korean print block at', i)
print(css[i:i+1200])
css2 = pathlib.Path('assets/index-bsqWv9Bg.css').read_text(encoding='utf-8')
print('\nenglish has print', '@media print' in css2)
