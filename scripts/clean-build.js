const fs = require('fs');
const path = require('path');

// .next 디렉토리 삭제
const nextDir = path.join(__dirname, '../.next');
if (fs.existsSync(nextDir)) {
  fs.rmSync(nextDir, { recursive: true, force: true });
  console.log('✓ .next directory removed');
}

// out 디렉토리 삭제
const outDir = path.join(__dirname, '../out');
if (fs.existsSync(outDir)) {
  fs.rmSync(outDir, { recursive: true, force: true });
  console.log('✓ out directory removed');
}

console.log('✓ Build cache cleaned');

