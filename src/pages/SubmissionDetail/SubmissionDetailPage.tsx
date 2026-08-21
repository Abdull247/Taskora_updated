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
import type { SubmissionListItem } from '../../types/api'
import './SubmissionDetailPage.css'

function formatWhen(iso: string) {
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return '—'
  return date.toLocaleString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
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

function formatNairaKobo(kobo: number) {
  const naira = kobo / 100
  return `₦${naira.toLocaleString('en-NG', {
    minimumFractionDigits: naira % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  })}`
}

function SubmissionDetailPage() {
  const { id: taskId, submissionId } = useParams<{ id: string; submissionId: string }>()
  const navigate = useNavigate()

  const [taskTitle, setTaskTitle] = useState<string | null>(null)
  const [submission, setSubmission] = useState<SubmissionListItem | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [rejecting, setRejecting] = useState(false)
  const [rejectReason, setRejectReason] = useState('')
  const [busy, setBusy] = useState(false)

  const load = useCallback(() => {
    if (!taskId || !submissionId) return
    let cancelled = false
    setLoading(true)
    setError(null)

    Promise.all([getTaskById(taskId), getTaskSubmissions(taskId)])
      .then(([detail, submissionsRes]) => {
        if (cancelled) return
        setTaskTitle(detail.task.title)
        const found = submissionsRes.submissions.find((s) => s.id === submissionId)
        if (!found) {
          setError('This submission could not be found.')
          return
        }
        setSubmission(found)
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
        setError('Could not load this submission. Check your connection and try again.')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [taskId, submissionId, navigate])

  useEffect(() => {
    const cancel = load()
    return cancel
  }, [load])

  const proof = submission?.proof

  const proofSections = useMemo(() => {
    if (!proof) return []
    const sections: { key: string; label: string; Icon: React.ComponentType; items: string[] }[] = []
    if (proof.screenshot?.length) {
      sections.push({ key: 'screenshot', label: 'Screenshots', Icon: HiOutlineCamera, items: proof.screenshot })
    }
    if (proof.link?.length) {
      sections.push({ key: 'link', label: 'Links', Icon: HiOutlineLink, items: proof.link })
    }
    if (proof.video?.length) {
      sections.push({
        key: 'video',
        label: 'Videos',
        Icon: HiOutlineVideoCamera,
        items: proof.video.map((v) => `${v.url} (${v.durationSeconds}s)`),
      })
    }
    return sections
  }, [proof])

  const handleApprove = async () => {
    if (!submission) return
    setBusy(true)
    try {
      const res = await approveSubmission(submission.id)
      setSubmission((prev) => (prev ? { ...prev, status: 'approved', reviewed_at: new Date().toISOString() } : prev))
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
      setBusy(false)
    }
  }

  const handleReject = async () => {
    if (!submission) return
    setBusy(true)
    try {
      await rejectSubmission(submission.id, rejectReason.trim())
      setSubmission((prev) =>
        prev
          ? { ...prev, status: 'rejected', rejection_reason: rejectReason.trim(), reviewed_at: new Date().toISOString() }
          : prev
      )
      setRejecting(false)
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
      setBusy(false)
    }
  }

  return (
    <div className="subdetail-page">
      <DashboardTopbar hasNotifications />

      <main className="subdetail-main">
        <Link to={`/dashboard/tasks/${taskId}/submissions`} className="subdetail-back">
          <HiArrowLeft /> Submissions
        </Link>

        {loading ? (
          <div className="subdetail-loading">
            <div className="subdetail-skel subdetail-skel-top" />
            <div className="subdetail-skel subdetail-skel-line" />
            <div className="subdetail-skel subdetail-skel-line subdetail-skel-short" />
          </div>
        ) : error ? (
          <div className="subdetail-empty">
            <p>{error}</p>
            <button type="button" className="subdetail-retry" onClick={load}>
              Try again
            </button>
          </div>
        ) : submission ? (
          <>
            <div className="subdetail-heading">
              <span className={`subdetail-status subdetail-status-${submission.status}`}>
                {submission.status === 'pending'
                  ? 'Pending'
                  : submission.status === 'approved'
                  ? 'Approved'
                  : 'Rejected'}
              </span>
              {taskTitle && <p className="subdetail-task-title">For "{taskTitle}"</p>}
            </div>

            {/* Worker card */}
            <div className="subdetail-card subdetail-worker-card">
              <span className="subdetail-worker-avatar">
                {workerName(submission).charAt(0).toUpperCase()}
              </span>
              <div className="subdetail-worker-info">
                <span className="subdetail-worker-name">{workerName(submission)}</span>
                <span className="subdetail-worker-when">Submitted {formatWhen(submission.submitted_at)}</span>
              </div>
            </div>

            {/* Proof */}
            <section className="subdetail-section">
              <span className="subdetail-section-label">Submitted proof</span>
              <div className="subdetail-card subdetail-proof-card">
                {proofSections.length === 0 && !proof?.text?.length && (
                  <p className="subdetail-proof-none">No proof attached</p>
                )}

                {proofSections.map((section) => (
                  <div className="subdetail-proof-group" key={section.key}>
                    <div className="subdetail-proof-group-head">
                      <section.Icon />
                      <span>{section.label}</span>
                    </div>
                    <div className="subdetail-proof-items">
                      {section.items.map((item, i) =>
                        section.key === 'screenshot' ? (
                          <a
                            key={i}
                            href={item}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="subdetail-shot-thumb"
                          >
                            <img src={item} alt={`Screenshot ${i + 1}`} loading="lazy" />
                          </a>
                        ) : (
                          <a
                            key={i}
                            href={item.split(' (')[0]}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="subdetail-proof-link"
                          >
                            {item}
                          </a>
                        )
                      )}
                    </div>
                  </div>
                ))}

                {proof?.text?.length ? (
                  <div className="subdetail-proof-group">
                    <div className="subdetail-proof-group-head">
                      <HiOutlineChatBubbleOvalLeft />
                      <span>Text response</span>
                    </div>
                    <div className="subdetail-proof-text-list">
                      {proof.text.map((t, i) => (
                        <p key={i} className="subdetail-proof-text">
                          {t}
                        </p>
                      ))}
                    </div>
                  </div>
                ) : null}
              </div>
            </section>

            {/* Rejection reason, if already rejected */}
            {submission.status === 'rejected' && submission.rejection_reason && (
              <div className="subdetail-rejection">
                <HiOutlineXCircle />
                <div>
                  <span className="subdetail-rejection-label">Rejection reason</span>
                  <p>{submission.rejection_reason}</p>
                </div>
              </div>
            )}

            {/* Actions — only for pending submissions */}
            {submission.status === 'pending' && (
              <section className="subdetail-section">
                {rejecting ? (
                  <div className="subdetail-reject-form">
                    <textarea
                      className="subdetail-reject-input"
                      placeholder="Tell the worker why this was rejected (shown to them)"
                      value={rejectReason}
                      onChange={(e) => setRejectReason(e.target.value)}
                    />
                    <div className="subdetail-reject-form-actions">
                      <button
                        type="button"
                        className="subdetail-btn subdetail-btn-ghost"
                        onClick={() => setRejecting(false)}
                        disabled={busy}
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        className="subdetail-btn subdetail-btn-reject"
                        disabled={busy || !rejectReason.trim()}
                        onClick={handleReject}
                      >
                        {busy ? 'Rejecting…' : 'Confirm rejection'}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="subdetail-actions">
                    <button
                      type="button"
                      className="subdetail-btn subdetail-btn-approve"
                      disabled={busy}
                      onClick={handleApprove}
                    >
                      <HiCheckCircle />
                      {busy ? 'Processing…' : 'Approve & pay'}
                    </button>
                    <button
                      type="button"
                      className="subdetail-btn subdetail-btn-outline"
                      disabled={busy}
                      onClick={() => setRejecting(true)}
                    >
                      <HiOutlineXMark />
                      Reject
                    </button>
                  </div>
                )}
              </section>
            )}
          </>
        ) : null}
      </main>

      <BottomNav />
    </div>
  )
}

export default SubmissionDetailPage
