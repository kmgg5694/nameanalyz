/**
 * Client-side English → Hangul pronunciation (no server).
 * window.enToHangul.word(str) / .convertName({last,first,middle})
 */
(function () {
  "use strict";

  /** Common given / family names → Korean reading */
  var DICT = {
    junior: "주니어",
    jr: "주니어",
    // family
    smith: "스미스",
    johnson: "존슨",
    williams: "윌리엄스",
    brown: "브라운",
    jones: "존스",
    garcia: "가르시아",
    miller: "밀러",
    davis: "데이비스",
    wilson: "윌슨",
    anderson: "앤더슨",
    thomas: "토머스",
    taylor: "테일러",
    moore: "무어",
    jackson: "잭슨",
    martin: "마틴",
    lee: "리",
    perez: "페레스",
    thompson: "톰슨",
    white: "화이트",
    harris: "해리스",
    sanchez: "산체스",
    clark: "클라크",
    ramirez: "라미레스",
    lewis: "루이스",
    robinson: "로빈슨",
    walker: "워커",
    young: "영",
    allen: "앨런",
    king: "킹",
    wright: "라이트",
    scott: "스콧",
    torres: "토레스",
    nguyen: "응우옌",
    hill: "힐",
    flores: "플로레스",
    green: "그린",
    adams: "애덤스",
    nelson: "넬슨",
    baker: "베이커",
    hall: "홀",
    rivera: "리베라",
    campbell: "캠벨",
    mitchell: "미첼",
    carter: "카터",
    roberts: "로버츠",
    kennedy: "케네디",
    fitzgerald: "피츠제럴드",
    kim: "킴",
    park: "박",
    choi: "최",
    jung: "정",
    chung: "정",
    han: "한",
    kang: "강",
    yoon: "윤",
    lim: "임",
    shin: "신",
    oh: "오",
    seo: "서",
    baek: "백",
    // given
    john: "존",
    james: "제임스",
    robert: "로버트",
    michael: "마이클",
    william: "윌리엄",
    david: "데이비드",
    richard: "리처드",
    joseph: "조지프",
    thomas: "토머스",
    charles: "찰스",
    christopher: "크리스토퍼",
    daniel: "대니얼",
    matthew: "매슈",
    anthony: "앤서니",
    mark: "마크",
    donald: "도널드",
    steven: "스티븐",
    paul: "폴",
    andrew: "앤드루",
    joshua: "조슈아",
    kenneth: "케네스",
    kevin: "케빈",
    brian: "브라이언",
    george: "조지",
    timothy: "티머시",
    ronald: "로널드",
    edward: "에드워드",
    jason: "제이슨",
    jeffrey: "제프리",
    ryan: "라이언",
    jacob: "제이컵",
    gary: "게리",
    nicholas: "니컬러스",
    eric: "에릭",
    jonathan: "조너선",
    stephen: "스티븐",
    larry: "래리",
    justin: "저스틴",
    scott: "스콧",
    brandon: "브랜던",
    benjamin: "벤저민",
    samuel: "새뮤얼",
    raymond: "레이먼드",
    gregory: "그레고리",
    frank: "프랭크",
    alexander: "알렉산더",
    patrick: "패트릭",
    jack: "잭",
    dennis: "데니스",
    jerry: "제리",
    tyler: "타일러",
    aaron: "에런",
    jose: "호세",
    henry: "헨리",
    adam: "애덤",
    douglas: "더글러스",
    nathan: "네이선",
    zachary: "재커리",
    kyle: "카일",
    noah: "노아",
    ethan: "이선",
    jeremy: "제러미",
    hunter: "헌터",
    christian: "크리스천",
    keith: "키스",
    roger: "로저",
    terry: "테리",
    austin: "오스틴",
    sean: "숀",
    gerald: "제럴드",
    carl: "칼",
    harold: "해럴드",
    dylan: "딜런",
    jesse: "제시",
    bryan: "브라이언",
    lawrence: "로런스",
    arthur: "아서",
    gabriel: "가브리엘",
    bruce: "브루스",
    logan: "로건",
    albert: "앨버트",
    willie: "윌리",
    alan: "앨런",
    ralph: "랠프",
    randy: "랜디",
    roy: "로이",
    eugene: "유진",
    louis: "루이스",
    philip: "필립",
    johnny: "조니",
    mary: "메리",
    patricia: "퍼트리샤",
    jennifer: "제니퍼",
    linda: "린다",
    elizabeth: "엘리자베스",
    barbara: "바버라",
    susan: "수전",
    jessica: "제시카",
    sarah: "세라",
    karen: "캐런",
    nancy: "낸시",
    lisa: "리사",
    betty: "베티",
    margaret: "마거릿",
    sandra: "샌드라",
    ashley: "애슐리",
    kimberly: "킴벌리",
    emily: "에밀리",
    donna: "도나",
    michelle: "미셸",
    dorothy: "도러시",
    carol: "캐럴",
    amanda: "어맨다",
    melissa: "멀리사",
    deborah: "데버라",
    stephanie: "스테퍼니",
    rebecca: "리베카",
    sharon: "섀런",
    laura: "로라",
    cynthia: "신시아",
    kathleen: "캐슬린",
    amy: "에이미",
    angela: "앤젤라",
    shirley: "셜리",
    anna: "애나",
    brenda: "브렌다",
    pamela: "패멀라",
    emma: "에마",
    nicole: "니콜",
    helen: "헬렌",
    samantha: "서맨사",
    katherine: "캐서린",
    christine: "크리스틴",
    debra: "데브라",
    rachel: "레이철",
    carolyn: "캐럴린",
    janet: "재닛",
    catherine: "캐서린",
    maria: "마리아",
    heather: "헤더",
    diane: "다이앤",
    ruth: "루스",
    julie: "줄리",
    olivia: "올리비아",
    joyce: "조이스",
    virginia: "버지니아",
    victoria: "빅토리아",
    kelly: "켈리",
    lauren: "로런",
    christina: "크리스티나",
    joan: "조앤",
    evelyn: "에벌린",
    judith: "주디스",
    megan: "메건",
    andrea: "안드레아",
    cheryl: "셰릴",
    hannah: "해나",
    jacqueline: "재클린",
    martha: "마사",
    gloria: "글로리아",
    teresa: "테레사",
    ann: "앤",
    sara: "세라",
    madison: "매디슨",
    frances: "프랜시스",
    kathryn: "캐스린",
    janice: "재니스",
    jean: "진",
    abigail: "애비게일",
    alice: "앨리스",
    judy: "주디",
    sophia: "소피아",
    grace: "그레이스",
    denise: "데니스",
    amber: "앰버",
    marilyn: "매릴린",
    beverly: "베벌리",
    danielle: "대니엘",
    theresa: "테레사",
    sophia: "소피아",
    marie: "마리",
    diana: "다이애나",
    brittany: "브리트니",
    natalie: "내털리",
    charlotte: "샬럿",
    marie: "마리",
    jane: "제인",
    kennedy: "케네디",
    // 외래어 표기법 용례 (presidents · well-known names)
    washington: "워싱턴",
    lincoln: "링컨",
    abraham: "에이브러햄",
    hamilton: "해밀턴",
    franklin: "프랭클린",
    roosevelt: "루스벨트",
    theodore: "시어도어",
    eisenhower: "아이젠하워",
    dwight: "드와이트",
    truman: "트루먼",
    harry: "해리",
    nixon: "닉슨",
    reagan: "레이건",
    obama: "오바마",
    barack: "버락",
    biden: "바이든",
    trump: "트럼프",
    clinton: "클린턴",
    hillary: "힐러리",
    rodham: "로덤",
    bush: "부시",
    jimmy: "지미",
    jefferson: "제퍼슨",
    monroe: "먼로",
    woodrow: "우드로",
    hoover: "후버",
    coolidge: "쿨리지",
    harding: "하딩",
    kamala: "카멀라",
    luther: "루서",
    morgan: "모건",
    evans: "에번스",
    phillips: "필립스",
    stewart: "스튜어트",
    cook: "쿡",
    peterson: "피터슨",
    bell: "벨",
    howard: "하워드",
    richardson: "리처드슨",
    watson: "왓슨",
    brooks: "브룩스",
    bennett: "베넷",
    hughes: "휴스",
    price: "프라이스",
    sanders: "샌더스",
    myers: "마이어스",
    cooper: "쿠퍼",
    ford: "포드",
    elon: "일론",
    musk: "머스크",
    steve: "스티브",
    jobs: "잡스",
    bill: "빌",
    gates: "게이츠",
    zuckerberg: "저커버그",
    buffett: "버핏",
    warren: "워런",
    oprah: "오프라",
    winfrey: "윈프리",
    jordan: "조던",
    elvis: "엘비스",
    presley: "프레슬리",
    max: "맥스",
    blake: "블레이크",
    chase: "체이스",
    knight: "나이트",
    cruise: "크루즈",
  };

  // letter / digraph → hangul jamo approximations (syllable building simplified)
  var CONS = {
    b: "ㅂ",
    c: "ㅋ",
    d: "ㄷ",
    f: "ㅍ",
    g: "ㄱ",
    h: "ㅎ",
    j: "ㅈ",
    k: "ㅋ",
    l: "ㄹ",
    m: "ㅁ",
    n: "ㄴ",
    p: "ㅍ",
    q: "ㅋ",
    r: "ㄹ",
    s: "ㅅ",
    t: "ㅌ",
    v: "ㅂ",
    w: "ㅇ",
    x: "ㅋㅅ",
    y: "ㅇ",
    z: "ㅈ",
  };
  var VOWEL = {
    a: "ㅏ",
    e: "ㅔ",
    i: "ㅣ",
    o: "ㅗ",
    u: "ㅜ",
    y: "ㅣ",
  };

  // Precomposed CV hangul helpers via Unicode formula
  var CHO = "ㄱㄲㄴㄷㄸㄹㅁㅂㅃㅅㅆㅇㅈㅉㅊㅋㅌㅍㅎ";
  var JUNG = "ㅏㅐㅑㅒㅓㅔㅕㅖㅗㅘㅙㅚㅛㅜㅝㅞㅟㅠㅡㅢㅣ";
  var JONG = " ㄱㄲㄳㄴㄵㄶㄷㄹㄺㄻㄼㄽㄾㄿㅀㅁㅂㅄㅅㅆㅇㅈㅊㅋㅌㅍㅎ";

  function syl(cho, jung, jong) {
    var ci = CHO.indexOf(cho);
    var ji = JUNG.indexOf(jung);
    var ti = jong ? JONG.indexOf(jong) : 0;
    if (ci < 0) ci = CHO.indexOf("ㅇ");
    if (ji < 0) ji = JUNG.indexOf("ㅡ");
    if (ti < 0) ti = 0;
    return String.fromCharCode(0xac00 + ci * 21 * 28 + ji * 28 + ti);
  }

  function ruleWord(raw) {
    var w = String(raw || "")
      .toLowerCase()
      .replace(/[^a-z]/g, "");
    if (!w) return "";
    // 외래어 표기법 approximations from spelling.
    // Markers: C=ch(ㅊ) S=sh(시) K=ck(ㄱ받침) N=ng(ㅇ받침) O=ㅓ U=ㅡ
    w = w
      .replace(/^mc/, "mEk")
      .replace(/c(?=[eiy])/g, "s")
      .replace(/g(?=[eiy])/g, "j")
      .replace(/ui/g, "u")
      .replace(/ore$/, "oO")
      .replace(/([aeiouy])es$/, "$1s")
      .replace(/(ie|ee|ea)r/g, "iO")
      .replace(/([bdfgklmnprstvz])\1/g, "$1");
    if (w.length > 3) {
      w = w.replace(/([aiou])([bdfjklmnprstvz])e$/, function (m, v, c) {
        return (v === "a" ? "ei" : v === "i" ? "aY" : v) + c;
      });
      if (/[^aeiouy]e$/.test(w)) w = w.slice(0, -1);
    }
    w = w
      .replace(/^wr/, "r")
      .replace(/^kn/, "n")
      .replace(/igh/g, "ai")
      .replace(/tion|sion/g, "SOn")
      .replace(/tch|ch/g, "C")
      .replace(/sh/g, "S")
      .replace(/ph/g, "f")
      .replace(/th/g, "s")
      .replace(/wh/g, "w")
      .replace(/gh/g, "")
      .replace(/ck/g, "K")
      .replace(/x/g, "Ks")
      .replace(/qu/g, "kw")
      .replace(/ng/g, "N")
      .replace(/n(?=k)/g, "N")
      .replace(/ee|ea|ie/g, "i")
      .replace(/oo/g, "u")
      .replace(/oa|au|aw|ow/g, "o")
      .replace(/ey$/, "i")
      .replace(/ai|ay/g, "ei")
      .replace(/ou/g, "u")
      .replace(/[eiu]r(?![aeiouy])/g, "O")
      .replace(/([ao])r(?![aeiouy])/g, "$1")
      .replace(/ll(?![aeiouy])/g, "l");
    if (w.length >= 5) w = w.replace(/son$/, "sUn").replace(/([^aeiouyO])[oa]n$/, "$1On");

    var V = { a: "ㅏ", e: "ㅔ", i: "ㅣ", o: "ㅗ", u: "ㅜ", y: "ㅣ", O: "ㅓ", U: "ㅡ", E: "ㅐ", Y: "ㅣ" };
    var WV = { a: "ㅝ", e: "ㅞ", i: "ㅟ", o: "ㅝ", u: "ㅜ", O: "ㅝ" };
    var YV = { a: "ㅑ", e: "ㅖ", i: "ㅣ", o: "ㅛ", u: "ㅠ", O: "ㅕ" };
    var SV = { a: "ㅑ", e: "ㅖ", i: "ㅣ", o: "ㅛ", u: "ㅠ", O: "ㅕ", y: "ㅣ" };
    var JONG_OF = { m: "ㅁ", n: "ㄴ", l: "ㄹ", N: "ㅇ", K: "ㄱ" };
    var isV = function (c) { return !!c && V.hasOwnProperty(c); };
    var syls = [];
    var push = function (cho, jung, fromV) { syls.push({ cho: cho, jung: jung, jong: "", open: fromV }); };
    var last = function () { return syls[syls.length - 1]; };
    // Short a/u in a closed syllable read [æ]/[ʌ] → ㅐ/ㅓ (Grant 그랜트, Duncan 던컨)
    var vv = function (k) {
      var v = w[k];
      var c1 = w[k + 1];
      var c2 = w[k + 2];
      var closed = !!c1 && !isV(c1) && c1 !== "w" && (!c2 || !isV(c2));
      if (closed && v === "a") return "ㅐ";
      if (closed && v === "u") return "ㅓ";
      return V[v];
    };
    var i = 0;
    while (i < w.length) {
      var ch = w[i];
      var nx = w[i + 1] || "";
      var n2 = w[i + 2] || "";
      if (isV(ch) && !(ch === "y" && isV(nx))) {
        push("ㅇ", vv(i), true);
        i++;
        continue;
      }
      if ((ch === "w" || ch === "y") && isV(nx)) {
        push("ㅇ", (ch === "w" ? WV : YV)[nx] || V[nx], true);
        i += 2;
        continue;
      }
      var prev = last();
      var canJong = prev && prev.open && !prev.jong;
      if (ch === "S") {
        if (isV(nx)) { push("ㅅ", SV[nx] || V[nx], true); i += 2; }
        else { push("ㅅ", nx ? "ㅠ" : "ㅣ", false); i++; }
        continue;
      }
      if (ch === "l" && isV(nx) && canJong) {
        prev.jong = "ㄹ";
        push("ㄹ", vv(i + 1), true);
        i += 2;
        continue;
      }
      if (ch === "N" && isV(nx) && canJong) {
        prev.jong = "ㅇ";
        push("ㄱ", vv(i + 1), true);
        i += 2;
        continue;
      }
      if (!isV(nx) && JONG_OF[ch] && canJong) {
        prev.jong = JONG_OF[ch];
        i++;
        continue;
      }
      var cho = ch === "C" ? "ㅊ" : ch === "K" ? "ㅋ" : ch === "N" ? "ㅇ" : mapCons(ch);
      if (isV(nx)) {
        push(cho, vv(i + 1), true);
        i += 2;
      } else if (nx === "w" && isV(n2) && /[kgh]/.test(ch)) {
        push(cho, WV[n2] || V[n2], true);
        i += 3;
      } else if (nx === "l" && isV(n2) && ch !== "l") {
        push(cho, "ㅡ", false);
        last().jong = "ㄹ";
        push("ㄹ", vv(i + 2), true);
        i += 3;
      } else {
        push(cho, ch === "C" ? "ㅣ" : "ㅡ", false);
        i++;
      }
    }
    var out = syls.map(function (x) { return syl(x.cho, x.jung, x.jong); }).join("");
    return out || raw;
  }

  function mapCons(ch) {
    var m = {
      b: "ㅂ",
      c: "ㅋ",
      d: "ㄷ",
      f: "ㅍ",
      g: "ㄱ",
      h: "ㅎ",
      j: "ㅈ",
      k: "ㅋ",
      l: "ㄹ",
      m: "ㅁ",
      n: "ㄴ",
      p: "ㅍ",
      q: "ㅋ",
      r: "ㄹ",
      s: "ㅅ",
      t: "ㅌ",
      v: "ㅂ",
      w: "ㅇ",
      x: "ㅅ",
      y: "ㅇ",
      z: "ㅈ",
    };
    return m[ch] || "ㅇ";
  }

  function word(s) {
    return String(wordRaw(s) || "").replace(/주니오르|쥬니어/g, "주니어");
  }

  function wordRaw(s) {
    var raw = String(s || "").trim();
    if (!raw) return "";
    var key = raw.toLowerCase().replace(/[^a-z]/g, "");
    if (DICT[key]) return DICT[key];
    // multi-part: Mary-Jane
    if (/[-'\s]/.test(raw)) {
      return raw
        .split(/[-'\s]+/)
        .filter(Boolean)
        .map(word)
        .join("");
    }
    return ruleWord(raw);
  }

  /** Jr./Junior typed in any field is counted at the end of the middle name (보흘 지정). */
  var JR_RE = /^(jr\.?|junior)$/i;
  function jrSplit(last, first, middle) {
    var found = false;
    var strip = function (v) {
      var parts = String(v || "").replace(/,/g, " ").trim().split(/\s+/).filter(Boolean);
      var keep = parts.filter(function (p) {
        if (JR_RE.test(p)) { found = true; return false; }
        return true;
      });
      return keep.join(" ");
    };
    var l = strip(last), f = strip(first), m = strip(middle);
    if (found) m = m ? m + " Jr." : "Jr.";
    window.__naHasJr = found;
    return [l || String(last || "").trim(), f || String(first || "").trim(), m];
  }

  function convertName(inp) {
    inp = inp || {};
    var a = jrSplit(inp.last, inp.first, inp.middle);
    return {
      last: word(a[0]),
      first: word(a[1]),
      middle: a[2] ? word(a[2]) : "",
    };
  }

  var CHO_STROKE = [1, 2, 1, 2, 4, 3, 3, 4, 8, 2, 4, 2, 3, 6, 4, 2, 3, 4, 4];
  var JUNG_STROKE = [2, 3, 3, 4, 2, 3, 3, 4, 2, 4, 5, 3, 3, 2, 4, 5, 3, 3, 1, 2, 1];
  var JONG_STROKE = [0, 1, 2, 3, 1, 4, 5, 2, 3, 4, 6, 7, 5, 6, 7, 7, 3, 4, 6, 2, 4, 2, 3, 4, 2, 3, 4, 4];

  var SEED_FIX = { "케네디": 16 };

  function tableStrokes(str) {
    var t = 0;
    String(str || "").split("").forEach(function (ch) {
      var a = ch.charCodeAt(0) - 44032;
      if (a < 0 || a > 11171) return;
      t += CHO_STROKE[Math.floor(a / 588)] + JUNG_STROKE[Math.floor(a / 28) % 21] + JONG_STROKE[a % 28];
    });
    return t;
  }

  function strokes(str) {
    str = String(str || "");
    var t = tableStrokes(str);
    Object.keys(SEED_FIX).forEach(function (k) {
      var n = str.split(k).length - 1;
      if (n > 0) t += n * (SEED_FIX[k] - tableStrokes(k));
    });
    return t;
  }

  window.enToHangul = { word: word, convertName: convertName, strokes: strokes, jrSplit: jrSplit, DICT: DICT };
  window.naJrSplit = jrSplit;
})();
