# -*- coding: utf-8 -*-
from pathlib import Path
import sys
sys.stdout.reconfigure(encoding="utf-8", errors="replace")

def match_jsxs(t, start):
    """start at E.jsxs( or E.jsx( — find end index after matching paren."""
    i = start
    # find first (
    i = t.find("(", i)
    depth = 0
    j = i
    while j < len(t):
        ch = t[j]
        if ch in "\"'`":
            q = ch
            j += 1
            while j < len(t):
                if t[j] == "\\":
                    j += 2
                    continue
                if t[j] == q:
                    j += 1
                    break
                j += 1
            continue
        if ch == "(":
            depth += 1
        elif ch == ")":
            depth -= 1
            if depth == 0:
                return j + 1
        j += 1
    return -1

en = Path(r"C:\Users\a8071\Projects\nameanalyz\assets\index-eTNXNndF.js").read_text(encoding="utf-8")
ko = Path(r"C:\Users\a8071\Projects\nameanalyz\assets\index-kw5.js").read_text(encoding="utf-8")

a = en.find('E.jsxs("div",{"data-loc":"client/src/pages/EnglishName.tsx:1042"')
end = match_jsxs(en, a)
print("EN 1042 end", end, "len", end-a)
print("after 1042:", en[end:end+80])
print("end tail:", en[end-40:end])

# Korean 1112
b = ko.find('m.jsxs("div",{"data-loc":"client/src/pages/Home.tsx:1112"')
end2 = match_jsxs(ko, b)
print("\nKO 1112 end", end2, "len", end2-b)
print("after 1112:", ko[end2:end2+80])
print("end tail:", ko[end2-40:end2])

# Korean IIFE
c = ko.find("(()=>{const ho=vo=>vo===\"taboo\"")
# IIFE is (()=>{...})()
# find matching from first (
end3 = match_jsxs(ko, c)
print("\nKO IIFE paren end", end3, ko[end3:end3+20])
# invoke ()
if ko[end3:end3+2] == "()":
    print("has invoke")
    end3 += 2
print("after IIFE:", ko[end3:end3+60])
