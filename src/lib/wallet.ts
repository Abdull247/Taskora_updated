import { authFetch } from './api'
import { cachedGet } from './cache'
import type { WalletResponse, WalletTransactionsResponse, WalletTransaction } from '../types/api'

export function getWallet() {
  return cachedGet('wallet', () => authFetch<WalletResponse>('/wallet', { method: 'GET' }))
}

export function getWalletTransactions(limit = 20, offset = 0) {
  return cachedGet(`wallet-transactions:${limit}:${offset}`, () =>
    authFetch<WalletTransactionsResponse>(
      `/wallet/transactions?limit=${limit}&offset=${offset}`,
      { method: 'GET' }
    )
  )
}

export type TransactionDirection = 'credit' | 'debit'

// Purely a function of type — direction the money would move if this
// transaction is completed. Does NOT tell you whether it has settled yet;
// use transactionDisplayState for that.
export function transactionDirection(type: WalletTransaction['type']): TransactionDirection {
  switch (type) {
    case 'deposit':
    case 'task_earning':
    case 'refund':
    case 'referral_bonus':
      return 'credit'
    case 'withdrawal':
    case 'task_payment':
    case 'fee':
      return 'debit'
    default:
      return 'credit'
  }
}

export type TransactionDisplayState = 'credit' | 'debit' | 'pending' | 'failed'

// This is the one that should drive rendering. A deposit that's still
// 'pending' (e.g. the user hasn't finished paying on Paystack yet, or the
// webhook hasn't confirmed it) must NOT show as a green completed credit —
// that's what caused the wallet history to display unpaid deposits as if
// the money had already landed. 'failed' transactions get their own state
// too so they don't render as either a credit or a debit.
export function transactionDisplayState(tx: WalletTransaction): TransactionDisplayState {
  if (tx.status === 'pending') return 'pending'
  if (tx.status === 'failed' || tx.status === 'reversed') return 'failed'
  return transactionDirection(tx.type)
}

export function transactionLabel(type: WalletTransaction['type']): string {
  switch (type) {
    case 'deposit':
      return 'Wallet Top-up'
    case 'withdrawal':
      return 'Withdrawal'
    case 'task_payment':
      return 'Task Payment'
    case 'task_earning':
      return 'Task Reward'
    case 'refund':
      return 'Refund'
    case 'fee':
      return 'Platform Fee'
    case 'referral_bonus':
      return 'Referral Bonus'
    default:
      return 'Transaction'
  }
}

export function transactionSubtitle(tx: WalletTransaction): string {
  if (tx.status === 'pending') return 'Pending confirmation'
  if (tx.status === 'failed') return 'Failed'
  if (tx.status === 'reversed') return 'Reversed'
  const source = tx.metadata?.source
  if (typeof source === 'string' && source) return source
  if (tx.reference) return tx.reference
  return 'Completed'
}

export function transactionWhen(iso: string): string {
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return '—'
  const now = new Date()
  const sameDay = date.toDateString() === now.toDateString()
  if (sameDay) {
    return `Today, ${date.toLocaleTimeString('en-GB', { hour: 'numeric', minute: '2-digit' })}`
  }
  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: now.getFullYear() !== date.getFullYear() ? 'numeric' : undefined,
  })
}

export function formatNairaFromKobo(kobo: number | string) {
  const value = Number(kobo)
  const naira = value / 100
  return `₦${naira.toLocaleString('en-NG', {
    minimumFractionDigits: naira % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  })}`
}
