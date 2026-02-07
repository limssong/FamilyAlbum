import type { Metadata } from 'next'
import './globals.css'
import '../styles/globals.scss'

export const metadata: Metadata = {
  title: 'Flashback - 당신의 추억을 기록하세요',
  description: 'X년 전 오늘을 기억하는 프라이빗한 메모리 키핑 사이트',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  )
}

