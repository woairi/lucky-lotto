# 완전랜덤 로또 번호 생성기

브라우저 보안 난수(`crypto.getRandomValues`)를 바탕으로 로또 6/45 번호 5게임을 생성하는 Vite + React + TypeScript 정적 웹앱입니다.

## 기능
- 1~45 사이 숫자 6개를 중복 없이 뽑아 5게임 생성
- 각 게임을 오름차순으로 정렬해 표시
- 다시 생성, 복사하기, 공유하기(Web Share API 우선 / 미지원 시 복사 fallback)
- 모바일 우선 반응형 UI
- 난수 생성 방식과 주의사항을 설명하는 안내 영역 제공

## 시작하기
```bash
npm install
npm run dev
```

## 빌드
```bash
npm run build
```

## 배포
정적 파일은 `dist/`에 생성됩니다. GitHub Pages, Vercel, Netlify, Cloudflare Pages 같은 정적 호스팅에 바로 배포할 수 있습니다.

### GitHub Pages 메모
- `.github/workflows/deploy-pages.yml`이 포함되어 있어 `master` 브랜치에 push하면 GitHub Actions로 `dist/`를 배포할 수 있습니다.
- 저장소의 **Settings → Pages**에서 Build and deployment 소스를 **GitHub Actions**로 맞춰 주세요.
- 현재 `vite.config.ts`는 `base: './'`로 설정되어 있어 GitHub Pages 같은 서브패스 환경에서도 바로 동작합니다.

## 기술 스택
- Vite
- React
- TypeScript

## 주의
- 이 서비스는 당첨을 예측하지 않습니다.
- 모든 번호 조합의 당첨 확률은 동일합니다.
- 재미와 개인 선택을 돕는 용도로만 사용하세요.
