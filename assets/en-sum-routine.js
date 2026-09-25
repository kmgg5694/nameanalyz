/**
 * English overall reading — brief narrate then Warning/Footnotes.
 * Order: 오행 → 이름표 자세히 → 탄생일 → 이름↔사주 → 마무리 → 경고장·각주
 * Suri/hex names: always Korean 원어 (table·narrate·warning match). Sentences follow lang.
 * Warning/footnotes: ko=Korean text, en=English text with Korean names + notranslate. Ages: [early,prime,mid,late]
 */
(function () {
  "use strict";

  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }
  function paintBlue(s) {
    return '<span style="color:#0000FF;font-weight:700">' + esc(s) + "</span>";
  }
  function paintRed(s) {
    return '<span style="color:#FF0000;font-weight:700">' + esc(s) + "</span>";
  }
  function strip(name) {
    return String(name || "")
      .replace(/\s*\([^)]*\)\s*/g, "")
      .trim();
  }

  function suriBad(d) {
    return !!d && (d.type === "taboo" || d.type === "caution" || d.type === "bad");
  }
  function suriGood(d) {
    return !!d && (d.type === "best" || d.type === "good");
  }
  function gweBad(g) {
    return !!(g && g.isTaboo);
  }
  function gweGood(g) {
    return !!(g && g.isBest);
  }
  function gweNameOf(g) {
    return strip(g && g.name);
  }
  /** 경고장·각주·매칭용 — 항상 원어(한글). */
  function gweNameKo(g) {
    if (!g || !g.name) return "";
    return strip(g.name);
  }
  /** 해설 표시명 — 영어 UI에서도 원어(한글). 요약보기 칸과 같은 이름. */
  function plainSuriName(ns, lang) {
    if (!ns || !ns.data) return "";
    const ko = strip(ns.data.name || "");
    return lang === "en" ? window.naEnSuri(ns.suri, ko) : ko;
  }
  function gweDisplayName(g, lang) {
    if (!g || !g.name) return "";
    return lang === "en" ? window.naEnHex(g.name) : strip(g.name);
  }
  function hexNameStarts(g, name) {
    if (!g || !g.name || !name) return false;
    const n = gweNameOf(g);
    return n === name || n.indexOf(name) === 0;
  }

  const HEX_MITIGATE = [
    "이위화",
    "화풍정",
    "화천대유",
    "화수미제",
    "산천대축",
    "수풍정",
    "뇌천대장",
  ];
  function isMitigate(g) {
    if (!g || !g.name) return false;
    for (let i = 0; i < HEX_MITIGATE.length; i++) {
      if (hexNameStarts(g, HEX_MITIGATE[i])) return true;
    }
    return false;
  }

  function suriPhrase(ns, lang) {
    if (!ns || ns.suri == null || !ns.data) return "";
    const nm = plainSuriName(ns, lang);
    const head = nm ? ns.suri + ", " + nm : String(ns.suri);
    if (suriBad(ns.data)) return paintRed(head);
    if (suriGood(ns.data)) return paintBlue(head);
    return "<strong>" + esc(head) + "</strong>";
  }
  function gweNameHtml(g, lang) {
    if (!g || !g.name) return "";
    const nm = gweDisplayName(g, lang);
    if (gweBad(g)) return paintRed(nm);
    if (gweGood(g)) return paintBlue(nm);
    return "<strong>" + esc(nm) + "</strong>";
  }
  function suriLabel(n, name) {
    return n + " " + name;
  }
  function joinMarks(arr) {
    return (arr || []).join(", ");
  }
  /** 받침 있으면 a(이·은), 없으면 b(가·는) */
  function josa(word, a, b) {
    const w = String(word || "");
    const c = w.charCodeAt(w.length - 1);
    if (c >= 0xac00 && c <= 0xd7a3) return (c - 0xac00) % 28 ? a : b;
    return b;
  }

  const AGE_EN = {
    early: "Ages 1–23",
    prime: "Ages 24–40",
    mid: "Ages 41–55",
    late: "Ages 56+ (whole life)",
  };
  const AGE_KO = {
    early: "초년(1~23세)",
    prime: "장년(24~40세)",
    mid: "중년(41~55세)",
    late: "말년·총운(56세~)",
  };
  function ageOf(key, lang) {
    return (lang === "ko" ? AGE_KO : AGE_EN)[key];
  }
  const I = { early: 0, prime: 1, mid: 2, late: 3 };
  const AGE_KEYS = ["early", "prime", "mid", "late"];

  const OH_EN = { 木: "Wood", 火: "Fire", 土: "Earth", 金: "Metal", 水: "Water" };
  const GEN = { 木: "火", 火: "土", 土: "金", 金: "水", 水: "木" };
  const KEUK = { 木: "土", 火: "金", 土: "水", 金: "木", 水: "火" };
  const MID_TRAIT = {
    木: "growth and drive",
    火: "bright and quick (sometimes impatient)",
    土: "steady and trustworthy",
    金: "firm and direct",
    水: "flexible and clear-headed",
  };
  const OH_KO = { 木: "목", 火: "화", 土: "토", 金: "금", 水: "수" };
  const MID_TRAIT_KO = {
    木: "성장과 추진력의 기운입니다",
    火: "밝고 빠르며 때로 성급한 기운입니다",
    土: "안정되고 믿음직한 기운입니다",
    金: "단단하고 곧은 기운입니다",
    水: "유연하고 지혜로운 기운입니다",
  };

  function elName(el, lang) {
    if (lang === "ko") return OH_KO[el] ? OH_KO[el] + "(" + el + ")" : String(el || "");
    return OH_EN[el] ? OH_EN[el] + " (" + el + ")" : String(el || "");
  }
  /** 오행 지칭: 목으로 · 화로 · 토로 · 금으로 · 수로 */
  function elRo(el) {
    const k = OH_KO[el];
    if (!k) return String(el || "");
    return k + (k === "화" || k === "토" || k === "수" ? "로" : "으로") + "(" + el + ")";
  }
  function dirUp(up, me) {
    if (!up || !me) return "";
    if (up === me) return "same";
    if (GEN[up] === me) return "recv_gen";
    if (GEN[me] === up) return "give_gen";
    if (KEUK[up] === me) return "recv_ctrl";
    if (KEUK[me] === up) return "give_ctrl";
    return "";
  }
  function dirDn(me, dn) {
    if (!me || !dn) return "";
    if (me === dn) return "same";
    if (GEN[me] === dn) return "give_gen";
    if (GEN[dn] === me) return "recv_gen";
    if (KEUK[me] === dn) return "give_ctrl";
    if (KEUK[dn] === me) return "recv_ctrl";
    return "";
  }

  /** 오행표: 위 <-생/극-> 나 <-생/극-> 아래 (가로) + 방향별 서술. 오행해설 표준 1–13 */
  function ohBox(role, el, sub, lang) {
    const col = { 木: "#166534", 火: "#991b1b", 土: "#92400e", 金: "#374151", 水: "#1e3a8a" }[el] || "#111";
    return (
      '<div style="flex:1;min-width:0;text-align:center;border:2px solid ' +
      col +
      ';border-radius:8px;padding:6px 4px;background:#fff">' +
      '<div style="font-size:0.75rem;color:#555">' +
      esc(role) +
      "</div>" +
      '<div style="font-size:1rem;font-weight:800;line-height:1.25;white-space:nowrap;color:' +
      col +
      '">' +
      esc((lang === "ko" ? OH_KO[el] : OH_EN[el]) || el || "") +
      "<br>(" +
      esc(el || "") +
      ")</div>" +
      (sub ? '<div style="font-size:0.7rem;line-height:1.2;color:#777;word-break:keep-all">' + esc(sub) + "</div>" : "") +
      "</div>"
    );
  }
  /** kind: gen|ctrl|same, toRight: 화살표가 오른쪽(→)을 향하는지 */
  function ohArrow(kind, toRight, lang) {
    const ko = lang === "ko";
    let label, col;
    if (kind === "gen") {
      label = ko ? "생" : "Gen.";
      col = "#0000FF";
    } else if (kind === "ctrl") {
      label = ko ? "극" : "Ctrl.";
      col = "#FF0000";
    } else {
      label = ko ? "비화" : "Same";
      col = "#555";
    }
    const arrow = kind === "same" ? "═══" : toRight ? "──▶" : "◀──";
    return (
      '<div style="flex:0 0 auto;padding:0 2px;text-align:center;font-weight:800;line-height:1.1;white-space:nowrap;color:' +
      col +
      '"><div style="font-size:0.85rem">' +
      esc(label) +
      '</div><div style="font-size:1rem">' +
      esc(arrow) +
      "</div></div>"
    );
  }
  function relUp(up, me) {
    const d = dirUp(up, me);
    if (d === "recv_gen") return { kind: "gen", toRight: true, d };
    if (d === "give_gen") return { kind: "gen", toRight: false, d };
    if (d === "recv_ctrl") return { kind: "ctrl", toRight: true, d };
    if (d === "give_ctrl") return { kind: "ctrl", toRight: false, d };
    return { kind: "same", toRight: true, d };
  }
  function relDn(me, dn) {
    const d = dirDn(me, dn);
    if (d === "give_gen") return { kind: "gen", toRight: true, d };
    if (d === "recv_gen") return { kind: "gen", toRight: false, d };
    if (d === "give_ctrl") return { kind: "ctrl", toRight: true, d };
    if (d === "recv_ctrl") return { kind: "ctrl", toRight: false, d };
    return { kind: "same", toRight: true, d };
  }
  const UP_TXT = {
    ko: {
      give_gen: ["내가 위를 섬기고 배웁니다.", "blue"],
      recv_gen: ["위로부터 정신적·물질적 도움을 받습니다.", "blue"],
      give_ctrl: ["내가 위를 치며 정신적·재물 손실을 줍니다.", "red"],
      recv_ctrl: ["내가 위로부터 극을 받습니다.", "red"],
      same: ["위와 같은 오행이라 무난하나 밋밋합니다.", ""],
    },
    en: {
      give_gen: ["You serve and learn from those above.", "blue"],
      recv_gen: ["You receive mental and material help from above.", "blue"],
      give_ctrl: ["You strike those above, causing them mental and financial loss.", "red"],
      recv_ctrl: ["You are pressed down by those above.", "red"],
      same: ["Same element as above — calm but flat.", ""],
    },
  };
  const DN_TXT = {
    ko: {
      give_gen: ["내가 동료·후배·자녀에게 베풉니다.", "blue"],
      recv_gen: ["동료·후배·자녀의 도움을 받습니다.", "blue"],
      give_ctrl: ["내가 동료·후배·자녀를 칩니다.", "red"],
      recv_ctrl: ["동료·후배·자녀의 도움을 받지 못합니다.", "red"],
      same: ["아래와 같은 오행이라 무난하나 밋밋합니다.", ""],
    },
    en: {
      give_gen: ["You give to colleagues, juniors and children.", "blue"],
      recv_gen: ["You receive help from colleagues, juniors and children.", "blue"],
      give_ctrl: ["You strike colleagues, juniors and children.", "red"],
      recv_ctrl: ["You get no help from colleagues, juniors and children.", "red"],
      same: ["Same element as below — calm but flat.", ""],
    },
  };
  const PATTERN_TXT = {
    ko: {
      "give_gen|give_gen": "위·아래에 퍼주고 사이가 좋습니다. 봉사정신이 투철합니다.",
      "recv_gen|recv_gen": "위·아래의 도움을 받으나 자기밖에 모릅니다.",
      "give_ctrl|give_ctrl": "내가 위·아래를 치는 모습입니다.",
      "recv_ctrl|recv_ctrl": "내가 위·아래로부터 극을 당하는 모습입니다.",
      "give_gen|recv_gen": "치사랑(위로 올라가는 사랑): 아래에서 도움을 받고 위를 섬깁니다.",
      "recv_gen|give_gen": "내리사랑: 위의 도움을 받고 아래에 베풉니다.",
    },
    en: {
      "give_gen|give_gen": "You give to both above and below and get along well — a strong spirit of service.",
      "recv_gen|recv_gen": "You receive help from above and below, but tend to think only of yourself.",
      "give_ctrl|give_ctrl": "You strike both those above and those below.",
      "recv_ctrl|recv_ctrl": "You are pressed down from both above and below.",
      "give_gen|recv_gen": "Love flowing upward: you receive help from below and serve those above.",
      "recv_gen|give_gen": "Love flowing downward: you receive help from above and give to those below.",
    },
  };
  function paintBy(t, c) {
    if (c === "blue") return paintBlue(t);
    if (c === "red") return paintRed(t);
    return esc(t);
  }

  function buildOhang(oh, lang) {
    if (!oh) return "";
    const ko = lang === "ko";
    const L = ko ? "ko" : "en";
    const up = oh.lastRep || "";
    const me = oh.firstRep || "";
    const first = oh.first || [];
    const lastLetter = first.length ? first[first.length - 1] : null;
    const dn = oh.middleRep || (lastLetter ? lastLetter.ohang : "");
    const dnSub = oh.middleRep
      ? ko ? "미들네임" : "middle name"
      : ko ? "이름 끝 글자" + (lastLetter ? " " + lastLetter.letter : "") : "last letter" + (lastLetter ? " " + lastLetter.letter : "");
    if (!up || !me) return "";
    const ru = relUp(up, me);
    const rd = dn ? relDn(me, dn) : null;

    const row =
      '<div style="display:flex;align-items:center;gap:2px;margin:4px 0 10px">' +
      ohBox(ko ? "위" : "Above", up, ko ? "성" : "last name", lang) +
      ohArrow(ru.kind, ru.toRight, lang) +
      ohBox(ko ? "나" : "You", me, ko ? "이름" : "first name", lang) +
      (rd ? ohArrow(rd.kind, rd.toRight, lang) + ohBox(ko ? "아래" : "Below", dn, dnSub, lang) : "") +
      "</div>";

    const lines = [];
    const u = UP_TXT[L][ru.d] || UP_TXT[L].same;
    lines.push((ko ? "위(부모·관청·선배·배우자): " : "Above (parents · authorities · seniors · spouse): ") + paintBy(u[0], u[1]));
    if (rd) {
      const t = DN_TXT[L][rd.d] || DN_TXT[L].same;
      lines.push((ko ? "아래(동료·후배·자녀): " : "Below (colleagues · juniors · children): ") + paintBy(t[0], t[1]));
      const pat = PATTERN_TXT[L][ru.d + "|" + rd.d];
      if (pat) lines.push(esc(pat));
      const g = (ru.kind === "gen" ? 1 : 0) + (rd.kind === "gen" ? 1 : 0);
      const c = (ru.kind === "ctrl" ? 1 : 0) + (rd.kind === "ctrl" ? 1 : 0);
      lines.push(
        ko
          ? "생 " + g + "개 · 극 " + c + "개입니다."
          : "Generating links: " + g + " · Controlling links: " + c + "."
      );
    }
    return (
      '<div style="font-weight:800;color:#5c2d00;margin-bottom:2px">' +
      (ko ? "오행표" : "Five Elements Chart") +
      "</div>" +
      row +
      lines.join("<br>")
    );
  }

  function badMarks(nS, nG, idx, lang) {
    const marks = [];
    if (nS[idx] && nS[idx].data && suriBad(nS[idx].data))
      marks.push(suriPhrase(nS[idx], lang));
    if (nG[idx] && nG[idx].name && gweBad(nG[idx]))
      marks.push(gweNameHtml(nG[idx], lang));
    return marks;
  }
  function goodMarks(nS, nG, idx, lang) {
    const marks = [];
    if (nS[idx] && nS[idx].data && suriGood(nS[idx].data))
      marks.push(suriPhrase(nS[idx], lang));
    if (nG[idx] && nG[idx].name && gweGood(nG[idx]))
      marks.push(gweNameHtml(nG[idx], lang));
    if (nG[idx] && isMitigate(nG[idx])) {
      const h = gweNameHtml(nG[idx], lang);
      if (marks.indexOf(h) < 0) marks.push(h);
    }
    return marks;
  }
  function allMarks(sArr, gArr, idx, lang) {
    const marks = [];
    if (sArr[idx] && sArr[idx].data) marks.push(suriPhrase(sArr[idx], lang));
    if (gArr[idx] && gArr[idx].name) marks.push(gweNameHtml(gArr[idx], lang));
    return marks;
  }
  function sideBad(nS, nG, idx) {
    return (
      (nS[idx] && nS[idx].data && suriBad(nS[idx].data)) ||
      (nG[idx] && gweBad(nG[idx]))
    );
  }
  function sideGood(nS, nG, idx) {
    return (
      (nG[idx] && (gweGood(nG[idx]) || isMitigate(nG[idx]))) ||
      (nS[idx] && nS[idx].data && suriGood(nS[idx].data))
    );
  }

  /** 경고장·각주 — 수리·괘명 원어(한글)만. 영어 번역명 쓰면 자동번역이 크산소과·히어로스톰 짬뽕 만듦. */
  const WARN_JANG_SURI = [
    { n: 9, name: "대재무용" },
    { n: 10, name: "만사허망" },
    { n: 12, name: "박약박복" },
    { n: 14, name: "이산파멸" },
    { n: 20, name: "백사실패" },
    { n: 22, name: "중도좌절" },
    { n: 26, name: "영웅풍파" },
    { n: 28, name: "파란풍파" },
    { n: 34, name: "재화연속" },
  ];
  const WARN_JANG_HEX = [
    "천산둔",
    "천수송",
    "천지비",
    "택화혁",
    "택뢰수",
    "택수곤",
    "풍수환",
    "뇌산소과",
    "수화기제",
    "수산건",
    "수뢰둔",
    "풍천소축",
    "산풍고",
    "산지박",
    "지화명이",
  ];
  const FOOT_SURI = [
    { n: 10, name: "만사허망" },
    { n: 12, name: "박약박복" },
    { n: 14, name: "이산파멸" },
    { n: 20, name: "백사실패" },
    { n: 22, name: "중도좌절" },
    { n: 26, name: "영웅풍파" },
    { n: 28, name: "파란풍파" },
  ];
  const FOOT_HEX = [
    "천지비",
    "천수송",
    "택수곤",
    "뇌산소과",
    "수화기제",
    "수산건",
    "수뢰둔",
    "풍천소축",
    "풍수환",
    "산지박",
    "산풍고",
  ];
  const FOOT_CHONGUN_DAN =
    "이름 총운에 26 영웅풍파, 28 파란풍파가 있으면 대부분 단명한다. 여자의 경우 이별·사별로 과부가 많다.";
  const FOOT_CHONGUN_CANCER =
    "이름 기운 때문에 암이 오는가? 이름 총운에 이산파멸, 백사실패, 중도좌절이 오면 대부분 암이 많다.";
  const FOOT_SURI20_22 =
    "14 이산파멸보다 더 무서운수리 - 20 백사실패, 22 중도좌절 : 대부분 암이 많다. 총운에 이 운세의 특징은 머리가 좋고 배포가 크며 강한 추진력으로 한때 크게 성공하거나 거물이 되거나 큰 부자가 되기도 하지만 그걸 끝까지 지키지 못하고 중도에 실패, 파산, 사고, 병고, 암, 수술, 감옥, 단명등을 겪게 된다. 하지만 그 아래 주역괘가 수풍정, 수택절이 오면 20 백사실패는 대부대귀로 해석한다. 20수리에 수택절, 수풍정, 지택림, 뇌택귀매 중에 하나가 만들어지면 부자로 살면서 장수, 부귀한다. 단, 사주가 보통 이상이어야 한다.";
  const FOOT_FOOTER =
    "이름 속에 위와 같은 수리 혹은 주역괘가 있다면 개명 외엔 대안이 없다~!!!";

  /** 영어 UI 이름표 — 경고장·각주 전용 (번역기 꺼진 상태 기준, notranslate 적용됨) */
  const SURI_EN = {
    1: "Starting Authority",
    2: "Division & Destruction",
    3: "Born Leader",
    4: "Nothing Achieved",
    5: "Wealth & Rank",
    6: "Inheritance & Growth",
    7: "Tiger Leaving the Forest",
    8: "Longevity & Blessing",
    9: "Great Talent Unused",
    10: "All Things in Vain",
    11: "Trusted by Many",
    12: "Frail & Ill-Fated",
    13: "Bright Wisdom",
    14: "Scattering & Ruin",
    15: "Crane Among Chickens",
    16: "Virtue & Abundance",
    17: "Fame Across the Seas",
    18: "Wealth & Advancement",
    19: "Lonely Misery",
    20: "Failure in All Things",
    21: "Leader's Wisdom",
    22: "Midway Collapse",
    23: "Sun at Its Zenith",
    24: "Wealth & Glory",
    25: "Wise & Smooth",
    26: "Hero's Storm",
    27: "Great Character",
    28: "Turbulent Waves",
    29: "Power & Riches",
    30: "Half Fortune, Half Misfortune",
    31: "Self-Made Success",
    32: "Unexpected Wealth",
    33: "Soaring Authority",
    34: "Continuous Disasters",
    35: "Gentle Harmony",
    36: "Hero in Dispute",
    37: "Authority & Benevolence",
    38: "Arts & Skills",
    39: "Mighty Influence",
    40: "Change & Emptiness",
    41: "Foresight & Renown",
    42: "Waves of Trouble",
    43: "Family Ruin",
    44: "Defeat in Every Battle",
    45: "Mastery Across the Seas",
    46: "Poverty & Hardship",
    47: "Sudden Fortune",
    48: "Power Behind the Scenes",
    49: "Hermit's Retreat",
    50: "Emptiness & Despair",
    51: "Turbulent Change",
    52: "Dragon Ascending",
    53: "Rich Outside, Poor Inside",
    54: "Short-Lived Despair",
    55: "Peak Then Collapse",
    56: "Endless Change",
    57: "Sweet After Bitter",
    58: "Fame & Fortune",
    59: "Weak Will",
    60: "Lost Fortune",
    61: "Glory",
    62: "Desolation",
    63: "Auspicious Sign",
    64: "Hard Path",
    65: "Achievement",
    66: "Aimless Drift",
    67: "Growth",
    68: "Invention",
    69: "Dire Straits",
    70: "Void",
    71: "Steadfast",
    72: "Mixed Fate",
    73: "Ordinary Life",
    74: "Folly",
    75: "Peaceful Fortune",
    76: "Late Fortune",
    77: "Vitality",
    78: "Powerlessness",
    79: "Unable to Rise",
    80: "The End",
    81: "Return to Origin",
  };
  const HEX_EN = {
    건위천: "Creative (Hex. 1)",
    천택리: "Treading (Hex. 10)",
    천화동인: "Fellowship (Hex. 13)",
    천뢰무망: "Innocence (Hex. 25)",
    천풍구: "Coming to Meet (Hex. 44)",
    천수송: "Conflict (Hex. 6)",
    천산둔: "Retreat (Hex. 33)",
    천지비: "Standstill (Hex. 12)",
    택천쾌: "Breakthrough (Hex. 43)",
    태위택: "The Joyous (Hex. 58)",
    택화혁: "Revolution (Hex. 49)",
    택뢰수: "Following (Hex. 17)",
    택풍대과: "Great Excess (Hex. 28)",
    택수곤: "Oppression (Hex. 47)",
    택산함: "Influence (Hex. 31)",
    택지췌: "Gathering Together (Hex. 45)",
    화천대유: "Great Possession (Hex. 14)",
    화택규: "Opposition (Hex. 38)",
    이위화: "The Clinging Fire (Hex. 30)",
    화뢰서합: "Biting Through (Hex. 21)",
    화풍정: "The Cauldron (Hex. 50)",
    화수미제: "Before Completion (Hex. 64)",
    화산려: "The Wanderer (Hex. 56)",
    화지진: "Progress (Hex. 35)",
    뇌천대장: "Great Power (Hex. 34)",
    뇌택귀매: "The Marrying Maiden (Hex. 54)",
    뇌화풍: "Abundance (Hex. 55)",
    진위뢰: "The Arousing Thunder (Hex. 51)",
    뇌풍항: "Duration (Hex. 32)",
    뇌수해: "Deliverance (Hex. 40)",
    뇌산소과: "Small Excess (Hex. 62)",
    뇌지예: "Enthusiasm (Hex. 16)",
    풍천소축: "Small Taming (Hex. 9)",
    풍택중부: "Inner Truth (Hex. 61)",
    풍화가인: "The Family (Hex. 37)",
    풍뢰익: "Increase (Hex. 42)",
    손위풍: "The Gentle Wind (Hex. 57)",
    풍수환: "Dispersion (Hex. 59)",
    풍산점: "Development (Hex. 53)",
    풍지관: "Contemplation (Hex. 20)",
    수천수: "Waiting (Hex. 5)",
    수택절: "Limitation (Hex. 60)",
    수화기제: "After Completion (Hex. 63)",
    수뢰둔: "Difficult Beginning (Hex. 3)",
    수풍정: "The Well (Hex. 48)",
    감위수: "The Abysmal Water (Hex. 29)",
    수산건: "Obstruction (Hex. 39)",
    수지비: "Holding Together (Hex. 8)",
    산천대축: "Great Taming (Hex. 26)",
    산택손: "Decrease (Hex. 41)",
    산화비: "Grace (Hex. 22)",
    산뢰이: "Nourishment (Hex. 27)",
    산풍고: "Decay (Hex. 18)",
    산수몽: "Youthful Folly (Hex. 4)",
    간위산: "Keeping Still (Hex. 52)",
    산지박: "Splitting Apart (Hex. 23)",
    지천태: "Peace (Hex. 11)",
    지택림: "Approach (Hex. 19)",
    지화명이: "Darkened Light (Hex. 36)",
    지뢰복: "Return (Hex. 24)",
    지풍승: "Pushing Upward (Hex. 46)",
    지수사: "The Army (Hex. 7)",
    지산겸: "Modesty (Hex. 15)",
    곤위지: "The Receptive (Hex. 2)",
  };
  /** 영어 UI 전역 이름표 — 인생카드·요약표(index-eTNXNndF.js)도 이것을 씀 */
  window.naEnSuri = function (n, koName, withHanja) {
    const en = SURI_EN[Number(n)];
    if (!en) return koName || "";
    if (withHanja) {
      const m = String(koName || "").match(/\(([^)]+)\)/);
      if (m) return en + " (" + m[1].replace(/\s+/g, "") + ")";
    }
    return en;
  };
  window.naEnHex = function (koName) {
    const k = String(koName || "").replace(/\s*\([^)]*\)\s*/g, "").trim();
    return HEX_EN[k] || koName || "";
  };

  window.enOverviewTable = function (w, lang) {
    if (!w) return "";
    const en = lang === "en";
    const OH = { 木: "#166534", 火: "#991b1b", 土: "#92400e", 金: "#1c1917", 水: "#1e3a8a" };
    const OH_EN = { 木: "Wood", 火: "Fire", 土: "Earth", 金: "Metal", 水: "Water" };
    const tdL = 'style="color:#92400e;font-weight:700;text-align:right;white-space:nowrap;padding:3px 6px 3px 0;width:3.6rem"';
    const tdC = (html, span, extra) =>
      '<td colspan="' + (span || 1) + '" style="text-align:center;padding:3px 2px;' + (extra || "") + '">' + html + "</td>";
    const row = (label, cells) =>
      '<tr style="border-bottom:1px solid #e5e7eb"><td ' + tdL + ">" + esc(label) + "</td>" + cells.join("") + "</tr>";
    const title = (t) =>
      '<tr><td colspan="5" style="text-align:center;font-weight:700;color:#92400e;font-size:13px;letter-spacing:1px;padding:6px 0 2px">' + esc(t) + "</td></tr>";
    const suriHtml = (n, d) => {
      const s = String(n);
      return suriBad(d) ? paintRed(s) : suriGood(d) ? paintBlue(s) : "<strong>" + esc(s) + "</strong>";
    };
    const suriNm = (n, d) => {
      const nm = plainSuriName({ suri: n, data: d }, lang) || "";
      return suriBad(d) ? paintRed(nm) : suriGood(d) ? paintBlue(nm) : esc(nm);
    };
    const gweNm = (g) => {
      if (!g) return "-";
      const nm = gweDisplayName(g, lang);
      return gweBad(g) ? paintRed(nm) : gweGood(g) ? paintBlue(nm) : esc(nm);
    };
    const ohCell = (o) =>
      o ? '<span style="color:' + (OH[o] || "#9ca3af") + ';font-weight:800;font-size:15px">' + esc(en ? OH_EN[o] || o : o) + "</span>" : "-";
    const hasM = !!(w.middleName && w.mc > 0);
    const three = (a, b, c) => (hasM ? [tdC(a), tdC(b), tdC(c, 2)] : [tdC(a), tdC(b, 3)]);
    const nameCell = (hg, enName) =>
      '<span style="font-weight:700;font-size:14px">' + esc(en ? enName : hg || enName) + "</span>";
    const stroke = (n) => '<strong style="font-size:13px">' + esc(n + (en ? "" : "획")) + "</strong>";
    const stageHead = () =>
      (en ? ["Early", "Prime", "Midlife", "Overall"] : ["원격", "형격", "이격", "정격"]).map((x) =>
        tdC(esc(x), 1, "color:#92400e;font-weight:700;font-size:11px")
      );
    const ageS = en ? ["1–23", "24–40", "41–55", "56+"] : ["1~23세", "24~40세", "41~55세", "56세~"];
    const ageG = en ? ["1–30", "31–50", "51–55", "56+"] : ["1~30세", "31~50세", "51~55세", "56세~"];
    const ageCells = (a) => a.map((x) => tdC(esc(x), 1, "color:#78350f;font-size:10px"));
    const four = (arr, fn) => arr.map((x) => tdC(fn(x), 1, "font-size:11px"));

    const nS = [
      [w.won, w.wonData],
      [w.hyeong, w.hyeongData],
      [w.i, w.iData],
      [w.jeong, w.jeongData],
    ];
    const nG = [w.wonGwe, w.hyeongGwe, w.iGwe, w.jeongGwe];
    const rows = [
      title(en ? "Name Overview" : "이름풀이"),
      row(en ? "Name" : "이름", three(nameCell(w.hgLast, w.lastName), nameCell(w.hgFirst, w.firstName), nameCell(w.hgMiddle, w.middleName))),
      row(en ? "Seed" : "씨앗수", three(stroke(w.lc), stroke(w.fc), stroke(w.mc))),
      row(en ? "4 Stages" : "4격", stageHead()),
      row(en ? "Number" : "수리", nS.map((x) => tdC(suriHtml(x[0], x[1])))),
      row(en ? "Meaning" : "수리뜻", four(nS, (x) => suriNm(x[0], x[1]))),
      row(en ? "Ages" : "연령대", ageCells(ageS)),
      row(en ? "Hexagram" : "주역", four(nG, gweNm)),
      row(en ? "Ages" : "연령대", ageCells(ageG)),
      row(en ? "Element" : "오행", three(ohCell(w.lastRep), ohCell(w.firstRep), ohCell(w.middleRep))),
    ];
    const b = w.birthSuri;
    if (b && w.birthWonData && w.birthHyeongData && w.birthIData && w.birthJeongData) {
      const bS = [
        [b.won, w.birthWonData],
        [b.hyeong, w.birthHyeongData],
        [b.i, w.birthIData],
        [b.jeong, w.birthJeongData],
      ];
      const bG = [w.birthWonGwe, w.birthHyeongGwe, w.birthIGwe, w.birthJeongGwe];
      rows.push(
        title(en ? "Birth Date" : "탄생일(사주)"),
        row(en ? "Seed" : "씨앗수", [
          tdC("<strong>" + esc((en ? "Year " : "연 ") + b.yearSum) + "</strong>"),
          tdC("<strong>" + esc((en ? "Month " : "월 ") + b.month) + "</strong>"),
          tdC("<strong>" + esc((en ? "Day " : "일 ") + b.day) + "</strong>", 2),
        ]),
        row(en ? "4 Stages" : "4격", stageHead()),
        row(en ? "Number" : "수리", bS.map((x) => tdC(suriHtml(x[0], x[1])))),
        row(en ? "Meaning" : "수리뜻", four(bS, (x) => suriNm(x[0], x[1]))),
        row(en ? "Hexagram" : "주역", four(bG, gweNm))
      );
    }
    return (
      '<div style="background:#fef9f0;border:2px solid #d4a017;border-radius:0.75rem;padding:1rem;margin-bottom:1.5rem">' +
      '<h3 style="text-align:center;font-weight:700;color:#92400e;font-size:0.95rem;letter-spacing:2px;margin:0 0 0.6rem">' +
      esc(en ? "Name Reading Overview" : "이름풀이 종합표") +
      '</h3><div style="overflow-x:auto"><table style="width:100%;min-width:280px;border-collapse:collapse;font-size:12px"><tbody>' +
      rows.join("") +
      "</tbody></table></div></div>"
    );
  };
  /** 인생카드·요약보기 = 요약본(narrate). 한글은 __NARRATE__, 영어는 NA_NARR_EN. 초년·말년 칸은 해당 나이대에만. */
  function ageKeyOf(label) {
    const s = String(label || "");
    if (s.indexOf("초년") >= 0) return "초년";
    if (s.indexOf("말년") >= 0 || s.indexOf("총운") >= 0) return "말년";
    return "";
  }
  function coreBrief(t) {
    return String(t || "")
      .replace(/^(길수|흉수|평수|주의|길괘|흉괘|중성)\s*[—–-]\s*/, "")
      .trim();
  }
  const CARD_KO = ["초년운", "장년운", "중년운", "말년·총운"];
  const CARD_EN = ["Early Fortune", "Prime Years", "Midlife Peak", "Ultimate Destiny"];
  window.naSame = function (arr, k) {
    const b = arr[k];
    if (b == null) return -1;
    for (let j = 0; j < k; j++) {
      const a = arr[j];
      if (a == null) continue;
      if (typeof a === "object" ? a.id === b.id : a === b) return j;
    }
    return -1;
  };
  window.naSuriSum = function (n, d, en, ko, label, same) {
    const key = String(n);
    const ak = ageKeyOf(label);
    if (same >= 0) {
      const head = ko
        ? "앞의 " + CARD_KO[same] + "과 같은 수리입니다."
        : "Same number as " + CARD_EN[same] + " above.";
      const extra = ko
        ? ak && (((window.__NARRATE__ || {}).suri || {})[key] || {})[ak]
        : ak && (((window.NA_NARR_EN || {}).suriAge || {})[key] || {})[ak];
      return extra ? head + " " + String(extra).trim() : head;
    }
    if (ko) {
      const nar = ((window.__NARRATE__ || {}).suri || {})[key];
      if (nar && nar.narrate) {
        const extra = ak && nar[ak] ? " " + String(nar[ak]).trim() : "";
        return String(nar.narrate).trim() + extra;
      }
      const cs = ((window.__CORE_SUMMARIES__ || {}).suri || {})[key];
      if (cs && (cs.core || cs.shortDesc)) return coreBrief(cs.core || cs.shortDesc);
      return [d && d.shortDesc, d && d.desc].filter(Boolean).join(" ");
    }
    const E = window.NA_NARR_EN || {};
    const t = (E.suri || {})[key];
    if (t) {
      const age = ((E.suriAge || {})[key] || {})[ak];
      return age ? t + " " + age : t;
    }
    return (en && (en.shortDescEn || en.descEn)) || (d && d.shortDesc) || "";
  };
  window.naHexSum = function (g, pen, ko, same) {
    if (!g) return "";
    if (same >= 0)
      return ko
        ? "앞의 " + CARD_KO[same] + "과 같은 괘입니다."
        : "Same hexagram as " + CARD_EN[same] + " above.";
    const key = String(g.id);
    if (ko) {
      const nar = ((window.__NARRATE__ || {}).hex || {})[key];
      if (nar && nar.narrate) return String(nar.narrate).trim();
      const cs = ((window.__CORE_SUMMARIES__ || {}).hex || {})[key];
      if (cs && cs.core) return coreBrief(cs.core);
      return g.desc || "";
    }
    const t = ((window.NA_NARR_EN || {}).hex || {})[key];
    return t || (pen && pen.descEn) || g.desc || "";
  };
  /** 세로 오행 흐름도 화살표: top=위 칸 오행, bot=아래 칸 오행, meTop=나가 위 칸인지 */
  window.naOhLink = function (top, bot, meTop, ko) {
    let kind = "same";
    let down = true;
    if (GEN[top] === bot) kind = "gen";
    else if (GEN[bot] === top) (kind = "gen"), (down = false);
    else if (KEUK[top] === bot) kind = "ctrl";
    else if (KEUK[bot] === top) (kind = "ctrl"), (down = false);
    const T = ko
      ? {
          up: { gen: ["위가 나를 도와 줍니다", "내가 위를 섬깁니다"], ctrl: ["위가 나를 칩니다", "내가 위를 칩니다"] },
          dn: { gen: ["내가 아래를 도와 줍니다", "아래가 나를 도와 줍니다"], ctrl: ["내가 아래를 칩니다", "아래가 나를 칩니다"] },
          same: "같은 오행",
          k: { gen: "생(生)", ctrl: "극(剋)", same: "비화" },
        }
      : {
          up: { gen: ["Above helps you", "You serve Above"], ctrl: ["Above controls you", "You control Above"] },
          dn: { gen: ["You help Below", "Below helps you"], ctrl: ["You control Below", "Below controls you"] },
          same: "Same element",
          k: { gen: "Generating", ctrl: "Controlling", same: "Same" },
        };
    const side = meTop ? T.dn : T.up;
    const text = kind === "same" ? T.same : side[kind][down ? 0 : 1];
    return {
      kind,
      arrow: kind === "same" ? "↕" : down ? "▼" : "▲",
      color: kind === "ctrl" ? "#ef4444" : kind === "gen" ? "#16a34a" : "#6b7280",
      label: T.k[kind] + " · " + text,
    };
  };
  /** 한글 UI는 원어, 영어 UI는 영어 이름 */
  function suriLab(n, koName, lang) {
    if (lang === "en" && SURI_EN[n]) return n + " " + SURI_EN[n];
    return suriLabel(n, koName);
  }
  function hexLab(koName, lang) {
    const k = strip(koName);
    if (lang === "en" && HEX_EN[k]) return HEX_EN[k];
    return k;
  }

  const FOOT_CHONGUN_DAN_EN =
    "Traditionally, 26 Hero's Storm or 28 Turbulent Waves in the overall destiny (Late, whole life) is associated with a shorter life and with separation from or loss of a spouse.";
  const FOOT_CHONGUN_CANCER_EN =
    "In the traditional reading, 14 Scattering & Ruin, 20 Failure in All Things or 22 Midway Collapse in the overall destiny is associated with a higher risk of serious illness, including cancer.";
  const FOOT_SURI20_22_EN =
    "Even more serious than 14 Scattering & Ruin are 20 Failure in All Things and 22 Midway Collapse, traditionally associated with a higher risk of serious illness. In the overall destiny these numbers bring a sharp mind, big ambition and strong drive; some succeed hugely for a time, become a major figure or grow very rich, but may not keep it to the end and may meet failure, bankruptcy, accidents, illness, surgery, legal trouble or an early death midway. However, if the hexagram below is The Well (Hex. 48) or Limitation (Hex. 60), 20 Failure in All Things is read as great wealth and great honor. When 20 forms any one of Limitation (Hex. 60), The Well (Hex. 48), Approach (Hex. 19) or The Marrying Maiden (Hex. 54), the person lives wealthy, long-lived and honored — provided the birth chart is at least average.";
  const FOOT_FOOTER_EN =
    "If your name contains any of the numbers or hexagrams above, the traditional recommendation is to consider a name change.";
  const DISCLAIMER_EN =
    "These readings follow traditional Korean I Ching name analysis. They are for cultural reference only and are not medical, legal or financial advice.";

  function collectHits(nS, nG, lang) {
    const hits = [];
    const labels =
      lang === "en"
        ? ["Early (1–23)", "Prime (24–40)", "Midlife (41–55)", "Late (56+)"]
        : ["초년(1–23)", "장년(24–40)", "중년(41–55)", "말년(56+)"];
    for (let i = 0; i < 4; i++) {
      const ns = nS[i];
      if (ns && ns.suri != null) {
        const num = Number(ns.suri);
        for (let j = 0; j < FOOT_SURI.length; j++) {
          if (FOOT_SURI[j].n === num) {
            hits.push(
              labels[i] + " " + paintRed(suriLab(num, FOOT_SURI[j].name, lang))
            );
          }
        }
      }
      const ng = nG[i];
      if (ng && ng.name) {
        for (let j = 0; j < FOOT_HEX.length; j++) {
          if (hexNameStarts(ng, FOOT_HEX[j])) {
            hits.push(labels[i] + " " + paintRed(hexLab(FOOT_HEX[j], lang)));
          }
        }
      }
    }
    return hits;
  }
  function chongunNotes(nS, lang) {
    const late = nS[I.late];
    if (!late || late.suri == null) return [];
    const n = Number(late.suri);
    const en = lang === "en";
    const notes = [];
    if (n === 26 || n === 28) notes.push(en ? FOOT_CHONGUN_DAN_EN : FOOT_CHONGUN_DAN);
    if (n === 14 || n === 20 || n === 22)
      notes.push(en ? FOOT_CHONGUN_CANCER_EN : FOOT_CHONGUN_CANCER);
    if (n === 20 || n === 22) notes.push(en ? FOOT_SURI20_22_EN : FOOT_SURI20_22);
    return notes;
  }


  /** 이름표 자세히: 수리 빨강·파랑 개수 → 주역 4괘 흉 여부 → 재물운(청색) → 흉수리 밑 괘 → 판정 */
  function buildNameDetail(nS, nG, lang) {
    const ko = lang === "ko";
    const sRed = [];
    let sBlue = 0;
    const gRed = [];
    const gBlue = [];
    let gBlack = 0;
    const mit = [];
    let mitLast = "";
    for (let i = 0; i < 4; i++) {
      const s = nS[i];
      if (s && s.data) {
        if (suriBad(s.data)) sRed.push(i);
        else if (suriGood(s.data)) sBlue++;
      }
      const g = nG[i];
      if (g && g.name) {
        if (gweBad(g)) gRed.push(gweNameHtml(g, lang));
        else if (gweGood(g)) gBlue.push(gweNameHtml(g, lang));
        else gBlack++;
        if (isMitigate(g)) {
          mit.push(gweNameHtml(g, lang));
          mitLast = gweDisplayName(g, lang);
        }
      }
    }
    if (!nS.length && !nG.length) return "";
    const redList = sRed.map(function (i) {
      return suriPhrase(nS[i], lang);
    });
    const bits = [];
    bits.push(
      ko
        ? "이름표를 자세히 보겠습니다. 수리 4개 중 빨간색이 " +
            sRed.length +
            "개" +
            (redList.length ? "(" + joinMarks(redList) + ")" : "") +
            ", 파란색이 " +
            sBlue +
            "개입니다."
        : "Reading the name chart closely: of the 4 numbers, " +
            sRed.length +
            " are red" +
            (redList.length ? " (" + joinMarks(redList) + ")" : "") +
            " and " +
            sBlue +
            " are blue."
    );
    bits.push(
      ko
        ? "주역 4괘는 청색 " +
            gBlue.length +
            "개, 검정 " +
            gBlack +
            "개" +
            (gRed.length ? ", 빨간색 " + gRed.length + "개(" + joinMarks(gRed) + ")" : "") +
            "입니다."
        : "Of the 4 hexagrams, " +
            gBlue.length +
            " are blue, " +
            gBlack +
            " black" +
            (gRed.length ? ", " + gRed.length + " red (" + joinMarks(gRed) + ")" : "") +
            "."
    );
    if (gBlue.length) {
      bits.push(
        ko
          ? "청색 괘는 재물운이니 재물운이 " + gBlue.length + "개나 됩니다."
          : "Blue hexagrams are wealth signs — this name has " + gBlue.length + "."
      );
    }
    if (mit.length && sRed.length) {
      bits.push(
        ko
          ? joinMarks(mit) + josa(mitLast, "은", "는") + " 수리의 흉을 눌러 주는 기운이기도 합니다."
          : joinMarks(mit) + " also press down the misfortune of the numbers."
      );
    }
    sRed.forEach(function (i) {
      const s = nS[i];
      const g = nG[i];
      if (!g || !g.name) return;
      const sp = suriPhrase(s, lang);
      const gp = gweNameHtml(g, lang);
      const gw = gweDisplayName(g, lang);
      if (gweGood(g) || isMitigate(g)) {
        if (Number(s.suri) === 14) {
          bits.push(
            ko
              ? sp +
                  " 밑에 청색 재물운 " +
                  gp +
                  josa(gw, "이", "가") +
                  " 들어 이산파멸의 장점만 살아나, 위기 앞에서도 독종 소리를 들을 만큼 치열하게 살면서 재물을 더 크게 만들어 줍니다."
              : "Under " +
                  sp +
                  " sits the blue wealth hexagram " +
                  gp +
                  ", so only the strength of 14 survives — you live fiercely, never giving up in a crisis, and grow your wealth even bigger."
          );
        } else {
          bits.push(
            ko
              ? sp + " 밑에 청색 " + gp + josa(gw, "이", "가") + " 들어 흉을 눌러 줍니다."
              : "Under " + sp + " sits the blue " + gp + ", pressing down its misfortune."
          );
        }
      } else if (gweBad(g)) {
        bits.push(
          ko
            ? sp + " 밑에 " + gp + "까지 들어 흉이 겹칩니다."
            : "Under " + sp + " sits " + gp + " as well — the misfortune doubles."
        );
      } else {
        bits.push(
          ko
            ? sp + " 밑의 " + gp + josa(gw, "은", "는") + " 보통 괘라 흉을 눌러 주지 못합니다."
            : "Under " + sp + " sits " + gp + ", an ordinary hexagram that cannot press down the misfortune."
        );
      }
    });
    bits.push(
      gRed.length
        ? paintRed(
            ko
              ? "주역 괘에 흉이 있어 좋은 이름이라 하기 어렵습니다."
              : "An unfavorable hexagram is present — this is hard to call a good name."
          )
        : paintBlue(
            ko
              ? "주역 4괘에 흉이 없으니 좋은 이름입니다."
              : "None of the four hexagrams is unfavorable — this is a good name."
          )
    );
    return bits.join(" ");
  }

  function buildBirth(bS, bG, hasB, lang) {
    if (!hasB || !bS || !bS.length) return "";
    const ko = lang === "ko";
    const lines = [];
    lines.push(
      ko
        ? "탄생일(사주)표는 시기별로 어떻게 살아가라 했는지를 보여 줍니다."
        : "Birth chart shows how you were meant to live, stage by stage:"
    );
    for (let i = 0; i < 4; i++) {
      const marks = allMarks(bS, bG, i, lang);
      if (marks.length) {
        lines.push(ageOf(AGE_KEYS[i], lang) + ": " + joinMarks(marks) + ".");
      }
    }
    return lines.join(" ");
  }

  function suriNameHtml(ns, lang) {
    if (!ns || !ns.data) return "";
    const nm = plainSuriName(ns, lang) || String(ns.suri);
    if (suriBad(ns.data)) return paintRed(nm);
    if (suriGood(ns.data)) return paintBlue(nm);
    return "<strong>" + esc(nm) + "</strong>";
  }
  /** 받침 없거나 ㄹ이면 로, 그 밖은 으로 */
  function josaRo(word) {
    const w = String(word || "");
    const c = w.charCodeAt(w.length - 1);
    if (c >= 0xac00 && c <= 0xd7a3) {
      const j = (c - 0xac00) % 28;
      return j === 0 || j === 8 ? "로" : "으로";
    }
    return "로";
  }
  function hexMeaning(g, ko) {
    if (!g) return "";
    if (ko) {
      const nar = ((window.__NARRATE__ || {}).hex || {})[String(g.id)];
      const m = nar && String(nar.narrate || "").match(/^(.{2,12}?)\s*이?라는 뜻/);
      return m ? m[1].trim() : "";
    }
    const t = ((window.NA_NARR_EN || {}).hex || {})[String(g.id)];
    const m = t && String(t).match(/^It means ([^—.,;]+?)\s*[—.,;]/);
    return m ? m[1].trim() : "";
  }
  const FLOW_P_KO = ["초년", "장년", "중년", "말년"];
  const FLOW_P_EN = ["in the early years", "in the prime years", "in midlife", "in the later years"];
  const FLOW_HA_KO = ["1세에서 30세", "31세에서 50세", "51세에서 55세", "56세 이후"];
  const FLOW_HA_EN = ["ages 1–30", "ages 31–50", "ages 51–55", "age 56 and after"];

  /** 탄생일표 흐름: 총운 → 시기별 흉(흉수리·흉괘) → 이름이 막아 주는지. 흉괘는 이름으로도 막기 힘듦. */
  function buildSajuFlow(nS, nG, bS, bG, lang) {
    const ko = lang === "ko";
    const ls = bS[3];
    const lg = bG[3];
    const lead = [];
    if (ls && ls.data) lead.push(suriNameHtml(ls, lang));
    if (lg && lg.name) lead.push(gweNameHtml(lg, lang));
    const lastLead = lg && lg.name ? gweDisplayName(lg, lang) : ls ? plainSuriName(ls, lang) : "";
    const items = [];
    const redHex = [];
    let lastIsSuri = false;
    let lastSuriName = "";
    for (let i = 0; i < 4; i++) {
      const s = bS[i];
      const g = bG[i];
      if (s && s.data && suriBad(s.data)) {
        items.push(
          ko
            ? FLOW_P_KO[i] + "에 " + suriNameHtml(s, lang)
            : suriNameHtml(s, lang) + " " + FLOW_P_EN[i]
        );
        lastIsSuri = true;
        lastSuriName = plainSuriName(s, lang);
      }
      if (g && g.name && gweBad(g)) {
        const gw = gweDisplayName(g, lang);
        const mean = hexMeaning(g, ko);
        redHex.push(gweNameHtml(g, lang));
        items.push(
          ko
            ? FLOW_P_KO[i] +
                "에 주역괘 " +
                gweNameHtml(g, lang) +
                josaRo(gw) +
                " " +
                (mean ? mean + josa(mean, "이라", "라") + " " : "") +
                "위기가 " +
                FLOW_HA_KO[i] +
                "에 있으니"
            : "the hexagram " +
                gweNameHtml(g, lang) +
                " " +
                FLOW_P_EN[i] +
                (mean ? " — " + mean + " —" : "") +
                " so a crisis lies at " +
                FLOW_HA_EN[i]
        );
        lastIsSuri = false;
      }
    }
    const head = lead.length
      ? ko
        ? lead.join(", ") + josaRo(lastLead) + " "
        : "With " + lead.join(" and ") + " as the overall destiny, the birth chart brings "
      : ko
        ? ""
        : "The birth chart brings ";
    if (!items.length) {
      return ko
        ? head + "시기별로 큰 흉이 없는 사주입니다."
        : (lead.length ? "With " + lead.join(" and ") + " as the overall destiny, " : "") +
            "the birth chart has no major misfortune by period.";
    }
    let body = ko ? items.join(", ") : items.join(", and ");
    if (ko && lastIsSuri) body += josa(lastSuriName, "이", "가") + " 있으니";
    let nameRed = 0;
    let nameHelp = 0;
    for (let i = 0; i < 4; i++) {
      const g = nG[i];
      if (!g || !g.name) continue;
      if (gweBad(g)) nameRed++;
      else if (gweGood(g) || isMitigate(g)) nameHelp++;
    }
    const lastRed = redHex.length ? gweDisplayName(bG.filter(gweBad).pop(), lang) : "";
    let tail;
    if (nameRed) {
      tail = ko
        ? " 이런 사주를 이름의 흉괘까지 겹쳐 더 힘들게 합니다."
        : ". The name's own unfavorable hexagram piles on and makes this chart even harder.";
    } else if (nameHelp) {
      const much = nameHelp >= 2;
      tail = ko
        ? " 이런 사주를 이름이 " +
          (much ? "많은 " : "") +
          "재물과 위기를 막아 줬으나" +
          (redHex.length
            ? " " + joinMarks(redHex) + josa(lastRed, "은", "는") + " 막기가 힘이 듭니다."
            : " 사주의 흉을 잘 눌러 줍니다.")
        : ". The name brought " +
          (much ? "much " : "") +
          "wealth and held back the crises" +
          (redHex.length ? ", but " + joinMarks(redHex) + " is hard to block." : ".");
    } else {
      tail = ko
        ? " 이런 사주를 이름이 막아 주지 못합니다."
        : ". The name cannot hold these back.";
    }
    return head + body + tail;
  }

  function buildNameVsSaju(nS, nG, bS, bG, hasB, lang) {
    const ko = lang === "ko";
    const bits = [];
    bits.push(
      ko
        ? "이런 삶을 살아가라 했는데, 이름의 기운이 사주를 도와 주는지 해롭게 하는지 보겠습니다."
        : "With that life path set, does the name energy help — or hurt — the birth chart?"
    );
    const lateM = allMarks(nS, nG, I.late, lang);
    if (lateM.length) {
      bits.push(
        (ko ? ageOf("late", lang) + ": " : "Overall destiny, " + ageOf("late", lang) + ": ") +
          joinMarks(lateM) +
          "."
      );
    }
    if (hasB && sideBad(nS, nG, I.late) && sideBad(bS, bG, I.late)) {
      bits.push(
        paintRed(
          ko
            ? "이름 흉과 사주 흉이 마주쳐 최악입니다."
            : "Worst pairing: name misfortune meets birth-chart misfortune."
        )
      );
    } else if (sideBad(nS, nG, I.late)) {
      bits.push(
        paintRed(
          ko
            ? "이름이 평생의 길을 누르고 있어 개명을 강력히 권합니다."
            : "The name presses the lifetime path — a change is strongly advised."
        )
      );
    } else if (sideGood(nS, nG, I.late)) {
      bits.push(
        paintBlue(ko ? "이름이 전체 삶의 길을 도와 줍니다." : "The name supports the overall path.")
      );
    }
    return bits.join(" ");
  }

  const TP_SURI_AGE = [[1, 23], [24, 40], [41, 55], [56, 0]];
  const TP_HEX_AGE = [[1, 30], [31, 50], [51, 55], [56, 0]];
  const TP_NUM = ["①", "②", "③", "④"];

  /** 변곡점: 시기별로 이름 ↔ 사주를 견줘 흉이 드러나는 곳을 모두 짚는다. 말년을 먼저 둔다. */
  function buildTurningPoints(nS, nG, bS, bG, hasB, lang) {
    const ko = lang === "ko";
    const P_KO = ["초년", "장년", "중년", "말년·총운"];
    const P_EN = ["Early years", "Prime years", "Midlife", "Later years · overall destiny"];
    const range = (i, useS, useH) => {
      const a = [];
      if (useS) a.push(TP_SURI_AGE[i]);
      if (useH) a.push(TP_HEX_AGE[i]);
      if (!a.length) a.push(TP_SURI_AGE[i]);
      const st = Math.min.apply(null, a.map((x) => x[0]));
      const open = a.some((x) => !x[1]);
      const en = Math.max.apply(null, a.map((x) => x[1]));
      if (open) return ko ? st + "세 이후" : "age " + st + "+";
      return ko ? st + "~" + en + "세" : "ages " + st + "–" + en;
    };
    const marks = (s, g, bad) => {
      const m = [];
      if (s && s.data && (bad ? suriBad(s.data) : suriGood(s.data)))
        m.push((bad ? paintRed : paintBlue)(s.suri + " " + plainSuriName(s, lang)));
      if (g && g.name && (bad ? gweBad(g) : gweGood(g) || isMitigate(g))) m.push(gweNameHtml(g, lang));
      return m.join("·");
    };
    const tail = (s, g, bad) =>
      g && g.name && (bad ? gweBad(g) : gweGood(g) || isMitigate(g)) ? gweDisplayName(g, lang) : plainSuriName(s, lang);
    const lastBad = sideBad(nS, nG, I.late);
    const lastGood = !lastBad && sideGood(nS, nG, I.late);
    const lastBadM = marks(nS[3], nG[3], true);
    const lastGoodM = marks(nS[3], nG[3], false);

    const lines = [];
    const tpNames = [];
    [3, 0, 1, 2].forEach((i) => {
      const ns = nS[i], ng = nG[i], bs = hasB ? bS[i] : null, bg = hasB ? bG[i] : null;
      const nSB = !!(ns && ns.data && suriBad(ns.data)), nGB = gweBad(ng);
      const bSB = !!(bs && bs.data && suriBad(bs.data)), bGB = gweBad(bg);
      const nameBad = nSB || nGB, birthBad = bSB || bGB;
      const nameGood = !nameBad && !!marks(ns, ng, false);
      const birthGood = !birthBad && !!marks(bs, bg, false);
      const P = ko ? P_KO[i] : P_EN[i];
      let txt = "", tp = false, rg = "";
      if (nameBad && birthBad) {
        tp = true;
        rg = range(i, nSB || bSB, nGB || bGB);
        txt = ko
          ? "이름 " + marks(ns, ng, true) + " × 사주 " + marks(bs, bg, true) + " — " + paintRed("이름 흉과 사주 흉이 마주친 최악의 변곡점입니다.")
          : "name " + marks(ns, ng, true) + " × birth chart " + marks(bs, bg, true) + " — " + paintRed("name misfortune meets birth-chart misfortune: the worst turning point.");
      } else if (nameBad) {
        tp = true;
        rg = range(i, nSB, nGB);
        if (hasB && birthGood) {
          txt = ko
            ? "이름 " + marks(ns, ng, true) + josa(tail(ns, ng, true), "이", "가") + " 좋은 사주(" + marks(bs, bg, false) + ")를 치는 변곡점입니다."
            : "the name's " + marks(ns, ng, true) + " strikes a good birth chart (" + marks(bs, bg, false) + ") — a turning point.";
        } else {
          txt = ko
            ? "이름 " + marks(ns, ng, true) + " — 이름 흉이 드러나는 변곡점입니다."
            : "the name's " + marks(ns, ng, true) + " — the name's misfortune surfaces here.";
        }
      } else if (birthBad) {
        if (nameGood) {
          rg = range(i, bSB, bGB);
          txt = ko
            ? "사주의 흉(" + marks(bs, bg, true) + ")을 이름(" + marks(ns, ng, false) + ")이 눌러 주는 시기입니다."
            : "the name (" + marks(ns, ng, false) + ") presses down the birth chart's misfortune (" + marks(bs, bg, true) + ").";
          if (bGB) {
            tp = true;
            txt += ko
              ? " 다만 흉괘 " + gweNameHtml(bg, lang) + josa(gweDisplayName(bg, lang), "은", "는") + " 막기가 힘이 들어 변곡점이 됩니다."
              : " Still, the hexagram " + gweNameHtml(bg, lang) + " is hard to block, so it remains a turning point.";
          }
        } else {
          tp = true;
          rg = range(i, bSB, bGB);
          txt = ko
            ? "사주 " + marks(bs, bg, true) + " — 이름이 막아 주지 못해 사주 흉이 그대로 드러나는 변곡점입니다."
            : "birth chart " + marks(bs, bg, true) + " — the name does not block it, so the chart's misfortune surfaces.";
        }
      } else {
        return;
      }
      if (tp && i < 3) {
        if (lastBad && lastBadM)
          txt += ko
            ? " 총운 " + lastBadM + "까지 겹쳐 시련이 가중됩니다."
            : " The overall destiny " + lastBadM + " adds weight to this trial.";
        else if (lastGood && lastGoodM)
          txt += ko
            ? " 총운 " + lastGoodM + josa(tail(nS[3], nG[3], false), "이", "가") + " 흉을 덜어 줍니다."
            : " The overall destiny " + lastGoodM + " lightens it.";
      }
      if (tp && i === 3)
        txt += ko ? " 총운이라 앞 시기에도 영향을 줍니다." : " As the overall destiny, it reaches into the earlier stages too.";
      if (tp) tpNames.push(ko ? P_KO[i].replace("·총운", "") : P_EN[i].replace(" · overall destiny", ""));
      lines.push((tp ? TP_NUM[tpNames.length - 1] + " " : "· ") + "<strong>" + esc(P) + (ko ? "(" : " (") + esc(rg) + ")</strong>: " + txt);
    });

    const KNUM = ["", "한", "두", "세", "네"];
    const head = ko
      ? "<strong>변곡점</strong> — " +
        (hasB ? "이름과 탄생일을 시기별로 견주면 삶의 변곡점이 드러납니다. " : "이름을 시기별로 보면 변곡점이 드러납니다. ") +
        (tpNames.length
          ? "이 사람의 변곡점은 " + tpNames.join("·") + ", " + KNUM[tpNames.length] + " 곳입니다."
          : "시기별로 뚜렷한 변곡점이 없습니다.")
      : "<strong>Turning points</strong> — " +
        (hasB ? "Setting the name beside the birth chart period by period reveals the turning points of a life. " : "Reading the name period by period reveals its turning points. ") +
        (tpNames.length
          ? "This person has " + tpNames.length + " turning point" + (tpNames.length > 1 ? "s" : "") + ": " + tpNames.join(", ") + "."
          : "There is no clear turning point by period.");
    return head + (lines.length ? "<br>" + lines.join("<br>") : "");
  }

  function buildWrap(nS, nG, lang) {
    const ko = lang === "ko";
    if (sideBad(nS, nG, I.late)) {
      return ko
        ? "이름은 매일 듣는 세 글자 주기도문입니다. 고난을 부르는 기도라면 개명을 생각해 볼 만합니다. " +
            "자세한 것은 요약보기의 밑줄을 누르고, 아래 경고장을 보세요."
        : "Your name works like a prayer you hear every day. If it calls for hardship, a change is worth considering. " +
            "Details: tap underlined items in Reading Summary; see Warning Board below.";
    }
    return ko
      ? "자세한 것은 요약보기의 밑줄을 누르면 나옵니다. 가장 심각한 흉은 아래 경고장에 있습니다."
      : "Tap underlined items in Reading Summary for details. " +
          "Warning Board lists the most serious patterns.";
  }

  /** 경고장·각주 — ko: 한글 문장 / en: 영어 문장 + 원어 수리·괘명. notranslate로 자동번역 짬뽕 차단. */
  function warningFootnoteHtml(nS, nG, lang) {
    const en = lang === "en";
    const warnSuri = WARN_JANG_SURI.map(function (s) {
      return suriLab(s.n, s.name, lang);
    }).join(", ");
    const warnHex = WARN_JANG_HEX.map(function (h) {
      return hexLab(h, lang);
    }).join(", ");
    const footSuri = FOOT_SURI.map(function (s) {
      return suriLab(s.n, s.name, lang);
    }).join(", ");
    const footHex = FOOT_HEX.map(function (h) {
      return hexLab(h, lang);
    }).join(", ");
    const hits = collectHits(nS, nG, lang);
    const chong = chongunNotes(nS, lang);

    const wrap = ' class="notranslate" translate="no"';
    const yellowNote =
      ' style="background:#FFFF00;border:2px solid #111;color:#111;font-weight:700;line-height:1.55;padding:10px;font-size:0.9rem;margin-top:8px">';
    const red = function (t) {
      return '<span style="color:#FF0000">' + esc(t) + "</span>";
    };

    const warnBody = en
      ? "Warning: If your name contains unfavorable numerology numbers such as " +
        red(warnSuri) +
        ", or difficult Hexagrams such as " +
        red(warnHex) +
        "—promptly changing your name is the most reliable way to mitigate misfortune."
      : "만약 여러분 이름을 분석해서 " +
        red(warnSuri) +
        " 등이 있거나, 이러한 수리가 아니라 해도 수리에 주역을 대입해서 " +
        red(warnHex) +
        " 등의 괘가 도사리고 있다면 오로지 신속한 개명만이 피해를 대폭 줄일 수 있습니다.";

    const warnBox =
      "<div" +
      wrap +
      ' style="margin-top:16px">' +
      '<div style="font-weight:800;font-size:1.1rem;color:#111;margin:0 0 8px">' +
      (en ? "Warning Board" : "경고장") +
      "</div>" +
      '<div style="background:#FFFF00;color:#FF1493;font-weight:700;line-height:1.6;padding:12px 10px;border-radius:6px;font-size:0.95rem">' +
      warnBody +
      "</div></div>";

    let applyBlock = "";
    if (hits.length) {
      applyBlock =
        "<div" +
        wrap +
        ' style="margin-top:10px;line-height:1.65;font-size:0.95rem;font-weight:700;color:#FF0000">' +
        (en ? "This name contains: " : "이 이름에 해당: ") +
        hits.join(", ") +
        (en
          ? ". In the traditional reading this points to serious hardship; a name change is worth considering."
          : ". 절망적 상황에 처하기 쉬우니 개명을 심사숙고하십시오.") +
        "</div>";
    }

    const chongunBox = [
      en ? FOOT_CHONGUN_DAN_EN : FOOT_CHONGUN_DAN,
      en ? FOOT_CHONGUN_CANCER_EN : FOOT_CHONGUN_CANCER,
      en ? FOOT_SURI20_22_EN : FOOT_SURI20_22,
    ]
      .map(function (t) {
        return "<div" + wrap + yellowNote + red(t) + "</div>";
      })
      .join("");

    let chongApply = "";
    if (chong.length) {
      chongApply =
        "<div" +
        wrap +
        ' style="margin-top:8px;line-height:1.55;font-size:0.9rem;font-weight:700;color:#FF0000">' +
        (en ? "[Overall-destiny footnote applies] " : "【총운 각주 적용】 ") +
        esc(chong.join(" ")) +
        "</div>";
    }

    const footBody = en
      ? 'Analyze your <span style="color:#FF1493">name</span>: if it contains numbers such as ' +
        red(footSuri) +
        ", or, applying the I Ching to the name, hexagrams such as " +
        red(footHex) +
        ", the traditional reading warns of serious hardship."
      : '여러분 <span style="color:#FF1493">이름</span>을 분석해서 만약 그 안에 ' +
        red(footSuri) +
        " 등이 있거나, 혹은 이름에 주역을 대입해서 " +
        red(footHex) +
        " 괘가 있다면 절망적 상황에 처한다.";

    const footBox =
      "<div" +
      wrap +
      ' style="margin-top:14px">' +
      '<div style="font-weight:800;font-size:1.1rem;color:#111;margin:0 0 8px">' +
      (en ? "Footnotes" : "각주") +
      "</div>" +
      '<div style="background:#FFFF00;border:2px solid #111;color:#111;font-weight:700;line-height:1.55;padding:10px;font-size:0.9rem">' +
      footBody +
      "</div>" +
      chongunBox +
      applyBlock +
      chongApply +
      '<div style="margin-top:8px;line-height:1.5;font-size:0.9rem;font-weight:800;color:#FF1493">' +
      esc(en ? FOOT_FOOTER_EN : FOOT_FOOTER) +
      "</div>" +
      (en
        ? '<div style="margin-top:12px;line-height:1.5;font-size:0.8rem;color:#555">' +
          esc(DISCLAIMER_EN) +
          "</div>"
        : "") +
      "</div>";

    return (
      '<div class="notranslate" translate="no">' + warnBox + footBox + "</div>"
    );
  }

  window.enSumRoutine = function enSumRoutine(ctx) {
    ctx = ctx || {};
    const nS = ctx.nS || [];
    const nG = ctx.nG || [];
    const bS = ctx.bS || [];
    const bG = ctx.bG || [];
    const hasB = !!ctx.hasB;
    const lang = ctx.lang === "ko" ? "ko" : "en";
    const parts = [];
    const oh = buildOhang(ctx.ohang, lang);
    if (oh) parts.push(oh);
    const detail = buildNameDetail(nS, nG, lang);
    if (detail) parts.push(detail);
    const birth = buildBirth(bS, bG, hasB, lang);
    if (birth) parts.push(birth + " " + buildSajuFlow(nS, nG, bS, bG, lang));
    const vs = buildNameVsSaju(nS, nG, bS, bG, hasB, lang);
    if (vs) parts.push(vs);
    const tp = buildTurningPoints(nS, nG, bS, bG, hasB, lang);
    if (tp) parts.push(tp);
    const wrap = buildWrap(nS, nG, lang);
    if (wrap) parts.push(wrap);
    const narr = parts.length
      ? '<div class="en-sum-narr notranslate" translate="no">' +
        parts.join("<br><br>") +
        "</div>"
      : "";
    const warn = warningFootnoteHtml(nS, nG, lang);
    window.__enWarnHtml = warn;
    return { ageText: narr, warnHtml: warn };
  };
})();
