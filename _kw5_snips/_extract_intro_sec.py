"""Extract intro-sec block and around_swap context from index-kw5.js"""
import os

path = r"C:\Users\a8071\Projects\nameanalyz\assets\index-kw5.js"
out_dir = r"C:\Users\a8071\Projects\nameanalyz\_kw5_snips"

with open(path, "r", encoding="utf-8") as f:
    content = f.read()

intro_start_pat = 'm.jsxs("div",{className:"intro-sec"'
start = content.find(intro_start_pat)
if start < 0:
    raise SystemExit("intro-sec start not found")

# Find end of intro-sec block by bracket matching from m.jsxs(
def find_jsx_end(s, pos):
    """Match m.jsxs(...) or m.jsx(...) call starting at pos."""
    # pos should point to 'm.jsxs' or 'm.jsx'
    i = pos
    # find opening paren after jsx/jsxs
    while i < len(s) and s[i] != "(":
        i += 1
    if i >= len(s):
        return -1
    depth_paren = 0
    depth_brace = 0
    depth_bracket = 0
    in_str = None
    escape = False
    begin = i
    for j in range(i, len(s)):
        c = s[j]
        if in_str:
            if escape:
                escape = False
            elif c == "\\":
                escape = True
            elif c == in_str:
                in_str = None
            continue
        if c in ('"', "'", "`"):
            in_str = c
            continue
        if c == "(":
            depth_paren += 1
        elif c == ")":
            depth_paren -= 1
            if depth_paren == 0 and j > begin:
                return j + 1  # include closing paren
        elif c == "{":
            depth_brace += 1
        elif c == "}":
            depth_brace -= 1
        elif c == "[":
            depth_bracket += 1
        elif c == "]":
            depth_bracket -= 1
    return -1

end = find_jsx_end(content, start)
if end < 0:
    raise SystemExit("intro-sec end not found")

# Include trailing comma if present
block_end = end
if block_end < len(content) and content[block_end] == ",":
    block_end += 1

intro_block = content[start:block_end]

# Markers
m571 = content.find("Home.tsx:571")
m577 = content.find("Home.tsx:577")
m676 = content.find("Home.tsx:676")

# Find ink-card at 577 - the div with data-loc 577
loc577 = content.find('"data-loc":"client/src/pages/Home.tsx:577"')
# Find end of 577 card - next sibling after ink-card block
# Search for start of m.jsxs/m.jsx with data-loc 577
card577_start = content.rfind("m.jsxs(", 0, loc577)
if card577_start < 0:
    card577_start = content.rfind("m.jsx(", 0, loc577)
card577_end = find_jsx_end(content, card577_start)
if content[card577_end:card577_end+1] == ",":
    card577_end += 1

# Write intro_sec_full.txt
with open(os.path.join(out_dir, "intro_sec_full.txt"), "w", encoding="utf-8") as f:
    f.write(intro_block)

# around_swap.txt
before200 = content[max(0, start - 200):start]
intro_first80 = intro_block[:80]
after_intro80 = content[block_end:block_end + 80]
end577_80 = content[max(card577_end - 80, 0):card577_end]

around = (
    before200
    + "---"
    + intro_first80
    + "---"
    + after_intro80
    + "---"
    + end577_80
)
with open(os.path.join(out_dir, "around_swap.txt"), "w", encoding="utf-8") as f:
    f.write(around)

# Report
print(f"intro-sec start idx: {start}")
print(f"intro-sec end idx (exclusive): {block_end}")
print(f"intro-sec length: {len(intro_block)}")
print(f"START exact (first 120): {repr(intro_block[:120])}")
print(f"END last 80: {repr(intro_block[-80:])}")
print(f"Home.tsx:571 idx: {m571}")
print(f"Home.tsx:577 idx: {m577}")
print(f"Home.tsx:676 idx: {m676}")
print(f"After intro first 80: {repr(after_intro80)}")
print(f"577 follows intro: {loc577 >= block_end and content[block_end:loc577].strip() != '' or loc577 == content.find('577', block_end)}")
# Better check: does 577 marker appear right after intro block?
between = content[block_end:loc577]
print(f"Between intro end and 577 loc ({len(between)} chars): {repr(between[:200])}")
print(f"577 card starts at: {card577_start}, ends at: {card577_end}")
print(f"577 immediately follows intro: {between.strip().startswith('m.') or 'Home.tsx:577' in between[:500]}")
