import { useEffect, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { HiArrowLeft, HiOutlineGift, HiOutlineSquare2Stack, HiOutlineShare } from 'react-icons/hi2'
import DashboardTopbar from '../../components/DashboardTopbar/DashboardTopbar'
import BottomNav from '../../components/BottomNav/BottomNav'
import { SEO } from '../../components/SEO/SEO'
import { getMe } from '../../lib/me'
import { getReferrals } from '../../lib/referrals'
import { formatNairaFromKobo } from '../../lib/wallet'
import { ApiRequestError } from '../../lib/api'
import type { ReferralStats, Referral } from '../../types/api'
import './ReferralPage.css'

const SITE_BASE_URL = 'https://usetaskbridge.web.app'

function buildReferralLink(code: string) {
  return `${SITE_BASE_URL}/signup?ref=${encodeURIComponent(code)}`
}

/** Returns a human-readable relative time string, e.g. "3 days ago", "Just now". */
function relativeTime(isoString: string): string {
  const date = new Date(isoString)
  if (Number.isNaN(date.getTime())) return '—'

  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffSec = Math.floor(diffMs / 1000)
  const diffMin = Math.floor(diffSec / 60)
  const diffHr = Math.floor(diffMin / 60)
  const diffDay = Math.floor(diffHr / 24)
  const diffWk = Math.floor(diffDay / 7)
  const diffMo = Math.floor(diffDay / 30)

  if (diffSec < 60) return 'Just now'
  if (diffMin < 60) return `${diffMin} minute${diffMin === 1 ? '' : 's'} ago`
  if (diffHr < 24) return `${diffHr} hour${diffHr === 1 ? '' : 's'} ago`
  if (diffDay === 1) return 'Yesterday'
  if (diffDay < 7) return `${diffDay} days ago`
  if (diffWk === 1) return '1 week ago'
  if (diffWk < 5) return `${diffWk} weeks ago`
  if (diffMo === 1) return '1 month ago'
  if (diffMo < 12) return `${diffMo} months ago`
  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

/** Formats kobo → "₦1,600" with compact formatting for large numbers. */
function formatEarningsNaira(kobo: number): string {
  const naira = kobo / 100
  return `₦${naira.toLocaleString('en-NG', {
    minimumFractionDigits: naira % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  })}`
}

function ReferralPage() {
  const navigate = useNavigate()

  const [referralCode, setReferralCode] = useState('')
  const [stats, setStats] = useState<ReferralStats | null>(null)
  const [recentReferrals, setRecentReferrals] = useState<Referral[]>([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  const load = useCallback(() => {
    let cancelled = false
    setLoading(true)
    setLoadError(null)

    Promise.all([getMe(), getReferrals()])
      .then(([{ user }, { stats: s, recentReferrals: list }]) => {
        if (cancelled) return
        setReferralCode(user.referralCode ?? '')
        setStats(s)
        setRecentReferrals(list)
      })
      .catch((err) => {
        if (cancelled) return
        if (err instanceof ApiRequestError && err.status === 401) {
          navigate('/login', { replace: true })
          return
        }
        setLoadError('Could not load your referral data. Pull to try again.')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [navigate])

  useEffect(() => {
    load()
  }, [load])

  const referralLink = referralCode ? buildReferralLink(referralCode) : ''

  const handleCopy = async () => {
    if (!referralCode) {
      toast.error('Your referral code is still loading. Please try again in a moment.')
      return
    }
    try {
      await navigator.clipboard.writeText(referralCode)
      setCopied(true)
      toast.success('Referral code copied!')
      setTimeout(() => setCopied(false), 2000)
    } catch {
      toast.error('Could not copy. Please copy it manually.')
    }
  }

  const handleShare = async () => {
    if (!referralCode || !referralLink) {
      toast.error('Your referral link is still loading. Please try again in a moment.')
      return
    }

    const shareText =
      `I've been earning on TaskBridge and thought you'd love it too. ` +
      `Join with my referral code ${referralCode} and we both win — ` +
      `you get a head start, I get a bonus when you complete your first task. ` +
      `Sign up here:`

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Join me on TaskBridge',
          text: shareText,
          url: referralLink,
        })
      } catch {
        // user cancelled share — no-op
      }
    } else {
      try {
        await navigator.clipboard.writeText(`${shareText} ${referralLink}`)
        toast.success('Referral message copied!')
      } catch {
        toast.error('Could not copy the link.')
      }
    }
  }

  if (loadError) {
    return (
      <div className="referral-page">
        <SEO title="Referrals | TaskBridge" description="Manage your tasks and earnings." noindex />
        <DashboardTopbar hasNotifications />
        <main className="referral-main">
          <div className="referral-heading">
            <button type="button" className="referral-back" onClick={() => navigate(-1)} aria-label="Go back">
              <HiArrowLeft />
            </button>
            <h1>Refer &amp; Earn</h1>
          </div>
          <div className="referral-error">
            <p>{loadError}</p>
            <button type="button" className="btn btn-primary btn-block" onClick={load}>
              Try again
            </button>
          </div>
        </main>
        <BottomNav />
      </div>
    )
  }

  return (
    <div className="referral-page">
      <SEO title="Referrals | TaskBridge" description="Manage your tasks and earnings." noindex />
      <DashboardTopbar hasNotifications />

      <main className="referral-main">
        <div className="referral-heading">
          <button type="button" className="referral-back" onClick={() => navigate(-1)} aria-label="Go back">
            <HiArrowLeft />
          </button>
          <h1>Refer &amp; Earn</h1>
        </div>

        {/* Hero card */}
        <div className="referral-hero-card">
          <span className="referral-hero-icon">
            <HiOutlineGift />
          </span>
          <h2>Earn ₦50 per referral</h2>
          <p>Share your referral code with friends. You earn ₦50 when they join — even before they complete a task.</p>
        </div>

        {/* Referral code card */}
        <div className="referral-code-card">
          <span className="referral-code-label">Your Referral Code</span>

          <div className="referral-code-box">
            <span className="referral-code-value">
              {loading ? <span className="referral-skeleton referral-skeleton-code" /> : (referralCode || '—')}
            </span>
            <button
              type="button"
              className="referral-copy-btn"
              onClick={handleCopy}
              disabled={loading || !referralCode}
            >
              <HiOutlineSquare2Stack />
              {copied ? 'Copied' : 'Copy'}
            </button>
          </div>

          <button
            type="button"
            className="referral-share-btn"
            onClick={handleShare}
            disabled={loading || !referralCode}
          >
            <HiOutlineShare />
            Share Referral Link
          </button>
        </div>

        {/* Stats row */}
        <div className="referral-stats-row">
          <div className="referral-stat-card">
            {loading ? (
              <>
                <span className="referral-skeleton referral-skeleton-stat" />
                <span className="referral-skeleton referral-skeleton-label" />
              </>
            ) : (
              <>
                <span className="referral-stat-value">{stats?.totalReferrals ?? 0}</span>
                <span className="referral-stat-label">Total Referrals</span>
              </>
            )}
          </div>
          <div className="referral-stat-card">
            {loading ? (
              <>
                <span className="referral-skeleton referral-skeleton-stat" />
                <span className="referral-skeleton referral-skeleton-label" />
              </>
            ) : (
              <>
                <span className="referral-stat-value">{stats?.completedReferrals ?? 0}</span>
                <span className="referral-stat-label">Completed</span>
              </>
            )}
          </div>
          <div className="referral-stat-card">
            {loading ? (
              <>
                <span className="referral-skeleton referral-skeleton-stat" />
                <span className="referral-skeleton referral-skeleton-label" />
              </>
            ) : (
              <>
                <span className="referral-stat-value referral-stat-value-earnings">
                  {stats ? formatEarningsNaira(stats.totalEarningsKobo) : '₦0'}
                </span>
                <span className="referral-stat-label">Earnings</span>
              </>
            )}
          </div>
        </div>

        {/* Recent referrals */}
        <div className="referral-section">
          <span className="referral-section-label">Recent Referrals</span>

          <div className="referral-list">
            {loading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="referral-row referral-row-skeleton">
                  <span className="referral-avatar referral-skeleton referral-skeleton-avatar" />
                  <div className="referral-row-info">
                    <span className="referral-skeleton referral-skeleton-name" />
                    <span className="referral-skeleton referral-skeleton-when" />
                  </div>
                </div>
              ))
            ) : recentReferrals.length === 0 ? (
              <div className="referral-empty">
                <p>No referrals yet — share your code to get started!</p>
              </div>
            ) : (
              recentReferrals.map((item) => {
                const fullName =
                  [item.user.firstName, item.user.lastName].filter(Boolean).join(' ') || item.user.username
                const initial = item.user.firstName
                  ? item.user.firstName.charAt(0).toUpperCase()
                  : item.user.username.charAt(0).toUpperCase()

                return (
                  <div key={item.id} className="referral-row">
                    <span className="referral-avatar">{initial}</span>

                    <div className="referral-row-info">
                      <span className="referral-row-name">{fullName}</span>
                      <span className="referral-row-when">{relativeTime(item.createdAt)}</span>
                    </div>

                    {item.bonusCredited ? (
                      <span className="referral-status referral-status-earned">
                        <span className="referral-status-dot" />
                        Earned {formatNairaFromKobo(item.bonusAmountKobo)}
                      </span>
                    ) : (
                      <span className="referral-status referral-status-pending">
                        <span className="referral-status-dot" />
                        Pending
                      </span>
                    )}
                  </div>
                )
              })
            )}
          </div>
        </div>
      </main>

      <BottomNav />
    </div>
  )
}

export default ReferralPage