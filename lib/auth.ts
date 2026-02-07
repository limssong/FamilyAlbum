import {
  signInWithCustomToken,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User as FirebaseUser,
} from 'firebase/auth'
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore'
import { auth, db } from './firebase'
import { User } from '@/types/user'

const USERS_COLLECTION = 'users'
const APPROVED_USERS_COLLECTION = 'approvedUsers'

// 카카오 로그인
export async function signInWithKakao(accessToken: string, userInfo: any) {
  try {
    if (!db) {
      throw new Error('Firestore is not initialized. Please check your Firebase configuration.')
    }

    // 카카오 사용자 정보로 Firestore에 사용자 정보 저장/업데이트
    const providerId = userInfo.id.toString()
    const userData: Partial<User> = {
      name: userInfo.kakao_account?.profile?.nickname || userInfo.kakao_account?.email || '사용자',
      email: userInfo.kakao_account?.email,
      profileImage: userInfo.kakao_account?.profile?.profile_image_url,
      provider: 'kakao',
      providerId,
      createdAt: new Date(),
    }

    // 사용자 문서 참조
    const userRef = doc(db, USERS_COLLECTION, providerId)
    const userSnap = await getDoc(userRef)

    if (!userSnap.exists()) {
      // 새 사용자 - 승인 여부 확인
      const approvedRef = doc(db, APPROVED_USERS_COLLECTION, providerId)
      const approvedSnap = await getDoc(approvedRef)
      userData.isApproved = approvedSnap.exists()
      
      if (userData.isApproved) {
        userData.approvedAt = new Date()
      }
    } else {
      const existingData = userSnap.data()
      userData.isApproved = existingData.isApproved || false
      userData.approvedAt = existingData.approvedAt
    }

    await setDoc(userRef, userData, { merge: true })

    // Firebase Custom Token 생성 (서버에서 처리해야 함)
    // TODO: Firebase Admin SDK 설정 후 주석 해제
    try {
      const customToken = await fetch('/api/auth/custom-token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ provider: 'kakao', providerId, userInfo }),
      }).then((res) => res.json())

      if (customToken.token) {
        await signInWithCustomToken(auth, customToken.token)
      }
    } catch (error) {
      console.warn('Custom token creation failed, continuing without Firebase Auth:', error)
      // Firebase Admin이 설정되지 않은 경우에도 계속 진행
    }

    return { user: userData, isApproved: userData.isApproved }
  } catch (error) {
    console.error('Error signing in with Kakao:', error)
    throw error
  }
}

// 네이버 로그인
export async function signInWithNaver(accessToken: string, userInfo: any) {
  try {
    if (!db) {
      throw new Error('Firestore is not initialized. Please check your Firebase configuration.')
    }

    const providerId = userInfo.id
    const userData: Partial<User> = {
      name: userInfo.name || userInfo.email || '사용자',
      email: userInfo.email,
      profileImage: userInfo.profile_image,
      provider: 'naver',
      providerId,
      createdAt: new Date(),
    }

    const userRef = doc(db, USERS_COLLECTION, providerId)
    const userSnap = await getDoc(userRef)

    if (!userSnap.exists()) {
      const approvedRef = doc(db, APPROVED_USERS_COLLECTION, providerId)
      const approvedSnap = await getDoc(approvedRef)
      userData.isApproved = approvedSnap.exists()
      
      if (userData.isApproved) {
        userData.approvedAt = new Date()
      }
    } else {
      const existingData = userSnap.data()
      userData.isApproved = existingData.isApproved || false
      userData.approvedAt = existingData.approvedAt
    }

    await setDoc(userRef, userData, { merge: true })

    // Firebase Custom Token 생성
    // TODO: Firebase Admin SDK 설정 후 주석 해제
    try {
      const customToken = await fetch('/api/auth/custom-token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ provider: 'naver', providerId, userInfo }),
      }).then((res) => res.json())

      if (customToken.token) {
        await signInWithCustomToken(auth, customToken.token)
      }
    } catch (error) {
      console.warn('Custom token creation failed, continuing without Firebase Auth:', error)
      // Firebase Admin이 설정되지 않은 경우에도 계속 진행
    }

    return { user: userData, isApproved: userData.isApproved }
  } catch (error) {
    console.error('Error signing in with Naver:', error)
    throw error
  }
}

// 로그아웃
export async function signOut() {
  try {
    await firebaseSignOut(auth)
  } catch (error) {
    console.error('Error signing out:', error)
    throw error
  }
}

// 현재 사용자 정보 가져오기
export async function getCurrentUser(): Promise<User | null> {
  return new Promise((resolve) => {
    onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
      if (!firebaseUser) {
        resolve(null)
        return
      }

      try {
        // Firestore에서 사용자 정보 가져오기
        const userRef = doc(db, USERS_COLLECTION, firebaseUser.uid)
        const userSnap = await getDoc(userRef)
        
        if (userSnap.exists()) {
          const data = userSnap.data()
          resolve({
            id: userSnap.id,
            ...data,
            createdAt: data.createdAt.toDate(),
            approvedAt: data.approvedAt?.toDate(),
          } as User)
        } else {
          resolve(null)
        }
      } catch (error) {
        console.error('Error getting current user:', error)
        resolve(null)
      }
    })
  })
}

// 사용자 승인 여부 확인
export async function checkUserApproval(userId: string): Promise<boolean> {
  try {
    if (!db) {
      console.warn('Firestore is not initialized. Returning false for approval check.')
      return false
    }

    const userRef = doc(db, USERS_COLLECTION, userId)
    const userSnap = await getDoc(userRef)
    
    if (userSnap.exists()) {
      return userSnap.data().isApproved || false
    }
    return false
  } catch (error) {
    console.error('Error checking user approval:', error)
    return false
  }
}

