/* 요약보기 — 나이대 서술형 해설 + 이름·사주 주역괘 결론 (원본 d6/Ee 비침범) */
(function () {
  const CS = () => window.__CORE_SUMMARIES__ || { suri: {}, hex: {} };
  const NAR = () => window.__NARRATE__ || { suri: {}, hex: {} };

  function strip(s) {
    return String(s || "")
      .replace(/\([^)]*\)/g, "")
      .replace(/\s+/g, " ")
      .trim();
  }

  const C_RED = "#FF0000";
  const C_BLUE = "#0000FF";
  const C_BLACK = "#1c1917";

  function esc(s) {
    return String(s || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function paint(s, color) {
    return (
      '<span style="color:' +
      color +
      ';font-weight:700">' +
      esc(s) +
      "</span>"
    );
  }

  function paintRed(s) {
    return paint(s, C_RED);
  }

  function paintBlue(s) {
    return paint(s, C_BLUE);
  }

  /** kind: 'bad'|'goodHex'|'goodSuri'|'neutral' — 길 수리·길 괘 모두 파랑(인쇄) */
  function paintName(text, kind) {
    let color = C_BLACK;
    if (kind === "bad") color = C_RED;
    else if (kind === "goodHex" || kind === "goodSuri") color = C_BLUE;
    return (
      '<span style="color:' +
      color +
      ';font-weight:700">' +
      esc(text) +
      "</span>"
    );
  }

  function suriKind(ns) {
    if (!ns || !ns.data) return "neutral";
    if (suriBad(ns.data)) return "bad";
    if (suriGood(ns.data)) return "goodSuri";
    return "neutral";
  }

  function plainSuriName(ns) {
    if (!ns || ns.suri == null || !ns.data) return "";
    return strip(ns.data.name);
  }

  /** 인쇄: `{num}, {name}` 색칠 */
  function suriPhrase(ns) {
    if (!ns || ns.suri == null || !ns.data) return "";
    const nm = plainSuriName(ns);
    const head = nm ? ns.suri + ", " + nm : String(ns.suri);
    return paintName(head, suriKind(ns));
  }

  /** 수리명 HTML — 인쇄 형식과 동일 */
  function suriNameHtml(ns) {
    return suriPhrase(ns);
  }

  /** 주역괘명만 (길괘/흉괘 라벨 없음) */
  function gweNameHtml(g) {
    if (!g || !g.name) return "";
    const nm = strip(g.name);
    let kind = "neutral";
    if (gweBad(g)) kind = "bad";
    else if (gweGood(g)) kind = "goodHex";
    if (kind === "bad" && g.redN > 0 && g.redN < nm.length) {
      return paintName(nm.slice(0, g.redN), "bad") + paintName(nm.slice(g.redN), "neutral");
    }
    return paintName(nm, kind);
  }

  /** 「길」「흉」 표시어에 색 */
  function colorGilHyung(s) {
    return String(s || "")
      .replace(/「길」/g, paintBlue("「길」"))
      .replace(/「흉」/g, paintRed("「흉」"));
  }

  /** 결론 등 평문용 — 남은 표시어도 색 */
  function colorMarks(s) {
    return colorGilHyung(s)
      .replace(/청색길괘/g, paintBlue("청색길괘"))
      .replace(/길괘/g, paintBlue("길괘"))
      .replace(/흉괘/g, paintRed("흉괘"))
      .replace(/흉수/g, paintRed("흉수"));
  }

  function suriBad(d) {
    return !!d && (d.type === "taboo" || d.type === "caution" || d.type === "bad");
  }

  function suriGood(d) {
    return !!d && (d.type === "best" || d.type === "good");
  }

  function gweNameOf(g) {
    return g && g.name ? strip(g.name) : "";
  }

  function isHwagtaekGyu(g) {
    const n = gweNameOf(g).replace(/\s+/g, "");
    return n.indexOf("화택규") >= 0;
  }

  function isHwasumije(g) {
    const n = gweNameOf(g).replace(/\s+/g, "");
    return n.indexOf("화수미제") >= 0;
  }

  /** 재물운 해당 괘 (hex-fortune 재물운 · 뇌천대장=재물 보흘 지정) */
  const WEALTH_FORTUNE_HEX = [
    "화천대유",
    "화수미제",
    "수풍정",
    "산천대축",
    "이위화",
    "뇌천대장",
  ];

  function isWealthFortuneHex(g) {
    if (!g || !g.name) return false;
    const n = gweNameOf(g);
    for (let i = 0; i < WEALTH_FORTUNE_HEX.length; i++) {
      const h = WEALTH_FORTUNE_HEX[i];
      if (n === h || n.indexOf(h) === 0) return true;
    }
    return false;
  }

  /** ages 배열 [말년,초년,장년,중년] 기준 — 시간순 직전 인덱스 */
  function chronoPrevAgeIdx(ageIdx) {
    if (ageIdx === 2) return 1; // 장년 ← 초년
    if (ageIdx === 3) return 2; // 중년 ← 장년
    if (ageIdx === 0) return 3; // 말년 ← 중년
    return -1; // 초년: 직전 없음
  }

  function gweAtAge(gArr, ages, ageName) {
    if (!gArr || !ages) return null;
    const i = ages.indexOf(ageName);
    return i >= 0 ? gArr[i] : null;
  }

  function gweBad(g) {
    return !!(g && g.isTaboo);
  }

  function gweGood(g) {
    return !!(g && g.isBest);
  }

  /** 검정(중성) 보통 괘 — 길로 세지 않음 (보흘 지정) */
  function gweBlack(g) {
    return !!(g && g.name) && !gweGood(g) && !gweBad(g);
  }

  /** 흉수리 + 검정 괘가 같은 자리인지 */
  function hasBadSuriBlackHex(ns, ng) {
    return !!(ns && ns.data && suriBad(ns.data) && gweBlack(ng));
  }

  /**
   * 흉수리 + 눌러 주는 기운(화수미제·화천대유·이위화·산천대축·뇌천대장·화풍정·수풍정)
   * → 흉수리 기능 상실, 길괘 영향 배가. 길흉 섞임으로 분류하지 않음. 재물운이면 재물운 명시 (보흘 지정)
   */
  function hasBadSuriMitigateHex(ns, ng) {
    return !!(ns && ns.data && suriBad(ns.data) && isMitigateSuriHex(ng));
  }

  /** 보흘 지정: 웬만한 흉수리를 눌러 주고 더 좋아지는 경우가 많은 괘 */
  const HEX_MITIGATE_SURI = [
    "이위화",
    "화풍정",
    "화천대유",
    "화수미제",
    "산천대축",
    "수풍정",
    "뇌천대장",
  ];

  /** 경고장에 적힌 흉수리 (해설 가중·요절 판정용 — 9·34 등 포함) */
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

  /** 경고장에 적힌 흉괘 (해설 가중·요절 판정용) */
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

  /** 각주 자료(보흘 인쇄물) — 화면 노란 칸 표기용 */
  const FOOTNOTE_WARN_SURI = [
    { n: 10, name: "만사허망" },
    { n: 12, name: "박약박복" },
    { n: 14, name: "이산파멸" },
    { n: 20, name: "백사실패" },
    { n: 22, name: "중도좌절" },
    { n: 26, name: "영웅풍파" },
    { n: 28, name: "파란풍파" },
  ];
  const FOOTNOTE_WARN_HEX = [
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
  const FOOTNOTE_WARN_FOOTER =
    "이름 속에 위와 같은 수리 혹은 주역괘가 있다면 개명 외엔 대안이 없다~!!!";

  /** 각주 — 이름 총운(말년) 특례 (보흘 지정) */
  const FOOTNOTE_CHONGUN_DANMYEONG =
    "이름 총운에 26 영웅풍파, 28 파란풍파가 있으면 대부분 단명한다. 여자의 경우 이별·사별로 과부가 많다.";
  const FOOTNOTE_CHONGUN_CANCER =
    "이름 기운 때문에 암이 오는가? 이름 총운에 이산파멸, 백사실패, 중도좌절이 오면 대부분 암이 많다.";
  /** 각주 — 20·22가 14보다 무섭다는 특례 (보흘 지정) */
  const FOOTNOTE_SURI20_22 =
    "14 이산파멸보다 더 무서운수리 - 20 백사실패, 22 중도좌절 : 대부분 암이 많다. 총운에 이 운세의 특징은 머리가 좋고 배포가 크며 강한 추진력으로 한때 크게 성공하거나 거물이 되거나 큰 부자가 되기도 하지만 그걸 끝까지 지키지 못하고 중도에 실패, 파산, 사고, 병고, 암, 수술, 감옥, 단명등을 겪게 된다. 하지만 그 아래 주역괘가 수풍정, 수택절이 오면 20 백사실패는 대부대귀로 해석한다. 20수리에 수택절, 수풍정, 지택림, 뇌택귀매 중에 하나가 만들어지면 부자로 살면서 장수, 부귀한다. 단, 사주가 보통 이상이어야 한다.";

  /** 20 백사실패 → 부자·장수·부귀로 읽는 괘 (보흘 지정) */
  const HEX_SURI20_WEALTH = ["수택절", "수풍정", "지택림", "뇌택귀매"];

  function isChongunDanmyeongSuri(ns) {
    if (!ns || ns.suri == null) return false;
    const n = Number(ns.suri);
    return n === 26 || n === 28;
  }

  function isChongunCancerSuri(ns) {
    if (!ns || ns.suri == null) return false;
    const n = Number(ns.suri);
    return n === 14 || n === 20 || n === 22;
  }

  function isSuri20Or22(ns) {
    if (!ns || ns.suri == null) return false;
    const n = Number(ns.suri);
    return n === 20 || n === 22;
  }

  function isSuri20WealthHex(g) {
    if (!g || !g.name) return false;
    for (let i = 0; i < HEX_SURI20_WEALTH.length; i++) {
      if (hexNameStarts(g, HEX_SURI20_WEALTH[i])) return true;
    }
    return false;
  }

  /** 사주 보통 이상: 길 기운 개수 ≥ 흉 기운 개수. 사주 없으면 null */
  function isSajuOrdinaryOrBetter(bdS, bdG, hasB) {
    if (!hasB) return null;
    let good = 0;
    let bad = 0;
    const ss = bdS || [];
    const gg = bdG || [];
    for (let i = 0; i < 4; i++) {
      if (ss[i] && ss[i].data) {
        if (suriGood(ss[i].data)) good++;
        else if (suriBad(ss[i].data)) bad++;
      }
      if (gg[i]) {
        if (gweGood(gg[i])) good++;
        else if (gweBad(gg[i])) bad++;
      }
    }
    return good >= bad;
  }

  /** 20 + 수택절·수풍정·지택림·뇌택귀매 → 대부대귀·부자장수 (사주 보통 이상) */
  function suri20WealthHexNote(ns, ng, sajuOrdinary) {
    if (!ns || ns.suri == null || Number(ns.suri) !== 20) return "";
    if (!isSuri20WealthHex(ng)) return "";
    if (sajuOrdinary === false) return "";
    const plain = gweNameOf(ng);
    const hexPart = gweNameHtml(ng) + josaIGA(plain);
    let t =
      " 그 아래에 " +
      hexPart +
      " 있어 ";
    if (hexNameStarts(ng, "수풍정") || hexNameStarts(ng, "수택절")) {
      t += "20 백사실패를 대부대귀로 해석하며, ";
    }
    t += "부자로 살면서 장수·부귀하는 기운으로 읽습니다.";
    if (sajuOrdinary == null) {
      t += " 단, 사주가 보통 이상이어야 합니다.";
    }
    return t;
  }

  /** 총운(말년) 수리 각주 적용 문구 */
  function chongunFootnoteNote(ns, ng, sajuOrdinary) {
    if (!ns || !ns.data) return "";
    if (isChongunDanmyeongSuri(ns)) return " " + FOOTNOTE_CHONGUN_DANMYEONG;
    if (Number(ns.suri) === 20 && isSuri20WealthHex(ng) && sajuOrdinary !== false) {
      return suri20WealthHexNote(ns, ng, sajuOrdinary);
    }
    if (isSuri20Or22(ns)) return " " + FOOTNOTE_SURI20_22;
    if (isChongunCancerSuri(ns)) return " " + FOOTNOTE_CHONGUN_CANCER;
    return "";
  }

  /** 한글·한문 총운에 해당 수리가 있으면 적용 문장 목록 */
  function collectChongunFootnoteNotes(nmS, nmG, hjS, hjG, hasHanja, sajuOrdinary) {
    const notes = [];
    let dan = false;
    let can = false;
    let s2022 = false;
    let wealth20 = false;
    function scan(ns, ng) {
      if (isChongunDanmyeongSuri(ns)) dan = true;
      const n = ns && ns.suri != null ? Number(ns.suri) : NaN;
      if (n === 20 && isSuri20WealthHex(ng) && sajuOrdinary !== false) {
        wealth20 = true;
      } else if (isSuri20Or22(ns)) {
        s2022 = true;
      } else if (isChongunCancerSuri(ns)) {
        can = true;
      }
    }
    scan(nmS && nmS[0], nmG && nmG[0]);
    if (hasHanja) scan(hjS && hjS[0], hjG && hjG[0]);
    if (dan) notes.push(FOOTNOTE_CHONGUN_DANMYEONG);
    if (s2022) notes.push(FOOTNOTE_SURI20_22);
    if (can) notes.push(FOOTNOTE_CHONGUN_CANCER);
    if (wealth20) {
      notes.push(
        "20 백사실패 아래에 수택절·수풍정·지택림·뇌택귀매 중 하나가 있어 대부대귀·부자장수·부귀로 해석합니다." +
          (sajuOrdinary == null ? " 단, 사주가 보통 이상이어야 합니다." : "")
      );
    }
    return notes;
  }

  function isMitigateSuriHex(g) {
    if (!g || !g.name) return false;
    const n = gweNameOf(g);
    for (let i = 0; i < HEX_MITIGATE_SURI.length; i++) {
      const h = HEX_MITIGATE_SURI[i];
      if (n === h || n.indexOf(h) === 0) return true;
    }
    return false;
  }

  /** 말년(총운, idx 0)의 눌러 주는 괘 목록 — arrs: [[수리배열, 괘배열], ...] */
  function malPressHexes(arrs) {
    const out = [];
    const seen = {};
    arrs.forEach(function (a) {
      const g = a[1] && a[1][0];
      if (!isMitigateSuriHex(g)) return;
      const n = gweNameOf(g);
      if (seen[n]) return;
      seen[n] = true;
      out.push({ name: n, html: gweNameHtml(g) });
    });
    return out;
  }
  function pressHtml(list) {
    return list.map(function (x) { return x.html; }).join("·");
  }

  function isFootnoteWarnSuri(ns) {
    if (!ns || ns.suri == null) return false;
    const num = Number(ns.suri);
    for (let i = 0; i < FOOTNOTE_WARN_SURI.length; i++) {
      if (FOOTNOTE_WARN_SURI[i].n === num) return true;
    }
    return false;
  }

  function isFootnoteWarnHex(g) {
    if (!g || !g.name) return false;
    const n = gweNameOf(g);
    for (let i = 0; i < FOOTNOTE_WARN_HEX.length; i++) {
      const h = FOOTNOTE_WARN_HEX[i];
      if (n === h || n.indexOf(h) === 0) return true;
    }
    return false;
  }

  /** 각주 목록이 이 시기·이름에 있으면 해설에 적용 */
  function footnoteApplyNote(ns, ng, sajuOrdinary) {
    const bits = [];
    // 20 + 부자장수 괘면 절망 각주 대신 완화 특례가 우선
    if (
      ns &&
      Number(ns.suri) === 20 &&
      isSuri20WealthHex(ng) &&
      sajuOrdinary !== false
    ) {
      return "";
    }
    if (ns && ns.data && isFootnoteWarnSuri(ns)) {
      const plain = plainSuriName(ns);
      let extra = "";
      if (isSuri20Or22(ns)) {
        extra =
          " 14 이산파멸보다 더 무서운 수리로, 대부분 암이 많으며 중도 실패·파산·사고·병고·수술·감옥·단명 등을 겪기 쉽습니다.";
      }
      bits.push(
        " 각주에서 경계하는 " +
          suriPhrase(ns) +
          josaIGA(plain) +
          " 이 시기에 들어 있어 절망적 상황에 처하기 쉽습니다." +
          extra
      );
    }
    if (ng && isFootnoteWarnHex(ng)) {
      const plain = gweNameOf(ng);
      bits.push(
        " 각주에서 경계하는 " +
          gweNameHtml(ng) +
          josaIGA(plain) +
          " 이 시기에 자리하여 절망적 상황에 처하기 쉽습니다."
      );
    }
    return bits.join("");
  }

  function slotComboNotes(ns, ng, bdNs, bdNg, sajuOrdinary, ageKey) {
    return (
      hwagtaekBadSuriNote(ns, ng) +
      badSuriBlackHexNote(ns, ng) +
      suriMitigateByHexNote(ns, ng, bdNs, bdNg, sajuOrdinary, ageKey) +
      footnoteApplyNote(ns, ng, sajuOrdinary)
    );
  }

  /**
   * 보흘 지정: 검정(중성) 괘는 길로 보지 않는다.
   * 흉수리가 위에 있으면 그 괘의 단점이 더 드러난다.
   * 예: 이산파멸+화산려 → 이산(가족 헤어짐)+역마 → 더 불안·힘든 생활 (길·길흉섞임 금지)
   */
  const BLACK_HEX_WEAK_UNDER_BAD = {
    화산려:
      "여행·이동의 불안정과 고생·걱정이 더 커지고, 역마살을 타고 객지를 떠돌며 불안하고 힘든 생활이 되기 쉽습니다.",
    뇌지예:
      "치밀하고 꼼꼼한 참모형이라 보좌역은 잘 하지만, 사장·회장감은 못 되는 단점이 더 드러납니다.",
    수택절:
      "절제·통제하지 않으면 건강·재정 등이 무너지는 단점이 더 드러납니다.",
    뇌풍항:
      "한 가지 일에 매몰되어 바쁘기만 하고 주변을 돌아볼 여유가 없는 단점이 더 드러납니다.",
    진위뢰:
      "소리만 요란하고 손에 든 것이 없는 외화내빈의 단점이 더 두드러집니다.",
    화뢰서합:
      "말은 조리 있게 잘하지만 독설을 하고 타협할 줄 몰라 늘 시비·구설수를 달고 다니는 단점이 더 드러납니다.",
  };
  /** 보흘 지정: 27 대인격 + 화뢰서합 */
  const SEOHAP_27 =
    "대인격의 센 고집과 자존심을 화뢰서합의 조리 있는 말솜씨로 풀어 상대를 설득해 내 뜻을 이루는 힘도 있지만, 서합은 독설을 하고 타협할 줄 모르는 기운이라 늘 시비·구설수를 달고 다니게 됩니다.";

  /** 검정 보통 괘의 장·단점 — 길괘가 아니라 검정인 이유 (보흘 지정) */
  const BLACK_HEX_TRAIT = {
    뇌지예: "참모형으로 치밀하고 꼼꼼하여 보좌역은 잘 하지만 사장·회장감은 아닙니다.",
    수택절: "절제·통제하지 않으면 건강·재정 등이 무너지는 기운입니다.",
    화산려: "역마살이 들어 객지에서 고생을 하지만, 영업 파트인 사람은 바쁘게 돌아다니면 재물이 되고 해외로도 진출합니다.",
    뇌풍항: "한 가지 일에 매몰되니 바쁘고 주변을 돌아볼 여유가 없습니다.",
    화뢰서합: "말을 잘하는 기운이지만 늘 구설을 달고 다닙니다.",
  };
  function blackHexTrait(g) {
    if (!gweBlack(g)) return "";
    const keys = Object.keys(BLACK_HEX_TRAIT);
    for (let i = 0; i < keys.length; i++) {
      if (hexNameStarts(g, keys[i])) return BLACK_HEX_TRAIT[keys[i]];
    }
    return "";
  }

  /** 흉수리 + 검정 보통 괘 — 짧은 해설 (중심·변곡점용) */
  function blackWeakShort(ns, ng) {
    if (!hasBadSuriBlackHex(ns, ng) || isMitigateSuriHex(ng)) return "";
    if (Number(ns.suri) === 20 && isSuri20WealthHex(ng)) return "";
    if (Number(ns.suri) === 27 && hexNameStarts(ng, "화뢰서합")) return SEOHAP_27;
    const keys = Object.keys(BLACK_HEX_WEAK_UNDER_BAD);
    for (let i = 0; i < keys.length; i++) {
      if (hexNameStarts(ng, keys[i])) return BLACK_HEX_WEAK_UNDER_BAD[keys[i]];
    }
    return "";
  }

  function badSuriBlackHexNote(ns, ng) {
    if (!hasBadSuriBlackHex(ns, ng)) return "";
    if (isMitigateSuriHex(ng)) return "";
    if (isWarnJangHex(ng)) return "";
    const num = ns.suri != null ? Number(ns.suri) : NaN;
    // 14+풍수환은 suriMitigateByHexNote 특례
    if (num === 14 && hexNameStarts(ng, "풍수환")) return "";
    // 20+수택절 등은 대부대귀 특례
    if (num === 20 && isSuri20WealthHex(ng)) return "";

    const plain = gweNameOf(ng);
    const hexPart = gweNameHtml(ng) + josaIGA(plain);
    const sName = plainSuriName(ns) || "흉수리";

    if (num === 14 && hexNameStarts(ng, "화산려")) {
      return (
        " 같은 시기에 「이산파멸」과 「화산려」가 겹치면, 이산으로 가족과 헤어지고 역마살을 타 더욱 불안하고 힘든 생활을 한다고 보아야 합니다. 검정 보통 괘를 길로 보거나 길·흉이 섞였다고 하면 안 됩니다. 「화산려」의 단점인 여행·이동의 불안정과 고생·걱정이 「이산파멸」 때문에 더 드러납니다."
      );
    }

    if (num === 27 && hexNameStarts(ng, "화뢰서합")) {
      return (
        " 같은 시기에 「대인격」과 「화뢰서합」이 겹치면, " +
        SEOHAP_27 +
        " 검정 보통 괘를 길로 보거나 길·흉이 섞였다고 하면 안 됩니다."
      );
    }

    let weak = "";
    const keys = Object.keys(BLACK_HEX_WEAK_UNDER_BAD);
    for (let i = 0; i < keys.length; i++) {
      const k = keys[i];
      if (hexNameStarts(ng, k)) {
        weak = BLACK_HEX_WEAK_UNDER_BAD[k];
        break;
      }
    }

    let t =
      " 그 아래에 검정 보통 괘 " +
      hexPart +
      " 있으나 길로 보면 안 됩니다. 위에 「" +
      sName +
      "」 흉수리가 있어 그 괘의 단점이 더 드러납니다.";
    if (weak) t += " " + weak;
    return t;
  }

  /** 보흘 지정: 화택규 + 같은 시기 흉수리 → 추락·낙상·교통사고 */
  function hwagtaekBadSuriNote(ns, ng) {
    if (!isHwagtaekGyu(ng) || !ns || !ns.data || !suriBad(ns.data)) return "";
    const sName = plainSuriName(ns) || "흉수리";
    return (
      " 같은 시기에 「화택규」와 「" +
      sName +
      "」가 겹치면 추락·낙상사고·교통사고로 뼈를 크게 다치는 사고가 나기 쉽습니다."
    );
  }

  /** 보흘 지정: 특정 괘 해설 보강 (원본 Ee 비침범) */
  const HEX_SPECIAL_NOTES = {
    산화비:
      " 관운·승진운·재물운·건강운에 좋고, 화려한 업종 즉 패션·디자인·연예·방송·모델·예술·유흥업 관련 업종에 해당됩니다.",
    태위택:
      " 언변이 좋고, 미식가가 많다. 말을 잘 하는 기운이라 영업·보험·상담 일에 잘 맞는다. 같은 기운으로 화뢰서합이 있다.",
    화뢰서합:
      " 언변이 좋고, 미식가가 많다. 말을 잘 하는 기운이라 영업·보험·상담 일에 잘 맞는다. 같은 기운으로 태위택이 있다.",
    화산려:
      " 역마살로 여기저기 돌아다니며 발품을 팔아 벌어 먹는 기운이다. 사업·무역·외근·보험 등 발품 직업에 맞는다.",
    진위뢰:
      " 소리만 요란하고 정작 손에 든 것이 없는 외화내빈의 상태입니다.",
    화택규:
      " 천추원한 백골혼으로, 추락·낙상사고·교통사고로 뼈를 크게 다치는 기운입니다. 화택규의 질병은 뼈를 크게 다친다거나(목·허리 등 모든 디스크·관절이 전부 포함됩니다) 기관지를 조심하셔야 합니다.",
  };

  function hexSpecialNote(ng) {
    if (!ng || !ng.name) return "";
    const n = gweNameOf(ng);
    const keys = Object.keys(HEX_SPECIAL_NOTES);
    for (let i = 0; i < keys.length; i++) {
      const k = keys[i];
      if (n === k || n.indexOf(k) === 0) return HEX_SPECIAL_NOTES[k];
    }
    return "";
  }

  /** 초년·장년만 재물 「몇 배·대박」 표현. 중년은 짧은 시기라 낮춤 (보흘 지정) */
  function isStrongWealthAge(ageKey) {
    const a = String(ageKey || "");
    return a === "초년" || a === "장년";
  }

  function wealthTailByAge(ageKey) {
    if (isStrongWealthAge(ageKey)) {
      return " 그 괘의 본뜻이 재물이라 재물이 대박 나는 경우가 많습니다.";
    }
    if (String(ageKey || "") === "중년") {
      return " 그 괘의 본뜻이 재물이라 재물 기운에도 보탬이 됩니다. 다만 중년은 짧은 시기라 몇 배 대박까지는 말하기 조심스럽습니다.";
    }
    return " 그 괘의 본뜻이 재물이라 재물 기운에도 보탬이 됩니다.";
  }

  /** 보흘 지정: 화택규 직후 화수미제 → 재물 증폭 (초년·장년만 「몇 배」) */
  function hexSeqWealthBoostNote(ng, prevNg, ageKey) {
    if (!isHwasumije(ng) || !isHwagtaekGyu(prevNg)) return "";
    if (isStrongWealthAge(ageKey)) {
      return (
        " " +
        paintBlue(
          "직전에 「화택규」가 있어 「화수미제」의 재물을 몇 배나 키워 줍니다."
        )
      );
    }
    if (String(ageKey || "") === "중년") {
      return (
        " " +
        paintBlue(
          "직전에 「화택규」가 있어 「화수미제」의 재물 기운을 돋워 줍니다. 다만 중년은 짧은 시기라 몇 배 대박까지는 말하기 조심스럽습니다."
        )
      );
    }
    return (
      " " +
      paintBlue(
        "직전에 「화택규」가 있어 「화수미제」의 재물 기운을 돋워 줍니다."
      )
    );
  }

  function collectFootnoteHits(nmS, nmG, hjS, hjG, hasHanja, ages) {
    const hits = [];
    const ageNames = ages || ["말년", "초년", "장년", "중년"];
    function pushHit(who, age, kind, labelHtml) {
      hits.push({ who: who, age: age, kind: kind, labelHtml: labelHtml });
    }
    for (let i = 0; i < ageNames.length; i++) {
      const ag = ageNames[i];
      if (nmS[i] && isFootnoteWarnSuri(nmS[i]) && !isMitigateSuriHex(nmG[i])) {
        pushHit("한글이름", ag, "수리", suriPhrase(nmS[i]));
      }
      if (nmG[i] && isFootnoteWarnHex(nmG[i])) {
        pushHit("한글이름", ag, "주역", gweNameHtml(nmG[i]));
      }
      if (hasHanja) {
        if (hjS[i] && isFootnoteWarnSuri(hjS[i]) && !isMitigateSuriHex(hjG[i])) {
          pushHit("한자이름", ag, "수리", suriPhrase(hjS[i]));
        }
        if (hjG[i] && isFootnoteWarnHex(hjG[i])) {
          pushHit("한자이름", ag, "주역", gweNameHtml(hjG[i]));
        }
      }
    }
    return hits;
  }

  function footnoteHitsSummary(hits) {
    if (!hits || !hits.length) return "";
    const lines = hits.map(function (h) {
      return h.who + " " + h.age + " " + h.labelHtml;
    });
    return (
      paintRed("【각주 적용】") +
      " 이 이름에 각주 경계 항목이 들어 있습니다. (" +
      lines.join(", ") +
      ") 절망적 상황에 처하기 쉬우니 " +
      paintRed("개명 외엔 대안이 없다") +
      "고 보면 됩니다."
    );
  }

  function isWarnJangHex(g) {
    if (!g || !g.name) return false;
    const n = gweNameOf(g);
    for (let i = 0; i < WARN_JANG_HEX.length; i++) {
      const h = WARN_JANG_HEX[i];
      if (n === h || n.indexOf(h) === 0) return true;
    }
    return false;
  }

  function isWarnJangSuri(ns) {
    if (!ns || ns.suri == null) return false;
    const num = Number(ns.suri);
    for (let i = 0; i < WARN_JANG_SURI.length; i++) {
      if (WARN_JANG_SURI[i].n === num) return true;
    }
    return false;
  }

  function warnJangSuriLabel(ns) {
    if (!ns || ns.suri == null) return "";
    const num = Number(ns.suri);
    for (let i = 0; i < WARN_JANG_SURI.length; i++) {
      if (WARN_JANG_SURI[i].n === num) {
        return num + " " + WARN_JANG_SURI[i].name;
      }
    }
    return String(num);
  }

  function hexNameStarts(g, name) {
    if (!g || !g.name || !name) return false;
    const n = gweNameOf(g);
    return n === name || n.indexOf(name) === 0;
  }

  /** 같은 자리 수리·괘 조합 참고
   *  - 흉수리 + 눌러 주는 기운(파랑 길괘) → 흉 기능 상실·길괘 배가·재물 (길로 봄, 길흉 섞임 금지)
   *  - 흉수리 + 검정 보통 괘(예: 14 이산파멸 + 풍수환) → 괘 본뜻이 파멸에 방해받아 피해
   *    · 같은 시기 사주에 흉수리·흉괘 있으면 피해 가중
   *  - 경고장 흉수리 + 경고장 흉괘(빨강) → 수리 기운 가중·위태 (14는 요절)
   *  bdNs/bdNg = 같은 나이대 탄생일(사주) 수리·괘
   */
  function suriMitigateByHexNote(ns, ng, bdNs, bdNg, sajuOrdinary, ageKey) {
    if (!ns || !ns.data) return "";
    const num = ns.suri != null ? Number(ns.suri) : NaN;
    const plain = ng && ng.name ? gweNameOf(ng) : "";
    const hexPart = ng && ng.name ? gweNameHtml(ng) + josaIGA(plain) : "";

    // 20 백사실패 + 수택절·수풍정·지택림·뇌택귀매 → 대부대귀·부자장수 (보흘 지정)
    const wealth20 = suri20WealthHexNote(ns, ng, sajuOrdinary);
    if (wealth20) return wealth20;

    // 9 대재무용 + 화천대유·산천대축·뇌천대장 → 아주 좋다 (보흘 지정)
    const good9 = suri9GoodHexNote(ns, ng);
    if (good9) return good9;

    // 흉수리(14) + 검정 보통 괘 해설: 이산파멸 아래 풍수환 (보흘 지정)
    // ※ 경고장 빨간 흉괘(가중·요절)와 다른 해설 방법
    if (num === 14 && hexNameStarts(ng, "풍수환") && !isMitigateSuriHex(ng)) {
      let t =
        " 그 아래에 " +
        hexPart +
        " 같은 보통 괘가 오면 급격한 환경의 변화로 새 판을 짜고, 사업의 변화·이사·이전 등이 파멸의 기운의 방해를 받아 피해를 보게 됩니다. 이 피해가 가장 큰 시기는 초년에는 15세, 장년에는 40세(±3세)이니 그전의 변화는 크게 받지 않습니다.";
      const sajuPeriodBad =
        !!(bdNs && bdNs.data && suriBad(bdNs.data)) ||
        !!(bdNg && gweBad(bdNg));
      if (sajuPeriodBad) {
        t +=
          " 그런데 그 시기에 사주에 흉수리나 흉괘가 있으면 그 피해가 더 커지게 됩니다.";
      }
      return t;
    }

    // 경고장 흉수리 + 경고장 흉괘 → 가중·위태 (눌러 주는 길괘·보통괘 특례가 아닐 때)
    if (isWarnJangSuri(ns) && isWarnJangHex(ng) && !isMitigateSuriHex(ng)) {
      // 풍수환은 위 보통괘 특례로 이미 처리(14만). 다른 수리+풍수환은 경고장 가중.
      const sLabel = warnJangSuriLabel(ns);
      let t =
        " 그 아래에 경고장의 " +
        hexPart +
        " 오면 " +
        sLabel +
        "이 말하는 것들이 가중되어 아주 위태로운 상황이 만들어집니다.";
      if (num === 14) {
        t += " 거의 요절 가능성이 많다 보면 됩니다.";
      }
      return t;
    }

    if (!suriBad(ns.data)) return "";
    if (!isMitigateSuriHex(ng)) return "";
    const wealthTail = wealthTailByAge(ageKey);
    const sName = plainSuriName(ns) || "흉수리";
    // 흉수리 + 눌러 주는 길괘 → 흉 기능 상실·길괘 배가 → 길로 봄. 재물운 괘면 재물운 명시 (보흘 지정)
    let lift =
      " 다만 같은 시기에 " +
      hexPart +
      " 같은 " +
      paintBlue("눌러 주는 기운") +
      "이 있어 「" +
      sName +
      "」의 흉은 기능이 상실되고 그 길괘의 영향력이 배가됩니다. 흉과 길이 섞였다고 분류하지 말고, 이 자리는 " +
      paintBlue("길") +
      "로 봅니다.";
    if (isWealthFortuneHex(ng)) {
      lift +=
        " 「" +
        plain +
        "」" +
        josaEunNeun(plain) +
        " " +
        paintBlue("재물운") +
        "이니 재물운으로 설명합니다.";
    }
    lift += " 그 수리의 단점이 장점으로 승화되어 장점은 더 좋아지고 흉은 지워집니다.";
    if (num === 14) {
      const keys = suriDetailKeywordsList(ns);
      const gone = keys
        ? keys.join("·") + " 등의 흉한 기운이 지워지고"
        : "이별이혼·사고감옥·자살단명·사건·사고·감옥·당뇨·암·질병·수술 등의 흉한 기운이 지워지고";
      return lift + " " + gone + " 오히려 더 좋아지며," + wealthTail;
    }
    return lift + wealthTail;
  }

  /** 받침 유무 → 이/가 */
  function josaIGA(word) {
    const ch = String(word || "")
      .replace(/[^가-힣]/g, "")
      .slice(-1);
    if (!ch) return "이";
    const code = ch.charCodeAt(0) - 0xac00;
    if (code < 0 || code > 11171) return "이";
    return code % 28 === 0 ? "가" : "이";
  }

  /** 은/는 */
  function josaEunNeun(word) {
    const ch = String(word || "")
      .replace(/[^가-힣]/g, "")
      .slice(-1);
    if (!ch) return "은";
    const code = ch.charCodeAt(0) - 0xac00;
    if (code < 0 || code > 11171) return "은";
    return code % 28 === 0 ? "는" : "은";
  }

  /** 으로/로 */
  function josaEuro(word) {
    const ch = String(word || "")
      .replace(/[^가-힣]/g, "")
      .slice(-1);
    if (!ch) return "으로";
    const code = ch.charCodeAt(0) - 0xac00;
    if (code < 0 || code > 11171) return "으로";
    const jong = code % 28;
    if (jong === 0 || jong === 8) return "로";
    return "으로";
  }

  /** shortDesc+desc 병합 — 포함 관계 우선, 둘 다 완결이면 ". ", 미완이면 공백 이음 */
  function mergeSuriText(shortDesc, desc) {
    const s = String(shortDesc || "").trim();
    const d = String(desc || "").trim();
    if (!s) return d;
    if (!d) return s;
    if (s === d) return s;
    if (d.indexOf(s) >= 0) return d;
    if (s.indexOf(d) >= 0) return s;
    const sDone = /[.。!?！？]\s*$/.test(s);
    const dDone = /[.。!?！？]\s*$/.test(d);
    if (sDone && dDone) {
      return s.replace(/[.\s]+$/, "") + ". " + d;
    }
    return (s + " " + d).replace(/\s+/g, " ").trim();
  }

  /** 핵심요약 core/short를 구술용으로 짧게 (한두 마디) */
  function briefCoreText(raw, maxLen) {
    let t = String(raw || "").trim();
    if (!t) return "";
    t = t
      .replace(/^(길수|흉수|중성|길괘|흉괘)\s*[—–\-]\s*/, "")
      .trim();
    const lim = maxLen || 70;
    if (t.length <= lim) return t;
    const cut = t.slice(0, lim + 30);
    const m = cut.match(/^[\s\S]{20,90}?[.。!?！？]/);
    if (m) return m[0].trim();
    const m2 = cut.match(/^[\s\S]{20,90}?[，,;；]/);
    if (m2) return m2[0].replace(/[，,;；]\s*$/, "").trim() + ".";
    return cut.slice(0, lim).replace(/\s+\S*$/, "") + "…";
  }

  /** 소비자용 구술: narrate + 해당 나이대만. 초년/총운(말년)이 다르면 해당 칸만 붙인다. */
  function suriCoreBrief(ns, ageKey) {
    if (!ns || ns.suri == null) return "";
    const n = NAR().suri[String(ns.suri)];
    if (n) {
      let t = String(n.narrate || "").trim();
      // 총운 = 말년
      const ak = ageKey === "총운" ? "말년" : ageKey;
      if (ak && n[ak]) {
        const extra = String(n[ak]).trim();
        if (extra) t = t ? t + " " + extra : extra;
      }
      if (t) return t;
    }
    const x = CS().suri[String(ns.suri)];
    if (x && x.core) return briefCoreText(x.core, 140);
    const d = ns.data;
    if (d) {
      const s = String(d.shortDesc || "").trim();
      if (s) return briefCoreText(s, 140);
    }
    if (x && x.shortDesc) return briefCoreText(x.shortDesc, 140);
    return "";
  }

  function hexCoreBrief(ng) {
    if (!ng) return "";
    const byId = ng.id != null ? NAR().hex[String(ng.id)] : null;
    if (byId && byId.narrate) return String(byId.narrate).trim();
    // name fallback
    const hexMap = NAR().hex || {};
    const keys = Object.keys(hexMap);
    const want = gweNameOf(ng);
    for (let i = 0; i < keys.length; i++) {
      const row = hexMap[keys[i]];
      if (row && row.name && want && (want === row.name || want.indexOf(row.name) === 0) && row.narrate) {
        return String(row.narrate).trim();
      }
    }
    const x = ng.id != null ? CS().hex[String(ng.id)] : null;
    if (x && x.core) return briefCoreText(x.core, 140);
    if (ng.desc) return briefCoreText(ng.desc, 140);
    if (ng.shortDesc) return briefCoreText(ng.shortDesc, 140);
    return "";
  }

  /** 라이브 d6 — 장수 축소: shortDesc 우선(desc 중복 병합 안 함) */
  function suriOriginalText(ns) {
    const d = ns && ns.data;
    if (d) {
      const s = String(d.shortDesc || "").trim();
      if (s) return s;
      const full = String(d.desc || "").trim();
      if (full) return full;
    }
    const x = ns && CS().suri[String(ns.suri)];
    if (x) {
      const s = String(x.shortDesc || "").trim();
      if (s) return s;
      if (x.body) return String(x.body);
      return String(x.desc || "").trim();
    }
    return "";
  }

  /** 보흘 지정: 수리별 구체 기운 키워드 (목록에 있는 것만) */
  const SURI_DETAIL_KEYWORDS = {
    14: [
      "이별이혼",
      "사고감옥",
      "자살단명",
      "사건",
      "사고",
      "감옥",
      "당뇨",
      "암",
      "질병",
      "수술",
    ],
  };

  /** 보흘 지정: 수리별 특례 해설 (원본 d6 비침범) */
  const SURI_SPECIAL_NOTES = {
    9: {
      base:
        " 단점으로, 너무 시대를 앞서 가다가 환경이 받쳐주지 않아 실패를 거듭한다. 공부운이 뜻대로 풀리지 않는 경우가 많다.",
      초년:
        " 초년에 들면 예·체능에는 강하지만 실의에 빠지기 쉽습니다.",
    },
    10: {
      base:
        " 재주가 많고 머리가 좋다. 계획을 잘 세워 잘 풀려 나가는 듯 하다가 허망하게 무너져 버리는 운명이다. 대부분 학교운·시험운·직장운이 따라주지 않아 학업이 중단되거나 결과가 허망해진다.",
      choSajuGood:
        " 다만 초년 사주가 좋아 학교·시험·직장 운의 허망을 돌파해 나가기도 합니다.",
      choSajuUnknown:
        " 초년 사주가 좋으면 돌파해 나가기도 합니다.",
    },
    12: {
      base:
        " 일이 잘 되어 나가는 듯 하다가 마지막에 실패를 맛본다. 공부든, 사업이든, 데이트신청이나 청혼이든 모두 끝이 안 좋다.",
      초년:
        " 12가 초년에 들면 대학을 가기 어렵다. 가려면 하향 지원해서 지방대 가야 하고, 재수·삼수를 해도 목표 대학은 가기가 힘들다.",
    },
    14: {
      base:
        " 이산파멸의 장점으로, 위기 앞에서도 독종 소리를 들을 만큼 열심히·치열하게 산다. 다만 공부·일도 잘 나가다가 끝이 안 좋아지기 쉽다.",
    },
    16: {
      base:
        " 마음씨가 너무 착해서 어려운 이웃을 보면 도와 줘야 하고, 친구의 부탁이나 청을 거절하기 힘들어 그 책임을 고스란히 떠 안고 해결하느라고 힘들게 살기도 합니다. 워낙 귀가 얇아서 휘둘리고 보증을 잘 선다는 특징이 있다.",
      말년:
        " 덕망유복이 말년에 있으면 마음씨가 너무 착해 다른이의 부탁을 거절하지 못하니 보증 잘 서고 귀가 얇아 친구따라 강남 갔다가 그 피해를 전부 끌어 앉고 고생을 하게 되는 수이니 조심 하시기 바랍니다.",
    },
    20: {
      base:
        " 사물의 종말을 고하는 불운의 수라 쉬고 멈추어야 할 때입니다. 학업이 중단되거나 사업이 끊기기 쉽습니다.",
      말년:
        " 총운에 20이 들면 그릇이 큰 거물이 나오기도 하지만 좋은 주역괘가 없으면 대개 50세 전후로 부도·감옥·큰 욕을 보는 경우가 많습니다.",
    },
    35: {
      base:
        " 학자, 문학가, 교육가, 현모양처로 영민하고 온순, 원만한 대인관계, 많은 부동산을 소유하고 장수하는 길운입니다.",
    },
  };

  /** 9 대재무용 아래에 오면 아주 좋은 괘 (보흘 지정) */
  const HEX_SURI9_GOOD = ["화천대유", "산천대축", "뇌천대장"];

  function isSuri9GoodHex(g) {
    if (!g || !g.name) return false;
    for (let i = 0; i < HEX_SURI9_GOOD.length; i++) {
      if (hexNameStarts(g, HEX_SURI9_GOOD[i])) return true;
    }
    return false;
  }

  function suri9GoodHexNote(ns, ng) {
    if (!ns || ns.suri == null || Number(ns.suri) !== 9) return "";
    if (!isSuri9GoodHex(ng)) return "";
    const plain = gweNameOf(ng);
    return (
      " 그 아래에 " +
      gweNameHtml(ng) +
      josaIGA(plain) +
      " 들어 아주 좋습니다."
    );
  }

  function ageKeyFromSpeak(ageSpeak) {
    const s = String(ageSpeak || "");
    if (s.indexOf("말년") === 0 || s === "말년") return "말년";
    if (s.indexOf("초년") === 0 || s.indexOf("23세") >= 0) return "초년";
    if (s.indexOf("장년") === 0 || s.indexOf("30세") >= 0) return "장년";
    if (s.indexOf("중년") === 0 || s.indexOf("40세") >= 0) return "중년";
    return "";
  }

  function suriDetailKeywordsList(ns) {
    if (!ns || ns.suri == null) return null;
    return SURI_DETAIL_KEYWORDS[Number(ns.suri)] || null;
  }

  function suriDetailKeywordsNote(ns) {
    const keys = suriDetailKeywordsList(ns);
    if (!keys || !keys.length) return "";
    return " 이 수리는 " + keys.join("·") + " 등의 기운을 말합니다.";
  }

  /** 초년 사주 길 여부: true/false/null(사주 없음·보통) */
  function isChoSajuGood(bdS, bdG, hasB) {
    if (!hasB) return null;
    const bs = bdS && bdS[1];
    const bg = bdG && bdG[1];
    const good =
      !!(bs && bs.data && suriGood(bs.data)) || !!(bg && gweGood(bg));
    const bad =
      !!(bs && bs.data && suriBad(bs.data)) || !!(bg && gweBad(bg));
    if (good && !bad) return true;
    if (bad && !good) return false;
    if (good) return true;
    return null;
  }

  function suriSpecialNote(ns, ageKey, opts) {
    if (!ns || ns.suri == null) return "";
    const num = Number(ns.suri);
    const spec = SURI_SPECIAL_NOTES[num];
    if (!spec) return "";
    let t = "";
    if (ageKey && spec[ageKey]) {
      // 16 말년은 완결 문장(보흘 지정) — base와 겹치지 않게 특례만
      if (num === 16 && ageKey === "말년") t = spec[ageKey];
      else t = (spec.base || "") + spec[ageKey];
    } else if (spec.base) {
      t = spec.base;
    }
    if (num === 10) {
      const cho = opts && opts.choSajuGood;
      if (cho === true && spec.choSajuGood) t += spec.choSajuGood;
      else if (cho !== false && spec.choSajuUnknown) t += spec.choSajuUnknown;
    }
    return t;
  }

  /**
   * 구술 본문: 특례가 있으면 특례만(원본 생략). 없으면 핵심만 짧게.
   * 14 키워드는 특례와 함께 필수.
   */
  function suriBodyWithDetail(ns, ageKey, opts) {
    const special = suriSpecialNote(ns, ageKey || "", opts || null);
    if (special) {
      let t = special;
      // 14 이산파멸 구체 키워드는 특례 해설의 일부
      if (ns && Number(ns.suri) === 14) t += suriDetailKeywordsNote(ns);
      return t;
    }
    const brief = suriCoreBrief(ns, ageKey || "");
    if (brief) return " " + esc(brief);
    return "";
  }

  /** 라이브 Ee.desc → CS hex.core — 장수 축소: 앞 2문장 정도만 (팝업·참고용) */
  function hexOriginalText(ng) {
    let t = "";
    if (ng && ng.desc) t = String(ng.desc).trim();
    else {
      const x = ng && CS().hex[String(ng.id)];
      if (x && x.core) {
        t = String(x.core)
          .replace(/^(길괘|흉괘|중성)\s*[—–-]\s*/, "")
          .trim();
      }
    }
    if (!t) return "";
    if (t.length <= 180) return t;
    const cut = t.slice(0, 220);
    const m = cut.match(/^[\s\S]{50,200}?[.。!?！？]/);
    if (m) return m[0].trim();
    return cut.replace(/\s+\S*$/, "") + "…";
  }

  /** 구술용 주역: 특례 있으면 특례만, 없으면 핵심만 짧게. prevNg=시간순 직전 괘 */
  function hexBodyForNarrate(ng, prevNg, ageKey) {
    const special = hexSpecialNote(ng);
    let body = "";
    if (special) body = special;
    else {
      const brief = hexCoreBrief(ng);
      if (brief) body = " " + esc(brief);
    }
    const boost = hexSeqWealthBoostNote(ng, prevNg, ageKey);
    if (boost) body = (body || "") + boost;
    return body;
  }

  /**
   * 인쇄 문장: "{who}에는 {ageSpeak}의 운세를 나타내는 수리에는 {num}, {name}가 들어 있습니다. {원문}"
   */
  function printSuriSentence(whoLabel, ageSpeak, ns, opts) {
    if (!ns || ns.suri == null || !ns.data) return "";
    const plain = plainSuriName(ns);
    const phrase = suriPhrase(ns);
    let lead = "";
    if (whoLabel) lead += whoLabel + "에는 ";
    lead +=
      ageSpeak +
      "의 운세를 나타내는 수리에는 " +
      phrase +
      josaIGA(plain) +
      " 들어 있습니다.";
    lead += suriBodyWithDetail(ns, ageKeyFromSpeak(ageSpeak), opts || null);
    return lead;
  }

  /**
   * 인쇄 문장: "{who} {ageSpeak}의 주역괘는 {괘명}이 들어 있습니다. {원문}"
   */
  function printHexSentence(whoLabel, ageSpeak, ng, prevNg) {
    if (!ng || !ng.name) return "";
    const plain = gweNameOf(ng);
    const speak = String(ageSpeak || "");
    const ageKey = ageKeyFromSpeak(speak);
    const isMal = speak === "말년" || speak.indexOf("말년") === 0;
    let lead = "";
    if (whoLabel && isMal && whoLabel.indexOf("한자") >= 0) {
      lead =
        whoLabel +
        "의 총 주역괘, 즉 말년의 주역괘 역시 " +
        gweNameHtml(ng) +
        josaEuro(plain) +
        " ";
    } else if (whoLabel && isMal && whoLabel.indexOf("탄생") >= 0) {
      lead =
        whoLabel +
        " " +
        speak +
        "의 주역괘는 " +
        gweNameHtml(ng) +
        josaIGA(plain) +
        " 들어 있습니다.";
    } else if (whoLabel && isMal) {
      const luckLead = gweGood(ng) ? "다행히 " : gweBad(ng) ? "" : "";
      lead =
        luckLead +
        whoLabel +
        " 말년의 주역괘는 " +
        gweNameHtml(ng) +
        josaIGA(plain) +
        " 들어 있습니다.";
    } else {
      lead =
        (whoLabel ? whoLabel + " " : "") +
        speak +
        "의 주역괘는 " +
        gweNameHtml(ng) +
        josaIGA(plain) +
        " 들어 있습니다.";
    }
    const body = hexBodyForNarrate(ng, prevNg, ageKey);
    if (body) {
      const isSpecialOnly = !!hexSpecialNote(ng);
      if (
        whoLabel &&
        isMal &&
        whoLabel.indexOf("한자") >= 0 &&
        !isSpecialOnly
      ) {
        lead += body.charAt(0) === " " ? body : " " + body;
        lead +=
          " 운세를 보이겠으나 그 이전까지가 너무 힘든 인생이 펼쳐져 힘을 빼놓게 되므로 좋은 기운이 많이 희생될 것으로 보입니다.";
      } else {
        lead += body.charAt(0) === " " ? body : " " + body;
      }
    }
    return lead;
  }

  /**
   * who=한글|한문|탄생일 → 인쇄 문장 패턴 (원문 전문, 격·길흉 라벨 없음)
   */
  function explainAgeLayer(who, ns, ng, ageKey) {
    const whoLabel =
      who === "탄생일" ? "탄생일" : who === "한문" ? "한자이름" : "한글이름";
    const ageSpeak =
      ageKey === "말년"
        ? "말년"
        : ageKey === "초년"
          ? "23세 이전"
          : ageKey === "장년"
            ? "30세부터 40세까지"
            : ageKey === "중년"
              ? "40세 이후부터 55세까지"
              : ageKey;

    const parts = [];
    if (ns && ns.suri != null && ns.data) {
      parts.push(printSuriSentence(whoLabel, ageSpeak, ns));
    } else {
      parts.push(whoLabel + " " + ageSpeak + "에는 수리 자료가 없습니다.");
    }
    if (ng && ng.name) {
      parts.push(printHexSentence(whoLabel, ageSpeak, ng));
    }
    const mit = slotComboNotes(ns, ng, null, null, null, ageKey);
    if (mit) parts.push(mit.trim());
    return parts.filter(Boolean).join(" ");
  }

  function pairHas(up, dn, kind) {
    return up === kind || dn === kind;
  }

  /** 위·아래로 상생/상극 판정 */
  function relOverall(up, dn) {
    const saeng = pairHas(up, dn, "sangsaeng");
    const geuk = pairHas(up, dn, "sanggeuk");
    if (saeng && !geuk) return "sangsaeng";
    if (geuk && !saeng) return "sanggeuk";
    if (saeng && geuk) return "mixed";
    return "neutral";
  }

  function relPrintNoun(kind) {
    if (kind === "sangsaeng") return paintBlue("상생");
    if (kind === "sanggeuk") return paintRed("상극");
    if (kind === "mixed") return paintBlue("상생") + "·" + paintRed("상극");
    return "비화";
  }

  /** 오행 — 선생님 서술형 문체 + 생·극 방향(주는지/받는지) · 보흘 2026-09-24 */
  function buildOhangBlock(ctx) {
    const o = ctx.ohang || null;
    if (!o) return "";
    const nameOpt = String(ctx.name || ctx.displayName || "").trim();
    const who = nameOpt ? esc(nameOpt) + "님" : "이 분";

    const OH_KO = { 木: "목", 火: "화", 土: "토", 金: "금", 水: "수" };
    const OH_RO = {
      木: "목으로",
      火: "화로",
      土: "토로",
      金: "금으로",
      水: "수로",
    };
    /** 가운데(본인) 중심기운 품성 — 선생님 원문 톤 */
    const MID_TRAIT = {
      木: "성장·시작의 기운이 있어 추진력이 있고 뻗어 나가려는 성향이 나타납니다",
      火: "밝고 명랑 쾌활하며, 일처리가 시원시원한 면이 있고, 때론 욱하는 급한 성격이 나타날 수 있습니다",
      土: "비교적 포용력이 있고 인내심이 있으며 안정·신뢰의 기운이 중심을 이룹니다",
      金: "비교적 굳세고 강하며, 솔직하고 직선적인 면이 많고, 요구수준이 높고 까다로울 수 있으나 스스로 실력을 쌓으려는 성실한 면도 많습니다. 강자에게는 강하고 약자에게는 부드러운 군자의 모습이 나오기도 합니다",
      水: "지혜롭고 담백하며 자유자재·능수능란한 융통성을 갖춘 반면에 냉철함도 가지고 있습니다",
    };
    const GEN = { 木: "火", 火: "土", 土: "金", 金: "水", 水: "木" };
    const KEUK = { 木: "土", 火: "金", 土: "水", 金: "木", 水: "火" };

    function normEl(v) {
      const t = String(v || "").trim();
      if (!t) return "";
      if (OH_KO[t]) return t;
      const map = { 목: "木", 화: "火", 토: "土", 금: "金", 수: "水" };
      return map[t] || t;
    }
    function ohName(el) {
      return OH_KO[el] || el;
    }
    function ohRo(el) {
      return OH_RO[el] || OH_KO[el] || el;
    }
    /** 나열: 토(土)·금(金) — 「로/으로」는 붙이지 않음(중복 방지) */
    function elList(arr) {
      return (arr || [])
        .map(normEl)
        .filter(Boolean)
        .map(function (e) {
          return ohName(e) + "(" + e + ")";
        })
        .join("·");
    }
    /** 위(up)·본인(me) — 내가 생/극을 주는지·받는지 */
    function dirUp(up, me) {
      if (!up || !me) return "none";
      if (up === me) return "sangbi";
      if (GEN[up] === me) return "recv_saeng"; // 위-생->본인
      if (GEN[me] === up) return "give_saeng"; // 위<-생-본인
      if (KEUK[up] === me) return "recv_geuk"; // 위-극->본인
      if (KEUK[me] === up) return "give_geuk"; // 위<-극-본인
      return "bihwa";
    }
    /** 본인(me)·아래(dn) */
    function dirDn(me, dn) {
      if (!me || !dn) return "none";
      if (me === dn) return "sangbi";
      if (GEN[me] === dn) return "give_saeng"; // 본인-생->아래
      if (GEN[dn] === me) return "recv_saeng"; // 본인<-생-아래
      if (KEUK[me] === dn) return "give_geuk"; // 본인-극->아래
      if (KEUK[dn] === me) return "recv_geuk"; // 본인<-극-아래
      return "bihwa";
    }
    function speakUp(d) {
      if (d === "recv_saeng")
        return (
          "윗사람(양부모·배우자·선배·관공서) 쪽으로는 " +
          paintBlue("생을 받는") +
          " 구조입니다. 위로부터 정신적·물질적 도움을 받기 쉽습니다."
        );
      if (d === "give_saeng")
        return (
          "윗사람 쪽으로는 내가 " +
          paintBlue("생을 주는") +
          " 구조입니다. 위를 섬기고 배우며 베푸는 기운입니다."
        );
      if (d === "recv_geuk")
        return (
          "윗사람 쪽으로는 내가 " +
          paintRed("극을 받는") +
          " 구조입니다. 위로부터의 극·배척·소통 막힘이 생기기 쉽습니다."
        );
      if (d === "give_geuk")
        return (
          "윗사람 쪽으로는 내가 " +
          paintRed("극을 주는") +
          " 구조입니다. 위를 치며 정신적·재물 손실을 주기 쉬운 기운입니다."
        );
      if (d === "sangbi")
        return "윗사람 쪽은 같은 오행이 나란히 있어 상비(상생도 상극도 아닌) 기운으로, 관심이 있는듯 없는듯 덤덤한 관계로 읽힙니다.";
      if (d === "bihwa")
        return "윗사람 쪽은 생·극이 뚜렷하지 않아 관심이 있는듯 없는듯한 관계로 읽힙니다.";
      return "";
    }
    function speakDn(d) {
      if (d === "give_saeng")
        return (
          "아랫사람(동료·후배·자녀) 쪽으로는 내가 " +
          paintBlue("생을 주는") +
          " 구조입니다. 베풀고 자상하게 대하는 기운입니다."
        );
      if (d === "recv_saeng")
        return (
          "아랫사람 쪽으로는 내가 " +
          paintBlue("생을 받는") +
          " 구조입니다. 동료·후배·자녀의 도움을 받기 쉽습니다."
        );
      if (d === "give_geuk")
        return (
          "아랫사람 쪽으로는 내가 " +
          paintRed("극을 주는") +
          " 구조입니다. 아래를 치며 엄격·배척이 생기기 쉽습니다."
        );
      if (d === "recv_geuk")
        return (
          "아랫사람 쪽으로는 내가 " +
          paintRed("극을 받는") +
          " 구조입니다. 아래의 도움을 받기 어렵고 소통이 막히기 쉽습니다."
        );
      if (d === "sangbi")
        return "아랫사람 쪽은 같은 오행이 나란히 있어 상비로, 덤덤하거나 관심이 있는듯 없는듯한 관계로 읽힙니다.";
      if (d === "bihwa")
        return "아랫사람 쪽은 생·극이 뚜렷하지 않아 관심이 있는듯 없는듯한 관계로 읽힙니다.";
      return "";
    }
    function pairTone(upD, dnD) {
      const saengish = function (d) {
        return d === "give_saeng" || d === "recv_saeng";
      };
      const geukish = function (d) {
        return d === "give_geuk" || d === "recv_geuk";
      };
      let s = 0;
      let g = 0;
      if (saengish(upD)) s++;
      if (saengish(dnD)) s++;
      if (geukish(upD)) g++;
      if (geukish(dnD)) g++;
      if (s && !g) return "saeng";
      if (g && !s) return "geuk";
      if (s && g) return "mixed";
      return "flat";
    }

    const K = (o.K || ctx.K || []).map(normEl);
    const hjO = (o.hjO || []).map(normEl);
    const hasHj = !!(o.q && hjO.length);
    const midHg = K[1] || K[0] || "";
    const midHj = hasHj ? hjO[1] || hjO[0] || "" : "";
    const upHg = K[0] || "";
    const dnHg = K[2] || "";
    const upHjE = hasHj ? hjO[0] || "" : "";
    const dnHjE = hasHj ? hjO[2] || "" : "";

    const dUpHg = dirUp(upHg, midHg);
    const dDnHg = dirDn(midHg, dnHg);
    const dUpHj = hasHj ? dirUp(upHjE, midHj) : "none";
    const dDnHj = hasHj ? dirDn(midHj, dnHjE) : "none";

    const saeng = Number(o.M) || 0;
    const geuk = Number(o.z) || 0;
    const toneHg = pairTone(dUpHg, dDnHg);
    const toneHj = hasHj ? pairTone(dUpHj, dDnHj) : "flat";

    const paras = [];

    // 1) 척도·상생·상극 정의 (선생님 원문)
    paras.push(
      "오행은 주변 사람들과 어떤 인간관계를 유지하며 살아 가는지, 어떤 성격을 형성하는 기운으로 작용을 하는지, 인복은 있는지, 사람 때문에 받는 스트레스는 어느 정도인지를 알아보는 척도가 됩니다. " +
        paintBlue("상생") +
        "의 관계란 서로가 서로에게 도움을 주고, 협조적이며, 화합이 잘 되고, 긍정적이고, 소통이 잘 되는 상태를 말합니다. " +
        paintRed("상극") +
        "의 관계는 상생의 반대적인 개념으로 배타적이며, 부정적이고, 소통이 어렵고, 억제·저지·방해·불협화음이 자주 발생하는 상태를 나타냅니다. 오행에 " +
        paintRed("상극") +
        "이 과다하면 스트레스가 많고, 몸에 여러가지 질병이 생기기 쉽습니다."
    );

    // 2) 배치·전체 흐름
    let flow = who + " 이름 속의 오행을 보면 ";
    if (K.length) flow += "한글(소리)은 " + elList(K);
    if (hasHj) flow += (K.length ? "이고, 한자(자원)는 " : "") + elList(hjO);
    flow += "의 배치입니다. ";

    if (geuk === 0 && saeng >= 2) {
      flow +=
        "전체적으로 " +
        paintBlue("상생") +
        "이 많아 주변 사람들과 두루 원만하고 매끄럽게 화합을 이루며 지내려는 기운이 나오고, 사람때문에 받는 스트레스는 비교적 적은 편에 속합니다.";
    } else if (saeng > geuk) {
      flow +=
        "전체적으로 " +
        paintRed("상극") +
        "보다 " +
        paintBlue("상생") +
        "이 많은 구조로 되어 있어 두루 화합이 잘되며 원만한 편에 속하고, 사람때문에 받는 스트레스가 많지 않을 것으로 보입니다.";
    } else if (geuk > saeng) {
      flow +=
        paintBlue("상생") +
        "보다 " +
        paintRed("상극") +
        "이 많아 사람때문에 받는 스트레스가 많다는 것을 한 눈에 알아볼 수 있습니다. 이리 치이고 저리 치이는 일이 생기기 쉽습니다.";
    } else if (saeng && geuk) {
      flow +=
        "반은 " +
        paintBlue("상생") +
        "이고 반은 " +
        paintRed("상극") +
        "인 흐름이 보이니, 두루 원만하게 지내는듯 하다가도 자존심이 긁히거나 앞길이 막히면 예민하고 날카로운 반응이 나오기 쉽습니다.";
    } else {
      flow +=
        "생·극이 뚜렷이 기울지 않은 구조로 읽힙니다.";
    }
    paras.push(flow);

    // 3) 겉·속 (한글 상생 / 한자 상극 등)
    if (hasHj) {
      if (toneHg === "saeng" && toneHj === "geuk") {
        paras.push(
          "한글이름은 " +
            paintBlue("상생") +
            "에 가깝고 한자이름은 " +
            paintRed("상극") +
            "에 가까워, 겉으로 드러난 표면적인 인간관계는 큰 어려움없이 원만한듯 보이지만 속으로는 주변 사람들 때문에 겪는 고뇌와 갈등이 많을 수 있습니다. 겉으로 보이는 것이 전부가 아니라는 말씀입니다."
        );
      } else if (toneHg === "geuk" && toneHj === "saeng") {
        paras.push(
          "한글(겉)은 " +
            paintRed("상극") +
            "에 가깝고 한자(속)은 " +
            paintBlue("상생") +
            "에 가까워, 겉보기에는 별로인데 속으로는 믿음이 가는 흐름으로 읽힙니다."
        );
      }
    }

    // 4) 중심기운 품성 — 「오행은 토이고, 한문은 수이니…」(보흘)
    if (midHg) {
      let mid = "오행은 " + ohName(midHg) + "이고";
      if (midHj) {
        mid += ", 한문은 " + ohName(midHj) + "이니 ";
      } else {
        mid += "이니 ";
      }
      mid += (MID_TRAIT[midHg] || "그 기운이 성격을 이끕니다") + ".";
      if (midHj && midHj !== midHg && MID_TRAIT[midHj]) {
        mid +=
          " 속(한문)으로는 " +
          ohName(midHj) +
          "의 기운이 더해져 " +
          MID_TRAIT[midHj] +
          ".";
      }
      paras.push(mid);
    }

    // 5) 한글 — 생/극을 주는지·받는지
    {
      const bits = ["한글이름(겉)으로 보면 "];
      const u = speakUp(dUpHg);
      const d = speakDn(dDnHg);
      if (u) bits.push(u + " ");
      if (d) bits.push(d);
      // 군자: 위 극(내가 강자에 강함) + 아래 생
      if (
        (dUpHg === "give_geuk" || dUpHg === "recv_geuk") &&
        dDnHg === "give_saeng"
      ) {
        bits.push(
          " 강자에게는 강하고 약자·아랫사람에게는 부드러운 군자의 모습이 나타나기 쉽습니다."
        );
      }
      // 치사랑 / 내리사랑
      if (
        (dUpHg === "give_saeng" || dUpHg === "give_geuk") &&
        (dDnHg === "recv_saeng" || dDnHg === "recv_geuk")
      ) {
        bits.push(
          " 아래에서 도움을 받고 위를 섬기는 치사랑(위로 올라가는 사랑)의 흐름도 읽을 수 있습니다."
        );
      }
      if (
        (dUpHg === "recv_saeng" || dUpHg === "recv_geuk") &&
        (dDnHg === "give_saeng" || dDnHg === "give_geuk")
      ) {
        bits.push(
          " 위의 도움을 받고 아래쪽에 베푸는 내리사랑의 흐름도 읽을 수 있습니다."
        );
      }
      paras.push(bits.join("").trim());
    }

    // 6) 한자 — 생/극을 주는지·받는지
    if (hasHj) {
      const bits = ["한자이름(속)으로 보면 "];
      const u = speakUp(dUpHj);
      const d = speakDn(dDnHj);
      if (u) bits.push(u + " ");
      if (d) bits.push(d);
      if (
        (dUpHj === "give_geuk" || dUpHj === "recv_geuk") &&
        dDnHj === "give_saeng"
      ) {
        bits.push(
          " 속에서도 강자에게 강하고 약자에게 부드러운 기운이 이어질 수 있습니다."
        );
      }
      paras.push(bits.join("").trim());
    }

    // 7) 인덕 마무리
    let indeok = "";
    if (saeng >= 3) {
      indeok =
        "인덕이 많습니다. 인덕(상생)이 3개 이상이어야 재물운·출세운·공부운·결혼운이 모두 좋게 작용하기 쉽습니다.";
    } else if (saeng >= 2) {
      indeok =
        "인덕이 어느 정도 있습니다. 다만 인덕 3·4개가 되어야 재물·출세·공부·결혼운이 두루 좋게 작용하기 쉽습니다.";
    } else {
      indeok =
        "인덕이 부족합니다. 상극이 많으면서 큰 재물·출세운이 있어도 그 복은 절반 이하로 떨어지기 쉽습니다.";
    }
    if (geuk >= 3) {
      indeok +=
        " " +
        paintRed("상극") +
        "이 많아 사람 스트레스와 건강 부담이 커질 수 있으니 오행을 고치는 개명을 깊이 검토할 만합니다.";
    }
    paras.push(
      paintBlue("상생") +
        "이 " +
        saeng +
        "개, " +
        paintRed("상극") +
        "이 " +
        geuk +
        "개로 " +
        indeok
    );

    return paras.join("<br><br>");
  }

  window.paintGH = function paintGH(s) {
    return String(s || "")
      .replace(/「길」/g, '<span style="color:#0000FF;font-weight:700">「길」</span>')
      .replace(/「흉」/g, '<span style="color:#FF0000;font-weight:700">「흉」</span>')
      .replace(/청색길괘/g, '<span style="color:#0000FF;font-weight:700">청색길괘</span>')
      .replace(/길괘/g, '<span style="color:#0000FF;font-weight:700">길괘</span>')
      .replace(/흉괘/g, '<span style="color:#FF0000;font-weight:700">흉괘</span>')
      .replace(/흉수/g, '<span style="color:#FF0000;font-weight:700">흉수</span>');
  };

  /** @param ctx bundle에서 넘기는 데이터 */
  window.koSumRoutine = function koSumRoutine(ctx) {
    const ages = ctx.ages || ["말년", "초년", "장년", "중년"];
    const nmS = ctx.nmS || [];
    const nmG = ctx.nmG || [];
    const hjS = ctx.hjS || [];
    const hjG = ctx.hjG || [];
    const hasHanja = !!ctx.hasHanja;
    const bdS = ctx.bdS || [];
    const bdG = ctx.bdG || [];
    const hasB = !!ctx.hasB;

    const ageParts = [];
    const compareParts = [];
    /** 이름 흉괘가 사주 시기를 치는 목록: [{ag, ng, bg, who}] */
    const hitList = [];
    /** 이름 길괘(청색)가 사주를 돕는 목록 */
    const helpList = [];
    /** 이름 길괘가 사주 흉을 받치는 목록 */
    const supportList = [];
    /** 말년 길/흉이 초·장·중을 가중하는 설명 */
    const amplifyParts = [];
    /** 화택규 장년·말년 연속 등 특별 경고 */
    const specialWarn = [];

    const malIdx = ages.indexOf("말년");
    const jangIdx = ages.indexOf("장년");
    const malNs = malIdx >= 0 ? nmS[malIdx] : null;
    const malNg = malIdx >= 0 ? nmG[malIdx] : null;
    const malHs = hasHanja && malIdx >= 0 ? hjS[malIdx] : null;
    const malHg = hasHanja && malIdx >= 0 ? hjG[malIdx] : null;
    const malBs = hasB && malIdx >= 0 ? bdS[malIdx] : null;
    const malBg = hasB && malIdx >= 0 ? bdG[malIdx] : null;
    const malBad =
      !!(malNg && gweBad(malNg)) ||
      !!(malNs && suriBad(malNs.data)) ||
      !!(malHg && gweBad(malHg)) ||
      !!(malHs && suriBad(malHs.data));
    const malGood =
      (!!(malNg && gweGood(malNg)) || !!(malNs && suriGood(malNs.data))) &&
      !(malHg && gweBad(malHg)) &&
      !(malHs && suriBad(malHs.data));
    const malSajuBad =
      hasB && (!!(malBg && gweBad(malBg)) || !!(malBs && suriBad(malBs.data)));
    const malSajuGood = hasB && !!(malBg && gweGood(malBg));
    const sajuOrdinary = isSajuOrdinaryOrBetter(bdS, bdG, hasB);
    const choSajuGood = isChoSajuGood(bdS, bdG, hasB);
    const suriOpts = { choSajuGood: choSajuGood };

    function checkHwagtaekPair(gArr, who) {
      if (jangIdx < 0 || malIdx < 0 || !gArr) return;
      if (isHwagtaekGyu(gArr[jangIdx]) && isHwagtaekGyu(gArr[malIdx])) {
        specialWarn.push(
          "【주의】 " +
            who +
            " 장년·말년에 주역 「화택규」가 연속됩니다. 심장마비로 사망하기 쉬운 기운이니, 다른 자리만 보고 좋다고 단정하면 안 됩니다."
        );
      }
    }
    checkHwagtaekPair(nmG, "한글");
    if (hasHanja) checkHwagtaekPair(hjG, "한문");
    if (hasB) checkHwagtaekPair(bdG, "탄생일");

    function countHwagtaekIn(gArr) {
      let n = 0;
      if (!gArr) return 0;
      for (let i = 0; i < gArr.length; i++) {
        if (isHwagtaekGyu(gArr[i])) n++;
      }
      return n;
    }
    const hwagtCount =
      countHwagtaekIn(nmG) + (hasHanja ? countHwagtaekIn(hjG) : 0);
    // 보흘 지정: 화택규 2개 이상이면 「좋은 이름」 금지 + 본뜻·흉수리 경고
    if (hwagtCount >= 2) {
      let hwagtBadHit = 0;
      function countHwagtWithBadSuri(gArr, sArr) {
        let n = 0;
        if (!gArr || !sArr) return 0;
        for (let i = 0; i < gArr.length; i++) {
          if (isHwagtaekGyu(gArr[i]) && sArr[i] && sArr[i].data && suriBad(sArr[i].data))
            n++;
        }
        return n;
      }
      hwagtBadHit =
        countHwagtWithBadSuri(nmG, nmS) +
        (hasHanja ? countHwagtWithBadSuri(hjG, hjS) : 0);
      let warn =
        "【주의】 「화택규」는 천추원한 백골혼으로 추락·낙상사고·교통사고로 뼈를 크게 다치는 기운입니다. 화택규의 질병은 뼈를 크게 다친다거나(목·허리 등 모든 디스크·관절이 전부 포함됩니다) 기관지를 조심하셔야 합니다. 이 이름에 「화택규」가 " +
        hwagtCount +
        "개나 있으니 좋은 이름이라고 할 수 없습니다. 둘 중 하나라도 흉수리를 만나면 사고가 나기 쉽습니다.";
      if (hwagtBadHit > 0) {
        warn +=
          " 이미 「화택규」와 흉수리가 같은 시기에 " +
          hwagtBadHit +
          "곳 겹쳐 있으니 각별히 경계하십시오.";
      }
      specialWarn.push(warn);
    }

    /** 보흘 지정: 말년 이산파멸+화택규 — 사주 눌러 주는 기운 한 개로는 둘을 못 막음 */
    function checkMalDualIsanHwagt(sArr, gArr, who) {
      if (!sArr || !gArr || malIdx < 0) return;
      const ns = sArr[malIdx];
      const ng = gArr[malIdx];
      if (!ns || Number(ns.suri) !== 14 || !isHwagtaekGyu(ng)) return;
      let t =
        "【주의】 " +
        who +
        " 말년에 「이산파멸」과 「화택규」가 함께 있어 질병·수술·사고·이별 기운이 겹칩니다. 화택규의 질병은 뼈를 크게 다친다거나(목·허리 등 모든 디스크·관절이 전부 포함됩니다) 기관지를 조심하셔야 합니다. 말년 화택규는 기관지가 크게 망가지면 머리까지 증상이 번질 수 있습니다.";
      if (hasB) {
        const sajuMit = isMitigateSuriHex(bdG[malIdx]);
        if (sajuMit) {
          t +=
            " 사주말년에 이위화 길괘가 하나 있어도 이 둘을 다 막지 못하니, 둘 중 하나에게 얻어터지기 쉽습니다.";
        } else {
          t +=
            " 사주 말년에 이를 막아 줄 눌러 주는 기운이 없으면 그 피해가 더 직격으로 옵니다.";
        }
      }
      specialWarn.push(t);
    }
    checkMalDualIsanHwagt(nmS, nmG, "한글이름");
    if (hasHanja) checkMalDualIsanHwagt(hjS, hjG, "한자이름");

    /** 보흘 지정: 말년 화택규 — 기관지→머리 증상 번짐 */
    function checkMalHwagtaekBronchi(gArr, who) {
      if (!gArr || malIdx < 0 || !isHwagtaekGyu(gArr[malIdx])) return;
      // 이산파멸+화택규 이중 경고에 이미 넣었으면 중복 생략
      const sArr = who.indexOf("한자") >= 0 ? hjS : nmS;
      if (sArr && sArr[malIdx] && Number(sArr[malIdx].suri) === 14) return;
      specialWarn.push(
        "【주의】 " +
          who +
          " 말년에 「화택규」가 있어 화택규의 질병은 뼈를 크게 다친다거나(목·허리 등 모든 디스크·관절이 전부 포함됩니다) 기관지를 조심하셔야 합니다. 말년 화택규는 기관지가 크게 망가지면 머리까지 증상이 번질 수 있습니다."
      );
    }
    checkMalHwagtaekBronchi(nmG, "한글이름");
    if (hasHanja) checkMalHwagtaekBronchi(hjG, "한자이름");

    /**
     * 보흘 지정 사례: 사주 화산려≥2(역마)·화뢰서합(언변) → 보험·발품 직업 적합.
     * 이름 중년 뇌천대장·화수미제로 한때 두각(보험왕) → 사주 말년 이위화(밝고 명랑·재물)가
     * 이름 말년 이산파멸·화택규에 지워짐. 사주 ≫ 이름, 좋은 이름 아님.
     */
    function checkSajuYeokmaWipedByName() {
      if (!hasB || !bdG || malIdx < 0) return;
      let yeokma = 0;
      let hasSeohap = false;
      for (let i = 0; i < bdG.length; i++) {
        if (hexNameStarts(bdG[i], "화산려")) yeokma++;
        if (hexNameStarts(bdG[i], "화뢰서합")) hasSeohap = true;
      }
      if (yeokma < 2) return;

      function malIsanHwagt(sArr, gArr) {
        if (!sArr || !gArr) return false;
        const ns = sArr[malIdx];
        const ng = gArr[malIdx];
        return !!(ns && Number(ns.suri) === 14 && isHwagtaekGyu(ng));
      }
      const nameMalDual =
        malIsanHwagt(nmS, nmG) ||
        (hasHanja && malIsanHwagt(hjS, hjG));
      const sajuMalIwi = hexNameStarts(bdG[malIdx], "이위화");

      function hasMidBoostHex(g) {
        return !!(
          g &&
          (isHwasumije(g) || hexNameStarts(g, "뇌천대장"))
        );
      }
      const midBoost =
        hasMidBoostHex(gweAtAge(nmG, ages, "중년")) ||
        (hasHanja && hasMidBoostHex(gweAtAge(hjG, ages, "중년")));

      let t =
        "【사주·직업】 사주에 「화산려」가 " +
        yeokma +
        "개로 역마살이 강해, 여기저기 돌아다니며 발품을 팔아 벌어 먹는 기운입니다. 보험·외근·영업처럼 발로 뛰는 직업이 잘 맞습니다.";
      if (hasSeohap) {
        t +=
          " 「화뢰서합」은 말을 잘 하는 기운이라 보험·상담 일에 아주 적합합니다.";
      }
      if (midBoost) {
        t +=
          " 이름 중년의 「뇌천대장」·「화수미제」 같은 길괘가 그 기운에 힘을 보태 한때 두각(보험왕 등)을 나타내기도 합니다. 다만 중년은 짧은 시기(약 5년)뿐입니다.";
      }
      if (sajuMalIwi && nameMalDual) {
        t +=
          " 사주 총운(말년) 「이위화」는 태양이 두 개 떠 화려한 극치·건강·균형의 편안한 시기·강력한 재운·성공운의 기운이었으나, 이름 말년 「이산파멸」·「화택규」에 그 재물이 지워지는 모습입니다. 타고난 사주가 훨씬 낫고, 이 이름을 좋다고 할 수 없습니다.";
      } else if (nameMalDual) {
        t +=
          " 이름 말년 「이산파멸」·「화택규」가 사주의 힘을 깎아 먹습니다. 타고난 사주가 훨씬 낫습니다.";
      }
      specialWarn.push(t);
    }
    checkSajuYeokmaWipedByName();

    /** 보흘 지정: 화택규 →(직전)→ 화수미제 재물 증폭 — 초년·장년만 「몇 배」, 중년은 낮춤 */
    function checkHwasumiWealthBoost(gArr, who) {
      if (!gArr) return;
      const pairs = [
        ["초년", "장년"],
        ["장년", "중년"],
        ["중년", "말년"],
      ];
      for (let i = 0; i < pairs.length; i++) {
        const prevAge = pairs[i][0];
        const currAge = pairs[i][1];
        const prev = gweAtAge(gArr, ages, prevAge);
        const curr = gweAtAge(gArr, ages, currAge);
        if (isHwagtaekGyu(prev) && isHwasumije(curr)) {
          let tip = "";
          if (isStrongWealthAge(currAge)) {
            tip =
              "「화수미제」의 재물을 몇 배나 키워 줍니다.";
          } else if (currAge === "중년") {
            tip =
              "「화수미제」의 재물 기운을 돋워 줍니다. 다만 중년은 짧은 시기라 몇 배 대박까지는 말하기 조심스럽습니다.";
          } else {
            tip = "「화수미제」의 재물 기운을 돋워 줍니다.";
          }
          specialWarn.push(
            paintBlue(currAge === "중년" ? "【재물 보탬】" : "【재물 증폭】") +
              " " +
              who +
              " " +
              prevAge +
              "에 「화택규」가 있고 바로 이어지는 " +
              currAge +
              "에 「화수미제」가 있어, " +
              tip
          );
        }
      }
    }
    checkHwasumiWealthBoost(nmG, "한글이름");
    if (hasHanja) checkHwasumiWealthBoost(hjG, "한자이름");
    if (hasB) checkHwasumiWealthBoost(bdG, "탄생일");

    function countBadSuriSlice(arr, from, to) {
      let n = 0;
      for (let i = from; i <= to; i++) {
        const x = arr && arr[i];
        if (x && suriBad(x.data)) n++;
      }
      return n;
    }

    function countBadGweSlice(arr, from, to) {
      let n = 0;
      for (let i = from; i <= to; i++) {
        if (arr && gweBad(arr[i])) n++;
      }
      return n;
    }

    // 인쇄물 스타일 — 보흘식 문체 금지
    // 조용한 수집 패스 (hitList/helpList/amplify — 본문 헤더·목록 없음)
    ages.forEach(function (ag, ii) {
      const ns = nmS[ii];
      const ng = nmG[ii];
      const hs = hasHanja ? hjS[ii] : null;
      const hg = hasHanja ? hjG[ii] : null;
      const bs = hasB ? bdS[ii] : null;
      const bg = hasB ? bdG[ii] : null;
      const nd = ns && ns.data;
      const hd = hs && hs.data;
      const bd = bs && bs.data;
      const nBadS = suriBad(nd);
      const nGoodS = suriGood(nd);
      const nBadG = gweBad(ng);
      const nGoodG = gweGood(ng);
      const hBadS = suriBad(hd);
      const hGoodS = suriGood(hd);
      const hBadG = gweBad(hg);
      const hGoodG = gweGood(hg);
      const bBadS = suriBad(bd);
      const bGoodG = gweGood(bg);
      const bBadG = gweBad(bg);

      if (hasB) {
        function collectGweVsSaju(who, nameG, badG, goodG) {
          if (!nameG || !bg) return;
          if (badG) {
            hitList.push({ ag: ag, ng: nameG, bg: bg, who: who });
          } else if (goodG) {
            helpList.push({ ag: ag, ng: nameG, bg: bg, who: who });
            if (bBadG) {
              supportList.push({ ag: ag, ng: nameG, bg: bg, who: who });
            }
          }
        }
        collectGweVsSaju("한글", ng, nBadG, nGoodG);
        if (hasHanja) collectGweVsSaju("한문", hg, hBadG, hGoodG);
        if (ng && nBadG && hasB && !bg) {
          hitList.push({ ag: ag, ng: ng, bg: null, who: "한글" });
        }
        if (hasHanja && hg && hBadG && hasB && !bg) {
          hitList.push({ ag: ag, ng: hg, bg: null, who: "한문" });
        }
      }

      const periodBad = !!(nBadG || nBadS || hBadG || hBadS);
      const periodGood =
        !!(nGoodG || nGoodS || hGoodG || hGoodS) && !periodBad;
      if (ag === "초년" || ag === "장년" || ag === "중년") {
        const sajuPeriodBad = !!(bBadG || bBadS);
        const sajuPeriodGood = !!bGoodG;
        if (malBad && periodBad) {
          amplifyParts.push(
            ag + "에는 말년의 부담이 더해져 시련이 한층 커질 수 있습니다."
          );
        } else if (malGood && periodGood) {
          amplifyParts.push(
            ag + "에는 말년의 밝은 기운이 더해져 흐름이 더 세집니다."
          );
        } else if (malGood && periodBad) {
          amplifyParts.push(
            "말년의 밝은 기운이 " + ag + "의 부담을 덜어 줄 수 있습니다."
          );
        } else if (malBad && periodGood) {
          amplifyParts.push(
            "말년은 무거워도 " + ag + "의 열림은 그 나이대(±3년)만 버티는 힘이 됩니다."
          );
        }
        if (hasB && malGood && sajuPeriodBad) {
          amplifyParts.push(
            "이름 말년의 밝은 기운이 사주 " + ag + "의 부담에도 영향·삭감력을 행사합니다."
          );
        } else if (hasB && malBad && sajuPeriodBad) {
          amplifyParts.push(
            "이름 말년의 부담이 사주 " + ag + "의 부담과 겹치면 그 시기 힘이 더 커집니다."
          );
        } else if (hasB && malGood && sajuPeriodGood) {
          amplifyParts.push(
            "이름 말년의 밝은 기운이 사주 " + ag + "의 열림을 도와 그 시기 운이 더 열립니다."
          );
        }
      }
    });

    // —— 인쇄 서술 (연속 문단, 【총운】【초년】 헤더 없음) ——
    // 1) 이름풀이 완성(이름 전체 시기 판단·오행·말년~중년) → 2) 탄생일·시기별 비교

    function joinGweNames(list) {
      return (list || [])
        .map(function (g) {
          return gweNameHtml(g);
        })
        .join(", ");
    }

    function buildHangulHanjaCompare() {
      // 시기 배열: ages = [말년, 초년, 장년, 중년] → 말할 때는 초·장·중·말 순
      const PERIOD_ORDER = [
        { key: "초년", idx: 1 },
        { key: "장년", idx: 2 },
        { key: "중년", idx: 3 },
        { key: "말년", idx: 0 },
      ];

      function sideGoodAt(sArr, gArr, idx) {
        const s = sArr && sArr[idx];
        const g = gArr && gArr[idx];
        return (
          !!(s && s.data && suriGood(s.data)) || !!(g && g.name && gweGood(g))
        );
      }
      function sideBadAt(sArr, gArr, idx) {
        const s = sArr && sArr[idx];
        const g = gArr && gArr[idx];
        return (
          !!(s && s.data && suriBad(s.data)) || !!(g && g.name && gweBad(g))
        );
      }
      function goodMarksAt(idx) {
        const marks = [];
        if (nmS[idx] && nmS[idx].data && suriGood(nmS[idx].data)) {
          marks.push(suriPhrase(nmS[idx]));
        }
        if (nmG[idx] && nmG[idx].name && gweGood(nmG[idx])) {
          marks.push(gweNameHtml(nmG[idx]));
        }
        if (hasHanja) {
          if (hjS[idx] && hjS[idx].data && suriGood(hjS[idx].data)) {
            marks.push(suriPhrase(hjS[idx]));
          }
          if (hjG[idx] && hjG[idx].name && gweGood(hjG[idx])) {
            marks.push(gweNameHtml(hjG[idx]));
          }
        }
        return marks;
      }
      function badMarksAt(idx) {
        const marks = [];
        if (nmS[idx] && nmS[idx].data && suriBad(nmS[idx].data)) {
          marks.push(suriPhrase(nmS[idx]));
        }
        if (nmG[idx] && nmG[idx].name && gweBad(nmG[idx])) {
          marks.push(gweNameHtml(nmG[idx]));
        }
        if (hasHanja) {
          if (hjS[idx] && hjS[idx].data && suriBad(hjS[idx].data)) {
            marks.push(suriPhrase(hjS[idx]));
          }
          if (hjG[idx] && hjG[idx].name && gweBad(hjG[idx])) {
            marks.push(gweNameHtml(hjG[idx]));
          }
        }
        return marks;
      }

      const hgGoodAges = [];
      const hjGoodAges = [];
      const unionGood = [];
      const unionBad = [];
      let nameGoodCnt = 0;
      let nameBadCnt = 0;

      PERIOD_ORDER.forEach(function (pe) {
        const i = pe.idx;
        const hgOk = sideGoodAt(nmS, nmG, i);
        const hjOk = hasHanja && sideGoodAt(hjS, hjG, i);
        const hgBad = sideBadAt(nmS, nmG, i);
        const hjBad = hasHanja && sideBadAt(hjS, hjG, i);
        if (hgOk) hgGoodAges.push(pe.key);
        if (hjOk) hjGoodAges.push(pe.key);
        const gMarks = goodMarksAt(i);
        const bMarks = badMarksAt(i);
        nameGoodCnt += gMarks.length;
        nameBadCnt += bMarks.length;
        if (gMarks.length) {
          unionGood.push({ key: pe.key, marks: gMarks });
        }
        if (bMarks.length) {
          unionBad.push({ key: pe.key, marks: bMarks });
        }
        // unused but keep for clarity
        void (hgBad || hjBad);
      });

      let p = "";
      p += "이름 전체의 기운으로 보면 ";
      if (!unionBad.length && !unionGood.length) {
        p += "시기별로 뚜렷한 길·흉이 한쪽으로 기울지 않습니다. ";
      } else {
        if (unionGood.length) {
          p +=
            paintBlue("길한 시기") +
            "는 " +
            unionGood
              .map(function (x) {
                return x.key;
              })
              .join("·") +
            "이고, ";
        } else {
          p += "뚜렷이 길한 시기는 없고, ";
        }
        if (unionBad.length) {
          p +=
            paintRed("흉한 시기") +
            "는 " +
            unionBad
              .map(function (x) {
                return x.key;
              })
              .join("·") +
            "입니다. ";
        } else {
          p += "뚜렷한 흉 시기는 드뭅니다. ";
        }
      }

      if (hwagtCount >= 2) {
        p +=
          "「화택규」는 천추원한 백골혼·추락·낙상·교통사고로 뼈를 다치는 기운인데 " +
          hwagtCount +
          "개나 있어 좋은 이름이라고 할 수 없습니다. 화택규의 질병은 뼈를 크게 다친다거나(목·허리 등 모든 디스크·관절이 전부 포함됩니다) 기관지를 조심하셔야 합니다. 둘 중 하나라도 흉수리를 만나면 사고가 나기 쉽습니다. ";
      } else if (unionGood.length === 4) {
        p +=
          "초년·장년·중년·말년에 길괘·길수리가 두루 나오니 좋은 이름입니다. ";
      } else if (unionGood.length >= 3 && unionBad.length <= 1) {
        p +=
          "밝은 시기가 많아 이름 전체로 보면 좋은 이름으로 읽힙니다. ";
      } else if (unionGood.length >= 2 && unionGood.length > unionBad.length) {
        p +=
          "길한 시기가 흉한 시기보다 많아 이름 전체로는 살릴 만한 흐름입니다. ";
      } else if (unionBad.length >= 3) {
        p +=
          "흉한 시기가 많아 이름 전체를 다시 살펴 고치는 편이 낫습니다. ";
      }

      if (hasB) {
        let birthGoodCnt = 0;
        let birthBadCnt = 0;
        PERIOD_ORDER.forEach(function (pe) {
          const i = pe.idx;
          if (bdS[i] && bdS[i].data && suriGood(bdS[i].data)) birthGoodCnt++;
          if (bdS[i] && bdS[i].data && suriBad(bdS[i].data)) birthBadCnt++;
          if (bdG[i] && bdG[i].name && gweGood(bdG[i])) birthGoodCnt++;
          if (bdG[i] && bdG[i].name && gweBad(bdG[i])) birthBadCnt++;
        });
        if (
          hwagtCount >= 2 ||
          unionBad.length >= 3
        ) {
          // 화택규 중복·흉 시기 많으면 이름>사주 칭찬 금지
          if (
            birthGoodCnt > nameGoodCnt ||
            nameBadCnt > birthBadCnt
          ) {
            p =
              "타고난 사주가 이름보다 훨씬 낫습니다. 이름의 무거운 기운이 사주의 힘을 깎아 먹기 쉽습니다. " +
              p;
          } else {
            p =
              "이름과 사주를 견줘도 이 이름을 사주보다 좋다고 할 수 없습니다. " + p;
          }
        } else if (
          nameGoodCnt > birthGoodCnt &&
          nameBadCnt <= birthBadCnt
        ) {
          p =
            "이 이름은 사주보다 좋습니다. " + p;
        } else if (
          birthGoodCnt > nameGoodCnt &&
          birthBadCnt <= nameBadCnt
        ) {
          p =
            "사주가 이름보다 좋습니다. 이름이 사주를 받쳐 주지 못하는 자리가 있습니다. " +
            p;
        } else if (nameBadCnt > birthBadCnt) {
          p =
            "사주가 이름보다 좋습니다. 이름 쪽에 흉한 기운이 더 많아 사주가 무난해도 이름이 사주를 누르기 쉽습니다. " +
            p;
        } else if (birthBadCnt > nameBadCnt) {
          p =
            "이 이름은 사주보다 좋습니다. 사주에 흉한 기운이 더 많아, 이름이 그 부담을 덜어 줍니다. " +
            p;
        } else {
          p =
            "이름과 사주가 비슷합니다. 어느 한쪽이 뚜렷이 낫다고 자르기 어렵습니다. " +
            p;
        }
      }

      const mitByAge = { 초년: [], 장년: [], 중년: [], 말년: [] };
      function addMitAt(ageKey, g) {
        if (!g || !g.name || !isMitigateSuriHex(g)) return;
        const n = gweNameOf(g);
        const list = mitByAge[ageKey];
        if (!list) return;
        for (let i = 0; i < list.length; i++) {
          if (gweNameOf(list[i]) === n) return;
        }
        list.push(g);
      }
      ["초년", "장년", "중년", "말년"].forEach(function (ak) {
        addMitAt(ak, gweAtAge(nmG, ages, ak));
        if (hasHanja) addMitAt(ak, gweAtAge(hjG, ages, ak));
      });
      const mitAll = [];
      const mitSeen = {};
      ["초년", "장년", "중년", "말년"].forEach(function (ak) {
        (mitByAge[ak] || []).forEach(function (g) {
          const n = gweNameOf(g);
          if (mitSeen[n]) return;
          mitSeen[n] = true;
          mitAll.push(g);
        });
      });
      if (mitAll.length) {
        p +=
          "사주에 흉이 있더라도 이름에 흉이 있으면 무조건 나쁜 이름입니다. 나쁜 사주를 시기별로 맞춰 눌러 주는 기운으로 지어야 좋은 이름이고 보완이 됩니다. 눌러 주는 기운은 화천대유·화수미제·이위화·화풍정·산천대축·수풍정·뇌천대장입니다. 이 이름에는 " +
          joinGweNames(mitAll) +
          "가 있습니다. ";
        const onlyJung =
          mitByAge["중년"].length > 0 &&
          mitByAge["초년"].length === 0 &&
          mitByAge["장년"].length === 0 &&
          mitByAge["말년"].length === 0;
        const jungHeavy =
          mitByAge["중년"].length > 0 &&
          mitByAge["초년"].length +
            mitByAge["장년"].length +
            mitByAge["말년"].length ===
            0;
        if (onlyJung || jungHeavy) {
          p +=
            "다만 그 길괘가 중년에만 있어 짧은 시기(약 5년)만 커버할 뿐, 초년·장년·말년의 무거운 기운까지 막아 주지는 못합니다. 중년 길괘만 보고 좋은 이름·균형 잡힌 이름이라고 하면 안 됩니다. ";
        } else {
          p +=
            "이 길괘들은 자기 나이대에만 영향을 주니, 다른 시기의 흉까지 한꺼번에 덮어 준다고 보면 안 됩니다. ";
        }
      } else if (hasB) {
        p +=
          "사주에 흉이 있더라도 이름에 흉이 있으면 무조건 나쁜 이름입니다. 나쁜 사주를 시기별로 맞춰 눌러 주는 기운(화천대유·화수미제·이위화·화풍정·산천대축·수풍정·뇌천대장)으로 지어야 좋은 이름이고 보완이 됩니다. ";
      }
      return p;
    }

    function buildNameVsBirthCompare(onlyTurns) {
      if (!hasB && !onlyTurns) return "";
      const ORDER = [
        { key: "초년", idx: 1 },
        { key: "장년", idx: 2 },
        { key: "중년", idx: 3 },
        { key: "말년", idx: 0 },
      ];
      if (onlyTurns) return buildTurnList();

      function toneOf(sArr, gArr, idx) {
        const s = sArr && sArr[idx];
        const g = gArr && gArr[idx];
        // 흉수리+검정 괘 → 무조건 흉 (검정을 길로 세거나 길흉혼재로 완화 금지)
        if (hasBadSuriBlackHex(s, g)) return "흉";
        // 흉수리+눌러 주는 길괘 → 흉 기능 상실·길괘 배가 → 길 (길흉 섞임 금지)
        if (hasBadSuriMitigateHex(s, g)) return "길";
        let good = 0;
        let bad = 0;
        if (s && s.data && suriGood(s.data)) good++;
        if (s && s.data && suriBad(s.data)) bad++;
        if (g && g.name && gweGood(g)) good++;
        if (g && g.name && gweBad(g)) bad++;
        if (bad && !good) return "흉";
        if (good && !bad) return "길";
        if (good && bad) return "길흉혼재";
        return "평이";
      }
      function nameToneAt(idx) {
        const a = toneOf(nmS, nmG, idx);
        if (!hasHanja) return a;
        const b = toneOf(hjS, hjG, idx);
        // 한쪽이라도 흉수리+검정이면 길흉혼재로 완화하지 않고 흉
        if (
          hasBadSuriBlackHex(nmS[idx], nmG[idx]) ||
          hasBadSuriBlackHex(hjS[idx], hjG[idx])
        ) {
          if (a === "흉" || b === "흉") return "흉";
        }
        if (a === "흉" || b === "흉") {
          if (a === "길" || b === "길") return "길흉혼재";
          return "흉";
        }
        if (a === "길흉혼재" || b === "길흉혼재") return "길흉혼재";
        if (a === "길" || b === "길") return "길";
        return "평이";
      }
      function sajuToneAt(idx) {
        return toneOf(bdS, bdG, idx);
      }
      function toneSpeak(t) {
        if (t === "길") return paintBlue("길");
        if (t === "흉") return paintRed("흉");
        if (t === "길흉혼재") return "길·흉이 섞임";
        return "평이";
      }
      function joinKeys(arr) {
        return (arr || []).join("·");
      }

      const nameGood = [];
      const nameBad = [];
      const nameMixed = [];
      const sajuGood = [];
      const sajuBad = [];
      const sajuMixed = [];
      const nameLines = [];
      const sajuLines = [];
      const vsLines = [];
      const turns = [];
      const helpAges = [];
      const worstAges = [];
      const hitAges = [];

      ORDER.forEach(function (pe) {
        const nt = nameToneAt(pe.idx);
        const st = sajuToneAt(pe.idx);
        nameLines.push(pe.key + "은 " + toneSpeak(nt));
        sajuLines.push(pe.key + "은 " + toneSpeak(st));
        if (nt === "길") nameGood.push(pe.key);
        else if (nt === "흉") nameBad.push(pe.key);
        else if (nt === "길흉혼재") nameMixed.push(pe.key);
        if (st === "길") sajuGood.push(pe.key);
        else if (st === "흉") sajuBad.push(pe.key);
        else if (st === "길흉혼재") sajuMixed.push(pe.key);

        let vs = pe.key + "에는 ";
        if (nt === "흉" && (st === "길" || st === "평이")) {
          vs +=
            "사주보다 이름이 무거워 " +
            paintRed("이름이 고통을 주는 쪽") +
            "입니다";
          turns.push(pe.key + "(이름이 사주에 고통)");
          hitAges.push(pe.key);
        } else if (nt === "흉" && st === "흉") {
          vs +=
            paintRed("최악") +
            " — 이름의 흉이 사주의 흉과 마주쳐 고통을 줍니다";
          turns.push(pe.key + "(이름흉·사주흉 마주침·최악)");
          worstAges.push(pe.key);
        } else if (
          (nt === "길" || nt === "길흉혼재") &&
          st === "흉"
        ) {
          vs +=
            "사주는 무거운데 이름이 받쳐 " +
            paintBlue("이름이 돕는·눌러 주는 쪽") +
            "입니다";
          turns.push(pe.key + "(이름이 사주를 도와·눌러 줌)");
          helpAges.push(pe.key);
        } else if (nt === "길" && st === "길") {
          vs += "이름과 사주가 함께 열려 흐름이 힘찹니다";
        } else if (nt === "길흉혼재" && st === "길") {
          vs +=
            "사주는 열리는데 이름에 흉이 섞여 이름이 사주에 일부 고통을 줍니다";
          turns.push(pe.key + "(이름이 사주에 일부 고통)");
          hitAges.push(pe.key);
        } else if (nt === "평이" && st === "길") {
          vs += "사주가 더 밝은 쪽입니다";
        } else if (nt === "평이" && st === "흉") {
          vs += "사주가 더 무거운 쪽입니다";
        } else {
          vs += "이름과 사주가 크게 기울지 않습니다";
        }
        vsLines.push(vs);
      });

      let p =
        "먼저 이름 기운이 어느 시기에 길했고 어느 시기에 흉이었는지 보면, " +
        nameLines.join(", ") +
        "입니다. ";
      if (nameGood.length) {
        p +=
          "이름이 " +
          paintBlue("길이었던 시기") +
          "는 " +
          joinKeys(nameGood) +
          "이고, ";
      } else {
        p += "이름이 뚜렷이 길이었던 시기는 없고, ";
      }
      if (nameBad.length) {
        p +=
          paintRed("흉했던 시기") +
          "는 " +
          joinKeys(nameBad) +
          "입니다. ";
      } else if (nameMixed.length) {
        p +=
          "길·흉이 섞인 시기는 " + joinKeys(nameMixed) + "입니다. ";
      } else {
        p += "뚜렷한 흉 시기도 드뭅니다. ";
      }
      if (nameMixed.length && nameBad.length) {
        p +=
          "길·흉이 섞인 시기는 " + joinKeys(nameMixed) + "입니다. ";
      }

      p +=
        "다음으로 사주 기운이 어느 시기에 길했고 어느 시기에 흉이었는지 보면, " +
        sajuLines.join(", ") +
        "입니다. ";
      if (sajuGood.length) {
        p +=
          "사주가 " +
          paintBlue("길이었던 시기") +
          "는 " +
          joinKeys(sajuGood) +
          "이고, ";
      } else {
        p += "사주가 뚜렷이 길이었던 시기는 없고, ";
      }
      if (sajuBad.length) {
        p +=
          paintRed("흉했던 시기") +
          "는 " +
          joinKeys(sajuBad) +
          "입니다. ";
      } else if (sajuMixed.length) {
        p +=
          "길·흉이 섞인 시기는 " + joinKeys(sajuMixed) + "입니다. ";
      } else {
        p += "뚜렷한 흉 시기도 드뭅니다. ";
      }
      if (sajuMixed.length && sajuBad.length) {
        p +=
          "길·흉이 섞인 시기는 " + joinKeys(sajuMixed) + "입니다. ";
      }

      p +=
        "이름 전체 기운과 사주 전체 기운을 나이대별로 길흉을 견주면, " +
        vsLines.join(", ") +
        ". ";
      if (turns.length) {
        p +=
          "삶의 변곡점은 " +
          turns.join(", ") +
          "로 읽힙니다. ";
      }

      function buildTurnList() {
        const AGE_S = { 초년: [1, 23], 장년: [24, 40], 중년: [41, 55] };
        const AGE_G = { 초년: [1, 30], 장년: [31, 50], 중년: [51, 55] };
        const nameArrs = [[nmS, nmG]].concat(hasHanja ? [[hjS, hjG]] : []);
        const sajuArrs = [[bdS, bdG]];
        function anyBad(arrs, idx, hex) {
          return arrs.some(function (a) {
            const x = hex ? a[1] && a[1][idx] : a[0] && a[0][idx];
            return hex ? !!(x && x.name && gweBad(x)) : !!(x && x.data && suriBad(x.data));
          });
        }
        function marks(arrs, idx, bad) {
          const m = [];
          arrs.forEach(function (a) {
            const s = a[0] && a[0][idx];
            const g = a[1] && a[1][idx];
            if (s && s.data && (bad ? suriBad(s.data) : suriGood(s.data))) m.push(suriPhrase(s));
            if (g && g.name && (bad ? gweBad(g) : gweGood(g))) m.push(gweNameHtml(g));
          });
          return m.filter(function (x, i) { return m.indexOf(x) === i; }).join("·");
        }
        function range(pe, arrs) {
          if (pe.key === "말년") return "56세 이후";
          const useS = anyBad(arrs, pe.idx, false);
          const useG = anyBad(arrs, pe.idx, true);
          const a = [];
          if (useS || !useG) a.push(AGE_S[pe.key]);
          if (useG) a.push(AGE_G[pe.key]);
          return Math.min.apply(null, a.map(function (x) { return x[0]; })) + "~" +
            Math.max.apply(null, a.map(function (x) { return x[1]; })) + "세";
        }
        const WEALTH = ["화천대유", "화수미제", "수풍정", "산천대축", "뇌천대장"];
        function wealthMarks(idx, skipSides) {
          const m = [];
          let last = "";
          const who = [[hasHanja ? "한글" : "이름", nmG]].concat(hasHanja ? [["한문", hjG]] : []).concat(hasB ? [["사주", bdG]] : []);
          who.forEach(function (w) {
            if (skipSides && skipSides.indexOf(w[0]) >= 0) return;
            const g = w[1] && w[1][idx];
            if (!g || !g.name) return;
            const n = gweNameOf(g);
            if (WEALTH.some(function (x) { return n === x || n.indexOf(x) === 0; })) {
              m.push(w[0] + " " + gweNameHtml(g));
              last = n;
            }
          });
          return { html: m.join("·"), last: last };
        }
        function rangeG(pe) {
          if (pe.key === "말년") return "56세 이후";
          const g = AGE_G[pe.key];
          return g[0] + "~" + g[1] + "세";
        }
        /** 흉수리 + 눌러 주는 괘(같은 자리) → 수리의 단점이 장점으로 승화 (보흘 지정 · 빠뜨리지 말 것) */
        function sublimeAt(idx, skipSaju) {
          const who = [[hasHanja ? "한글" : "이름", nmS, nmG]]
            .concat(hasHanja ? [["한문", hjS, hjG]] : [])
            .concat(hasB && !skipSaju ? [["사주", bdS, bdG]] : []);
          const out = [];
          const sides = [];
          who.forEach(function (w) {
            const s = w[1] && w[1][idx];
            const g = w[2] && w[2][idx];
            if (!hasBadSuriMitigateHex(s, g)) return;
            const sn = plainSuriName(s);
            const gn = gweNameOf(g);
            sides.push(w[0]);
            out.push(
              w[0] + " " + suriPhrase(s) + " 아래 " + gweNameHtml(g) + josaIGA(gn) + " " +
                sn + josaEuro(sn) + " 인한 고통·재난 등을 " + paintBlue("눌러 주니") +
                ", 그 수리의 단점이 " + paintBlue("장점으로 승화") + "됩니다. " +
                (isWealthFortuneHex(g) ? "더 큰 " + paintBlue("재물운") + "으로 변화가 일어나니 " : "") +
                "고난 끝에 행복이 온답니다."
            );
          });
          return { html: out.join(" "), sides: sides };
        }
        /** 사주 말년(총운) = 사주 전체 기운의 축 — 이 사주가 어떻게 살라고 했는지의 중심 (보흘 지정) */
        function axisHead(s, g) {
          return [s && s.data ? suriPhrase(s) : "", g && g.name ? gweNameHtml(g) : ""].filter(Boolean).join("·");
        }
        function axisTone(s, g, noun) {
          let t = axisToneBase(s, g, noun);
          const trait = blackHexTrait(g);
          if (trait && !(s && s.data && suriBad(s.data))) {
            const gn = gweNameOf(g);
            t += "주역괘 " + gweNameHtml(g) + josaEunNeun(gn) + " " + trait + " ";
          }
          return t;
        }
        function axisToneBase(s, g, noun) {
          const sOk = !!(s && s.data);
          const gOk = !!(g && g.name);
          const sn = sOk ? plainSuriName(s) : "";
          const gn = gOk ? gweNameOf(g) : "";
          const gh = gOk ? gweNameHtml(g) : "";
          if (hasBadSuriMitigateHex(s, g)) {
            return (
              sn + josaEuro(sn) + " 약간의 시련이 있지만 주역괘 " + gh + josaEunNeun(gn) +
              " 나쁘지 않은 편이고, 오히려 " + sn + josaEuro(sn) + " 인한 고통·재난 등을 " +
              paintBlue("눌러 주니") + " 그 수리의 단점이 " + paintBlue("장점으로 승화") + "됩니다. " +
              (isWealthFortuneHex(g) ? "더 큰 " + paintBlue("재물운") + "으로 변화가 일어나니 " : "") +
              "고난 끝에 행복이 온답니다. "
            );
          }
          if (sOk && suriBad(s.data) && gOk && gweBad(g))
            return "수리와 주역괘가 모두 " + paintRed("흉") + "하여 평생 시련이 따르기 쉬운 " + noun + "입니다. ";
          if (hasBadSuriBlackHex(s, g)) {
            const w = blackWeakShort(s, g);
            return (
              sn + josaEuro(sn) + " 시련이 있고, 보통 괘인 " + gh + josaIGA(gn) +
              " 눌러 주지 못해 그 흉이 더 드러나기 쉽습니다. " + (w ? w + " " : "")
            );
          }
          if (sOk && suriBad(s.data))
            return sn + josaEuro(sn) + " 시련이 있지만 주역괘 " + gh + josaEunNeun(gn) + " 좋은 편입니다. ";
          if (gOk && gweBad(g))
            return "수리는 괜찮지만 주역괘 " + gh + josaIGA(gn) + " " + paintRed("흉") + "하여 시련이 따릅니다. ";
          if (sOk && suriGood(s.data) && gOk && gweGood(g))
            return "수리와 주역괘가 모두 " + paintBlue("길") + "하여 든든한 " + noun + "입니다. ";
          if (sOk && suriGood(s.data)) return "수리가 " + paintBlue("길") + "하여 무난한 편입니다. ";
          if (gOk && gweGood(g)) return "주역괘 " + gh + josaIGA(gn) + " " + paintBlue("길") + "하여 무난한 편입니다. ";
          return "";
        }
        function sajuAxisHtml() {
          if (!hasB) return "";
          const s = bdS[0];
          const g = bdG[0];
          if (!(s && s.data) && !(g && g.name)) return "";
          return (
            "<strong>사주의 중심</strong> — 사주 전체 기운의 축인 말년(총운)은 " + axisHead(s, g) + "입니다. " +
            axisTone(s, g, "사주") +
            "말년 기운은 인생 전반에 영향력을 행사하니, 이 사주가 어떻게 살라고 했는지의 중심이 여기입니다."
          );
        }
        /** 한글·한문 이름 말년(총운) = 이름 전체 기운의 축 (보흘 지정) */
        function nameAxisHtml() {
          const sides = [[hasHanja ? "한글" : "이름", nmS[0], nmG[0]]];
          if (hasHanja) sides.push(["한문", hjS[0], hjG[0]]);
          const valid = sides.filter(function (x) {
            return (x[1] && x[1].data) || (x[2] && x[2].name);
          });
          if (!valid.length) return "";
          const same =
            valid.length === 2 &&
            axisHead(valid[0][1], valid[0][2]) === axisHead(valid[1][1], valid[1][2]);
          let t = "<strong>이름의 중심</strong> — 이름 전체 기운의 축인 말년(총운)은 ";
          if (same || valid.length === 1) {
            t +=
              (same ? "한글·한문 모두 " : "") + axisHead(valid[0][1], valid[0][2]) + "입니다. " +
              axisTone(valid[0][1], valid[0][2], "이름");
          } else {
            t +=
              valid.map(function (x) { return x[0] + " " + axisHead(x[1], x[2]); }).join(", ") + "입니다. " +
              valid
                .map(function (x) {
                  const tone = axisTone(x[1], x[2], "이름");
                  return tone ? x[0] + "은 " + tone : "";
                })
                .join("");
          }
          return (
            t +
            (hasB
              ? "이름의 말년 기운도 인생 전반에 영향력을 행사하니, 이 중심이 사주의 중심을 도와 주는지 치는지가 좋은 이름·나쁜 이름을 가릅니다."
              : "이름의 말년 기운은 인생 전반에 영향력을 행사합니다.")
          );
        }
        const lastT = nameToneAt(0);
        const lastBadM = marks(nameArrs, 0, true);
        const lastGoodM = marks(nameArrs, 0, false);
        const nameMalPress = malPressHexes(nameArrs);
        const sajuMalPress = hasB ? malPressHexes([[bdS, bdG]]) : [];
        /** 말년(총운)의 눌러 주는 괘 = 다른 시기 흉을 도와주는 지원군 (보흘 지정) */
        function malSupportNote(lead) {
          if (!nameMalPress.length) return "";
          const last = nameMalPress[nameMalPress.length - 1].name;
          let t =
            " " + lead + "말년(총운)의 " + pressHtml(nameMalPress) +
            (josaIGA(last) === "이" ? "이라는 " : "라는 ") + paintBlue("지원군") +
            "이 도와주니, 달리기 하다가 발목이 삐끗하는 수준의 부상 정도로 끝납니다.";
          if (sajuMalPress.length) {
            const sl = sajuMalPress[sajuMalPress.length - 1].name;
            t += " 사주 말년에도 " + pressHtml(sajuMalPress) + josaIGA(sl) +
              " 있으니 그런 흉은 " + paintBlue("살짝 스크래치만 남기고 사라집니다") + ".";
          }
          return t;
        }
        function malSublimeNote(idx) {
          if (!nameMalPress.length) return "";
          const s = [[nmS, nmG]].concat(hasHanja ? [[hjS, hjG]] : [])
            .map(function (a) { return hasBadSuriMitigateHex(a[0][idx], a[1][idx]) ? a[0][idx] : null; })
            .filter(Boolean)[0];
          if (!s) return "";
          const last = nameMalPress[nameMalPress.length - 1].name;
          return " 여기에 말년(총운)의 " + pressHtml(nameMalPress) + josaIGA(last) +
            " 한 번 더 눌러 주니 " + paintRed(s.suri + ", " + plainSuriName(s)) + "의 흉은 " +
            paintBlue("작동하지 않습니다") + "." +
            (sajuMalPress.length
              ? " 사주 말년에도 " + pressHtml(sajuMalPress) + josaIGA(sajuMalPress[sajuMalPress.length - 1].name) +
                " 있어 남는 흉이 있어도 살짝 스크래치 정도입니다."
              : "");
        }
        const NUM = ["①", "②", "③", "④"];
        const KNUM = ["", "한", "두", "세", "네"];
        const lines = [];
        const tps = [];
        let nameBadAny = false;
        let nameBadBare = false;
        let helped = false;
        let sajuSurface = false;
        let nameGoodAny = false;
        [ORDER[3], ORDER[0], ORDER[1], ORDER[2]].forEach(function (pe) {
          const nt = nameToneAt(pe.idx);
          const st = sajuToneAt(pe.idx);
          const both = nameArrs.concat(sajuArrs);
          let txt = "";
          let tp = false;
          let rg = "";
          let worst = false;
          let skip = false;
          let supported = false;
          const axisSaju = pe.idx === 0 && hasB && hasBadSuriMitigateHex(bdS[0], bdG[0]);
          const sub = sublimeAt(pe.idx, axisSaju);
          const wm = wealthMarks(pe.idx, axisSaju ? sub.sides.concat(["사주"]) : sub.sides);
          if (nt === "길") nameGoodAny = true;
          const hgBad = toneOf(nmS, nmG, pe.idx) === "흉";
          const hjBad = hasHanja && toneOf(hjS, hjG, pe.idx) === "흉";
          const sajuHasBad = hasB && (st === "흉" || st === "길흉혼재");
          if (hgBad && hjBad && !sajuHasBad) {
            tp = true;
            worst = true;
            nameBadAny = true;
            nameBadBare = true;
            rg = range(pe, nameArrs);
            txt = "한글 " + marks([[nmS, nmG]], pe.idx, true) + " × 한문 " + marks([[hjS, hjG]], pe.idx, true) +
              " — " + paintRed("한글과 한문 이름이 함께 흉이라 위기가 겹친 변곡점입니다. 아직도 살아 있다는게 신기합니다.");
          } else if (nt === "흉" && sajuHasBad) {
            tp = true;
            worst = true;
            nameBadAny = true;
            nameBadBare = true;
            rg = range(pe, both);
            txt = "이름 " + marks(nameArrs, pe.idx, true) + " × 사주 " + marks(sajuArrs, pe.idx, true) +
              " — " + paintRed("이름 흉과 사주 흉이 마주친 최악의 변곡점입니다. 아직도 살아 있다는게 신기합니다.");
          } else if (nt === "흉" || (nt === "길흉혼재" && st !== "흉")) {
            tp = true;
            nameBadAny = true;
            rg = range(pe, nameArrs);
            const nm = marks(nameArrs, pe.idx, true);
            txt = st === "길"
              ? "이름 " + nm + " — 이름 흉이 좋은 사주(" + marks(sajuArrs, pe.idx, false) + ")를 치는 변곡점입니다."
              : "이름 " + nm + " — 이름 흉이 드러나는 변곡점입니다.";
            let propped = false;
            if (hasHanja) {
              const hgT = toneOf(nmS, nmG, pe.idx);
              const hjT = toneOf(hjS, hjG, pe.idx);
              if ((hgT === "흉" || hgT === "길흉혼재") && hjT === "길") {
                propped = true;
                txt += " 다만 한문(속)의 " + marks([[hjS, hjG]], pe.idx, false) + " 기운이 일부 받쳐 줍니다.";
              } else if ((hjT === "흉" || hjT === "길흉혼재") && hgT === "길") {
                propped = true;
                txt += " 다만 한글(겉)의 " + marks([[nmS, nmG]], pe.idx, false) + " 기운이 일부 받쳐 줍니다.";
              }
            }
            if (pe.idx !== 0 && nameMalPress.length) {
              txt += malSupportNote(propped ? "받쳐 주는 기운이 다 막지 못한 흉도 " : "이 흉도 ");
              supported = true;
            } else {
              nameBadBare = true;
            }
          } else if ((st === "흉" || st === "길흉혼재") && (anyBad(sajuArrs, pe.idx, false) || anyBad(sajuArrs, pe.idx, true))) {
            rg = range(pe, sajuArrs);
            const sm = marks(sajuArrs, pe.idx, true);
            if (nt === "길" || nt === "길흉혼재") {
              helped = true;
              txt = "사주의 흉(" + sm + ")을 이름(" + marks(nameArrs, pe.idx, false) + ")이 " +
                paintBlue("눌러 주는 시기") + "입니다.";
              if (anyBad(sajuArrs, pe.idx, true)) {
                tp = true;
                txt += " 다만 사주의 흉괘는 막기가 힘이 들어 변곡점이 됩니다.";
              }
            } else {
              tp = true;
              sajuSurface = true;
              txt = "사주 " + sm + " — 이름이 막아 주지 못해 사주 흉이 그대로 드러나는 변곡점입니다.";
            }
          } else {
            skip = true;
          }
          const badTp = tp;
          if (wm.html) {
            if (skip) {
              rg = rangeG(pe);
              txt = "주역 " + wm.html + josaEuro(wm.last) + " " + paintBlue("재물운이 들어오는 변곡점") + "입니다.";
            } else {
              txt += " 주역 " + wm.html + josaEuro(wm.last) + " " + paintBlue("재물운도 함께 들어오는 시기") + "입니다.";
            }
            tp = true;
          }
          if (sub.html) {
            if (skip && !wm.html) {
              rg = rangeG(pe);
              txt = sub.html;
            } else {
              txt += " " + sub.html;
            }
            if (pe.idx !== 0) {
              const ms = malSublimeNote(pe.idx);
              if (ms) {
                txt += ms;
                supported = true;
              }
            }
            tp = true;
          } else if (skip && !wm.html) {
            return;
          }
          if (pe.idx !== 0) {
            [[hasHanja ? "한글" : "이름", nmS, nmG]]
              .concat(hasHanja ? [["한문", hjS, hjG]] : [])
              .concat(hasB ? [["사주", bdS, bdG]] : [])
              .forEach(function (w) {
                const s = w[1] && w[1][pe.idx];
                const g = w[2] && w[2][pe.idx];
                const bw = blackWeakShort(s, g);
                if (bw) txt += " " + w[0] + " " + axisHead(s, g) + " — " + bw;
              });
          }
          if (badTp && pe.key !== "말년") {
            if (worst && lastT === "흉" && lastBadM)
              txt += " 총운 " + lastBadM + paintRed("까지 흉이라 이 변곡점 하나에 목숨이 위태로울 수도 있답니다.");
            else if (lastT === "흉" && lastBadM) txt += " 총운 " + lastBadM + "까지 겹쳐 시련이 가중됩니다.";
            else if (lastT === "길" && lastGoodM && !supported)
              txt += " 총운 " + lastGoodM + josaIGA(lastGoodM.replace(/<[^>]+>/g, "")) + " 흉을 덜어 줍니다.";
          }
          if (badTp && pe.key === "말년") txt += " 총운이라 앞 시기에도 영향을 줍니다.";
          if (tp) tps.push(pe.key);
          const label = pe.key === "말년" ? "말년·총운" : pe.key;
          lines.push((tp ? NUM[tps.length - 1] + " " : "· ") + "<strong>" + label + "(" + rg + ")</strong>: " + txt);
        });
        let verdict;
        if (nameBadAny && !nameBadBare) verdict = paintBlue("흉이 길로 승화하니 아주 좋은 이름입니다.");
        else if (nameBadAny) verdict = paintRed("이 이름은 나쁜 이름입니다. 반드시 개명을 하셔야 합니다.");
        else if (helped) verdict = paintBlue("이름 기운이 나쁜 사주를 도와주고 있으니 좋은 이름을 가졌네요.");
        else if (sajuSurface)
          verdict = "이름이 나쁘지는 않지만 사주의 흉을 막아 주지 못하니, 사주를 눌러 주는 이름으로 개명을 생각해 보셔야 합니다.";
        else if (nameGoodAny) verdict = paintBlue("이름과 사주가 함께 편안하니 좋은 이름을 가졌네요.");
        else verdict = "이름과 사주에 큰 흉이 없어 무난한 이름입니다.";
        const axis = [sajuAxisHtml(), nameAxisHtml()].filter(Boolean).join("<br><br>");
        return (axis ? axis + "<br><br>" : "") + "<strong>변곡점</strong> — " +
          (hasB
            ? "이름과 탄생일을 시기별로 견주면 삶의 변곡점이 드러납니다. "
            : hasHanja
              ? "한글 이름과 한문 이름을 시기별로 견주면 삶의 변곡점이 드러납니다. "
              : "이름을 시기별로 보면 삶의 변곡점이 드러납니다. ") +
          (tps.length
            ? "이 사람의 변곡점은 " + tps.join("·") + ", " + KNUM[tps.length] + " 곳입니다."
            : "시기별로 뚜렷한 변곡점이 없습니다.") +
          (lines.length ? "<br>" + lines.join("<br>") : "") +
          "<br>" + verdict;
      }

      const nameGoodCnt = nameGood.length;
      const nameBadCnt = nameBad.length;
      const birthGoodCnt = sajuGood.length;
      const birthBadCnt = sajuBad.length;
      // 보흘: 시기별로 사주를 도와·눌러 주면 좋은 이름 / 이름흉×사주흉 마주침=최악
      p +=
        " 좋은 이름·나쁜 이름은 시기별로 이름이 사주를 도와 주거나 나쁜 기운을 눌러 주는지를 견줘 판정합니다. 눌러 주는 기운은 화천대유·화수미제·이위화·화풍정·산천대축·수풍정·뇌천대장입니다. 이름의 흉이 사주의 흉을 마주치는 것은 " +
        paintRed("최악") +
        "입니다. ";
      if (worstAges.length) {
        p +=
          paintRed("최악") +
          " — " +
          joinKeys(worstAges) +
          "에 이름의 흉이 사주의 흉을 마주칩니다. 사주가 무거워도 이름이 같이 흉이면 무조건 나쁜 이름입니다.";
      } else if (helpAges.length && helpAges.length >= hitAges.length) {
        p +=
          "시기별로 보면 " +
          joinKeys(helpAges) +
          "에서 이름이 사주를 도와 주거나 눌러 주니 " +
          paintBlue("좋은 이름") +
          " 쪽으로 판정합니다.";
        if (hitAges.length) {
          p +=
            " 다만 " +
            joinKeys(hitAges) +
            "에서는 이름이 사주에 고통을 주는 자리가 남아 있습니다.";
        }
      } else if (hitAges.length || nameBadCnt > 0) {
        p +=
          paintRed("나쁜 이름") +
          "으로 판정합니다. 사주에 흉이 있더라도 이름에 흉이 있거나 사주에 고통을 주는 시기가 있으면 좋은 이름이라 할 수 없습니다.";
      } else if (hwagtCount >= 2) {
        p +=
          "이름과 사주를 견줘도 이 이름을 사주보다 좋다고 할 수 없습니다.";
      } else if (nameGoodCnt > birthGoodCnt) {
        p += "이 이름은 사주보다 좋습니다.";
      } else if (birthGoodCnt > nameGoodCnt) {
        p +=
          "사주가 이름보다 좋습니다. 이름이 사주를 받쳐 주지 못하는 자리가 있습니다.";
      } else {
        p +=
          "이름과 사주가 비슷하니, 위 나이대별 고통을 주는 쪽·변곡점을 함께 보십시오.";
      }
      return p;
    }

    const ohangNarr = buildOhangBlock(ctx);
    // 오행 → 사주 시기별 → 비교 맺음 → 이름 서술 (아래 sideToneAt 정의 후 삽입)

    // 앞머리 긴 총평·【주의】 나열은 넣지 않음 — 시기별 서술·결론만 (인쇄 가독)

    /** 한 자리(한글 또는 한자) 길·흉·혼재·평이 */
    function sideToneAt(sArr, gArr, idx) {
      const s = sArr && sArr[idx];
      const g = gArr && gArr[idx];
      // 흉수리+검정 괘 → 무조건 흉 (검정 괘를 길로 보지 않음)
      if (hasBadSuriBlackHex(s, g)) return "흉";
      // 흉수리+눌러 주는 길괘 → 흉 기능 상실·길괘 영향 배가 → 길 (길흉 섞임 금지)
      if (hasBadSuriMitigateHex(s, g)) return "길";
      let good = 0;
      let bad = 0;
      if (s && s.data && suriGood(s.data)) good++;
      if (s && s.data && suriBad(s.data)) bad++;
      if (g && g.name && gweGood(g)) good++;
      if (g && g.name && gweBad(g)) bad++;
      if (bad && !good) return "흉";
      if (good && !bad) return "길";
      if (good && bad) return "길흉혼재";
      return "평이";
    }
    function toneLabel(t) {
      if (t === "길") return paintBlue("길");
      if (t === "흉") return paintRed("흉");
      if (t === "길흉혼재") return "길·흉이 섞임";
      return "평이";
    }
    /** 보흘 지정: 해당 나이대 한글·한문 해설 끝에 반드시 견줌 */
    function compareHangulHanjaAtAge(ageKey, idx) {
      if (!hasHanja) return "";
      const ht = sideToneAt(nmS, nmG, idx);
      const jt = sideToneAt(hjS, hjG, idx);
      const hangulHard = hasBadSuriBlackHex(nmS[idx], nmG[idx]);
      const hanjaHard = hasBadSuriBlackHex(hjS[idx], hjG[idx]);
      let p =
        ageKey +
        "의 한글이름과 한자이름을 견주면, 한글은 " +
        toneLabel(ht) +
        "이고 한자는 " +
        toneLabel(jt) +
        "입니다. ";
      if (hangulHard || hanjaHard) {
        p +=
          "흉수리 아래 검정 보통 괘가 있으면 그 괘의 단점이 더 드러나니, 검정 괘를 길로 보거나 길·흉이 섞였다고 하면 안 됩니다.";
        if (hangulHard && hexNameStarts(nmG[idx], "화산려") && nmS[idx] && Number(nmS[idx].suri) === 14) {
          p +=
            " 한글의 「이산파멸」·「화산려」는 이산으로 가족과 헤어지고 역마살을 타 더 불안하고 힘든 생활로 읽습니다.";
        }
        if (hanjaHard && hexNameStarts(hjG[idx], "화산려") && hjS[idx] && Number(hjS[idx].suri) === 14) {
          p +=
            " 한자의 「이산파멸」·「화산려」는 이산으로 가족과 헤어지고 역마살을 타 더 불안하고 힘든 생활로 읽습니다.";
        }
      } else if (ht === "흉" && jt === "길") {
        p +=
          "겉(한글)은 무거운데 속(한자)은 열려, 겉으로 받기 어려운 시기에도 속으로는 버틸 힘이 있습니다.";
      } else if (ht === "길" && jt === "흉") {
        p +=
          "겉(한글)은 열려 보여도 속(한자)이 눌러, 겉으로 좋아 보여도 속이 흡족하지 않은 결과를 보입니다.";
      } else if (ht === "흉" && jt === "흉") {
        p +=
          "한글·한자가 함께 " +
          paintRed("흉") +
          "이라 이 시기 부담이 겹칩니다.";
      } else if (ht === "길" && jt === "길") {
        p +=
          "한글·한자가 함께 " +
          paintBlue("길") +
          "로 열려 이 시기 흐름이 힘찹니다.";
      } else if (ht === jt) {
        p += "한글과 한자의 결이 비슷하게 읽힙니다.";
      } else {
        p += "한글과 한자의 결이 엇갈리니 겉·속을 함께 보아야 합니다.";
      }
      return p;
    }
    /** 이름풀이 마지막: 초·장·중·말 전체 길흉 명시 */
    function buildNamePeriodGilHyungSummary() {
      const ORDER = [
        { key: "초년", idx: 1 },
        { key: "장년", idx: 2 },
        { key: "중년", idx: 3 },
        { key: "말년", idx: 0 },
      ];
      function nameToneAt(idx) {
        const a = sideToneAt(nmS, nmG, idx);
        if (!hasHanja) return a;
        const b = sideToneAt(hjS, hjG, idx);
        if (
          hasBadSuriBlackHex(nmS[idx], nmG[idx]) ||
          hasBadSuriBlackHex(hjS[idx], hjG[idx])
        ) {
          if (a === "흉" || b === "흉") return "흉";
        }
        if (a === "흉" || b === "흉") {
          if (a === "길" || b === "길") return "길흉혼재";
          return "흉";
        }
        if (a === "길흉혼재" || b === "길흉혼재") return "길흉혼재";
        if (a === "길" || b === "길") return "길";
        return "평이";
      }
      const lines = [];
      const goodKeys = [];
      const badKeys = [];
      const mixedKeys = [];
      ORDER.forEach(function (pe) {
        const t = nameToneAt(pe.idx);
        lines.push(pe.key + "은 " + toneLabel(t));
        if (t === "길") goodKeys.push(pe.key);
        else if (t === "흉") badKeys.push(pe.key);
        else if (t === "길흉혼재") mixedKeys.push(pe.key);
      });
      let p =
        "초년·장년·중년·말년 전체를 시기별로 보면, " +
        lines.join(", ") +
        "입니다. ";
      if (badKeys.length) {
        p +=
          paintRed("흉이었던 시기") +
          "는 " +
          badKeys.join("·") +
          "이고, ";
      } else {
        p += "뚜렷이 흉이었던 시기는 없고, ";
      }
      if (goodKeys.length) {
        p +=
          paintBlue("길이었던 시기") +
          "는 " +
          goodKeys.join("·") +
          "입니다.";
      } else {
        p += "뚜렷이 길이었던 시기는 드뭅니다.";
      }
      if (mixedKeys.length) {
        p +=
          " 길·흉이 섞인 시기는 " + mixedKeys.join("·") + "입니다.";
      }
      return p;
    }

    /**
     * 사주 시기별 — 먼저 한 줄 요약, 그다음 수리·주역 본문
     * 예: 사주 말년은 위세강중, 이위화로 좋은 기운이 들어 있고…
     */
    /**
     * 이름 vs 사주 — 같은 시기 수리·주역 내용을 짚고, 도움/침/최악을 분명히 말한다.
     * (길·흉 표시만으로 끝내지 않음 · 보흘 2026-09-24)
     */
    function buildNameHelpsHurtsParts() {
      if (!hasB) return { malRename: "", rest: "" };

      function nameMarksAt(idx) {
        const marks = [];
        if (nmS[idx] && nmS[idx].data) marks.push(suriPhrase(nmS[idx]));
        if (nmG[idx] && nmG[idx].name) marks.push(gweNameHtml(nmG[idx]));
        if (hasHanja) {
          if (hjS[idx] && hjS[idx].data) marks.push(suriPhrase(hjS[idx]));
          if (hjG[idx] && hjG[idx].name) marks.push(gweNameHtml(hjG[idx]));
        }
        return marks;
      }
      function nameSideBad(idx) {
        return (
          hasBadSuriBlackHex(nmS[idx], nmG[idx]) ||
          (nmS[idx] && nmS[idx].data && suriBad(nmS[idx].data)) ||
          (nmG[idx] && gweBad(nmG[idx])) ||
          (hasHanja &&
            (hasBadSuriBlackHex(hjS[idx], hjG[idx]) ||
              (hjS[idx] && hjS[idx].data && suriBad(hjS[idx].data)) ||
              (hjG[idx] && gweBad(hjG[idx]))))
        );
      }
      function nameSideGood(idx) {
        if (hasBadSuriBlackHex(nmS[idx], nmG[idx])) return false;
        if (hasHanja && hasBadSuriBlackHex(hjS[idx], hjG[idx])) return false;
        return (
          hasBadSuriMitigateHex(nmS[idx], nmG[idx]) ||
          (hasHanja && hasBadSuriMitigateHex(hjS[idx], hjG[idx])) ||
          (nmG[idx] && gweGood(nmG[idx])) ||
          (nmS[idx] && nmS[idx].data && suriGood(nmS[idx].data)) ||
          (hasHanja &&
            ((hjG[idx] && gweGood(hjG[idx])) ||
              (hjS[idx] && hjS[idx].data && suriGood(hjS[idx].data))))
        );
      }
      function sajuSideGood(idx) {
        if (hasBadSuriBlackHex(bdS[idx], bdG[idx])) return false;
        return (
          hasBadSuriMitigateHex(bdS[idx], bdG[idx]) ||
          (bdG[idx] && gweGood(bdG[idx])) ||
          (bdS[idx] && bdS[idx].data && suriGood(bdS[idx].data))
        );
      }
      function nameMitAt(idx) {
        return (
          hasBadSuriMitigateHex(nmS[idx], nmG[idx]) ||
          (hasHanja && hasBadSuriMitigateHex(hjS[idx], hjG[idx])) ||
          (nmG[idx] && isMitigateSuriHex(nmG[idx])) ||
          (hasHanja && hjG[idx] && isMitigateSuriHex(hjG[idx]))
        );
      }
      function nameBadMarksAt(idx) {
        const marks = [];
        if (
          nmS[idx] &&
          nmS[idx].data &&
          suriBad(nmS[idx].data) &&
          !isMitigateSuriHex(nmG[idx])
        )
          marks.push(suriPhrase(nmS[idx]));
        // 흉괘만 — 검정 보통 괘(뇌지예·풍수환 등)는 고통 목록에 넣지 않음 (보흘)
        if (nmG[idx] && nmG[idx].name && gweBad(nmG[idx]))
          marks.push(gweNameHtml(nmG[idx]));
        if (hasHanja) {
          if (
            hjS[idx] &&
            hjS[idx].data &&
            suriBad(hjS[idx].data) &&
            !isMitigateSuriHex(hjG[idx])
          )
            marks.push(suriPhrase(hjS[idx]));
          if (hjG[idx] && hjG[idx].name && gweBad(hjG[idx]))
            marks.push(gweNameHtml(hjG[idx]));
        }
        return marks;
      }
      function nameGoodMarksAt(idx) {
        const marks = [];
        if (nmS[idx] && nmS[idx].data && suriGood(nmS[idx].data))
          marks.push(suriPhrase(nmS[idx]));
        if (nmG[idx] && nmG[idx].name && gweGood(nmG[idx]))
          marks.push(gweNameHtml(nmG[idx]));
        if (hasHanja) {
          if (hjS[idx] && hjS[idx].data && suriGood(hjS[idx].data))
            marks.push(suriPhrase(hjS[idx]));
          if (hjG[idx] && hjG[idx].name && gweGood(hjG[idx]))
            marks.push(gweNameHtml(hjG[idx]));
        }
        if (nmG[idx] && isMitigateSuriHex(nmG[idx])) {
          const h = gweNameHtml(nmG[idx]);
          if (marks.indexOf(h) < 0) marks.push(h);
        }
        if (hasHanja && hjG[idx] && isMitigateSuriHex(hjG[idx])) {
          const h = gweNameHtml(hjG[idx]);
          if (marks.indexOf(h) < 0) marks.push(h);
        }
        return marks;
      }
      function joinMarks(arr) {
        return (arr || []).join(", ");
      }
      function nameMitMarksAt(idx) {
        const marks = [];
        if (nmG[idx] && isMitigateSuriHex(nmG[idx]))
          marks.push(gweNameHtml(nmG[idx]));
        if (hasHanja && hjG[idx] && isMitigateSuriHex(hjG[idx]))
          marks.push(gweNameHtml(hjG[idx]));
        return marks;
      }
      function isWealthMitAt(idx) {
        const gs = [nmG[idx], hasHanja ? hjG[idx] : null];
        for (let i = 0; i < gs.length; i++) {
          if (gs[i] && isWealthFortuneHex(gs[i]) && isMitigateSuriHex(gs[i]))
            return true;
          if (gs[i] && isWealthFortuneHex(gs[i])) return true;
        }
        return false;
      }

      // —— 보흘 서술: 말년(+개명) 먼저, 초·장·중은 사주시기별 한 줄 뒤에 ——
      const malBad = nameBadMarksAt(0);
      const choBad = nameBadMarksAt(1);
      const jangBad = nameBadMarksAt(2);
      const jungBad = nameBadMarksAt(3);
      const jungMit = nameMitMarksAt(3);
      const jungGood = nameGoodMarksAt(3);
      const malHurt = nameSideBad(0);

      function buildMalRenameBits() {
        const bits = [];
        function sajuMalComfortLead() {
          const g = bdG[0];
          const hexName = g ? gweNameOf(g) : "";
          if (hexName.indexOf("이위화") === 0) {
            return (
              "사주말년에는 " +
              gweNameHtml(g) +
              "가 들어 " +
              paintBlue("편안한 기운") +
              "인데 "
            );
          }
          const marks = [];
          if (bdS[0] && bdS[0].data) marks.push(suriPhrase(bdS[0]));
          if (g && g.name) marks.push(gweNameHtml(g));
          if (!marks.length) return "";
          const toneWord = sajuSideGood(0)
            ? paintBlue("좋은 기운")
            : "들어온 기운";
          return (
            "사주말년에는 " + marks.join(", ") + "가 들어 " + toneWord + "인데 "
          );
        }
        if (malHurt && malBad.length) {
          bits.push(
            sajuMalComfortLead() +
              "이름 말년에 " +
              joinMarks(malBad) +
              "가 사주를 " +
              paintRed("고통스럽게") +
              " 하고 있네요. 말년기운은 인생전반에 영향력을 행사하는데 이것 하나만 가지고도 이 이름을 쓰면 안되니 " +
              paintRed("반드시 개명") +
              "을 하셔서 새 인생을 사셔야 합니다."
          );
        } else if (nameSideGood(0) && sajuSideGood(0)) {
          bits.push(
            "이름 말년 " +
              joinMarks(
                nameGoodMarksAt(0).length
                  ? nameGoodMarksAt(0)
                  : nameMarksAt(0)
              ) +
              "이 사주를 " +
              paintBlue("도와 주는") +
              " 쪽으로 읽힙니다."
          );
        } else if (malBad.length) {
          bits.push(
            sajuMalComfortLead() +
              "이름 말년에 " +
              joinMarks(malBad) +
              "가 있어 사주에 " +
              paintRed("고통을 줍니다") +
              ". 말년은 인생 전반에 미치니 신중히 보셔야 합니다."
          );
        }
        return bits;
      }

      function buildChoJangJungBits() {
        const bits = [];
        if (choBad.length && malHurt && malBad.length) {
          bits.push(
            "초년이름에는 " +
              joinMarks(choBad) +
              "이 들었는데, 말년의 " +
              joinMarks(malBad) +
              "가 합세를 해서 더욱 큰 " +
              paintRed("고통") +
              "을 주고 있습니다."
          );
        } else if (choBad.length) {
          bits.push(
            "초년이름에는 " +
              joinMarks(choBad) +
              "이 들어 이 시기 사주에 " +
              paintRed("고통을 줍니다") +
              "."
          );
        } else if (nameSideGood(1)) {
          bits.push(
            "초년 이름은 사주를 " +
              paintBlue("도와 주는") +
              " 편으로 읽힙니다."
          );
        }

        if (jangBad.length && malHurt && malBad.length) {
          bits.push(
            "장년은 " +
              joinMarks(jangBad) +
              "가 말년의 " +
              joinMarks(malBad) +
              "를 만나서 더 큰 " +
              paintRed("고통") +
              "을 만들어내고 있고,"
          );
        } else if (jangBad.length) {
          bits.push(
            "장년은 " +
              joinMarks(jangBad) +
              "가 사주에 " +
              paintRed("고통을 줍니다") +
              "."
          );
        } else if (nameSideGood(2)) {
          bits.push(
            "장년 이름은 사주를 " +
              paintBlue("도와 주는") +
              " 편입니다."
          );
        }

        if (jungMit.length || (nameMitAt(3) && jungBad.length)) {
          const badPart = jungBad.length
            ? "중년이름기운의 " + joinMarks(jungBad)
            : "중년이름";
          const mitPart = jungMit.length
            ? joinMarks(jungMit)
            : joinMarks(jungGood);
          let jung =
            badPart +
            josaEunNeun(badPart) +
            " 다행스럽게도 " +
            (mitPart
              ? mitPart + josaIGA(mitPart) + " 눌러주고"
              : "눌러 주는 기운이 눌러주고");
          if (isWealthMitAt(3) || jungMit.length) {
            jung += " 재물운이니 이 시기에 인생의 절정기라고 보지만";
          } else {
            jung += " 보완이 되지만";
          }
          if (malHurt && malBad.length) {
            jung +=
              " 말년의 " +
              joinMarks(malBad) +
              "의 " +
              paintRed("고통") +
              "을 비켜가기가 힘든이름으로 전반적으로 좋은사주를 이름이 피해를 주는구조입니다.";
          } else {
            jung += " 전체 흐름과 함께 보셔야 합니다.";
          }
          bits.push(jung);
        } else if (jungBad.length && malHurt && malBad.length) {
          bits.push(
            "중년은 " +
              joinMarks(jungBad) +
              "가 말년의 " +
              joinMarks(malBad) +
              "와 겹쳐 " +
              paintRed("고통") +
              "이 이어집니다. 전반적으로 좋은사주를 이름이 피해를 주는구조입니다."
          );
        } else if (jungBad.length) {
          bits.push(
            "중년 이름에 " +
              joinMarks(jungBad) +
              "가 들어 사주에 " +
              paintRed("고통을 줍니다") +
              "."
          );
        } else if (nameSideGood(3)) {
          bits.push(
            "중년 이름은 사주를 " +
              paintBlue("도와 주는") +
              " 편입니다."
          );
        }

        if (
          malHurt &&
          malBad.length &&
          !bits.some(function (b) {
            return b.indexOf("피해를 주는구조") >= 0;
          })
        ) {
          bits.push(
            "전반적으로 좋은사주를 이름이 피해를 주는구조이니, 쓰지 않는 것이 현명합니다."
          );
        }
        return bits;
      }

      return {
        malRename: buildMalRenameBits().join(" "),
        rest: buildChoJangJungBits().join(" "),
      };
    }

    function buildNameHelpsHurtsByPeriod() {
      const parts = buildNameHelpsHurtsParts();
      const out = [];
      if (parts.malRename) out.push(parts.malRename);
      if (parts.rest) out.push(parts.rest);
      return out.join(" ");
    }

    /**
     * 사주 — 도입 / 말년(전체기운 축) / 시기별 한 줄
     * 순서: 도입·말년축 → 이름비교·개명 → 시기별 한 줄 (보흘)
     */
    function sajuBriefMarks(idx) {
      const marks = [];
      if (bdS[idx] && bdS[idx].data) marks.push(suriPhrase(bdS[idx]));
      if (bdG[idx] && bdG[idx].name) marks.push(gweNameHtml(bdG[idx]));
      return marks;
    }
    function sajuSlightTrialHexOk(idx) {
      const sBad = !!(bdS[idx] && bdS[idx].data && suriBad(bdS[idx].data));
      const g = bdG[idx];
      const hexOk = !!(g && g.name && !gweBad(g));
      return sBad && hexOk;
    }
    function sajuWealthPainClose() {
      const BIG_WEALTH = [
        "화천대유",
        "화수미제",
        "수풍정",
        "산천대축",
        "뇌천대장",
      ];
      let wealthCnt = 0;
      let painCnt = 0;
      for (let bi = 0; bi < bdG.length; bi++) {
        const g = bdG[bi];
        if (!g || !g.name) continue;
        const n = gweNameOf(g);
        for (let wi = 0; wi < BIG_WEALTH.length; wi++) {
          if (n === BIG_WEALTH[wi] || n.indexOf(BIG_WEALTH[wi]) === 0) {
            wealthCnt++;
            break;
          }
        }
        if (gweBad(g)) painCnt++;
      }
      const POWER_HEX = ["택풍대과", "택산함"];
      const powerHtml = [];
      [1, 2, 3, 0].forEach(function (bi) {
        const g = bdG[bi];
        if (!g || !g.name) return;
        const n = gweNameOf(g);
        for (let pi = 0; pi < POWER_HEX.length; pi++) {
          if (n === POWER_HEX[pi] || n.indexOf(POWER_HEX[pi]) === 0) {
            powerHtml.push(gweNameHtml(g));
            break;
          }
        }
      });
      let powerLine = "";
      if (powerHtml.length >= 2) {
        powerLine =
          " 이 사주는 " +
          powerHtml.join("·") +
          josaEuro(powerHtml[powerHtml.length - 1]) +
          " " +
          paintBlue("권력과 출세하고자 하는 기운이 넘치는") +
          " 사주입니다.";
      } else if (powerHtml.length === 1) {
        powerLine =
          " 이 사주는 " +
          powerHtml[0] +
          josaEuro(powerHtml[0]) +
          " " +
          paintBlue("권력과 출세하고자 하는 기운") +
          "이 있는 사주입니다.";
      }
      if (wealthCnt >= 1) {
        return (
          powerLine +
          " 이 사주의 주역괘에는 재물·성공 기운이 보여 활용할 자리가 있습니다."
        );
      }
      if (powerLine) return powerLine;
      if (painCnt >= 2) {
        return " 이 사주의 주역괘에는 무거운 기운이 있어 시련이 겹치기 쉽습니다.";
      }
      return " 이 사주의 주역괘는 큰 재물운은 뚜렷하지 않지만 큰 고통이 없는 무난한 사주입니다.";
    }

    function buildSajuIntro() {
      if (!hasB) return "";
      return (
        "사주표를 보고 이 사람이 어떻게 살아가라고 했는지를 먼저 짚어 보겠습니다. " +
        "말년(총운)은 평생에 영향을 주고, 초년·장년·중년은 해당 나이대(±3년)에만 영향을 줍니다."
      );
    }

    /** 사주 전체기운의 축 = 말년 */
    /** 사주 말년 경고 괘(택천쾌)를 이름 말년의 눌러 주는 괘가 누를 때 (보흘 지정) */
    function sajuMalWarnPressTail() {
      if (!hasB || !(bdG[0] && bdG[0].malWarn)) return "";
      const np = malPressHexes([[nmS, nmG]].concat(hasHanja ? [[hjS, hjG]] : []));
      if (!np.length) return "";
      return (
        " 이름 말년(총운)의 " + pressHtml(np) + josaIGA(np[np.length - 1].name) +
        " 눌러 주고 있기는 하지만 " + paintRed("일단은 조심하셔야 합니다") + "."
      );
    }

    function buildSajuMalOverall() {
      if (!hasB) return "";
      const marks = sajuBriefMarks(0);
      if (!marks.length) return "";
      const tone = sideToneAt(bdS, bdG, 0);
      let p =
        "사주 전체기운의 축인 말년(총운)은 " + marks.join(", ");
      const ro = josaEuro(marks[marks.length - 1]);
      if (sajuSlightTrialHexOk(0)) {
        p +=
          "인데 약간의 시련이 있지만 주역괘는 나쁘지 않은 편입니다.";
      } else if (tone === "길") {
        p += ro + " 좋은 기운이 들어 있습니다.";
      } else if (tone === "흉") {
        p += ro + " 무거운 기운이 있어 시련이 따릅니다.";
      } else if (tone === "길흉혼재") {
        p += ro + " " + paintBlue("길") + "·" + paintRed("흉") + "이 섞여 있습니다.";
      } else {
        p += ro + " 평이한 편입니다.";
      }
      if (bdG[0] && bdG[0].malWarn) p += " " + paintRed(bdG[0].malWarn) + sajuMalWarnPressTail();
      p +=
        " 말년기운은 인생전반에 영향력을 행사하니, 이 사주가 어떻게 살으라고 했는지의 중심이 여기입니다.";
      return p;
    }

    /** 시기별 한 줄 (사주 말년은 … 초년 … 무난한 사주) — 이름비교·개명 뒤에 둠 */
    function buildSajuPeriodLine() {
      if (!hasB) return "";
      const slots = [
        { i: 0, key: "말년", speak: "말년" },
        { i: 1, key: "초년", speak: "초년" },
        { i: 2, key: "장년", speak: "장년" },
        { i: 3, key: "중년", speak: "중년" },
      ];
      const filled = slots.filter(function (s) {
        return sajuBriefMarks(s.i).length > 0;
      });
      if (!filled.length) return "";
      const overviewBits = [];
      filled.forEach(function (slot, fi) {
        const marks = sajuBriefMarks(slot.i);
        const tone = sideToneAt(bdS, bdG, slot.i);
        const isLast = fi === filled.length - 1;
        const conj = slot.key === "초년" ? "도 " : "은 ";
        const label = (fi === 0 ? "사주 " : "") + slot.speak + conj;
        let mid = marks.join(", ");
        let tail = "";

        if (sajuSlightTrialHexOk(slot.i)) {
          mid += "인데 ";
          tail = isLast
            ? "약간의 시련이 있지만 주역괘는 나쁘지 않은 편입니다."
            : "약간의 시련이 있지만 주역괘는 나쁘지 않은 편이고, ";
        } else if (tone === "길") {
          mid += josaEuro(mid) + " ";
          if (slot.key === "말년") {
            tail = isLast
              ? "좋은 기운이 들어 있습니다."
              : "좋은 기운이 들어 있고, ";
          } else if (slot.key === "초년") {
            tail = isLast ? "좋은 기운입니다." : "좋은 기운이고, ";
          } else if (slot.key === "장년") {
            tail = isLast ? "좋은 편입니다." : "좋은 편이고, ";
          } else {
            tail = isLast
              ? "좋은 기운이 들어 있습니다."
              : "좋은 기운이고, ";
          }
        } else if (tone === "길흉혼재") {
          mid += josaEuro(mid) + " ";
          tail = isLast ? "길·흉이 섞여 있습니다." : "길·흉이 섞여 있고, ";
        } else if (tone === "흉") {
          mid += josaEuro(mid) + " ";
          tail = isLast
            ? "무거운 기운이 있어 시련이 따릅니다."
            : "무거운 기운이 있고, ";
        } else {
          mid += josaEuro(mid) + " ";
          tail = isLast ? "평이한 편입니다." : "평이한 편이고, ";
        }
        overviewBits.push(label + mid + tail);
      });
      return overviewBits.join("") + sajuWealthPainClose();
    }

    /** 초·장·중·말 네 자리 수리 숫자 (ages=[말년,초년,장년,중년]) · 7차 원문 표기 */
    function chronoSuriNums(sArr) {
      const order = [1, 2, 3, 0];
      const out = [];
      for (let i = 0; i < 4; i++) {
        const ns = sArr && sArr[order[i]];
        out.push(ns && ns.suri != null ? Number(ns.suri) : null);
      }
      return out;
    }
    function formatSuriFour(nums) {
      return (nums || [])
        .map(function (n) {
          return n == null || isNaN(n) ? "—" : String(n);
        })
        .join(", ");
    }
    function nameSlotHasSuri(num) {
      const n = Number(num);
      for (let i = 0; i < 4; i++) {
        if (nmS[i] && Number(nmS[i].suri) === n && !isMitigateSuriHex(nmG[i])) return true;
        if (hasHanja && hjS[i] && Number(hjS[i].suri) === n && !isMitigateSuriHex(hjG[i])) return true;
      }
      return false;
    }
    function malSuriIn(list) {
      return (
        (nmS[0] && list.indexOf(Number(nmS[0].suri)) >= 0 && !isMitigateSuriHex(nmG[0])) ||
        (hasHanja && hjS[0] && list.indexOf(Number(hjS[0].suri)) >= 0 && !isMitigateSuriHex(hjG[0]))
      );
    }
    function nameSlotHasHex(hexName) {
      for (let i = 0; i < 4; i++) {
        if (hexNameStarts(nmG[i], hexName)) return true;
        if (hasHanja && hexNameStarts(hjG[i], hexName)) return true;
      }
      return false;
    }
    function note14InFour(nums, who, gs) {
      if (!nums || nums.indexOf(14) < 0) return "";
      const labels = ["초년", "장년", "중년", "말년(총운)"];
      const hits = [];
      let mitNote = "";
      let malBad = false;
      for (let i = 0; i < 4; i++) {
        if (nums[i] !== 14) continue;
        const g = gs && gs[i];
        if (isMitigateSuriHex(g)) {
          const hn = gweNameOf(g);
          mitNote +=
            " " +
            who +
            " " +
            labels[i] +
            "의 " +
            paintRed("14, 이산파멸") +
            "은 바로 아래 " +
            gweNameHtml(g) +
            josaIGA(hn) +
            " 눌러 주어 그 수리의 단점이 장점으로 승화되니 흉으로 보지 않습니다.";
        } else {
          hits.push(labels[i]);
          if (i === 3) malBad = true;
        }
      }
      if (!hits.length) return mitNote;
      return note14Bad(hits, malBad, who) + mitNote;
    }
    function note14Bad(hits, malBad, who) {
      const where = hits.join("·");
      if (malBad && hits.length === 1) {
        return (
          " " +
          who +
          " " +
          paintRed("말년(총운)에 14, 이산파멸") +
          "이 있습니다."
        );
      }
      if (nums[3] === 14) {
        return (
          " " +
          who +
          " " +
          where +
          "에 " +
          paintRed("14, 이산파멸") +
          "이 있습니다."
        );
      }
      return (
        " " +
        who +
        " " +
        where +
        "에 " +
        paintRed("14, 이산파멸") +
        "이 내재합니다."
      );
    }

    /** 오행 다음 — 수리 네 자리 한 줄 (보흘·7차) */
    function buildSuriFourBlock() {
      const hg = chronoSuriNums(nmS);
      if (hg.every(function (n) {
        return n == null;
      }))
        return "";
      let p =
        "한글 수리 " +
        formatSuriFour(hg) +
        "(초·장·중·말).";
      p += note14InFour(hg, "한글", [nmG[1], nmG[2], nmG[3], nmG[0]]);
      if (hasHanja) {
        const hj = chronoSuriNums(hjS);
        if (
          !hj.every(function (n) {
            return n == null;
          })
        ) {
          p +=
            " 한문 수리 " +
            formatSuriFour(hj) +
            "(초·장·중·말).";
          p += note14InFour(hj, "한문", [hjG[1], hjG[2], hjG[3], hjG[0]]);
        }
      }
      return p;
    }

    /**
     * 이름 속 암·자살·이별·이혼·사고사 — 해당될 때만 짧게 (7차·스펙 목록만)
     * 상세는 밑줄·각주
     */
    function buildNameHazardBrief() {
      const has14 = nameSlotHasSuri(14);
      const has19 = nameSlotHasSuri(19);
      const has20 = nameSlotHasSuri(20);
      const has22 = nameSlotHasSuri(22);
      const has2 = nameSlotHasSuri(2);
      const mal14or20or22 = malSuriIn([14, 20, 22]);
      const deathSuri = [
        14, 19, 20, 26, 27, 28, 46, 70, 74, 79, 4, 9, 10, 22, 34, 64, 69,
      ];
      let hasDeath = false;
      for (let di = 0; di < deathSuri.length; di++) {
        if (nameSlotHasSuri(deathSuri[di])) {
          hasDeath = true;
          break;
        }
      }
      const hexCancer =
        nameSlotHasHex("천지비") || nameSlotHasHex("지화명이");
      const hexSuicideDivorce = nameSlotHasHex("풍천소축");
      const hexAccident = nameSlotHasHex("화택규");

      const tags = [];
      if (has14 || has2 || hexSuicideDivorce) {
        tags.push(paintRed("이별·이혼"));
      }
      if (has14 || mal14or20or22 || hexCancer) {
        tags.push(paintRed("암·병·수술"));
      }
      if (has14 || has19 || has20 || has22 || hasDeath || hexAccident) {
        tags.push(paintRed("사고·사망"));
      }
      if (has14 || hexSuicideDivorce || has2) {
        tags.push(paintRed("자살·단명"));
      }
      if (malSuriIn([26, 28])) {
        tags.push(paintRed("이별·사별"));
      }

      if (!tags.length) return "";

      // 중복 제거
      const seen = {};
      const uniq = [];
      for (let ti = 0; ti < tags.length; ti++) {
        const k = tags[ti].replace(/<[^>]+>/g, "");
        if (seen[k]) continue;
        seen[k] = true;
        uniq.push(tags[ti]);
      }

      const np = malPressHexes([[nmS, nmG]].concat(hasHanja ? [[hjS, hjG]] : []));
      if (np.length) {
        const sp = hasB ? malPressHexes([[bdS, bdG]]) : [];
        const last = np[np.length - 1].name;
        return (
          "이름 속에 " + uniq.join(", ") + " 기운이 살짝 비치기는 하지만, 이름 말년(총운)의 " +
          pressHtml(np) + josaIGA(last) + " " + paintBlue("지원군") +
          "이 되어 주니 달리기 하다가 발목이 삐끗하는 수준의 부상 정도로 끝나기 쉽습니다." +
          (sp.length
            ? " 사주 말년에도 " + pressHtml(sp) + josaIGA(sp[sp.length - 1].name) +
              " 있으니 살짝 스크래치만 남기고 사라집니다."
            : "") +
          " 크게 걱정하지 않으셔도 됩니다. 자세한 자리는 위 네 자리 수리와 밑줄 친 곳을 보시면 됩니다."
        );
      }
      let lead = "이름 속에는 ";
      if (has14) {
        lead =
          "수리학에서 " +
          paintRed("14, 이산파멸") +
          "은 이별·사고·수술·암·사망을 뜻합니다. 이 이름에는 ";
      }
      return (
        lead +
        uniq.join(", ") +
        " 기운이 보입니다. 자세한 자리는 위 네 자리 수리와 밑줄 친 곳을 보시면 됩니다." +
        hazardSupportTail()
      );
    }
    function hazardSupportTail() {
      const np = malPressHexes([[nmS, nmG]].concat(hasHanja ? [[hjS, hjG]] : []));
      if (!np.length) return "";
      const sp = hasB ? malPressHexes([[bdS, bdG]]) : [];
      const last = np[np.length - 1].name;
      return (
        " 다만 이름 말년(총운)의 " + pressHtml(np) + josaIGA(last) + " " + paintBlue("지원군") +
        "이 되어 주니, 이런 흉은 달리기 하다가 발목이 삐끗하는 수준의 부상 정도로 끝나기 쉽습니다." +
        (sp.length
          ? " 사주 말년에도 " + pressHtml(sp) + josaIGA(sp[sp.length - 1].name) +
            " 있으니 살짝 스크래치만 남기고 사라집니다."
          : "")
      );
    }

    // —— ①오행 → ②수리4자리 → ③사주말년(전체기운) → ④이름비교·개명 → ⑤사주시기별 → ⑥위험·주기도문·밑줄 ——
    if (ohangNarr) ageParts.push(ohangNarr);
    const suriFour = buildSuriFourBlock();
    if (suriFour) ageParts.push(suriFour);
    if (hasB) {
      const sajuIntro = buildSajuIntro();
      if (sajuIntro) ageParts.push(sajuIntro);
      const sajuMal = buildSajuMalOverall();
      if (sajuMal) ageParts.push(sajuMal);
      ageParts.push(
        "이름이 사주를 도와주는지 고통을 주는지를 살펴 보겠습니다."
      );
      const nameParts = buildNameHelpsHurtsParts();
      if (nameParts.malRename) ageParts.push(nameParts.malRename);
      const sajuPeriods = buildSajuPeriodLine();
      if (sajuPeriods) ageParts.push(sajuPeriods);
      if (nameParts.rest) ageParts.push(nameParts.rest);
      const turnList = buildNameVsBirthCompare(true);
      if (turnList) ageParts.push(turnList);
    } else {
      const turnList = buildNameVsBirthCompare(true);
      if (turnList) ageParts.push(turnList);
    }
    const hazard = buildNameHazardBrief();
    if (hazard) ageParts.push(hazard);
    if (hasB) {
      ageParts.push(
        "이름은 세 글자의 주기도문이랍니다. 실제 기도를 할 때는 백일기도, 천일기도처럼 날마다 하루도 쉬지 않고 기도를 해야 소원이 이루어지는데, 수십 년을 하루도 거르지 않고 기도하는 것이 바로 이름 세 글자이니 기도발이 엄청 강하답니다. 그 이름이 나는 고통스럽게 살다가 일찍 죽겠다든지, 암으로 죽겠다든지, 심장마비로 죽겠다든지 하는 내용이라면 아주 끔찍한 일이 아니겠습니까. 여기서 이름을 풀어 보신 분들은 신중하게 개명을 고려하시길 바랍니다."
      );
      ageParts.push(
        "개명 후에 새 이름의 기운이 들어오면서 나타나는 증상은 대체로 두 가지로 옵니다. 그 첫 번째는 사주는 좋은데 최악의 이름을 가진 분이 개명한 다음 일정 기간—빨리 오는 경우에는 새 이름의 기운이 들어오면서 몸이 새털처럼 가볍고 붕 뜨는 증상을 보이고, 사주도 나쁘고 이름도 나쁜데 새 이름을 받은 경우에는 이전 이름이 빠져나가면서 다리를 부러뜨린다든지, 팔을 부러뜨린다든지 하는 심술을 부리게 되니 이때가 새 이름의 기운이 들어온다고 생각하시면 됩니다. 개명 후에는 이름의 첫 기운, 초년부터 들어오는 것이니 참고하시기 바랍니다."
      );
    }

    ageParts.push(
      "이름표에 나온 수리나 주역내용을 자세하게 보고 싶으면 밑줄 표시된 곳을 가볍게 터치하면 자세하게 볼수가 있으니 궁금증이 해소 될 것입니다."
    );

    /**
     * 보흘 지정: 1. 인덕 · 2. 배우자운 · 3. 자녀운 · 4. 재물운(이름재물운 / 사주재물운)
     * 질병·수술·사고·이혼·암 등 분류표는 두지 않음 (흉수리를 눌러 주는 괘를 표가 반영하지 못함)
     */
    function hexMatchesAny(g, names) {
      if (!g || !g.name || !names || !names.length) return false;
      const n = gweNameOf(g);
      for (let i = 0; i < names.length; i++) {
        const h = names[i];
        if (n === h || n.indexOf(h) === 0) return true;
      }
      return false;
    }

    function suriInList(ns, nums) {
      if (!ns || ns.suri == null || !nums || !nums.length) return false;
      return nums.indexOf(Number(ns.suri)) >= 0;
    }

    function indeokSpouseLines() {
      const o = ctx.ohang || {};
      const saeng = Number(o.M) || 0;
      let indeok = "부족(상생 " + saeng + "개)";
      if (saeng >= 3) indeok = "많음(상생 " + saeng + "개)";
      else if (saeng >= 2) indeok = "어느 정도(상생 " + saeng + "개)";

      let spouse = "해당없음";
      const up = o.up || o.upHg;
      const upHj = o.upHj;
      if (up === "sangsaeng" || upHj === "sangsaeng") {
        spouse = "원활(위쪽 오행 생)";
      } else if (up === "sanggeuk" || upHj === "sanggeuk") {
        spouse = "막힘(위쪽 오행 극)";
      } else if (up || upHj) {
        spouse = "비화(관심이 있는듯 없는듯)";
      }

      let child = "해당없음";
      const dn = o.dn || o.dnHg;
      const dnHj = o.dnHj;
      if (dn === "sangsaeng" || dnHj === "sangsaeng") {
        child = "원활(아래쪽 오행 생)";
      } else if (dn === "sanggeuk" || dnHj === "sanggeuk") {
        child = "막힘(아래쪽 오행 극)";
      } else if (dn || dnHj) {
        child = "비화(관심이 있는듯 없는듯)";
      }

      return (
        '<div class="ko-sum-matrix-head">' +
        "<div>1. 인덕 : " +
        esc(indeok) +
        "</div>" +
        "<div>2. 배우자운 : " +
        esc(spouse) +
        "</div>" +
        "<div>3. 자녀운 : " +
        esc(child) +
        "</div>" +
        "</div>"
      );
    }

    /** 재물운 — hex-fortune-19 / suri81 스펙 기준 */
    const MATRIX_ROWS = [
      {
        title: "재물운",
        hex: [
          "화천대유",
          "화수미제",
          "수풍정",
          "산천대축",
          "이위화",
          "뇌천대장",
        ],
        suri: [16, 24, 29, 47, 7, 13, 3, 33, 41, 58, 61, 65, 67, 1, 5, 6, 8, 18],
      },
    ];

    const MATRIX_AGES = [
      { key: "초년", idx: 1 },
      { key: "장년", idx: 2 },
      { key: "중년", idx: 3 },
      { key: "말년", idx: 0 },
    ];

    function wealthLineHtml(isSaju) {
      const row = MATRIX_ROWS[0];
      const parts = [];
      MATRIX_AGES.forEach(function (a) {
        const i = a.idx;
        const bits = [];
        function scan(who, ns, ng) {
          const got = [];
          if (hexMatchesAny(ng, row.hex)) got.push(gweNameHtml(ng));
          if (suriInList(ns, row.suri)) got.push(suriPhrase(ns));
          if (got.length) {
            bits.push(
              (who ? who + " " : "") +
                '<span class="mx-mark mx-g">' +
                got.join(" · ") +
                "</span>"
            );
          }
        }
        if (isSaju) {
          scan("", bdS[i], bdG[i]);
        } else {
          scan(hasHanja ? "한글" : "", nmS[i], nmG[i]);
          if (hasHanja) scan("한문", hjS[i], hjG[i]);
        }
        if (bits.length) parts.push(a.key + " " + bits.join(", "));
      });
      return parts.length ? parts.join(" / ") : "해당없음";
    }

    function buildFortuneMatrixHtml() {
      const wealth =
        "<div>4. 재물운</div>" +
        '<div class="mx-wealth" style="padding-left:1em">· 이름재물운 : ' +
        wealthLineHtml(false) +
        "</div>" +
        (hasB
          ? '<div class="mx-wealth" style="padding-left:1em">· 사주재물운 : ' +
            wealthLineHtml(true) +
            "</div>"
          : "");
      return indeokSpouseLines().replace(/<\/div>$/, wealth + "</div>");
    }

    const fortuneMatrixHtml = buildFortuneMatrixHtml();

    /** 오행표 밑 첫 문단 — 전체 분위기·재물운 시기·흉 시기 → 사주가 원하는 삶 → 인덕부터 (보흘 2026-09-26) */
    function buildPreviewIntro() {
      const row = MATRIX_ROWS[0];
      function wealthAges(sides) {
        const out = [];
        MATRIX_AGES.forEach(function (a) {
          const hit = sides.some(function (sd) {
            return hexMatchesAny(sd[1][a.idx], row.hex) || suriInList(sd[0][a.idx], row.suri);
          });
          if (hit) out.push(a.key);
        });
        return out;
      }
      function badMarks(sd, idx) {
        const s = sd[0][idx];
        const g = sd[1][idx];
        const m = [];
        if (s && s.data && suriBad(s.data) && !isMitigateSuriHex(g)) m.push(suriPhrase(s));
        if (g && g.name && gweBad(g)) m.push(gweNameHtml(g));
        return m;
      }
      function malTone(sides) {
        const ts = sides.map(function (sd) { return sideToneAt(sd[0], sd[1], 0); });
        if (ts.indexOf("흉") >= 0) return "흉";
        if (ts.every(function (t) { return t === "길"; })) return "길";
        if (ts.indexOf("길흉혼재") >= 0) return "혼재";
        return "보통";
      }
      function malWarn(sides) {
        const g = sides.map(function (sd) { return sd[1][0]; }).filter(function (x) { return x && x.malWarn; })[0];
        if (!g) return "";
        return " " + paintRed(gweNameOf(g) + josaEunNeun(gweNameOf(g)) + " " + g.malWarn) +
          (g === bdG[0] ? sajuMalWarnPressTail() : "");
      }
      const nameSides = [[nmS, nmG]].concat(hasHanja ? [[hjS, hjG]] : []);
      const sajuSides = hasB ? [[bdS, bdG]] : [];

      let p = "본격적으로 풀기 전에 전체 분위기부터 짚어 보겠습니다. ";
      const nt = malTone(nameSides);
      p += nt === "길"
        ? "이름의 중심인 말년(총운)이 " + paintBlue("든든하여") + " 전체 분위기가 밝고, "
        : nt === "흉"
          ? "이름의 말년(총운)에 " + paintRed("흉") + "이 있어 전체 분위기가 무겁고, "
          : nt === "혼재"
            ? "이름의 말년(총운)에는 " + paintBlue("길") + "·" + paintRed("흉") + "이 섞여 있고, "
            : "이름의 전체 분위기는 무난하고, ";
      if (hasB) {
        const st = malTone(sajuSides);
        p += st === "길"
          ? "사주의 중심인 말년(총운)도 " + paintBlue("좋은 기운") + "입니다."
          : st === "흉"
            ? "사주의 말년(총운)에는 " + paintRed("시련") + "이 있습니다."
            : st === "혼재"
              ? "사주의 말년(총운)에는 " + paintBlue("길") + "·" + paintRed("흉") + "이 섞여 있습니다."
              : "사주의 말년(총운)은 평이한 편입니다.";
      } else {
        p = p.replace(/, $/, ".");
      }
      p += malWarn(nameSides.concat(sajuSides)) + " ";

      const nw = wealthAges(nameSides);
      const sw = hasB ? wealthAges(sajuSides) : [];
      if (nw.length || sw.length) {
        const bits = [];
        if (nw.length) bits.push((hasB ? "이름 재물운은 " : "재물운은 ") + paintBlue(nw.join("·")));
        if (sw.length) bits.push("사주 재물운은 " + paintBlue(sw.join("·")));
        p += bits.join(", ") + "에 들어옵니다. ";
      } else {
        p += "뚜렷한 재물운 자리는 보이지 않습니다. ";
      }

      const badBits = [];
      let nameBadNonMal = false;
      MATRIX_AGES.forEach(function (a) {
        const m = [];
        nameSides.forEach(function (sd) { m.push.apply(m, badMarks(sd, a.idx)); });
        if (m.length && a.idx !== 0) nameBadNonMal = true;
        const sm = [];
        sajuSides.forEach(function (sd) { sm.push.apply(sm, badMarks(sd, a.idx)); });
        const who = [];
        if (m.length) who.push((hasB ? "이름 " : "") + m.join("·"));
        if (sm.length) who.push("사주 " + sm.join("·"));
        if (who.length) badBits.push(a.key + "(" + who.join(", ") + ")");
      });
      if (badBits.length) {
        p += paintRed("흉") + "은 " + badBits.join(", ") + "에 있습니다.";
        const np = malPressHexes(nameSides);
        if (nameBadNonMal && np.length) {
          p += " 다만 이름 말년(총운)의 " + pressHtml(np) + josaIGA(np[np.length - 1].name) + " " +
            paintBlue("지원군") + "이 되어 줍니다.";
        }
      } else {
        p += "뚜렷한 " + paintRed("흉") + "은 보이지 않습니다.";
      }

      let q;
      if (hasB) {
        const POWER_HEX = ["택풍대과", "택산함"];
        let power = 0;
        let wealth = 0;
        [1, 2, 3, 0].forEach(function (i) {
          if (hexMatchesAny(bdG[i], POWER_HEX)) power++;
          if (hexMatchesAny(bdG[i], row.hex)) wealth++;
        });
        let want;
        if (power >= 2) want = paintBlue("출세하고자 하는 욕망이 가득한데");
        else if (power === 1) want = paintBlue("출세하고자 하는 기운이 있는데");
        else if (wealth) want = paintBlue("재물을 크게 쌓고자 하는 기운이 뚜렷한데");
        else if (malTone(sajuSides) === "흉") want = "시련을 이겨 내며 살라 했는데";
        else want = "무난하게 살라 했는데";
        q = "사주의 전체적인 기운을 보면 " + want +
          ", 과연 이름이 사주가 원하는 것을 도와 주는지 세밀하게 시기별로 확인해 보겠습니다.";
      } else {
        q = "이름이 어떤 삶을 그리고 있는지 세밀하게 시기별로 확인해 보겠습니다.";
      }
      q += " 이런 기운들을 강력하게 지원하는 " + paintBlue("인덕(상생)이 3개 이상") +
        "이어야 하는데, 그것부터 설명을 하겠습니다.";
      return p + "<br><br>" + q;
    }
    ageParts.unshift(buildPreviewIntro());

    const footnoteHits = collectFootnoteHits(
      nmS,
      nmG,
      hjS,
      hjG,
      hasHanja,
      ages
    );
    const chongunNotes = collectChongunFootnoteNotes(nmS, nmG, hjS, hjG, hasHanja, sajuOrdinary);

    /** 서술형 이름풀이 아래 — 「경고장」+「각주」 노란 칸 2개 */
    function warningJangHtml(hits, chongunApplied) {
      const warnSuriRed = WARN_JANG_SURI.map(function (s) {
        return s.n + " " + s.name;
      }).join(", ");
      const warnHexRed = WARN_JANG_HEX.join(", ");
      const footSuriRed = FOOTNOTE_WARN_SURI.map(function (s) {
        return s.n + " " + s.name;
      }).join(", ");
      const footHexRed = FOOTNOTE_WARN_HEX.join(", ");

      const warnBox =
        '<div style="margin-top:16px">' +
        '<div style="font-weight:800;font-size:1.1rem;color:#111;margin:0 0 8px;letter-spacing:0.02em">경고장</div>' +
        '<div style="background:#FFFF00;color:#FF1493;font-weight:700;line-height:1.6;padding:12px 10px;border-radius:6px;font-size:0.95rem">' +
        "만약 여러분 이름을 분석해서 " +
        '<span style="color:#FF0000">' +
        warnSuriRed +
        "</span> 등이 있거나, 이러한 수리가 아니라 해도 수리에 주역을 대입해서 " +
        '<span style="color:#FF0000">' +
        warnHexRed +
        "</span> 등의 괘가 도사리고 있다면 오로지 신속한 개명만이 피해를 대폭 줄일 수 있습니다." +
        "</div>" +
        "</div>";

      let applyBlock = "";
      if (hits && hits.length) {
        const lines = hits.map(function (h) {
          return h.who + " " + h.age + " " + h.labelHtml;
        });
        applyBlock =
          '<div style="margin-top:10px;line-height:1.65;font-size:0.95rem;font-weight:700;color:#FF0000;padding:2px 2px">' +
          "이 이름에 해당: " +
          lines.join(", ") +
          ". 절망적 상황에 처하기 쉬우니 개명을 심사숙고하십시오." +
          "</div>";
      }

      // 총운 특례 노란 칸 — 각주에 항상 표기 (스펙)
      const chongunBox =
        '<div style="background:#FFFF00;border:2px solid #111;color:#111;font-weight:700;line-height:1.55;padding:10px;font-size:0.9rem;margin-top:8px">' +
        '<span style="color:#FF0000">' +
        FOOTNOTE_CHONGUN_DANMYEONG +
        "</span>" +
        "</div>" +
        '<div style="background:#FFFF00;border:2px solid #111;color:#111;font-weight:700;line-height:1.55;padding:10px;font-size:0.9rem;margin-top:8px">' +
        '<span style="color:#FF0000">' +
        FOOTNOTE_CHONGUN_CANCER +
        "</span>" +
        "</div>" +
        '<div style="background:#FFFF00;border:2px solid #111;color:#111;font-weight:700;line-height:1.55;padding:10px;font-size:0.9rem;margin-top:8px">' +
        '<span style="color:#FF0000">' +
        FOOTNOTE_SURI20_22 +
        "</span>" +
        "</div>";

      let chongunApply = "";
      if (chongunApplied && chongunApplied.length) {
        chongunApply =
          '<div style="margin-top:8px;line-height:1.55;font-size:0.9rem;font-weight:700;color:#FF0000;padding:2px">' +
          "【총운 각주 적용】 " +
          chongunApplied.join(" ") +
          "</div>";
      }

      const footBox =
        '<div style="margin-top:14px">' +
        '<div style="font-weight:800;font-size:1.1rem;color:#111;margin:0 0 8px;letter-spacing:0.02em">각주</div>' +
        '<div style="background:#FFFF00;border:2px solid #111;color:#111;font-weight:700;line-height:1.55;padding:10px;font-size:0.9rem">' +
        '여러분 <span style="color:#FF1493">이름</span>을 분석해서 만약 그 안에 ' +
        '<span style="color:#FF0000">' +
        footSuriRed +
        "</span> 등이 있거나, 혹은 이름에 주역을 대입해서 " +
        '<span style="color:#FF0000">' +
        footHexRed +
        "</span> 괘가 있다면 절망적 상황에 처한다." +
        "</div>" +
        chongunBox +
        applyBlock +
        chongunApply +
        '<div style="margin-top:8px;line-height:1.5;font-size:0.9rem;font-weight:800;color:#FF1493;padding:2px">' +
        FOOTNOTE_WARN_FOOTER +
        "</div>" +
        "</div>";

      return warnBox + footBox;
    }

    return {
      ageText:
        '<div class="ko-sum-narr">' + ageParts.join("<br><br>") + "</div>",
      conclusion:
        '<div class="ko-sum-concl">' +
        fortuneMatrixHtml +
        warningJangHtml(footnoteHits, chongunNotes) +
        "</div>",
    };
  };
})();
