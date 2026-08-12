import { Link } from 'react-router-dom'
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
} from 'react-icons/hi2'
import DashboardTopbar from '../../components/DashboardTopbar/DashboardTopbar'
import BottomNav from '../../components/BottomNav/BottomNav'
import './DashboardPage.css'

interface TaskItem {
  id: string
  category: string
  verified: boolean
  reward: number
  title: string
  duration: string
  difficulty: 'Easy' | 'Medium' | 'Hard'
  slotsLeft: number
  rating: number
}

interface EarningItem {
  id: string
  type: 'credit' | 'debit'
  title: string
  subtitle: string
  amount: number
  when: string
}

const recommendedTasks: TaskItem[] = [
  {
    id: '1',
    category: 'Social Media',
    verified: true,
    reward: 150,
    title: 'Follow @OfficialMTN on Instagram and like their latest 3 posts',
    duration: '5 mins',
    difficulty: 'Easy',
    slotsLeft: 48,
    rating: 4.8,
  },
  {
    id: '2',
    category: 'App Download',
    verified: true,
    reward: 300,
    title: 'Download KliqPay app, create an account and complete profile setup',
    duration: '10 mins',
    difficulty: 'Easy',
    slotsLeft: 120,
    rating: 4.9,
  },
  {
    id: '3',
    category: 'Review',
    verified: false,
    reward: 200,
    title: 'Write a genuine Google Play review for Opay (min. 50 words)',
    duration: '8 mins',
    difficulty: 'Medium',
    slotsLeft: 30,
    rating: 4.7,
  },
]

const recentEarnings: EarningItem[] = [
  {
    id: '1',
    type: 'credit',
    title: 'Task Reward',
    subtitle: 'Follow @OfficialMTN on Insta...',
    amount: 150,
    when: 'Today, 2:30 PM',
  },
  {
    id: '2',
    type: 'credit',
    title: 'Task Reward',
    subtitle: 'Download KliqPay app',
    amount: 300,
    when: 'Today, 10:15 AM',
  },
  {
    id: '3',
    type: 'debit',
    title: 'Withdrawal',
    subtitle: 'GTBank ••••4521',
    amount: -5000,
    when: 'Yesterday',
  },
]

function formatNaira(value: number) {
  const abs = Math.abs(value)
  return `₦${abs.toLocaleString('en-NG')}`
}

function difficultyClass(difficulty: TaskItem['difficulty']) {
  if (difficulty === 'Easy') return 'task-diff-easy'
  if (difficulty === 'Medium') return 'task-diff-medium'
  return 'task-diff-hard'
}

function DashboardPage() {
  const firstName = 'Chidi'
  const initials = 'CE'

  return (
    <div className="dashboard-page">
      <DashboardTopbar initials={initials} hasNotifications />

      <main className="dashboard-main">
        {/* Greeting */}
        <div className="dash-greeting">
          <h1>
            Good morning, {firstName} <span className="dash-wave">👋</span>
          </h1>
          <p>You have 3 pending approvals</p>
        </div>

        {/* Balance card */}
        <div className="balance-card">
          <div className="balance-card-top">
            <div>
              <span className="balance-label">Total Balance</span>
              <div className="balance-value">₦12,450.00</div>
              <span className="balance-pending">₦3,200 pending approval</span>
            </div>
            <div className="balance-icon">
              <HiOutlineWallet />
            </div>
          </div>

          <div className="balance-actions">
            <Link to="/dashboard/wallet" className="btn-balance btn-balance-tint">
              View Wallet
            </Link>
            <button type="button" className="btn-balance btn-balance-primary">
              Withdraw
            </button>
          </div>
        </div>

        {/* Stats row */}
        <div className="stats-row">
          <div className="stat-card">
            <div className="stat-card-top">
              <span className="stat-card-label">Tasks Completed</span>
              <span className="stat-card-icon"><HiCheckCircle /></span>
            </div>
            <div className="stat-card-value">248</div>
            <span className="stat-card-delta stat-card-delta-up">+12 this week</span>
          </div>

          <div className="stat-card">
            <div className="stat-card-top">
              <span className="stat-card-label">Earnings (July)</span>
              <span className="stat-card-icon"><HiArrowTrendingUp /></span>
            </div>
            <div className="stat-card-value">₦8,750</div>
            <span className="stat-card-delta stat-card-delta-up">+₦1,200 vs last month</span>
          </div>
        </div>

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

        {/* Recommended tasks */}
        <div className="dash-section">
          <div className="dash-section-header">
            <span className="dash-section-label">Recommended Tasks</span>
            <Link to="/dashboard/tasks" className="dash-section-link">
              See all →
            </Link>
          </div>

          <div className="task-list">
            {recommendedTasks.map((task) => (
              <div key={task.id} className="task-card">
                <div className="task-card-top">
                  <div className="task-tags">
                    <span className="task-tag task-tag-category">{task.category}</span>
                    {task.verified && <span className="task-tag task-tag-verified">Verified</span>}
                  </div>
                  <span className="task-reward">{formatNaira(task.reward)}</span>
                </div>

                <h3 className="task-title">{task.title}</h3>

                <div className="task-meta">
                  <span>{task.duration}</span>
                  <span className={difficultyClass(task.difficulty)}>{task.difficulty}</span>
                  <span>{task.slotsLeft} slots left</span>
                  <span className="task-rating">
                    <HiStar /> {task.rating}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent earnings */}
        <div className="dash-section">
          <div className="dash-section-header">
            <span className="dash-section-label">Recent Earnings</span>
            <Link to="/dashboard/wallet" className="dash-section-link">
              View all →
            </Link>
          </div>

          <div className="earnings-list">
            {recentEarnings.map((item) => (
              <div key={item.id} className="earnings-row">
                <span className={`earnings-icon ${item.type === 'credit' ? 'earnings-icon-credit' : 'earnings-icon-debit'}`}>
                  {item.type === 'credit' ? <HiArrowUpRight /> : <HiArrowDownRight />}
                </span>

                <div className="earnings-info">
                  <span className="earnings-title">{item.title}</span>
                  <span className="earnings-subtitle">{item.subtitle}</span>
                </div>

                <div className="earnings-amount-wrap">
                  <span className={`earnings-amount ${item.type === 'credit' ? 'earnings-amount-credit' : 'earnings-amount-debit'}`}>
                    {item.type === 'credit' ? '+' : '-'}
                    {formatNaira(item.amount)}
                  </span>
                  <span className="earnings-when">{item.when}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <BottomNav />
    </div>
  )
}

export default DashboardPage
