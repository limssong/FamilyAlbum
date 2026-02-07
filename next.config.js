/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === 'production'
const repoName = process.env.GITHUB_REPOSITORY?.split('/')[1] || 'Flashback'

const nextConfig = {
  reactStrictMode: true,
  output: 'export', // GitHub Pages를 위한 정적 내보내기
  images: {
    unoptimized: true, // GitHub Pages는 이미지 최적화를 지원하지 않음
    domains: [
      'firebasestorage.googleapis.com',
      'images.unsplash.com',
    ],
  },
  // GitHub Pages는 리포지토리 이름 하위에 배포될 수 있으므로 basePath 설정
  basePath: isProd ? `/${repoName}` : '',
  assetPrefix: isProd ? `/${repoName}` : '',
  trailingSlash: true, // GitHub Pages 호환성
}

module.exports = nextConfig

