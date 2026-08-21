import { apiRequest } from './api'
import type {
  LoginPayload,
  LoginResponse,
  RequestPasswordResetPayload,
  RequestPasswordResetResponse,
  VerifyResetTokenPayload,
  VerifyResetTokenResponse,
  ConfirmPasswordResetPayload,
  ConfirmPasswordResetResponse,
} from '../types/api'

export function login(payload: LoginPayload) {
  return apiRequest<LoginResponse>('/auth/login', {
    method: 'POST',
    body: payload,
  })
}

/**
 * Step 1 of the reset flow. No auth required — same as /auth/login.
 * Backend returns a distinct 404 for unregistered emails (not masked).
 */
export function requestPasswordReset(payload: RequestPasswordResetPayload) {
  return apiRequest<RequestPasswordResetResponse>('/auth/resetpassword', {
    method: 'POST',
    body: payload,
  })
}

/**
 * Step 2 (optional, read-only). Checks token validity without consuming it —
 * used to gate the "set new password" form when the user lands from the email link.
 */
export function verifyResetToken(payload: VerifyResetTokenPayload) {
  return apiRequest<VerifyResetTokenResponse>('/auth/resetpassword/verify', {
    method: 'POST',
    body: payload,
  })
}

/**
 * Step 3. Submits the token + new password. On success all of the user's
 * existing refresh tokens are revoked server-side.
 */
export function confirmPasswordReset(payload: ConfirmPasswordResetPayload) {
  return apiRequest<ConfirmPasswordResetResponse>('/auth/resetpassword/confirm', {
    method: 'POST',
    body: payload,
  })
}
