import { apiRequest } from './api'
import type { WaitlistPayload, WaitlistResponse } from '../types/api'

export function joinWaitlist(payload: WaitlistPayload) {
  const body: WaitlistPayload = {
    ...payload,
    referredByCode: payload.referredByCode?.trim() || undefined,
  }

  return apiRequest<WaitlistResponse>('/waitlist', {
    method: 'POST',
    body,
  })
}
