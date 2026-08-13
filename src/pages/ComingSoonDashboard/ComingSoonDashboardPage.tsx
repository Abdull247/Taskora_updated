import { HiOutlineShieldCheck } from 'react-icons/hi2'
import DashboardTopbar from '../../components/DashboardTopbar/DashboardTopbar'
import BottomNav from '../../components/BottomNav/BottomNav'
import './ComingSoonDashboardPage.css'

interface ComingSoonDashboardPageProps {
  title: string
  description?: string
}

function ComingSoonDashboardPage({
  title,
  description = 'This feature is on the way. Check back soon.',
}: ComingSoonDashboardPageProps) {
  return (
    <div className="soon-page">
      <DashboardTopbar initials="··" hasNotifications />

      <main className="soon-main">
        <div className="soon-card">
          <span className="soon-icon">
            <HiOutlineShieldCheck />
          </span>
          <h1>{title}</h1>
          <p>{description}</p>
        </div>
      </main>

      <BottomNav />
    </div>
  )
}

export default ComingSoonDashboardPage
