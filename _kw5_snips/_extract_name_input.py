import re
path = r"C:\Users\a8071\Projects\nameanalyz\assets\index-kw5.js"
with open(path, "r", encoding="utf-8") as f:
    s = f.read()

needle = "예: 홍길동"
print("count 예: 홍길동:", s.count(needle))
print("count value:t.name:", s.count("value:t.name"))

idx = s.find(f'placeholder:"{needle}"')
pos = s.rfind('m.jsx("input",{', 0, idx)
i = pos + len('m.jsx("input",')
d = 1
j = i + 1
while j < len(s) and d:
    if s[j] == "{":
        d += 1
    elif s[j] == "}":
        d -= 1
    j += 1
full = s[pos:j]
print("FULL_INPUT_JSX:")
print(full)

# t.name onChange contexts
print("\n--- t.name onChange hits ---")
for m in re.finditer(r"onChange[^}]{0,200}t\.name|value:t\.name[^}]{0,200}onChange", s):
    print(m.group()[:250])

# other placeholders with same text
print("\n--- all placeholder 예: 홍길동 inputs ---")
for m in re.finditer(r'm\.jsx\("input",\{[^}]*placeholder:"예: 홍길동"[^}]*\}\)', s):
    print(m.group())

# Home.tsx 577-581 area (actual loc from snippet)
for loc in ["577", "578", "579", "580", "581"]:
    pat = f'Home.tsx:{loc}'
    if pat in s:
        i2 = s.find(pat)
        print(f"\n--- {pat} context ---")
        print(s[max(0, i2 - 100): i2 + 400])
