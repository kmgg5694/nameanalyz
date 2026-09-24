/**
 * English overall reading — brief like Korean ko-sum
 * Order: Five Elements → name by age → birth by age → help/hurt → tip → Warning + Footnotes
 * Ages: 1–23 · 24–40 · 41–55 · 56+ (whole life)
 * Arrays: [early, prime, mid, late]
 * Keeps Warning Board + Footnotes (do not remove).
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

  function badMarks(nS, nG, idx) {
    const marks = [];
    if (nS[idx] && nS[idx].data && suriBad(nS[idx].data))
      marks.push(suriPhrase(nS[idx]));
    if (nG[idx] && nG[idx].name && gweBad(nG[idx]))
      marks.push(gweNameHtml(nG[idx]));
    return marks;
  }
  function goodMarks(nS, nG, idx) {
    const marks = [];
    if (nS[idx] && nS[idx].data && suriGood(nS[idx].data))
      marks.push(suriPhrase(nS[idx]));
    if (nG[idx] && nG[idx].name && gweGood(nG[idx]))
      marks.push(gweNameHtml(nG[idx]));
    if (nG[idx] && isMitigate(nG[idx])) {
      const h = gweNameHtml(nG[idx]);
      if (marks.indexOf(h) < 0) marks.push(h);
    }
    return marks;
  }
  function allMarks(sArr, gArr, idx) {
    const marks = [];
    if (sArr[idx] && sArr[idx].data) marks.push(suriPhrase(sArr[idx]));
    if (gArr[idx] && gArr[idx].name) marks.push(gweNameHtml(gArr[idx]));
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

  /** Warning Board + Footnotes (same lists as Korean — keep always) */
  const WARN_JANG_SURI = [
    { n: 9, en: "Big Ambition" },
    { n: 10, en: "Empty Effort" },
    { n: 12, en: "Weak Fortune" },
    { n: 14, en: "Collapse" },
    { n: 20, en: "Total Failure" },
    { n: 22, en: "Midway Fall" },
    { n: 26, en: "Hero Storm" },
    { n: 28, en: "Turbulence" },
    { n: 34, en: "Disaster Chain" },
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
    { n: 10, en: "Empty Effort" },
    { n: 12, en: "Weak Fortune" },
    { n: 14, en: "Collapse" },
    { n: 20, en: "Total Failure" },
    { n: 22, en: "Midway Fall" },
    { n: 26, en: "Hero Storm" },
    { n: 28, en: "Turbulence" },
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
    "If overall destiny (56+) has 26 Hero Storm or 28 Turbulence, short life is common; for women, separation/widowhood is common.";
  const FOOT_CHONGUN_CANCER =
    "Does the name bring cancer? If overall destiny has Collapse (14), Total Failure (20), or Midway Fall (22), cancer is common.";
  const FOOT_SURI20_22 =
    "20 Total Failure and 22 Midway Fall are more fearsome than 14 Collapse: often cancer. With a strong mind and drive one may rise high, then lose it mid-course—failure, bankruptcy, accident, illness, prison, short life. Exception: 20 with certain helpful hexagrams can read as lasting wealth—only if the birth chart is at least ordinary.";
  const FOOT_FOOTER =
    "If this name holds any of the numbers or hexagrams above, there is no real alternative except a name change.";

  function suriInName(nS, num) {
    for (let i = 0; i < 4; i++) {
      if (nS[i] && Number(nS[i].suri) === num) return true;
    }
    return false;
  }
  function hexInName(nG, name) {
    for (let i = 0; i < 4; i++) {
      if (hexNameStarts(nG[i], name)) return true;
    }
    return false;
  }
  function collectHits(nS, nG) {
    const hits = [];
    const labels = ["1–23", "24–40", "41–55", "56+"];
    for (let i = 0; i < 4; i++) {
      const ns = nS[i];
      if (ns && ns.suri != null) {
        const num = Number(ns.suri);
        for (let j = 0; j < FOOT_SURI.length; j++) {
          if (FOOT_SURI[j].n === num) {
            hits.push(
              labels[i] +
                " " +
                paintRed(num + " " + FOOT_SURI[j].en)
            );
          }
        }
      }
      const ng = nG[i];
      if (ng && ng.name) {
        for (let j = 0; j < FOOT_HEX.length; j++) {
          if (hexNameStarts(ng, FOOT_HEX[j])) {
            hits.push(labels[i] + " " + paintRed(gweNameEn(ng) || FOOT_HEX[j]));
          }
        }
      }
    }
    return hits;
  }
  function chongunNotes(nS) {
    const late = nS[I.late];
    if (!late || late.suri == null) return [];
    const n = Number(late.suri);
    const notes = [];
    if (n === 26 || n === 28) notes.push(FOOT_CHONGUN_DAN);
    if (n === 14 || n === 20 || n === 22) notes.push(FOOT_CHONGUN_CANCER);
    if (n === 20 || n === 22) notes.push(FOOT_SURI20_22);
    return notes;
  }

  function warningFootnoteHtml(nS, nG) {
    const warnSuri = WARN_JANG_SURI.map(function (s) {
      return s.n + " " + s.en;
    }).join(", ");
    const warnHex = WARN_JANG_HEX.join(", ");
    const footSuri = FOOT_SURI.map(function (s) {
      return s.n + " " + s.en;
    }).join(", ");
    const footHex = FOOT_HEX.join(", ");
    const hits = collectHits(nS, nG);
    const chong = chongunNotes(nS);

    const warnBox =
      '<div style="margin-top:16px">' +
      '<div style="font-weight:800;font-size:1.1rem;color:#111;margin:0 0 8px">Warning Board</div>' +
      '<div style="background:#FFFF00;color:#FF1493;font-weight:700;line-height:1.6;padding:12px 10px;border-radius:6px;font-size:0.95rem">' +
      "If your name shows " +
      '<span style="color:#FF0000">' +
      warnSuri +
      "</span>" +
      ", or hexagrams such as " +
      '<span style="color:#FF0000">' +
      warnHex +
      "</span>" +
      ", a prompt name change is the surest way to cut the damage." +
      "</div></div>";

    let applyBlock = "";
    if (hits.length) {
      applyBlock =
        '<div style="margin-top:10px;line-height:1.65;font-size:0.95rem;font-weight:700;color:#FF0000">' +
        "This name hits: " +
        hits.join(", ") +
        ". Serious hardship is likely—consider a name change carefully." +
        "</div>";
    }

    const chongunBox =
      '<div style="background:#FFFF00;border:2px solid #111;color:#111;font-weight:700;line-height:1.55;padding:10px;font-size:0.9rem;margin-top:8px">' +
      '<span style="color:#FF0000">' +
      FOOT_CHONGUN_DAN +
      "</span></div>" +
      '<div style="background:#FFFF00;border:2px solid #111;color:#111;font-weight:700;line-height:1.55;padding:10px;font-size:0.9rem;margin-top:8px">' +
      '<span style="color:#FF0000">' +
      FOOT_CHONGUN_CANCER +
      "</span></div>" +
      '<div style="background:#FFFF00;border:2px solid #111;color:#111;font-weight:700;line-height:1.55;padding:10px;font-size:0.9rem;margin-top:8px">' +
      '<span style="color:#FF0000">' +
      FOOT_SURI20_22 +
      "</span></div>";

    let chongApply = "";
    if (chong.length) {
      chongApply =
        '<div style="margin-top:8px;line-height:1.55;font-size:0.9rem;font-weight:700;color:#FF0000">' +
        "[Overall-destiny footnote applies] " +
        chong.join(" ") +
        "</div>";
    }

    const footBox =
      '<div style="margin-top:14px">' +
      '<div style="font-weight:800;font-size:1.1rem;color:#111;margin:0 0 8px">Footnotes</div>' +
      '<div style="background:#FFFF00;border:2px solid #111;color:#111;font-weight:700;line-height:1.55;padding:10px;font-size:0.9rem">' +
      'If your <span style="color:#FF1493">name</span> holds ' +
      '<span style="color:#FF0000">' +
      footSuri +
      "</span>" +
      ", or hexagrams " +
      '<span style="color:#FF0000">' +
      footHex +
      "</span>" +
      ", despairing situations follow." +
      "</div>" +
      chongunBox +
      applyBlock +
      chongApply +
      '<div style="margin-top:8px;line-height:1.5;font-size:0.9rem;font-weight:800;color:#FF1493">' +
      FOOT_FOOTER +
      "</div></div>";

    return warnBox + footBox;
  }

  window.enSumRoutine = function enSumRoutine(ctx) {
    ctx = ctx || {};
    const nS = ctx.nS || [];
    const nG = ctx.nG || [];
    const bS = ctx.bS || [];
    const bG = ctx.bG || [];
    const hasB = !!ctx.hasB;
    const parts = [];

    // 1) Five Elements
    const ohangHtml = buildOhang(ctx.ohang);
    if (ohangHtml) parts.push(ohangHtml);

    // 2) Name by age (one glance)
    {
      const bits = [];
      for (let i = 0; i < 4; i++) {
        const m = allMarks(nS, nG, i);
        if (m.length) bits.push(AGE[AGE_KEYS[i]] + ": " + m.join(", "));
      }
      if (bits.length) {
        parts.push(
          "<strong>Name</strong> (red = hard, blue = helpful)<br>" +
            bits.join("<br>")
        );
      }
    }

    if (!hasB) {
      parts.push(
        "No birth date—name only. Tap any underlined table item for full text."
      );
      parts.push(warningFootnoteHtml(nS, nG));
      return { ageText: parts.join("<br><br>") };
    }

    // 3) Birth chart by age
    {
      const bits = [];
      for (let i = 0; i < 4; i++) {
        const m = allMarks(bS, bG, i);
        if (m.length) bits.push(AGE[AGE_KEYS[i]] + ": " + m.join(", "));
      }
      if (bits.length) {
        parts.push("<strong>Birth chart</strong><br>" + bits.join("<br>"));
      }
    }

    parts.push(
      "56+ colors the whole life (± about 3 years). 1–23, 24–40, and 41–55 mainly act in their own ages."
    );

    // 4) Name help or hurt — short, like Korean
    parts.push("Does the name help the birth chart, or cause it pain?");

    const malBad = badMarks(nS, nG, I.late);
    const malHurt = sideBad(nS, nG, I.late);
    const sajuMal = allMarks(bS, bG, I.late);

    if (malHurt && malBad.length) {
      parts.push(
        "At 56+, birth chart has " +
          (sajuMal.join(", ") || "—") +
          ", but the name has " +
          joinMarks(malBad) +
          " — it " +
          paintRed("hurts the chart for life") +
          ". " +
          paintRed("A name change") +
          " is needed."
      );
    } else if (sideGood(nS, nG, I.late) && sideGood(bS, bG, I.late)) {
      const gm = goodMarks(nS, nG, I.late);
      parts.push(
        "At 56+, the name " +
          joinMarks(gm.length ? gm : allMarks(nS, nG, I.late)) +
          " " +
          paintBlue("helps") +
          " the birth chart."
      );
    } else if (malBad.length) {
      parts.push(
        "At 56+, the name " +
          joinMarks(malBad) +
          " " +
          paintRed("causes pain") +
          ". Take this seriously."
      );
    }

    const bandBits = [];
    [
      { i: I.early, key: "early" },
      { i: I.prime, key: "prime" },
      { i: I.mid, key: "mid" },
    ].forEach(function (b) {
      const bad = badMarks(nS, nG, b.i);
      if (bad.length && malHurt && malBad.length) {
        bandBits.push(
          AGE[b.key] +
            ": " +
            joinMarks(bad) +
            " + later " +
            joinMarks(malBad) +
            " → more " +
            paintRed("pain") +
            "."
        );
      } else if (bad.length) {
        bandBits.push(
          AGE[b.key] +
            ": " +
            joinMarks(bad) +
            " " +
            paintRed("hurts") +
            " here."
        );
      } else if (sideGood(nS, nG, b.i)) {
        bandBits.push(AGE[b.key] + ": name " + paintBlue("helps") + " here.");
      }
    });
    if (bandBits.length) parts.push(bandBits.join("<br>"));

    if (malHurt && malBad.length) {
      parts.push(
        "This name harms a workable birth chart. It is wiser not to keep " +
          paintRed("this name") +
          "."
      );
    }

    parts.push(
      "For details, tap any underlined number or hexagram in the table."
    );

    // 5) Warning Board + Footnotes (always — do not remove)
    parts.push(warningFootnoteHtml(nS, nG));

    return { ageText: parts.join("<br><br>") };
  };
})();
