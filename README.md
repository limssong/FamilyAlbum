# Flashback

인스타그램이나 페이스북에서 제공하는 "X년 전 오늘" 게시물 리마인드 기능을 제공하는 프라이빗한 메모리 키핑 사이트입니다.

## 주요 기능

- 📸 사진과 글을 기록하고 저장
- 🔔 X년 전 오늘 올린 게시물을 리마인드
- 🔒 프라이빗한 개인 게시물 관리 (운영자 승인 필요)
- 📅 날짜별 게시물 조회
- 🔐 카카오/네이버 소셜 로그인
- 👥 운영자 승인 시스템

## 기술 스택

- **Framework**: Next.js 14
- **UI Library**: React.js
- **Styling**: Tailwind CSS, SCSS
- **Backend**: Firebase (Firestore, Storage, Authentication)

## 시작하기

### 사전 요구사항

- Node.js 18 이상
- pnpm 설치 (`npm install -g pnpm`)

### 설치

```bash
# 의존성 설치
pnpm install
```

### Firebase 설정

**Firebase 설정은 `FIREBASE_SETUP.md` 파일을 참고하세요.**

Firebase 프로젝트를 생성하고 설정하는 전체 과정을 단계별로 안내합니다.

### 환경 변수 설정

`.env.local` 파일을 생성하고 다음 설정을 추가하세요:

```env
# Firebase
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Firebase Admin (서비스 계정 JSON 전체를 문자열로)
FIREBASE_SERVICE_ACCOUNT_KEY='{"type":"service_account",...}'

# 카카오 OAuth
NEXT_PUBLIC_KAKAO_JS_KEY=your_kakao_javascript_key

# 네이버 OAuth
NEXT_PUBLIC_NAVER_CLIENT_ID=your_naver_client_id
NEXT_PUBLIC_NAVER_CLIENT_SECRET=your_naver_client_secret
```

**상세 설정 가이드:**
- Firebase 설정: `FIREBASE_SETUP.md` 참고
- 카카오/네이버 OAuth 설정: `OAUTH_SETUP.md` 참고

### 개발 서버 실행

```bash
pnpm dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 확인하세요.

### 빌드

```bash
pnpm build
pnpm start
```

## 프로젝트 구조

```
flashback/
├── app/                 # Next.js App Router
│   ├── api/             # API 라우트
│   ├── auth/            # OAuth 콜백 페이지
│   ├── create/          # 게시물 작성 페이지
│   ├── login/           # 로그인 페이지
│   ├── post/            # 게시물 상세 페이지
│   └── waiting-approval/ # 승인 대기 페이지
├── components/          # React 컴포넌트
│   ├── AuthGuard.tsx    # 인증 가드
│   ├── Header.tsx       # 헤더 컴포넌트
│   ├── LoginButton.tsx  # 로그인 버튼
│   └── PostCard.tsx     # 게시물 카드
├── lib/                 # 유틸리티 및 Firebase 설정
│   ├── auth.ts          # 인증 관련 함수
│   ├── approvedUsers.ts # 승인된 사용자 관리
│   ├── firebase.ts      # Firebase 초기화
│   └── posts.ts         # 게시물 CRUD 함수
├── public/              # 정적 파일
├── styles/              # 전역 스타일 (SCSS)
└── types/               # TypeScript 타입 정의
```

## 사용자 승인 시스템

1. 사용자가 카카오/네이버로 로그인
2. Firestore의 `approvedUsers` 컬렉션에 사용자 ID가 있는지 확인
3. 승인되지 않은 사용자는 "승인 대기" 페이지로 이동
4. 운영자가 Firestore에 사용자 ID를 추가하면 자동으로 승인됨
5. 승인된 사용자만 게시물 열람 및 작성 가능

**사용자 승인 방법:**
1. Firebase Console > Firestore Database 접속
2. `approvedUsers` 컬렉션 생성
3. 문서 ID를 사용자의 `providerId` (카카오/네이버 ID)로 설정
4. 필드 추가:
   - `providerId`: 사용자 ID
   - `approvedBy`: 운영자 ID (선택)
   - `approvedAt`: 승인 일시 (선택)

## 라이선스

MIT

