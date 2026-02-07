export interface Post {
  id: string
  imageUrl: string
  caption: string
  createdAt: Date
  updatedAt: Date
  userId?: string
}

export interface PostFormData {
  image: File | null
  caption: string
}

