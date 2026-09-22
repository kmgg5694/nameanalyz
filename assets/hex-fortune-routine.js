/* 64괘·수리 기운 해당 판정 — 이름 한글/한문 나이대 매칭 (원본 d6/Ee 비침범)
 * 괘 매칭 + 81수리 기운 스펙(suri81-fortune-spec) 해당 번호도 함께 적용
 */
(function () {
  /** 기운 해당 판정 (보흘 지정 괘 + 81수리 스펙 연결) */
  const CATS = [
    {
      id: 1,
      title: "재물운",
      hex: [
        "화천대유",
        "화수미제",
        "수풍정",
        "산천대축",
        "이위화",
        "산화비",
        "뇌천대장",
      ],
      suri: [16, 24, 29, 47, 7, 13, 3, 33, 41, 58, 61, 65, 67, 1, 5, 6, 8, 18],
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
      note: "뇌천대장=고속승진·재물 / 산화비=관운·승진·재물·건강·화려한 업종",
    },
    { id: 4, title: "신분상승", hex: ["뇌택귀매", "지풍승"] },
    { id: 5, title: "천하태평", hex: ["천뢰무망", "지산겸"] },
    { id: 6, title: "결혼운", special: "ohang", ohangSide: "up" },
    { id: 7, title: "자녀운", special: "ohang", ohangSide: "down" },
    {
      id: 8,
      title: "공부운",
      suri: [13, 11, 35, 38, 23, 30, 44],
    },
    {
      id: 9,
      title: "출세운",
      suri: [3, 5, 13, 18, 23, 1, 7, 17, 24, 29, 37, 39, 71],
      suriAdverse: [60],
      hex: ["산화비"],
    },
    {
      id: 10,
      title: "자수성가운",
      suri: [31, 25, 7, 24, 67, 71],
    },
    {
      id: 11,
      title: "관재구설·소송",
      hex: ["천수송"],
      suri: [36, 20, 19, 27, 78],
      note: "수리 쪽은 시비·다툼 기운(소송 단정 금지)",
    },
    {
      id: 12,
      title: "신용불량·파산·부도",
      hex: ["천산둔", "천지비"],
      suri: [20, 4, 14, 34, 62, 64, 66, 54, 59],
    },
    {
      id: 13,
      title: "백혈병·소아암·혈액암·난치병",
      hex: ["천지비"],
      hexWithCompanion: {
        target: "수화기제",
        companions: ["천지비", "지화명이"],
      },
    },
    { id: 14, title: "약물중독·불의의 사고", hex: ["화택규"] },
    { id: 15, title: "맹장염·복막염", hex: ["택천쾌"] },
    {
      id: 16,
      title: "이혼·자살",
      hex: ["풍천소축"],
      suri: [2],
      suriNames: { 2: "분리파괴" },
    },
    { id: 17, title: "금전·주거 고민", hex: ["수뢰둔", "수산건"] },
    { id: 18, title: "수난·도난·병난", hex: ["감위수"] },
    { id: 19, title: "심복의 배반", hex: ["산지박"] },
    { id: 20, title: "산넘어 산", hex: ["간위산"] },
    {
      id: 21,
      title: "돈·재물·건강 상실 / 우울·건강상실",
      hex: ["산풍고", "지화명이"],
    },
    {
      id: 22,
      title: "싸움·시비·다툼",
      hex: ["지수사"],
      suri: [36, 20, 19, 27, 78],
    },
    {
      id: 23,
      title: "부동산운",
      suri: [35, 65],
      suriNames: { 35: "온유화순", 65: "달성격" },
    },
    {
      id: 24,
      title: "사망사고운",
      suri: [14, 19, 20, 26, 27, 28, 46, 70, 74, 79, 4, 9, 10, 22, 34, 64, 69],
    },
    {
      id: 25,
      title: "정상추락운",
      suri: [43, 49, 50, 51, 9],
      note: "보흘 지정 43·49·50·51 (9는 참고)",
    },
    {
      id: 26,
      title: "장애운",
      suri: [56, 42, 44],
      note: "보흘 지정 56 (42·44 참고)",
    },
    {
      id: 27,
      title: "건강운",
      hex: ["산화비"],
      note: "보흘 지정 — 산화비는 건강운에도 좋음",
    },
    {
      id: 28,
      title: "화려한 업종(패션·연예·방송 등)",
      hex: ["산화비"],
      note: "패션·디자인·연예·방송·모델·예술·유흥업 관련",
    },
    {
      id: 29,
      title: "언변·미식",
      hex: ["태위택", "화뢰서합"],
      note: "보흘 지정 — 같은 기운(태위택·화뢰서합)",
    },
  ];

  /** num → 해당 기운 제목들 (해설용) */
  const SURI_FORTUNE_TAGS = {};
  CATS.forEach(function (cat) {
    const nums = []
      .concat(cat.suri || [])
      .concat(cat.suriAdverse || []);
    nums.forEach(function (n) {
      const k = String(n);
      if (!SURI_FORTUNE_TAGS[k]) SURI_FORTUNE_TAGS[k] = [];
      if (SURI_FORTUNE_TAGS[k].indexOf(cat.title) < 0) {
        SURI_FORTUNE_TAGS[k].push(cat.title);
      }
    });
  });

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

      function addHit(who, age, extra) {
        const key = who + "|" + age + "|" + (extra || "");
        if (hitSet[key]) return;
        hitSet[key] = true;
        hits.push(
          who + " " + age + "에 있음" + (extra ? "(" + extra + ")" : "")
        );
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
      const suriList = [].concat(cat.suri || []).concat(cat.suriAdverse || []);

      ages.forEach(function (ag, ii) {
        const hg = gweName(ctx.nmHgG && ctx.nmHgG[ii]);
        const hj = gweName(ctx.nmHjG && ctx.nmHjG[ii]);

        hexList.forEach(function (hx) {
          if (femaleOnly.indexOf(hx) >= 0 && gender !== "female") return;
          if (hg === hx) addHit("한글이름", ag, "괘");
          if (hasHanja && hj === hx) addHit("한문이름", ag, "괘");
        });

        if (cat.hexWithCompanion) {
          const t = cat.hexWithCompanion.target;
          const comps = cat.hexWithCompanion.companions || [];
          const hasComp = comps.some(function (c) {
            return allNameHex[c];
          });
          if (hasComp) {
            if (hg === t) addHit("한글이름", ag, "괘");
            if (hasHanja && hj === t) addHit("한문이름", ag, "괘");
          }
        }

        if (suriList.length) {
          const hn = suriAt(ctx.nmHgSuri, ii);
          const jn = suriAt(ctx.nmHjSuri, ii);
          suriList.forEach(function (sn) {
            const label = sn + "수";
            if (hn === sn) addHit("한글이름", ag, label);
            if (hasHanja && jn === sn) addHit("한문이름", ag, label);
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
  window.__SURI_FORTUNE_TAGS__ = SURI_FORTUNE_TAGS;
  window.suriFortuneTags = function (num) {
    return SURI_FORTUNE_TAGS[String(num)] || [];
  };
  window.buildHexFortuneLines = buildLines;

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
                  fontSize: "0.9rem",
                  margin: 0,
                  lineHeight: 1.4,
                },
                children: row.title,
              }),
              m.jsx("p", {
                style: {
                  color: row.ok ? "#9a3412" : "#57534e",
                  fontSize: "0.88rem",
                  lineHeight: 1.5,
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
