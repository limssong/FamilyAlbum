'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import { auth } from '@/lib/firebase'

export default function Header() {
  const pathname = usePathname()
  const router = useRouter()
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    if (!auth) {
      console.warn('Firebase Auth is not initialized.')
      return
    }
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user)
    })
    return () => unsubscribe()
  }, [])

  const handleLogout = async () => {
    try {
      if (!auth) {
        console.warn('Firebase Auth is not initialized.')
        router.push('/login')
        return
      }
      await signOut(auth)
      router.push('/login')
    } catch (error) {
      console.error('Logout error:', error)
      // 에러 발생해도 로그인 페이지로 이동
      router.push('/login')
    }
  }

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="max-w-5xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="text-2xl font-bold text-gray-900">
            FamilyAlbum
          </Link>
          
          <nav className="flex items-center gap-6">
            <Link
              href="/"
              className={`text-sm font-medium transition-colors ${
                pathname === '/'
                  ? 'text-gray-900'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              홈
            </Link>
            <Link
              href="/create"
              className={`text-sm font-medium transition-colors ${
                pathname === '/create'
                  ? 'text-gray-900'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              작성
            </Link>
            {user && (
              <button
                onClick={handleLogout}
                className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors"
              >
                로그아웃
              </button>
            )}
          </nav>
        </div>
      </div>
    </header>
  )
}

