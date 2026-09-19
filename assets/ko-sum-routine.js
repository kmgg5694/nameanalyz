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

  /** kind: 'bad'|'goodHex'|'goodSuri'|'neutral' — 수리명·괘명만 색 */
  function paintName(text, kind) {
    let color = C_BLACK;
    if (kind === "bad") color = C_RED;
    else if (kind === "goodHex") color = C_BLUE;
    return (
      '<span style="color:' +
      color +
      ';font-weight:700">' +
      esc(text) +
      "</span>"
    );
  }

  /** 수리명: 번호+이름만 (격·길흉·길수 라벨 없음) */
  function suriNameHtml(ns) {
    if (!ns || ns.suri == null || !ns.data) return "";
    const nm = strip(ns.data.name);
    const head = nm ? ns.suri + nm : String(ns.suri);
    let kind = "neutral";
    if (suriBad(ns.data)) kind = "bad";
    else if (suriGood(ns.data)) kind = "goodSuri";
    return paintName(head, kind);
  }

  /** 주역괘명만 (길괘/흉괘 괄호 없음) */
  function gweNameHtml(g) {
    if (!g || !g.name) return "";
    const nm = "「" + strip(g.name) + "」";
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

  function ageHeader(ageKey) {
    return ageKey === "말년" ? "【총운(말년)】" : "【" + ageKey + "】";
  }

  function ageLayerSpeak(ageKey) {
    return ageKey === "말년" ? "총운" : ageKey;
  }

  function firstSentence(text) {
    const t = String(text || "").trim();
    if (!t) return "";
    const m = t.match(/^[\s\S]+?[.。!?！？](?=\s|$)/);
    return m ? m[0].trim() : t;
  }

  /**
   * who=한글|한문|탄생일 → 흐르는 한 문단 (목록·격·길흉 라벨 없음)
   */
  function explainAgeLayer(who, ns, ng, ageKey) {
    const label = ageLayerSpeak(ageKey);
    const short = who === "탄생일";
    const whoHead = who === "탄생일" ? "탄생일" : who + " 이름";

    if (!ns || ns.suri == null || !ns.data) {
      let out = whoHead + " " + label + "에는 수리 자료가 없습니다.";
      if (ng) {
        out +=
          " 주역으로는 " +
          gweNameHtml(ng) +
          "이 자리합니다.";
        const hx0 = hexOriginalText(ng);
        if (hx0) out += " " + esc(short ? firstSentence(hx0) : hx0);
      }
      return out;
    }

    let out =
      whoHead +
      " " +
      label +
      "에는 " +
      suriNameHtml(ns) +
      "의 기운이 들어 있습니다.";
    const suriBody = suriOriginalText(ns);
    if (suriBody) {
      out += " " + esc(short ? firstSentence(suriBody) : suriBody);
    }
    if (ng) {
      out += " 주역으로는 " + gweNameHtml(ng) + "이 자리합니다.";
      const hx = hexOriginalText(ng);
      if (hx) out += " " + esc(short ? firstSentence(hx) : hx);
    }
    return out;
  }

  function relWord(r) {
    if (r === "sangsaeng") return "생";
    if (r === "sanggeuk") return "극";
    return "비";
  }

  function relPaint(r) {
    if (r === "sangsaeng") return paintBlue("상생");
    if (r === "sanggeuk") return paintRed("상극");
    return "비화";
  }

  function pairHas(up, dn, kind) {
    return up === kind || dn === kind;
  }

  /** 【오행】 — 상생/상극 정의 → 이 이름 → 겉속 → 인덕(짧게) */
  function buildOhangBlock(ctx) {
    const bits = [];
    bits.push(
      paintBlue("상생") +
        "(O)은 도움·협력·화합·긍정적·소통원활의 기운입니다. " +
        paintRed("상극") +
        "(X)은 배척·부정적·소통불·억압·반목의 기운이며, 많으면 스트레스·질병으로 이어지기 쉽습니다."
    );

    const o = ctx.ohang || null;
    if (o) {
      const up = o.up;
      const dn = o.dn;
      if (up || dn) {
        bits.push(
          "이 이름의 한글 오행은 위가 " +
            relPaint(up) +
            "·아래가 " +
            relPaint(dn) +
            "입니다."
        );
      }
      const upHj = o.upHj;
      const dnHj = o.dnHj;
      const hasHj = !!(o.q && (upHj || dnHj));
      if (hasHj) {
        bits.push(
          "한문 오행은 위가 " +
            relPaint(upHj) +
            "·아래가 " +
            relPaint(dnHj) +
            "입니다."
        );
        const hangulGeuk = pairHas(up, dn, "sanggeuk");
        const hangulSaeng = pairHas(up, dn, "sangsaeng");
        const hanjaGeuk = pairHas(upHj, dnHj, "sanggeuk");
        const hanjaSaeng = pairHas(upHj, dnHj, "sangsaeng");
        if (hangulSaeng && hanjaGeuk && !hangulGeuk) {
          bits.push(
            "겉(한글)은 생이 보이는데 속(한문)은 극이 있어, 겉으로는 좋아 보여도 속으로는 흡족하지 않은 상태입니다."
          );
        } else if (hangulGeuk && hanjaSaeng && !hanjaGeuk) {
          bits.push(
            "겉(한글)은 극이 보이는데 속(한문)은 생이 있어, 겉보기엔 별로여도 속으로는 믿음이 가는 흐름입니다."
          );
        } else if (
          relWord(up) === relWord(upHj) &&
          relWord(dn) === relWord(dnHj)
        ) {
          bits.push(
            "겉·속이 같은 결이라 그 자리 상생·상극이 더 또렷하게 작용합니다."
          );
        }
      }

      const M = Number(o.M) || 0;
      const z = Number(o.z) || 0;
      if (M >= 3) {
        bits.push(
          "인덕(상생)이 " +
            M +
            "개로 3개 이상이니, 재물·출세·공부·결혼운이 잘 받쳐 주기 쉽습니다."
        );
      } else if (M > 0) {
        bits.push(
          "인덕(상생)이 " +
            M +
            "개라 3개에는 못 미치니, 관계·복록이 한결 아쉽게 열리기 쉽습니다."
        );
      }
      if (z >= 3) {
        bits.push(
          "상극이 " +
            z +
            "개로 많으니, 설령 큰 재물·출세운이 있어도 그 복은 절반 이하로 떨어지기 쉽습니다."
        );
      }
    }

    const K = ctx.K || (o && o.K) || null;
    if (K && K[0] && K[1] && K[2]) {
      bits.push(
        "한글 오행 세 글자는 " +
          esc(K[0]) +
          "·" +
          esc(K[1]) +
          "·" +
          esc(K[2]) +
          "이며, 오행은 인간관계·성격·인복·스트레스를 가늠하는 척도입니다."
      );
    }

    const ot = String(ctx.ohangText || "").trim();
    if (ot) {
      const soft = ot
        .replace(/수리\s*길/g, "")
        .replace(/\s{2,}/g, " ")
        .trim();
      if (soft && soft.length < 220) bits.push(esc(soft));
    }

    return "【오행】 " + bits.join(" ");
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
      const bGoodS = suriGood(bd);
      const bBadG = gweBad(bg);
      const bGoodG = gweGood(bg);

      const paras = [];
      paras.push(ageHeader(ag));
      paras.push(explainAgeLayer("한글", ns, ng, ag));
      if (hasHanja) paras.push(explainAgeLayer("한문", hs, hg, ag));

      if (hasB) {
        paras.push(explainAgeLayer("탄생일", bs, bg, ag));

        function pushGweVsSaju(who, nameG, badG, goodG) {
          if (!nameG || !bg) return;
          if (badG) {
            hitList.push({ ag: ag, ng: nameG, bg: bg, who: who });
            if (bBadG) {
              paras.push(
                who +
                  " 주역은 이름·사주 모두 " +
                  gweNameHtml(nameG) +
                  "·" +
                  gweNameHtml(bg) +
                  "가 겹쳐 " +
                  ag +
                  "에 큰 시련·상처가 배가됩니다."
              );
            } else {
              paras.push(
                who +
                  " 주역은 " +
                  ag +
                  "에 이름 " +
                  gweNameHtml(nameG) +
                  "가 사주 " +
                  gweNameHtml(bg) +
                  "를 치어(눌러) 그 시기 운이 막히기 쉽습니다."
              );
            }
          } else if (goodG) {
            helpList.push({ ag: ag, ng: nameG, bg: bg, who: who });
            if (bBadG) {
              supportList.push({ ag: ag, ng: nameG, bg: bg, who: who });
              paras.push(
                who +
                  " 주역은 이름 " +
                  gweNameHtml(nameG) +
                  "가 사주 " +
                  gweNameHtml(bg) +
                  "를 받쳐 주어 " +
                  ag +
                  "에 발전·재물운이 열리기 쉽습니다."
              );
            } else if (bGoodG) {
              paras.push(
                who +
                  " 주역은 이름·사주 " +
                  gweNameHtml(nameG) +
                  "·" +
                  gweNameHtml(bg) +
                  "가 맞물려 " +
                  ag +
                  "에 순조롭습니다."
              );
            } else {
              paras.push(
                who +
                  " 주역은 " +
                  ag +
                  "에 이름 " +
                  gweNameHtml(nameG) +
                  " 기운이 돕습니다."
              );
            }
          }
        }
        pushGweVsSaju("한글", ng, nBadG, nGoodG);
        if (hasHanja) pushGweVsSaju("한문", hg, hBadG, hGoodG);
        if (ng && nBadG && hasB && !bg) {
          hitList.push({ ag: ag, ng: ng, bg: null, who: "한글" });
          paras.push(
            "한글 주역은 " +
              ag +
              "에 이름 " +
              gweNameHtml(ng) +
              "가 사주를 치는 형국이라 조심해야 합니다."
          );
        }
        if (hasHanja && hg && hBadG && hasB && !bg) {
          hitList.push({ ag: ag, ng: hg, bg: null, who: "한문" });
          paras.push(
            "한문 주역은 " +
              ag +
              "에 이름 " +
              gweNameHtml(hg) +
              "가 사주를 치는 형국이라 조심해야 합니다."
          );
        }
      }

      const periodBad = !!(nBadG || nBadS || hBadG || hBadS);
      const periodGood =
        !!(nGoodG || nGoodS || hGoodG || hGoodS) && !periodBad;
      if (ag === "말년") {
        if (malBad && malSajuBad) {
          paras.push(
            "▶ 말년: 이름·사주 말년이 모두 무거워 인생 전반에 흠집이 깊어지기 쉽습니다."
          );
        } else if (malGood && malSajuBad) {
          paras.push(
            "▶ 말년: 이름 말년의 밝은 기운이 사주 말년의 부담을 덜어 주어, 일단 이름 쪽은 힘이 됩니다."
          );
        } else if (malBad && malSajuGood) {
          paras.push(
            "▶ 말년: 사주 말년은 열려도 이름 말년의 부담이 전체를 눌러 초·장·중에도 힘이 갑니다."
          );
        } else if (malGood && malSajuGood) {
          paras.push(
            "▶ 말년: 이름·사주 말년이 함께 열려 인생 지표가 밝고 초·장·중도 더 세집니다."
          );
        } else if (malGood) {
          paras.push(
            "▶ 말년: 삶의 지표·지침이 밝아 초·장·중에도 좋은 기운을 더해 줍니다."
          );
        } else if (malBad) {
          paras.push(
            "▶ 말년: 인생 전반에 흠집이 생기기 쉽고, 초·장·중 부담과 만나면 더 보태집니다."
          );
        }
      } else if (ag === "초년" || ag === "장년" || ag === "중년") {
        const sajuPeriodBad = !!(bBadG || bBadS);
        const sajuPeriodGood = !!bGoodG;
        if (malBad && periodBad) {
          const msg =
            "말년(총운)의 부담에 " +
            ag +
            " 부담이 더해져, 그 시기 시련이 한층 커지고 쓸어가듯 몰아칠 수 있습니다.";
          paras.push("▶ " + msg);
          amplifyParts.push("【" + ag + "】 " + msg);
        } else if (malGood && periodGood) {
          const msg =
            "말년(총운)의 밝은 기운에 " +
            ag +
            "의 열림이 더해져, 그 시기 흐름이 더 세집니다.";
          paras.push("▶ " + msg);
          amplifyParts.push("【" + ag + "】 " + msg);
        } else if (malGood && periodBad) {
          const msg =
            "말년의 밝은 기운이 " +
            ag +
            "의 부담을 덜어 주어, 그 시기 상처가 한결 가벼워질 수 있습니다.";
          paras.push("▶ " + msg);
          amplifyParts.push("【" + ag + "】 " + msg);
        } else if (malBad && periodGood) {
          const msg =
            "말년은 무거워도 " +
            ag +
            "의 열림은 그 나이대(±3년)만 버티는 힘이 됩니다.";
          paras.push("▶ " + msg);
          amplifyParts.push("【" + ag + "】 " + msg);
        }
        if (hasB && malGood && sajuPeriodBad) {
          const msg =
            "이름 말년의 밝은 기운이 사주 " +
            ag +
            "의 부담에도 영향·삭감력을 행사합니다.";
          paras.push("▶ " + msg);
          amplifyParts.push("【" + ag + "·사주】 " + msg);
        } else if (hasB && malBad && sajuPeriodBad) {
          const msg =
            "이름 말년의 부담이 사주 " +
            ag +
            "의 부담과 겹치면 그 시기 힘이 더 커집니다.";
          paras.push("▶ " + msg);
          amplifyParts.push("【" + ag + "·사주】 " + msg);
        } else if (hasB && malGood && sajuPeriodGood) {
          const msg =
            "이름 말년의 밝은 기운이 사주 " +
            ag +
            "의 열림을 도와 그 시기 운이 더 열립니다.";
          paras.push("▶ " + msg);
          amplifyParts.push("【" + ag + "·사주】 " + msg);
        }
      }

      ageParts.push(colorGilHyung(paras.join("<br>")));
    });

    const ohangBlock = buildOhangBlock(ctx);
    if (ohangBlock) {
      ageParts.unshift(colorGilHyung(ohangBlock));
    }
    if (specialWarn.length) {
      ageParts.unshift(colorMarks(specialWarn.join(" ")));
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
      "말년·초년·장년·중년마다 한글·한문·탄생일을 이어서 해설합니다. 자세한 수리·괘 뜻은 요약보기 밑줄을 누르십시오."
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
        "【결론】 이름 괘가 사주를 시기별로 치는 형국은 없다. 위 【총운(말년)】·【초년】~【중년】의 기운 대조를 참고하십시오.";
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
