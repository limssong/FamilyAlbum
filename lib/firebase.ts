import { initializeApp, getApps, FirebaseApp } from 'firebase/app'
import { getAuth, Auth } from 'firebase/auth'
import { getFirestore, Firestore } from 'firebase/firestore'
import { getStorage, FirebaseStorage } from 'firebase/storage'

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

// Initialize Firebase
let app: FirebaseApp | null = null
try {
  if (getApps().length === 0) {
    // 환경 변수가 모두 설정되어 있는지 확인
    if (firebaseConfig.apiKey && firebaseConfig.projectId) {
      app = initializeApp(firebaseConfig)
    } else {
      console.warn('Firebase configuration is incomplete. Please set environment variables.')
    }
  } else {
    app = getApps()[0]
  }
} catch (error) {
  console.error('Firebase initialization error:', error)
}

// Initialize Firebase services (에러 핸들링 추가)
let auth: Auth | null = null
let db: Firestore | null = null
let storage: FirebaseStorage | null = null

if (app) {
  try {
    auth = getAuth(app)
    db = getFirestore(app)
    storage = getStorage(app)
  } catch (error) {
    console.error('Firebase services initialization error:', error)
  }
}

export { auth, db, storage }

export default app

