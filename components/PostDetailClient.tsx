'use client'

import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { getPostById, updatePost, deletePost } from '@/lib/posts'
import { samplePosts } from '@/lib/samplePosts'
import { Post } from '@/types/post'
import { formatDistanceToNow } from 'date-fns'
import { ko } from 'date-fns/locale/ko'

interface PostDetailClientProps {
  postId: string
  initialPost?: Post | null
}

export default function PostDetailClient({ postId, initialPost }: PostDetailClientProps) {
  const router = useRouter()
  const [post, setPost] = useState<Post | null>(initialPost || null)
  const [loading, setLoading] = useState(!initialPost)
  const [isEditing, setIsEditing] = useState(false)
  const [caption, setCaption] = useState(initialPost?.caption || '')
  const [newImage, setNewImage] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (initialPost) {
      setPost(initialPost)
      setCaption(initialPost.caption)
      setLoading(false)
      return
    }

    async function fetchPost() {
      try {
        // 샘플 게시물인지 확인
        const samplePost = samplePosts.find((p) => p.id === postId)
        if (samplePost) {
          setPost(samplePost)
          setCaption(samplePost.caption)
          setLoading(false)
          return
        }

        // Firebase에서 게시물 가져오기
        const fetchedPost = await getPostById(postId)
        if (fetchedPost) {
          setPost(fetchedPost)
          setCaption(fetchedPost.caption)
        } else {
          router.push('/')
        }
      } catch (error) {
        console.error('Failed to fetch post:', error)
        // 에러 발생 시 샘플 게시물 확인
        const samplePost = samplePosts.find((p) => p.id === postId)
        if (samplePost) {
          setPost(samplePost)
          setCaption(samplePost.caption)
        } else {
          router.push('/')
        }
      } finally {
        setLoading(false)
      }
    }

    if (postId) {
      fetchPost()
    }
  }, [postId, router, initialPost])

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setNewImage(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleUpdate = async () => {
    if (!post) return

    setSaving(true)
    try {
      await updatePost(post.id, caption, newImage || undefined)
      const updatedPost = await getPostById(post.id)
      if (updatedPost) {
        setPost(updatedPost)
        setCaption(updatedPost.caption)
        setIsEditing(false)
        setNewImage(null)
        setPreview(null)
      }
    } catch (error) {
      console.error('Failed to update post:', error)
      alert('게시물 수정에 실패했습니다')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!post) return
    
    if (!confirm('정말 이 게시물을 삭제하시겠습니까?')) {
      return
    }

    setDeleting(true)
    try {
      await deletePost(post.id)
      router.push('/')
    } catch (error) {
      console.error('Failed to delete post:', error)
      alert('게시물 삭제에 실패했습니다')
      setDeleting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-500">로딩 중...</div>
      </div>
    )
  }

  if (!post) {
    return null
  }

  const timeAgo = formatDistanceToNow(post.createdAt, {
    addSuffix: true,
    locale: ko,
  })

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      {/* 이미지 */}
      <div className="aspect-square relative bg-gray-100">
        {preview ? (
          <Image
            src={preview}
            alt={caption || '게시물 이미지'}
            fill
            className="object-cover"
          />
        ) : (
          <Image
            src={post.imageUrl}
            alt={post.caption || '게시물 이미지'}
            fill
            className="object-cover"
          />
        )}
      </div>

      {/* 내용 */}
      <div className="p-6">
        {isEditing ? (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                이미지 변경 (선택사항)
              </label>
              {preview ? (
                <div className="relative aspect-video mb-4 rounded-lg overflow-hidden border border-gray-200">
                  <Image
                    src={preview}
                    alt="새 이미지 미리보기"
                    fill
                    className="object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setNewImage(null)
                      setPreview(null)
                      if (fileInputRef.current) {
                        fileInputRef.current.value = ''
                      }
                    }}
                    className="absolute top-2 right-2 bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
                  >
                    취소
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50"
                >
                  새 이미지 선택
                </button>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                설명
              </label>
              <textarea
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                rows={6}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-[#000]"
              />
            </div>
            <div className="flex gap-4">
              <button
                onClick={() => {
                  setIsEditing(false)
                  setCaption(post.caption)
                  setNewImage(null)
                  setPreview(null)
                }}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                취소
              </button>
              <button
                onClick={handleUpdate}
                disabled={saving}
                className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
              >
                {saving ? '저장 중...' : '저장'}
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-start justify-between">
              <p className="text-gray-800 whitespace-pre-wrap">{post.caption}</p>
              {/* 샘플 게시물이 아닌 경우에만 수정/삭제 버튼 표시 */}
              {!post.id.startsWith('sample-') && (
                <div className="flex gap-2 ml-4">
                  <button
                    onClick={() => setIsEditing(true)}
                    className="px-4 py-2 text-sm text-blue-600 hover:text-blue-700 font-medium"
                  >
                    수정
                  </button>
                  <button
                    onClick={handleDelete}
                    disabled={deleting}
                    className="px-4 py-2 text-sm text-red-600 hover:text-red-700 font-medium disabled:opacity-50"
                  >
                    {deleting ? '삭제 중...' : '삭제'}
                  </button>
                </div>
              )}
            </div>
            <time className="text-sm text-gray-500 block">{timeAgo}</time>
            {post.id.startsWith('sample-') && (
              <p className="text-xs text-gray-400 italic">이 게시물은 샘플입니다.</p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

