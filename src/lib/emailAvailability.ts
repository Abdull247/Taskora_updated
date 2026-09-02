import { apiRequest } from './api'
import type { AvailabilityPayload, AvailabilityResponse } from '../types/api'

/**
 * POST /auth/checkAvailability — no auth required. Inline "is this taken?"
 * validation for the signup form; rate-limited to 5 req/min.
 *
 * Email is matched case-insensitively (trimmed server-side), but phone is
 * compared verbatim — send it exactly as it will be registered at /waitlist.
 * Referral codes are validated for existence only — true means the code
 * exists, false means it does not.
 */
export async function checkAvailability(payload: AvailabilityPayload): Promise<AvailabilityResponse> {
  const { email, phone, referralCode } = payload

  if (!email?.trim() && !phone?.trim() && !referralCode?.trim()) {
    throw new Error('No email, phone number, or referral code provided')
  }

  const body: AvailabilityPayload = {}
  if (email?.trim()) body.email = email.trim()
  if (phone?.trim()) body.phone = phone
  if (referralCode?.trim()) body.referralCode = referralCode.trim()

  return apiRequest<AvailabilityResponse>('/auth/checkAvailability', {
    method: 'POST',
    body,
  })
}
