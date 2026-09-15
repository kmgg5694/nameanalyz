from pathlib import Path

good = Path("_good_en.js").read_text(encoding="utf-8")
cur = Path("assets/index-eTNXNndF.js").read_text(encoding="utf-8")

anchor = 'E.jsxs("div",{"data-loc":"client/src/pages/EnglishName.tsx:781"'
g = good.find(anchor)
c = cur.find(anchor)
print("anchor good", g, "cur", c)

# what precedes 781 in good (last 200 chars)
print("good before 781:", repr(good[g-200:g]))
print("cur before 781:", repr(cur[c-200:c]))

# sumTable block end marker
end_mark = "})()]})," + anchor
ce = cur.find(end_mark)
print("cur end_mark", ce)
if ce >= 0:
    block_start = cur.rfind("(()=>{const strip=", 0, ce)
    print("block_start", block_start, "block len", ce + len("})()]}),") - block_start)
    block = cur[block_start:ce + len("})()]}),")]
    print("block ends with", repr(block[-80:]))
    print("block has newline before return", "\nreturn E.jsxs" in block or "\r\nreturn E.jsxs" in block)
