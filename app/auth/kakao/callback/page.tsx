'use client'

import { Suspense, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { signInWithKakao } from '@/lib/auth'

declare global {
  interface Window {
    Kakao: any
  }
}

// 정적 내보내기를 위한 설정 - 빌드 시 정적 페이지 생성 안 함
export const dynamicParams = true

function KakaoCallbackContent() {
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const code = searchParams.get('code')
    
    if (!code) {
      router.push('/login?error=no_code')
      return
    }

    if (!window.Kakao) {
      router.push('/login?error=sdk_not_loaded')
      return
    }

    // 카카오 토큰 교환 및 사용자 정보 가져오기
    window.Kakao.Auth.login({
      success: async (authObj: any) => {
        try {
          window.Kakao.API.request({
            url: '/v2/user/me',
            success: async (res: any) => {
              try {
                await signInWithKakao(authObj.access_token, res)
                router.push('/')
              } catch (error) {
                console.error('로그인 오류:', error)
                router.push('/login?error=signin_failed')
              }
            },
            fail: (err: any) => {
              console.error('사용자 정보 가져오기 실패:', err)
              router.push('/login?error=user_info_failed')
            },
          })
        } catch (error) {
          console.error('카카오 로그인 오류:', error)
          router.push('/login?error=login_failed')
        }
      },
      fail: (err: any) => {
        console.error('카카오 로그인 실패:', err)
        router.push('/login?error=login_failed')
      },
    })
  }, [searchParams, router])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-gray-500">로그인 처리 중...</div>
    </div>
  )
}

export default function KakaoCallback() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-500">로딩 중...</div>
      </div>
    }>
      <KakaoCallbackContent />
    </Suspense>
  )
}

