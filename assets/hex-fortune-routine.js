/* 64괘·수리 기운 해당 판정 — 이름 한글/한문 나이대 매칭 (원본 d6/Ee 비침범) */
(function () {
  /** 기운 해당 판정 스펙 (보흘 지정) — 표기 예시는 참고용, 항목별 문구는 해당 판정에 맞춤 */
  const CATS = [
    {
      id: 1,
      title: "재물운",
      hex: ["화천대유", "화수미제", "수풍정", "산천대축", "이위화"],
    },
    {
      id: 2,
      title: "사업운",
      hex: ["천화동인", "풍화가인", "천풍구"],
      femaleOnlyHex: ["천풍구"],
    },
    {
      id: 3,
      title: "승진·고속승진",
      hex: ["택풍대과", "화풍정", "산화비", "뇌천대장"],
      note: "뇌천대장=고속승진·재물",
    },
    { id: 4, title: "신분상승", hex: ["뇌택귀매", "지풍승"] },
    { id: 5, title: "천하태평", hex: ["천뢰무망", "지산겸"] },
    { id: 6, title: "결혼운", special: "ohang", ohangSide: "up" },
    { id: 7, title: "자녀운", special: "ohang", ohangSide: "down" },
    { id: 8, title: "관재구설·소송", hex: ["천수송"] },
    { id: 9, title: "신용불량·파산", hex: ["천산둔", "천지비"] },
    {
      id: 10,
      title: "백혈병·소아암·혈액암·난치병",
      hex: ["천지비"],
      hexWithCompanion: {
        target: "수화기제",
        companions: ["천지비", "지화명이"],
      },
    },
    { id: 11, title: "약물중독·불의의 사고", hex: ["화택규"] },
    { id: 12, title: "맹장염·복막염", hex: ["택천쾌"] },
    {
      id: 13,
      title: "이혼·자살",
      hex: ["풍천소축"],
      suri: [2],
      suriNames: { 2: "분리파괴" },
    },
    { id: 14, title: "금전·주거 고민", hex: ["수뢰둔", "수산건"] },
    { id: 15, title: "수난·도난·병난", hex: ["감위수"] },
    { id: 16, title: "심복의 배반", hex: ["산지박"] },
    { id: 17, title: "산넘어 산", hex: ["간위산"] },
    {
      id: 18,
      title: "돈·재물·건강 상실 / 우울·건강상실",
      hex: ["산풍고", "지화명이"],
    },
    { id: 19, title: "싸움·시비·다툼", hex: ["지수사"] },
    { id: 20, title: "부동산운", suri: [35], suriNames: { 35: "온유화순" } },
  ];

  function stripName(n) {
    return String(n || "")
      .replace(/\([^)]*\)/g, "")
      .replace(/\s+/g, "")
      .trim();
  }

  function gweName(g) {
    return g && g.name ? stripName(g.name) : "";
  }

  function suriAt(arr, ii) {
    const v = arr && arr[ii];
    if (v == null) return 0;
    if (typeof v === "number") return v;
    if (typeof v.suri === "number") return v.suri;
    if (v.data && typeof v.data.num === "number") return v.data.num;
    return 0;
  }

  /**
   * @param {object} ctx
   * ages, nmHgG, nmHjG, nmHgSuri, nmHjSuri, gender, hasHanja, ohang
   */
  function buildLines(ctx) {
    const ages = ctx.ages || ["말년", "초년", "장년", "중년"];
    const gender = ctx.gender || "male";
    const hasHanja = !!ctx.hasHanja;
    const lines = [];

    const allNameHex = {};
    ages.forEach(function (_ag, ii) {
      const hn = gweName(ctx.nmHgG && ctx.nmHgG[ii]);
      const jn = gweName(ctx.nmHjG && ctx.nmHjG[ii]);
      if (hn) allNameHex[hn] = true;
      if (jn) allNameHex[jn] = true;
    });

    CATS.forEach(function (cat) {
      const hits = [];
      const hitSet = {};

      function addHit(who, age) {
        const key = who + "|" + age;
        if (hitSet[key]) return;
        hitSet[key] = true;
        hits.push(who + " " + age + "에 있음");
      }

      if (cat.special === "ohang") {
        const o = ctx.ohang || {};
        const side = cat.ohangSide || "up";
        let tip = "해당없음";
        let ok = false;
        if (side === "down") {
          if (o.dnHg === "sanggeuk" || o.dnHj === "sanggeuk") {
            tip = "아래쪽 오행 극 — 자녀·후배·동료운 막힘 가능 (오행으로 판정)";
            ok = true;
          } else if (o.dnHg === "sangsaeng" || o.dnHj === "sangsaeng") {
            tip = "아래쪽 오행 생 — 자녀·후배·동료운 원활 쪽 (오행으로 판정)";
            ok = true;
          }
        } else {
          if (o.upHg === "sanggeuk" || o.upHj === "sanggeuk") {
            tip = "위쪽 오행 극 — 배우자·선배운 막힘 가능 (오행으로 판정)";
            ok = true;
          } else if (o.upHg === "sangsaeng" || o.upHj === "sangsaeng") {
            tip = "위쪽 오행 생 — 배우자·선배운 원활 쪽 (오행으로 판정)";
            ok = true;
          }
        }
        lines.push({
          id: cat.id,
          title: cat.id + ". " + cat.title,
          body: tip,
          ok: ok,
        });
        return;
      }

      const hexList = cat.hex || [];
      const femaleOnly = cat.femaleOnlyHex || [];

      ages.forEach(function (ag, ii) {
        const hg = gweName(ctx.nmHgG && ctx.nmHgG[ii]);
        const hj = gweName(ctx.nmHjG && ctx.nmHjG[ii]);

        hexList.forEach(function (hx) {
          if (femaleOnly.indexOf(hx) >= 0 && gender !== "female") return;
          if (hg === hx) addHit("한글이름", ag);
          if (hasHanja && hj === hx) addHit("한문이름", ag);
        });

        if (cat.hexWithCompanion) {
          const t = cat.hexWithCompanion.target;
          const comps = cat.hexWithCompanion.companions || [];
          const hasComp = comps.some(function (c) {
            return allNameHex[c];
          });
          if (hasComp) {
            if (hg === t) addHit("한글이름", ag);
            if (hasHanja && hj === t) addHit("한문이름", ag);
          }
        }

        if (cat.suri && cat.suri.length) {
          const hn = suriAt(ctx.nmHgSuri, ii);
          const jn = suriAt(ctx.nmHjSuri, ii);
          cat.suri.forEach(function (sn) {
            if (hn === sn) addHit("한글이름", ag);
            if (hasHanja && jn === sn) addHit("한문이름", ag);
          });
        }
      });

      lines.push({
        id: cat.id,
        title: cat.id + ". " + cat.title,
        body: hits.length ? hits.join(" · ") : "해당없음",
        ok: hits.length > 0,
      });
    });

    return lines;
  }

  window.__HEX_FORTUNE_SPEC__ = CATS;
  window.buildHexFortuneLines = buildLines;

  /** React jsx runtime `m` + rows → orange box */
  window.renderHexFortuneBox = function (m, rows) {
    const list = Array.isArray(rows) ? rows : [];
    const kids = [
      m.jsx("p", {
        style: {
          color: "#78350f",
          fontWeight: 700,
          fontSize: "0.95rem",
          marginBottom: "8px",
        },
        children: "기운 해당 판정",
      }),
    ];
    list.forEach(function (row, ii) {
      kids.push(
        m.jsxs(
          "div",
          {
            className: "mt-1.5",
            style: {
              borderBottom:
                ii < list.length - 1 ? "1px solid #fed7aa" : "none",
              paddingBottom: "6px",
            },
            children: [
              m.jsx("p", {
                style: {
                  color: "#78350f",
                  fontWeight: 700,
                  fontSize: "0.88rem",
                  margin: 0,
                },
                children: row.title,
              }),
              m.jsx("p", {
                style: {
                  color: row.ok ? "#9a3412" : "#57534e",
                  fontSize: "0.88rem",
                  lineHeight: 1.55,
                  margin: "2px 0 0",
                },
                children: row.body,
              }),
            ],
          },
          row.id || ii
        )
      );
    });
    return m.jsxs("div", {
      className: "mt-2 p-3 rounded-lg",
      style: { background: "#fff7ed", border: "1px solid #d97706" },
      children: kids,
    });
  };
})();
