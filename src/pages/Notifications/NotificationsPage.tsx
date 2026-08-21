import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  HiArrowLeft,
  HiCheckCircle,
  HiOutlineBanknotes,
  HiOutlineBellAlert,
  HiOutlineCog6Tooth,
  HiOutlineEllipsisVertical,
  HiOutlineEye,
  HiOutlineEyeSlash,
  HiOutlineShieldCheck,
  HiOutlineTrash,
  HiOutlineUserPlus,
} from 'react-icons/hi2'
import DashboardTopbar from '../../components/DashboardTopbar/DashboardTopbar'
import BottomNav from '../../components/BottomNav/BottomNav'
import { SEO } from '../../components/SEO/SEO'
import './NotificationsPage.css'

type NotificationTab = 'personal' | 'system'

type NotificationKind = 'payment' | 'task' | 'referral' | 'security' | 'system'

interface NotificationItem {
  id: string
  tab: NotificationTab
  kind: NotificationKind
  title: string
  description: string
  when: string
  read: boolean
}

const kindMeta: Record<NotificationKind, { icon: typeof HiOutlineBanknotes; className: string }> = {
  payment: { icon: HiOutlineBanknotes, className: 'notification-icon-payment' },
  task: { icon: HiCheckCircle, className: 'notification-icon-task' },
  referral: { icon: HiOutlineUserPlus, className: 'notification-icon-referral' },
  security: { icon: HiOutlineShieldCheck, className: 'notification-icon-security' },
  system: { icon: HiOutlineCog6Tooth, className: 'notification-icon-system' },
}

// Demo data — replace with the real notifications feed once the backend ships it.
const demoNotifications: NotificationItem[] = [
  {
    id: 'p1',
    tab: 'personal',
    kind: 'payment',
    title: 'Task Approved',
    description:
      'Your submission for "Follow @OfficialMTN" was approved. ₦150 has been added to your wallet.',
    when: '2 mins ago',
    read: false,
  },
  {
    id: 'p2',
    tab: 'personal',
    kind: 'task',
    title: 'New Tasks Available',
    description: '12 new tasks have been posted in your preferred categories.',
    when: '1 hour ago',
    read: false,
  },
  {
    id: 'p3',
    tab: 'personal',
    kind: 'payment',
    title: 'Withdrawal Processed',
    description: 'Your withdrawal of ₦5,000 to GTBank ••••4521 was successful.',
    when: 'Yesterday',
    read: true,
  },
  {
    id: 'p4',
    tab: 'personal',
    kind: 'task',
    title: 'Task Rejected',
    description:
      'Your submission for "Download BantuRide" was rejected. Reason: account not verified.',
    when: '2 days ago',
    read: true,
  },
  {
    id: 'p5',
    tab: 'personal',
    kind: 'referral',
    title: 'Referral Bonus Earned',
    description: 'Chidi signed up with your referral code. ₦200 bonus is on its way to your wallet.',
    when: '3 days ago',
    read: true,
  },
  {
    id: 's1',
    tab: 'system',
    kind: 'security',
    title: 'New Device Signed In',
    description:
      'Your account was accessed from a new device (Chrome on Android, Lagos). If this wasn\'t you, change your password immediately.',
    when: '30 mins ago',
    read: false,
  },
  {
    id: 's2',
    tab: 'system',
    kind: 'system',
    title: 'Scheduled Maintenance',
    description:
      'TaskBridge will be briefly unavailable on Sunday between 2:00 AM and 3:00 AM WAT for scheduled maintenance.',
    when: '5 hours ago',
    read: true,
  },
  {
    id: 's3',
    tab: 'system',
    kind: 'security',
    title: 'Password Changed',
    description: 'Your password was changed successfully. All other sessions have been signed out.',
    when: 'Monday',
    read: true,
  },
  {
    id: 's4',
    tab: 'system',
    kind: 'system',
    title: 'Welcome to the New TaskBridge',
    description: 'We redesigned the app with faster task loading, a cleaner wallet and better alerts.',
    when: '1 week ago',
    read: true,
  },
]

const TABS: { id: NotificationTab; label: string }[] = [
  { id: 'personal', label: 'Personal Notifications' },
  { id: 'system', label: 'System Notifications' },
]

function NotificationsPage() {
  const navigate = useNavigate()
  const [notifications, setNotifications] = useState(demoNotifications)
  const [activeTab, setActiveTab] = useState<NotificationTab>('personal')
  const [openMenuId, setOpenMenuId] = useState<string | null>(null)

  useEffect(() => {
    if (!openMenuId) return
    const close = () => setOpenMenuId(null)
    document.addEventListener('click', close)
    return () => document.removeEventListener('click', close)
  }, [openMenuId])

  const visible = useMemo(
    () => notifications.filter((n) => n.tab === activeTab),
    [notifications, activeTab]
  )

  const hasUnread = notifications.some((n) => !n.read)

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
  }

  const toggleRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: !n.read } : n)))
  }

  const removeNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id))
  }

  return (
    <div className="notifications-page">
      <SEO title="Notifications | TaskBridge" description="Manage your tasks and earnings." noindex />
      <DashboardTopbar hasNotifications={hasUnread} />

      <main className="notifications-main">
        <div className="notifications-heading">
          <button
            type="button"
            className="notifications-back"
            onClick={() => navigate(-1)}
            aria-label="Go back"
          >
            <HiArrowLeft />
          </button>
          <h1>Notifications</h1>
          <button type="button" className="notifications-mark-read" onClick={markAllRead}>
            Mark all read
          </button>
        </div>

        <div className="notifications-chip-row">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              className={`notifications-chip ${activeTab === tab.id ? 'notifications-chip-active' : ''}`}
              onClick={() => {
                setActiveTab(tab.id)
                setOpenMenuId(null)
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {visible.length === 0 ? (
          <div className="notifications-empty">
            <span className="notifications-empty-icon">
              <HiOutlineBellAlert />
            </span>
            <p className="notifications-empty-title">You&apos;re all caught up</p>
            <p className="notifications-empty-sub">No notifications here right now.</p>
          </div>
        ) : (
          <div className="notifications-list">
            {visible.map((item) => {
              const meta = kindMeta[item.kind]
              const Icon = meta.icon
              const menuOpen = openMenuId === item.id
              return (
                <div
                  key={item.id}
                  className={`notification-card ${!item.read ? 'notification-card-unread' : ''}`}
                >
                  <span className={`notification-icon ${meta.className}`}>
                    <Icon />
                  </span>

                  <div className="notification-body">
                    <div className="notification-title-row">
                      <h3 className="notification-title">{item.title}</h3>
                      <span className="notification-when">{item.when}</span>
                    </div>
                    <p className="notification-description">{item.description}</p>
                  </div>

                  <div className="notification-side">
                    {!item.read && <span className="notification-dot" />}
                    <div className="notification-menu-wrap">
                      <button
                        type="button"
                        className="notification-menu-btn"
                        aria-label="Notification actions"
                        aria-haspopup="menu"
                        aria-expanded={menuOpen}
                        onClick={(e) => {
                          e.stopPropagation()
                          setOpenMenuId(menuOpen ? null : item.id)
                        }}
                      >
                        <HiOutlineEllipsisVertical />
                      </button>

                      {menuOpen && (
                        <div className="notification-menu" role="menu" onClick={(e) => e.stopPropagation()}>
                          <button
                            type="button"
                            role="menuitem"
                            className="notification-menu-item"
                            onClick={() => {
                              toggleRead(item.id)
                              setOpenMenuId(null)
                            }}
                          >
                            {item.read ? <HiOutlineEyeSlash /> : <HiOutlineEye />}
                            {item.read ? 'Mark as unread' : 'Mark as read'}
                          </button>
                          <button
                            type="button"
                            role="menuitem"
                            className="notification-menu-item notification-menu-item-danger"
                            onClick={() => {
                              removeNotification(item.id)
                              setOpenMenuId(null)
                            }}
                          >
                            <HiOutlineTrash />
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </main>

      <BottomNav />
    </div>
  )
}

export default NotificationsPage
