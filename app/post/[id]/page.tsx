import { samplePosts } from '@/lib/samplePosts'
import AuthGuard from '@/components/AuthGuard'
import Header from '@/components/Header'
import PostDetailClient from '@/components/PostDetailClient'

// 정적 내보내기를 위한 generateStaticParams
export function generateStaticParams() {
  // 샘플 게시물 ID 반환
  return samplePosts.map((post) => ({
    id: post.id,
  }))
}

interface PageProps {
  params: {
    id: string
  }
}

export default function PostDetail({ params }: PageProps) {
  const { id } = params
  // 샘플 게시물인지 확인
  const initialPost = samplePosts.find((p) => p.id === id) || null

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-4xl mx-auto px-4 py-8">
          <PostDetailClient postId={id} initialPost={initialPost} />
        </main>
      </div>
    </AuthGuard>
  )
}

