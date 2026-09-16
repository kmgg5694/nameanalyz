/* 요약보기 — 초·장·중·말년 흉/길 핵심요약 전개 + 이름·사주 주역괘 결론 (원본 d6/Ee 비침범) */
(function () {
  const CS = () => window.__CORE_SUMMARIES__ || { suri: {}, hex: {} };

  function strip(s) {
    return String(s || "")
      .replace(/\([^)]*\)/g, "")
      .replace(/\s+/g, " ")
      .trim();
  }

  function suriBad(d) {
    return !!d && (d.type === "taboo" || d.type === "caution" || d.type === "bad");
  }

  function suriGood(d) {
    // 수리는 길수(청색) 개념 없음 — 흉만 구분
    return false;
  }

  function gweBad(g) {
    return !!(g && g.isTaboo);
  }

  function gweGood(g) {
    return !!(g && g.isBest);
  }

  function coreSuri(num) {
    const x = CS().suri[String(num)];
    return (x && x.core) || "";
  }

  function coreHex(g) {
    if (!g) return "";
    const x = CS().hex[String(g.id)];
    return (x && x.core) || "";
  }

  function pickCore(kind, item, gwe) {
    if (kind === "suri" && item && item.suri) {
      const c = coreSuri(item.suri);
      if (c) return c.replace(/^(길수|흉수|평수|주의)\s*[—–-]\s*/, "");
    }
    if (kind === "gwe" && gwe) {
      const c = coreHex(gwe);
      if (c) return c.replace(/^(길괘|흉괘|중성)\s*[—–-]\s*/, "");
    }
    return "";
  }

  function suriLabel(d, num) {
    if (!d) return "";
    const nm = strip(d.name);
    const tag = suriBad(d) ? "흉수" : "평수";
    return num + "수 「" + nm + "」(" + tag + ")";
  }

  function gweLabel(g) {
    if (!g) return "";
    const tag = gweBad(g) ? "흉괘" : gweGood(g) ? "길괘" : "중성";
    return "「" + strip(g.name) + "」(" + tag + ")";
  }

  /** @param ctx bundle에서 넘기는 데이터 */
  window.koSumRoutine = function koSumRoutine(ctx) {
    const ages = ctx.ages || ["말년", "초년", "장년", "중년"];
    const nmS = ctx.nmS || [];
    const nmG = ctx.nmG || [];
    const bdS = ctx.bdS || [];
    const bdG = ctx.bdG || [];
    const hasB = !!ctx.hasB;

    const ageParts = [];
    const compareParts = [];
    /** 이름 흉괘가 사주 시기를 치는 목록: [{ag, ng, bg}] */
    const hitList = [];
    /** 이름 길괘(청색)가 사주를 돕는 목록 */
    const helpList = [];
    /** 이름 길괘가 사주 흉을 받치는 목록 */
    const supportList = [];

    ages.forEach(function (ag, ii) {
      const ns = nmS[ii];
      const ng = nmG[ii];
      const bs = hasB ? bdS[ii] : null;
      const bg = hasB ? bdG[ii] : null;
      const nd = ns && ns.data;
      const bd = bs && bs.data;
      const nBadS = suriBad(nd);
      const nGoodS = suriGood(nd);
      const nBadG = gweBad(ng);
      const nGoodG = gweGood(ng);
      const bBadS = suriBad(bd);
      const bGoodS = suriGood(bd);
      const bBadG = gweBad(bg);
      const bGoodG = gweGood(bg);

      const bits = [];
      bits.push("【" + ag + "】");

      if (nBadS || nBadG) {
        const suriPart = nBadS
          ? "수리 " +
            suriLabel(nd, ns.suri) +
            " — " +
            (pickCore("suri", ns, null) || "")
          : "수리 해당 없음";
        const gwePart = nBadG
          ? "주역 " +
            gweLabel(ng) +
            " — " +
            (pickCore("gwe", null, ng) || "")
          : "주역 해당 없음";
        bits.push("▶ 흉(수리·주역 대조): " + suriPart + " ↔ " + gwePart);
      }

      if (nGoodS || nGoodG) {
        const suriPart = nGoodS
          ? "수리 " +
            suriLabel(nd, ns.suri) +
            " — " +
            (pickCore("suri", ns, null) || "")
          : "수리 해당 없음";
        const gwePart = nGoodG
          ? "주역 " +
            gweLabel(ng) +
            " — " +
            (pickCore("gwe", null, ng) || "")
          : "주역 해당 없음";
        bits.push("▶ 길(수리·주역 대조): " + suriPart + " ↔ " + gwePart);
      }

      if (!nBadS && !nBadG && !nGoodS && !nGoodG) {
        bits.push("이름 기운은 평이한 편입니다.");
      }

      if (hasB) {
        if (bBadS || bBadG) {
          const segs = [];
          if (bBadS) {
            const c = pickCore("suri", bs, null) || "";
            segs.push("사주 흉·수리 " + suriLabel(bd, bs.suri) + (c ? " — " + c : ""));
          }
          if (bBadG) {
            const c = pickCore("gwe", null, bg) || "";
            segs.push("사주 흉·주역 " + gweLabel(bg) + (c ? " — " + c : ""));
          }
          bits.push("사주 쪽 흉: " + segs.join(" / "));
        }
        if (bGoodS || bGoodG) {
          const segs = [];
          if (bGoodS) {
            const c = pickCore("suri", bs, null) || "";
            segs.push("사주 길·수리 " + suriLabel(bd, bs.suri) + (c ? " — " + c : ""));
          }
          if (bGoodG) {
            const c = pickCore("gwe", null, bg) || "";
            segs.push("사주 길·주역 " + gweLabel(bg) + (c ? " — " + c : ""));
          }
          bits.push("사주 쪽 길: " + segs.join(" / "));
        }

        if (ng && bg) {
          if (nBadG) {
            hitList.push({ ag: ag, ng: ng, bg: bg });
            if (bBadG) {
              bits.push(
                "주역괘: 이름·사주 모두 흉괘(" +
                  strip(ng.name) +
                  "·" +
                  strip(bg.name) +
                  ")가 겹쳐 " +
                  ag +
                  "에 큰 시련·상처가 배가됩니다."
              );
            } else {
              bits.push(
                "주역괘: " +
                  ag +
                  "에 이름 " +
                  gweLabel(ng) +
                  "가 사주 " +
                  gweLabel(bg) +
                  "를 치어(눌러) 그 시기 운이 막히기 쉽습니다."
              );
            }
          } else if (nGoodG) {
            helpList.push({ ag: ag, ng: ng, bg: bg });
            if (bBadG) {
              supportList.push({ ag: ag, ng: ng, bg: bg });
              bits.push(
                "주역괘: 이름 " +
                  gweLabel(ng) +
                  "가 사주 " +
                  gweLabel(bg) +
                  "의 흉을 받쳐 주어 " +
                  ag +
                  "에 발전·재물운이 열리기 쉽습니다."
              );
            } else if (bGoodG) {
              bits.push(
                "주역괘: 이름·사주 길괘(" +
                  strip(ng.name) +
                  "·" +
                  strip(bg.name) +
                  ")가 맞물려 " +
                  ag +
                  "에 순조롭습니다."
              );
            } else {
              bits.push("주역괘: " + ag + "은 이름 길괘 " + gweLabel(ng) + " 기운이 돕습니다.");
            }
          }
        } else if (ng && nBadG && hasB) {
          hitList.push({ ag: ag, ng: ng, bg: null });
          bits.push(
            "주역괘: " +
              ag +
              "은 이름 " +
              gweLabel(ng) +
              " 흉괘가 사주를 치는 형국이라 조심해야 합니다."
          );
        } else if (ng && nGoodG && hasB) {
          helpList.push({ ag: ag, ng: ng, bg: bg || null });
          bits.push("주역괘: " + ag + "은 이름 길괘 " + gweLabel(ng) + " 기운이 돕습니다.");
        }
      }

      ageParts.push(bits.join(" "));
    });

    let nBad = 0,
      nGood = 0,
      bBad = 0,
      bGood = 0;
    nmS.forEach(function (x) {
      if (suriBad(x && x.data)) nBad++;
      if (suriGood(x && x.data)) nGood++;
    });
    nmG.forEach(function (g) {
      if (gweBad(g)) nBad++;
      if (gweGood(g)) nGood++;
    });
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

    compareParts.push(
      "【흉·길 비교】 이름 — 흉(수리+주역) " +
        nBad +
        "개·길(주역만) " +
        nGood +
        "개" +
        (hasB ? " / 사주 — 흉(수리+주역) " + bBad + "개·길(주역만) " + bGood + "개" : "")
    );
    compareParts.push(
      "수리는 흉만 구별하고(청색 길수 없음), 위 【말년】을 먼저 본 뒤 【초년】~【중년】에서 흉·길 주역과 흉 수리를 핵심요약으로 대조합니다."
    );

    compareParts.push("결국 인생은 주역괘대로 흘러갑니다.");
    compareParts.push(
      "【나이대 원칙】 말년(총운)만 인생 전체에 영향하며 말년의 흉·길이 초년·장년·중년에도 영향력을 행사합니다. 초년·장년·중년은 자기 나이대에만 영향력을 행사합니다. 나이대 경계 오차는 플러스·마이너스 약 3년 내외입니다."
    );

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
        if (gweBad(g)) nameBadGwes.push("「" + strip(g.name) + "」(" + ag + ")");
        if (gweGood(g)) nameGoodGwes.push("「" + strip(g.name) + "」(" + ag + ")");
      });
      if (nameBadGwes.length > 0) {
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
    } else if (hitList.length > 0) {
      // 「이름 흉괘 무엇 무엇이 사주를 시기별로 친다」
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
        "【결론】 이름 흉괘가 사주를 시기별로 치는 형국은 없다. 위 【말년】·【초년】~【중년】의 흉·길 수리·주역 대조를 참고하십시오.";
    }

    compareParts.push(verdict);
    compareParts.push(
      "이름이나 탄생일의 말년(총운)이 좋아야 내 인생의 말년·건강·재물이 좋아집니다. (말년만 전체에 미치며 초·장·중년에도 영향하고, 나머지 나이대는 해당 시기±3년 안입니다.)"
    );

    return {
      ageText: ageParts.join("\n\n"),
      conclusion: compareParts.join(" "),
    };
  };
})();
