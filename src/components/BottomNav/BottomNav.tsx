import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import {
  HiSquares2X2,
  HiOutlineSquares2X2,
  HiClipboardDocumentList,
  HiOutlineClipboardDocumentList,
  HiWallet,
  HiOutlineWallet,
  HiBell,
  HiOutlineBell,
  HiUsers,
  HiOutlineUsers,
} from 'react-icons/hi2'
import { getStoredRole } from '../../lib/me'
import './BottomNav.css'

interface Tab {
  to: string
  label: (role: 'worker' | 'advertiser') => string
  Icon: typeof HiOutlineSquares2X2
  ActiveIcon: typeof HiSquares2X2
}

const tabs: Tab[] = [
  {
    to: '/dashboard',
    label: () => 'Dashboard',
    Icon: HiOutlineSquares2X2,
    ActiveIcon: HiSquares2X2,
  },
  {
    to: '/dashboard/tasks',
    label: (role) => (role === 'advertiser' ? 'Your Tasks' : 'Browse Tasks'),
    Icon: HiOutlineClipboardDocumentList,
    ActiveIcon: HiClipboardDocumentList,
  },
  {
    to: '/dashboard/wallet',
    label: () => 'Wallet',
    Icon: HiOutlineWallet,
    ActiveIcon: HiWallet,
  },
  {
    to: '/dashboard/notifications',
    label: () => 'Notifications',
    Icon: HiOutlineBell,
    ActiveIcon: HiBell,
  },
  {
    to: '/dashboard/referral',
    label: () => 'Referral',
    Icon: HiOutlineUsers,
    ActiveIcon: HiUsers,
  },
]

function BottomNav() {
  const [role] = useState<'worker' | 'advertiser' | null>(() => getStoredRole())

  return (
    <nav className="bottom-nav">
      {tabs.map(({ to, label, Icon, ActiveIcon }) => (
        <NavLink
          key={to}
          to={to}
          end={to === '/dashboard'}
          className={({ isActive }) => `bottom-nav-item ${isActive ? 'bottom-nav-item-active' : ''}`}
        >
          {({ isActive }) => (
            <>
              <span className="bottom-nav-icon">{isActive ? <ActiveIcon /> : <Icon />}</span>
              <span className="bottom-nav-label">{label(role ?? 'worker')}</span>
            </>
          )}
        </NavLink>
      ))}
    </nav>
  )
}

export default BottomNav
