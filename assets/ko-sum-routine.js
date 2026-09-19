/* 요약보기 — 나이대 서술형 해설 + 이름·사주 주역괘 결론 (원본 d6/Ee 비침범) */
(function () {
  const CS = () => window.__CORE_SUMMARIES__ || { suri: {}, hex: {} };

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
    const n = gweNameOf(g);
    return n === "화택규" || n.indexOf("화택규") === 0;
  }

  function gweBad(g) {
    return !!(g && g.isTaboo);
  }

  function gweGood(g) {
    return !!(g && g.isBest);
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

  /** 라이브 d6 → CS body/short+desc 순으로 원문 전문 */
  function suriOriginalText(ns) {
    const d = ns && ns.data;
    if (d) {
      const m = mergeSuriText(d.shortDesc, d.desc);
      if (m) return m;
    }
    const x = ns && CS().suri[String(ns.suri)];
    if (x && x.body) return String(x.body);
    if (x) return mergeSuriText(x.shortDesc, x.desc);
    return "";
  }

  /** 라이브 Ee.desc → CS hex.core(톤 접두 제거) */
  function hexOriginalText(ng) {
    if (ng && ng.desc) return String(ng.desc).trim();
    const x = ng && CS().hex[String(ng.id)];
    if (x && x.core) {
      return String(x.core)
        .replace(/^(길괘|흉괘|중성)\s*[—–-]\s*/, "")
        .trim();
    }
    return "";
  }

  /**
   * 인쇄 문장: "{who}에는 {ageSpeak}의 운세를 나타내는 수리에는 {num}, {name}가 들어 있습니다. {원문}"
   */
  function printSuriSentence(whoLabel, ageSpeak, ns) {
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
    const body = suriOriginalText(ns);
    if (body) lead += " " + esc(body);
    return lead;
  }

  /**
   * 인쇄 문장: "{who} {ageSpeak}의 주역괘는 {괘명}이 들어 있습니다. {원문}"
   */
  function printHexSentence(whoLabel, ageSpeak, ng) {
    if (!ng || !ng.name) return "";
    const plain = gweNameOf(ng);
    let lead = "";
    if (whoLabel && ageSpeak === "말년" && whoLabel.indexOf("한자") >= 0) {
      lead =
        whoLabel +
        "의 총 주역괘, 즉 말년의 주역괘 역시 " +
        gweNameHtml(ng) +
        josaEuro(plain) +
        " ";
    } else if (whoLabel && ageSpeak === "말년") {
      lead =
        "다행히 " +
        whoLabel +
        " 말년의 주역괘는 " +
        gweNameHtml(ng) +
        josaIGA(plain) +
        " 들어 있습니다.";
    } else {
      lead =
        (whoLabel ? whoLabel + " " : "") +
        ageSpeak +
        "의 주역괘는 " +
        gweNameHtml(ng) +
        josaIGA(plain) +
        " 들어 있습니다.";
    }
    const body = hexOriginalText(ng);
    if (body) {
      if (whoLabel && ageSpeak === "말년" && whoLabel.indexOf("한자") >= 0) {
        lead += esc(body);
        lead +=
          " 운세를 보이겠으나 그 이전까지가 너무 힘든 인생이 펼쳐져 힘을 빼놓게 되므로 좋은 기운이 많이 희생될 것으로 보입니다.";
      } else {
        lead += " " + esc(body);
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

  /** 오행 — 인쇄물 문장 거의 그대로 */
  function buildOhangBlock(ctx) {
    const bits = [];
    bits.push(
      paintBlue("상생") +
        "(○)의 관계란 서로가 서로에게 도움을 주고, 협조적이며, 화합이 잘 되고, 긍정적이고, 소통이 잘 되는 상태를 말합니다."
    );
    bits.push(
      paintRed("상극") +
        "(X)의 관계는 상생의 반대적인 개념으로 배타적이며, 부정적이고, 소통이 어렵고, 억제, 저지, 방해, 불협화음이 자주 발생하는 상태를 나타냅니다. 오행에 " +
        paintRed("상극") +
        "(X)이 과다하면 스트레스가 많고, 몸에 여러가지 질병이 생기기 쉽습니다."
    );

    const o = ctx.ohang || null;
    const nameOpt = String(ctx.name || ctx.displayName || "").trim();
    if (o) {
      const up = o.up;
      const dn = o.dn;
      const upHj = o.upHj;
      const dnHj = o.dnHj;
      const hasHj = !!(o.q && (upHj || dnHj));
      const hgRel = relOverall(up, dn);
      const hjRel = hasHj ? relOverall(upHj, dnHj) : null;

      if (up || dn || hasHj) {
        let person =
          (nameOpt ? esc(nameOpt) + "님은 " : "") +
          "이름 속의 오행이 한글이름은 " +
          relPrintNoun(hgRel);
        if (hgRel === "sangsaeng") person += "을 이루고";
        else if (hgRel === "sanggeuk") person += "을 이루고";
        else person += " 구조를 이루고";

        if (hasHj && hjRel) {
          person +=
            " 한자이름은 " +
            relPrintNoun(hjRel) +
            (hjRel === "sanggeuk" || hjRel === "sangsaeng"
              ? "의 구조를 나타내고 있어"
              : " 구조를 나타내고 있어");
          if (hgRel === "sangsaeng" && hjRel === "sanggeuk") {
            person +=
              " 겉으로 보기에는 원만해 보이겠으나 내면적으로는 스트레스가 따르는 것을 미루어 짐작할 수 있습니다.";
          } else if (hgRel === "sanggeuk" && hjRel === "sangsaeng") {
            person +=
              " 겉으로 보기에는 다소 버거워 보이겠으나 내면적으로는 믿음이 가는 것을 미루어 짐작할 수 있습니다.";
          } else if (hgRel === hjRel) {
            person +=
              " 겉과 속이 같은 결로 그 상생·상극이 더 또렷하게 작용합니다.";
          } else {
            person += " 겉과 속의 결이 달라 체감이 엇갈리기 쉽습니다.";
          }
        } else {
          person += " 있습니다.";
        }
        bits.push(person);
      }
    }

    const K = ctx.K || (o && o.K) || null;
    if (K && K[0] && K[1] && K[2]) {
      bits.push(
        "그리고 한글이름의 오행이 " +
          esc(K[0]) +
          " " +
          esc(K[1]) +
          " " +
          esc(K[2]) +
          " 형태로 되어 있습니다."
      );
    }

    bits.push(
      "오행은 주변 사람들과 어떤 인간관계를 유지하며 살아 가는지, 어떤 성격을 형성하는 기운으로 작용을 하는지, 인복은 있는지, 사람 때문에 받는 스트레스는 어느 정도인지를 알아보는 척도가 됩니다."
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
    // 1) 한글 vs 한문 좋은 기운 개수 비교 → 2) 이름 전체 vs 탄생일 → 3) 오행·시기 해설

    function collectGweLists(gArr) {
      const good = [];
      const bad = [];
      (gArr || []).forEach(function (g) {
        if (!g || !g.name) return;
        if (gweGood(g)) good.push(g);
        if (gweBad(g)) bad.push(g);
      });
      return { good: good, bad: bad };
    }

    function joinGweNames(list) {
      return (list || [])
        .map(function (g) {
          return gweNameHtml(g);
        })
        .join(", ");
    }

    function buildHangulHanjaCompare() {
      if (!hasHanja) return "";
      const hg = collectGweLists(nmG);
      const hj = collectGweLists(hjG);
      let p = "먼저 한글이름과 한문이름의 주역 기운을 견줍니다. ";

      if (hg.good.length) {
        p +=
          "한글이름에는 " +
          joinGweNames(hg.good) +
          "으로 " +
          hg.good.length +
          "개나 좋은 기운이 있고";
      } else {
        p += "한글이름에는 뚜렷한 좋은 주역 기운이 없고";
      }
      if (hg.bad.length) {
        p +=
          ", " +
          joinGweNames(hg.bad) +
          " 같은 흉한 기운이 " +
          hg.bad.length +
          "개 있습니다. ";
      } else {
        p += " 흉한 주역은 없습니다. ";
      }

      if (hj.good.length) {
        p +=
          "한문이름에는 " +
          joinGweNames(hj.good) +
          "으로 " +
          hj.good.length +
          "개의 좋은 기운이 있고";
      } else {
        p += "한문이름에는 뚜렷한 좋은 주역 기운이 없고";
      }
      if (hj.bad.length) {
        p +=
          ", 흉한 기운인 " +
          joinGweNames(hj.bad) +
          "가 " +
          hj.bad.length +
          "개입니다. ";
      } else {
        p += " 흉한 주역은 없습니다. ";
      }

      const hangulBetter =
        hg.good.length > hj.good.length ||
        (hg.good.length === hj.good.length && hg.bad.length < hj.bad.length);
      const hanjaBetter =
        hj.good.length > hg.good.length ||
        (hj.good.length === hg.good.length && hj.bad.length < hg.bad.length);

      if (hangulBetter) {
        p +=
          "따라서 한글이름이 한문이름보다 더 좋은 이름입니다. 이런 경우 한글이름이 좋으니 한문이름만 바꾸어도 되겠다고 판단할 수 있습니다.";
      } else if (hanjaBetter) {
        p +=
          "따라서 한문이름이 한글이름보다 더 좋은 기운이 많습니다. 이런 경우 한문 쪽을 살리고 한글 쪽을 고치는 판단을 할 수 있습니다.";
      } else {
        p +=
          "한글과 한문의 좋고 나쁨이 엇비슷하니, 어느 한쪽만 보고 단정하기보다 시기별로 함께 살펴야 합니다.";
      }
      return p;
    }

    function buildNameVsBirthCompare() {
      if (!hasB) return "";
      const nameGood = [];
      const nameBad = [];
      (nmG || []).forEach(function (g) {
        if (!g) return;
        if (gweGood(g)) nameGood.push(g);
        if (gweBad(g)) nameBad.push(g);
      });
      if (hasHanja) {
        (hjG || []).forEach(function (g) {
          if (!g) return;
          if (gweGood(g)) nameGood.push(g);
          if (gweBad(g)) nameBad.push(g);
        });
      }
      const birthGood = [];
      const birthBad = [];
      (bdG || []).forEach(function (g) {
        if (!g) return;
        if (gweGood(g)) birthGood.push(g);
        if (gweBad(g)) birthBad.push(g);
      });

      let p =
        "다음으로 이름 전체 기운과 탄생일을 비교합니다. 이름 쪽 주역의 좋은 기운은 " +
        nameGood.length +
        "개";
      if (nameGood.length) p += "(" + joinGweNames(nameGood) + ")";
      p += ", 흉한 기운은 " + nameBad.length + "개";
      if (nameBad.length) p += "(" + joinGweNames(nameBad) + ")";
      p +=
        "이고, 탄생일 주역의 좋은 기운은 " +
        birthGood.length +
        "개";
      if (birthGood.length) p += "(" + joinGweNames(birthGood) + ")";
      p += ", 흉한 기운은 " + birthBad.length + "개";
      if (birthBad.length) p += "(" + joinGweNames(birthBad) + ")";
      p += "입니다. ";

      if (nameGood.length > birthGood.length && nameBad.length <= birthBad.length) {
        p +=
          "이름이 탄생일보다 좋은 기운이 많아, 이름이 사주를 도우며 살리는 쪽으로 읽힙니다.";
      } else if (birthGood.length > nameGood.length && birthBad.length <= nameBad.length) {
        p +=
          "탄생일이 이름보다 좋은 기운이 많아, 사주의 힘을 이름이 따라가지 못하는 대목이 없는지 살펴야 합니다.";
      } else if (nameBad.length > birthBad.length) {
        p +=
          "이름에 흉한 주역이 더 많아, 사주가 무난해도 이름이 시기를 눌러 막기 쉽습니다.";
      } else if (birthBad.length > nameBad.length) {
        p +=
          "탄생일에 흉한 주역이 더 많아, 이름이 사주의 부담을 얼마나 받쳐 주는지가 관건입니다.";
      } else {
        p +=
          "이름과 탄생일의 좋고 나쁨이 팽팽하니, 시기마다 이름이 사주를 치는지·돕는지 함께 보아야 합니다.";
      }
      return p;
    }

    const hhCompare = buildHangulHanjaCompare();
    if (hhCompare) ageParts.push(hhCompare);
    const nbCompare = buildNameVsBirthCompare();
    if (nbCompare) ageParts.push(nbCompare);

    const ohangBlock = buildOhangBlock(ctx);
    if (ohangBlock) ageParts.push(ohangBlock);
    if (specialWarn.length) {
      ageParts.push(colorMarks(specialWarn.join(" ")));
    }

    const hangulBadMid =
      countBadSuriSlice(nmS, 1, 3) + countBadGweSlice(nmG, 1, 3);
    const hanjaBadMid = hasHanja
      ? countBadSuriSlice(hjS, 1, 3) + countBadGweSlice(hjG, 1, 3)
      : 0;
    const hangulGoodMid = (function () {
      let n = 0;
      for (let i = 1; i <= 3; i++) {
        if (nmS[i] && suriGood(nmS[i].data)) n++;
        if (nmG[i] && gweGood(nmG[i])) n++;
      }
      return n;
    })();

    // a. 전체적으로 봤을 때…
    if (hasHanja && hangulBadMid < hanjaBadMid) {
      ageParts.push(
        "전체적으로 봤을 때 23세 이후부터는 한글이름이 빛을 발하여 좋은 운세를 보여주겠지만, 이 좋은 운세를 한자이름이 초년부터 55세에 이르기까지 즐기차고 집요하게 앞 길을 막거나 방해를 하는 형국으로 읽힙니다."
      );
    } else if (hasHanja && hanjaBadMid < hangulBadMid) {
      ageParts.push(
        "전체적으로 봤을 때 한자이름이 초년·장년·중년에서 한글이름보다 덜 무거운 편이나, 시기마다 한글·한자의 결이 엇갈리니 한 흐름으로 살펴야 합니다."
      );
    } else if (hasHanja) {
      ageParts.push(
        "전체적으로 봤을 때 한글이름과 한자이름이 초년부터 55세에 이르기까지 서로 다른 결로 작용하니, 어느 한쪽만 보고 단정하기 어렵습니다."
      );
    } else if (hangulGoodMid > hangulBadMid) {
      ageParts.push(
        "전체적으로 봤을 때 23세 이후부터는 한글이름이 빛을 발하여 좋은 운세를 보여 주는 흐름이 읽힙니다."
      );
    } else if (hangulBadMid > 0) {
      ageParts.push(
        "전체적으로 봤을 때 초년부터 55세에 이르기까지 한글이름에 무거운 기운이 자리하니, 시기별 흐름을 차분히 살펴야 합니다."
      );
    }

    // b. 한글 말년 주역
    if (nmG[0] && nmG[0].name) {
      ageParts.push(printHexSentence("한글이름", "말년", nmG[0]));
    }

    // c. 한자 말년 주역
    if (hasHanja && hjG[0] && hjG[0].name) {
      ageParts.push(printHexSentence("한자이름", "말년", hjG[0]));
    }

    // d. 초년 수리 (한글)
    if (nmS[1] && nmS[1].data) {
      const plain = plainSuriName(nmS[1]);
      let p =
        "23세 이전의 운세를 나타내는 수리에는 " +
        suriPhrase(nmS[1]) +
        josaIGA(plain) +
        " 들어 있습니다.";
      const body = suriOriginalText(nmS[1]);
      if (body) p += " " + esc(body);
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
      const body = suriOriginalText(hjS[1]);
      if (body) p += " " + esc(body);
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
        const hx = hexOriginalText(nmG[1]);
        if (hx) bits.push(esc(hx));
      }
      if (hasHanja && hjG[1] && hjG[1].name) {
        const plain = gweNameOf(hjG[1]);
        bits.push(
          "한자이름에는 " +
            gweNameHtml(hjG[1]) +
            josaIGA(plain) +
            " 들어 있습니다."
        );
        const hx = hexOriginalText(hjG[1]);
        if (hx) bits.push(esc(hx));
        if (gweBad(hjG[1])) {
          bits.push(
            paintRed("빨리 한자이름만이라도 바꾸기를 권유합니다.")
          );
        }
      }
      ageParts.push(p + bits.join(" "));
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
        const body = suriOriginalText(nmS[2]);
        if (body) bits.push(esc(body));
      }
      if (nmG[2] && nmG[2].name) {
        const plain = gweNameOf(nmG[2]);
        bits.push(
          "주역으로는 " +
            gweNameHtml(nmG[2]) +
            josaIGA(plain) +
            " 자리합니다."
        );
        const hx = hexOriginalText(nmG[2]);
        if (hx) bits.push(esc(hx));
      }
      if (hasHanja && hjS[2] && hjS[2].data) {
        const plain = plainSuriName(hjS[2]);
        bits.push(
          "한자이름에는 " +
            suriPhrase(hjS[2]) +
            josaIGA(plain) +
            " 들어 있습니다."
        );
        const body = suriOriginalText(hjS[2]);
        if (body) bits.push(esc(body));
      }
      if (hasHanja && hjG[2] && hjG[2].name) {
        const plain = gweNameOf(hjG[2]);
        bits.push(
          "한자 주역으로는 " +
            gweNameHtml(hjG[2]) +
            josaIGA(plain) +
            " 자리합니다."
        );
        const hx = hexOriginalText(hjG[2]);
        if (hx) bits.push(esc(hx));
      }
      ageParts.push(p + bits.join(" "));
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

      function pushMidOverlap(whoLabel, ns, ng) {
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
          const body = suriOriginalText(ns);
          if (body) bits.push(esc(body));
          const hx = hexOriginalText(ng);
          if (hx) bits.push(esc(hx));
          bits.push(
            "특히 위험한 시기는 50세~55세 사이가 될 것으로 보입니다."
          );
          return true;
        }
        return false;
      }

      const hjOverlap = hasHanja
        ? pushMidOverlap("한자이름", hjS[3], hjG[3])
        : false;
      const hgOverlap = pushMidOverlap("한글이름", nmS[3], nmG[3]);

      if (!hgOverlap) {
        if (nmS[3] && nmS[3].data) {
          const plain = plainSuriName(nmS[3]);
          bits.push(
            "한글이름에 " +
              suriPhrase(nmS[3]) +
              josaIGA(plain) +
              " 들어 있습니다."
          );
          const body = suriOriginalText(nmS[3]);
          if (body) bits.push(esc(body));
        }
        if (nmG[3] && nmG[3].name) {
          const plain = gweNameOf(nmG[3]);
          bits.push(
            "주역으로는 " +
              gweNameHtml(nmG[3]) +
              josaIGA(plain) +
              " 자리합니다."
          );
          const hx = hexOriginalText(nmG[3]);
          if (hx) bits.push(esc(hx));
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
          const body = suriOriginalText(hjS[3]);
          if (body) bits.push(esc(body));
        }
        if (hjG[3] && hjG[3].name) {
          const plain = gweNameOf(hjG[3]);
          bits.push(
            "한자 주역으로는 " +
              gweNameHtml(hjG[3]) +
              josaIGA(plain) +
              " 자리합니다."
          );
          const hx = hexOriginalText(hjG[3]);
          if (hx) bits.push(esc(hx));
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

    function softBalance(bad, good) {
      if (bad > good && bad - good >= 2) return "무거운 기운이 더 두드러집니다";
      if (good > bad && good - bad >= 2) return "열린 기운이 더 두드러집니다";
      if (bad > good) return "부담이 조금 더 무겁습니다";
      if (good > bad) return "열림이 조금 더 있습니다";
      if (bad === 0 && good === 0) return "뚜렷한 기복이 크게 드러나지 않습니다";
      return "열림과 부담이 비슷한 무게로 섞여 있습니다";
    }

    compareParts.push(
      "【기운 비교】 이름(한글" +
        (hasHanja ? "+한문" : "") +
        ")은 " +
        softBalance(nBad, nGood) +
        (hasB ? ". 사주는 " + softBalance(bBad, bGood) : "") +
        "."
    );
    compareParts.push(
      "오행·말년·초년·장년·중년을 한 흐름으로 해설합니다. 자세한 수리·괘 뜻은 요약보기 밑줄을 누르십시오."
    );
    if (specialWarn.length) {
      compareParts.push(specialWarn.join(" "));
    }

    compareParts.push("결국 인생은 주역괘대로 흘러갑니다.");
    compareParts.push(
      "【나이대 원칙】 말년(총운)만 인생 전체에 영향주며 말년의 기운이 초년·장년·중년에도 영향력을 행사합니다. 초년·장년·중년은 자기 나이대에만 영향력을 행사합니다. 나이대 경계 오차는 플러스·마이너스 약 3년 내외입니다."
    );
    if (amplifyParts.length) {
      compareParts.push("【말년 가중·강화】 " + amplifyParts.join(" "));
    } else if (malGood || malBad) {
      compareParts.push(
        malGood
          ? "【말년 가중·강화】 이름 말년은 밝은 편입니다. 초·장·중의 열림과 만나면 더 세지고, 사주 부담이 있어도 말년이 삭감·완충합니다."
          : "【말년 가중·강화】 이름 말년은 무거운 편입니다. 초·장·중 부담과 만나면 더 보태지니 해당 시기를 각별히 조심하십시오."
      );
    }

    let verdict = "";
    function listGweNames(arr) {
      const seen = {};
      const out = [];
      arr.forEach(function (h) {
        const key = strip(h.ng.name);
        if (!seen[key]) {
          seen[key] = true;
          out.push(gweNameHtml(h.ng));
        }
      });
      return out;
    }
    function byAgeHelp(arr) {
      return arr.map(function (h) {
        if (h.bg) {
          return (
            h.ag +
            "에 " +
            gweNameHtml(h.ng) +
            "→사주" +
            gweNameHtml(h.bg)
          );
        }
        return h.ag + "에 " + gweNameHtml(h.ng) + "→사주";
      });
    }
    function nameGweTag(who, g, ag) {
      return who + gweNameHtml(g) + "(" + ag + ")";
    }

    if (!hasB) {
      const nameBadGwes = [];
      const nameGoodGwes = [];
      ages.forEach(function (ag, ii) {
        const g = nmG[ii];
        if (gweBad(g)) nameBadGwes.push(nameGweTag("한글", g, ag));
        if (gweGood(g)) nameGoodGwes.push(nameGweTag("한글", g, ag));
        if (hasHanja) {
          const h = hjG[ii];
          if (gweBad(h)) nameBadGwes.push(nameGweTag("한문", h, ag));
          if (gweGood(h)) nameGoodGwes.push(nameGweTag("한문", h, ag));
        }
      });
      if (specialWarn.length) {
        verdict =
          "【결론】 " +
          specialWarn.join(" ") +
          " 한글의 열린 괘만 보고 좋은 이름이라고 단정하면 안 됩니다.";
      } else if (nameBadGwes.length > 0) {
        verdict =
          "【결론】 생년월일 없이 이름만 봤습니다. 이름 " +
          nameBadGwes.join("·") +
          "가 해당 시기에 사주를 칠 수 있으니 조심하십시오.";
      } else if (nameGoodGwes.length > 0) {
        verdict =
          "【결론】 생년월일 없이 이름만 봤습니다. 부담 괘가 없고 " +
          nameGoodGwes.join("·") +
          "가 사주를 시기별로 도와준다. 그래서 좋은이름을 가졌네요.";
      } else {
        verdict =
          "【결론】 생년월일 없이 이름만 봤습니다. 이름에 뚜렷한 부담·열림 괘는 없습니다.";
      }
    } else if (specialWarn.length) {
      verdict =
        "【결론】 " +
        specialWarn.join(" ") +
        (hitList.length
          ? " 또한 이름 " +
            listGweNames(hitList).join("·") +
            "가 사주를 시기별로 칩니다."
          : "") +
        " 한글의 열린 괘만 보고 좋은 이름이라고 단정하면 안 됩니다.";
    } else if (hitList.length > 0) {
      const nameList = listGweNames(hitList);
      const byAge = hitList.map(function (h) {
        if (h.bg) {
          return (
            h.ag +
            "에 " +
            gweNameHtml(h.ng) +
            "→사주" +
            gweNameHtml(h.bg)
          );
        }
        return h.ag + "에 " + gweNameHtml(h.ng) + "→사주";
      });
      verdict =
        "【결론】 이름 " +
        nameList.join("·") +
        "가 사주를 시기별로 친다. (" +
        byAge.join(", ") +
        ")";
      if (helpList.length > 0) {
        verdict +=
          " 한편 " +
          listGweNames(helpList).join("·") +
          "가 사주를 시기별로 도와준다. (" +
          byAgeHelp(helpList).join(", ") +
          ")";
      }
    } else if (helpList.length > 0) {
      verdict =
        "【결론】 이름 부담 괘가 사주를 치는 형국은 없고 " +
        listGweNames(helpList).join("·") +
        "가 사주를 시기별로 도와준다. (" +
        byAgeHelp(helpList).join(", ") +
        ") 그래서 좋은이름을 가졌네요.";
    } else {
      verdict =
        "【결론】 이름 괘가 사주를 시기별로 치는 형국은 없다. 위 서술의 말년·초년·장년·중년 기운을 참고하십시오.";
    }

    compareParts.push(verdict);
    compareParts.push(
      "이름이나 탄생일의 말년(총운)이 좋아야 내 인생의 말년·건강·재물이 좋아집니다. (말년만 전체에 미치며 초·장·중년에도 영향을 받고, 나머지 나이대는 해당 시기±3년 안입니다.)"
    );

    /** 서술형 이름풀이(ageText) 바로 아래 — 제목 「경고장」 + 노란 칸 + 기도문 안내 */
    function warningJangHtml() {
      return (
        '<div style="margin-top:16px">' +
        '<div style="font-weight:800;font-size:1.1rem;color:#111;margin:0 0 8px;letter-spacing:0.02em">경고장</div>' +
        '<div style="background:#FFFF00;color:#FF1493;font-weight:700;line-height:1.6;padding:12px 10px;border-radius:6px;font-size:0.95rem">' +
        "만약 여러분 이름을 분석해서 9 대재무용, 10 만사허망 " +
        "12 박약박복, 14 이산파멸, 20 백사실패, 22 중도좌절, " +
        "26 영웅풍파, 28 파란풍파, 34 재앙연속 등이 있거나, " +
        "이러한 수리가 아니라 해도 수리에 주역을 대입해서 " +
        "천산둔, 천수송, 천지비, 택화혁, 택뢰수, 택수곤, 풍수환, " +
        "뇌산소과, 수화기제, 수산건, 수뢰둔, 풍천소축, 산풍고, " +
        "산지박, 지화명이 등의 괘가 도사리고 있다면 오로지 " +
        "신속한 개명만이 피해를 대폭 줄일 수 있습니다." +
        "</div>" +
        '<div style="margin-top:12px;line-height:1.7;font-size:0.95rem;color:#1c1917;padding:4px 2px">' +
        "이름은 3글자의 기도문 입니다. 그 이름이 매번 불려 질 때마다 나는 이렇게 살겠다고 매일 매일 기도 하는데 그 간절한 기도를 가상히 여겨 들어 주게 됩니다. 부르고, 쓰고, 듣고 하면 좋은 이름은 더 좋아 지는 것이고, 나쁜 이름은 자기가 그렇게 살겠다고 간절히 기도 하는데 안들어 주겠습니까? 내 이름은 그렇지 않을거야 하고 은근 슬쩍 넘어 가지 말고 여기 무료 이름풀이를 보고 확인해서 개명을 심사 숙고 하시기 바랍니다." +
        "</div>" +
        '<div style="margin-top:12px;line-height:1.75;font-size:0.95rem;padding:4px 2px;color:#0000FF">' +
        "우리의 운명은 " +
        '<span style="color:#FF0000;font-weight:700">사주, 이름, 가정환경, DNA</span>' +
        " 속에 고루 나뉘어 분포하고 있습니다. 위 4가지가 다 좋으면 금상첨화가 될 것이고, 그런 사람들만이 상류층이 되어서 살아가게 되는 겁니다. 그러니 사주가 나쁜데 이름마저 나쁜 편이라면 이거야말로 엎친데 덮친 격이 됩니다. " +
        '<span style="color:#FF0000;font-weight:700">사주가 안 좋으면, 이름이라도 좋아야 하는 법입니다.</span>' +
        " 이름만이라도 다복하고, 결혼운, 승진운, 사업운, 성공운, 재물운, 건강운 등 모두 크게 키우고 또 많아야 됩니다." +
        "<br><br>" +
        "이름이 나쁘다면 아무리 많은 재산을 물려줘도 제대로 지켜내지 못할 수 있고 잠시나마 한 때 성공해서 큰돈을 번다해도 끝까지 지켜낼 수 없습니다. 비록 지켜낸다고 해도 건강이 따라주지 않는다거나 행복한 생활을 하지 못해 삶에 재미를 느끼지 못한다면 그 인생이 무슨 의미가 있겠습니까? " +
        '<span style="color:#FF0000;font-weight:700">그러므로 사주가 좋든 나쁘든 이름은 무조건 좋고 볼 일입니다.</span>' +
        "</div></div>"
      );
    }

    return {
      ageText: ageParts.join("<br><br>") + warningJangHtml(),
      conclusion: compareParts
        .map(function (p) {
          return p.indexOf("<span") >= 0 ? p : colorMarks(p);
        })
        .join("<br>"),
    };
  };
})();
