import { 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  getDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  orderBy,
  Timestamp 
} from 'firebase/firestore'
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage'
import { db, storage } from './firebase'
import { Post } from '@/types/post'

const POSTS_COLLECTION = 'posts'

// 게시물 생성
export async function createPost(
  imageFile: File,
  caption: string,
  userId?: string
): Promise<string> {
  try {
    if (!storage || !db) {
      throw new Error('Firebase Storage or Firestore is not initialized. Please check your Firebase configuration.')
    }

    // 이미지 업로드
    const imageRef = ref(storage, `posts/${Date.now()}_${imageFile.name}`)
    await uploadBytes(imageRef, imageFile)
    const imageUrl = await getDownloadURL(imageRef)

    // Firestore에 게시물 저장
    const postData = {
      imageUrl,
      caption,
      userId: userId || null,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    }

    const docRef = await addDoc(collection(db, POSTS_COLLECTION), postData)
    return docRef.id
  } catch (error) {
    console.error('Error creating post:', error)
    throw error
  }
}

// 모든 게시물 가져오기
export async function getAllPosts(): Promise<Post[]> {
  try {
    if (!db) {
      console.warn('Firestore is not initialized. Returning empty array.')
      return []
    }

    const q = query(
      collection(db, POSTS_COLLECTION),
      orderBy('createdAt', 'desc')
    )
    const querySnapshot = await getDocs(q)
    
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt.toDate(),
      updatedAt: doc.data().updatedAt.toDate(),
    })) as Post[]
  } catch (error) {
    console.error('Error getting posts:', error)
    throw error
  }
}

// 특정 게시물 가져오기
export async function getPostById(postId: string): Promise<Post | null> {
  try {
    if (!db) {
      console.warn('Firestore is not initialized.')
      return null
    }

    const docRef = doc(db, POSTS_COLLECTION, postId)
    const docSnap = await getDoc(docRef)
    
    if (docSnap.exists()) {
      const data = docSnap.data()
      return {
        id: docSnap.id,
        ...data,
        createdAt: data.createdAt.toDate(),
        updatedAt: data.updatedAt.toDate(),
      } as Post
    }
    return null
  } catch (error) {
    console.error('Error getting post:', error)
    throw error
  }
}

// 게시물 수정
export async function updatePost(
  postId: string,
  caption: string,
  newImageFile?: File
): Promise<void> {
  try {
    if (!db) {
      throw new Error('Firestore is not initialized.')
    }

    const postRef = doc(db, POSTS_COLLECTION, postId)
    const updateData: any = {
      caption,
      updatedAt: Timestamp.now(),
    }

    // 새 이미지가 있으면 업로드
    if (newImageFile) {
      if (!storage) {
        throw new Error('Firebase Storage is not initialized.')
      }

      const post = await getPostById(postId)
      if (post?.imageUrl) {
        // 기존 이미지 삭제
        try {
          const oldImageRef = ref(storage, post.imageUrl)
          await deleteObject(oldImageRef)
        } catch (error) {
          console.error('Error deleting old image:', error)
        }
      }

      // 새 이미지 업로드
      const imageRef = ref(storage, `posts/${Date.now()}_${newImageFile.name}`)
      await uploadBytes(imageRef, newImageFile)
      const imageUrl = await getDownloadURL(imageRef)
      updateData.imageUrl = imageUrl
    }

    await updateDoc(postRef, updateData)
  } catch (error) {
    console.error('Error updating post:', error)
    throw error
  }
}

// 게시물 삭제
export async function deletePost(postId: string): Promise<void> {
  try {
    if (!db) {
      throw new Error('Firestore is not initialized.')
    }

    const post = await getPostById(postId)
    
    // 이미지 삭제
    if (post?.imageUrl && storage) {
      try {
        const imageRef = ref(storage, post.imageUrl)
        await deleteObject(imageRef)
      } catch (error) {
        console.error('Error deleting image:', error)
      }
    }

    // Firestore에서 게시물 삭제
    const postRef = doc(db, POSTS_COLLECTION, postId)
    await deleteDoc(postRef)
  } catch (error) {
    console.error('Error deleting post:', error)
    throw error
  }
}

