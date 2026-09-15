from pathlib import Path
import subprocess

good = Path("_good_en.js").read_text(encoding="utf-8")
cur = Path("assets/index-eTNXNndF.js").read_text(encoding="utf-8")

mark = 'return E.jsxs("div",{"data-loc":"client/src/pages/EnglishName.tsx:sumTable"'
end = '})()]}),E.jsxs("div",{"data-loc":"client/src/pages/EnglishName.tsx:781"'

def extract(t):
    e = t.find(mark)
    s = t.rfind("(()=>{const strip=", 0, e)
    f = t.find(end, e)
    return t[s:f+len("})()]}),")]

gb = extract(good)
cb = extract(cur)
print("good block len", len(gb), "cur block len", len(cb))
print("blocks equal", gb == cb)

# validate each block wrapped
wrap = "function test(){return " + cb.replace("(()=>{", "(()=>{").rstrip("}),") + "})()}"
# simpler: replace good block with cur block in good file
hybrid = good.replace(gb, cb, 1)
Path("_hybrid.js").write_text(hybrid, encoding="utf-8")
r = subprocess.run(["node", "--check", "_hybrid.js"], capture_output=True, text=True)
print("good+cur_block ok", r.returncode==0, (r.stderr or "")[:400])

hybrid2 = good.replace(gb, gb, 1)  # noop
r2 = subprocess.run(["node", "--check", "_good_en.js"], capture_output=True, text=True)
print("good alone ok", r2.returncode==0)

# find first char diff in blocks
for i,(a,b) in enumerate(zip(gb,cb)):
    if a!=b:
        print("block diff at", i, repr(gb[max(0,i-40):i+60]))
        print("cur:", repr(cb[max(0,i-40):i+60]))
        break
else:
    if len(gb)!=len(cb):
        print("len diff", len(gb), len(cb), "suffix", repr(cb[len(gb):len(gb)+100]))
