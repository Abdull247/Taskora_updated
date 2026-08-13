import { authFetch } from './api'
import { cachedGet, cacheDelete } from './cache'
import type { MeResponse, UserRole } from '../types/api'

const ROLE_KEY = 'taskbridge_role'

export function getStoredRole(): UserRole | null {
  const raw = localStorage.getItem(ROLE_KEY)
  return raw === 'worker' || raw === 'advertiser' ? raw : null
}

export function setStoredRole(role: UserRole | null): void {
  if (role) {
    localStorage.setItem(ROLE_KEY, role)
  } else {
    localStorage.removeItem(ROLE_KEY)
  }
}

export function clearStoredRole(): void {
  localStorage.removeItem(ROLE_KEY)
}

export async function getMe(): Promise<MeResponse> {
  try {
    const res = await cachedGet('me', () => authFetch<MeResponse>('/me', { method: 'GET' }))
    setStoredRole(res.user.role)
    return res
  } catch (err) {
    cacheDelete('me')
    throw err
  }
}

export async function refreshMe(): Promise<MeResponse> {
  cacheDelete('me')
  return getMe()
}
