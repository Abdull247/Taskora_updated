import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  HiBars3,
  HiOutlineBell,
  HiOutlineCog6Tooth,
  HiOutlineLifebuoy,
  HiOutlineArrowRightOnRectangle,
  HiOutlineUser,
  HiOutlineUsers,
  HiOutlineWallet,
} from 'react-icons/hi2'
import { getMe, getStoredRole } from '../../lib/me'
import { logout } from '../../lib/authStatus'
import type { MeUser, UserRole } from '../../types/api'
import './DashboardTopbar.css'

interface DashboardTopbarProps {
  hasNotifications?: boolean
  onMenuClick?: () => void
  onBellClick?: () => void
  onAvatarClick?: () => void
}

interface AccountMenuItem {
  to: string
  label: string
  description: string
  Icon: typeof HiOutlineUser
}

const ACCOUNT_MENU_ITEMS: AccountMenuItem[] = [
  { to: '/dashboard/profile', label: 'My Profile', description: 'Personal details', Icon: HiOutlineUser },
  { to: '/dashboard/wallet', label: 'Wallet', description: 'Balance and transactions', Icon: HiOutlineWallet },
  { to: '/dashboard/referral', label: 'Referrals', description: 'Invite friends and earn', Icon: HiOutlineUsers },
  { to: '/dashboard/settings', label: 'Settings', description: 'Preferences and security', Icon: HiOutlineCog6Tooth },
  { to: '/dashboard/support', label: 'Help & Support', description: 'Get answers and contact us', Icon: HiOutlineLifebuoy },
]

function roleLabel(role: UserRole | null) {
  if (role === 'advertiser') return 'Advertiser'
  if (role === 'worker') return 'Tasker'
  return ''
}

function DashboardTopbar({
  hasNotifications = false,
  onMenuClick,
  onBellClick,
  onAvatarClick,
}: DashboardTopbarProps) {
  const navigate = useNavigate()
  const [initial, setInitial] = useState('')
  const [user, setUser] = useState<MeUser | null>(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const menuWrapRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    let cancelled = false
    // Cached after the first load — every page's topbar shares one /me request.
    getMe()
      .then(({ user: me }) => {
        if (cancelled) return
        setUser(me)
        const first = me.firstName.trim().charAt(0).toUpperCase()
        const last = me.lastName.trim().charAt(0).toUpperCase()
        setInitial(first || last || '?')
      })
      .catch(() => {
        // Auth failures are handled by the page itself; leave the avatar blank.
      })
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    if (!menuOpen) return
    const onPointerDown = (e: MouseEvent | TouchEvent) => {
      if (menuWrapRef.current && !menuWrapRef.current.contains(e.target as Node)) {
        setMenuOpen(false)
      }
    }
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenuOpen(false)
    }
    document.addEventListener('mousedown', onPointerDown)
    document.addEventListener('touchstart', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('mousedown', onPointerDown)
      document.removeEventListener('touchstart', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [menuOpen])

  const handleMenuClick = () => {
    window.dispatchEvent(new CustomEvent('taskbridge:open-menu'))
    onMenuClick?.()
  }

  const toggleMenu = () => {
    setMenuOpen((prev) => !prev)
    onAvatarClick?.()
  }

  const go = (to: string) => {
    setMenuOpen(false)
    navigate(to)
  }

  const handleLogout = () => {
    setMenuOpen(false)
    logout()
    navigate('/')
  }

  const fullName = user ? `${user.firstName} ${user.lastName}`.trim() : ''

  return (
    <header className="dash-topbar">
      <button type="button" className="dash-topbar-icon-btn" onClick={handleMenuClick} aria-label="Open menu">
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

        <div className="dash-avatar-wrap" ref={menuWrapRef}>
          <button
            type="button"
            className={`dash-topbar-avatar ${menuOpen ? 'dash-topbar-avatar-open' : ''}`}
            onClick={toggleMenu}
            aria-label="Account menu"
            aria-haspopup="menu"
            aria-expanded={menuOpen}
          >
            {initial}
          </button>

          {menuOpen && (
            <div className="dash-account-menu" role="menu" aria-label="Account options">
              <div className="dash-account-menu-header">
                <span className="dash-account-menu-avatar">{initial}</span>
                <div className="dash-account-menu-user">
                  <span className="dash-account-menu-name">{fullName || 'Account'}</span>
                  <span className="dash-account-menu-role">{roleLabel(getStoredRole())}</span>
                </div>
              </div>

              <div className="dash-account-menu-items">
                {ACCOUNT_MENU_ITEMS.map(({ to, label, description, Icon }) => (
                  <button key={to} type="button" role="menuitem" className="dash-account-menu-item" onClick={() => go(to)}>
                    <span className="dash-account-menu-item-icon">
                      <Icon />
                    </span>
                    <span className="dash-account-menu-item-text">
                      <span className="dash-account-menu-item-label">{label}</span>
                      <span className="dash-account-menu-item-desc">{description}</span>
                    </span>
                  </button>
                ))}
              </div>

              <div className="dash-account-menu-footer">
                <button type="button" className="dash-account-menu-signout" onClick={handleLogout}>
                  <HiOutlineArrowRightOnRectangle />
                  Sign out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

export default DashboardTopbar
