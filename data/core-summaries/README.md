# 핵심요약본 방 (core-summaries)

원본 **81수리·64주역괘** 해설은 `assets/index-kw5.js`에 그대로 둡니다.  
이 폴더는 **요약·결론 해설용** 문을 모아 둔 방입니다.  
수리(`suri-core*`)는 간소 한 줄이 아니라, 보관 원본 `_extract_suri.json`의 **desc 전문**을 씁니다.  
(`assets/index-kw5.js`의 `d6` 원본은 수정하지 않음)

## 목적

소비자가 수리·주역을 **한쪽만 보지 않도록**, 나이대마다  
수리 원문 + 주역 + **수리가 주역에 미치는 영향**을 함께 해설합니다.

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
