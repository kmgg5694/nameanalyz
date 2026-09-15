# -*- coding: utf-8 -*-
"""Apply US-accessibility English UI wording fixes in index-eTNXNndF.js + english/index.html."""
from pathlib import Path
import re

js_path = Path("assets/index-eTNXNndF.js")
html_path = Path("english/index.html")
t = js_path.read_text(encoding="utf-8")
orig = t
report = []

def rep(old, new, label=None):
    global t
    c = t.count(old)
    if c:
        t = t.replace(old, new)
        report.append(f"OK x{c}\t{label or old[:50]} → {new[:50]}")
    else:
        report.append(f"MISS\t{label or old[:70]}")

# 1. Month placeholder
rep('S?"월 (1-12)":"Mo (1-12)"', 'S?"월 (1-12)":"Month (1–12)"')

# 2. Phonetic Five Elements — drop hanja
rep(
    'S?"음령오행 (音靈五行) 분석":"Phonetic Five Elements (音靈五行)"',
    'S?"음령오행 (音靈五行) 분석":"Name Energy Elements"',
)
rep("Phonetic Five Elements (音靈五行)", "Name Energy Elements")
rep('S?"【음령오행 요약】":"【Phonetic Elements Summary】"', 'S?"【음령오행 요약】":"【Name Energy Summary】"')

# 3. Self-Centered title + related structure titles
rep(
    'S?"오행 3자 구조 해설 (나를 중심으로)":"Three-Element Structure Analysis (Self-Centered)"',
    'S?"오행 3자 구조 해설 (나를 중심으로)":"Name Flow (You in the Middle)"',
)
rep(
    'S?"오행 3자 구조 — 원활":"Three-Element Structure — Harmonious"',
    'S?"오행 3자 구조 — 원활":"Name Flow — Harmonious"',
)
# other Three-Element Structure — variants if any
for m in list(re.finditer(r'S\?"오행 3자 구조 — [^"]+":"Three-Element Structure — [^"]+"', t)):
    old = m.group(0)
    new = old.replace("Three-Element Structure — ", "Name Flow — ")
    if old != new:
        rep(old, new)

# Middle (self) line — keep English element name, avoid raw jargon
# pattern uses template literals; leave logic, only fix static English prefix if present
rep(
    "Middle (self) ${Ie[Y]} (${Y}) — energy shown outwardly",
    "You (middle) ${Ie[Y]} — energy you show outwardly",
)

# 4. KakaoTalk → generic share/copy
rep(
    'S?"요약 내용이 복사되었습니다. 카카오톡에 붙여넣기 하세요!":"Summary copied! Paste it in KakaoTalk."',
    'S?"요약 내용이 복사되었습니다. 카카오톡에 붙여넣기 하세요!":"Summary copied! You can paste it anywhere."',
)
rep(
    'S?"아래 주소를 복사해서 카카오톡에 붙여넣으세요:":"Copy this link and paste in KakaoTalk:"',
    'S?"아래 주소를 복사해서 카카오톡에 붙여넣으세요:":"Copy this link and paste it anywhere:"',
)
rep("Share KakaoTalk", "Share Link")
# longer kakao paste instructions in English branch
rep(
    "Open KakaoTalk → Send to Me → Paste (long press)",
    "Open Messages or any app → paste the link",
)
# button label if still Kakao
for old, new in [
    ('S?"카카오톡 공유":"Share KakaoTalk"', 'S?"카카오톡 공유":"Share Link"'),
    ('children:["💬 ",S?"카카오톡 공유":"Share KakaoTalk"]', 'children:["💬 ",S?"카카오톡 공유":"Share Link"]'),
]:
    if old in t:
        rep(old, new)

# 5. blue wealth hexagram
rep(
    'S?"이름 재물운: 청색 재물괘가 없습니다.":"Name wealth luck: no blue wealth hexagram."',
    'S?"이름 재물운: 청색 재물괘가 없습니다.":"Name wealth luck: no strong wealth signs."',
)
rep(
    'S?"사주 재물운: 청색 재물괘가 없습니다.":"Birth wealth luck: no blue wealth hexagram."',
    'S?"사주 재물운: 청색 재물괘가 없습니다.":"Birth wealth luck: no strong wealth signs."',
)
# dynamic blue wealth lines if any
rep("no blue wealth hexagram", "no strong wealth signs")
rep("blue wealth hexagram", "strong wealth sign")

# 6. Summary table labels
rep('S?"이름 - 수리":"Name · No."', 'S?"이름 - 수리":"Name Numbers"')
rep('S?"이름 - 주역":"Name · Hex."', 'S?"이름 - 주역":"Name Hexagrams"')
rep('S?"생년월일 - 수리":"Birth · No."', 'S?"생년월일 - 수리":"Birth Numbers"')
rep('S?"생년월일 - 주역":"Birth · Hex."', 'S?"생년월일 - 주역":"Birth Hexagrams"')
rep('S?"구분":"Type"', 'S?"구분":"Row"')

# 7. UI inauspicious → caution (summary lines + badge only, not long desc bodies via careful phrases)
rep(
    'S?"이름 수리: 흉수가 없습니다.":"Name numerology: no inauspicious numbers."',
    'S?"이름 수리: 흉수가 없습니다.":"Name numbers: no caution numbers."',
)
rep(
    'S?"이름 주역 흉: 흉괘가 없습니다.":"Name hexagrams: no inauspicious signs."',
    'S?"이름 주역 흉: 흉괘가 없습니다.":"Name hexagrams: no caution signs."',
)
rep(
    'S?"사주 수리: 흉수가 없습니다.":"Birth numerology: no inauspicious numbers."',
    'S?"사주 수리: 흉수가 없습니다.":"Birth numbers: no caution numbers."',
)
rep(
    'S?"사주 주역 흉: 흉괘가 없습니다.":"Birth hexagrams: no inauspicious signs."',
    'S?"사주 주역 흉: 흉괘가 없습니다.":"Birth hexagrams: no caution signs."',
)
rep('S?"⚠ 흉괘":"⚠ Inauspicious"', 'S?"⚠ 흉괘":"⚠ Caution"')
rep('S?"★ 재물괘":"★ Wealth Hexagram"', 'S?"★ 재물괘":"★ Wealth Sign"')

# Birth numerology caution line pattern
rep("Birth numerology caution:", "Birth numbers caution:")
rep("Name numerology caution:", "Name numbers caution:")

# 8. Generating / flow sentences
rep(
    'S?"성(위)과 이름(나)이 상생이라 윗사람 운이 열려 있습니다.":"Last→First is generating, so senior/spouse fortune is open."',
    'S?"성(위)과 이름(나)이 상생이라 윗사람 운이 열려 있습니다.":"Last name supports first name — help from elders or a partner is open."',
)
rep(
    'S?"이름(나)과 아래가 상생이라 아랫사람 운이 열려 있습니다.":"Self→end is generating, so junior/children fortune is open."',
    'S?"이름(나)과 아래가 상생이라 아랫사람 운이 열려 있습니다.":"First name supports the ending sound — help from juniors or children is open."',
)
rep(
    'S?"상생 2개 — 재물운을 키우고 지켜 나갈 수 있는 이름입니다.":"Two generating links — this name can grow and keep wealth."',
    'S?"상생 2개 — 재물운을 키우고 지켜 나갈 수 있는 이름입니다.":"Two supportive links — this name can grow and protect wealth."',
)

# More generating/control jargon if present
for old, new in [
    (
        'S?"성(위)과 이름(나)이 상극이라 윗사람 운이 막혀 있습니다.":"Last→First is controlling, so senior/spouse fortune is blocked."',
        'S?"성(위)과 이름(나)이 상극이라 윗사람 운이 막혀 있습니다.":"Last name clashes with first name — help from elders or a partner may be blocked."',
    ),
    (
        'S?"이름(나)과 아래가 상극이라 아랫사람 운이 막혀 있습니다.":"Self→end is controlling, so junior/children fortune is blocked."',
        'S?"이름(나)과 아래가 상극이라 아랫사람 운이 막혀 있습니다.":"First name clashes with the ending sound — help from juniors or children may be blocked."',
    ),
]:
    if old in t:
        rep(old, new)
    else:
        # fuzzy: find English controlling phrases
        pass

# fuzzy replace remaining short English jargon phrases
for old, new in [
    ("is generating, so senior/spouse fortune is open", "supports the next part — help from elders or a partner is open"),
    ("is generating, so junior/children fortune is open", "supports the ending — help from juniors or children is open"),
    ("is controlling, so senior/spouse fortune is blocked", "clashes with the next part — help from elders or a partner may be blocked"),
    ("is controlling, so junior/children fortune is blocked", "clashes with the ending — help from juniors or children may be blocked"),
    ("Two generating links", "Two supportive links"),
    ("Two controlling links", "Two clashing links"),
]:
    if old in t:
        rep(old, new, label=old)

# 9 handled in html title below only (keep Korean title string for ko toggle if present)
# document.title switches — patch English branch if present
rep(
    'S?"김만기주역이름풀이":"김만기주역이름풀이"',
    'S?"김만기주역이름풀이":"English Name Reading"',
)
# common pattern document.title = ...
if 'document.title=' in t or "document.title =" in t:
    pass
# Section denseness
rep(
    'S?"수리 81수 + 주역 64괘 풀이":"Numerology (81) + I Ching (64 Hexagrams)"',
    'S?"수리 81수 + 주역 64괘 풀이":"Name Numbers & Life Cards"',
)
rep(
    'S?"전체 오행 분포":"Five Elements Distribution"',
    'S?"전체 오행 분포":"Element Balance"',
)
rep(
    'S?"결론: 이름과 사주의 흉·재물 무게가 비슷합니다.":"Conclusion: the name and birth chart are of similar weight."',
    'S?"결론: 이름과 사주의 흉·재물 무게가 비슷합니다.":"Conclusion: the name and birth date readings carry similar weight."',
)
rep(
    'S?"이름의 기운이 사주를 돕지 못하고 오히려 방해합니다.":"The name\'s energy does not support the birth chart and instead hinders it."',
    'S?"이름의 기운이 사주를 돕지 못하고 오히려 방해합니다.":"The name\'s energy does not support the birth date reading and instead holds it back."',
)
# birth chart phrase leftovers in English UI
rep("birth chart", "birth date reading")

# Notice line
rep(
    'S?"알림: 밑줄 친 수리명·주역명을 누르면 전체 뜻을 볼 수 있습니다.":"Notice: Tap an underlined number name or hexagram to read the full meaning."',
    'S?"알림: 밑줄 친 수리명·주역명을 누르면 전체 뜻을 볼 수 있습니다.":"Tip: Tap an underlined number or card name to read the full meaning."',
)
# if Korean text differs
if "Notice: Tap an underlined number name or hexagram" in t:
    rep(
        "Notice: Tap an underlined number name or hexagram to read the full meaning.",
        "Tip: Tap an underlined number or card name to read the full meaning.",
    )

# Date of birth helper
rep(
    'S?"탄생일 (인생 단계 풀이용, 선택)":"Date of Birth (for life-stage reading, optional)"',
    'S?"탄생일 (인생 단계 풀이용, 선택)":"Date of Birth (optional — for life stages)"',
)

if t == orig:
    raise SystemExit("JS: no changes")

js_path.write_text(t, encoding="utf-8")

# 9. HTML title / og tags for English page
html = html_path.read_text(encoding="utf-8")
html2 = html
html2 = html2.replace("<title>김만기주역이름풀이</title>", "<title>English Name Reading</title>")
html2 = html2.replace('content="김만기주역이름풀이"', 'content="English Name Reading"')
if html2 != html:
    html_path.write_text(html2, encoding="utf-8")
    report.append("OK\thtml title/og → English Name Reading")
else:
    report.append("MISS\thtml title")

# leftover checks
left = []
for s in [
    "Mo (1-12)",
    "音靈五行",
    "Self-Centered",
    "KakaoTalk",
    "blue wealth",
    "Name · No.",
    "Name · Hex.",
    "⚠ Inauspicious",
    "Phonetic Five Elements",
]:
    if s in t:
        left.append(f"{s} x{t.count(s)}")

Path("_en_access_fix_report.txt").write_text(
    "\n".join(report) + "\n\nleftovers:\n" + "\n".join(left or ["(none)"]),
    encoding="utf-8",
)
print("done", "leftovers", left or ["(none)"])
