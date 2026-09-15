# -*- coding: utf-8 -*-
from pathlib import Path
import sys
sys.stdout.reconfigure(encoding="utf-8", errors="replace")

def move_en():
    p = Path(r"C:\Users\a8071\Projects\nameanalyz\assets\index-eTNXNndF.js")
    t = p.read_text(encoding="utf-8")
    if "EnglishName.tsx:1042m" in t:
        print("EN already moved")
        return

    h3 = 'E.jsxs("h3",{"data-loc":"client/src/pages/EnglishName.tsx:1043"'
    a = t.find(h3)
    b = t.find('E.jsxs("div",{"data-loc":"client/src/pages/EnglishName.tsx:1175"')
    if a < 0 or b < 0 or b <= a:
        raise SystemExit("EN bounds %s %s" % (a, b))
    # include trailing comma after IIFE
    block = t[a:b]
    if not block.endswith("),") and not block.rstrip().endswith("),"):
        # expect `})(),`
        if not block.endswith("(),"):
            print("EN block tail", repr(block[-20:]))
    # strip trailing comma for wrapping
    inner = block[:-1] if block.endswith(",") else block

    dest = 'E.jsxs("div",{"data-loc":"client/src/pages/EnglishName.tsx:781"'
    d = t.find(dest)
    if d < 0:
        raise SystemExit("EN dest 781 missing")
    if d > a:
        # dest is before summary in file? 781 is earlier (547421) vs 1043 (568710) so d < a
        pass
    if d > a:
        raise SystemExit("EN dest after source unexpectedly")

    wrap = (
        'E.jsxs("div",{"data-loc":"client/src/pages/EnglishName.tsx:1042m",'
        'style:{backgroundColor:"#ffffff",borderRadius:"0.75rem",padding:"1.25rem",'
        'marginBottom:"1.5rem",border:"2px solid #7c3aed",boxShadow:"0 2px 8px rgba(124,58,237,0.08)"},'
        "children:[" + inner + "]}),"
    )
    # insert first (earlier index), then remove old (index shifts)
    t = t[:d] + wrap + t[d:]
    a2 = t.find(h3, d + len(wrap))  # old h3 after insert
    b2 = t.find('E.jsxs("div",{"data-loc":"client/src/pages/EnglishName.tsx:1175"', a2)
    if a2 < 0 or b2 < 0:
        raise SystemExit("EN old block lost")
    t = t[:a2] + t[b2:]
    p.write_text(t, encoding="utf-8")
    print("EN moved", "1042m", t.count("EnglishName.tsx:1042m"), "1043", t.count("EnglishName.tsx:1043"))


def move_ko():
    p = Path(r"C:\Users\a8071\Projects\nameanalyz\assets\index-kw5.js")
    t = p.read_text(encoding="utf-8")
    if t.count('(()=>{const ho=vo=>vo==="taboo"') != 1:
        raise SystemExit("KO iife count %s" % t.count('(()=>{const ho=vo=>vo==="taboo"'))
    if "Home.tsx:1112m" in t:
        print("KO already moved")
        return

    start = '(()=>{const ho=vo=>vo==="taboo"'
    a = t.find(start)
    end_mark = 'm.jsxs("div",{"data-loc":"client/src/pages/Home.tsx:1201"'
    b = t.find(end_mark, a)
    if a < 0 or b < 0:
        raise SystemExit("KO bounds %s %s" % (a, b))
    block = t[a:b]  # includes trailing `})(),`
    if "Home.tsx:1112" not in block:
        raise SystemExit("KO block missing 1112")
    dest = 'm.jsxs("div",{"data-loc":"client/src/pages/Home.tsx:978"'
    d = t.find(dest)
    if d < 0 or d > a:
        raise SystemExit("KO dest 978 %s vs %s" % (d, a))

    t = t[:d] + block + t[d:]
    a2 = t.find(start, d + len(block))
    b2 = t.find(end_mark, a2)
    if a2 < 0 or b2 < 0:
        raise SystemExit("KO old iife lost")
    t = t[:a2] + t[b2:]
    p.write_text(t, encoding="utf-8")
    print("KO moved", "1112", t.count("Home.tsx:1112"), "978 after 1112", t.find("Home.tsx:978") > t.find("Home.tsx:1112"))


move_en()
move_ko()
print("done")
