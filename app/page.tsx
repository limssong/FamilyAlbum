'use client'

import { useEffect, useState } from 'react'
import AuthGuard from '@/components/AuthGuard'
import Header from '@/components/Header'
import PostCard from '@/components/PostCard'
import { getAllPosts } from '@/lib/posts'
import { samplePosts } from '@/lib/samplePosts'
import { Post } from '@/types/post'

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchPosts() {
      try {
        const fetchedPosts = await getAllPosts()
        // Firebase에서 게시물을 가져오지 못한 경우 샘플 게시물 표시
        if (fetchedPosts.length > 0) {
          setPosts(fetchedPosts)
        } else {
          // 샘플 게시물 표시
          setPosts(samplePosts)
        }
      } catch (error) {
        console.error('Failed to fetch posts:', error)
        // 에러 발생 시에도 샘플 게시물 표시
        setPosts(samplePosts)
      } finally {
        setLoading(false)
      }
    }

    fetchPosts()
  }, [])

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-5xl mx-auto px-4 py-8">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="text-gray-500">로딩 중...</div>
          </div>
        ) : (
          <>
            {posts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {posts.map((post) => (
                  <PostCard key={post.id} post={post} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <p className="text-gray-500 text-lg mb-4">아직 게시물이 없습니다</p>
                <a
                  href="/create"
                  className="inline-block px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  첫 게시물 작성하기
                </a>
              </div>
            )}
          </>
        )}
        </main>
      </div>
    </AuthGuard>
  )
}
