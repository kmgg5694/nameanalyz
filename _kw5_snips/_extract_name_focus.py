# -*- coding: utf-8 -*-
path = r"C:\Users\a8071\Projects\nameanalyz\assets\index-kw5.js"
out_path = r"C:\Users\a8071\Projects\nameanalyz\_kw5_snips\name_input_focus.txt"

with open(path, "r", encoding="utf-8") as f:
    s = f.read()

needle = 'placeholder:"예: 홍길동"'
idx = s.find(needle)
if idx == -1:
    raise SystemExit("placeholder not found")

search_start = s.rfind('m.jsx("input",{', 0, idx)
if search_start == -1:
    raise SystemExit("m.jsx input not found")


def extract_balanced(text, start):
    i = start
    depth = 0
    in_str = None
    escape = False
    while i < len(text):
        c = text[i]
        if in_str:
            if escape:
                escape = False
            elif c == "\\":
                escape = True
            elif c == in_str:
                in_str = None
        else:
            if c in ('"', "'", "`"):
                in_str = c
            elif c == "{":
                depth += 1
            elif c == "}":
                depth -= 1
                if depth == 0:
                    return text[start : i + 1]
        i += 1
    return None


obj_start = s.find("{", search_start)
obj = extract_balanced(s, obj_start)
if not obj:
    raise SystemExit("failed to extract balanced object")

full = s[search_start : obj_start + len(obj)]

with open(out_path, "w", encoding="utf-8") as f:
    f.write(full)

print("Wrote", len(full), "chars to", out_path)
print("has onFocus:", "onFocus" in full)

if "onFocus:" in full:
    fi = full.find("onFocus:")
    rest = full[fi + len("onFocus:") :]
    # onFocus value is G=>{...} or similar arrow fn
    if rest.lstrip().startswith("G=>"):
        fn_start = full.find("G=>", fi)
        # find opening brace after =>
        brace = full.find("{", fn_start)
        fn_body_obj = extract_balanced(full, brace)
        print("\n--- onFocus function body ---")
        print(fn_body_obj)
    else:
        print("\n--- onFocus prefix ---")
        print(rest[:300])
