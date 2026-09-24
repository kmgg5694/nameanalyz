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
    return strip(ns.data.name || "");
  }
  function gweDisplayName(g, lang) {
    if (!g || !g.name) return "";
    return strip(g.name);
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
    early: "1–23",
    prime: "24–40",
    mid: "41–55",
    late: "56+ (whole life)",
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
    return OH_EN[el] ? OH_EN[el] + "(" + el + ")" : String(el || "");
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
    if (dom) {
      bits.push(
        "Center energy is " +
          elName(dom) +
          " — " +
          (MID_TRAIT[dom] || "mixed") +
          "."
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
    { n: 34, name: "재앙연속" },
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

  /** 수리·주역명은 영어 UI에서도 우리 원어(한글) 그대로. 문장만 영어. */
  function suriLab(n, koName) {
    return suriLabel(n, koName);
  }
  function hexLab(koName) {
    return strip(koName);
  }

  const FOOT_CHONGUN_DAN_EN =
    "If the name's overall destiny (Late, whole life) holds 26 영웅풍파 or 28 파란풍파, most die young. For women, many are widowed through separation or bereavement.";
  const FOOT_CHONGUN_CANCER_EN =
    "Does a name's energy bring cancer? When the overall destiny holds 이산파멸, 백사실패 or 중도좌절, cancer is common in most cases.";
  const FOOT_SURI20_22_EN =
    "Numbers more fearsome than 14 이산파멸 — 20 백사실패 and 22 중도좌절: cancer is common in most cases. In the overall destiny these numbers bring a sharp mind, big ambition and strong drive; some succeed hugely for a time, become a major figure or grow very rich, but cannot keep it to the end and midway meet failure, bankruptcy, accidents, illness, cancer, surgery, prison or an early death. However, if the hexagram below is 수풍정 or 수택절, 20 백사실패 is read as great wealth and great honor. When 20 forms any one of 수택절, 수풍정, 지택림 or 뇌택귀매, the person lives wealthy, long-lived and honored — provided the birth chart is at least average.";
  const FOOT_FOOTER_EN =
    "If your name holds any of the numbers or hexagrams above, there is no alternative but a name change!!!";

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
              labels[i] + " " + paintRed(suriLab(num, FOOT_SURI[j].name))
            );
          }
        }
      }
      const ng = nG[i];
      if (ng && ng.name) {
        for (let j = 0; j < FOOT_HEX.length; j++) {
          if (hexNameStarts(ng, FOOT_HEX[j])) {
            hits.push(labels[i] + " " + paintRed(hexLab(FOOT_HEX[j])));
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
        "Pressing-down hexagrams in the name: " + joinMarks(help) + "."
      );
    }
    return bits.join(" ");
  }

  function buildWrap(nS, nG) {
    if (sideBad(nS, nG, I.late)) {
      return (
        "A name is a three-syllable daily prayer. If that prayer asks for hardship, change it. " +
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
      return suriLab(s.n, s.name);
    }).join(", ");
    const warnHex = WARN_JANG_HEX.map(function (h) {
      return hexLab(h);
    }).join(", ");
    const footSuri = FOOT_SURI.map(function (s) {
      return suriLab(s.n, s.name);
    }).join(", ");
    const footHex = FOOT_HEX.map(function (h) {
      return hexLab(h);
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
          ? ". It easily leads into a desperate situation — please consider a name change seriously."
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
        ", you will face a desperate situation."
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
      "</div></div>";

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
