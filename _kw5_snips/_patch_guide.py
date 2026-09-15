# -*- coding: utf-8 -*-
from pathlib import Path

js = Path(r"C:\Users\a8071\Projects\nameanalyz\assets\index-kw5.js")
html = Path(r"C:\Users\a8071\Projects\nameanalyz\index.html")

old = (
    'm.jsx("p",{"data-loc":"client/src/pages/Home.tsx:573",'
    'className:"text-sm text-muted-foreground",'
    'children:"한글 이름을 입력하고 한자 오행을 선택하면 완전한 분석이 가능합니다."})'
)

guide = (
    "아래에 이름을 풀어 보면 처음엔 잘 나갔는데 갈수록 기우는게 무슨 이유 인지를 알게 됩니다. "
    "현재 내가 왜 이런 침체기를 맞이 하는가? 반대로 젊어서는 별로 였는데 갈수록 상승하는 모습이 적나라 하게 보입니다. "
    "수리 보다는 주역괘의 기운이 강하고 그가 가지고 있는 기운대로 인생을 살아가게 됩니다.\n\n"
    "오행의 조화, 수리, 주역괘로 인해 평생 결혼을 못하는 원인도 알 수가 있고, "
    "암이나 수술, 교통사고, 낙상사고, 시험운, 승진운, 공부운, 결혼운, 유산 상속운, 재물운도 그 속에 전부 담겨 있으니 "
    "꼼꼼히 살펴보고 나의 현실과 비교하시길 바랍니다. "
    "큰 재물운도 그 크기에 따라 대기업 회장, 국가원수 등의 일을 경영 할 수 가 있답니다.\n\n"
    "단! 개명 하신 분은 이걸 풀어도 맞지가 않으니 예전 이름으로 풀어보고 지금까지 살아 온 길과 대조 해 보시길 바랍니다.\n\n"
    "주역을 모르는 작명가들은 한글이름만 듣고도 가난한지, 부자인지, 성격이 어떤지 전혀 모르시는 분들입니다. "
    "한문이름 두자 지어 놓고 81수리 4개만 붙여서는 절대로 알 수가 없답니다. "
    "왜 그러냐면 수리는 내가 몸으로 때우면 되지만 주역괘는 꼭 생채기를 남기니까 그걸 모르면 인생의 변곡점을 꼭 집어 낼 수가 없답니다. "
    "한글, 한문 이름 두개를 수리와 주역괘를 붙여서 종합적으로 판단하게 됩니다.\n\n"
    "더 정확히 알고 싶으면 주역사주를 이름에 대입해서 시기별 변곡점을 꼭 집어내는데 "
    "이건 나중에 상세상담 신청하시면 알려 드릴께요."
)

escaped = guide.replace("\\", "\\\\").replace('"', '\\"').replace("\n", "\\n")

new = (
    'm.jsx("p",{"data-loc":"client/src/pages/Home.tsx:573",'
    'className:"guide-note",'
    f'children:"{escaped}"}})'
)

s = js.read_text(encoding="utf-8")
n = s.count(old)
if n != 1:
    raise SystemExit(f"old guide count={n}, expected 1")
js.write_text(s.replace(old, new, 1), encoding="utf-8")

css_old = "      .intro-sec{padding:14px 12px;background:oklch(0.97 0.006 82);border:1px solid oklch(0.76 0.022 72);border-radius:12px;text-align:center;}\n"
css_new = css_old + (
    "      .guide-note{text-align:left;font-size:13px;line-height:1.75;font-weight:400;"
    "color:oklch(0.32 0.04 68);background:oklch(0.985 0.006 82);"
    "border:1px solid oklch(0.82 0.02 72);border-radius:10px;padding:12px 14px;"
    "white-space:pre-wrap;}\n"
)
h = html.read_text(encoding="utf-8")
if ".guide-note{" in h:
    print("css already present")
elif css_old not in h:
    raise SystemExit("intro-sec css not found")
else:
    html.write_text(h.replace(css_old, css_new, 1), encoding="utf-8")

print("ok", len(guide))
