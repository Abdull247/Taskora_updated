import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { HiArrowLeft } from 'react-icons/hi2'
import DashboardTopbar from '../../components/DashboardTopbar/DashboardTopbar'
import BottomNav from '../../components/BottomNav/BottomNav'
import './NotificationsPage.css'

interface NotificationItem {
  id: string
  title: string
  description: string
  when: string
  read: boolean
}

const initialNotifications: NotificationItem[] = [
  {
    id: '1',
    title: 'Task Approved!',
    description: 'Your submission for "Follow @OfficialMTN" was approved. ₦150 has been added to your wallet.',
    when: '2 mins ago',
    read: false,
  },
  {
    id: '2',
    title: 'New Tasks Available',
    description: '12 new tasks have been posted in your preferred categories.',
    when: '1 hour ago',
    read: false,
  },
  {
    id: '3',
    title: 'Withdrawal Processed',
    description: 'Your withdrawal of ₦5,000 to GTBank ••••4521 was successful.',
    when: 'Yesterday',
    read: true,
  },
  {
    id: '4',
    title: 'Task Rejected',
    description: 'Your submission for "Download BantuRide" was rejected. Reason: Account not verified.',
    when: '2 days ago',
    read: true,
  },
]

function NotificationsPage() {
  const navigate = useNavigate()
  const [notifications, setNotifications] = useState(initialNotifications)

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
  }

  return (
    <div className="notifications-page">
      <DashboardTopbar initials="CE" hasNotifications={notifications.some((n) => !n.read)} />

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
          <button type="button" className="notifications-mark-read" onClick={handleMarkAllRead}>
            Mark all read
          </button>
        </div>

        <div className="notifications-list">
          {notifications.map((item) => (
            <div
              key={item.id}
              className={`notification-card ${!item.read ? 'notification-card-unread' : ''}`}
            >
              {!item.read && <span className="notification-dot" />}
              <div className="notification-body">
                <h3 className="notification-title">{item.title}</h3>
                <p className="notification-description">{item.description}</p>
                <span className="notification-when">{item.when}</span>
              </div>
            </div>
          ))}
        </div>
      </main>

      <BottomNav />
    </div>
  )
}

export default NotificationsPage
