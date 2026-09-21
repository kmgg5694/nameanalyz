# 핵심요약 · 소비자 구술

| 파일 | 용도 |
|------|------|
| `suri-core-by-num.json` / `hex-core-by-id.json` | 전문가용 핵심요약 (기존) |
| `suri-narrate-by-num.json` / `hex-narrate-by-id.json` | **소비자용 구술** — 이름풀이 서술에 사용 |
| `편집_소비자구술_수리81.md` / `편집_소비자구술_괘64.md` | **보흘님 편집용** — Cursor에서 본문만 수정 |
| `검수_소비자구술.html` | 브라우저 검수·수정 · JSON 저장 버튼 |
| `hex-special-notes-spec.json` | 괘 특례 (진위뢰·산화비 등) |
| `_build_narrate.py` | narrate 재생성 스크립트 |
| `_build_narrate_edit_md.py` / `_apply_narrate_edit_md.py` | 편집용 MD 생성 / MD→JSON 반영 |
| `_build_narrate_edit_html.py` | 검수 HTML 재생성 |

## 규칙

1. **런타임 특례**(16 말년, 진위뢰 등)가 있으면 특례만 구술하고 원본·narrate를 붙이지 않는다.
2. 특례가 없으면 **`narrate`** 만 쓴다 (전문가 `core` 전문 나열 금지).
3. 원본 `assets/index-kw5.js`의 `d6`/`Ee`는 수정하지 않는다.
4. narrate는 핵심이 빠지지 않게 2~3문장 안팎, 쉬운 말로 맞춘다.

편집: `편집_소비자구술_수리81.md` · `편집_소비자구술_괘64.md` 고친 뒤 「구술 반영」  
재생성: `python data/core-summaries/_build_narrate.py`
