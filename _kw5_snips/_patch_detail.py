# -*- coding: utf-8 -*-
"""CSV 뜻풀이(원문)를 index-kw5.js 한자 객체에 detail 필드로 삽입."""
import csv
import json
from pathlib import Path

CSV_PATH = Path(r"C:\Users\a8071\Projects\nameanalyz\data\hanja_dictionary_final_10622.csv")
JS_PATH = Path(r"C:\Users\a8071\Projects\nameanalyz\assets\index-kw5.js")


def parse_js_string(s, quote_i):
    if s[quote_i] != '"':
        raise ValueError("expected quote")
    i = quote_i + 1
    chars = []
    while i < len(s):
        c = s[i]
        if c == "\\":
            chars.append(s[i : i + 2])
            i += 2
            continue
        if c == '"':
            return "".join(chars), i + 1
        chars.append(c)
        i += 1
    raise ValueError("unterminated string")


def unescape_js(raw):
    return json.loads('"' + raw.replace("\n", "\\n") + '"') if False else bytes(raw, "utf-8").decode("unicode_escape") if False else json.loads('"' + raw.replace("\\", "\\\\").replace('"', '\\"') + '"')


def unescape_simple(raw):
    # raw is JS string body with backslash escapes
    return json.loads('"' + raw.replace("\r", "\\r") + '"') if False else None


def js_unescape(raw):
    return json.loads('"' + raw + '"')


def js_dump(s):
    t = json.dumps(s, ensure_ascii=False)
    return t.replace("\u2028", "\\u2028").replace("\u2029", "\\u2029")


def main():
    details = []
    with CSV_PATH.open(encoding="utf-8-sig", newline="") as f:
        for row in csv.DictReader(f):
            details.append(
                (
                    row["한자"],
                    row["대표훈음"],
                    (row.get("뜻풀이(원문)") or "").strip(),
                )
            )

    raw = JS_PATH.read_bytes()
    kw = raw.decode("utf-8")
    if 'meaning:"착할 개",detail:' in kw:
        raise SystemExit("already has detail?")

    parts = []
    last = 0
    pos = 0
    idx = 0
    mismatch = 0
    added = 0
    skipped = 0

    while True:
        m = kw.find('{char:"', pos)
        if m < 0:
            break
        if idx >= len(details):
            raise SystemExit(f"more JS objects than CSV at idx {idx}")
        char_q = m + len("{char:")
        char_raw, after_char = parse_js_string(kw, char_q)
        ch = json.loads('"' + char_raw + '"')

        mi = kw.find(',meaning:"', m)
        if mi < 0 or mi > after_char + 400:
            raise SystemExit(f"meaning not found near {m}")
        mean_q = mi + len(",meaning:")
        mean_raw, after_mean = parse_js_string(kw, mean_q)
        if not kw.startswith(",readings:", after_mean):
            raise SystemExit(f"expected ,readings: at {after_mean}: {kw[after_mean:after_mean+20]!r}")

        csv_ch, csv_mean, csv_det = details[idx]
        if ch != csv_ch:
            mismatch += 1
            if mismatch <= 8:
                print("CHAR MISMATCH", idx, repr(ch), repr(csv_ch))

        if csv_det:
            insert = ",detail:" + js_dump(csv_det)
            parts.append(kw[last:after_mean])
            parts.append(insert)
            last = after_mean
            added += 1
        else:
            skipped += 1

        idx += 1
        pos = after_mean

    if idx != len(details):
        raise SystemExit(f"count JS={idx} CSV={len(details)}")

    parts.append(kw[last:])
    out = "".join(parts)
    JS_PATH.write_bytes(out.encode("utf-8"))
    print("objects", idx, "added", added, "skipped empty", skipped, "char mismatch", mismatch)
    print("bytes", len(kw), "->", len(out))


if __name__ == "__main__":
    main()
