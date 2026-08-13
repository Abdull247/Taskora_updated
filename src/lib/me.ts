import { authFetch } from './api'
import type { MeResponse } from '../types/api'

export function getMe() {
  return authFetch<MeResponse>('/me', { method: 'GET' })
}
