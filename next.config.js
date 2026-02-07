/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === 'production'
// GitHub Pages는 리포지토리 이름 하위에 배포되므로 basePath 설정
// 리포지토리 이름이 'FamilyAlbum'인 경우
const basePath = isProd ? '/FamilyAlbum' : ''

const nextConfig = {
  reactStrictMode: true,
  output: 'export', // GitHub Pages를 위한 정적 내보내기
  basePath: basePath,
  assetPrefix: basePath,
  trailingSlash: true, // GitHub Pages 호환성
  // API 라우트는 정적 내보내기에서 사용할 수 없으므로 제외
  pageExtensions: ['tsx', 'ts', 'jsx', 'js'],
  // api.disabled 디렉토리 제외
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
      }
    }
    return config
  },
  images: {
    unoptimized: true, // GitHub Pages는 이미지 최적화를 지원하지 않음
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
}

module.exports = nextConfig

