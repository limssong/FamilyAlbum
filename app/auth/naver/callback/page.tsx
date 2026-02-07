'use client'

import { Suspense, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { signInWithNaver } from '@/lib/auth'

declare global {
  interface Window {
    naver: any
  }
}

// 정적 내보내기를 위한 설정 - 빌드 시 정적 페이지 생성 안 함
export const dynamicParams = true

function NaverCallbackContent() {
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const code = searchParams.get('code')
    const state = searchParams.get('state')

    if (!code) {
      router.push('/login?error=no_code')
      return
    }

    // 네이버 사용자 정보 가져오기
    if (window.naver) {
      const naverLogin = new window.naver.LoginWithNaverId({
        clientId: process.env.NEXT_PUBLIC_NAVER_CLIENT_ID,
        callbackUrl: typeof window !== 'undefined' ? window.location.origin + '/auth/naver/callback' : '',
        isPopup: false,
      })

      naverLogin.init()

      naverLogin.getLoginStatus(async (status: boolean) => {
        if (status) {
          const userInfo = naverLogin.user
          try {
            await signInWithNaver('', userInfo)
            router.push('/')
          } catch (error) {
            console.error('네이버 로그인 오류:', error)
            router.push('/login?error=signin_failed')
          }
        } else {
          router.push('/login?error=login_failed')
        }
      })
    } else {
      router.push('/login?error=sdk_not_loaded')
    }
  }, [searchParams, router])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-gray-500">로그인 처리 중...</div>
    </div>
  )
}

export default function NaverCallback() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-500">로딩 중...</div>
      </div>
    }>
      <NaverCallbackContent />
    </Suspense>
  )
}

