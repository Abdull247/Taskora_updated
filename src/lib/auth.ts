import { apiRequest } from './api'
import type { LoginPayload, LoginResponse } from '../types/api'

export function login(payload: LoginPayload) {
  return apiRequest<LoginResponse>('/auth/login', {
    method: 'POST',
    body: payload,
  })
}
