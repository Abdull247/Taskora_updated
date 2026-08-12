import { HiBars3, HiOutlineBell } from 'react-icons/hi2'
import './DashboardTopbar.css'

interface DashboardTopbarProps {
  initials: string
  hasNotifications?: boolean
  onMenuClick?: () => void
  onBellClick?: () => void
  onAvatarClick?: () => void
}

function DashboardTopbar({
  initials,
  hasNotifications = false,
  onMenuClick,
  onBellClick,
  onAvatarClick,
}: DashboardTopbarProps) {
  return (
    <header className="dash-topbar">
      <button type="button" className="dash-topbar-icon-btn" onClick={onMenuClick} aria-label="Open menu">
        <HiBars3 />
      </button>

      <div className="dash-topbar-right">
        <button
          type="button"
          className="dash-topbar-icon-btn dash-topbar-bell"
          onClick={onBellClick}
          aria-label="Notifications"
        >
          <HiOutlineBell />
          {hasNotifications && <span className="dash-topbar-dot" />}
        </button>

        <button type="button" className="dash-topbar-avatar" onClick={onAvatarClick} aria-label="Account">
          {initials}
        </button>
      </div>
    </header>
  )
}

export default DashboardTopbar
