import { MOCK_TOKEN, MOCK_USERS, type MockUser } from '@/mocks/auth.mock'
import type { User } from '@/types'
import type { AuthResponse, LoginCredentials, RegisterData } from '@/types/auth'

const delay = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms))

function toPublicUser(user: MockUser): User {
  const { password: _password, ...publicUser } = user
  return publicUser
}

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    await delay(800)

    const user = MOCK_USERS.find(
      (u) =>
        u.email.toLowerCase() === credentials.email.trim().toLowerCase() &&
        u.password === credentials.password,
    )

    if (!user) {
      throw new Error('Email ou senha inválidos.')
    }

    return { user: toPublicUser(user), token: MOCK_TOKEN }
  },

  async register(data: RegisterData): Promise<AuthResponse> {
    await delay(1000)

    const email = data.email.trim().toLowerCase()

    if (MOCK_USERS.some((u) => u.email.toLowerCase() === email)) {
      throw new Error('Já existe uma conta com este email.')
    }

    const now = new Date().toISOString()
    const usernameBase = email.split('@')[0].replace(/[^a-z0-9_]/g, '') || 'usuario'
    let username = usernameBase
    let suffix = 1
    while (MOCK_USERS.some((u) => u.username === username)) {
      username = `${usernameBase}${suffix}`
      suffix += 1
    }

    const newUser: MockUser = {
      id: `user-${Date.now()}`,
      name: data.name.trim(),
      username,
      email,
      password: data.password,
      avatarUrl: null,
      bio: null,
      createdAt: now,
      updatedAt: now,
    }

    MOCK_USERS.push(newUser)

    return { user: toPublicUser(newUser), token: MOCK_TOKEN }
  },
}
