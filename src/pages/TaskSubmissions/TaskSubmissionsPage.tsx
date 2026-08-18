import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import {
  HiArrowLeft,
  HiArrowUpRight,
  HiOutlineCamera,
  HiOutlineChatBubbleOvalLeft,
  HiOutlineLink,
  HiOutlineVideoCamera,
} from 'react-icons/hi2'
import DashboardTopbar from '../../components/DashboardTopbar/DashboardTopbar'
import BottomNav from '../../components/BottomNav/BottomNav'
import { getTaskById, getTaskSubmissions } from '../../lib/tasks'
import { ApiRequestError } from '../../lib/api'
import type { SubmissionListItem, SubmissionProof } from '../../types/api'
import './TaskSubmissionsPage.css'

type StatusFilter = 'all' | 'pending' | 'approved' | 'rejected'

function formatWhen(iso: string) {
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return '—'
  return date.toLocaleString('en-GB', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function workerName(sub: SubmissionListItem) {
  if (sub.worker?.username) return sub.worker.username
  if (sub.worker?.first_name) {
    return `${sub.worker.first_name} ${sub.worker.last_name ?? ''}`.trim()
  }
  return sub.worker_id.slice(0, 8)
}

function ProofSummary({ proof }: { proof: SubmissionProof }) {
  const chips: { label: string; Icon: React.ComponentType }[] = []
  if (proof.screenshot?.length) {
    chips.push({
      label: `${proof.screenshot.length} screenshot${proof.screenshot.length > 1 ? 's' : ''}`,
      Icon: HiOutlineCamera,
    })
  }
  if (proof.link?.length) {
    chips.push({ label: `${proof.link.length} link${proof.link.length > 1 ? 's' : ''}`, Icon: HiOutlineLink })
  }
  if (proof.video?.length) {
    chips.push({ label: `${proof.video.length} video${proof.video.length > 1 ? 's' : ''}`, Icon: HiOutlineVideoCamera })
  }

  const text = proof.text?.[0]

  return (
    <div className="sub-proof">
      {chips.length === 0 && !text ? (
        <span className="sub-proof-none">No proof attached</span>
      ) : (
        <div className="sub-proof-chips">
          {chips.map(({ label, Icon }, i) => (
            <span className="sub-proof-chip" key={i}>
              <Icon /> {label}
            </span>
          ))}
        </div>
      )}
      {text && (
        <div className="sub-proof-text">
          <HiOutlineChatBubbleOvalLeft />
          <span>{text}</span>
        </div>
      )}
    </div>
  )
}

function TaskSubmissionsPage() {
  const { id: taskId } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const [taskTitle, setTaskTitle] = useState<string | null>(null)
  const [submissions, setSubmissions] = useState<SubmissionListItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [filter, setFilter] = useState<StatusFilter>('all')

  const load = useCallback(() => {
    if (!taskId) return
    let cancelled = false
    setLoading(true)
    setError(null)

    Promise.all([getTaskById(taskId), getTaskSubmissions(taskId)])
      .then(([detail, submissionsRes]) => {
        if (cancelled) return
        setTaskTitle(detail.task.title)
        setSubmissions(submissionsRes.submissions)
      })
      .catch((err) => {
        if (cancelled) return
        if (err instanceof ApiRequestError && err.status === 401) {
          navigate('/login', { replace: true })
          return
        }
        if (err instanceof ApiRequestError && err.status === 404) {
          setError('This task or its submissions could not be found.')
          return
        }
        setError('Could not load submissions. Check your connection and try again.')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [taskId, navigate])

  useEffect(() => {
    const cancel = load()
    return cancel
  }, [load])

  const filtered = useMemo(() => {
    if (filter === 'all') return submissions
    return submissions.filter((s) => s.status === filter)
  }, [submissions, filter])

  const counts = useMemo(
    () => ({
      all: submissions.length,
      pending: submissions.filter((s) => s.status === 'pending').length,
      approved: submissions.filter((s) => s.status === 'approved').length,
      rejected: submissions.filter((s) => s.status === 'rejected').length,
    }),
    [submissions]
  )

  const pendingCount = counts.pending

  return (
    <div className="submissions-page">
      <DashboardTopbar initials="··" hasNotifications />

      <main className="submissions-main">
        <Link to={`/dashboard/tasks/${taskId}`} className="sub-back">
          <HiArrowLeft /> Task details
        </Link>

        <div className="sub-heading">
          <h1>Submissions</h1>
          <p>{loading ? 'Loading…' : taskTitle ? `For "${taskTitle}"` : `${counts.all} submission${counts.all === 1 ? '' : 's'}`}</p>
        </div>

        {loading ? (
          <div className="sub-loading">
            {[0, 1, 2].map((i) => (
              <div className="sub-skel-card" key={i}>
                <div className="sub-skel sub-skel-top" />
                <div className="sub-skel sub-skel-line" />
                <div className="sub-skel sub-skel-line sub-skel-short" />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="sub-empty">
            <p>{error}</p>
            <button type="button" className="sub-retry" onClick={load}>
              Try again
            </button>
          </div>
        ) : (
          <>
            <div className="sub-filters">
              {(['all', 'pending', 'approved', 'rejected'] as StatusFilter[]).map((f) => (
                <button
                  key={f}
                  type="button"
                  className={`sub-filter ${filter === f ? 'sub-filter-active' : ''}`}
                  onClick={() => setFilter(f)}
                >
                  {f === 'all' ? 'All' : f.charAt(0).toUpperCase() + f.slice(1)}
                  <span className="sub-filter-count">{counts[f]}</span>
                </button>
              ))}
            </div>

            {pendingCount > 0 && (
              <div className="sub-pending-note">
                {pendingCount} submission{pendingCount === 1 ? '' : 's'} awaiting your review
              </div>
            )}

            {filtered.length === 0 ? (
              <div className="sub-empty">
                <p>
                  {filter === 'all'
                    ? 'No submissions yet for this task.'
                    : `No ${filter} submissions.`}
                </p>
              </div>
            ) : (
              <div className="sub-list">
                {filtered.map((sub) => (
                  <Link
                    key={sub.id}
                    to={`/dashboard/tasks/${taskId}/submissions/${sub.id}`}
                    className="sub-card sub-card-link"
                  >
                    <div className="sub-card-head">
                      <div className="sub-worker">
                        <span className="sub-worker-avatar">
                          {workerName(sub).charAt(0).toUpperCase()}
                        </span>
                        <div className="sub-worker-info">
                          <span className="sub-worker-name">{workerName(sub)}</span>
                          <span className="sub-worker-when">{formatWhen(sub.submitted_at)}</span>
                        </div>
                      </div>
                      <span className={`sub-status sub-status-${sub.status}`}>
                        {sub.status === 'pending'
                          ? 'Pending'
                          : sub.status === 'approved'
                          ? 'Approved'
                          : 'Rejected'}
                      </span>
                    </div>

                    <ProofSummary proof={sub.proof} />

                    <div className="sub-card-foot">
                      <span className="sub-view-link">
                        View details <HiArrowUpRight />
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </>
        )}
      </main>

      <BottomNav />
    </div>
  )
}

export default TaskSubmissionsPage
