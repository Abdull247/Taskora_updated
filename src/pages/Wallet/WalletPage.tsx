import {
  HiOutlineBanknotes,
  HiArrowUpRight,
  HiArrowDownRight,
  HiCheckCircle,
} from 'react-icons/hi2'
import { PiBankBold } from 'react-icons/pi'
import DashboardTopbar from '../../components/DashboardTopbar/DashboardTopbar'
import BottomNav from '../../components/BottomNav/BottomNav'
import './WalletPage.css'

interface TransactionItem {
  id: string
  type: 'credit' | 'debit'
  title: string
  subtitle: string
  amount: number
  when: string
}

const transactions: TransactionItem[] = [
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
  {
    id: '4',
    type: 'credit',
    title: 'Task Reward',
    subtitle: 'Stream "Dende" by Asake',
    amount: 100,
    when: 'Yesterday',
  },
  {
    id: '5',
    type: 'credit',
    title: 'Referral Bonus',
    subtitle: 'Invited Ngozi Adeyemi',
    amount: 200,
    when: '23 Jul 2025',
  },
]

function formatNaira(value: number) {
  const abs = Math.abs(value)
  return `₦${abs.toLocaleString('en-NG')}`
}

function WalletPage() {
  return (
    <div className="wallet-page">
      <DashboardTopbar initials="CE" hasNotifications />

      <main className="wallet-main">
        <div className="wallet-heading">
          <h1>Wallet</h1>
        </div>

        {/* Available balance card */}
        <div className="wallet-balance-card">
          <span className="wallet-balance-label">Available Balance</span>
          <div className="wallet-balance-value">₦12,450.00</div>
          <span className="wallet-balance-sub">Ready to withdraw</span>

          <button type="button" className="btn btn-primary btn-block wallet-withdraw-btn">
            Withdraw Funds
          </button>
        </div>

        {/* Pending / Total earned */}
        <div className="wallet-stats-row">
          <div className="wallet-stat-card">
            <span className="wallet-stat-label">Pending</span>
            <div className="wallet-stat-value wallet-stat-value-pending">₦3,200.00</div>
            <span className="wallet-stat-sub">Awaiting approval</span>
          </div>

          <div className="wallet-stat-card">
            <span className="wallet-stat-label">Total Earned</span>
            <div className="wallet-stat-value wallet-stat-value-earned">₦68,750.00</div>
            <span className="wallet-stat-sub">All time</span>
          </div>
        </div>

        {/* Bank account card */}
        <div className="wallet-bank-card">
          <span className="wallet-bank-icon">
            <PiBankBold />
          </span>

          <div className="wallet-bank-info">
            <span className="wallet-bank-name">GTBank</span>
            <span className="wallet-bank-meta">••••4521 · Chidi Okeke</span>
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

          <div className="earnings-list">
            {transactions.map((item) => (
              <div key={item.id} className="earnings-row">
                <span
                  className={`earnings-icon ${
                    item.type === 'credit' ? 'earnings-icon-credit' : 'earnings-icon-debit'
                  }`}
                >
                  {item.type === 'credit' ? <HiArrowUpRight /> : <HiArrowDownRight />}
                </span>

                <div className="earnings-info">
                  <span className="earnings-title">{item.title}</span>
                  <span className="earnings-subtitle">{item.subtitle}</span>
                </div>

                <div className="earnings-amount-wrap">
                  <span
                    className={`earnings-amount ${
                      item.type === 'credit' ? 'earnings-amount-credit' : 'earnings-amount-debit'
                    }`}
                  >
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

export default WalletPage
