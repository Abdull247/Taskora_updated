import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  HiArrowLeft,
  HiArrowUpRight,
  HiOutlineClipboardDocumentCheck,
  HiOutlineClock,
} from 'react-icons/hi2'
import DashboardTopbar from '../../components/DashboardTopbar/DashboardTopbar'
import BottomNav from '../../components/BottomNav/BottomNav'
import { getMyTasks, getTaskSubmissions } from '../../lib/tasks'
import { ApiRequestError } from '../../lib/api'
import { formatNairaFromKobo } from '../../lib/wallet'
import type { TaskListItem } from '../../types/api'
import './ReviewSubmissionsPage.css'

interface QueueRow extends TaskListItem {
  pendingCount: number
  approvedCount: number
  rejectedCount: number
  totalCount: number
}

function categoryLabel(name: string) {
  return name
    .toLowerCase()
    .split('_')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')
}

function ReviewSubmissionsPage() {
  const navigate = useNavigate()

  const [rows, setRows] = useState<QueueRow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(() => {
    let cancelled = false
    setLoading(true)
    setError(null)

    getMyTasks()
      .then(async ({ tasks }) => {
        const counts = await Promise.all(
          tasks.map(async (task) => {
            try {
              const { submissions } = await getTaskSubmissions(task.id)
              return {
                pendingCount: submissions.filter((s) => s.status === 'pending').length,
                approvedCount: submissions.filter((s) => s.status === 'approved').length,
                rejectedCount: submissions.filter((s) => s.status === 'rejected').length,
                totalCount: submissions.length,
              }
            } catch {
              return { pendingCount: 0, approvedCount: 0, rejectedCount: 0, totalCount: 0 }
            }
          })
        )

        const queue: QueueRow[] = tasks
          .map((task, i) => ({ ...task, ...counts[i] }))
          .sort((a, b) => b.pendingCount - a.pendingCount)

        if (!cancelled) setRows(queue)
      })
      .catch((err) => {
        if (cancelled) return
        if (err instanceof ApiRequestError && err.status === 401) {
          navigate('/login', { replace: true })
          return
        }
        setError('Could not load your review queue. Please try again.')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [navigate])

  useEffect(() => {
    const cancel = load()
    return cancel
  }, [load])

  const totalPending = useMemo(
    () => rows.reduce((sum, row) => sum + row.pendingCount, 0),
    [rows]
  )

  return (
    <div className="review-page">
      <DashboardTopbar hasNotifications />

      <main className="review-main">
        <Link to="/dashboard/tasks" className="rv-back">
          <HiArrowLeft /> Your tasks
        </Link>

        <div className="rv-heading">
          <h1>Review submissions</h1>
          <p>
            {loading
              ? 'Building your review queue…'
              : totalPending === 0
              ? 'No submissions awaiting review.'
              : `${totalPending} submission${totalPending === 1 ? '' : 's'} awaiting review.`}
          </p>
        </div>

        {loading ? (
          <div className="rv-loading">
            {[0, 1, 2].map((i) => (
              <div className="rv-skel-card" key={i}>
                <div className="rv-skel rv-skel-top" />
                <div className="rv-skel rv-skel-line" />
                <div className="rv-skel rv-skel-line rv-skel-short" />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="rv-empty">
            <p>{error}</p>
            <button type="button" className="rv-retry" onClick={load}>
              Try again
            </button>
          </div>
        ) : rows.length === 0 ? (
          <div className="rv-empty">
            <span className="rv-empty-icon">
              <HiOutlineClipboardDocumentCheck />
            </span>
            <p>You have not posted any tasks yet.</p>
            <Link to="/dashboard/tasks/create" className="rv-retry rv-create">
              Create your first task
            </Link>
          </div>
        ) : (
          <div className="rv-list">
            {rows.map((row) => (
              <Link key={row.id} to={`/dashboard/tasks/${row.id}/submissions`} className="rv-card">
                <div className="rv-card-top">
                  <span className="rv-chip rv-chip-cat">{categoryLabel(row.category_name)}</span>
                  {row.pendingCount > 0 && (
                    <span className="rv-chip rv-chip-pending">{row.pendingCount} pending</span>
                  )}
                </div>

                <h3 className="rv-title">{row.title || row.job_description}</h3>

                <div className="rv-card-meta">
                  <span className="rv-meta-item">
                    <HiOutlineClipboardDocumentCheck /> {row.totalCount} submission
                    {row.totalCount === 1 ? '' : 's'}
                  </span>
                  <span className="rv-meta-item">
                    <HiOutlineClock /> {formatNairaFromKobo(row.worker_earn_kobo)} / task
                  </span>
                </div>

                <div className="rv-card-foot">
                  <span className="rv-breakdown">
                    {row.approvedCount > 0 && <span className="rv-ok">{row.approvedCount} approved</span>}
                    {row.rejectedCount > 0 && <span className="rv-no">{row.rejectedCount} rejected</span>}
                    {row.approvedCount === 0 && row.rejectedCount === 0 && (
                      <span className="rv-muted">Nothing reviewed yet</span>
                    )}
                  </span>
                  <span className="rv-review-link">
                    Review <HiArrowUpRight />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>

      <BottomNav />
    </div>
  )
}

export default ReviewSubmissionsPage
