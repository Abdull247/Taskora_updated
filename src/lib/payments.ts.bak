import { authFetch } from './api'
import { cacheDelete } from './cache'
import type { InitializePaymentPayload, InitializePaymentResponse } from '../types/api'

export function initializeDeposit(payload: InitializePaymentPayload) {
  return authFetch<InitializePaymentResponse>('/payments/initialize', {
    method: 'POST',
    body: payload,
  }).then((res) => {
    // Balance may change once payment settles — drop cached wallet data
    // so the next wallet view refetches instead of showing a stale figure.
    cacheDelete('wallet')
    return res
  })
}
