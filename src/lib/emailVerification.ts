import { apiRequest } from './api'
import type {
  SendVerificationPayload,
  SendVerificationResponse,
  VerifyCodePayload,
  VerifyCodeResponse,
  ResendVerificationPayload,
  ResendVerificationResponse,
} from '../types/api'

const EMAIL_VERIFICATION_SERVICE_TOKEN = import.meta.env.VITE_EMAIL_VERIFICATION_SERVICE_TOKEN

if (!EMAIL_VERIFICATION_SERVICE_TOKEN) {
  console.warn(
    'VITE_EMAIL_VERIFICATION_SERVICE_TOKEN is not set. Add it to your .env file to enable email verification.'
  )
}

const serviceAuthHeaders = {
  Authorization: `Bearer ${EMAIL_VERIFICATION_SERVICE_TOKEN}`,
}

export function sendVerificationCode(payload: SendVerificationPayload) {
  return apiRequest<SendVerificationResponse>('/emailverification/send', {
    method: 'POST',
    headers: serviceAuthHeaders,
    body: payload,
  })
}

export function verifyEmailCode(payload: VerifyCodePayload) {
  return apiRequest<VerifyCodeResponse>('/emailverification/verify', {
    method: 'POST',
    headers: serviceAuthHeaders,
    body: payload,
  })
}

export function resendVerificationCode(payload: ResendVerificationPayload) {
  return apiRequest<ResendVerificationResponse>('/emailverification/resend', {
    method: 'POST',
    headers: serviceAuthHeaders,
    body: payload,
  })
}

