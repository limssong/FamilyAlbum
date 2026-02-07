'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from '@/lib/firebase'
import { checkUserApproval } from '@/lib/auth'
import { User } from '@/types/user'

interface AuthGuardProps {
  children: React.ReactNode
}

export default function AuthGuard({ children }: AuthGuardProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [isApproved, setIsApproved] = useState(false)

  useEffect(() => {
    // 임시로 인증 체크 비활성화 - Firebase 설정 후 활성화
    // TODO: Firebase 설정 완료 후 주석 해제
    setLoading(false)
    setIsApproved(true) // 임시로 승인된 것으로 처리
    
    // Firebase 설정 후 아래 코드 활성화
    // const unsubscribe = onAuthStateChanged(auth, async (user) => {
    //   if (!user) {
    //     router.push('/login')
    //     return
    //   }

    //   try {
    //     const approved = await checkUserApproval(user.uid)
    //     setIsApproved(approved)
        
    //     if (!approved) {
    //       router.push('/waiting-approval')
    //     } else {
    //       setLoading(false)
    //     }
    //   } catch (error) {
    //     console.error('Error checking approval:', error)
    //     // 에러 발생 시 임시로 접근 허용
    //     setLoading(false)
    //     setIsApproved(true)
    //   }
    // })

    // return () => unsubscribe()
  }, [router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-500">로딩 중...</div>
      </div>
    )
  }

  if (!isApproved) {
    return null
  }

  return <>{children}</>
}

