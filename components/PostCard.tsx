'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Post } from '@/types/post'
import { formatDistanceToNow } from 'date-fns'
import { ko } from 'date-fns/locale/ko'

interface PostCardProps {
  post: Post
}

export default function PostCard({ post }: PostCardProps) {
  const timeAgo = formatDistanceToNow(post.createdAt, {
    addSuffix: true,
    locale: ko,
  })

  return (
    <Link href={`/post/${post.id}`}>
      <article className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
        <div className="aspect-square relative bg-gray-100">
          <Image
            src={post.imageUrl}
            alt={post.caption || '게시물 이미지'}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
        <div className="p-4">
          <p className="text-sm text-gray-800 line-clamp-2 mb-2">
            {post.caption}
          </p>
          <time className="text-xs text-gray-500">{timeAgo}</time>
        </div>
      </article>
    </Link>
  )
}

