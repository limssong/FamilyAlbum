# GitHub Pages 404 에러 해결 가이드

## 문제 진단

### 1. 빌드 확인
1. GitHub 리포지토리 > **Actions** 탭으로 이동
2. 최근 워크플로우 실행 확인
3. 빌드 단계가 성공했는지 확인
4. "Verify build output" 단계에서 `index.html`이 생성되었는지 확인

### 2. GitHub Pages 설정 확인
1. 리포지토리 > **Settings** > **Pages**
2. **Source**가 `GitHub Actions`로 설정되어 있는지 확인
3. 배포된 브랜치가 올바른지 확인

### 3. URL 확인
- 올바른 URL: `https://limssong.github.io/Flashback/`
- 주의: 마지막에 슬래시(`/`)가 있어야 합니다
- `https://limssong.github.io/Flashback` (슬래시 없음) → 404 에러 가능

## 해결 방법

### 방법 1: basePath 확인
`next.config.js`에서 basePath가 올바르게 설정되었는지 확인:

```javascript
basePath: '/Flashback'
```

리포지토리 이름이 다르다면 해당 이름으로 변경하세요.

### 방법 2: 빌드 재실행
1. GitHub 리포지토리 > **Actions** 탭
2. 최근 워크플로우 클릭
3. **Re-run all jobs** 클릭

### 방법 3: 수동 배포
1. 로컬에서 빌드:
   ```bash
   pnpm run build
   ```
2. `out` 디렉토리 확인:
   ```bash
   ls -la out/
   ```
3. `out` 디렉토리를 `gh-pages` 브랜치에 푸시:
   ```bash
   git checkout --orphan gh-pages
   git rm -rf .
   cp -r out/* .
   git add .
   git commit -m "Deploy to GitHub Pages"
   git push origin gh-pages
   ```

### 방법 4: GitHub Pages 설정 변경
1. **Settings** > **Pages**
2. **Source**를 `Deploy from a branch`로 변경
3. **Branch**: `gh-pages` 선택
4. **Folder**: `/ (root)` 선택
5. 저장

## 일반적인 문제

### 문제 1: 빌드 실패
**원인**: 의존성 설치 실패, 빌드 에러
**해결**: 
- GitHub Actions 로그 확인
- `pnpm-lock.yaml`이 커밋되었는지 확인
- 로컬에서 빌드 테스트

### 문제 2: index.html이 없음
**원인**: 빌드가 제대로 완료되지 않음
**해결**:
- `next.config.js`의 `output: 'export'` 확인
- 빌드 로그에서 에러 확인

### 문제 3: CSS/JS 파일이 로드되지 않음
**원인**: basePath 설정 문제
**해결**:
- `next.config.js`에서 `basePath`와 `assetPrefix` 확인
- 브라우저 개발자 도구에서 네트워크 탭 확인

### 문제 4: 라우팅이 작동하지 않음
**원인**: GitHub Pages는 SPA 라우팅을 지원하지 않음
**해결**:
- Next.js는 정적 내보내기 시 자동으로 HTML 파일을 생성
- `trailingSlash: true` 설정 확인

## 디버깅 팁

### 브라우저 개발자 도구
1. F12로 개발자 도구 열기
2. **Console** 탭에서 에러 확인
3. **Network** 탭에서 실패한 요청 확인
4. **Sources** 탭에서 파일 구조 확인

### GitHub Actions 로그
1. **Actions** 탭에서 워크플로우 클릭
2. 각 단계의 로그 확인
3. 에러 메시지 확인

### 로컬 테스트
```bash
# 빌드
pnpm run build

# 빌드 결과 확인
ls -la out/

# 로컬 서버로 테스트
npx serve out
```

## 추가 확인 사항

1. **리포지토리 이름**: `Flashback`이 맞는지 확인
2. **브랜치 이름**: `main` 또는 `master`인지 확인
3. **권한**: GitHub Pages 권한이 활성화되어 있는지 확인
4. **캐시**: 브라우저 캐시 삭제 후 재시도

## 여전히 문제가 있다면

1. GitHub Actions 로그 전체 확인
2. `out` 디렉토리 내용 확인
3. `next.config.js` 설정 재확인
4. GitHub Pages 설정 재확인

