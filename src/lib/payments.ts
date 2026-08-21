import { authFetch } from './api'
import { cacheDelete, cacheDeletePrefix } from './cache'
import type {
  InitializePaymentPayload,
  InitializePaymentResponse,
  VerifyPaymentResponse,
} from '../types/api'

export function initializeDeposit(payload: InitializePaymentPayload) {
  return authFetch<InitializePaymentResponse>('/payments/initialize', {
    method: 'POST',
    body: payload,
  }).then((res) => {
    cacheDelete('wallet')
    return res
  })
}

// Ask the backend to check this reference against Paystack directly and
// resolve the pending row if it hasn't already. Call this when the user
// returns to the app after paying, instead of only waiting on the webhook —
// webhooks can be delayed or unreachable, and until they land the deposit
// correctly stays 'pending' rather than counting as a credit.
export function verifyDeposit(reference: string) {
  return authFetch<VerifyPaymentResponse>(
    `/payments/verify/${encodeURIComponent(reference)}`,
    { method: 'GET' }
  ).then((res) => {
    cacheDelete('wallet')
    cacheDeletePrefix('wallet-transactions:')
    return res
  })
}
