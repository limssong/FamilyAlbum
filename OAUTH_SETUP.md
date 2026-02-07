# 카카오/네이버 OAuth 설정 가이드

## 1. 카카오 OAuth 설정

### 1.1 카카오 개발자 콘솔 접속
1. [카카오 개발자 콘솔](https://developers.kakao.com/)에 접속
2. 카카오 계정으로 로그인

### 1.2 애플리케이션 등록
1. "내 애플리케이션" > "애플리케이션 추가하기" 클릭
2. 앱 이름, 사업자명 입력 후 저장

### 1.3 플랫폼 설정
1. "앱 설정" > "플랫폼" 메뉴로 이동
2. "Web 플랫폼 등록" 클릭
3. 사이트 도메인 등록:
   - 개발: `http://localhost:3000`
   - 운영: 실제 도메인 (예: `https://yourdomain.com`)

### 1.4 카카오 로그인 활성화
1. "제품 설정" > "카카오 로그인" 활성화
2. "Redirect URI" 등록:
   - 개발: `http://localhost:3000/auth/kakao/callback`
   - 운영: `https://yourdomain.com/auth/kakao/callback`

### 1.5 동의 항목 설정
1. "제품 설정" > "카카오 로그인" > "동의항목" 메뉴
2. 필수 동의 항목 설정:
   - 닉네임
   - 프로필 사진
   - 카카오계정(이메일) - 선택 동의

### 1.6 JavaScript 키 발급
1. "앱 설정" > "앱 키" 메뉴
2. "JavaScript 키" 복사
3. `.env.local` 파일에 추가:
   ```env
   NEXT_PUBLIC_KAKAO_JS_KEY=your_javascript_key_here
   ```

---

## 2. 네이버 OAuth 설정

### 2.1 네이버 개발자 센터 접속
1. [네이버 개발자 센터](https://developers.naver.com/)에 접속
2. 네이버 계정으로 로그인

### 2.2 애플리케이션 등록
1. "Application" > "애플리케이션 등록" 클릭
2. 정보 입력:
   - 애플리케이션 이름
   - 사용 API: "네이버 로그인" 선택
   - 로그인 오픈 API 서비스 환경: "Web" 선택
   - 서비스 URL: 
     - 개발: `http://localhost:3000`
     - 운영: 실제 도메인
   - Callback URL:
     - 개발: `http://localhost:3000/auth/naver/callback`
     - 운영: `https://yourdomain.com/auth/naver/callback`

### 2.3 Client ID 및 Client Secret 발급
1. 등록 완료 후 "Client ID"와 "Client Secret" 확인
2. `.env.local` 파일에 추가:
   ```env
   NEXT_PUBLIC_NAVER_CLIENT_ID=your_client_id_here
   NEXT_PUBLIC_NAVER_CLIENT_SECRET=your_client_secret_here
   ```

---

## 3. Firebase 설정

### 3.1 Firebase Admin SDK 설정
1. [Firebase Console](https://console.firebase.google.com/) 접속
2. 프로젝트 선택 > "프로젝트 설정" > "서비스 계정" 탭
3. "새 비공개 키 생성" 클릭하여 JSON 파일 다운로드
4. JSON 파일 내용을 `.env.local`에 추가:
   ```env
   FIREBASE_SERVICE_ACCOUNT_KEY='{"type":"service_account",...}'
   ```
   또는 JSON 파일을 `lib/firebase-admin.json`에 저장하고 코드에서 읽도록 설정

### 3.2 Firestore 보안 규칙 설정
Firebase Console > Firestore Database > 규칙:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // 허가된 사용자 컬렉션 (운영자만 읽기/쓰기)
    match /approvedUsers/{userId} {
      allow read: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.isApproved == true;
      allow write: if false; // 운영자만 직접 추가
    }
    
    // 사용자 컬렉션
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    
    // 게시물 컬렉션 (승인된 사용자만)
    match /posts/{postId} {
      allow read: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.isApproved == true;
      allow create: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.isApproved == true;
      allow update, delete: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.isApproved == true;
    }
  }
}
```

### 3.3 Storage 보안 규칙 설정
Firebase Console > Storage > 규칙:
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

---

## 4. 환경 변수 설정

`.env.local` 파일에 다음 내용 추가:

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

# 카카오
NEXT_PUBLIC_KAKAO_JS_KEY=your_kakao_javascript_key

# 네이버
NEXT_PUBLIC_NAVER_CLIENT_ID=your_naver_client_id
NEXT_PUBLIC_NAVER_CLIENT_SECRET=your_naver_client_secret
```

---

## 5. 허가된 사용자 관리

### 5.1 Firestore에 허가된 사용자 추가
1. Firebase Console > Firestore Database 접속
2. `approvedUsers` 컬렉션 생성
3. 문서 ID를 사용자의 `providerId`로 설정
4. 필드 추가:
   - `providerId`: 사용자의 카카오/네이버 ID
   - `approvedBy`: 운영자 ID
   - `approvedAt`: 승인 일시

### 5.2 사용자 승인 스크립트 (선택사항)
운영자 페이지를 만들어서 웹에서 직접 승인할 수 있도록 구현할 수 있습니다.

---

## 6. 테스트

1. 개발 서버 실행:
   ```bash
   pnpm dev
   ```

2. 브라우저에서 `http://localhost:3000/login` 접속

3. 카카오/네이버 로그인 버튼 클릭하여 테스트

4. 로그인 후 승인 대기 페이지로 이동하는지 확인

5. Firestore에서 사용자를 승인한 후 메인 페이지 접근 가능한지 확인

---

## 주의사항

- 카카오/네이버 OAuth는 실제 도메인에서만 정상 작동합니다
- 개발 환경에서는 `localhost:3000`을 등록해야 합니다
- 운영 환경에서는 실제 도메인을 등록해야 합니다
- Firebase Admin SDK는 서버 사이드에서만 사용 가능합니다
- `.env.local` 파일은 절대 Git에 커밋하지 마세요

