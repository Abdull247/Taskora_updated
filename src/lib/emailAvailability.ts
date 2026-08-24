import { apiRequest } from './api'
import type { AvailabilityPayload, AvailabilityResponse } from '../types/api'

/**
 * POST /auth/checkAvailability — no auth required. Inline "is this taken?"
 * validation for the signup form; rate-limited to 5 req/min.
 *
 * Email is matched case-insensitively (trimmed server-side), but phone is
 * compared verbatim — send it exactly as it will be registered at /waitlist.
 */
export async function checkAvailability(payload: AvailabilityPayload): Promise<AvailabilityResponse> {
  const { email, phone } = payload

  if (!email?.trim() && !phone?.trim()) {
    throw new Error('No email or phone number provided')
  }

  const body: AvailabilityPayload = {}
  if (email?.trim()) body.email = email.trim()
  if (phone?.trim()) body.phone = phone

  return apiRequest<AvailabilityResponse>('/auth/checkAvailability', {
    method: 'POST',
    body,
  })
}
