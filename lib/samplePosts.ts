import { Post } from '@/types/post'

// 저작권 없는 풍경 이미지 (Unsplash)
export const samplePosts: Post[] = [
  {
    id: 'sample-1',
    imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80',
    caption: '아름다운 산 풍경을 만나다. 자연의 웅장함이 마음을 정화시켜주는 순간이었다.',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2일 전
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
  },
  {
    id: 'sample-2',
    imageUrl: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&q=80',
    caption: '일출을 보며 하루를 시작하는 것만큼 아름다운 일은 없다. 새벽의 고요함이 좋다.',
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5일 전
    updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
  },
  {
    id: 'sample-3',
    imageUrl: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&q=80',
    caption: '숲 속을 걷다 보면 모든 걱정이 사라진다. 자연이 주는 힐링의 순간들.',
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7일 전
    updatedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
  },
  {
    id: 'sample-4',
    imageUrl: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&q=80',
    caption: '바다를 보면 마음이 편안해진다. 파도 소리를 들으며 시간을 보내는 것도 좋은 추억이다.',
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // 10일 전
    updatedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
  },
]

