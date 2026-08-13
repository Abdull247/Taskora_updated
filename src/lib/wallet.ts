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

export function transactionDirection(type: WalletTransaction['type']): TransactionDirection {
  switch (type) {
    case 'deposit':
    case 'task_earning':
    case 'refund':
      return 'credit'
    case 'withdrawal':
    case 'task_payment':
    case 'fee':
      return 'debit'
    default:
      return 'credit'
  }
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
    default:
      return 'Transaction'
  }
}

export function transactionSubtitle(tx: WalletTransaction): string {
  const source = tx.metadata?.source
  if (typeof source === 'string' && source) return source
  if (tx.reference) return tx.reference
  return tx.status === 'pending' ? 'Pending' : 'Completed'
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
