import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  HiOutlineBanknotes,
  HiArrowUpRight,
  HiArrowDownRight,
  HiCheckCircle,
} from 'react-icons/hi2'
import { PiBankBold } from 'react-icons/pi'
import DashboardTopbar from '../../components/DashboardTopbar/DashboardTopbar'
import BottomNav from '../../components/BottomNav/BottomNav'
import { SEO } from '../../components/SEO/SEO'
import { getWallet, getWalletTransactions, transactionDirection, transactionLabel, transactionSubtitle, transactionWhen, formatNairaFromKobo } from '../../lib/wallet'
import { getMe } from '../../lib/me'
import { ApiRequestError } from '../../lib/api'
import { isWorkerStats, type WalletTransaction } from '../../types/api'
import './WalletPage.css'

function WalletPage() {
  const navigate = useNavigate()

  const [balanceKobo, setBalanceKobo] = useState<string | null>(null)
  const [role, setRole] = useState<'worker' | 'advertiser' | null>(null)
  const [pendingCount, setPendingCount] = useState<number>(0)
  const [totalEarnedKobo, setTotalEarnedKobo] = useState<number | null>(null)
  const [transactions, setTransactions] = useState<WalletTransaction[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(() => {
    let cancelled = false
    setLoading(true)
    setError(null)

    Promise.all([getWallet(), getWalletTransactions(20, 0), getMe()])
      .then(([walletRes, txRes, meRes]) => {
        if (cancelled) return
        setBalanceKobo(walletRes.wallet.balance)
        setTransactions(txRes.transactions)
        setPendingCount(meRes.user.stats.pendingApprovals)
        setRole(meRes.user.role)
        if (isWorkerStats(meRes.user.stats)) {
          setTotalEarnedKobo(meRes.user.stats.earningsThisMonthKobo)
        } else {
          setTotalEarnedKobo(null)
        }
      })
      .catch((err) => {
        if (cancelled) return
        if (err instanceof ApiRequestError && err.status === 401) {
          navigate('/login', { replace: true })
          return
        }
        setError('Could not load your wallet. Please try again.')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [navigate])

  useEffect(() => {
    const cancel = load()
    return cancel
  }, [load])

  return (
    <div className="wallet-page">
      <SEO title="Wallet | TaskBridge" description="Manage your tasks and earnings." noindex />
      <DashboardTopbar initials="··" hasNotifications />

      <main className="wallet-main">
        <div className="wallet-heading">
          <h1>Wallet</h1>
        </div>

        {error ? (
          <div className="wallet-error">
            <p>{error}</p>
            <button type="button" className="btn btn-primary btn-block" onClick={load}>
              Try again
            </button>
          </div>
        ) : (
          <>
            {/* Available balance card */}
            <div className="wallet-balance-card">
              <span className="wallet-balance-label">Available Balance</span>
              <div className="wallet-balance-value">
                {loading ? '—' : formatNairaFromKobo(balanceKobo ?? 0)}
              </div>
              <span className="wallet-balance-sub">Ready to withdraw</span>

              {role === 'advertiser' ? (
                <button
                  type="button"
                  className="btn btn-primary btn-block wallet-withdraw-btn"
                  disabled={loading}
                  onClick={() => navigate('/dashboard/wallet/deposit')}
                >
                  Deposit Funds
                </button>
              ) : (
                <button type="button" className="btn btn-primary btn-block wallet-withdraw-btn" disabled={loading}>
                  Withdraw Funds
                </button>
              )}
            </div>

            {/* Pending / Total earned */}
            <div className="wallet-stats-row">
              <div className="wallet-stat-card">
                <span className="wallet-stat-label">Pending</span>
                <div className="wallet-stat-value wallet-stat-value-pending">
                  {loading ? '—' : `${pendingCount} task${pendingCount === 1 ? '' : 's'}`}
                </div>
                <span className="wallet-stat-sub">Awaiting approval</span>
              </div>

              <div className="wallet-stat-card">
                <span className="wallet-stat-label">Earned (this month)</span>
                <div className="wallet-stat-value wallet-stat-value-earned">
                  {loading ? '—' : formatNairaFromKobo(totalEarnedKobo ?? 0)}
                </div>
                <span className="wallet-stat-sub">Worker earnings</span>
              </div>
            </div>

            {/* Bank account card */}
            <div className="wallet-bank-card">
              <span className="wallet-bank-icon">
                <PiBankBold />
              </span>

              <div className="wallet-bank-info">
                <span className="wallet-bank-name">No bank account linked</span>
                <span className="wallet-bank-meta">Withdrawals need a saved account</span>
              </div>

              <span className="wallet-bank-verified">
                <HiCheckCircle /> Verified
              </span>
            </div>

            {/* Recent transactions */}
            <div className="wallet-section">
              <div className="wallet-section-header">
                <span className="wallet-section-label">Recent Transactions</span>
                <button type="button" className="wallet-section-link">
                  See all
                </button>
              </div>

              {loading ? (
                <p className="wallet-inline-status">Loading transactions…</p>
              ) : transactions.length === 0 ? (
                <p className="wallet-inline-status">No transactions yet.</p>
              ) : (
                <div className="earnings-list">
                  {transactions.map((item) => {
                    const direction = transactionDirection(item.type)
                    const amountKobo = Number(item.amount)
                    const sign = direction === 'credit' ? '+' : '-'
                    return (
                      <div key={item.id} className="earnings-row">
                        <span
                          className={`earnings-icon ${
                            direction === 'credit' ? 'earnings-icon-credit' : 'earnings-icon-debit'
                          }`}
                        >
                          {direction === 'credit' ? <HiArrowUpRight /> : <HiArrowDownRight />}
                        </span>

                        <div className="earnings-info">
                          <span className="earnings-title">{transactionLabel(item.type)}</span>
                          <span className="earnings-subtitle">{transactionSubtitle(item)}</span>
                        </div>

                        <div className="earnings-amount-wrap">
                          <span
                            className={`earnings-amount ${
                              direction === 'credit' ? 'earnings-amount-credit' : 'earnings-amount-debit'
                            }`}
                          >
                            {sign}
                            {formatNairaFromKobo(amountKobo)}
                          </span>
                          <span className="earnings-when">{transactionWhen(item.created_at)}</span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </>
        )}
      </main>

      <BottomNav />
    </div>
  )
}

export default WalletPage
