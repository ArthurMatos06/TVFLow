const TOKEN_KEY = 'tvflow_token'
const USER_KEY = 'tvflow_user'

export function clearAuthStorage(): void {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(USER_KEY)
}
