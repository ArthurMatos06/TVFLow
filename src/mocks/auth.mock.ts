import type { User } from '@/types'

export interface MockUser extends User {
  password: string
}

export const MOCK_TOKEN = 'tvflow-mock-token-2026'

export const MOCK_USERS: MockUser[] = [
  {
    id: 'user-1',
    name: 'Ana Souza',
    username: 'anasouza',
      email: 'ana@tvflow.com',
    password: '123456',
    avatarUrl: null,
    bio: 'Apaixonada por cinema e séries.',
    createdAt: '2025-01-15T10:00:00.000Z',
    updatedAt: '2025-06-20T14:30:00.000Z',
  },
  {
    id: 'user-2',
    name: 'Bruno Lima',
    username: 'brunolima',
    email: 'bruno@tvflow.com',
    password: '123456',
    avatarUrl: null,
    bio: 'Colecionador de filmes de ficção científica.',
    createdAt: '2025-03-02T09:15:00.000Z',
    updatedAt: '2025-08-11T18:45:00.000Z',
  },
]
