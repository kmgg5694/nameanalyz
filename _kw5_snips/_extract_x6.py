import re
import subprocess

path = r"C:\Users\a8071\Projects\nameanalyz\assets\index-kw5.js"
with open(path, "r", encoding="utf-8") as f:
    content = f.read()


def find_matching_brace(s, start_pos, open_ch="{", close_ch="}"):
    depth = 0
    i = start_pos
    in_string = None
    escape = False
    while i < len(s):
        c = s[i]
        if in_string:
            if escape:
                escape = False
            elif c == "\\":
                escape = True
            elif c == in_string:
                in_string = None
            i += 1
            continue
        if c in ('"', "'", "`"):
            in_string = c
            i += 1
            continue
        if c == open_ch:
            depth += 1
        elif c == close_ch:
            depth -= 1
            if depth == 0:
                return i
        i += 1
    return -1


def balance_check(s):
    stack = []
    in_string = None
    escape = False
    i = 0
    while i < len(s):
        c = s[i]
        if in_string:
            if escape:
                escape = False
            elif c == "\\":
                escape = True
            elif c == in_string:
                in_string = None
            i += 1
            continue
        if c in ('"', "'", "`"):
            in_string = c
            i += 1
            continue
        if c in "({[":
            stack.append(c)
        elif c == ")":
            if not stack or stack[-1] != "(":
                return False, f"unmatched ) at {i}"
            stack.pop()
        elif c == "}":
            if not stack or stack[-1] != "{":
                return False, f"unmatched }} at {i}"
            stack.pop()
        elif c == "]":
            if not stack or stack[-1] != "[":
                return False, f"unmatched ] at {i}"
            stack.pop()
        i += 1
    if in_string:
        return False, "unclosed string"
    if stack:
        return False, f"unclosed: {stack}"
    return True, "balanced"


x6_start = content.find("x6=ko.memo(function")
print("x6 start:", x6_start)

func_kw = content.find("function", x6_start)
paren_depth = 0
body_start = -1
i = func_kw + len("function")
while i < len(content):
    c = content[i]
    if c == "(":
        paren_depth += 1
    elif c == ")":
        paren_depth -= 1
    elif c == "{" and paren_depth == 0:
        body_start = i
        break
    i += 1

body_end = find_matching_brace(content, body_start, "{", "}")
print("body_start:", body_start, "body_end:", body_end)
print("after body:", repr(content[body_end : body_end + 8]))

# Correct end: include }); after function body closing brace
comp_end = body_end + 1
suffix = content[comp_end : comp_end + 2]
print("suffix after }:", repr(suffix))
if suffix == ");":
    comp_end += 2
else:
    # fallback: scan for }); 
    if content[comp_end : comp_end + 2] == ")":
        comp_end += 1
    if content[comp_end] == ";":
        comp_end += 1

x6_component = content[x6_start:comp_end]
print("x6 length:", len(x6_component))
print("x6 ends with:", repr(x6_component[-20:]))
print("=== LAST 200 CHARS ===")
print(x6_component[-200:])

ok, msg = balance_check(x6_component)
print("Balance:", ok, msg)

# node check full file
r = subprocess.run(
    ["node", "--check", path],
    capture_output=True,
    text=True,
    encoding="utf-8",
    errors="replace",
)
print("Full file node --check exit:", r.returncode)
if r.returncode != 0:
    print("stderr:", r.stderr[:500])

# node check wrapped x6
wrap_path = r"C:\Users\a8071\Projects\nameanalyz\_kw5_snips\x6_extract.js"
with open(wrap_path, "w", encoding="utf-8") as f:
    f.write("const ko={memo:(f)=>f};\nlet x6;\n")
    f.write(x6_component)
    f.write("\n")

r2 = subprocess.run(
    ["node", "--check", wrap_path],
    capture_output=True,
    text=True,
    encoding="utf-8",
    errors="replace",
)
print("x6 extract node --check exit:", r2.returncode)
if r2.returncode != 0:
    print("stderr:", r2.stderr[:800])

# a("hanja")
print('a("hanja") count:', len(re.findall(r'a\("hanja"\)', content)))
se_marker = "Se=N.useCallback((G,mo)=>{Q(co=>co===mo?null:mo),G&&b(G)},[])"
idx3 = content.find(se_marker)
if idx3 >= 0:
    region = content[max(0, idx3 - 500) : idx3 + len(se_marker) + 500]
    print('a("hanja") near Se:', region.count('a("hanja")'))
