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

  /** 「길」「흉」 표시어에 색 */
  function colorGilHyung(s) {
    return String(s || "")
      .replace(/「길」/g, paintBlue("「길」"))
      .replace(/「흉」/g, paintRed("「흉」"));
  }

  /** 결론 등 평문용 — 흉수·흉괘·길괘 표시도 색 (수리는 원본과 같이 흉만 빨강) */
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

  /** 원본 UI와 동일: 흉수·주의·불량만 빨강, 길수·평수는 검정 */
  function suriColor(d) {
    if (suriBad(d)) return C_RED;
    return "#1c1917";
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

  /** 첨부 격명·길흉 — 표시: 갱신격. 대길 (한자 괄호 생략) */
  function suriGeokLuckHead(num) {
    const x = CS().suri[String(num)];
    if (!x) return { plain: "", html: "", geok: "", luck: "" };
    const gFull = String(x.geok || "").trim();
    const g = gFull.replace(/\([^)]*\)/g, "").trim();
    const l = String(x.luck || "").trim();
    if (!g && !l) return { plain: "", html: "", geok: "", luck: "" };
    const plain = g && l ? g + ". " + l : g || l;
    let luckHtml = l ? esc(l) : "";
    if (l) {
      if (l === "길흉상반" || l === "변동") luckHtml = esc(l);
      else if (l.indexOf("흉") >= 0) luckHtml = paintRed(esc(l));
      else luckHtml = esc(l);
    }
    const html = g && l ? esc(g) + ". " + luckHtml : g ? esc(g) : luckHtml;
    return { plain: plain, html: html, geok: g, luck: l };
  }

  function suriLabel(d, num) {
    if (!d) return "";
    const nm = strip(d.name);
    const head = num + "수(" + nm + ")";
    const col = suriColor(d);
    return (
      '<span style="color:' +
      col +
      ';font-weight:700">' +
      esc(head) +
      "</span>"
    );
  }

  function gweLabel(g) {
    if (!g) return "";
    const nm = "「" + strip(g.name) + "」";
    if (gweBad(g)) return paintRed(nm) + "(" + paintRed("흉괘") + ")";
    if (gweGood(g)) return paintBlue(nm) + "(" + paintBlue("길괘") + ")";
    return esc(nm) + "(중성)";
  }

  /** 수리가 같은 자리 주역괘에 미치는 영향 — 서술용 (화살표·목록 없이) */
  function suriInfluenceProse(ns, ng) {
    const nd = ns && ns.data;
    if (!nd && !ng) return "";
    if (suriBad(nd) && gweGood(ng)) {
      return (
        "수리 " +
        paintRed("흉") +
        "이 주역 " +
        paintBlue("길괘") +
        "의 힘을 깎아, 좋은 괘만 보고 단정하면 안 됩니다."
      );
    }
    if (suriBad(nd) && gweBad(ng)) {
      return (
        "수리 " +
        paintRed("흉") +
        "과 주역 " +
        paintRed("흉괘") +
        "가 겹쳐 그 시기 시련이 더 커지기 쉽습니다."
      );
    }
    if (suriGood(nd) && gweBad(ng)) {
      return (
        "수리 길이 주역 " +
        paintRed("흉괘") +
        "를 일부 받쳐 주나, 흉괘의 조심은 그대로 필요합니다."
      );
    }
    if (suriGood(nd) && gweGood(ng)) {
      return (
        "수리 길과 주역 " +
        paintBlue("길괘") +
        "가 맞물려 그 시기 기운이 더 열리기 쉽습니다."
      );
    }
    if (suriBad(nd)) {
      return (
        "수리 " +
        paintRed("흉") +
        "이 주역 기운에 부담을 주어, 평이한 괘도 무겁게 작용하기 쉽습니다."
      );
    }
    if (suriGood(nd)) {
      return "수리 길이 주역 기운을 받쳐 주어 그 시기 흐름이 한결 나아지기 쉽습니다.";
    }
    return "수리와 주역이 함께 그 시기 인생 흐름을 만듭니다. 한쪽만 보고 단정하지 마십시오.";
  }

  /** 격·길흉 한 줄 포인트 — 본문·태그 덤프 금지. 길흉 팁 또는 기운 태그 최대 2개 */
  function pointedSuriLine(ns) {
    if (!ns || ns.suri == null) return "";
    const gl = suriGeokLuckHead(ns.suri);
    const luck = gl.luck || "";
    if (luck) {
      if (luck.indexOf("대길") >= 0) {
        return "대길의 격이라 그 시기 지표가 밝게 열리기 쉽습니다.";
      }
      if (luck === "길") {
        return "길한 격이라 그 시기 흐름이 비교적 순조롭습니다.";
      }
      if (luck.indexOf("대흉") >= 0) {
        return (
          paintRed("대흉") + "의 격이라 그 시기를 각별히 조심해야 합니다."
        );
      }
      if (luck.indexOf("흉") >= 0) {
        return (
          paintRed("흉") + "한 격이라 그 나이대(±3년)를 무겁게 받기 쉽습니다."
        );
      }
      if (luck === "길흉상반") {
        return "길흉이 상반되니 분수와 배합을 살피며 가려 받는 기운입니다.";
      }
      if (luck === "변동") {
        return "변동의 격이라 그 시기 흐름이 쉽게 흔들리기 쉽습니다.";
      }
    }
    if (typeof window.suriFortuneTags === "function") {
      const tags = (window.suriFortuneTags(ns.suri) || []).slice(0, 2);
      if (tags.length === 1) {
        return "특히 " + esc(tags[0]) + " 쪽이 눈에 띕니다.";
      }
      if (tags.length >= 2) {
        return (
          "특히 " + esc(tags[0]) + "·" + esc(tags[1]) + " 쪽이 눈에 띕니다."
        );
      }
    }
    return "";
  }

  function ageSpeakLabel(ageKey) {
    return ageKey === "말년" ? "총운(말년)" : ageKey;
  }

  function ageHeader(ageKey) {
    return ageKey === "말년" ? "【총운(말년)】" : "【" + ageKey + "】";
  }

  /**
   * who=한글|한문|탄생일 → 한 문단 서술 (▶ 목록·본문 덤프 없음)
   */
  function explainWhoProse(who, ns, ng, ageKey) {
    const label = ageSpeakLabel(ageKey);
    if (!ns || ns.suri == null || !ns.data) {
      let out = who + " " + label + "은 수리 자료가 없습니다.";
      if (ng) out += " 같은 자리 주역은 " + gweLabel(ng) + "입니다.";
      return out;
    }
    const gl = suriGeokLuckHead(ns.suri);
    let out =
      who +
      " " +
      label +
      "은 " +
      suriLabel(ns.data, ns.suri);
    if (gl.html) {
      out += " — " + gl.html + "입니다.";
    } else {
      out += "입니다.";
    }
    const tip = pointedSuriLine(ns);
    if (tip) out += " " + tip;
    if (ng) {
      out += " 같은 자리 주역은 " + gweLabel(ng) + "입니다.";
      const infl = suriInfluenceProse(ns, ng);
      if (infl) out += " " + infl;
    } else {
      out += " 같은 자리 주역 자료는 없습니다.";
    }
    return out;
  }

  function relWord(r) {
    if (r === "sangsaeng") return "생";
    if (r === "sanggeuk") return "극";
    return "비";
  }

  /** 【오행】 한 블록 — 겉·속·인덕·극 많으면 복 절반 */
  function buildOhangBlock(ctx) {
    const ot = String(ctx.ohangText || "").trim();
    const o = ctx.ohang || null;
    const bits = [];
    if (ot) bits.push(esc(ot));
    if (o) {
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
      const up = o.up;
      const dn = o.dn;
      const upHj = o.upHj;
      const dnHj = o.dnHj;
      const hasHj = !!(o.q && (upHj || dnHj));
      if (hasHj && (up || dn)) {
        const hangulGeuk =
          up === "sanggeuk" || dn === "sanggeuk";
        const hangulSaeng =
          up === "sangsaeng" || dn === "sangsaeng";
        const hanjaGeuk =
          upHj === "sanggeuk" || dnHj === "sanggeuk";
        const hanjaSaeng =
          upHj === "sangsaeng" || dnHj === "sangsaeng";
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
    }
    if (!bits.length) return "";
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
            " 장년·말년에 주역 「화택규」가 연속됩니다. 심장마비로 사망하기 쉬운 기운이니, 다른 자리의 길괘만 보고 좋다고 단정하면 안 됩니다."
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
      paras.push(explainWhoProse("한글", ns, ng, ag));
      if (hasHanja) paras.push(explainWhoProse("한문", hs, hg, ag));

      if (hasB) {
        paras.push(explainWhoProse("탄생일", bs, bg, ag));

        function pushGweVsSaju(who, nameG, badG, goodG) {
          if (!nameG || !bg) return;
          if (badG) {
            hitList.push({ ag: ag, ng: nameG, bg: bg, who: who });
            if (bBadG) {
              paras.push(
                who +
                  " 주역은 이름·사주 모두 " +
                  paintRed("흉괘") +
                  "(" +
                  paintRed("「" + strip(nameG.name) + "」") +
                  "·" +
                  paintRed("「" + strip(bg.name) + "」") +
                  ")가 겹쳐 " +
                  ag +
                  "에 큰 시련·상처가 배가됩니다."
              );
            } else {
              paras.push(
                who +
                  " 주역은 " +
                  ag +
                  "에 이름 " +
                  gweLabel(nameG) +
                  "가 사주 " +
                  gweLabel(bg) +
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
                  gweLabel(nameG) +
                  "가 사주 " +
                  gweLabel(bg) +
                  "의 흉을 받쳐 주어 " +
                  ag +
                  "에 발전·재물운이 열리기 쉽습니다."
              );
            } else if (bGoodG) {
              paras.push(
                who +
                  " 주역은 이름·사주 " +
                  paintBlue("길괘") +
                  "(" +
                  paintBlue("「" + strip(nameG.name) + "」") +
                  "·" +
                  paintBlue("「" + strip(bg.name) + "」") +
                  ")가 맞물려 " +
                  ag +
                  "에 순조롭습니다."
              );
            } else {
              paras.push(
                who +
                  " 주역은 " +
                  ag +
                  "에 이름 길괘 " +
                  gweLabel(nameG) +
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
              gweLabel(ng) +
              " 흉괘가 사주를 치는 형국이라 조심해야 합니다."
          );
        }
        if (hasHanja && hg && hBadG && hasB && !bg) {
          hitList.push({ ag: ag, ng: hg, bg: null, who: "한문" });
          paras.push(
            "한문 주역은 " +
              ag +
              "에 이름 " +
              gweLabel(hg) +
              " 흉괘가 사주를 치는 형국이라 조심해야 합니다."
          );
        }
      }

      const periodBad = !!(nBadG || nBadS || hBadG || hBadS);
      const periodGood =
        !!(nGoodG || nGoodS || hGoodG || hGoodS) && !periodBad;
      if (ag === "말년") {
        if (malBad && malSajuBad) {
          paras.push(
            "▶ 말년 가중: 이름·사주 말년이 모두 흉이라 인생 전반에 흠집이 깊어지기 쉽습니다."
          );
        } else if (malGood && malSajuBad) {
          paras.push(
            "▶ 말년 삭감: 이름 말년 「길」이 사주 말년 「흉」을 삭감해 주어, 일단 좋은 이름 기운입니다."
          );
        } else if (malBad && malSajuGood) {
          paras.push(
            "▶ 말년 주의: 사주 말년은 길해도 이름 말년 「흉」이 전체를 눌러 초·장·중에도 부담이 갑니다."
          );
        } else if (malGood && malSajuGood) {
          paras.push(
            "▶ 말년 강화: 이름·사주 말년이 모두 길이니 인생 지표가 밝고 초·장·중 길도 더 세집니다."
          );
        } else if (malGood) {
          paras.push(
            "▶ 말년 「길」: 삶의 지표·지침이 밝아 초·장·중에도 좋은 기운을 더해 줍니다."
          );
        } else if (malBad) {
          paras.push(
            "▶ 말년 「흉」: 인생 전반에 흠집이 생기기 쉽고, 초·장·중 흉을 만나면 그 흉이 더 보태집니다."
          );
        }
      } else if (ag === "초년" || ag === "장년" || ag === "중년") {
        const sajuPeriodBad = !!(bBadG || bBadS);
        const sajuPeriodGood = !!bGoodG;
        if (malBad && periodBad) {
          const msg =
            "▶ 말년 흉 가중: 말년(총운) 「흉」에 " +
            ag +
            " 「흉」이 더해져, 그 시기 시련이 한층 커지고 쓸어가듯 몰아칠 수 있습니다.";
          paras.push(msg);
          amplifyParts.push("【" + ag + "】 " + msg.replace(/^▶ /, ""));
        } else if (malGood && periodGood) {
          const msg =
            "▶ 말년 길 강화: 말년(총운) 「길」에 " +
            ag +
            " 「길」이 더해져, 그 시기 좋은 기운이 더 세집니다.";
          paras.push(msg);
          amplifyParts.push("【" + ag + "】 " + msg.replace(/^▶ /, ""));
        } else if (malGood && periodBad) {
          const msg =
            "▶ 말년 길 완충: 말년 「길」이 " +
            ag +
            " 「흉」을 덜어 주어, 그 시기 상처가 한결 가벼워질 수 있습니다.";
          paras.push(msg);
          amplifyParts.push("【" + ag + "】 " + msg.replace(/^▶ /, ""));
        } else if (malBad && periodGood) {
          const msg =
            "▶ 말년 흉 속 길: 말년은 「흉」이어도 " +
            ag +
            " 「길」은 그 나이대(±3년)만 버티는 힘이 됩니다.";
          paras.push(msg);
          amplifyParts.push("【" + ag + "】 " + msg.replace(/^▶ /, ""));
        }
        if (hasB && malGood && sajuPeriodBad) {
          const msg =
            "이름 말년 「길」이 사주 " + ag + " 「흉」에도 영향·삭감력을 행사합니다.";
          paras.push("▶ " + msg);
          amplifyParts.push("【" + ag + "·사주】 " + msg);
        } else if (hasB && malBad && sajuPeriodBad) {
          const msg =
            "이름 말년 「흉」이 사주 " + ag + " 「흉」과 겹치면 그 시기 부담이 더 커집니다.";
          paras.push("▶ " + msg);
          amplifyParts.push("【" + ag + "·사주】 " + msg);
        } else if (hasB && malGood && sajuPeriodGood) {
          const msg =
            "이름 말년 「길」이 사주 " + ag + " 「길」을 도와 그 시기 좋은 운이 더 열립니다.";
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
      if (bad > good && bad - good >= 2) return "흉한 기운이 더 두드러집니다";
      if (good > bad && good - bad >= 2) return "길한 기운이 더 두드러집니다";
      if (bad > good) return "흉이 조금 더 무겁습니다";
      if (good > bad) return "길이 조금 더 열립니다";
      if (bad === 0 && good === 0) return "뚜렷한 흉·길이 크게 드러나지 않습니다";
      return "흉·길이 비슷한 무게로 섞여 있습니다";
    }

    compareParts.push(
      "【흉·길 비교】 이름(한글" +
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
      "【나이대 원칙】 말년(총운)만 인생 전체에 영향주며 말년의 흉·길이 초년·장년·중년에도 영향력을 행사합니다. 초년·장년·중년은 자기 나이대에만 영향력을 행사합니다. 나이대 경계 오차는 플러스·마이너스 약 3년 내외입니다."
    );
    if (amplifyParts.length) {
      compareParts.push("【말년 가중·강화】 " + amplifyParts.join(" "));
    } else if (malGood || malBad) {
      compareParts.push(
        malGood
          ? "【말년 가중·강화】 이름 말년은 「길」입니다. 초·장·중 길과 만나면 더 세지고, 사주 흉이 있어도 말년 길이 삭감·완충합니다."
          : "【말년 가중·강화】 이름 말년은 「흉」입니다. 초·장·중 흉과 만나면 그 흉이 더 보태지니 해당 시기를 각별히 조심하십시오."
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
          out.push("「" + key + "」");
        }
      });
      return out;
    }
    function byAgeHelp(arr) {
      return arr.map(function (h) {
        if (h.bg) {
          return h.ag + "에 「" + strip(h.ng.name) + "」→사주「" + strip(h.bg.name) + "」";
        }
        return h.ag + "에 「" + strip(h.ng.name) + "」→사주";
      });
    }

    if (!hasB) {
      const nameBadGwes = [];
      const nameGoodGwes = [];
      ages.forEach(function (ag, ii) {
        const g = nmG[ii];
        if (gweBad(g)) nameBadGwes.push("한글「" + strip(g.name) + "」(" + ag + ")");
        if (gweGood(g)) nameGoodGwes.push("한글「" + strip(g.name) + "」(" + ag + ")");
        if (hasHanja) {
          const h = hjG[ii];
          if (gweBad(h)) nameBadGwes.push("한문「" + strip(h.name) + "」(" + ag + ")");
          if (gweGood(h)) nameGoodGwes.push("한문「" + strip(h.name) + "」(" + ag + ")");
        }
      });
      if (specialWarn.length) {
        verdict =
          "【결론】 " +
          specialWarn.join(" ") +
          " 한글 길괘만 보고 좋은 이름이라고 단정하면 안 됩니다.";
      } else if (nameBadGwes.length > 0) {
        verdict =
          "【결론】 생년월일 없이 이름만 봤습니다. 이름 흉괘 " +
          nameBadGwes.join("·") +
          "가 해당 시기에 사주를 칠 수 있으니 조심하십시오.";
      } else if (nameGoodGwes.length > 0) {
        verdict =
          "【결론】 생년월일 없이 이름만 봤습니다. 흉괘가 없고 청색길괘 " +
          nameGoodGwes.join("·") +
          "가 사주를 시기별로 도와준다. 그래서 좋은이름을 가졌네요.";
      } else {
        verdict =
          "【결론】 생년월일 없이 이름만 봤습니다. 이름에 뚜렷한 흉괘·길괘는 없습니다.";
      }
    } else if (specialWarn.length) {
      verdict =
        "【결론】 " +
        specialWarn.join(" ") +
        (hitList.length
          ? " 또한 이름 흉괘 " +
            listGweNames(hitList).join("·") +
            "가 사주를 시기별로 칩니다."
          : "") +
        " 한글 길괘만 보고 좋은 이름이라고 단정하면 안 됩니다.";
    } else if (hitList.length > 0) {
      const nameList = listGweNames(hitList);
      const byAge = hitList.map(function (h) {
        if (h.bg) {
          return h.ag + "에 「" + strip(h.ng.name) + "」→사주「" + strip(h.bg.name) + "」";
        }
        return h.ag + "에 「" + strip(h.ng.name) + "」→사주";
      });
      verdict =
        "【결론】 이름 흉괘 " +
        nameList.join("·") +
        "가 사주를 시기별로 친다. (" +
        byAge.join(", ") +
        ")";
      if (helpList.length > 0) {
        verdict +=
          " 한편 청색길괘 " +
          listGweNames(helpList).join("·") +
          "가 사주를 시기별로 도와준다. (" +
          byAgeHelp(helpList).join(", ") +
          ")";
      }
    } else if (helpList.length > 0) {
      verdict =
        "【결론】 흉괘가 없고 청색길괘 " +
        listGweNames(helpList).join("·") +
        "가 사주를 시기별로 도와준다. (" +
        byAgeHelp(helpList).join(", ") +
        ") 그래서 좋은이름을 가졌네요.";
    } else {
      verdict =
        "【결론】 이름 흉괘가 사주를 시기별로 치는 형국은 없다. 위 【총운(말년)】·【초년】~【중년】의 흉·길 대조를 참고하십시오.";
    }

    compareParts.push(verdict);
    compareParts.push(
      "이름이나 탄생일의 말년(총운)이 좋아야 내 인생의 말년·건강·재물이 좋아집니다. (말년만 전체에 미치며 초·장·중년에도 영향을 받고, 나머지 나이대는 해당 시기±3년 안입니다.)"
    );

    return {
      ageText: ageParts.join("<br><br>"),
      conclusion: compareParts
        .map(function (p) {
          return p.indexOf("<span") >= 0 ? p : colorMarks(p);
        })
        .join("<br>"),
    };
  };
})();
