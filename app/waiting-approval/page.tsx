'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import { auth } from '@/lib/firebase'
import { checkUserApproval } from '@/lib/auth'

export default function WaitingApprovalPage() {
  const router = useRouter()
  const [userEmail, setUserEmail] = useState<string>('')

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.push('/login')
        return
      }

      setUserEmail(user.email || '')

      // 승인 상태 확인 (주기적으로 체크)
      const checkInterval = setInterval(async () => {
        const approved = await checkUserApproval(user.uid)
        if (approved) {
          clearInterval(checkInterval)
          router.push('/')
        }
      }, 5000) // 5초마다 확인

      return () => clearInterval(checkInterval)
    })

    return () => unsubscribe()
  }, [router])

  const handleLogout = async () => {
    await signOut(auth)
    router.push('/login')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
        <div className="mb-6">
          <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-yellow-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            승인 대기 중
          </h1>
          <p className="text-gray-600">
            운영자의 승인을 기다리고 있습니다.
          </p>
        </div>

        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <p className="text-sm text-gray-600 mb-2">로그인된 계정:</p>
          <p className="text-sm font-medium text-gray-900">{userEmail || '사용자'}</p>
        </div>

        <p className="text-xs text-gray-500 mb-6">
          승인되면 자동으로 메인 페이지로 이동합니다.
        </p>

        <button
          onClick={handleLogout}
          className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
        >
          로그아웃
        </button>
      </div>
    </div>
  )
}

