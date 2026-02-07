'use client'

import { useEffect } from 'react'
import LoginButton from '@/components/LoginButton'

export default function LoginPage() {
  useEffect(() => {
    // 카카오 SDK 로드
    if (!window.Kakao?.isInitialized()) {
      const script = document.createElement('script')
      script.src = 'https://developers.kakao.com/sdk/js/kakao.js'
      script.async = true
      script.onload = () => {
        if (window.Kakao) {
          window.Kakao.init(process.env.NEXT_PUBLIC_KAKAO_JS_KEY || '')
        }
      }
      document.head.appendChild(script)
    }

    // 네이버 SDK 로드
    if (!window.naver) {
      const script = document.createElement('script')
      script.src = 'https://static.nid.naver.com/js/naveridlogin_js_sdk_2.0.2.js'
      script.async = true
      document.head.appendChild(script)
    }
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Flashback</h1>
          <p className="text-gray-600">로그인하여 추억을 기록하세요</p>
        </div>
        <LoginButton />
        <p className="text-xs text-gray-500 text-center mt-6">
          운영자 승인 후 게시물을 열람할 수 있습니다
        </p>
      </div>
    </div>
  )
}

