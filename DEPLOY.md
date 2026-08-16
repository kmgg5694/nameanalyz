# GitHub 배포 방법 (보흘님)

로컬 준비는 완료되었습니다. **GitHub 로그인 후 push만** 하시면 됩니다.

## 배포 주소 (예정)

- 한글·한문: https://kmgg5694.github.io/nameanalyz/
- 영어: https://kmgg5694.github.io/nameanalyz/english/

## 1단계: GitHub 로그인 (터미널)

```powershell
gh auth login
```

- GitHub.com 선택
- HTTPS 선택
- 브라우저로 로그인 (kmgg5694 계정)

## 2단계: 저장소 만들고 push

```powershell
cd C:\Users\a8071\Projects\nameanalyz
gh repo create kmgg5694/nameanalyz --public --source=. --remote=origin --push --description "Kim Mangi Name Lab"
```

(이미 저장소가 있으면: `git push -u origin main`)

## 3단계: GitHub Pages 켜기

GitHub 웹 → `kmgg5694/nameanalyz` → **Settings** → **Pages**

- Source: **Deploy from a branch**
- Branch: **main** / **/ (root)**
- Save

1~2분 후 위 주소로 접속 확인.

## 로컬 프로젝트 위치

`C:\Users\a8071\Projects\nameanalyz`

바탕화면 바로가기(`영어이름풀이`, `한글이름풀이`)는 새 GitHub 주소로 이미 바꿔 두었습니다.
