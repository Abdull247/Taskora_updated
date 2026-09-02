import { apiRequest, authFetch } from './api'
import type { WaitlistPayload, WaitlistResponse, WaitlistRewardPayload, WaitlistRewardResponse } from '../types/api'

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

export function redeemAccessCode(payload: WaitlistRewardPayload) {
  return authFetch<WaitlistRewardResponse>('/waitlist/reward', {
    method: 'POST',
    body: payload,
  })
}

