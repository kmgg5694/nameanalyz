/**
 * English name reading — narrative commentary
 * Order: (1) finish name reading by period → (2) birth date + period-by-period compare
 * Does not modify original suri/hex dictionary text in the English bundle.
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

  function suriName(ns, en) {
    if (!ns || !ns.data) return "";
    if (en && ns.data.nameEn) return strip(ns.data.nameEn);
    return strip(ns.data.name || "");
  }

  function suriBody(ns, en) {
    if (!ns || !ns.data) return "";
    if (en) {
      return ns.data.descEn || ns.data.shortDescEn || ns.data.desc || ns.data.shortDesc || "";
    }
    return ns.data.desc || ns.data.shortDesc || "";
  }

  function gweName(g, en) {
    if (!g || !g.name) return "";
    if (en && g.nameEn) return strip(g.nameEn);
    return strip(g.name);
  }

  function gweBody(g, en) {
    if (!g) return "";
    if (en) return g.descEn || g.desc || "";
    return g.desc || "";
  }

  function suriPhraseHtml(ns, en) {
    if (!ns || ns.suri == null || !ns.data) return "";
    const num = ns.suri;
    const nm = suriName(ns, en);
    const bad = suriBad(ns.data);
    const good = suriGood(ns.data);
    const label = nm ? num + ", " + nm : String(num);
    if (bad) return paintRed(label);
    if (good) return paintBlue(label);
    return "<strong>" + esc(label) + "</strong>";
  }

  function gwePhraseHtml(g, en) {
    if (!g || !g.name) return "";
    const nm = gweName(g, en);
    if (gweBad(g)) return paintRed(nm);
    if (gweGood(g)) return paintBlue(nm);
    return "<strong>" + esc(nm) + "</strong>";
  }

  const PERIODS_EN = [
    { key: "early", speak: "early years (about ages 1–23, ±3 years)" },
    { key: "prime", speak: "prime years (about ages 24–40, ±3 years)" },
    { key: "mid", speak: "middle years (about ages 41–55, ±3 years)" },
    { key: "late", speak: "later years / overall destiny (from about age 56, ±3 years)" },
  ];
  const PERIODS_KO = [
    { key: "early", speak: "초년(1~23세, ±3년)" },
    { key: "prime", speak: "장년(24~40세, ±3년)" },
    { key: "mid", speak: "중년(41~55세, ±3년)" },
    { key: "late", speak: "말년·총운(56세 이후, ±3년)" },
  ];

  function periodCopy(en) {
    return {
      nameIntro: en
        ? "We begin with the name reading itself—period by period—before bringing in the birth date."
        : "탄생일과 견주기 전에, 먼저 이름만으로 시기별 풀이를 마칩니다.",
      nameBridge: en
        ? "With the name reading complete, we now set it beside the birth date and compare period by period, as in conversation."
        : "이름풀이를 마쳤으니, 이제 탄생일과 시기별로 견주어 이야기합니다.",
      birthIntro: en
        ? "Next we walk the birth-date (life-stage) reading, matching it to the same age band in the name. Only later-years destiny reaches the whole life; early, prime, and middle years act mainly in their own band (±3 years)."
        : "이어서 탄생일(사주)을 시기별로 보며, 같은 시기 이름 기운과 맞춰 봅니다. 말년(총운)만 인생 전체에 미치고, 초·장·중년은 해당 나이대(±3년)에만 영향을 줍니다.",
      noBirth: en
        ? "No birth date was entered, so this reading stays with the name alone."
        : "생년월일이 없어 이름만으로 풀이했습니다.",
      compareBadNameGoodBirth: en
        ? "In this same period the name is heavy while the birth date opens—watch whether the name presses on the birth-date strength."
        : "같은 시기에 이름은 무거운데 탄생일은 열려 있어, 이름이 사주의 힘을 누르는지 살펴야 합니다.",
      compareGoodNameBadBirth: en
        ? "In this same period the birth date is heavy while the name is bright—the name can ease the birth-date burden."
        : "같은 시기에 탄생일은 무거운데 이름이 밝아, 이름이 사주의 부담을 덜어 주는 쪽으로 읽힙니다.",
      compareBothBad: en
        ? "In this same period both name and birth date are heavy—trials can stack in this age band (±3 years)."
        : "같은 시기에 이름과 탄생일이 모두 무거워, 이 나이대(±3년) 시련이 겹치기 쉽습니다.",
      compareBothGood: en
        ? "In this same period name and birth date open together—the flow reads stronger."
        : "같은 시기에 이름과 탄생일이 함께 열려, 이 시기 흐름이 한결 힘차게 읽힙니다.",
      overallNameBetter: en
        ? "Overall, the name carries more supportive energy than the birth date—the name tends to help the chart."
        : "전체적으로 이름이 탄생일보다 돕는 기운이 많아, 이름이 사주를 살리는 쪽으로 읽힙니다.",
      overallBirthBetter: en
        ? "Overall, the birth date looks stronger than the name—check where the name fails to keep up with the chart."
        : "전체적으로 탄생일이 이름보다 강해, 사주의 힘을 이름이 따라가지 못하는 대목이 없는지 살펴야 합니다.",
      overallNameHeavier: en
        ? "Overall, the name’s caution signs outweigh the birth date’s—the name may hinder more than it helps."
        : "전체적으로 이름의 무거운 기운이 탄생일보다 많아, 이름이 사주를 방해하는 대목이 없는지 살펴야 합니다.",
      overallEven: en
        ? "Overall, name and birth date weigh similarly—compare them period by period rather than judging from one side alone."
        : "전체적으로 이름과 탄생일의 무게가 비슷하니, 어느 한쪽만 보지 말고 시기별로 함께 보아야 합니다.",
      lateNote: en
        ? "Remember: only later-years destiny can color the whole life; early, prime, and middle years mainly act in their own band (±3 years)."
        : "말년(총운)만 인생 전체에 영향을 주고, 초·장·중년은 자기 나이대(±3년)에만 영향을 줍니다.",
      enters: en ? "appears." : "들어 있습니다.",
    };
  }

  function narrateSlot(kind, speak, ns, ng, en, copy) {
    const bits = [];
    const suriLead =
      kind === "birth"
        ? en
          ? "On the birth date, for"
          : "탄생일"
        : en
          ? "In the name, for"
          : "이름";
    const hexLead =
      kind === "birth"
        ? en
          ? "The birth-date hexagram for"
          : "탄생일의 주역은"
        : en
          ? "The name hexagram for"
          : "이름의 주역은";
    if (ns && ns.data) {
      bits.push(
        suriLead +
          " " +
          speak +
          ", " +
          suriPhraseHtml(ns, en) +
          " " +
          copy.enters +
          (suriBody(ns, en) ? " " + esc(suriBody(ns, en)) : "")
      );
    }
    if (ng && ng.name) {
      bits.push(
        hexLead +
          " " +
          speak +
          ", " +
          gwePhraseHtml(ng, en) +
          " " +
          copy.enters +
          (gweBody(ng, en) ? " " + esc(gweBody(ng, en)) : "")
      );
    }
    return bits.join(" ");
  }

  /**
   * ctx: { nS, nG, bS, bG, hasB, lang: "en"|"ko" }
   * arrays ordered: [early, prime, mid, late]
   */
  window.enSumRoutine = function enSumRoutine(ctx) {
    ctx = ctx || {};
    const en = ctx.lang !== "ko";
    const copy = periodCopy(en);
    const periods = en ? PERIODS_EN : PERIODS_KO;
    const nS = ctx.nS || [];
    const nG = ctx.nG || [];
    const bS = ctx.bS || [];
    const bG = ctx.bG || [];
    const hasB = !!ctx.hasB;

    const parts = [];
    parts.push(copy.nameIntro);

    // 1) Name reading complete first (early → late)
    for (let i = 0; i < 4; i++) {
      const speak = periods[i].speak;
      const t = narrateSlot("name", speak, nS[i], nG[i], en, copy);
      if (t) parts.push(t);
    }
    parts.push(copy.lateNote);

    // 2) Birth date + period compare
    if (!hasB) {
      parts.push(copy.noBirth);
      return { ageText: parts.join("<br><br>") };
    }

    parts.push(copy.nameBridge);

    let nameGood = 0,
      nameBad = 0,
      birthGood = 0,
      birthBad = 0;
    for (let i = 0; i < 4; i++) {
      if (nS[i] && suriGood(nS[i].data)) nameGood++;
      if (nS[i] && suriBad(nS[i].data)) nameBad++;
      if (nG[i] && gweGood(nG[i])) nameGood++;
      if (nG[i] && gweBad(nG[i])) nameBad++;
      if (bS[i] && suriGood(bS[i].data)) birthGood++;
      if (bS[i] && suriBad(bS[i].data)) birthBad++;
      if (bG[i] && gweGood(bG[i])) birthGood++;
      if (bG[i] && gweBad(bG[i])) birthBad++;
    }

    if (nameGood > birthGood && nameBad <= birthBad) parts.push(copy.overallNameBetter);
    else if (birthGood > nameGood && birthBad <= nameBad) parts.push(copy.overallBirthBetter);
    else if (nameBad > birthBad) parts.push(copy.overallNameHeavier);
    else parts.push(copy.overallEven);

    parts.push(copy.birthIntro);

    for (let i = 0; i < 4; i++) {
      const speak = periods[i].speak;
      const bits = [];
      const bt = narrateSlot("birth", speak, bS[i], bG[i], en, copy);
      if (bt) bits.push(bt);

      const nBadP =
        !!(nS[i] && suriBad(nS[i].data)) || !!(nG[i] && gweBad(nG[i]));
      const nGoodP =
        !!(nS[i] && suriGood(nS[i].data)) || !!(nG[i] && gweGood(nG[i]));
      const bBadP =
        !!(bS[i] && suriBad(bS[i].data)) || !!(bG[i] && gweBad(bG[i]));
      const bGoodP =
        !!(bS[i] && suriGood(bS[i].data)) || !!(bG[i] && gweGood(bG[i]));

      if (nBadP && bGoodP) bits.push(copy.compareBadNameGoodBirth);
      else if (nGoodP && bBadP) bits.push(copy.compareGoodNameBadBirth);
      else if (nBadP && bBadP) bits.push(copy.compareBothBad);
      else if (nGoodP && bGoodP) bits.push(copy.compareBothGood);

      if (bits.length) parts.push(bits.join(" "));
    }

    return { ageText: parts.join("<br><br>") };
  };
})();
