from pathlib import Path
t = Path(r"C:\Users\a8071\Projects\nameanalyz\assets\index-kw5.js").read_text(encoding="utf-8")
out = Path(r"C:\Users\a8071\Projects\nameanalyz\_kw5_snips")
s = 1987947
end = 1990282
# include a bit before and the 850 start
(out/"b6_block_to_cut.txt").write_text(t[s-120:end+90], encoding="utf-8")

# also 1038 full jsxs
s2 = t.find('m.jsxs("div",{"data-loc":"client/src/pages/EnglishName.tsx:1038"')
# walk to matching close of this m.jsxs(
def walk_call(src, start):
    # start at 'm.jsxs('
    i = start
    assert src[i:i+7] in ("m.jsxs(", "m.jsx(") or src.startswith("m.jsxs", i) or True
    # find first '('
    p = src.find("(", i)
    depth = 0
    in_str = None
    esc = False
    for k, ch in enumerate(src[p:], p):
        if in_str:
            if esc:
                esc = False
            elif ch == "\\":
                esc = True
            elif ch == in_str:
                in_str = None
            continue
        if ch in ("'", '"', "`"):
            in_str = ch
            continue
        if ch == "(":
            depth += 1
        elif ch == ")":
            depth -= 1
            if depth == 0:
                return k+1
    return -1

end2 = walk_call(t, s2)
(out/"star_full.txt").write_text(t[s2-30:end2+20], encoding="utf-8")
print("star", s2, end2, "len", end2-s2)
print("cut block len", end-s)
