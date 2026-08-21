import { useEffect, useState, useCallback } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  HiOutlineWallet,
  HiCheckCircle,
  HiArrowTrendingUp,
  HiOutlineMagnifyingGlass,
  HiOutlineUsers,
  HiOutlineShieldCheck,
  HiArrowUpRight,
  HiArrowDownRight,
  HiStar,
  HiOutlineMegaphone,
  HiOutlineClipboardDocumentCheck,
} from 'react-icons/hi2'
import DashboardTopbar from '../../components/DashboardTopbar/DashboardTopbar'
import BottomNav from '../../components/BottomNav/BottomNav'
import DashboardSkeleton from '../../components/DashboardSkeleton/DashboardSkeleton'
import { SEO } from '../../components/SEO/SEO'
import { getMe } from '../../lib/me'
import { getRecommendedTasks } from '../../lib/tasks'
import { getWalletTransactions, transactionDisplayState, transactionLabel, transactionSubtitle, transactionWhen, formatNairaFromKobo } from '../../lib/wallet'
import { ApiRequestError } from '../../lib/api'
import {
  isWorkerStats,
  isAdvertiserStats,
  type MeUser,
  type TaskListItem,
  type WalletTransaction,
} from '../../types/api'
import './DashboardPage.css'

function formatNaira(kobo: number) {
  const naira = kobo / 100
  return `₦${naira.toLocaleString('en-NG', { minimumFractionDigits: naira % 1 === 0 ? 0 : 2, maximumFractionDigits: 2 })}`
}

function formatNairaSigned(kobo: number) {
  const sign = kobo < 0 ? '-' : '+'
  return `${sign}${formatNaira(Math.abs(kobo))}`
}

function difficultyFromReward(rewardKobo: number): 'Easy' | 'Medium' | 'Hard' {
  const naira = rewardKobo / 100
  if (naira < 100) return 'Easy'
  if (naira < 300) return 'Medium'
  return 'Hard'
}

function difficultyClass(difficulty: 'Easy' | 'Medium' | 'Hard') {
  if (difficulty === 'Easy') return 'task-diff-easy'
  if (difficulty === 'Medium') return 'task-diff-medium'
  return 'task-diff-hard'
}

function categoryLabel(name: string) {
  return name
    .toLowerCase()
    .split('_')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')
}

function greetingForNow() {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 18) return 'Good afternoon'
  return 'Good evening'
}

function DashboardPage() {
  const navigate = useNavigate()

  const [user, setUser] = useState<MeUser | null>(null)
  const [meLoading, setMeLoading] = useState(true)
  const [meError, setMeError] = useState<string | null>(null)

  const [tasks, setTasks] = useState<TaskListItem[]>([])
  const [tasksLoading, setTasksLoading] = useState(false)
  const [tasksError, setTasksError] = useState<string | null>(null)

  const [transactions, setTransactions] = useState<WalletTransaction[]>([])
  const [transactionsLoading, setTransactionsLoading] = useState(false)
  const [transactionsError, setTransactionsError] = useState<string | null>(null)

  const loadMe = useCallback(async () => {
    setMeLoading(true)
    setMeError(null)
    try {
      const { user: me } = await getMe()
      setUser(me)
    } catch (err) {
      if (err instanceof ApiRequestError && err.status === 401) {
        navigate('/login', { replace: true })
        return
      }
      setMeError('Could not load your account. Pull down to try again.')
    } finally {
      setMeLoading(false)
    }
  }, [navigate])

  useEffect(() => {
    loadMe()
  }, [loadMe])

  useEffect(() => {
    if (!user || user.role !== 'worker') return

    let cancelled = false
    setTasksLoading(true)
    setTasksError(null)

    getRecommendedTasks(6)
      .then(({ tasks: recommended }) => {
        if (!cancelled) setTasks(recommended)
      })
      .catch(() => {
        if (!cancelled) setTasksError('Could not load recommended tasks.')
      })
      .finally(() => {
        if (!cancelled) setTasksLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [user])

  useEffect(() => {
    if (!user) return

    let cancelled = false
    setTransactionsLoading(true)
    setTransactionsError(null)

    getWalletTransactions(5, 0)
      .then(({ transactions: fetched }) => {
        if (!cancelled) setTransactions(fetched)
      })
      .catch((err) => {
        if (cancelled) return
        if (err instanceof ApiRequestError && err.status === 401) {
          navigate('/login', { replace: true })
          return
        }
        setTransactionsError('Could not load transactions.')
      })
      .finally(() => {
        if (!cancelled) setTransactionsLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [user, navigate])

  const isAdvertiser = user?.role === 'advertiser'
  const balanceCardActionLabel = isAdvertiser ? 'Deposit' : 'Withdraw'

  // Show skeleton only on initial load, not on background retries
  if (meLoading) {
    return (
      <div className="dashboard-page">
        <DashboardTopbar hasNotifications={false} />
        <DashboardSkeleton />
        <BottomNav />
      </div>
    )
  }

  return (
    <div className="dashboard-page">
      <SEO title="Dashboard | TaskBridge" description="Manage your tasks and earnings." noindex />
      <DashboardTopbar hasNotifications />

      <main className="dashboard-main">
        {/* Greeting */}
        <div className="dash-greeting">
          <h1>
            {greetingForNow()}, {user ? user.firstName : '…'} <span className="dash-wave">👋</span>
          </h1>
          {user && (
            <p>
              {isAdvertiser
                ? `${user.stats.pendingApprovals} submission${user.stats.pendingApprovals === 1 ? '' : 's'} awaiting your review`
                : `You have ${user.stats.pendingApprovals} pending approval${user.stats.pendingApprovals === 1 ? '' : 's'}`}
            </p>
          )}
        </div>

        {meError && (
          <div className="dash-error-banner">
            <p>{meError}</p>
            <button type="button" onClick={loadMe}>Retry</button>
          </div>
        )}

        {/* Balance card */}
        <div className="balance-card">
          <div className="balance-card-top">
            <div>
              <span className="balance-label">Total Balance</span>
              <div className="balance-value">
                {user ? formatNaira(Number(user.wallet.balanceKobo)) : '₦0.00'}
              </div>
              {user && (
                <span className="balance-pending">
                  {isAdvertiser
                    ? `${user.stats.pendingApprovals} pending approval${user.stats.pendingApprovals === 1 ? '' : 's'}`
                    : `${user.stats.pendingApprovals} task${user.stats.pendingApprovals === 1 ? '' : 's'} awaiting approval`}
                </span>
              )}
            </div>
            <div className="balance-icon">
              <HiOutlineWallet />
            </div>
          </div>

          <div className="balance-actions">
            <Link to="/dashboard/wallet" className="btn-balance btn-balance-tint">
              View Wallet
            </Link>
            <Link
              to={isAdvertiser ? '/dashboard/wallet/deposit' : '/dashboard/wallet'}
              className="btn-balance btn-balance-primary"
            >
              {balanceCardActionLabel}
            </Link>
          </div>
        </div>

        {/* Stats row */}
        {user && (
          <div className="stats-row">
            <div className="stat-card">
              <div className="stat-card-top">
                <span className="stat-card-label">Tasks Completed</span>
                <span className="stat-card-icon"><HiCheckCircle /></span>
              </div>
              <div className="stat-card-value">{user.stats.completedTasks}</div>
              <span className="stat-card-delta stat-card-delta-up">
                +{user.stats.completedThisWeek} this week
              </span>
            </div>

            {isWorkerStats(user.stats) && (
              <div className="stat-card">
                <div className="stat-card-top">
                  <span className="stat-card-label">Earnings (this month)</span>
                  <span className="stat-card-icon"><HiArrowTrendingUp /></span>
                </div>
                <div className="stat-card-value">{formatNaira(user.stats.earningsThisMonthKobo)}</div>
                <span className={`stat-card-delta ${user.stats.earningsDeltaKobo >= 0 ? 'stat-card-delta-up' : 'stat-card-delta-down'}`}>
                  {formatNairaSigned(user.stats.earningsDeltaKobo)} vs last month
                </span>
              </div>
            )}

            {isAdvertiserStats(user.stats) && (
              <div className="stat-card">
                <div className="stat-card-top">
                  <span className="stat-card-label">Spent (this month)</span>
                  <span className="stat-card-icon"><HiArrowTrendingUp /></span>
                </div>
                <div className="stat-card-value">{formatNaira(user.stats.spentThisMonthKobo)}</div>
                <span className={`stat-card-delta ${user.stats.spentDeltaKobo <= 0 ? 'stat-card-delta-up' : 'stat-card-delta-down'}`}>
                  {formatNairaSigned(user.stats.spentDeltaKobo)} vs last month
                </span>
              </div>
            )}
          </div>
        )}

        {/* Quick actions */}
        <div className="dash-section">
          <span className="dash-section-label">Quick Actions</span>

          <div className="quick-actions-grid">
            <Link to="/dashboard/tasks" className="quick-action-card">
              <span className="quick-action-icon"><HiOutlineMagnifyingGlass /></span>
              <span className="quick-action-label">Browse Tasks</span>
            </Link>
            <Link to="/dashboard/wallet" className="quick-action-card">
              <span className="quick-action-icon"><HiOutlineWallet /></span>
              <span className="quick-action-label">My Wallet</span>
            </Link>
            <Link to="/dashboard/referral" className="quick-action-card">
              <span className="quick-action-icon"><HiOutlineUsers /></span>
              <span className="quick-action-label">Referral</span>
            </Link>
            <Link to="/dashboard/verify" className="quick-action-card">
              <span className="quick-action-icon"><HiOutlineShieldCheck /></span>
              <span className="quick-action-label">Verify ID</span>
            </Link>
          </div>
        </div>

        {/* Recommended tasks — worker only (backend /recommended is worker-only) */}
        {!isAdvertiser && (
          <div className="dash-section">
            <div className="dash-section-header">
              <span className="dash-section-label">Recommended Tasks</span>
              <Link to="/dashboard/tasks" className="dash-section-link">
                See all →
              </Link>
            </div>

            {tasksLoading && <p className="dash-inline-status">Loading tasks…</p>}

            {tasksError && (
              <div className="dash-error-banner">
                <p>{tasksError}</p>
              </div>
            )}

            {!tasksLoading && !tasksError && tasks.length === 0 && (
              <p className="dash-inline-status">No recommended tasks right now — check back soon.</p>
            )}

            {!tasksLoading && tasks.length > 0 && (
              <div className="task-list">
                {tasks.map((task) => {
                  const rewardKobo = Number(task.worker_earn_kobo)
                  const difficulty = difficultyFromReward(rewardKobo)
                  return (
                    <Link key={task.id} to={`/dashboard/tasks/${task.id}`} className="task-card task-card-link">
                      <div className="task-card-top">
                        <div className="task-tags">
                          <span className="task-tag task-tag-category">{categoryLabel(task.category_name)}</span>
                        </div>
                        <span className="task-reward">{formatNaira(rewardKobo)}</span>
                      </div>

                      <h3 className="task-title">{task.job_description}</h3>

                      <div className="task-meta">
                        <span className={difficultyClass(difficulty)}>{difficulty}</span>
                        <span>{task.spots_remaining} slots left</span>
                      </div>
                    </Link>
                  )
                })}
              </div>
            )}
          </div>
        )}

        {/* Advertiser CTA in place of Recommended Tasks (no advertiser task-feed endpoint yet) */}
        {isAdvertiser && (
          <div className="dash-section">
            <div className="dash-section-header">
              <span className="dash-section-label">Your Tasks</span>
            </div>
            <div className="quick-actions-grid">
              <Link to="/dashboard/tasks" className="quick-action-card">
                <span className="quick-action-icon"><HiOutlineMegaphone /></span>
                <span className="quick-action-label">Manage your posted tasks</span>
              </Link>
              <Link to="/dashboard/review" className="quick-action-card">
                <span className="quick-action-icon"><HiOutlineClipboardDocumentCheck /></span>
                <span className="quick-action-label">Review submissions</span>
              </Link>
            </div>
          </div>
        )}

        {/* Recent earnings — real /wallet/transactions */}
        <div className="dash-section">
          <div className="dash-section-header">
            <span className="dash-section-label">Recent Activity</span>
            <Link to="/dashboard/wallet" className="dash-section-link">
              View all →
            </Link>
          </div>

          {transactionsLoading && <p className="dash-inline-status">Loading activity…</p>}

          {transactionsError && (
            <div className="dash-error-banner">
              <p>{transactionsError}</p>
            </div>
          )}

          {!transactionsLoading && !transactionsError && transactions.length === 0 && (
            <p className="dash-inline-status">No activity yet — start completing tasks to see your earnings here.</p>
          )}

          {!transactionsLoading && !transactionsError && transactions.length > 0 && (
            <div className="earnings-list">
              {transactions.map((item) => {
                const state = transactionDisplayState(item)
                const amountKobo = Number(item.amount)
                return (
                  <div key={item.id} className="earnings-row">
                    <span className={`earnings-icon earnings-icon-${state}`}>
                      {state === 'debit' ? <HiArrowDownRight /> : <HiArrowUpRight />}
                    </span>

                    <div className="earnings-info">
                      <span className="earnings-title">{transactionLabel(item.type)}</span>
                      <span className="earnings-subtitle">{transactionSubtitle(item)}</span>
                    </div>

                    <div className="earnings-amount-wrap">
                      <span className={`earnings-amount earnings-amount-${state}`}>
                        {state === 'credit' ? '+' : state === 'debit' ? '-' : ''}
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
      </main>

      <BottomNav />
    </div>
  )
}

export default DashboardPage
