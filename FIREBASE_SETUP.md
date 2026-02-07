# Firebase 설정 가이드

이 가이드는 Flashback 프로젝트에서 Firebase를 처음부터 설정하는 방법을 단계별로 설명합니다.

---

## 1단계: Firebase 프로젝트 생성

### 1.1 Firebase Console 접속
1. 웹 브라우저에서 [Firebase Console](https://console.firebase.google.com/) 접속
2. Google 계정으로 로그인 (없으면 계정 생성)

### 1.2 프로젝트 추가
1. "프로젝트 추가" 또는 "Add project" 버튼 클릭
2. 프로젝트 이름 입력 (예: `flashback`)
3. "계속" 클릭

### 1.3 Google Analytics 설정 (선택사항)
1. Google Analytics 사용 여부 선택
   - 개발 단계에서는 "지금은 사용 안 함" 선택 가능
   - 운영 단계에서는 사용 권장
2. "프로젝트 만들기" 클릭
3. 프로젝트 생성 완료까지 대기 (약 1-2분)

---

## 2단계: 웹 앱 등록

### 2.1 웹 앱 추가
1. Firebase Console에서 생성한 프로젝트 선택
2. 프로젝트 개요 페이지에서 `</>` (웹) 아이콘 클릭
3. 앱 닉네임 입력 (예: `Flashback Web`)
4. "이 앱에 Firebase Hosting도 설정하세요" 체크 해제 (나중에 설정 가능)
5. "앱 등록" 클릭

### 2.2 Firebase 설정 정보 복사
앱 등록 후 다음 정보가 표시됩니다. 이 정보를 복사해두세요:

```javascript
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAQDR4cmTtbD-2k57y0J2K2L6dD890kwbM",
  authDomain: "flashback-47744.firebaseapp.com",
  projectId: "flashback-47744",
  storageBucket: "flashback-47744.firebasestorage.app",
  messagingSenderId: "958638947752",
  appId: "1:958638947752:web:f497de72ca192ef600319d",
  measurementId: "G-2T5J1SNYXV"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
```

**이 정보는 다음 단계에서 사용합니다!**

---

## 3단계: Firebase 서비스 활성화

### 3.1 Firestore Database 활성화
1. 왼쪽 메뉴에서 "Firestore Database" 클릭
2. "데이터베이스 만들기" 클릭
3. 위치 선택: `asia-northeast3` (서울) 또는 가장 가까운 지역
4. 보안 규칙 모드 선택:
   - **개발 단계**: "테스트 모드에서 시작" 선택
   - **운영 단계**: "프로덕션 모드에서 시작" 선택
5. "사용 설정" 클릭

### 3.2 Storage 활성화
1. 왼쪽 메뉴에서 "Storage" 클릭
2. "시작하기" 클릭
3. 보안 규칙 확인:
   - **개발 단계**: "테스트 모드에서 시작" 선택
   - **운영 단계**: "프로덕션 모드에서 시작" 선택
4. 위치 선택: Firestore와 동일한 위치 선택
5. "완료" 클릭

### 3.3 Authentication 활성화 (선택사항)
1. 왼쪽 메뉴에서 "Authentication" 클릭
2. "시작하기" 클릭
3. 이 프로젝트에서는 커스텀 인증을 사용하므로 기본 설정만 확인

---

## 4단계: 환경 변수 설정

### 4.1 .env.local 파일 생성
프로젝트 루트 디렉토리에 `.env.local` 파일을 생성합니다.

```bash
# 프로젝트 루트에서 실행
touch .env.local
```

### 4.2 환경 변수 추가
`.env.local` 파일을 열고 다음 내용을 추가합니다. 2단계에서 복사한 정보를 사용하세요:

```env
# Firebase 설정 (2단계에서 복사한 정보)
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSy...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abcdef
```

**주의**: 
- `NEXT_PUBLIC_` 접두사는 반드시 필요합니다 (Next.js에서 클라이언트에서 사용 가능하도록)
- 실제 값은 Firebase Console에서 복사한 값으로 대체하세요

---

## 5단계: Firebase Admin SDK 설정

### 5.1 서비스 계정 키 생성
1. Firebase Console에서 프로젝트 선택
2. 왼쪽 상단 톱니바퀴 아이콘 클릭 > "프로젝트 설정"
3. "서비스 계정" 탭 클릭
4. "새 비공개 키 생성" 또는 "Generate new private key" 클릭
5. 경고 메시지 확인 후 "키 생성" 클릭
6. JSON 파일이 자동으로 다운로드됩니다

### 5.2 서비스 계정 키를 환경 변수로 변환
다운로드한 JSON 파일을 열고 전체 내용을 복사합니다.

**방법 1: JSON을 문자열로 변환 (권장)**
1. JSON 파일 내용 전체 복사
2. `.env.local` 파일에 추가:
   ```env
   FIREBASE_SERVICE_ACCOUNT_KEY='{"type":"service_account","project_id":"...","private_key_id":"...","private_key":"...","client_email":"...","client_id":"...","auth_uri":"...","token_uri":"...","auth_provider_x509_cert_url":"...","client_x509_cert_url":"..."}'
   ```
   - 작은따옴표(`'`)로 전체 JSON을 감싸야 합니다
   - JSON 내부의 따옴표는 이스케이프할 필요 없습니다

**방법 2: JSON 파일 직접 사용 (대안)**
서비스 계정 JSON 파일을 `lib/firebase-admin.json`에 저장하고 코드에서 읽도록 수정할 수 있습니다.

### 5.3 .env.local 파일 확인
최종 `.env.local` 파일 예시:

```env
# Firebase 클라이언트 설정
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSy...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abcdef

# Firebase Admin SDK (서비스 계정 JSON 전체)
FIREBASE_SERVICE_ACCOUNT_KEY='{"type":"service_account",...}'
```

---

## 6단계: Firebase 보안 규칙 설정

### 6.1 Firestore 보안 규칙 설정
1. Firebase Console > Firestore Database > "규칙" 탭 클릭
2. 다음 규칙을 복사하여 붙여넣기:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // 허가된 사용자 컬렉션 (운영자만 읽기)
    match /approvedUsers/{userId} {
      allow read: if request.auth != null && 
        exists(/databases/$(database)/documents/users/$(request.auth.uid)) &&
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.isApproved == true;
      allow write: if false; // 운영자만 직접 추가
    }
    
    // 사용자 컬렉션
    match /users/{userId} {
      allow read: if request.auth != null && request.auth.uid == userId;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    
    // 게시물 컬렉션 (승인된 사용자만)
    match /posts/{postId} {
      allow read: if request.auth != null && 
        exists(/databases/$(database)/documents/users/$(request.auth.uid)) &&
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.isApproved == true;
      allow create: if request.auth != null && 
        exists(/databases/$(database)/documents/users/$(request.auth.uid)) &&
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.isApproved == true;
      allow update, delete: if request.auth != null && 
        exists(/databases/$(database)/documents/users/$(request.auth.uid)) &&
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.isApproved == true;
    }
  }
}
```

3. "게시" 클릭

**개발 단계에서는 간단한 규칙 사용 가능:**
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

### 6.2 Storage 보안 규칙 설정
1. Firebase Console > Storage > "규칙" 탭 클릭
2. 다음 규칙을 복사하여 붙여넣기:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /posts/{allPaths=**} {
      allow read: if request.auth != null && 
        firestore.get(/databases/(default)/documents/users/$(request.auth.uid)).data.isApproved == true;
      allow write: if request.auth != null && 
        firestore.get(/databases/(default)/documents/users/$(request.auth.uid)).data.isApproved == true;
    }
  }
}
```

3. "게시" 클릭

**개발 단계에서는 간단한 규칙 사용 가능:**
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

---

## 7단계: 프로젝트 의존성 설치

### 7.1 Firebase 패키지 확인
프로젝트의 `package.json`에 다음 패키지가 포함되어 있는지 확인:

```json
{
  "dependencies": {
    "firebase": "^10.7.1",
    "firebase-admin": "^12.0.0"
  }
}
```

### 7.2 패키지 설치
터미널에서 다음 명령어 실행:

```bash
pnpm install
```

또는

```bash
npm install
```

---

## 8단계: Firebase 연결 테스트

### 8.1 개발 서버 실행
```bash
pnpm dev
```

### 8.2 브라우저에서 확인
1. `http://localhost:3000` 접속
2. 브라우저 개발자 도구 (F12) 열기
3. Console 탭에서 에러 확인
4. Firebase 연결이 정상이면 에러가 없어야 합니다

### 8.3 Firestore 테스트
1. Firebase Console > Firestore Database 접속
2. "데이터 시작" 또는 "데이터" 탭 클릭
3. 컬렉션 추가:
   - 컬렉션 ID: `approvedUsers`
   - 문서 ID: `test-user-id`
   - 필드 추가:
     - `providerId`: `test-user-id` (문자열)
     - `approvedAt`: 현재 시간 (타임스탬프)

---

## 9단계: 문제 해결

### 9.1 일반적인 오류

**오류: "Firebase: Error (auth/configuration-not-found)"**
- 해결: `.env.local` 파일의 환경 변수가 올바른지 확인
- 해결: `NEXT_PUBLIC_` 접두사가 있는지 확인

**오류: "Firebase: Error (auth/api-key-not-valid)"**
- 해결: Firebase Console에서 API 키가 올바른지 확인
- 해결: 환경 변수 값에 따옴표나 공백이 없는지 확인

**오류: "Permission denied"**
- 해결: Firestore/Storage 보안 규칙 확인
- 해결: 개발 단계에서는 테스트 모드 규칙 사용

**오류: "Firebase Admin not configured"**
- 해결: `FIREBASE_SERVICE_ACCOUNT_KEY` 환경 변수 확인
- 해결: JSON 형식이 올바른지 확인 (작은따옴표로 감싸져 있는지)

### 9.2 디버깅 팁
1. 환경 변수 확인:
   ```bash
   # .env.local 파일 내용 확인
   cat .env.local
   ```

2. Firebase 초기화 확인:
   - `lib/firebase.ts` 파일이 올바르게 설정되었는지 확인
   - 브라우저 콘솔에서 Firebase 객체 확인

3. 네트워크 요청 확인:
   - 브라우저 개발자 도구 > Network 탭
   - Firebase API 요청이 성공하는지 확인

---

## 10단계: 운영 환경 설정

### 10.1 프로덕션 환경 변수
배포 플랫폼 (Vercel, Netlify 등)에 환경 변수를 설정합니다.

### 10.2 보안 규칙 강화
운영 환경에서는 보안 규칙을 더 엄격하게 설정합니다 (위의 6단계 참고).

### 10.3 도메인 설정
- Firebase Console > Authentication > 설정 > 승인된 도메인
- 운영 도메인 추가

---

## 완료!

이제 Firebase가 완전히 설정되었습니다! 

다음 단계:
1. 카카오/네이버 OAuth 설정 (`OAUTH_SETUP.md` 참고)
2. 첫 번째 게시물 작성 테스트
3. 사용자 승인 시스템 테스트

---

## 추가 리소스

- [Firebase 공식 문서](https://firebase.google.com/docs)
- [Firestore 보안 규칙 가이드](https://firebase.google.com/docs/firestore/security/get-started)
- [Firebase Storage 보안 규칙 가이드](https://firebase.google.com/docs/storage/security)

