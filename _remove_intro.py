# -*- coding: utf-8 -*-
"""Remove intro video blocks from nameanalyz / lucky-8 / app_iljin."""
from pathlib import Path
import re
import subprocess
import sys

sys.stdout.reconfigure(encoding="utf-8")


def remove_balanced_jsx_call(src: str, start: int) -> tuple[str, int]:
    """Remove one m.jsx/m.jsxs(...) starting at `start` (index of 'm.jsx' or 'm.jsxs')."""
    # find opening paren after m.jsx / m.jsxs
    paren = src.find("(", start)
    if paren < 0:
        raise ValueError("no (")
    depth = 0
    i = paren
    in_str = None
    esc = False
    while i < len(src):
        ch = src[i]
        if in_str:
            if esc:
                esc = False
            elif ch == "\\":
                esc = True
            elif ch == in_str:
                in_str = None
        else:
            if ch in ("'", '"', "`"):
                in_str = ch
            elif ch == "(":
                depth += 1
            elif ch == ")":
                depth -= 1
                if depth == 0:
                    end = i + 1
                    # trailing comma if present
                    if end < len(src) and src[end] == ",":
                        end += 1
                    return src[:start] + src[end:], start
        i += 1
    raise ValueError("unbalanced")


def strip_intro_from_bundle(path: Path) -> None:
    src = path.read_text(encoding="utf-8")
    marker = 'className:"intro-sec"'
    idx = src.find(marker)
    if idx < 0:
        print(path.name, "no intro-sec")
        return
    start = -1
    for tag in ("m.jsxs(", "m.jsx(", "E.jsxs(", "E.jsx("):
        j = src.rfind(tag, max(0, idx - 250), idx)
        if j > start:
            start = j
    if start < 0:
        raise SystemExit(f"{path}: cannot find jsx start")
    had_comma = start > 0 and src[start - 1] == ","
    body, _ = remove_balanced_jsx_call(src, start)
    # leading comma remains before the hole
    if had_comma and body[start - 1 : start] == ",":
        body = body[: start - 1] + body[start:]
    # trailing comma after hole: ],  next  or  ,, 
    body = body.replace(",,", ",")
    body = body.replace(",]", "]")
    path.write_text(body, encoding="utf-8")
    print(path.name, "removed intro-sec; left=", body.find(marker))


def strip_style_block(html: str) -> str:
    # remove .intro-* CSS rules roughly from first .intro-sec to before next non-intro rule
    # simpler: delete lines/blocks containing intro-
    html = re.sub(r"\n\s*/\*[^*]*\*/\s*\n", "\n", html)
    # remove contiguous CSS that mentions intro-
    # For nameanalyz index: from .intro-sec{ ... through @media intro rules
    html = re.sub(
        r"\s*\.intro-sec\{[\s\S]*?@keyframes introCapScroll\{[\s\S]*?\}\s*"
        r"(?:@media \(max-width:640px\)\{\s*(?:\.intro-[^}]+\{[^}]*\}\s*)+\}\s*)?",
        "\n",
        html,
        count=1,
    )
    # lucky/app may not have keyframes in same form — second pass
    html = re.sub(
        r"\s*\.intro-sec\{[\s\S]*?@keyframes introCapScroll\{[\s\S]*?\}\s*"
        r"(?:@media[^{]+\{[\s\S]*?\.intro-media-btn svg\{[^}]*\}\s*\}\s*)?",
        "\n",
        html,
        count=1,
    )
    return html


def strip_html_intro_section(html: str) -> str:
    html = re.sub(
        r'\s*<div class="intro-sec">[\s\S]*?</div>\s*(?=<div class="guide">)',
        "\n\n",
        html,
        count=1,
    )
    return html


def strip_playintro_script_ko(html: str) -> str:
    # Remove the <script> that defines bindIntroUnmute / playIntro / startIntroOnOpen
    html = re.sub(
        r"\s*<script>\s*function bindIntroUnmute[\s\S]*?startIntroOnOpen\(\)[\s\S]*?</script>",
        "\n",
        html,
        count=1,
    )
    return html


def strip_playintro_script_en(html: str) -> str:
    # Keep liftInputsAboveKeyboard; remove only intro parts
    # Remove bindIntroUnmute function through startIntroOnOpen IIFE, but keep liftInputs
    html = re.sub(
        r"\s*function bindIntroUnmute\(wrap, v\) \{[\s\S]*?"
        r"\(function startIntroOnOpen\(\) \{[\s\S]*?\}\)\(\);\s*",
        "\n",
        html,
        count=1,
    )
    return html


def strip_fortune_playintro(html: str) -> str:
    # remove playIntro function and related autoplay if present
    html = re.sub(
        r"\s*function playIntro\([\s\S]*?\n\}\n",
        "\n",
        html,
        count=1,
    )
    html = re.sub(
        r"\s*function bindIntroUnmute\([\s\S]*?\n\}\n",
        "\n",
        html,
        count=1,
    )
    # remove auto-start calls
    html = re.sub(r"\s*playIntro\([^)]*\);\s*", "\n", html)
    return html


# --- nameanalyz bundles ---
strip_intro_from_bundle(Path(r"C:\Users\a8071\Projects\nameanalyz\assets\index-kw5.js"))
strip_intro_from_bundle(Path(r"C:\Users\a8071\Projects\nameanalyz\assets\index-eTNXNndF.js"))

# syntax check
for p in [
    Path(r"C:\Users\a8071\Projects\nameanalyz\assets\index-kw5.js"),
    Path(r"C:\Users\a8071\Projects\nameanalyz\assets\index-eTNXNndF.js"),
]:
    r = subprocess.run(["node", "--check", str(p)], capture_output=True)
    print("syntax", p.name, r.returncode)

# --- HTML wrappers ---
ko = Path(r"C:\Users\a8071\Projects\nameanalyz\index.html")
t = ko.read_text(encoding="utf-8")
t2 = strip_style_block(t)
t2 = strip_playintro_script_ko(t2)
ko.write_text(t2, encoding="utf-8")
print("ko html intro css/script", "intro-sec css" in t2, "bindIntroUnmute" in t2)

en = Path(r"C:\Users\a8071\Projects\nameanalyz\english\index.html")
t = en.read_text(encoding="utf-8")
t2 = strip_style_block(t)
t2 = strip_playintro_script_en(t2)
en.write_text(t2, encoding="utf-8")
print("en html", "bindIntroUnmute" in t2, "liftInputsAboveKeyboard" in t2)

for site in [
    Path(r"C:\Users\a8071\Projects\lucky-8\index.html"),
    Path(r"C:\Users\a8071\Projects\app_iljin\index.html"),
]:
    t = site.read_text(encoding="utf-8")
    t2 = strip_html_intro_section(t)
    t2 = strip_style_block(t2)
    t2 = strip_fortune_playintro(t2)
    # leftover intro CSS lines
    t2 = re.sub(r"\n\.intro-[^\n]*\n", "\n", t2)
    t2 = re.sub(r"\n  \.intro-[^\n]*\n", "\n", t2)
    site.write_text(t2, encoding="utf-8")
    print(site.parent.name, "intro-sec html", '<div class="intro-sec">' in t2, "playIntro" in t2)
