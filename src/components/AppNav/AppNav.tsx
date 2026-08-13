import { useEffect, useState } from 'react'
import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import type { IconType } from 'react-icons'
import {
  HiOutlineSquares2X2,
  HiOutlineClipboardDocumentList,
  HiOutlineClipboardDocumentCheck,
  HiOutlinePlusCircle,
  HiOutlineWallet,
  HiOutlineUsers,
  HiOutlineBell,
  HiOutlineShieldCheck,
  HiOutlineArrowRightOnRectangle,
  HiXMark,
  HiArrowUpRight,
} from 'react-icons/hi2'
import { getMe, getStoredRole } from '../../lib/me'
import { isAuthenticated, logout } from '../../lib/authStatus'
import { ApiRequestError } from '../../lib/api'
import type { MeUser, UserRole } from '../../types/api'
import './AppNav.css'

interface NavItem {
  to: string
  label: string
  Icon: IconType
}

const MAIN_NAV: NavItem[] = [{ to: '/dashboard', label: 'Dashboard', Icon: HiOutlineSquares2X2 }]

const WORK_NAV: Record<UserRole, NavItem[]> = {
  worker: [
    { to: '/dashboard/tasks', label: 'Browse Tasks', Icon: HiOutlineClipboardDocumentList },
    { to: '/dashboard/submissions', label: 'My Submissions', Icon: HiOutlineClipboardDocumentCheck },
  ],
  advertiser: [
    { to: '/dashboard/tasks', label: 'Your Tasks', Icon: HiOutlineClipboardDocumentList },
    { to: '/dashboard/tasks/create', label: 'Create Task', Icon: HiOutlinePlusCircle },
    { to: '/dashboard/review', label: 'Review Submissions', Icon: HiOutlineClipboardDocumentCheck },
  ],
}

const ACCOUNT_NAV: NavItem[] = [
  { to: '/dashboard/wallet', label: 'Wallet', Icon: HiOutlineWallet },
  { to: '/dashboard/referral', label: 'Referral', Icon: HiOutlineUsers },
  { to: '/dashboard/notifications', label: 'Notifications', Icon: HiOutlineBell },
  { to: '/dashboard/verify', label: 'Verify ID', Icon: HiOutlineShieldCheck },
]

function initialsFor(firstName?: string, lastName?: string) {
  if (!firstName) return '··'
  const a = firstName.trim().charAt(0)
  const b = (lastName ?? '').trim().charAt(0)
  return `${a}${b}`.toUpperCase() || '··'
}

function roleLabel(role: UserRole | null) {
  if (role === 'advertiser') return 'Advertiser'
  if (role === 'worker') return 'Tasker'
  return ''
}

function AppNav() {
  const navigate = useNavigate()
  const location = useLocation()

  const [open, setOpen] = useState(false)
  const [authed, setAuthed] = useState(() => isAuthenticated())
  const [role, setRole] = useState<UserRole | null>(() => getStoredRole())
  const [user, setUser] = useState<MeUser | null>(null)

  useEffect(() => {
    const onMenu = () => setOpen(true)
    window.addEventListener('taskbridge:open-menu', onMenu)
    return () => window.removeEventListener('taskbridge:open-menu', onMenu)
  }, [])

  useEffect(() => {
    setAuthed(isAuthenticated())
    if (!isAuthenticated()) {
      setRole(null)
      setUser(null)
    }
  }, [location.pathname])

  useEffect(() => {
    if (!authed) return
    let cancelled = false
    getMe()
      .then(({ user: me }) => {
        if (cancelled) return
        setUser(me)
        setRole(me.role)
      })
      .catch((err) => {
        if (cancelled) return
        if (err instanceof ApiRequestError && err.status === 401) {
          logout()
          navigate('/login', { replace: true })
        }
      })
    return () => {
      cancelled = true
    }
  }, [authed, navigate])

  useEffect(() => {
    setOpen(false)
  }, [location.pathname])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const handleLogout = () => {
    logout()
    setOpen(false)
    navigate('/')
  }

  if (!authed) return null

  const cta =
    role === 'advertiser'
      ? { to: '/dashboard/tasks/create', label: 'Create a task' }
      : { to: '/dashboard/tasks', label: 'Browse tasks' }

  const renderNavLink = ({ to, label, Icon }: NavItem) => (
    <NavLink
      key={to}
      to={to}
      end={to === '/dashboard'}
      className={({ isActive }) => `app-nav-link ${isActive ? 'app-nav-link-active' : ''}`}
      onClick={() => setOpen(false)}
    >
      <span className="app-nav-link-icon">
        <Icon />
      </span>
      <span className="app-nav-link-label">{label}</span>
    </NavLink>
  )

  return (
    <>
      {open && <div className="app-nav-backdrop" onClick={() => setOpen(false)} aria-hidden="true" />}

      <nav className={`app-nav ${open ? 'app-nav-open' : ''}`} aria-label="Primary">
        <div className="app-nav-header">
          <div className="app-nav-user">
            <span className="app-nav-avatar">{user ? initialsFor(user.firstName, user.lastName) : '··'}</span>
            <div className="app-nav-user-info">
              <span className="app-nav-name">
                {user ? `${user.firstName} ${user.lastName}`.trim() : 'Loading…'}
              </span>
              <span className="app-nav-role">{roleLabel(role)}</span>
            </div>
          </div>
          <button
            type="button"
            className="app-nav-close"
            onClick={() => setOpen(false)}
            aria-label="Close menu"
          >
            <HiXMark />
          </button>
        </div>

        <div className="app-nav-scroll">
          <div className="app-nav-section">
            <span className="app-nav-section-label">Main</span>
            {MAIN_NAV.map(renderNavLink)}
          </div>

          <div className="app-nav-section">
            <span className="app-nav-section-label">{role === 'advertiser' ? 'Advertising' : 'Earning'}</span>
            {(WORK_NAV[role ?? 'worker'] ?? WORK_NAV.worker).map(renderNavLink)}
          </div>

          <div className="app-nav-section">
            <span className="app-nav-section-label">Account</span>
            {ACCOUNT_NAV.map(renderNavLink)}
          </div>

          {user && (
            <div className="app-nav-cta-wrap">
              <NavLink to={cta.to} className="app-nav-cta" onClick={() => setOpen(false)}>
                {cta.label}
                <HiArrowUpRight />
              </NavLink>
              {role === 'advertiser' && user.stats.pendingApprovals > 0 && (
                <NavLink to="/dashboard/review" className="app-nav-pending" onClick={() => setOpen(false)}>
                  {user.stats.pendingApprovals} submission
                  {user.stats.pendingApprovals === 1 ? '' : 's'} awaiting review →
                </NavLink>
              )}
            </div>
          )}
        </div>

        <div className="app-nav-footer">
          <button type="button" className="app-nav-logout" onClick={handleLogout}>
            <HiOutlineArrowRightOnRectangle />
            Sign out
          </button>
        </div>
      </nav>
    </>
  )
}

export default AppNav
