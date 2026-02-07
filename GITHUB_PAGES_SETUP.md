# GitHub Pages 배포 가이드

이 프로젝트를 GitHub Pages에 배포하는 방법을 안내합니다.

## 사전 준비

1. GitHub 리포지토리가 생성되어 있어야 합니다
2. 리포지토리 이름을 확인하세요 (예: `FamilyAlbum`)

## GitHub Pages 설정

### 1단계: GitHub 리포지토리 설정

1. GitHub 리포지토리 페이지로 이동
2. **Settings** 탭 클릭
3. 왼쪽 메뉴에서 **Pages** 클릭
4. **Source** 섹션에서:
   - **Source**: `GitHub Actions` 선택
5. 저장

### 2단계: 환경 변수 설정 (선택사항)

GitHub Pages는 정적 사이트이므로 서버 사이드 환경 변수는 사용할 수 없습니다.
하지만 클라이언트 사이드 환경 변수(`NEXT_PUBLIC_*`)는 빌드 시점에 포함됩니다.

**주의**: GitHub Actions에서 환경 변수를 설정하려면:
1. 리포지토리 > **Settings** > **Secrets and variables** > **Actions**
2. **New repository secret** 클릭
3. 필요한 환경 변수 추가:
   - `NEXT_PUBLIC_FIREBASE_API_KEY`
   - `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
   - `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
   - `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
   - `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
   - `NEXT_PUBLIC_FIREBASE_APP_ID`
   - `NEXT_PUBLIC_KAKAO_JS_KEY`
   - `NEXT_PUBLIC_NAVER_CLIENT_ID`
   - `NEXT_PUBLIC_NAVER_CLIENT_SECRET`

그리고 `.github/workflows/deploy.yml` 파일을 수정하여 환경 변수를 사용하도록 설정해야 합니다.

### 3단계: 코드 푸시

```bash
git add .
git commit -m "Setup GitHub Pages deployment"
git push origin main
```

### 4단계: 자동 배포 확인

1. GitHub 리포지토리 페이지에서 **Actions** 탭 클릭
2. "Deploy to GitHub Pages" 워크플로우가 실행되는지 확인
3. 빌드가 완료되면 **Settings** > **Pages**에서 배포된 URL 확인

## 배포된 사이트 접속

배포가 완료되면 다음 URL로 접속할 수 있습니다:

- 리포지토리 이름이 `FamilyAlbum`인 경우:
  - `https://[사용자명].github.io/FamilyAlbum/`

- 커스텀 도메인을 설정한 경우:
  - 설정한 도메인으로 접속

## 주의사항

### 1. API 라우트 제한
GitHub Pages는 정적 사이트만 호스팅하므로:
- `/api/*` 경로는 작동하지 않습니다
- Firebase는 클라이언트 사이드에서 직접 사용하므로 문제없습니다
- Firebase Admin SDK는 서버 사이드에서만 작동하므로 GitHub Pages에서는 사용할 수 없습니다

### 2. 환경 변수
- `NEXT_PUBLIC_*`로 시작하는 환경 변수만 클라이언트에서 사용 가능
- 서버 사이드 환경 변수는 GitHub Pages에서 사용 불가
- 환경 변수는 빌드 시점에 포함되므로 GitHub Actions Secrets에 설정 필요

### 3. 이미지 최적화
- Next.js 이미지 최적화는 GitHub Pages에서 작동하지 않으므로 `unoptimized: true`로 설정됨
- 외부 이미지(Unsplash, Firebase Storage)는 정상 작동

### 4. basePath 설정
- 리포지토리 이름이 URL에 포함됩니다
- 예: `https://username.github.io/FamilyAlbum/`
- 커스텀 도메인을 사용하면 basePath를 제거해야 할 수 있습니다

## 커스텀 도메인 설정 (선택사항)

1. GitHub 리포지토리 > **Settings** > **Pages**
2. **Custom domain** 섹션에 도메인 입력
3. DNS 설정:
   - A 레코드: `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
   - 또는 CNAME 레코드: `[사용자명].github.io`
4. `next.config.js`에서 `basePath`를 빈 문자열로 변경

## 문제 해결

### 빌드 실패
- GitHub Actions 로그 확인
- 환경 변수가 제대로 설정되었는지 확인
- `pnpm-lock.yaml`이 커밋되었는지 확인

### 페이지가 표시되지 않음
- GitHub Pages 설정에서 Source가 `GitHub Actions`로 설정되었는지 확인
- Actions 탭에서 배포가 성공했는지 확인
- 브라우저 캐시 삭제 후 재시도

### 이미지가 표시되지 않음
- `next.config.js`의 `images.unoptimized: true` 설정 확인
- 외부 이미지 URL이 올바른지 확인

## 로컬에서 테스트

GitHub Pages와 동일한 환경에서 테스트하려면:

```bash
# 빌드
pnpm run build

# out 디렉토리 확인
ls -la out

# 로컬 서버로 테스트 (선택사항)
npx serve out
```

## 추가 리소스

- [Next.js Static Exports](https://nextjs.org/docs/app/building-your-application/deploying/static-exports)
- [GitHub Pages Documentation](https://docs.github.com/en/pages)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)

