import { clearStoredRole } from './me'

export function isAuthenticated(): boolean {
  return Boolean(localStorage.getItem('accessToken'))
}

export function logout(): void {
  localStorage.removeItem('accessToken')
  localStorage.removeItem('refreshToken')
  clearStoredRole()
}
