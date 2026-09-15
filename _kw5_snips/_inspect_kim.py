path = r"C:\Users\a8071\Projects\nameanalyz\assets\index-kw5.js"
with open(path, "r", encoding="utf-8") as f:
    c = f.read()

kim = "★ 김(金)씨 — 한자 관계없이 항상 金 오행"
i = c.index(kim)
print("BEFORE kim (-150):")
print(repr(c[i - 150 : i]))
print("AFTER kim (+200):")
print(repr(c[i + len(kim) : i + len(kim) + 200]))

div150 = c.index("client/src/pages/Home.tsx:150")
with open(
    r"C:\Users\a8071\Projects\nameanalyz\_kw5_snips\x6_div150_area.txt",
    "w",
    encoding="utf-8",
) as out:
    out.write(c[div150 : div150 + 600])

# Old x6 from x6_start for comparison
with open(
    r"C:\Users\a8071\Projects\nameanalyz\_kw5_snips\x6_start.txt", "r", encoding="utf-8"
) as f:
    old = f.read()
old_kim = old.index(kim)
print("\nOLD after kim (+80):")
print(repr(old[old_kim + len(kim) : old_kim + len(kim) + 80]))

s = c.index("x6=ko.memo(function")
e = c.index("});function v6", s)
x6 = c[s:e + 3]

# Template-literal-aware balance
def balance_tl(s):
    stack = []
    i = 0
    state = "code"  # code, sq, dq, tpl, tpl_expr
    tpl_expr_depth = 0
    while i < len(s):
        ch = s[i]
        if state == "code":
            if ch in "'\"":
                state = "sq" if ch == "'" else "dq"
                i += 1
                continue
            if ch == "`":
                state = "tpl"
                i += 1
                continue
            if ch in "({[":
                stack.append(ch)
            elif ch == ")":
                if not stack or stack[-1] != "(":
                    return False, i, stack
                stack.pop()
            elif ch == "}":
                if not stack or stack[-1] != "{":
                    return False, i, stack
                stack.pop()
            elif ch == "]":
                if not stack or stack[-1] != "[":
                    return False, i, stack
                stack.pop()
            i += 1
        elif state in ("sq", "dq"):
            q = "'" if state == "sq" else '"'
            if ch == "\\":
                i += 2
                continue
            if ch == q:
                state = "code"
            i += 1
        elif state == "tpl":
            if ch == "\\":
                i += 2
                continue
            if ch == "$" and i + 1 < len(s) and s[i + 1] == "{":
                state = "tpl_expr"
                tpl_expr_depth = 1
                stack.append("{")
                i += 2
                continue
            if ch == "`":
                state = "code"
            i += 1
        elif state == "tpl_expr":
            if ch in "'\"":
                q = ch
                i += 1
                while i < len(s):
                    if s[i] == "\\":
                        i += 2
                        continue
                    if s[i] == q:
                        i += 1
                        break
                    i += 1
                continue
            if ch == "`":
                state = "tpl"
                i += 1
                continue
            if ch in "({[":
                stack.append(ch)
            elif ch == ")":
                if not stack or stack[-1] != "(":
                    return False, i, stack
                stack.pop()
            elif ch == "}":
                if not stack or stack[-1] != "{":
                    return False, i, stack
                stack.pop()
                tpl_expr_depth -= 1
                if tpl_expr_depth == 0:
                    state = "tpl"
            elif ch == "]":
                if not stack or stack[-1] != "[":
                    return False, i, stack
                stack.pop()
            i += 1
    if state != "code":
        return False, len(s), stack
    if stack:
        return False, len(s), stack
    return True, -1, []


ok, pos, st = balance_tl(x6)
print("\nTemplate-aware balance:", ok, "at", pos, "stack", st)
with open(
    r"C:\Users\a8071\Projects\nameanalyz\_kw5_snips\x6_last200.txt",
    "w",
    encoding="utf-8",
) as out:
    out.write(x6[-200:])
