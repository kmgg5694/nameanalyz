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
      "여행·이동의 불안정과 고생·걱정이 더 커지고, 역마살을 타고 떠돌며 불안하고 힘든 생활이 되기 쉽습니다.",
    진위뢰:
      "소리만 요란하고 손에 든 것이 없는 외화내빈의 단점이 더 두드러집니다.",
  };

  function badSuriBlackHexNote(ns, ng) {
    if (!hasBadSuriBlackHex(ns, ng)) return "";
    if (isMitigateSuriHex(ng)) return "";
    if (isWarnJangHex(ng)) return "";
    const num = ns.suri != null ? Number(ns.suri) : NaN;
    // 14+풍수환은 suriMitigateByHexNote 특례
    if (num === 14 && hexNameStarts(ng, "풍수환")) return "";

    const plain = gweNameOf(ng);
    const hexPart = gweNameHtml(ng) + josaIGA(plain);
    const sName = plainSuriName(ns) || "흉수리";

    if (num === 14 && hexNameStarts(ng, "화산려")) {
      return (
        " 같은 시기에 「이산파멸」과 「화산려」가 겹치면, 이산으로 가족과 헤어지고 역마살을 타 더욱 불안하고 힘든 생활을 한다고 보아야 합니다. 검정 보통 괘를 길로 보거나 길·흉이 섞였다고 하면 안 됩니다. 「화산려」의 단점인 여행·이동의 불안정과 고생·걱정이 「이산파멸」 때문에 더 드러납니다."
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
      if (nmS[i] && isFootnoteWarnSuri(nmS[i])) {
        pushHit("한글이름", ag, "수리", suriPhrase(nmS[i]));
      }
      if (nmG[i] && isFootnoteWarnHex(nmG[i])) {
        pushHit("한글이름", ag, "주역", gweNameHtml(nmG[i]));
      }
      if (hasHanja) {
        if (hjS[i] && isFootnoteWarnSuri(hjS[i])) {
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
    lift += " 장점은 더 좋아지고 흉은 지워집니다.";
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

  /** 오행 — 성격(겉·속) + 위·아래 개폐 + 인덕 마무리 */
  function buildOhangBlock(ctx) {
    const o = ctx.ohang || null;
    if (!o) return "";
    const nameOpt = String(ctx.name || ctx.displayName || "").trim();
    const who = nameOpt ? esc(nameOpt) + "님" : "이 분";

    const OH_KO = { 木: "목", 火: "화", 土: "토", 金: "금", 水: "수" };
    /** 오행 지칭 시 조사 로/으로 (보흘 지정) */
    const OH_RO = {
      木: "목으로",
      火: "화로",
      土: "토로",
      金: "금으로",
      水: "수로",
    };
    const EXT = {
      木: "성장과 시작을 이끄는 추진력이 겉으로 드러납니다",
      火: "열정과 표현력, 활동성과 사교성이 겉으로 드러납니다",
      土: "안정과 중재, 신뢰와 포용이 겉으로 드러납니다",
      金: "결단력과 원칙, 절제와 완성이 겉으로 드러납니다",
      水: "유연성과 지혜, 적응력과 소통이 겉으로 드러납니다",
    };
    const INN = {
      木: "성장·시작·확장의 힘이 움직입니다",
      火: "열정·표현·활동의 힘이 움직입니다",
      土: "안정·신뢰·포용의 힘이 움직입니다",
      金: "결단·원칙·절제의 힘이 움직입니다",
      水: "지혜·유연·소통의 힘이 움직입니다",
    };

    function normEl(v) {
      const t = String(v || "").trim();
      if (!t) return "";
      if (OH_KO[t]) return t;
      const map = { 목: "木", 화: "火", 토: "土", 금: "金", 수: "水" };
      return map[t] || t;
    }
    function ohRo(el) {
      return OH_RO[el] || OH_KO[el] || el;
    }
    function sideOpen(kind) {
      if (kind === "sangsaeng") return "열려";
      if (kind === "sanggeuk") return "막혀";
      return "bihwa";
    }
    function sideSentence(label, kind) {
      const k = sideOpen(kind);
      if (k === "열려") return label + "은 열려 있습니다.";
      if (k === "막혀") return label + "은 막혀 있습니다.";
      return label + "은 관심이 있는듯 없는듯합니다.";
    }

    const K = o.K || ctx.K || [];
    const hjO = o.hjO || [];
    const midHg = normEl(K[1] || K[0] || "");
    const midHj = o.q ? normEl(hjO[1] || hjO[0] || "") : "";

    const bits = [];
    if (midHg) {
      let p =
        who +
        "의 겉성격은 " +
        ohRo(midHg) +
        "(" +
        midHg +
        ") " +
        (EXT[midHg] || "그 기운이 겉으로 드러납니다");
      if (midHj) {
        p +=
          ". 속마음은 한자 " +
          ohRo(midHj) +
          "(" +
          midHj +
          ") " +
          (INN[midHj] || "그 기운이 안에서 움직입니다");
      }
      p += ".";
      bits.push(p);
    }

    const up = o.up;
    const dn = o.dn;
    const upHj = o.upHj;
    const dnHj = o.dnHj;
    if (up || dn) {
      bits.push(sideSentence("양부모·배우자·선배 쪽", up));
      bits.push(sideSentence("동료·후배·자녀 쪽", dn));
    }
    if (o.q && (upHj || dnHj)) {
      const u2 = sideOpen(upHj);
      const d2 = sideOpen(dnHj);
      let extra = "한자(속)으로 보면 ";
      if (u2 === "bihwa" && d2 === "bihwa") {
        extra += "양부모·아래 모두 관심이 있는듯 없는듯합니다.";
      } else {
        const parts = [];
        if (u2 === "열려") parts.push("양부모 쪽은 열린 편");
        else if (u2 === "막혀") parts.push("양부모 쪽은 막힌 편");
        else parts.push("양부모 쪽은 관심이 있는듯 없는듯");
        if (d2 === "열려") parts.push("아래는 열린 편");
        else if (d2 === "막혀") parts.push("아래는 막힌 편");
        else parts.push("아래는 관심이 있는듯 없는듯");
        extra += parts.join(", ") + "입니다.";
      }
      bits.push(extra);
    }

    const saeng = Number(o.M) || 0;
    const geuk = Number(o.z) || 0;
    let indeok = "";
    if (saeng >= 3) indeok = "인덕이 많습니다.";
    else if (saeng >= 2) indeok = "인덕이 어느 정도 있습니다.";
    else indeok = "인덕이 부족합니다.";
    bits.push(
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

    return bits.join(" ");
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

    function buildNameVsBirthCompare() {
      if (!hasB) return "";
      const ORDER = [
        { key: "초년", idx: 1 },
        { key: "장년", idx: 2 },
        { key: "중년", idx: 3 },
        { key: "말년", idx: 0 },
      ];

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
     * 사주 시기별 — 수리·주역 내용 서술 (길·흉 라벨만 두지 않음)
     * 순서: 말년(총운) → 초년 → 장년 → 중년
     */
    function buildSajuPeriodBlock() {
      if (!hasB) return "";
      const slots = [
        { i: 0, key: "말년", speak: "말년" },
        { i: 1, key: "초년", speak: "초년" },
        { i: 2, key: "장년", speak: "장년" },
        { i: 3, key: "중년", speak: "중년" },
      ];
      const paras = [];
      paras.push(
        "사주표를 보고 이 사람이 어떻게 살아가라고 했는지를 시기별로 짚어 보겠습니다. " +
          "말년(총운)은 평생에 영향을 주고, 초년·장년·중년은 해당 나이대(±3년)에만 영향을 줍니다."
      );
      slots.forEach(function (slot) {
        const bs = bdS[slot.i];
        const bg = bdG[slot.i];
        if ((!bs || !bs.data) && (!bg || !bg.name)) return;
        let p = "";
        if (bs && bs.data) {
          p += printSuriSentence("탄생일", slot.speak, bs, suriOpts);
        }
        if (bg && bg.name) {
          if (p) p += " ";
          const prevIdx = chronoPrevAgeIdx(slot.i);
          const prevG = prevIdx >= 0 ? bdG[prevIdx] : null;
          p += printHexSentence("탄생일", slot.speak, bg, prevG);
        }
        paras.push(p);
      });
      return paras.length > 1 ? paras.join("<br><br>") : "";
    }

    /**
     * 이름 vs 사주 — 같은 시기 수리·주역 내용을 짚고, 도움/침/최악을 분명히 말한다.
     * (길·흉 표시만으로 끝내지 않음 · 보흘 2026-09-24)
     */
    function buildNameHelpsHurtsByPeriod() {
      if (!hasB) return "";
      const slots = [
        { i: 0, key: "말년", speak: "말년" },
        { i: 1, key: "초년", speak: "초년" },
        { i: 2, key: "장년", speak: "장년" },
        { i: 3, key: "중년", speak: "중년" },
      ];
      const paras = [];

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
      function sajuMarksAt(idx) {
        const marks = [];
        if (bdS[idx] && bdS[idx].data) marks.push(suriPhrase(bdS[idx]));
        if (bdG[idx] && bdG[idx].name) marks.push(gweNameHtml(bdG[idx]));
        return marks;
      }
      function nameBodyAt(idx, ageKey) {
        const bits = [];
        if (nmS[idx] && nmS[idx].data) {
          const t = suriCoreBrief(nmS[idx], ageKey);
          if (t) bits.push(t);
        }
        if (nmG[idx] && nmG[idx].name) {
          const t = hexCoreBrief(nmG[idx]);
          if (t) bits.push(t);
        }
        if (hasHanja) {
          if (hjS[idx] && hjS[idx].data) {
            const t = suriCoreBrief(hjS[idx], ageKey);
            if (t) bits.push(t);
          }
          if (hjG[idx] && hjG[idx].name) {
            const t = hexCoreBrief(hjG[idx]);
            if (t) bits.push(t);
          }
        }
        return bits.join(" ");
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
      function sajuSideBad(idx) {
        return (
          hasBadSuriBlackHex(bdS[idx], bdG[idx]) ||
          (bdS[idx] && bdS[idx].data && suriBad(bdS[idx].data)) ||
          (bdG[idx] && gweBad(bdG[idx]))
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

      slots.forEach(function (slot) {
        const idx = slot.i;
        const nMarks = nameMarksAt(idx);
        const sMarks = sajuMarksAt(idx);
        if (!nMarks.length && !sMarks.length) return;

        let p = slot.speak + "을 견주면, ";
        if (sMarks.length) {
          p += "사주에는 " + sMarks.join("·") + "이(가) 있고, ";
        } else {
          p += "사주 쪽 표기가 드물고, ";
        }
        if (nMarks.length) {
          p += "이름에는 " + nMarks.join("·") + "이(가) 들어 있습니다. ";
        } else {
          p += "이름 쪽 표기가 드뭅니다. ";
        }

        const nBody = nameBodyAt(idx, slot.key);
        if (nBody) p += nBody + " ";

        const nBad = nameSideBad(idx);
        const nGood = nameSideGood(idx);
        const sBad = sajuSideBad(idx);
        const sGood = sajuSideGood(idx);
        const mit = nameMitAt(idx);

        if (nBad && sBad) {
          p +=
            "같은 " +
            slot.speak +
            "에 " +
            paintRed("이름의 흉한 기운이 사주의 흉한 기운과 마주칩니다") +
            ". 사주가 무거워도 이름이 같이 무거우면 " +
            paintRed("최악") +
            "이니, 이 시기 이름은 사주를 도와 주지 못하고 " +
            paintRed("고통을 줍니다") +
            ".";
        } else if (nBad && sGood) {
          p +=
            "사주는 열려 있는데 이름의 무거운 기운이 그 힘을 눌러, 이 시기 이름은 사주를 도와 주지 못하고 " +
            paintRed("고통을 줍니다") +
            ".";
        } else if ((nGood || mit) && sBad) {
          p +=
            "사주는 무거운데 이름의 기운이 받치거나 눌러 주어 " +
            paintBlue("사주를 도와 줍니다") +
            ". 눌러 주는 기운(화천대유·화수미제·이위화·화풍정·산천대축·수풍정·뇌천대장)이 있으면 보완이 됩니다.";
        } else if (nGood && sGood) {
          p +=
            "이름과 사주가 같은 " +
            slot.speak +
            "에 함께 열려 " +
            paintBlue("이름이 사주를 도와 줍니다") +
            ".";
        } else if (nBad && !sBad) {
          p +=
            "사주는 평이한데 이름에 무거운 기운이 있어 이 시기 이름이 사주에 " +
            paintRed("고통을 줍니다") +
            ".";
        } else if (!nBad && sBad) {
          p +=
            "사주는 무겁고 이름은 그 부담을 크게 더하지는 않으나, 눌러 주는 기운이 뚜렷하지 않으면 보완이 약합니다.";
        } else {
          p +=
            "같은 " +
            slot.speak +
            "에 이름과 사주가 크게 기울지 않아, 도움이 뚜렷하지도 고통이 뚜렷하지도 않습니다.";
        }
        paras.push(p);
      });
      return paras.length ? paras.join("<br><br>") : "";
    }

    // —— 순서: ①오행 → ②사주(수리·주역 서술) → ③비교 맺음 → ④이름↔사주 도움·침 ——
    if (ohangNarr) ageParts.push(ohangNarr);
    if (hasB) {
      const sajuNarr = buildSajuPeriodBlock();
      if (sajuNarr) ageParts.push(sajuNarr);
      ageParts.push(
        "이렇게 살아가라고 했는데 당신의 이름이 시기별로 도움을 주는지 고통을 주는지 꼼꼼하게 비교해 보겠습니다."
      );
      const helpHurt = buildNameHelpsHurtsByPeriod();
      if (helpHurt) ageParts.push(helpHurt);
    }

    // a. 전체 총평 덩어리(「전체적으로 봤을 때…」)는 넣지 않음 — 시기별 서술로 충분

    // b. 한글 말년 수리 + 주역 (수리 설명 필수)
    if ((nmS[0] && nmS[0].data) || (nmG[0] && nmG[0].name)) {
      let p = "";
      if (nmS[0] && nmS[0].data) {
        p += printSuriSentence("한글이름", "말년", nmS[0], suriOpts);
      }
      if (nmG[0] && nmG[0].name) {
        if (p) p += " ";
        p += printHexSentence("한글이름", "말년", nmG[0], nmG[3]);
      }
      p += slotComboNotes(
        nmS[0],
        nmG[0],
        hasB ? bdS[0] : null,
        hasB ? bdG[0] : null,
        sajuOrdinary,
        "말년"
      );
      p += chongunFootnoteNote(nmS[0], nmG[0], sajuOrdinary);
      ageParts.push(p);
    }

    // c. 한자 말년 수리 + 주역 (수리 설명 필수)
    if (
      hasHanja &&
      ((hjS[0] && hjS[0].data) || (hjG[0] && hjG[0].name))
    ) {
      let p = "";
      if (hjS[0] && hjS[0].data) {
        p += printSuriSentence("한자이름", "말년", hjS[0], suriOpts);
      }
      if (hjG[0] && hjG[0].name) {
        if (p) p += " ";
        p += printHexSentence("한자이름", "말년", hjG[0], hjG[3]);
      }
      p += slotComboNotes(
        hjS[0],
        hjG[0],
        hasB ? bdS[0] : null,
        hasB ? bdG[0] : null,
        sajuOrdinary,
        "말년"
      );
      p += chongunFootnoteNote(hjS[0], hjG[0], sajuOrdinary);
      ageParts.push(p);
      const malCmp = compareHangulHanjaAtAge("말년", 0);
      if (malCmp) ageParts.push(malCmp);
    } else if (hasHanja) {
      const malCmp = compareHangulHanjaAtAge("말년", 0);
      if (malCmp) ageParts.push(malCmp);
    }

    // 총운(말년) → 초년~장년 전개 안내
    if (
      (nmS[0] && nmS[0].data) ||
      (nmG[0] && nmG[0].name) ||
      (hasHanja &&
        ((hjS[0] && hjS[0].data) || (hjG[0] && hjG[0].name)))
    ) {
      ageParts.push(
        "총운에서 이렇게 살으라고 했는데 과연 그리 살아 가게 될 건지 아래에 초년운 부터 장년까지의 삶의 전개과정을 나이대 별로 분석을 시작합니다."
      );
    }

    // d. 초년 수리 (한글)
    if (nmS[1] && nmS[1].data) {
      const plain = plainSuriName(nmS[1]);
      let p =
        "23세 이전의 운세를 나타내는 수리에는 " +
        suriPhrase(nmS[1]) +
        josaIGA(plain) +
        " 들어 있습니다.";
      p += suriBodyWithDetail(nmS[1], "초년", suriOpts);
      p += slotComboNotes(nmS[1], nmG[1], hasB ? bdS[1] : null, hasB ? bdG[1] : null, sajuOrdinary, "초년");
      ageParts.push(p);
    }

    // e. 초년 수리 대비 (한자)
    if (hasHanja && hjS[1] && hjS[1].data) {
      const nBad = suriBad(nmS[1] && nmS[1].data);
      const nGood = suriGood(nmS[1] && nmS[1].data);
      const hBad = suriBad(hjS[1].data);
      const hGood = suriGood(hjS[1].data);
      const plainH = plainSuriName(hjS[1]);
      let lead = "그러나 한자이름에는 ";
      if (nBad && hGood) lead = "그러나 한자이름에는 ";
      else if (nGood && hBad) lead = "그러나 한자이름에는 ";
      else if (hBad && !nBad) lead = "그러나 한자이름에는 ";
      else if (nBad && !hBad) lead = "한편 한자이름에는 ";
      else lead = "한자이름에는 ";
      let p =
        lead +
        suriPhrase(hjS[1]) +
        josaIGA(plainH) +
        " 들어 있습니다.";
      p += suriBodyWithDetail(hjS[1], "초년", suriOpts);
      p += slotComboNotes(hjS[1], hjG[1], hasB ? bdS[1] : null, hasB ? bdG[1] : null, sajuOrdinary, "초년");
      ageParts.push(p);
    }

    // f. 게다가 30세까지는 + 초년 주역
    if ((nmG[1] && nmG[1].name) || (hasHanja && hjG[1] && hjG[1].name)) {
      let p = "게다가 30세까지는 ";
      const bits = [];
      if (nmG[1] && nmG[1].name) {
        const plain = gweNameOf(nmG[1]);
        bits.push(
          "한글이름에 " +
            gweNameHtml(nmG[1]) +
            josaIGA(plain) +
            " 들어 있습니다."
        );
        const hx = hexBodyForNarrate(nmG[1], null, "초년");
        if (hx) bits.push(hx.trim());
      }
      if (hasHanja && hjG[1] && hjG[1].name) {
        const plain = gweNameOf(hjG[1]);
        bits.push(
          "한자이름에는 " +
            gweNameHtml(hjG[1]) +
            josaIGA(plain) +
            " 들어 있습니다."
        );
        const hx = hexBodyForNarrate(hjG[1], null, "초년");
        if (hx) bits.push(hx.trim());
        if (gweBad(hjG[1])) {
          bits.push(
            paintRed("빨리 한자이름만이라도 바꾸기를 권유합니다.")
          );
        }
      }
      ageParts.push(p + bits.join(" "));
      const choCmp = compareHangulHanjaAtAge("초년", 1);
      if (choCmp) ageParts.push(choCmp);
    }

    // g. 30세부터 40세까지 — 장년
    if (
      (nmS[2] && nmS[2].data) ||
      (nmG[2] && nmG[2].name) ||
      (hasHanja &&
        ((hjS[2] && hjS[2].data) || (hjG[2] && hjG[2].name)))
    ) {
      let p = "30세부터 40세까지는 ";
      const bits = [];
      if (nmS[2] && nmS[2].data) {
        const plain = plainSuriName(nmS[2]);
        bits.push(
          "한글이름에 " +
            suriPhrase(nmS[2]) +
            josaIGA(plain) +
            " 들어 있습니다."
        );
        const _sb2 = suriBodyWithDetail(nmS[2], "장년", suriOpts);
        if (_sb2) bits.push(_sb2.trim());
      }
      if (nmG[2] && nmG[2].name) {
        const plain = gweNameOf(nmG[2]);
        bits.push(
          "주역으로는 " +
            gweNameHtml(nmG[2]) +
            josaIGA(plain) +
            " 자리합니다."
        );
        const hx = hexBodyForNarrate(nmG[2], nmG[1], "장년");
        if (hx) bits.push(hx.trim());
        const mit2 = slotComboNotes(nmS[2], nmG[2], hasB ? bdS[2] : null, hasB ? bdG[2] : null, sajuOrdinary, "장년");
        if (mit2) bits.push(mit2.trim());
      }
      if (hasHanja && hjS[2] && hjS[2].data) {
        const plain = plainSuriName(hjS[2]);
        bits.push(
          "한자이름에는 " +
            suriPhrase(hjS[2]) +
            josaIGA(plain) +
            " 들어 있습니다."
        );
        const _sb2h = suriBodyWithDetail(hjS[2], "장년", suriOpts);
        if (_sb2h) bits.push(_sb2h.trim());
      }
      if (hasHanja && hjG[2] && hjG[2].name) {
        const plain = gweNameOf(hjG[2]);
        bits.push(
          "한자 주역으로는 " +
            gweNameHtml(hjG[2]) +
            josaIGA(plain) +
            " 자리합니다."
        );
        const hx = hexBodyForNarrate(hjG[2], hjG[1], "장년");
        if (hx) bits.push(hx.trim());
        const mit2h = slotComboNotes(hjS[2], hjG[2], hasB ? bdS[2] : null, hasB ? bdG[2] : null, sajuOrdinary, "장년");
        if (mit2h) bits.push(mit2h.trim());
      }
      ageParts.push(p + bits.join(" "));
      const jangCmp = compareHangulHanjaAtAge("장년", 2);
      if (jangCmp) ageParts.push(jangCmp);
    }

    // h. 40세 이후부터 55세까지 — 중년
    if (
      (nmS[3] && nmS[3].data) ||
      (nmG[3] && nmG[3].name) ||
      (hasHanja &&
        ((hjS[3] && hjS[3].data) || (hjG[3] && hjG[3].name)))
    ) {
      let p = "40세 이후부터 55세까지는 ";
      const bits = [];

      function pushMidOverlap(whoLabel, ns, ng, prevNg) {
        const badS = ns && suriBad(ns.data);
        const badG = ng && gweBad(ng);
        if (badS && badG && ns && ng) {
          const plainS = plainSuriName(ns);
          const plainG = gweNameOf(ng);
          bits.push(
            whoLabel +
              "에 " +
              suriPhrase(ns) +
              josaIGA(plainS) +
              " 들어 " +
              gweNameHtml(ng) +
              josaIGA(plainG) +
              " 겹쳤으니 매우 힘든 시기가 될 것으로 보입니다."
          );
          const _sbO = suriBodyWithDetail(ns, "중년", suriOpts);
          if (_sbO) bits.push(_sbO.trim());
          const hx = hexBodyForNarrate(ng, prevNg, "중년");
          if (hx) bits.push(hx.trim());
          bits.push(
            "특히 위험한 시기는 50세~55세 사이가 될 것으로 보입니다."
          );
          const mit = slotComboNotes(
            ns,
            ng,
            hasB ? bdS[3] : null,
            hasB ? bdG[3] : null,
            sajuOrdinary,
            "중년"
          );
          if (mit) bits.push(mit.trim());
          return true;
        }
        return false;
      }

      const hjOverlap = hasHanja
        ? pushMidOverlap("한자이름", hjS[3], hjG[3], hjG[2])
        : false;
      const hgOverlap = pushMidOverlap("한글이름", nmS[3], nmG[3], nmG[2]);

      if (!hgOverlap) {
        if (nmS[3] && nmS[3].data) {
          const plain = plainSuriName(nmS[3]);
          bits.push(
            "한글이름에 " +
              suriPhrase(nmS[3]) +
              josaIGA(plain) +
              " 들어 있습니다."
          );
          const _sb3 = suriBodyWithDetail(nmS[3], "중년", suriOpts);
          if (_sb3) bits.push(_sb3.trim());
        }
        if (nmG[3] && nmG[3].name) {
          const plain = gweNameOf(nmG[3]);
          bits.push(
            "주역으로는 " +
              gweNameHtml(nmG[3]) +
              josaIGA(plain) +
              " 자리합니다."
          );
          const hx = hexBodyForNarrate(nmG[3], nmG[2], "중년");
          if (hx) bits.push(hx.trim());
          const mit3 = slotComboNotes(nmS[3], nmG[3], hasB ? bdS[3] : null, hasB ? bdG[3] : null, sajuOrdinary, "중년");
          if (mit3) bits.push(mit3.trim());
        }
      }
      if (hasHanja && !hjOverlap) {
        if (hjS[3] && hjS[3].data) {
          const plain = plainSuriName(hjS[3]);
          bits.push(
            "한자이름에는 " +
              suriPhrase(hjS[3]) +
              josaIGA(plain) +
              " 들어 있습니다."
          );
          const _sb3h = suriBodyWithDetail(hjS[3], "중년", suriOpts);
          if (_sb3h) bits.push(_sb3h.trim());
        }
        if (hjG[3] && hjG[3].name) {
          const plain = gweNameOf(hjG[3]);
          bits.push(
            "한자 주역으로는 " +
              gweNameHtml(hjG[3]) +
              josaIGA(plain) +
              " 자리합니다."
          );
          const hx = hexBodyForNarrate(hjG[3], hjG[2], "중년");
          if (hx) bits.push(hx.trim());
          const mit3h = slotComboNotes(hjS[3], hjG[3], hasB ? bdS[3] : null, hasB ? bdG[3] : null, sajuOrdinary, "중년");
          if (mit3h) bits.push(mit3h.trim());
        }
      }

      if (
        hasHanja &&
        hjOverlap &&
        nmS[3] &&
        !suriBad(nmS[3].data) &&
        nmG[3] &&
        !gweBad(nmG[3])
      ) {
        bits.push(
          "한글이름에는 이 시기에 재물, 건강, 성공, 행복이 모두 들어 와 있는데 너무나 아쉽습니다."
        );
      }

      ageParts.push(p + bits.join(" "));
      const jungCmp = compareHangulHanjaAtAge("중년", 3);
      if (jungCmp) ageParts.push(jungCmp);
    }

    // 이름풀이 마무리: 초·장·중·말 전체 길흉 명시 (보흘 지정)
    {
      const gilHyungSum = buildNamePeriodGilHyungSummary();
      if (gilHyungSum) ageParts.push(gilHyungSum);
    }

    // j. 이름↔사주 비교 — 사주 본문은 앞에서 끝냄
    if (hasB) {
      const nbCompare = buildNameVsBirthCompare();
      if (nbCompare) ageParts.push(nbCompare);

      ageParts.push(
        "같은 나이대마다 이름과 사주를 한 줄로 견줍니다. " +
          paintBlue("좋은 기운") +
          "과 " +
          paintRed("흉한 기운") +
          "이 시기마다 갈리니, 말년만 전체에 미치고 초·장·중은 해당 나이대(±3년)에만 영향을 줍니다."
      );

      const birthSlots = [
        { i: 0, speak: "말년(56세 이후·총운)", ageKey: "말년" },
        { i: 1, speak: "초년(23세 이전)", ageKey: "초년" },
        { i: 2, speak: "장년(30~40세)", ageKey: "장년" },
        { i: 3, speak: "중년(40~55세)", ageKey: "중년" },
      ];

      /** 재물운 해당 괘 (hex-fortune 재물운) */
      const WEALTH_HEX = [
        "화천대유",
        "화수미제",
        "수풍정",
        "산천대축",
        "이위화",
        "뇌천대장",
      ];
      function isWealthHex(g) {
        if (!g || !g.name) return false;
        const n = gweNameOf(g);
        for (let wi = 0; wi < WEALTH_HEX.length; wi++) {
          if (n === WEALTH_HEX[wi] || n.indexOf(WEALTH_HEX[wi]) === 0) return true;
        }
        return false;
      }

      /** 해당 나이대 이름(한글·한문) 표기 */
      function nameSideSpeak(idx, ageKey) {
        const parts = [];
        if (nmS[idx] && nmS[idx].data) {
          parts.push("한글 수리 " + suriPhrase(nmS[idx]));
        }
        if (nmG[idx] && nmG[idx].name) {
          parts.push("한글 주역 " + gweNameHtml(nmG[idx]));
        }
        if (hasHanja) {
          if (hjS[idx] && hjS[idx].data) {
            parts.push("한문 수리 " + suriPhrase(hjS[idx]));
          }
          if (hjG[idx] && hjG[idx].name) {
            parts.push("한문 주역 " + gweNameHtml(hjG[idx]));
          }
        }
        if (!parts.length) return "이름 " + ageKey + " 자료가 없고";
        return "이름 " + ageKey + "은 " + parts.join("·") + "이고";
      }

      /** 탄생일 각 시기 설명 직후 — 이름↔사주 반드시 견줌 (보흘 지정) */
      function compareNameVsSajuAtAge(ageKey, idx) {
        const bs = bdS[idx];
        const bg = bdG[idx];
        if ((!bs || !bs.data) && (!bg || !bg.name)) return "";

        let p = nameSideSpeak(idx, ageKey) + " ";
        const sBits = [];
        if (bs && bs.data) sBits.push("수리 " + suriPhrase(bs));
        if (bg && bg.name) sBits.push("주역 " + gweNameHtml(bg));
        p +=
          "사주 " +
          ageKey +
          "은 " +
          (sBits.length ? sBits.join("·") : "뚜렷한 표기가 없고") +
          "입니다. ";

        const ht = sideToneAt(nmS, nmG, idx);
        let nameToneFixed = ht;
        if (hasHanja) {
          const jt = sideToneAt(hjS, hjG, idx);
          if (
            hasBadSuriBlackHex(nmS[idx], nmG[idx]) ||
            hasBadSuriBlackHex(hjS[idx], hjG[idx])
          ) {
            if (ht === "흉" || jt === "흉") nameToneFixed = "흉";
            else if (ht === "길흉혼재" || jt === "길흉혼재")
              nameToneFixed = "길흉혼재";
            else if (ht === "길" || jt === "길") nameToneFixed = "길";
            else nameToneFixed = "평이";
          } else if (ht === "흉" || jt === "흉") {
            nameToneFixed =
              ht === "길" || jt === "길" ? "길흉혼재" : "흉";
          } else if (ht === "길흉혼재" || jt === "길흉혼재") {
            nameToneFixed = "길흉혼재";
          } else if (ht === "길" || jt === "길") {
            nameToneFixed = "길";
          } else {
            nameToneFixed = "평이";
          }
        } else if (hasBadSuriBlackHex(nmS[idx], nmG[idx])) {
          nameToneFixed = "흉";
        }

        const sajuTone = (function () {
          let good = 0;
          let bad = 0;
          if (bs && bs.data && suriGood(bs.data)) good++;
          if (bs && bs.data && suriBad(bs.data)) bad++;
          if (bg && gweGood(bg)) good++;
          if (bg && gweBad(bg)) bad++;
          if (hasBadSuriBlackHex(bs, bg)) return "흉";
          if (hasBadSuriMitigateHex(bs, bg)) return "길";
          if (bad && !good) return "흉";
          if (good && !bad) return "길";
          if (good && bad) return "길흉혼재";
          return "평이";
        })();

        p +=
          "이름 " +
          ageKey +
          "과 사주 " +
          ageKey +
          "을 견주면, 이름은 " +
          toneLabel(nameToneFixed) +
          "이고 사주는 " +
          toneLabel(sajuTone) +
          "입니다. ";

        if (nameToneFixed === "흉" && (sajuTone === "길" || sajuTone === "평이")) {
          p +=
            "같은 " +
            ageKey +
            "에 이름이 사주의 힘을 누르기 쉬우니 " +
            paintRed("이름이 고통을 주는 쪽") +
            "으로 읽습니다.";
        } else if (
          (nameToneFixed === "길" || nameToneFixed === "길흉혼재") &&
          sajuTone === "흉"
        ) {
          p +=
            "같은 " +
            ageKey +
            "에 사주는 무거운데 이름이 받쳐 " +
            paintBlue("이름이 돕는 쪽") +
            "입니다. 사주 흉을 시기별로 맞춰 눌러 주는 기운으로 보완하는 모습입니다.";
        } else if (nameToneFixed === "흉" && sajuTone === "흉") {
          p +=
            "같은 " +
            ageKey +
            "에 " +
            paintRed("최악") +
            " — 이름의 흉이 사주의 흉과 마주칩니다. 이 시기 이름은 사주에 고통을 줍니다. 사주 흉을 눌러 줄 기운이 이름에 있어야 보완이 됩니다.";
        } else if (nameToneFixed === "길" && sajuTone === "길") {
          p +=
            "같은 " + ageKey + "에 이름과 사주가 함께 열려 흐름이 힘찹니다.";
        } else if (nameToneFixed === "길흉혼재" && sajuTone === "길") {
          p +=
            "사주는 열리는데 이름에 흉이 섞여 이름이 사주에 일부 고통을 주는 결입니다.";
        } else {
          p +=
            "이름과 사주의 결을 같은 " + ageKey + " 기준으로 함께 보십시오.";
        }
        return p;
      }

      /** 이름·사주 재물운 괘를 나이대 건너 한데 묶어 설명 (보흘 지정) */
      function buildWealthAggregateNote() {
        const hits = [];
        function pushWealth(who, ageKey, g) {
          if (!isWealthHex(g)) return;
          hits.push({
            who: who,
            age: ageKey,
            g: g,
            label: who + " " + ageKey + " 「" + gweNameOf(g) + "」",
          });
        }
        const ageOrder = [
          { key: "초년", idx: 1 },
          { key: "장년", idx: 2 },
          { key: "중년", idx: 3 },
          { key: "말년", idx: 0 },
        ];
        ageOrder.forEach(function (pe) {
          pushWealth("한글이름", pe.key, nmG[pe.idx]);
          if (hasHanja) pushWealth("한자이름", pe.key, hjG[pe.idx]);
          pushWealth("사주", pe.key, bdG[pe.idx]);
        });
        if (hits.length < 2) {
          // 하나뿐이어도 이름 중년 화수미제 + 사주 말년 이위화처럼 다른 자리면 위에서 잡힘
          // 1개면 뭉뚱 해설 생략
          return "";
        }
        const labels = hits.map(function (h) {
          return h.label;
        });
        let p =
          "재물 기운을 이름·사주에서 한데 보면, " +
          labels.join("·") +
          "이 모두 재물운에 해당합니다. 한 자리만 보고 재물을 다 말했다 하지 말고, 이 기운들을 묶어 읽어야 합니다. ";

        const nameMidHwasu =
          isHwasumije(nmG[3]) || (hasHanja && isHwasumije(hjG[3]));
        const sajuMalIwi = hexNameStarts(bdG[0], "이위화");
        if (nameMidHwasu && sajuMalIwi) {
          p +=
            "특히 이름 중년 「화수미제」 다음에 사주 말년 「이위화」도 재물운이니, 중년의 짧은 재물 보탬만 말하고 사주 말년 「이위화」의 재운·성공운을 빼놓으면 안 됩니다. ";
          const nameMalHard =
            (nmS[0] && nmS[0].data && suriBad(nmS[0].data)) ||
            (nmG[0] && gweBad(nmG[0])) ||
            (hasHanja && hjS[0] && hjS[0].data && suriBad(hjS[0].data)) ||
            (hasHanja && hjG[0] && gweBad(hjG[0])) ||
            isHwagtaekGyu(nmG[0]) ||
            (hasHanja && isHwagtaekGyu(hjG[0]));
          if (nameMalHard) {
            p +=
              "다만 이름 말년이 무거우면 사주 말년 「이위화」의 재물이 이름 말년에 지워지기 쉬우니, 중년·말년·사주를 한 줄로 견줘야 합니다.";
          }
        }
        return p;
      }

      birthSlots.forEach(function (slot) {
        const bs = bdS[slot.i];
        const bg = bdG[slot.i];
        if ((!bs || !bs.data) && (!bg || !bg.name)) return;
        // 사주 본문 재나열 생략 — 앞 사주 시기별 장단점 + 아래 이름↔사주만
        const cmp = compareNameVsSajuAtAge(slot.ageKey, slot.i);
        if (cmp) ageParts.push(cmp);
      });

      const wealthAgg = buildWealthAggregateNote();
      if (wealthAgg) ageParts.push(wealthAgg);
    } else {
      // 탄생일 없으면 이름 대비 안내만 생략
    }

    // i. 말년 가중 — 「길」「흉」 목록 없이 부드럽게
    if (malGood || malBad) {
      let soft = "";
      if (malGood && malSajuGood) {
        soft =
          "말년의 주역·수리가 인생 전체의 축을 받쳐 주어, 초년·장년·중년에도 힘이 더해지기 쉽습니다.";
      } else if (malGood && malSajuBad) {
        soft =
          "말년의 밝은 기운이 사주 말년의 부담을 덜어 주는 축이 됩니다.";
      } else if (malBad && malSajuGood) {
        soft =
          "사주 말년은 열려도 이름 말년의 부담이 전체를 눌러 초·장·중에도 힘이 가기 쉽습니다.";
      } else if (malBad) {
        soft =
          "말년의 기운이 무거우면 초년·장년·중년의 부담과 만날 때 시련이 더 커질 수 있으니, 해당 시기를 각별히 살피십시오.";
      } else if (malGood) {
        soft =
          "말년의 기운이 받쳐 주면 초년·장년·중년에도 좋은 흐름을 더해 주기 쉽습니다.";
      }
      if (soft) ageParts.push(soft);
    }

    let nBad = 0,
      nGood = 0,
      bBad = 0,
      bGood = 0;
    function tallySuri(arr) {
      (arr || []).forEach(function (x) {
        if (suriBad(x && x.data)) nBad++;
        if (suriGood(x && x.data)) nGood++;
      });
    }
    function tallyGwe(arr) {
      (arr || []).forEach(function (g) {
        if (gweBad(g)) nBad++;
        if (gweGood(g)) nGood++;
      });
    }
    tallySuri(nmS);
    tallyGwe(nmG);
    if (hasHanja) {
      tallySuri(hjS);
      tallyGwe(hjG);
    }
    if (hasB) {
      bdS.forEach(function (x) {
        const d = x && x.data;
        if (suriBad(d)) bBad++;
        if (suriGood(d)) bGood++;
      });
      bdG.forEach(function (g) {
        if (gweBad(g)) bBad++;
        if (gweGood(g)) bGood++;
      });
    }

    /**
     * 보흘 지정 표: 인덕·배우자운 + 초·장·중·말 × 재물운·질병·수술·사고·소송·이혼·암·우울증·비만
     * 【기운 비교】~결론 장문 대신 이 표만 두고, 해당 내용은 수리·주역에서 찾아 넣음
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

    function nameHasAnyHex(names) {
      if (!names || !names.length) return false;
      for (let i = 0; i < ages.length; i++) {
        if (hexMatchesAny(nmG[i], names)) return true;
        if (hasHanja && hexMatchesAny(hjG[i], names)) return true;
        if (hasB && hexMatchesAny(bdG[i], names)) return true;
      }
      return false;
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

    /** 표 행 — hex-fortune-19 / suri81 스펙 기준 */
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
        good: true,
      },
      {
        title: "질병",
        hex: ["화택규", "택천쾌", "감위수", "산풍고", "지화명이"],
        suri: [14],
        bad: true,
      },
      {
        title: "수술",
        hex: ["화택규", "택천쾌"],
        suri: [14],
        bad: true,
      },
      {
        title: "사고",
        hex: ["화택규"],
        suri: [14, 19, 20, 26, 27, 28, 46, 70, 74, 79, 4, 9, 10, 22, 34, 64, 69],
        bad: true,
      },
      {
        title: "소송",
        hex: ["천수송", "지수사"],
        suri: [36, 20, 19, 27, 78],
        bad: true,
      },
      {
        title: "이혼",
        hex: ["풍천소축"],
        suri: [2, 14],
        bad: true,
      },
      {
        title: "암",
        hex: ["천지비", "지화명이"],
        hexCompanion: { target: "수화기제", companions: ["천지비", "지화명이"] },
        suri: [14],
        bad: true,
      },
      {
        title: "우울증",
        hex: ["산풍고", "지화명이"],
        suri: [],
        bad: true,
      },
      {
        title: "비만",
        hex: [],
        suri: [],
        bad: true,
      },
    ];

    const MATRIX_AGES = [
      { key: "초년", idx: 1, sub: "1~23세<br>1~30세" },
      { key: "장년", idx: 2, sub: "24~40세<br>31~50세" },
      { key: "중년", idx: 3, sub: "41~53세<br>51~55세" },
      { key: "말년", idx: 0, sub: "55세 이후" },
    ];

    function cellMarks(row, ageIdx) {
      const seen = {};
      const out = [];
      function add(html, kind) {
        const key = String(html).replace(/<[^>]+>/g, "");
        if (!key || seen[key]) return;
        seen[key] = true;
        out.push(
          '<span class="mx-mark mx-' +
            (kind || "n") +
            '">' +
            html +
            "</span>"
        );
      }
      function tone() {
        return row.good ? "g" : row.bad ? "b" : "n";
      }
      function scan(ns, ng) {
        if (hexMatchesAny(ng, row.hex)) {
          add(gweNameHtml(ng), tone());
        }
        if (
          row.hexCompanion &&
          hexMatchesAny(ng, [row.hexCompanion.target]) &&
          nameHasAnyHex(row.hexCompanion.companions)
        ) {
          add(gweNameHtml(ng), tone());
        }
        if (suriInList(ns, row.suri)) {
          add(suriPhrase(ns), tone());
        }
      }
      scan(nmS[ageIdx], nmG[ageIdx]);
      if (hasHanja) scan(hjS[ageIdx], hjG[ageIdx]);
      if (hasB) {
        function scanSaju(ns, ng) {
          if (hexMatchesAny(ng, row.hex)) {
            add("사주 " + gweNameHtml(ng), tone());
          }
          if (
            row.hexCompanion &&
            hexMatchesAny(ng, [row.hexCompanion.target]) &&
            nameHasAnyHex(row.hexCompanion.companions)
          ) {
            add("사주 " + gweNameHtml(ng), tone());
          }
          if (suriInList(ns, row.suri)) {
            add("사주 " + suriPhrase(ns), tone());
          }
        }
        scanSaju(bdS[ageIdx], bdG[ageIdx]);
      }
      return out.join(" ");
    }

    function buildFortuneMatrixHtml() {
      let html =
        indeokSpouseLines() +
        '<div class="ko-sum-matrix">' +
        '<table class="ko-sum-mx">' +
        "<thead><tr>" +
        "<th></th>";
      MATRIX_AGES.forEach(function (a) {
        html +=
          "<th><div class=\"mx-age\">" +
          a.key +
          '</div><div class="mx-sub">' +
          a.sub +
          "</div></th>";
      });
      html += "</tr></thead><tbody>";
      MATRIX_ROWS.forEach(function (row) {
        html += '<tr><th scope="row">' + esc(row.title) + "</th>";
        MATRIX_AGES.forEach(function (a) {
          const marks = cellMarks(row, a.idx);
          html +=
            "<td>" +
            (marks || '<span class="mx-empty">·</span>') +
            "</td>";
        });
        html += "</tr>";
      });
      html +=
        "</tbody></table>" +
        '<p class="mx-note">※ 해당 칸은 이름(한글·한문)·사주의 그 시기 수리·주역이 기운 스펙에 맞을 때만 채웁니다. 없으면 비웁니다.</p>' +
        "</div>";
      return html;
    }

    const fortuneMatrixHtml = buildFortuneMatrixHtml();

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
