/**
 * English overall reading — brief narrate then Warning/Footnotes.
 * Order: 오행 → 탄생일 → 이름↔사주 → 마무리 → 경고장·각주
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

  const AGE = {
    early: "Ages 1–23",
    prime: "Ages 24–40",
    mid: "Ages 41–55",
    late: "Ages 56+ (whole life)",
  };
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

  function elName(el) {
    return OH_EN[el] ? OH_EN[el] + " (" + el + ")" : String(el || "");
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

  /** Short Five Elements — same idea as Korean 오행 first */
  function buildOhang(oh) {
    if (!oh) return "";
    const counts = oh.counts || {};
    const dom = oh.dominant || "";
    const up = oh.lastRep || "";
    const me = oh.firstRep || "";
    const dn = oh.middleRep || me;
    const bits = [];
    bits.push(
      "Five Elements show how you relate to people. " +
        paintBlue("Generating") +
        " = smooth help; " +
        paintRed("Controlling") +
        " = friction. Counts: Wood " +
        (counts["木"] || 0) +
        " · Fire " +
        (counts["火"] || 0) +
        " · Earth " +
        (counts["土"] || 0) +
        " · Metal " +
        (counts["金"] || 0) +
        " · Water " +
        (counts["水"] || 0) +
        "."
    );
    if (me) {
      bits.push(
        "You (center of the name): " +
          elName(me) +
          " — " +
          (MID_TRAIT[me] || "mixed") +
          "."
      );
    }
    if (dom && dom !== me) {
      bits.push(
        "Dominant element: " + elName(dom) + " (" + (counts[dom] || 0) + "x)."
      );
    }
    if (up && me) {
      const d = dirUp(up, me);
      let line = "Above (parents · seniors · partner): ";
      if (d === "recv_gen") line += paintBlue("you receive support") + ".";
      else if (d === "give_gen") line += paintBlue("you give support") + ".";
      else if (d === "recv_ctrl") line += paintRed("pressure from above") + ".";
      else if (d === "give_ctrl") line += paintRed("you push against above") + ".";
      else if (d === "same") line += "same element — calm but flat.";
      else line += elName(up) + " · " + elName(me) + ".";
      bits.push(line);
    }
    if (me && dn && dn !== me) {
      const d = dirDn(me, dn);
      let line = "Below (juniors · children): ";
      if (d === "give_gen") line += paintBlue("you give support") + ".";
      else if (d === "recv_gen") line += paintBlue("you receive support") + ".";
      else if (d === "give_ctrl") line += paintRed("you press down") + ".";
      else if (d === "recv_ctrl") line += paintRed("pressure from below") + ".";
      else if (d === "same") line += "same element — calm but flat.";
      else line += elName(me) + " · " + elName(dn) + ".";
      bits.push(line);
    }
    return bits.join(" ");
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


  function buildBirth(bS, bG, hasB, lang) {
    if (!hasB || !bS || !bS.length) return "";
    const lines = [];
    lines.push(
      "Birth chart shows how you were meant to live, stage by stage:"
    );
    for (let i = 0; i < 4; i++) {
      const marks = allMarks(bS, bG, i, lang);
      if (marks.length) {
        lines.push(AGE[AGE_KEYS[i]] + ": " + joinMarks(marks) + ".");
      }
    }
    return lines.join(" ");
  }

  function buildNameVsSaju(nS, nG, bS, bG, hasB, lang) {
    const bits = [];
    bits.push(
      "With that life path set, does the name energy help — or hurt — the birth chart?"
    );
    const lateM = allMarks(nS, nG, I.late, lang);
    if (lateM.length) {
      bits.push(
        "Overall destiny, " + AGE.late + ": " + joinMarks(lateM) + "."
      );
    }
    if (hasB && sideBad(nS, nG, I.late) && sideBad(bS, bG, I.late)) {
      bits.push(
        paintRed(
          "Worst pairing: name misfortune meets birth-chart misfortune."
        )
      );
    } else if (sideBad(nS, nG, I.late)) {
      bits.push(
        paintRed(
          "The name presses the lifetime path — a change is strongly advised."
        )
      );
    } else if (sideGood(nS, nG, I.late)) {
      bits.push(paintBlue("The name supports the overall path."));
    }
    for (let i = 0; i < 3; i++) {
      const bad = badMarks(nS, nG, i, lang);
      if (bad.length) {
        bits.push(AGE[AGE_KEYS[i]] + " risk: " + joinMarks(bad) + ".");
      }
    }
    const help = [];
    for (let i = 0; i < 4; i++) {
      if (nG[i] && isMitigate(nG[i])) help.push(gweNameHtml(nG[i], lang));
    }
    if (help.length) {
      bits.push(
        "Protective hexagrams in the name (offset the risk): " + joinMarks(help) + "."
      );
    }
    return bits.join(" ");
  }

  function buildWrap(nS, nG) {
    if (sideBad(nS, nG, I.late)) {
      return (
        "Your name works like a prayer you hear every day. If it calls for hardship, a change is worth considering. " +
        "Details: tap underlined items in Reading Summary; see Warning Board below."
      );
    }
    return (
      "Tap underlined items in Reading Summary for details. " +
      "Warning Board lists the most serious patterns."
    );
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
    const oh = buildOhang(ctx.ohang);
    if (oh) parts.push(oh);
    const birth = buildBirth(bS, bG, hasB, lang);
    if (birth) parts.push(birth);
    const vs = buildNameVsSaju(nS, nG, bS, bG, hasB, lang);
    if (vs) parts.push(vs);
    const wrap = buildWrap(nS, nG);
    if (wrap) parts.push(wrap);
    const narr = parts.length
      ? '<div class="en-sum-narr notranslate" translate="no">' +
        parts.join("<br><br>") +
        "</div>"
      : "";
    return { ageText: narr + warningFootnoteHtml(nS, nG, lang) };
  };
})();
