/**
 * English name reading — brief narrate (aligned with Korean ko-sum brief flow)
 * Arrays from English app: [early, prime, mid, late]
 * Does not touch Korean tables, iljin, or print CSS.
 * Does not modify original d6/Ee dictionary text in the English bundle.
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
  function gweBlack(g) {
    return !!(g && g.name) && !gweGood(g) && !gweBad(g);
  }
  function hasBadSuriBlackHex(ns, ng) {
    return !!(ns && ns.data && suriBad(ns.data) && gweBlack(ng));
  }

  function gweNameOf(g) {
    return strip(g && g.name);
  }
  function gweNameEn(g) {
    if (!g || !g.name) return "";
    return strip(g.nameEn || g.name);
  }
  function plainSuriName(ns) {
    if (!ns || !ns.data) return "";
    return strip(ns.data.nameEn || ns.data.name || "");
  }
  function hexNameStarts(g, name) {
    if (!g || !g.name || !name) return false;
    const n = gweNameOf(g);
    return n === name || n.indexOf(name) === 0;
  }

  const HEX_MITIGATE_SURI = [
    "이위화",
    "화풍정",
    "화천대유",
    "화수미제",
    "산천대축",
    "수풍정",
    "뇌천대장",
  ];
  const BIG_WEALTH = [
    "화천대유",
    "화수미제",
    "수풍정",
    "산천대축",
    "뇌천대장",
  ];
  const DEATH_SURI = [
    14, 19, 20, 26, 27, 28, 46, 70, 74, 79, 4, 9, 10, 22, 34, 64, 69,
  ];

  function isMitigateSuriHex(g) {
    if (!g || !g.name) return false;
    for (let i = 0; i < HEX_MITIGATE_SURI.length; i++) {
      if (hexNameStarts(g, HEX_MITIGATE_SURI[i])) return true;
    }
    return false;
  }
  function isWealthFortuneHex(g) {
    if (!g || !g.name) return false;
    const wealth = BIG_WEALTH.concat(["이위화"]);
    for (let i = 0; i < wealth.length; i++) {
      if (hexNameStarts(g, wealth[i])) return true;
    }
    return false;
  }
  function hasBadSuriMitigateHex(ns, ng) {
    return !!(ns && ns.data && suriBad(ns.data) && isMitigateSuriHex(ng));
  }

  function suriPhrase(ns) {
    if (!ns || ns.suri == null || !ns.data) return "";
    const nm = plainSuriName(ns);
    const head = nm ? ns.suri + ", " + nm : String(ns.suri);
    if (suriBad(ns.data)) return paintRed(head);
    if (suriGood(ns.data)) return paintBlue(head);
    return "<strong>" + esc(head) + "</strong>";
  }
  function gweNameHtml(g) {
    if (!g || !g.name) return "";
    const nm = gweNameEn(g);
    if (gweBad(g)) return paintRed(nm);
    if (gweGood(g)) return paintBlue(nm);
    return "<strong>" + esc(nm) + "</strong>";
  }
  function joinMarks(arr) {
    return (arr || []).join(", ");
  }

  /** English array indices */
  const I = { early: 0, prime: 1, mid: 2, late: 3 };
  const SPEAK = {
    early: "early years",
    prime: "prime years",
    mid: "middle years",
    late: "later years (overall destiny)",
  };

  function sideToneAt(sArr, gArr, idx) {
    const s = sArr && sArr[idx];
    const g = gArr && gArr[idx];
    if (hasBadSuriBlackHex(s, g)) return "bad";
    if (hasBadSuriMitigateHex(s, g)) return "good";
    let good = 0;
    let bad = 0;
    if (s && s.data && suriGood(s.data)) good++;
    if (s && s.data && suriBad(s.data)) bad++;
    if (g && g.name && gweGood(g)) good++;
    if (g && g.name && gweBad(g)) bad++;
    if (bad && !good) return "bad";
    if (good && !bad) return "good";
    if (good && bad) return "mixed";
    return "plain";
  }

  function slightTrialHexOk(sArr, gArr, idx) {
    const sBad = !!(sArr[idx] && sArr[idx].data && suriBad(sArr[idx].data));
    const g = gArr[idx];
    const hexOk = !!(g && g.name && !gweBad(g));
    return sBad && hexOk;
  }

  /**
   * ctx: { nS, nG, bS, bG, hasB, lang }
   * arrays: [early, prime, mid, late]
   */
  window.enSumRoutine = function enSumRoutine(ctx) {
    ctx = ctx || {};
    const nS = ctx.nS || [];
    const nG = ctx.nG || [];
    const bS = ctx.bS || [];
    const bG = ctx.bG || [];
    const hasB = !!ctx.hasB;
    const parts = [];

    function nameBadMarksAt(idx) {
      const marks = [];
      if (nS[idx] && nS[idx].data && suriBad(nS[idx].data))
        marks.push(suriPhrase(nS[idx]));
      if (nG[idx] && nG[idx].name && gweBad(nG[idx]))
        marks.push(gweNameHtml(nG[idx]));
      return marks;
    }
    function nameGoodMarksAt(idx) {
      const marks = [];
      if (nS[idx] && nS[idx].data && suriGood(nS[idx].data))
        marks.push(suriPhrase(nS[idx]));
      if (nG[idx] && nG[idx].name && gweGood(nG[idx]))
        marks.push(gweNameHtml(nG[idx]));
      if (nG[idx] && isMitigateSuriHex(nG[idx])) {
        const h = gweNameHtml(nG[idx]);
        if (marks.indexOf(h) < 0) marks.push(h);
      }
      return marks;
    }
    function nameMarksAt(idx) {
      const marks = [];
      if (nS[idx] && nS[idx].data) marks.push(suriPhrase(nS[idx]));
      if (nG[idx] && nG[idx].name) marks.push(gweNameHtml(nG[idx]));
      return marks;
    }
    function nameSideBad(idx) {
      return (
        hasBadSuriBlackHex(nS[idx], nG[idx]) ||
        (nS[idx] && nS[idx].data && suriBad(nS[idx].data)) ||
        (nG[idx] && gweBad(nG[idx]))
      );
    }
    function nameSideGood(idx) {
      if (hasBadSuriBlackHex(nS[idx], nG[idx])) return false;
      return (
        hasBadSuriMitigateHex(nS[idx], nG[idx]) ||
        (nG[idx] && gweGood(nG[idx])) ||
        (nS[idx] && nS[idx].data && suriGood(nS[idx].data))
      );
    }
    function sajuSideGood(idx) {
      if (hasBadSuriBlackHex(bS[idx], bG[idx])) return false;
      return (
        hasBadSuriMitigateHex(bS[idx], bG[idx]) ||
        (bG[idx] && gweGood(bG[idx])) ||
        (bS[idx] && bS[idx].data && suriGood(bS[idx].data))
      );
    }
    function nameMitAt(idx) {
      return (
        hasBadSuriMitigateHex(nS[idx], nG[idx]) ||
        (nG[idx] && isMitigateSuriHex(nG[idx]))
      );
    }
    function nameMitMarksAt(idx) {
      const marks = [];
      if (nG[idx] && isMitigateSuriHex(nG[idx]))
        marks.push(gweNameHtml(nG[idx]));
      return marks;
    }
    function isWealthMitAt(idx) {
      if (nG[idx] && isWealthFortuneHex(nG[idx])) return true;
      return false;
    }
    function sajuBriefMarks(idx) {
      const marks = [];
      if (bS[idx] && bS[idx].data) marks.push(suriPhrase(bS[idx]));
      if (bG[idx] && bG[idx].name) marks.push(gweNameHtml(bG[idx]));
      return marks;
    }
    function nameSlotHasSuri(num) {
      const n = Number(num);
      for (let i = 0; i < 4; i++) {
        if (nS[i] && Number(nS[i].suri) === n) return true;
      }
      return false;
    }
    function nameSlotHasHex(hexName) {
      for (let i = 0; i < 4; i++) {
        if (hexNameStarts(nG[i], hexName)) return true;
      }
      return false;
    }

    // —— 1) Four stroke numbers (early·prime·mid·late) ——
    {
      const nums = [I.early, I.prime, I.mid, I.late].map(function (i) {
        return nS[i] && nS[i].suri != null ? Number(nS[i].suri) : null;
      });
      if (
        !nums.every(function (n) {
          return n == null;
        })
      ) {
        const line =
          "Name stroke counts " +
          nums
            .map(function (n) {
              return n == null ? "—" : String(n);
            })
            .join(", ") +
          " (early · prime · mid · late).";
        let note = "";
        const labels = ["early years", "prime years", "middle years", "later years (overall)"];
        const hit14 = [];
        for (let i = 0; i < 4; i++) {
          if (nums[i] === 14) hit14.push(labels[i]);
        }
        if (hit14.length) {
          note =
            " " +
            paintRed("14 (Scattered Ruin)") +
            " appears in " +
            hit14.join(" · ") +
            ".";
        }
        parts.push(line + note);
      }
    }

    if (!hasB) {
      parts.push(
        "No birth date was entered, so this reading stays with the name alone."
      );
      parts.push(
        "To see stroke or hexagram detail from the name table, lightly tap any underlined item."
      );
      return { ageText: parts.join("<br><br>") };
    }

    // —— 2) Birth chart intro + later-years as overall axis ——
    parts.push(
      "Looking at the birth chart, we first ask how this life is meant to unfold by period. " +
        "Later years (overall destiny) color the whole life; early, prime, and middle years act mainly in their own band (± about 3 years)."
    );

    {
      const marks = sajuBriefMarks(I.late);
      if (marks.length) {
        const tone = sideToneAt(bS, bG, I.late);
        let p =
          "The axis of the whole birth chart is later years (overall destiny): " +
          marks.join(", ");
        if (slightTrialHexOk(bS, bG, I.late)) {
          p +=
            "—some trial in the stroke count, yet the hexagram is not a harsh one.";
        } else if (tone === "good") {
          p += ", a supportive current.";
        } else if (tone === "bad") {
          p += ", a heavy current with trials.";
        } else if (tone === "mixed") {
          p += ", a mixed but workable current.";
        } else {
          p += ", a fairly plain current.";
        }
        p +=
          " Later-years energy influences the whole life, so this is the center of how the chart asks you to live.";
        parts.push(p);
      }
    }

    // —— 3) Bridge + name later years vs birth + rename ——
    parts.push(
      "Now we look at whether the name helps the birth chart or causes it pain."
    );

    const malBad = nameBadMarksAt(I.late);
    const malHurt = nameSideBad(I.late);
    const choBad = nameBadMarksAt(I.early);
    const jangBad = nameBadMarksAt(I.prime);
    const jungBad = nameBadMarksAt(I.mid);
    const jungMit = nameMitMarksAt(I.mid);
    const jungGood = nameGoodMarksAt(I.mid);

    function sajuMalComfortLead() {
      const g = bG[I.late];
      const hexName = g ? gweNameOf(g) : "";
      if (hexName.indexOf("이위화") === 0) {
        return (
          "In later years the birth chart has " +
          gweNameHtml(g) +
          ", a " +
          paintBlue("steady, comfortable current") +
          ", yet "
        );
      }
      const marks = sajuBriefMarks(I.late);
      if (!marks.length) return "";
      const toneWord = sajuSideGood(I.late)
        ? paintBlue("supportive current")
        : "current that appears";
      return (
        "In later years the birth chart has " +
        marks.join(", ") +
        ", a " +
        toneWord +
        ", yet "
      );
    }

    if (malHurt && malBad.length) {
      parts.push(
        sajuMalComfortLead() +
          "in the name’s later years " +
          joinMarks(malBad) +
          " " +
          paintRed("painfully stresses") +
          " the chart. Later-years energy acts across the whole life—this alone is enough that you should not keep " +
          paintRed("this name") +
          "; you need a " +
          paintRed("name change") +
          " for a new life."
      );
    } else if (nameSideGood(I.late) && sajuSideGood(I.late)) {
      parts.push(
        "The name’s later years " +
          joinMarks(
            nameGoodMarksAt(I.late).length
              ? nameGoodMarksAt(I.late)
              : nameMarksAt(I.late)
          ) +
          " read as " +
          paintBlue("helping") +
          " the birth chart."
      );
    } else if (malBad.length) {
      parts.push(
        sajuMalComfortLead() +
          "in the name’s later years " +
          joinMarks(malBad) +
          " " +
          paintRed("causes the chart pain") +
          ". Later years reach the whole life—take this seriously."
      );
    }

    // —— 4) Birth chart period one-liner (early·prime·mid·late) ——
    {
      const slots = [
        { i: I.late, key: "late", speak: "later years" },
        { i: I.early, key: "early", speak: "early years" },
        { i: I.prime, key: "prime", speak: "prime years" },
        { i: I.mid, key: "mid", speak: "middle years" },
      ];
      const filled = slots.filter(function (s) {
        return sajuBriefMarks(s.i).length > 0;
      });
      if (filled.length) {
        const bits = [];
        filled.forEach(function (slot, fi) {
          const marks = sajuBriefMarks(slot.i);
          const tone = sideToneAt(bS, bG, slot.i);
          const isLast = fi === filled.length - 1;
          const conj = slot.key === "early" ? " also " : " ";
          const label =
            (fi === 0 ? "Birth-chart " : "") + slot.speak + conj;
          let mid = marks.join(", ");
          let tail = "";
          if (slightTrialHexOk(bS, bG, slot.i)) {
            mid += "—";
            tail = isLast
              ? "some trial, yet the hexagram is not harsh."
              : "some trial, yet the hexagram is not harsh; ";
          } else if (tone === "good") {
            mid += " as ";
            if (slot.key === "late") {
              tail = isLast
                ? "a supportive current."
                : "a supportive current, ";
            } else if (slot.key === "early") {
              tail = isLast ? "a supportive current." : "a supportive current, ";
            } else {
              tail = isLast ? "a supportive stretch." : "a supportive stretch, ";
            }
          } else if (tone === "bad") {
            mid += " as ";
            tail = isLast
              ? "a heavy current with trials."
              : "a heavy current, ";
          } else {
            mid += " as ";
            tail = isLast ? "a fairly plain stretch." : "a fairly plain stretch, ";
          }
          bits.push(label + mid + tail);
        });
        let wealthCnt = 0;
        let painCnt = 0;
        for (let bi = 0; bi < bG.length; bi++) {
          const g = bG[bi];
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
        let close = "";
        if (wealthCnt >= 1) {
          close =
            " This chart’s hexagrams show wealth/success energy you can use.";
        } else if (painCnt >= 2) {
          close =
            " This chart’s hexagrams carry stacked heavy energy, so trials can overlap.";
        } else {
          close =
            " This chart’s hexagrams do not show a sharp great-wealth streak, yet they also lack crushing pain—a workable, ordinary-good chart.";
        }
        parts.push(bits.join("") + close);
      }
    }

    // —— 5) Early / prime / middle name vs chart ——
    {
      const bits = [];
      if (choBad.length && malHurt && malBad.length) {
        bits.push(
          "In early years the name has " +
            joinMarks(choBad) +
            "; joined with later-years " +
            joinMarks(malBad) +
            " it stacks even greater " +
            paintRed("pain") +
            "."
        );
      } else if (choBad.length) {
        bits.push(
          "In early years the name has " +
            joinMarks(choBad) +
            ", which " +
            paintRed("hurts") +
            " the chart in that band."
        );
      } else if (nameSideGood(I.early)) {
        bits.push(
          "Early-years name energy " +
            paintBlue("helps") +
            " the chart."
        );
      }

      if (jangBad.length && malHurt && malBad.length) {
        bits.push(
          "In prime years " +
            joinMarks(jangBad) +
            " meets later-years " +
            joinMarks(malBad) +
            " and builds still greater " +
            paintRed("pain") +
            ","
        );
      } else if (jangBad.length) {
        bits.push(
          "In prime years " +
            joinMarks(jangBad) +
            " " +
            paintRed("hurts") +
            " the chart."
        );
      } else if (nameSideGood(I.prime)) {
        bits.push(
          "Prime-years name energy " +
            paintBlue("helps") +
            " the chart."
        );
      }

      if (jungMit.length || (nameMitAt(I.mid) && jungBad.length)) {
        const badPart = jungBad.length
          ? "Middle-years name energy " + joinMarks(jungBad)
          : "Middle-years name energy";
        const mitPart = jungMit.length
          ? joinMarks(jungMit)
          : joinMarks(jungGood);
        let jung =
          badPart +
          " is thankfully pressed down by " +
          (mitPart || "a pressing hexagram");
        if (isWealthMitAt(I.mid) || jungMit.length) {
          jung +=
            "—wealth-leaning—so this band can be a peak, yet";
        } else {
          jung += ", which helps, yet";
        }
        if (malHurt && malBad.length) {
          jung +=
            " later-years " +
            joinMarks(malBad) +
            " " +
            paintRed("pain") +
            " is still hard to dodge: overall a good chart is harmed by the name.";
        } else {
          jung += " read it with the whole flow.";
        }
        bits.push(jung);
      } else if (jungBad.length && malHurt && malBad.length) {
        bits.push(
          "In middle years " +
            joinMarks(jungBad) +
            " overlaps later-years " +
            joinMarks(malBad) +
            " so " +
            paintRed("pain") +
            " continues. Overall a good chart is harmed by the name."
        );
      } else if (jungBad.length) {
        bits.push(
          "In middle years " +
            joinMarks(jungBad) +
            " " +
            paintRed("hurts") +
            " the chart."
        );
      } else if (nameSideGood(I.mid)) {
        bits.push(
          "Middle-years name energy " +
            paintBlue("helps") +
            " the chart."
        );
      }

      if (
        malHurt &&
        malBad.length &&
        !bits.some(function (b) {
          return b.indexOf("harmed by the name") >= 0;
        })
      ) {
        bits.push(
          "Overall a good chart is harmed by the name—it is wiser not to keep it."
        );
      }
      if (bits.length) parts.push(bits.join(" "));
    }

    // —— 6) Name hazards (cancer / divorce / accident / etc.) when listed ——
    {
      const has14 = nameSlotHasSuri(14);
      const has19 = nameSlotHasSuri(19);
      const has20 = nameSlotHasSuri(20);
      const has22 = nameSlotHasSuri(22);
      const has2 = nameSlotHasSuri(2);
      const mal14or20or22 =
        nS[I.late] &&
        [14, 20, 22].indexOf(Number(nS[I.late].suri)) >= 0;
      let hasDeath = false;
      for (let di = 0; di < DEATH_SURI.length; di++) {
        if (nameSlotHasSuri(DEATH_SURI[di])) {
          hasDeath = true;
          break;
        }
      }
      const hexCancer =
        nameSlotHasHex("천지비") || nameSlotHasHex("지화명이");
      const hexSuicideDivorce = nameSlotHasHex("풍천소축");
      const hexAccident = nameSlotHasHex("화택규");
      const tags = [];
      if (has14 || has2 || hexSuicideDivorce)
        tags.push(paintRed("separation / divorce"));
      if (has14 || mal14or20or22 || hexCancer)
        tags.push(paintRed("cancer / illness / surgery"));
      if (has14 || has19 || has20 || has22 || hasDeath || hexAccident)
        tags.push(paintRed("accident / death"));
      if (has14 || hexSuicideDivorce || has2)
        tags.push(paintRed("suicide / short life"));
      if (
        nS[I.late] &&
        [26, 28].indexOf(Number(nS[I.late].suri)) >= 0
      ) {
        tags.push(paintRed("bereavement / widowhood"));
      }
      const seen = {};
      const uniq = [];
      for (let ti = 0; ti < tags.length; ti++) {
        const k = tags[ti].replace(/<[^>]+>/g, "");
        if (seen[k]) continue;
        seen[k] = true;
        uniq.push(tags[ti]);
      }
      if (uniq.length) {
        let lead = "Inside this name we see ";
        if (has14) {
          lead =
            "In stroke lore, " +
            paintRed("14 (Scattered Ruin)") +
            " points to separation, accident, surgery, cancer, and death. This name shows ";
        }
        parts.push(
          lead +
            uniq.join(", ") +
            ". For exact placements, use the four stroke numbers above and the underlined table items below."
        );
      }
    }

    // —— 7) Closing tip (detail via underline; no long suri/hex dump) ——
    parts.push(
      "If you want the detailed stroke or hexagram text from the name table, lightly tap any underlined item—that clears most questions."
    );
    parts.push(
      "A name is a lifelong prayer of a few syllables. If that prayer asks for pain, early death, cancer, or heart failure, take a name change with care."
    );

    return { ageText: parts.join("<br><br>") };
  };
})();
