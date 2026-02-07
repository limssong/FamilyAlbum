const fs = require('fs');
const path = require('path');

const apiDir = path.join(__dirname, '../app/api');
// 프로젝트 루트 외부에서 복원
const apiDisabledDir = path.join(__dirname, '../.api.disabled');

// OAuth 콜백 페이지 디렉토리
const kakaoCallbackDir = path.join(__dirname, '../app/auth/kakao/callback');
const naverCallbackDir = path.join(__dirname, '../app/auth/naver/callback');
const authDisabledDir = path.join(__dirname, '../.auth.disabled');

// API 라우트 복원
if (fs.existsSync(apiDisabledDir)) {
  if (fs.existsSync(apiDir)) {
    fs.rmSync(apiDir, { recursive: true, force: true });
  }
  fs.renameSync(apiDisabledDir, apiDir);
  console.log('✓ API routes restored');
} else {
  console.log('ℹ No API routes to restore');
}

// OAuth 콜백 페이지 복원
if (fs.existsSync(authDisabledDir)) {
  const kakaoDisabled = path.join(authDisabledDir, 'kakao-callback');
  const naverDisabled = path.join(authDisabledDir, 'naver-callback');
  
  if (fs.existsSync(kakaoDisabled)) {
    if (fs.existsSync(kakaoCallbackDir)) {
      fs.rmSync(kakaoCallbackDir, { recursive: true, force: true });
    }
    fs.mkdirSync(path.dirname(kakaoCallbackDir), { recursive: true });
    fs.renameSync(kakaoDisabled, kakaoCallbackDir);
    console.log('✓ Kakao callback page restored');
  }
  
  if (fs.existsSync(naverDisabled)) {
    if (fs.existsSync(naverCallbackDir)) {
      fs.rmSync(naverCallbackDir, { recursive: true, force: true });
    }
    fs.mkdirSync(path.dirname(naverCallbackDir), { recursive: true });
    fs.renameSync(naverDisabled, naverCallbackDir);
    console.log('✓ Naver callback page restored');
  }
  
  // 빈 디렉토리 삭제
  try {
    fs.rmdirSync(authDisabledDir);
  } catch (e) {
    // 무시
  }
}

