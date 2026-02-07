import { collection, getDocs, doc, setDoc, deleteDoc, getDoc } from 'firebase/firestore'
import { db } from './firebase'

const APPROVED_USERS_COLLECTION = 'approvedUsers'

// 허가된 사용자 목록 가져오기
export async function getApprovedUsers() {
  try {
    if (!db) {
      console.warn('Firestore is not initialized. Returning empty array.')
      return []
    }
    const querySnapshot = await getDocs(collection(db, APPROVED_USERS_COLLECTION))
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }))
  } catch (error) {
    console.error('Error getting approved users:', error)
    throw error
  }
}

// 사용자 승인
export async function approveUser(providerId: string, approvedBy: string) {
  try {
    if (!db) {
      throw new Error('Firestore is not initialized.')
    }
    const approvedRef = doc(db, APPROVED_USERS_COLLECTION, providerId)
    await setDoc(approvedRef, {
      providerId,
      approvedBy,
      approvedAt: new Date(),
    })
  } catch (error) {
    console.error('Error approving user:', error)
    throw error
  }
}

// 사용자 승인 취소
export async function revokeUserApproval(providerId: string) {
  try {
    if (!db) {
      throw new Error('Firestore is not initialized.')
    }
    const approvedRef = doc(db, APPROVED_USERS_COLLECTION, providerId)
    await deleteDoc(approvedRef)
  } catch (error) {
    console.error('Error revoking user approval:', error)
    throw error
  }
}

// 사용자가 승인되었는지 확인
export async function isUserApproved(providerId: string): Promise<boolean> {
  try {
    if (!db) {
      console.warn('Firestore is not initialized. Returning false.')
      return false
    }
    const approvedRef = doc(db, APPROVED_USERS_COLLECTION, providerId)
    const approvedSnap = await getDoc(approvedRef)
    return approvedSnap.exists()
  } catch (error) {
    console.error('Error checking user approval:', error)
    return false
  }
}

