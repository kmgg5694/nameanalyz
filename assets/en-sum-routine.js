/**
 * English name reading — short overall reading (aligned with Korean brief flow)
 * Ages: early 1–23 (hex 1–30) · prime 24–40 (31–50) · mid 41–55 (51–55) · late 56+
 * Arrays from English app: [early, prime, mid, late]
 * Does not touch Korean tables / iljin / print / d6·Ee source text.
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

  /** Clear age labels (not “early / prime / mid”) */
  const AGE = {
    early: "ages 1–23",
    prime: "ages 24–40",
    mid: "ages 41–55",
    late: "ages 56 and after (whole-life tone)",
  };
  const I = { early: 0, prime: 1, mid: 2, late: 3 };

  const OH_EN = {
    木: "Wood",
    火: "Fire",
    土: "Earth",
    金: "Metal",
    水: "Water",
  };
  const GEN = { 木: "火", 火: "土", 土: "金", 金: "水", 水: "木" };
  const KEUK = { 木: "土", 火: "金", 土: "水", 金: "木", 水: "火" };
  const MID_TRAIT = {
    木: "growth and drive—you push forward and start things",
    火: "bright, quick, and open—sometimes impatient",
    土: "steady, patient, and trustworthy",
    金: "firm, direct, and exacting—but also serious about skill",
    水: "flexible and clear-headed—sometimes cool or distant",
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

  function buildOhang(oh) {
    if (!oh) return "";
    const counts = oh.counts || {};
    const dom = oh.dominant || "";
    const last = oh.lastRep || (oh.last && oh.last[0] && oh.last[0].ohang) || "";
    const first = oh.firstRep || (oh.first && oh.first[0] && oh.first[0].ohang) || "";
    const mid =
      oh.middleRep ||
      (oh.middle && oh.middle.length
        ? oh.middle[0].ohang
        : first);
    // English layout: last = family (above), first/middle = given (self/below varies)
    // Match existing English UI: upper link uses last→first generating count
    const up = last;
    const me = first || mid;
    const dn = mid && mid !== first ? mid : first;

    const bits = [];
    bits.push(
      "<strong>Five Elements (from the letters)</strong><br>" +
        "Wood " +
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
        "Strongest: " +
          elName(dom) +
          ". Center feel: " +
          (MID_TRAIT[dom] || "mixed") +
          "."
      );
    }
    if (up && me) {
      const d = dirUp(up, me);
      let line = "Toward parents / seniors / partner (last→first name): ";
      if (d === "recv_gen")
        line += paintBlue("you receive support") + " from above.";
      else if (d === "give_gen")
        line += paintBlue("you give support") + " upward.";
      else if (d === "recv_ctrl")
        line += paintRed("pressure from above") + " is easier.";
      else if (d === "give_ctrl")
        line += paintRed("you push against above") + " more easily.";
      else if (d === "same") line += "same element—calm but flat.";
      else line += elName(up) + " · " + elName(me) + ".";
      bits.push(line);
    }
    if (me && dn && dn !== me) {
      const d = dirDn(me, dn);
      let line = "Toward juniors / children (given-name flow): ";
      if (d === "give_gen")
        line += paintBlue("you give support") + " downward.";
      else if (d === "recv_gen")
        line += paintBlue("you receive support") + " from below.";
      else if (d === "give_ctrl")
        line += paintRed("you press down") + " more easily.";
      else if (d === "recv_ctrl")
        line += paintRed("pressure from below") + " is easier.";
      else if (d === "same") line += "same element—calm but flat.";
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

  window.enSumRoutine = function enSumRoutine(ctx) {
    ctx = ctx || {};
    const nS = ctx.nS || [];
    const nG = ctx.nG || [];
    const bS = ctx.bS || [];
    const bG = ctx.bG || [];
    const hasB = !!ctx.hasB;
    const parts = [];

    // 1) Five Elements — like Korean 오행 first
    const ohangHtml = buildOhang(ctx.ohang);
    if (ohangHtml) parts.push(ohangHtml);

    // 2) Four name numbers with ages
    {
      const keys = ["early", "prime", "mid", "late"];
      const bits = [];
      for (let i = 0; i < 4; i++) {
        const m = allMarks(nS, nG, i);
        if (!m.length) continue;
        bits.push(AGE[keys[i]] + ": " + m.join(", "));
      }
      if (bits.length) {
        parts.push(
          "<strong>Name by age</strong> (red = hard, blue = helpful)<br>" +
            bits.join("<br>")
        );
      }
    }

    if (!hasB) {
      parts.push(
        "No birth date entered—this is the name only. Tap any underlined table item for the full text of a number or hexagram."
      );
      return { ageText: parts.join("<br><br>") };
    }

    // 3) Birth chart by age
    {
      const keys = ["early", "prime", "mid", "late"];
      const bits = [];
      for (let i = 0; i < 4; i++) {
        const m = allMarks(bS, bG, i);
        if (!m.length) continue;
        bits.push(AGE[keys[i]] + ": " + m.join(", "));
      }
      if (bits.length) {
        parts.push(
          "<strong>Birth chart by age</strong><br>" + bits.join("<br>")
        );
      }
    }

    parts.push(
      "Ages 56+ set the whole-life tone (± about 3 years). Ages 1–23, 24–40, and 41–55 mainly act in their own band."
    );

    // 4) Does the name help or hurt? (short)
    const malBad = badMarks(nS, nG, I.late);
    const malHurt = sideBad(nS, nG, I.late);
    const sajuMal = allMarks(bS, bG, I.late);

    if (malHurt && malBad.length) {
      parts.push(
        "Birth chart at " +
          AGE.late +
          ": " +
          (sajuMal.join(", ") || "—") +
          ". Name at the same ages: " +
          joinMarks(malBad) +
          " — this " +
          paintRed("hurts the chart for life") +
          ". " +
          paintRed("A name change") +
          " is needed."
      );
    } else if (sideGood(nS, nG, I.late) && sideGood(bS, bG, I.late)) {
      parts.push(
        "At " +
          AGE.late +
          ", the name " +
          joinMarks(goodMarks(nS, nG, I.late).length ? goodMarks(nS, nG, I.late) : allMarks(nS, nG, I.late)) +
          " " +
          paintBlue("helps") +
          " the birth chart."
      );
    } else if (malBad.length) {
      parts.push(
        "At " +
          AGE.late +
          ", the name " +
          joinMarks(malBad) +
          " " +
          paintRed("causes pain") +
          " to the chart. Take this seriously."
      );
    }

    const bands = [
      { i: I.early, key: "early" },
      { i: I.prime, key: "prime" },
      { i: I.mid, key: "mid" },
    ];
    const bandBits = [];
    for (let bi = 0; bi < bands.length; bi++) {
      const idx = bands[bi].i;
      const key = bands[bi].key;
      const bad = badMarks(nS, nG, idx);
      if (bad.length && malHurt && malBad.length) {
        bandBits.push(
          AGE[key] +
            ": name " +
            joinMarks(bad) +
            " stacks with later-years " +
            joinMarks(malBad) +
            " → more " +
            paintRed("pain") +
            "."
        );
      } else if (bad.length) {
        bandBits.push(
          AGE[key] +
            ": name " +
            joinMarks(bad) +
            " " +
            paintRed("hurts") +
            " the chart here."
        );
      } else if (sideGood(nS, nG, idx)) {
        bandBits.push(
          AGE[key] + ": name " + paintBlue("helps") + " the chart here."
        );
      }
    }
    if (bandBits.length) parts.push(bandBits.join("<br>"));

    if (malHurt && malBad.length) {
      parts.push(
        "Bottom line: a workable birth chart is being harmed by " +
          paintRed("this name") +
          ". It is wiser not to keep it."
      );
    }

    parts.push(
      "For the full meaning of any number or hexagram, tap the underlined item in the table above."
    );

    return { ageText: parts.join("<br><br>") };
  };
})();
