# RUNLOG - 완전랜덤 로또 번호 추천 사이트

## 2026-05-02

### 시작
- 사용자 문제: 동행복권 자동 번호 생성 방식에 대한 신뢰 부족.
- 프로젝트 방향: 브라우저 보안 난수 기반의 투명한 로또 번호 생성 웹사이트.

### 작성한 산출물
- `PRD.md`: MVP 기준 제품 요구사항 초안 작성.
- `TASKS.md`: 단계별 작업 목록 작성.

### 현재 결정한 기본 가정
- 기본 생성 개수는 5게임.
- 로또 6/45 기준.
- 구매/로그인/결제 기능 없음.
- 당첨 예측이 아니라 순수 랜덤 생성 보조 도구.
- MVP는 서버 없는 정적 웹앱 권장.

## 2026-05-03

### 구현
- Vite + React + TypeScript 기반 정적 앱 초기화.
- `crypto.getRandomValues()` 우선 사용 로또 6/45 5게임 생성 로직 구현.
- 다시 생성 / 복사 / 공유(Web Share API, fallback 포함) 기능 구현.
- 모바일 반응형 UI와 신뢰/주의 문구 영역 구현.
- `README.md` 작성.

### 검증
- `npm install` 완료.
- `npm run build` 성공.
- 산출물은 `dist/`에 생성되어 정적 호스팅 준비 상태 확인.

### 후속 정리
- 앱 내 안내 문구와 README 표현을 조금 더 자연스럽고 신뢰감 있게 다듬음.
- GitHub Pages 배포를 위한 Vite base 설정과 GitHub Actions 워크플로 추가.

### 남은 일
1. GitHub 저장소 remote 연결.
2. GitHub 인증 갱신 후 `master` 브랜치 push.
3. 저장소 Settings → Pages에서 GitHub Actions 활성화 후 배포 URL 확인.
