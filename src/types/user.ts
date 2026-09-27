export interface User {
  id: string
  name: string
  username: string
  email: string
  avatarUrl: string | null
  bio: string | null
  createdAt: string
  updatedAt: string
}

export interface Rating {
  id: string
  userId: string
  mediaId: number
  mediaType: 'movie' | 'tv'
  score: number
  createdAt: string
}

export interface Favorite {
  id: string
  userId: string
  mediaId: number
  mediaType: 'movie' | 'tv'
  createdAt: string
}
