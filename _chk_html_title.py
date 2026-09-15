# -*- coding: utf-8 -*-
import subprocess
from pathlib import Path

def check(rev):
    data = subprocess.check_output(["git", "show", f"{rev}:index.html"])
    # find title
    i = data.find(b"<title>")
    j = data.find(b"</title>")
    print(rev, "title close", j, "snip", data[i:i+80])
    print("  has proper close", b"</title>" in data)
    print("  broken ??/title", b"?/title>" in data or b"\xbf/title>" in data)

for rev in ["fc83d42", "72d7265", "5c836b6", "f2fe029", "cb3ba68", "70129d9", "HEAD"]:
    try:
        check(rev)
    except Exception as e:
        print(rev, e)

# current file
cur = Path("index.html").read_bytes()
print("WORKTREE", "close", cur.find(b"</title>"), cur[cur.find(b"<title>"):cur.find(b"<title>")+90])
