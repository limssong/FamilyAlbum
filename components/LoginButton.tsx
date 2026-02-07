'use client'

import { useState } from 'react'
import { signInWithKakao, signInWithNaver } from '@/lib/auth'

declare global {
  interface Window {
    Kakao: any
    naver: any
  }
}

export default function LoginButton() {
  const [loading, setLoading] = useState(false)

  // 카카오 로그인
  const handleKakaoLogin = async () => {
    if (!window.Kakao) {
      alert('카카오 SDK가 로드되지 않았습니다.')
      return
    }

    setLoading(true)
    try {
      // 카카오 로그인
      window.Kakao.Auth.login({
        success: async (authObj: any) => {
          try {
            // 사용자 정보 가져오기
            window.Kakao.API.request({
              url: '/v2/user/me',
              success: async (res: any) => {
                await signInWithKakao(authObj.access_token, res)
                window.location.href = '/'
              },
              fail: (err: any) => {
                console.error('카카오 사용자 정보 가져오기 실패:', err)
                alert('로그인에 실패했습니다.')
                setLoading(false)
              },
            })
          } catch (error) {
            console.error('카카오 로그인 오류:', error)
            alert('로그인에 실패했습니다.')
            setLoading(false)
          }
        },
        fail: (err: any) => {
          console.error('카카오 로그인 실패:', err)
          alert('로그인에 실패했습니다.')
          setLoading(false)
        },
      })
    } catch (error) {
      console.error('카카오 로그인 오류:', error)
      alert('로그인에 실패했습니다.')
      setLoading(false)
    }
  }

  // 네이버 로그인
  const handleNaverLogin = () => {
    if (!window.naver) {
      alert('네이버 SDK가 로드되지 않았습니다.')
      return
    }

    setLoading(true)
    const naverLogin = new window.naver.LoginWithNaverId({
      clientId: process.env.NEXT_PUBLIC_NAVER_CLIENT_ID,
      callbackUrl: typeof window !== 'undefined' ? window.location.origin + '/auth/naver/callback' : '',
      isPopup: false,
      loginButton: { color: 'green', type: 3, height: 58 },
    })

    naverLogin.init()

    naverLogin.getLoginStatus(async (status: boolean) => {
      if (status) {
        const userInfo = naverLogin.user
        try {
          await signInWithNaver('', userInfo)
          window.location.href = '/'
        } catch (error) {
          console.error('네이버 로그인 오류:', error)
          alert('로그인에 실패했습니다.')
          setLoading(false)
        }
      } else {
        setLoading(false)
      }
    })
  }

  return (
    <div className="space-y-4">
      <button
        onClick={handleKakaoLogin}
        disabled={loading}
        className="w-full flex items-center justify-center gap-3 px-6 py-3 bg-[#FEE500] text-[#000000] rounded-lg font-medium hover:bg-[#FDD835] transition-colors disabled:opacity-50"
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M10 0C4.477 0 0 3.582 0 8c0 2.797 1.823 5.26 4.55 6.676L3.5 20l5.5-3.11c.355.04.713.062 1.075.062 5.523 0 10-3.582 10-8S15.523 0 10 0z"
            fill="currentColor"
          />
        </svg>
        카카오로 로그인
      </button>

      <button
        onClick={handleNaverLogin}
        disabled={loading}
        className="w-full flex items-center justify-center gap-3 px-6 py-3 bg-[#03C75A] text-white rounded-lg font-medium hover:bg-[#02B350] transition-colors disabled:opacity-50"
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M10 0C4.477 0 0 4.477 0 10s4.477 10 10 10 10-4.477 10-10S15.523 0 10 0zm5.5 5.5h-2.5v2.5h-1v-2.5H9.5v-1h2.5V2h1v2.5h2.5v1z"
            fill="currentColor"
          />
        </svg>
        네이버로 로그인
      </button>
    </div>
  )
}

