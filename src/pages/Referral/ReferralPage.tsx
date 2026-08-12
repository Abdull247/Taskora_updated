import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { HiArrowLeft, HiOutlineGift, HiOutlineSquare2Stack, HiOutlineShare } from 'react-icons/hi2'
import DashboardTopbar from '../../components/DashboardTopbar/DashboardTopbar'
import BottomNav from '../../components/BottomNav/BottomNav'
import './ReferralPage.css'

interface ReferralItem {
  id: string
  name: string
  initial: string
  when: string
  status: 'earned' | 'pending'
  amount?: number
}

const referralCode = 'CHIDI-8842'
const referralLink = `https://taskbridge.dev/signup?ref=${referralCode}`

const recentReferrals: ReferralItem[] = [
  { id: '1', name: 'Ngozi Adeyemi', initial: 'N', when: '3 days ago', status: 'earned', amount: 200 },
  { id: '2', name: 'Bode Ogundimu', initial: 'B', when: '5 days ago', status: 'pending' },
  { id: '3', name: 'Amaka Eze', initial: 'A', when: '1 week ago', status: 'earned', amount: 200 },
]

function ReferralPage() {
  const navigate = useNavigate()
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
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
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Join TaskBridge',
          text: `Join TaskBridge with my referral code ${referralCode} and start earning!`,
          url: referralLink,
        })
      } catch {
        // user cancelled share — no-op
      }
    } else {
      try {
        await navigator.clipboard.writeText(referralLink)
        toast.success('Referral link copied!')
      } catch {
        toast.error('Could not copy the link.')
      }
    }
  }

  return (
    <div className="referral-page">
      <DashboardTopbar initials="CE" hasNotifications />

      <main className="referral-main">
        <div className="referral-heading">
          <button
            type="button"
            className="referral-back"
            onClick={() => navigate(-1)}
            aria-label="Go back"
          >
            <HiArrowLeft />
          </button>
          <h1>Refer &amp; Earn</h1>
        </div>

        {/* Hero card */}
        <div className="referral-hero-card">
          <span className="referral-hero-icon">
            <HiOutlineGift />
          </span>
          <h2>Earn ₦200 per referral</h2>
          <p>Share your referral code with friends. You earn ₦200 when they complete their first task.</p>
        </div>

        {/* Referral code card */}
        <div className="referral-code-card">
          <span className="referral-code-label">Your Referral Code</span>

          <div className="referral-code-box">
            <span className="referral-code-value">{referralCode}</span>
            <button type="button" className="referral-copy-btn" onClick={handleCopy}>
              <HiOutlineSquare2Stack />
              {copied ? 'Copied' : 'Copy'}
            </button>
          </div>

          <button type="button" className="referral-share-btn" onClick={handleShare}>
            <HiOutlineShare />
            Share Referral Link
          </button>
        </div>

        {/* Stats row */}
        <div className="referral-stats-row">
          <div className="referral-stat-card">
            <span className="referral-stat-value">12</span>
            <span className="referral-stat-label">Total Referrals</span>
          </div>
          <div className="referral-stat-card">
            <span className="referral-stat-value">8</span>
            <span className="referral-stat-label">Completed</span>
          </div>
          <div className="referral-stat-card">
            <span className="referral-stat-value referral-stat-value-earnings">₦1,600</span>
            <span className="referral-stat-label">Earnings</span>
          </div>
        </div>

        {/* Recent referrals */}
        <div className="referral-section">
          <span className="referral-section-label">Recent Referrals</span>

          <div className="referral-list">
            {recentReferrals.map((item) => (
              <div key={item.id} className="referral-row">
                <span className="referral-avatar">{item.initial}</span>

                <div className="referral-row-info">
                  <span className="referral-row-name">{item.name}</span>
                  <span className="referral-row-when">{item.when}</span>
                </div>

                {item.status === 'earned' ? (
                  <span className="referral-status referral-status-earned">
                    <span className="referral-status-dot" /> Earned ₦{item.amount}
                  </span>
                ) : (
                  <span className="referral-status referral-status-pending">
                    <span className="referral-status-dot" /> Pending
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </main>

      <BottomNav />
    </div>
  )
}

export default ReferralPage
