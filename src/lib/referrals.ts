import { authFetch } from './api'
import type { ReferralsResponse, ReferralSummary } from '../types/api'

export function getReferrals() {
  return authFetch<ReferralsResponse>('/referrals', { method: 'GET' })
}

export function getReferralSummary() {
  return authFetch<ReferralSummary>('/referrals/summary', { method: 'GET' })
}
