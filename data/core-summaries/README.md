# 핵심요약본 방 (core-summaries)

원본 **81수리·64주역괘** 해설은 `assets/index-kw5.js`에 그대로 둡니다.  
이 폴더는 **요약·결론 해설용 짧은 핵심문**만 따로 모아 둔 방입니다.

## 목적

소비자가 「뭐가 나쁘다는 건지」를 바로 이해하도록, 결론에서  
수리/괘 **이름 + 길·흉 + 한 줄 핵심**을 붙여 설명하기 위함입니다.

## 파일

| 파일 | 내용 |
|------|------|
| `suri-core.json` | 수리 1~81 핵심요약 배열 |
| `hex-core.json` | 괘 1~64 핵심요약 배열 |
| `suri-core-by-num.json` | 수리 번호 키 조회용 |
| `hex-core-by-id.json` | 괘 id 키 조회용 |
| `preview.html` | 브라우저에서 훑어보기 |
| `_extract_*.json` | 원본에서 뽑아 둔 작업용(수정 금지 참고) |

## 항목 필드

**수리**
- `num`, `name`, `tone`(길수/흉수/주의/평수), `type`, `core`

**괘**
- `id`, `name`, `tone`(길괘/흉괘/중성), `isTaboo`, `isBest`, `core`

## 규칙

1. **원본 `desc` / `shortDesc`는 절대 수정하지 않는다.**
2. UI에 바로 연결하기 전에, 보흘님이 `preview.html`로 문장을 검수한다.
3. 해설 코드에 붙일 때는 이 JSON의 `core`만 읽고, 원본 번들은 그대로 둔다.

## 다시 만들기

```bash
python _extract_suri_hex.py
python _build_core_summaries.py
```

(저장소 루트에서 실행)
