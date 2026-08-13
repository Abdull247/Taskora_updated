import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import {
  HiArrowLeft,
  HiCheckCircle,
  HiOutlineCamera,
  HiOutlineChatBubbleOvalLeft,
  HiOutlineLink,
  HiOutlineVideoCamera,
  HiOutlineXCircle,
  HiOutlineXMark,
} from 'react-icons/hi2'
import DashboardTopbar from '../../components/DashboardTopbar/DashboardTopbar'
import BottomNav from '../../components/BottomNav/BottomNav'
import { getTaskById, getTaskSubmissions, approveSubmission, rejectSubmission } from '../../lib/tasks'
import { ApiRequestError } from '../../lib/api'
import type { SubmissionListItem, SubmissionProof } from '../../types/api'
import './TaskSubmissionsPage.css'

type StatusFilter = 'all' | 'pending' | 'approved' | 'rejected'

interface RejectingState {
  id: string
  reason: string
}

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
  const [rejecting, setRejecting] = useState<RejectingState | null>(null)
  const [busyId, setBusyId] = useState<string | null>(null)

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

  const handleApprove = async (id: string) => {
    setBusyId(id)
    try {
      const res = await approveSubmission(id)
      setSubmissions((prev) =>
        prev.map((s) =>
          s.id === id ? { ...s, status: 'approved', reviewed_at: new Date().toISOString() } : s
        )
      )
      toast.success(`Approved — worker paid ${formatNairaKobo(res.workerPaidKobo)}.`)
    } catch (err) {
      if (err instanceof ApiRequestError && err.status === 401) {
        navigate('/login', { replace: true })
        return
      }
      const message =
        err instanceof ApiRequestError && err.message ? err.message : 'Could not approve this submission.'
      toast.error(message)
    } finally {
      setBusyId(null)
    }
  }

  const handleReject = async (id: string, reason: string) => {
    setBusyId(id)
    try {
      await rejectSubmission(id, reason.trim())
      setSubmissions((prev) =>
        prev.map((s) =>
          s.id === id
            ? { ...s, status: 'rejected', rejection_reason: reason.trim(), reviewed_at: new Date().toISOString() }
            : s
        )
      )
      setRejecting(null)
      toast.success('Submission rejected.')
    } catch (err) {
      if (err instanceof ApiRequestError && err.status === 401) {
        navigate('/login', { replace: true })
        return
      }
      const message =
        err instanceof ApiRequestError && err.message ? err.message : 'Could not reject this submission.'
      toast.error(message)
    } finally {
      setBusyId(null)
    }
  }

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
                  <div className="sub-card" key={sub.id}>
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

                    {sub.status === 'rejected' && sub.rejection_reason && (
                      <div className="sub-rejection">
                        <HiOutlineXCircle />
                        <div>
                          <span className="sub-rejection-label">Rejection reason</span>
                          <p>{sub.rejection_reason}</p>
                        </div>
                      </div>
                    )}

                    {sub.status === 'pending' && (
                      <div className="sub-actions">
                        {rejecting && rejecting.id === sub.id ? (
                          <div className="sub-reject-form">
                            <textarea
                              className="sub-reject-input"
                              placeholder="Tell the worker why this was rejected (shown to them)"
                              value={rejecting.reason}
                              onChange={(e) =>
                                setRejecting({ id: sub.id, reason: e.target.value })
                              }
                            />
                            <div className="sub-reject-form-actions">
                              <button
                                type="button"
                                className="sub-btn sub-btn-ghost"
                                onClick={() => setRejecting(null)}
                              >
                                Cancel
                              </button>
                              <button
                                type="button"
                                className="sub-btn sub-btn-reject"
                                disabled={busyId === sub.id || !rejecting.reason.trim()}
                                onClick={() => handleReject(sub.id, rejecting.reason)}
                              >
                                {busyId === sub.id ? 'Rejecting…' : 'Confirm rejection'}
                              </button>
                            </div>
                          </div>
                        ) : (
                          <>
                            <button
                              type="button"
                              className="sub-btn sub-btn-approve"
                              disabled={busyId !== null}
                              onClick={() => handleApprove(sub.id)}
                            >
                              <HiCheckCircle />
                              {busyId === sub.id ? 'Processing…' : 'Approve & pay'}
                            </button>
                            <button
                              type="button"
                              className="sub-btn sub-btn-ghost sub-btn-outline"
                              disabled={busyId !== null}
                              onClick={() => setRejecting({ id: sub.id, reason: '' })}
                            >
                              <HiOutlineXMark />
                              Reject
                            </button>
                          </>
                        )}
                      </div>
                    )}
                  </div>
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

function formatNairaKobo(kobo: number) {
  const naira = kobo / 100
  return `₦${naira.toLocaleString('en-NG', {
    minimumFractionDigits: naira % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  })}`
}

export default TaskSubmissionsPage
