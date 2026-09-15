import re
path = r"C:\Users\a8071\Projects\nameanalyz\assets\index-kw5.js"
out = r"C:\Users\a8071\Projects\nameanalyz\_kw5_snips\name_focus_live.txt"
with open(path, "r", encoding="utf-8") as f:
    s = f.read()
idx = s.find('id:"koNameInput"')
if idx < 0:
    raise SystemExit("koNameInput not found")
start = max(0, idx - 5000)
chunk = s[start:idx + 500]
of_idx = chunk.rfind("onFocus:")
if of_idx < 0:
    raise SystemExit("onFocus not found before koNameInput")
abs_of = start + of_idx
rest = s[abs_of:]
m = re.search(r"onFocus:.*?},className", rest, re.DOTALL)
if not m:
    raise SystemExit("onFocus..className pattern not found")
focus_str = m.group(0)
with open(out, "w", encoding="utf-8") as f:
    f.write(focus_str)
print("WROTE", out)
print("LEN", len(focus_str))
print("visualViewport scroll listener:", 'addEventListener("scroll"' in focus_str)
print("scrollIntoView block center:", 'scrollIntoView({block:"center"' in focus_str or "scrollIntoView({block:'center'" in focus_str)
print("---")
print(focus_str)
