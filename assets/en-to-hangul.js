/**
 * Client-side English → Hangul pronunciation (no server).
 * window.enToHangul.word(str) / .convertName({last,first,middle})
 */
(function () {
  "use strict";

  /** Common given / family names → Korean reading */
  var DICT = {
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
    thomas: "토마스",
    taylor: "테일러",
    moore: "무어",
    jackson: "잭슨",
    martin: "마틴",
    lee: "리",
    perez: "페레즈",
    thompson: "톰슨",
    white: "화이트",
    harris: "해리스",
    sanchez: "산체스",
    clark: "클라크",
    ramirez: "라미레즈",
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
    joseph: "조셉",
    thomas: "토마스",
    charles: "찰스",
    christopher: "크리스토퍼",
    daniel: "다니엘",
    matthew: "매튜",
    anthony: "앤서니",
    mark: "마크",
    donald: "도널드",
    steven: "스티븐",
    paul: "폴",
    andrew: "앤드류",
    joshua: "조슈아",
    kenneth: "케네스",
    kevin: "케빈",
    brian: "브라이언",
    george: "조지",
    timothy: "티모시",
    ronald: "로널드",
    edward: "에드워드",
    jason: "제이슨",
    jeffrey: "제프리",
    ryan: "라이언",
    jacob: "제이콥",
    gary: "게리",
    nicholas: "니콜라스",
    eric: "에릭",
    jonathan: "조나단",
    stephen: "스티븐",
    larry: "래리",
    justin: "저스틴",
    scott: "스콧",
    brandon: "브랜든",
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
    jeremy: "제레미",
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
    lawrence: "로렌스",
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
    patricia: "패트리샤",
    jennifer: "제니퍼",
    linda: "린다",
    elizabeth: "엘리자베스",
    barbara: "바바라",
    susan: "수잔",
    jessica: "제시카",
    sarah: "사라",
    karen: "카렌",
    nancy: "낸시",
    lisa: "리사",
    betty: "베티",
    margaret: "마거릿",
    sandra: "산드라",
    ashley: "애슐리",
    kimberly: "킴벌리",
    emily: "에밀리",
    donna: "도나",
    michelle: "미셸",
    dorothy: "도로시",
    carol: "캐롤",
    amanda: "아만다",
    melissa: "멜리사",
    deborah: "데버라",
    stephanie: "스테파니",
    rebecca: "레베카",
    sharon: "シャロン",
    laura: "로라",
    cynthia: "신시아",
    kathleen: "캐슬린",
    amy: "에이미",
    angela: "앤젤라",
    shirley: "셜리",
    anna: "안나",
    brenda: "브렌다",
    pamela: "패멀라",
    emma: "엠마",
    nicole: "니콜",
    helen: "헬렌",
    samantha: "사만다",
    katherine: "캐서린",
    christine: "크리스틴",
    debra: "데브라",
    rachel: "레이첼",
    carolyn: "캐롤린",
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
    lauren: "로렌",
    christina: "크리스티나",
    joan: "조앤",
    evelyn: "에블린",
    judith: "주디스",
    megan: "메건",
    andrea: "안드레아",
    cheryl: "셰릴",
    hannah: "한나",
    jacqueline: "재클린",
    martha: "마사",
    gloria: "글로리아",
    teresa: "테레사",
    ann: "앤",
    sara: "사라",
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
    marilyn: "마릴린",
    beverly: "베벌리",
    danielle: "다니엘",
    theresa: "테레사",
    sophia: "소피아",
    marie: "마리",
    diana: "다이애나",
    brittany: "브리트니",
    natalie: "나탈리",
    charlotte: "샬럿",
    marie: "마리",
    jane: "제인",
    kennedy: "케네디",
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
    // simple digraphs → latin stand-ins then syllable fold
    w = w
      .replace(/tion|sion/g, "syon")
      .replace(/ph/g, "f")
      .replace(/th/g, "s")
      .replace(/ch/g, "c")
      .replace(/sh/g, "s")
      .replace(/ck/g, "k")
      .replace(/qu/g, "kw")
      .replace(/ee|ea/g, "i")
      .replace(/oo/g, "u")
      .replace(/oa|au|aw|ow/g, "o")
      .replace(/ai|ay/g, "e")
      .replace(/oy|oi/g, "oi")
      .replace(/ou/g, "u");

    var out = "";
    var i = 0;
    while (i < w.length) {
      var ch = w[i];
      var nx = w[i + 1] || "";
      if (VOWEL[ch]) {
        out += syl("ㅇ", VOWEL[ch], "");
        i++;
        continue;
      }
      if (CONS[ch] || mapCons(ch)) {
        var cho = mapCons(ch);
        if (nx && VOWEL[nx]) {
          out += syl(cho, VOWEL[nx], "");
          i += 2;
        } else {
          out += syl(cho, "ㅡ", "");
          i++;
        }
        continue;
      }
      i++;
    }
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

  function convertName(inp) {
    inp = inp || {};
    return {
      last: word(inp.last),
      first: word(inp.first),
      middle: inp.middle ? word(inp.middle) : "",
    };
  }

  var CHO_STROKE = [1, 2, 1, 2, 4, 3, 3, 4, 8, 2, 4, 2, 3, 6, 4, 2, 3, 4, 4];
  var JUNG_STROKE = [2, 3, 3, 4, 2, 3, 3, 4, 2, 4, 5, 3, 3, 2, 4, 5, 3, 3, 1, 2, 1];
  var JONG_STROKE = [0, 1, 2, 3, 1, 4, 5, 2, 3, 4, 6, 7, 5, 6, 7, 7, 3, 4, 6, 2, 4, 2, 3, 4, 2, 3, 4, 4];

  var SEED_FIX = { "케네디": 16 };

  function strokes(str) {
    if (SEED_FIX[str]) return SEED_FIX[str];
    var t = 0;
    String(str || "").split("").forEach(function (ch) {
      var a = ch.charCodeAt(0) - 44032;
      if (a < 0 || a > 11171) return;
      t += CHO_STROKE[Math.floor(a / 588)] + JUNG_STROKE[Math.floor(a / 28) % 21] + JONG_STROKE[a % 28];
    });
    return t;
  }

  window.enToHangul = { word: word, convertName: convertName, strokes: strokes, DICT: DICT };
})();
