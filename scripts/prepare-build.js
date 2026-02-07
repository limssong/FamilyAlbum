const fs = require('fs');
const path = require('path');

const apiDir = path.join(__dirname, '../app/api');
// 프로젝트 루트 외부로 이동하여 TypeScript 체크에서 완전히 제외
const apiDisabledDir = path.join(__dirname, '../.api.disabled');

// OAuth 콜백 페이지 디렉토리
const kakaoCallbackDir = path.join(__dirname, '../app/auth/kakao/callback');
const naverCallbackDir = path.join(__dirname, '../app/auth/naver/callback');
const authDisabledDir = path.join(__dirname, '../.auth.disabled');

// API 라우트가 존재하면 임시로 이동
if (fs.existsSync(apiDir)) {
  if (fs.existsSync(apiDisabledDir)) {
    fs.rmSync(apiDisabledDir, { recursive: true, force: true });
  }
  fs.renameSync(apiDir, apiDisabledDir);
  console.log('✓ API routes moved to .api.disabled for static export');
} else {
  console.log('ℹ No API routes found');
}

// OAuth 콜백 페이지가 존재하면 임시로 이동 (정적 내보내기에서 제외)
if (fs.existsSync(kakaoCallbackDir) || fs.existsSync(naverCallbackDir)) {
  if (fs.existsSync(authDisabledDir)) {
    fs.rmSync(authDisabledDir, { recursive: true, force: true });
  }
  fs.mkdirSync(authDisabledDir, { recursive: true });
  
  if (fs.existsSync(kakaoCallbackDir)) {
    fs.renameSync(kakaoCallbackDir, path.join(authDisabledDir, 'kakao-callback'));
    console.log('✓ Kakao callback page moved for static export');
  }
  
  if (fs.existsSync(naverCallbackDir)) {
    fs.renameSync(naverCallbackDir, path.join(authDisabledDir, 'naver-callback'));
    console.log('✓ Naver callback page moved for static export');
  }
}

