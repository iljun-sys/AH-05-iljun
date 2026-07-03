# Git, GitHub

[Git_GitHub.pptx](Git,%20GitHub/Git_GitHub.pptx)

[Git_GitHub.pdf](Git,%20GitHub/Git_GitHub.pdf)

<aside>
<img src="notion://custom_emoji/00feaf78-d356-41ee-90f9-616e7f73fd77/38bcaf56-50aa-80a3-905e-007ac698e806" alt="notion://custom_emoji/00feaf78-d356-41ee-90f9-616e7f73fd77/38bcaf56-50aa-80a3-905e-007ac698e806" width="40px" /> 강의자료 「Git & GitHub」를 마크다운으로 정리한 학습 노트. **과정 목표**: Git과 GitHub를 활용해 코드를 안전하게 관리하고 협업할 수 있는 기본 역량을 갖춘다.

</aside>

## 📑 목차

1. 버전 관리의 필요성
2. Git 기본 개념
3. Git 설치와 초기 설정
4. 로컬에서 Git 사용하기
5. 브랜치 이해하기
6. GitHub 기초
7. 협업 실습
8. 자주 사용하는 명령어

---

# 1. 버전 관리의 필요성

## 버전 관리(Version Control)란?

파일이나 코드의 **변경 이력을 체계적으로 기록하고 관리**하는 것. 언제·누가·무엇을 바꿨는지 알 수 있고, 필요하면 과거 상태로 되돌릴 수 있다.

**왜 필요한가**: 변경 이력을 추적하고, 실수를 복구하며, 여러 사람이 충돌 없이 협업하기 위해서.

**활용 예시**:

- 기능을 추가했다가 버그가 생겼을 때 이전 정상 동작 버전으로 바로 되돌릴 수 있다
- 팀원이 동시에 같은 파일을 수정해도 누가 무엇을 바꿨는지 확인하고 충돌을 해결할 수 있다
- "최종_진짜최종_v3" 같은 파일을 만들지 않고도 변경 과정을 깔끔하게 관리할 수 있다

## Git vs. 파일 복사

| 파일 복사 방식 | Git 사용 |
| --- | --- |
| [final.py](http://final.py), final_[v2.py](http://v2.py), [진짜최종.py](http://진짜최종.py)처럼 파일이 늘어남 | 변경 내용이 커밋 단위로 기록됨 |
| 변경 이유와 내용이 남지 않음 | 언제든 특정 시점으로 되돌릴 수 있음 |
| 협업 시 어떤 파일이 최신인지 알기 어려움 | 여러 사람이 동시에 작업 가능 |
|  | 변경 이력과 책임이 명확함 |

## Git vs. GitHub

<aside>
⚙️

**Git은 버전 관리 엔진, GitHub는 협업과 공유를 위한 서비스.**

</aside>

- **Git** — 버전 관리를 위한 도구(프로그램). **내 컴퓨터에서 동작**.
- **GitHub** — Git 저장소를 올려두는 웹 서비스. 코드 공유 및 협업 플랫폼. Pull Request, Issue, Review 기능 제공.

---

# 2. Git 기본 개념

## Repository (레포지토리)

파일과 그 변경 이력을 함께 관리하는 **저장소**. 프로젝트 전체와 모든 버전 기록이 들어 있다.

- **로컬 저장소** — 내 컴퓨터에 있는 저장소. 프로젝트 폴더로 이동 → `git init` 실행하면 해당 폴더가 Git 레포지토리가 됨
- **원격 저장소** — GitHub 같은 서버에 있는 저장소. GitHub에서 새 Repository 생성 → `git clone`으로 내 컴퓨터에 복사

## Commit (커밋)

변경 사항을 하나의 기록으로 저장하는 단위(= 하나의 버전). "무엇을 왜 바꿨는지"를 메시지로 남긴다.

- 특정 시점의 프로젝트 상태를 저장
- 되돌아갈 수 있는 **기준점** 역할
- 커밋 생성: `git commit -m "회원가입 기능 추가"`

## Branch (브랜치)

독립적으로 작업할 수 있는 **작업 공간**. 기존 코드를 건드리지 않고 기능 개발이 가능하다.

- 여러 기능을 동시에 개발할 수 있음
- 작업이 끝나면 병합(merge)함
- 브랜치 생성: `git branch feature/login`
- 브랜치 전환: `git switch feature/login`

## HEAD (헤드)

현재 내가 작업 중인 위치를 가리키는 **포인터**. 보통 현재 브랜치의 최신 커밋을 가리킨다. HEAD가 움직인다는 것은 작업 기준이 바뀐다는 의미. (version 1 → 2 → 3으로 이동)

## Working Directory

실제로 파일을 수정하고 작업하는 공간. 아직 Git에 기록되지 않은 변경 사항이 있는 상태.

![image.png](Git,%20GitHub/image.png)

## Staging Area

다음 커밋에 포함할 변경 사항을 **미리 모아두는 공간**.

<aside>
<img src="https://app.notion.com/icons/git_red.svg" alt="https://app.notion.com/icons/git_red.svg" width="40px" />

**Git의 3단계 흐름**: Working Directory (수정) → `git add` → Staging Area (선별) → `git commit` → Repository (기록)

</aside>

---

# 3. Git 설치와 초기 설정

## Git 설치

- **macOS**: `brew install git`
- **Windows**: Git for Windows 설치 (Git for Windows/x64 Setup)
- **설치 확인**: `git --version`

## GitHub 회원가입

[https://github.com/](https://github.com/) 접속해서 회원가입. name, email 기록.

## git config

Git의 기본 동작을 설정하는 명령어.

**전역 설정** (모든 저장소에 적용):

```bash
git config --global user.name "홍길동"
git config --global user.email "hong@example.com"
```

**로컬 설정** (특정 저장소에만 적용) — 프로젝트마다 다른 계정이나 역할을 써야 할 때 사용 (회사 프로젝트와 개인 프로젝트 구분):

```bash
git config user.name "홍길동"
git config user.email "hong@example.com"
```

---

# 4. 로컬에서 Git 사용하기

## git init

현재 폴더를 Git 레포지토리로 초기화. `.git` 폴더가 생성되고, 현재 폴더를 기준으로 버전 관리를 시작한다.

```bash
git init
```

### 절대 init하면 안 되는 곳

- **홈 디렉토리(`~`)** — 개인 파일·설정 전체가 묶임 (며칠 전 그 사고)
- **여러 프로젝트를 담는 상위 폴더** (`git/`, `project/` 같은) — 하위가 다 묶임
- **이미 `.git`이 있는 폴더** — 중첩 저장소로 꼬임
- **`/` 나 `/Volumes` 같은 시스템·최상위 경로** — 말할 것도 없이 위험

## git status

현재 레포지토리의 상태를 확인. 수정된 파일, 스테이징 여부, 커밋 가능한 변경 사항을 확인한다.

```bash
git status
```

## git add

변경된 파일을 Staging Area로 올리는 명령어. 커밋에 포함할 변경 사항을 **선택하는 단계**이며, 아직 커밋이 생성된 것은 아니다.

```bash
git add 파일명     # 특정 파일만
git add .          # 전체
```

## git commit

Staging Area에 있는 변경 사항을 하나의 버전으로 기록. 커밋은 되돌릴 수 있는 기준점 역할(예: 게임 save file).

```bash
git commit -m "커밋 메시지"
```

## 커밋 메시지 작성 규칙

좋은 커밋 메시지는 무엇을 했는지 한눈에 알 수 있어야 한다.

**권장 규칙**: 명확하고 간결하게 작성 · 동사로 시작 · 한 커밋 = 한 작업

**예시**:

```
Add login API
Fix password validation bug
Refactor user service
```

## .gitignore

버전 관리에서 **제외할 파일을 지정**하는 설정 파일. 불필요한 파일이 커밋되는 것을 방지한다. 환경 변수 파일, 빌드 결과물, 개인 설정 파일 등은 보통 제외.

```
.env
__pycache__/
*.log
```

<aside>
⚠️

이미 커밋된 파일은 Git이 계속 추적하기 때문에, `.gitignore`에 추가해도 소용없다. `git rm --cached 파일명`으로 추적을 먼저 해제해야 한다.

</aside>

## ✅ 퀴즈 (복습)

- **Git에서 하나의 작업 단위를 기록한 것은?** → **commit**
- **Git을 사용하는 가장 큰 목적은?** → **코드 변경 이력을 관리하기 위해**
- **Working Directory와 Staging Area의 차이를 가장 잘 설명한 것은?** → **스테이징은 커밋할 파일을 선별하는 공간이다**

---

# 5. 브랜치 이해하기

## Branch (브랜치)

기존 작업과 분리된 **독립적인 작업 흐름**. 기능 개발·실험·수정 작업을 안전하게 진행할 수 있다. 협업과 안정적인 배포를 위해서는 브랜치를 잘 관리하는 것이 중요.

```bash
git branch              # 브랜치 목록 확인
git branch feature/ui   # 브랜치 생성
git switch feature/ui   # 브랜치 전환
```

## 브랜치 관리 전략

어떻게 브랜치를 나누고 합칠지에 대한 약속.

| 브랜치 | 역할 |
| --- | --- |
| `main` | 배포 가능한 안정 버전 |
| `dev` | 개발 중인 기능을 테스트하는 버전 |
| `feature/*` | 기능 개발 |
| `hotfix/*` | 긴급 수정 |

![image.png](Git,%20GitHub/image%201.png)

## 브랜치 병합 (git merge)

다른 브랜치의 작업 내용을 현재 브랜치로 합치는 명령어.

```bash
git merge feature/ui
```

## Fast-forward vs. 3-way merge

<aside>
🔀

**분기가 없으면 Fast-forward, 분기가 있으면 3-way merge.**

</aside>

- **Fast-forward merge** — 브랜치가 직선으로 이어질 때. 단순히 커밋 포인터만 이동.
- **3-way merge** — 브랜치가 갈라졌다가 다시 합쳐질 때. **병합 커밋이 생성**됨.

## Merge conflict 해결

같은 파일의 같은 부분을 서로 다르게 수정하면 **충돌(conflict)**이 발생한다. Git은 자동 병합을 시도하고, 판단이 필요한 경우만 충돌로 알려준다.

**해결 방법**: ① 충돌 파일 확인 → ② 충돌 코드 직접 수정 → ③ 새로운 커밋 생성

**실습 흐름**:

```bash
# 1. Git 레포지토리 초기화 + 첫 커밋
git init
echo "hello" > test.txt
git add .
git commit -m "first commit"

# 2. feature 브랜치 생성 후 같은 파일 수정
git branch feature
git switch feature
echo "hello from feature" > test.txt
git add .
git commit -m "update from feature"

# 3. main에서 같은 파일을 다르게 수정
git switch main
echo "hello from main" > test.txt
git commit -am "update from main"

# 4. 병합 시도 → 충돌 발생 → 해결
git merge feature              # 충돌!
cat test.txt                   # 충돌 내용 확인
vi test.txt                    # 파일 직접 수정
git commit -am "resolve merge conflict"
git log --oneline --graph      # 병합 이력 확인
```

---

# 6. GitHub 기초

## GitHub 계정과 저장소 생성

GitHub는 Git 저장소를 호스팅하는 서비스. 계정을 만든 뒤 새 Repository를 생성하면 **원격 저장소 주소(URL)**가 발급된다.

**원격 저장소의 역할**: 인터넷에 있는 Git 저장소 / 여러 사람이 같은 코드 공유 / 백업 역할 / 협업의 기준점

```bash
git remote add origin 원격주소
git remote -v                    # 연결된 원격 저장소 확인
```

## git push / git pull

로컬과 원격 저장소를 **동기화**하는 명령어.

- `git push` — 로컬 커밋을 원격 저장소로 **올림**
- `git pull` — 원격 변경 사항을 **내려받아** 로컬에 반영

```bash
git push -u origin main   # 로컬 커밋을 원격으로 업로드
git pull                  # 원격 변경 사항 다운로드
```

---

![git_flow.svg](Git,%20GitHub/git_flow.svg)

# 7. 협업 실습

## Clone vs. Fork

| Clone | Fork |
| --- | --- |
| 원격 저장소를 그대로 내 로컬로 복사 | 다른 사람의 저장소를 내 GitHub 계정으로 복사 |
| 같은 저장소에 push 권한이 있을 때 | 원본 저장소에 직접 push 권한이 없을 때 |
| 팀 내부 협업에 주로 사용 | 오픈소스 기여 방식 |

## Pull Request (PR)

변경 사항을 원본 저장소에 **반영해달라고 요청**하는 것. 변경 내용 설명 + 리뷰 요청 + 병합 전 검증 단계.

## Code Review 기본

코드를 병합하기 전에 함께 확인하는 과정. **버그 예방 · 코드 품질 유지 · 팀 규칙 공유**가 목적.

**기본 원칙**: 코드 중심으로 리뷰 · 이유를 남긴 코멘트 · 승인 후 병합

## Issue 사용법

할 일, 버그 리포트, 기능 요청 등을 관리하는 기능. PR과 Issue를 연결하여 작업을 관리한다.

```
Resolve: #1234     # 커밋·PR 메시지에 넣으면 해당 이슈와 연결됨
```

## 협업 실습 (Fork & Clone) — 오픈소스 기여 방식

```bash
# 1. Issue 생성 → 내 GitHub 계정으로 Fork
# 2. Clone으로 코드 가져오기
git clone 내_포크_저장소_URL
# 3. 원본 저장소 연결
git remote add upstream 원본_저장소_URL
# 4. 최신 코드 받기
git pull upstream main
# 5. 브랜치 생성
git switch -c feature/add-my-name
```

## 협업 실습 (Collaborator) — 팀 내부 협업 방식

```bash
# 준비: Repository collaborator 등록 + Branch protection rules 추가
#       (Require a pull request before merging)

# 1. Clone으로 코드 가져오기
git clone 원본_저장소_URL
# 2. 새로운 브랜치 생성 & 커밋
git switch -c feature/mybranch
git commit -m "message"
# 3. 원격 브랜치에 push
git push origin feature/mybranch
# 4. GitHub에서 feature/mybranch → main PR 생성
```

---

# 8. 자주 사용하는 명령어

## git show

특정 커밋 하나를 집중해서 살펴볼 때 사용. 해당 커밋의 변경 내용(diff), 커밋 메시지·작성자·날짜를 출력. 코드 리뷰나 이력 확인 시 유용.

```bash
git show              # git show HEAD와 동일
git show HEAD         # 현재 브랜치의 최신 커밋 내용 확인
git show 커밋해시      # 특정 커밋 하나를 지정해서 확인
```

## git diff

두 상태 간의 **차이점만 비교**해서 보여주는 명령어. 커밋 전 변경 사항 점검, 병합·충돌 원인 분석에 사용.

```bash
git diff                 # Working Directory ↔ Staging Area
git diff --staged        # Staging Area ↔ HEAD
git diff HEAD~1 HEAD     # 커밋 ↔ 커밋
```

## git blame

파일의 각 줄이 **누가·언제·어떤 커밋에서** 수정됐는지 추적. 버그 원인 추적 시("이 줄은 왜 이렇게 되어 있지?") 유용.

```bash
git blame main.py       # main.py 각 줄의 수정 이력 확인
```

## git stash

현재 작업 중인 변경 사항을 **임시로 치워두는** 명령어. 커밋하지 않고 작업을 잠시 중단할 때, 브랜치 이동이나 긴급 수정 시 유용.

```bash
git stash               # 현재 변경 사항을 임시 저장
git stash list          # 저장된 stash 목록 확인
git stash pop           # 최근 stash를 다시 적용하고 목록에서 제거
git stash apply         # 특정 stash를 제거하지 않고 적용만
```

## git reset

브랜치의 기준을 과거 커밋으로 이동시키는 명령어. **히스토리를 바꾼다.**

| 옵션 | 동작 |
| --- | --- |
| `--soft` | 커밋만 취소 (변경 내용 유지) |
| `--mixed` (기본) | 커밋 + 스테이징 취소 |
| `--hard` | 전부 삭제 (주의) |

```bash
git reset --soft HEAD~1    # HEAD만 한 커밋 이전으로 (변경 내용 유지)
git reset --hard HEAD~1    # HEAD 이동 + 스테이징 + 파일까지 모두 되돌림
```

<aside>
⚠️

`git reset`은 히스토리를 바꾸므로, **협업 브랜치에서 사용 시 주의**가 필요하다.

</aside>

## git revert

특정 커밋을 되돌리는 **새 커밋을 생성**(히스토리를 보존). 기존 기록은 그대로 유지되고 "이 커밋을 취소했다"는 기록이 남는다. 협업 중 안전하게 롤백할 때 사용.

```bash
git revert 커밋해시
```

<aside>
💡

**reset vs. revert**: reset은 히스토리를 *바꿔* 과거로 이동(혼자 작업 시), revert는 취소 기록을 *남기며* 되돌림(협업 시 안전). 협업 브랜치에선 revert를 쓴다.

</aside>

## git commit --amend

마지막 커밋을 고치는 옵션. 가장 최근 커밋을 새 커밋으로 교체한다. 커밋 메시지 수정, 변경 파일 추가/제거가 가능.

```bash
git commit --amend              # 마지막 커밋을 고침
git commit --amend --no-edit    # 기존 커밋 메시지는 그대로 유지
```

[Git 명령어 모음](https://app.notion.com/p/Git-38f0c3b338058062a1fcd278418e6449?pvs=21)

[Git 정리](https://app.notion.com/p/Git-38f0c3b338058083b22acc1d3ad0f9fb?pvs=21)

## git log — 버전(커밋) 이력 보기

지금까지의 모든 커밋을 최신순으로 본다. **누가·언제·무엇을** 커밋했는지 확인하는 가장 기본 명령.

```bash
git log                        # 전체 이력 (Author·Date·메시지)
git log --oneline              # 한 줄로 간결하게 (실무에서 가장 많이 씀)
git log --oneline --graph      # 브랜치 흐름까지 그래프로
```

<aside>
💡

`git log`·`git show`는 내용이 길면 페이지로 뜨고 화면에 `(END)`가 나온다. **`q`를 누르면** 빠져나온다.

</aside>

## 이력·작업자 확인 명령 한눈에

| 알고 싶은 것 | 명령어 |
| --- | --- |
| 전체 버전 이력 (누가·언제·뭘) | `git log` / `git log --oneline` |
| 특정 줄을 누가 바꿨나 | `git blame 파일명` |
| 특정 커밋의 변경 내용 | `git show 커밋해시` |
| 바뀐 파일 목록·요약만 | `git show --stat 커밋해시` |
| 두 버전 간 차이 | `git diff` |

> **흐름**: `git log --oneline`으로 커밋 목록 보고 → 궁금한 커밋의 해시(앞 7자리)를 골라 → `git show 해시`로 그 작업 내용 확인.
> 

<aside>
🤖

**Claude Code와 커밋**: Claude Code는 `feat:`·`fix:`·`style:`·`security:` 같은 Conventional Commits 접두어를 붙여 자동으로 커밋해준다. 편하지만 커밋은 곧 내 작업 기록이므로, `git log`로 한 번씩 직접 확인하는 습관을 들이는 게 좋다. 가끔은 직접 add→commit→push를 손으로 쳐봐야 자동화 뒤에서 무슨 일이 일어나는지 감이 잡힌다.

</aside>

### 커밋 메시지 접두어(Conventional Commits)

| 접두어 | 의미 |
| --- | --- |
| `feat:` | 새 기능 추가 |
| `fix:` | 버그 수정 |
| `style:` | 동작과 무관한 스타일·포맷 (여백, 정렬) |
| `refactor:` | 기능 변화 없이 코드 구조 개선 |
| `security:` | 보안 관련 변경 |
| `docs:` | 문서 변경 |
| `chore:` | 빌드·설정 등 잡일 |

---

# 📎 보충 — 혼자 개발할 때 & 핵심 개념 정리

## Git ↔ VSCode ↔ GitHub 역할 구분

자주 헷갈리는 부분. 동기화를 "VSCode가 한다"고 오해하기 쉽지만, 실제로 일하는 건 Git이다.

| 대상 | 실제 역할 | 자동인가? |
| --- | --- | --- |
| **Git** | 버전 관리 + 동기화(push/pull)를 **실행**하는 엔진 | ❌ 내가 명령할 때만 |
| **VSCode** | Git 명령을 버튼으로 눌러주는 **리모컨**(인터페이스) | — |
| **GitHub** | 올린 걸 보관·공유하는 **원격 저장소** | — |

<aside>
⚠️

**자동 동기화가 아니다**: 드롭박스처럼 저장하면 자동으로 올라가는 게 아니다. `commit` + `push`를 직접 해야만 GitHub에 반영된다. "분명 작업했는데 GitHub엔 왜 없지?" → push를 안 한 것.

</aside>

## GitHub에 올리는 전체 흐름 (로컬 → 원격)

```bash
# 매번 작업 후 (3단계)
git add .                      # 1. 변경 파일을 staging에
git commit -m "변경 내용 설명"   # 2. 하나의 버전으로 기록 (여기까진 로컬)
git push                       # 3. GitHub로 업로드 (이때 인터넷 경계를 넘음)

# 맨 처음 한 번만 (GitHub 저장소 연결)
git remote add origin 저장소주소
git push -u origin main
```

> **핵심**: add·commit까지는 전부 내 컴퓨터(로컬) 안. `push`로 빨간 선(인터넷)을 넘을 때만 GitHub에 실제로 올라간다. (위 git_flow 다이어그램 참고)
> 

## Git vs 드롭박스 — 무엇이 다른가

|  | 드롭박스 | GitHub(Git) |
| --- | --- | --- |
| 동기화 | 자동·실시간 | 수동 (add→commit→push) |
| 저장 단위 | 최신 파일만 (덮어씀) | **모든 버전을 기록** (이력 보존) |
| 핵심 가치 | 파일 보관·공유 | **변경 이력 + 협업** |

→ GitHub는 "파일 저장소"라기보다 **"변경의 역사를 관리하고 함께 작업하는 공간"**. 그래서 코드·문서·설정처럼 버전 관리가 의미 있는 것을 올리고, 대용량 데이터·동영상은 Git에 안 맞아 따로 관리한다.

## 혼자 개발할 때 브랜치 운용

혼자면 복잡한 전략(develop·release)은 불필요. **main 한 줄로도 충분**하다. 단, 크게 실험할 때만 브랜치를 판다.

```bash
git switch -c feature/새기능    # 실험용 브랜치 만들고 이동
# ... 마음껏 실험 (main은 안전) ...

# 잘 됐으면:
git switch main
git merge feature/새기능        # main에 반영

# 망했으면:
git switch main                # 그냥 돌아오면 끝. main 무사.
git branch -D feature/새기능    # 실험 브랜치 버리기
```

<aside>
🤖

**Claude Code + 브랜치 안전망**: 큰 작업을 Claude Code에 맡기기 전에 `git switch -c feature/이름`으로 브랜치를 파두면, 결과가 마음에 안 들 때 브랜치째 버리고 main으로 돌아오면 된다. 원래 코드는 무사.

</aside>

## init 안전 체크리스트 (사고 예방)

`git init` 전에 항상 확인:

```bash
pwd                            # 1. 내가 어디 있는지 (가장 중요)
git status                     # 2. 이미 저장소 아닌지 (not a git repository → init 가능)
git rev-parse --show-toplevel  # 3. 상위에 이미 .git 있는지 (에러 나야 안전)
```

**init된 폴더 찾기**(흩어진 `.git` 점검):

```bash
find ~ -maxdepth 3 -type d -name .git 2>/dev/null         # 홈 영역
find /Volumes/DataSSD -maxdepth 3 -type d -name .git 2>/dev/null  # 외장 SSD
```

> **올바른 원칙**: `.git` 하나 = 프로젝트 하나. 여러 프로젝트를 담는 상위 폴더는 절대 init하지 말고, 개별 프로젝트 폴더 안으로 `cd` 한 뒤 init한다. GitHub에서 받아올 거면 init 대신 `git clone`.
> 

![image.png](Git,%20GitHub/image%202.png)

![image.png](Git,%20GitHub/image%203.png)