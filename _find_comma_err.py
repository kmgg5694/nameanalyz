import subprocess
from pathlib import Path

src = Path("assets/index-eTNXNndF.js").read_text(encoding="utf-8")

def check(s):
    p = Path("_tmp_check.js")
    p.write_text(s, encoding="utf-8")
    r = subprocess.run(["node", "--check", str(p)], capture_output=True, text=True)
    return r.returncode == 0, (r.stderr or r.stdout)[:500]

ok, err = check(src)
print("full ok", ok, err)

# binary search by char position on line 87 area - find error pos from message
if not ok and "Unexpected token" in err:
    # try good prefix + current suffix at sumTable insertion point
    good = Path("_good_en.js").read_text(encoding="utf-8")
    mark = 'return E.jsxs("div",{"data-loc":"client/src/pages/EnglishName.tsx:sumTable"'
    g_end = good.find(mark)
    c_end = src.find(mark)
    print("good mark", g_end, "cur mark", c_end)
    if g_end > 0 and c_end > 0:
        # find IIFE start in both
        start_key = "(()=>{const strip="
        gs = good.rfind(start_key, 0, g_end)
        cs = src.rfind(start_key, 0, c_end)
        print("iife start good", gs, "cur", cs)
        # test: good up to start + current from start
        hybrid = good[:gs] + src[cs:]
        ok2, err2 = check(hybrid)
        print("hybrid ok", ok2, err2[:300] if err2 else "")
