export interface User {
  id: string
  email?: string
  name: string
  profileImage?: string
  provider: 'kakao' | 'naver'
  providerId: string
  isApproved: boolean
  createdAt: Date
  approvedAt?: Date
  approvedBy?: string
}

export interface AuthUser {
  uid: string
  email?: string
  displayName?: string
  photoURL?: string
  provider: 'kakao' | 'naver'
}

