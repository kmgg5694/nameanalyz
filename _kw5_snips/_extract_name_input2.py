import re
path = r"C:\Users\a8071\Projects\nameanalyz\assets\index-kw5.js"
with open(path, "r", encoding="utf-8") as f:
    s = f.read()

# Home.tsx 620-650 locs
print("--- Home.tsx:620-650 locs ---")
for m in re.finditer(r'Home\.tsx:(62[0-9]|63[0-9]|64[0-9]|65[0-9])', s):
    print(m.group(), "at", m.start())

# any input with t.name
print("\n--- inputs mentioning t.name ---")
for m in re.finditer(r'm\.jsx\("input",\{[^}]*t\.name[^}]*\}\)', s):
    print("simple:", m.group()[:120])

# broader: find all onChange handlers that set name:mo or name:
for m in re.finditer(r'name:mo', s):
    st = max(0, m.start()-120)
    en = min(len(s), m.end()+80)
    ctx = s[st:en]
    if 'input' in ctx or 'onChange' in ctx:
        print("name:mo ctx:", ctx)
