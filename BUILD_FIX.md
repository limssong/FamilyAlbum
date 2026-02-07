# 빌드 에러 해결 가이드

## 문제
GitHub Pages 배포를 위해 `output: 'export'`를 사용하면 API 라우트를 사용할 수 없어 빌드 에러가 발생합니다.

## 해결 방법

### 1. API 라우트 제외
GitHub Actions에서 빌드할 때 API 라우트를 임시로 제외합니다.

### 2. 빌드 스크립트
- 로컬 개발: API 라우트 사용 가능
- 프로덕션 빌드: API 라우트 자동 제외

### 3. API 호출 처리
- GitHub Pages에서는 API 라우트를 사용할 수 없으므로 에러를 무시하고 계속 진행
- Firebase는 클라이언트에서 직접 사용하므로 문제없음

## 빌드 테스트

### 로컬에서 테스트
```bash
# 개발 모드 (API 라우트 사용 가능)
pnpm dev

# 프로덕션 빌드 (API 라우트 제외)
NODE_ENV=production pnpm run build:static
```

### GitHub Actions
자동으로 API 라우트를 제외하고 빌드합니다.

## 주의사항

1. **API 라우트**: GitHub Pages에서는 사용할 수 없습니다
2. **Firebase Admin SDK**: 서버 사이드에서만 작동하므로 GitHub Pages에서는 사용 불가
3. **Firebase 클라이언트 SDK**: 정상 작동합니다

## 대안

만약 API 라우트가 필요하다면:
1. Vercel, Netlify 등 서버리스 함수를 지원하는 플랫폼 사용
2. 별도의 백엔드 서버 구축
3. Firebase Functions 사용

