import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import type { IconType } from 'react-icons'
import {
  HiArrowLeft,
  HiArrowUpRight,
  HiOutlineCamera,
  HiOutlineChatBubbleOvalLeft,
  HiOutlineCheckCircle,
  HiOutlineClock,
  HiOutlineFaceFrown,
  HiOutlineLightBulb,
  HiOutlineStar,
  HiOutlineUser,
  HiOutlineUsers,
} from 'react-icons/hi2'
import DashboardTopbar from '../../components/DashboardTopbar/DashboardTopbar'
import BottomNav from '../../components/BottomNav/BottomNav'
import TaskDetailsSkeleton from '../../components/TaskDetailsSkeleton/TaskDetailsSkeleton'
import TaskSubmission from '../../components/TaskSubmission/TaskSubmission'
import { getTaskById } from '../../lib/tasks'
import { getMe, getStoredRole } from '../../lib/me'
import { ApiRequestError } from '../../lib/api'
import type { MeUser, TaskDetail, TaskStatus } from '../../types/api'
import './TaskDetailsPage.css'

function formatNaira(kobo: number) {
  const naira = kobo / 100
  return `₦${naira.toLocaleString('en-NG', {
    minimumFractionDigits: naira % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  })}`
}

function humanizeLabel(name: string) {
  return name
    .toLowerCase()
    .split('_')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')
}

function statusLabel(status: TaskStatus) {
  const labels: Record<TaskStatus, string> = {
    draft: 'Draft',
    active: 'Active',
    paused: 'Paused',
    completed: 'Completed',
    cancelled: 'Cancelled',
    expired: 'Expired',
  }
  return labels[status] ?? status
}

function formatDate(iso: string) {
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return '—'
  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

function timeLeftLabel(expiresAt: string) {
  const diffMs = new Date(expiresAt).getTime() - Date.now()
  if (diffMs <= 0) return 'Expired'
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24))
  if (days >= 1) return `${days} day${days === 1 ? '' : 's'} left`
  const hours = Math.floor(diffMs / (1000 * 60 * 60))
  if (hours >= 1) return `${hours} hour${hours === 1 ? '' : 's'} left`
  const minutes = Math.max(1, Math.floor(diffMs / (1000 * 60)))
  return `${minutes} minute${minutes === 1 ? '' : 's'} left`
}

interface ProofItem {
  key: string
  label: string
  sub: string
  required: boolean
  Icon: IconType
}

function SpecRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="td-spec-row">
      <span>{label}</span>
      <div className="td-spec-value">{children}</div>
    </div>
  )
}

function TaskDetailsPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const [task, setTask] = useState<TaskDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [notFound, setNotFound] = useState(false)
  const [role, setRole] = useState<MeUser['role'] | null>(() => getStoredRole())

  useEffect(() => {
    let cancelled = false
    getMe()
      .then((me) => {
        if (!cancelled) setRole(me.user.role)
      })
      .catch((err) => {
        if (cancelled) return
        if (err instanceof ApiRequestError && err.status === 401) {
          navigate('/login', { replace: true })
          return
        }
        if (!cancelled) setRole('worker')
      })
    return () => {
      cancelled = true
    }
  }, [navigate])

  const isAdvertiser = role === 'advertiser'

  const loadTask = useCallback(() => {
    if (!id) {
      setNotFound(true)
      setError('This task no longer exists or the link is wrong.')
      setLoading(false)
      return
    }

    let cancelled = false
    setLoading(true)
    setError(null)
    setNotFound(false)

    getTaskById(id)
      .then(({ task: fetched }) => {
        if (!cancelled) setTask(fetched)
      })
      .catch((err) => {
        if (cancelled) return
        if (err instanceof ApiRequestError && err.status === 401) {
          navigate('/login', { replace: true })
          return
        }
        if (err instanceof ApiRequestError && err.status === 404) {
          setNotFound(true)
          setError('This task no longer exists or the link is wrong.')
          return
        }
        setError('Could not load this task. Check your connection and try again.')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [id, navigate])

  useEffect(() => {
    const cancel = loadTask()
    return cancel
  }, [loadTask])

  const proofItems = useMemo<ProofItem[]>(() => {
    if (!task) return []
    const { text, screenshot } = task.proof_config
    const items: ProofItem[] = []

    if (text.isAllowed) {
      const unit = text.maxCount === 1 ? 'text response' : 'text responses'
      items.push({
        key: 'text',
        label: 'Text response',
        sub:
          text.minCount === text.maxCount
            ? `${text.maxCount} ${unit}`
            : `${text.minCount}–${text.maxCount} ${unit}`,
        required: text.isRequired,
        Icon: HiOutlineChatBubbleOvalLeft,
      })
    }

    if (screenshot.isAllowed) {
      const unit = screenshot.maxCount === 1 ? 'screenshot' : 'screenshots'
      items.push({
        key: 'screenshot',
        label: 'Screenshot',
        sub:
          screenshot.minCount === screenshot.maxCount
            ? `${screenshot.maxCount} ${unit}`
            : `${screenshot.minCount}–${screenshot.maxCount} ${unit}`,
        required: screenshot.isRequired,
        Icon: HiOutlineCamera,
      })
    }

    return items
  }, [task])

  const canStart = useMemo(() => {
    if (!task) return false
    if (task.status !== 'active') return false
    if (task.spots_remaining <= 0) return false
    if (!task.job_link) return false
    if (new Date(task.expires_at).getTime() <= Date.now()) return false
    return true
  }, [task])

  const canSubmit = useMemo(() => {
    if (!task) return false
    if (task.status !== 'active') return false
    if (task.spots_remaining <= 0) return false
    if (new Date(task.expires_at).getTime() <= Date.now()) return false
    return true
  }, [task])

  const unavailableLabel = useMemo(() => {
    if (!task) return 'Unavailable'
    if (task.status === 'expired') return 'Task expired'
    if (task.status === 'completed') return 'Task completed'
    if (task.status === 'cancelled') return 'Task cancelled'
    if (task.status === 'paused') return 'Task paused'
    if (task.spots_remaining <= 0) return 'No spots left'
    if (!task.job_link) return 'No link available'
    return 'Unavailable'
  }, [task])

  return (
    <div className="task-detail-page">
      <DashboardTopbar initials="··" hasNotifications />

      <main className="task-detail-main">
        <Link to="/dashboard/tasks" className="td-back-link">
          <HiArrowLeft /> Browse Tasks
        </Link>

        {loading ? (
          <TaskDetailsSkeleton />
        ) : error ? (
          <div className="td-error">
            <span className="td-error-icon">
              <HiOutlineFaceFrown />
            </span>
            <h2>{notFound ? 'Task not found' : 'Could not load this task'}</h2>
            <p>{error}</p>
            <button type="button" className="td-retry-btn" onClick={loadTask}>
              Try again
            </button>
            <Link to="/dashboard/tasks" className="td-back-link">
              Back to Browse Tasks
            </Link>
          </div>
        ) : task ? (
          <>
            {/* Hero */}
            <section className="td-hero">
              <div className="td-hero-tags">
                <span className="td-chip td-chip-category">
                  {humanizeLabel(task.category_name)}
                </span>
                {task.subcategory_name && (
                  <span className="td-chip td-chip-sub">
                    {humanizeLabel(task.subcategory_name)}
                  </span>
                )}
                <span className={`td-chip td-chip-status td-chip-status-${task.status}`}>
                  {statusLabel(task.status)}
                </span>
              </div>

              <h1 className="td-title">{task.title}</h1>

              <div className="td-reward-line">
                <span className="td-reward">{formatNaira(Number(task.worker_earn_kobo))}</span>
                <span className="td-reward-sub">per task</span>
              </div>

              <div className="td-hero-meta">
                <span className="td-meta-item">
                  <HiOutlineUsers /> {task.spots_remaining} spot
                  {task.spots_remaining === 1 ? '' : 's'} left
                </span>
                <span className="td-meta-item">
                  <HiOutlineClock /> {timeLeftLabel(task.expires_at)}
                </span>
                <span className="td-meta-item">
                  <HiOutlineUser /> by {task.advertiser_username}
                </span>
              </div>

              <div className="td-hero-actions">
                {isAdvertiser ? (
                  <Link
                    to={`/dashboard/tasks/${task.id}/submissions`}
                    className="td-cta-primary"
                  >
                    View Submissions <HiArrowUpRight />
                  </Link>
                ) : canStart ? (
                  <a
                    href={task.job_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="td-cta-primary"
                  >
                    Start Task <HiArrowUpRight />
                  </a>
                ) : (
                  <button type="button" className="td-cta-primary td-cta-disabled" disabled>
                    {unavailableLabel}
                  </button>
                )}
              </div>
            </section>

            {/* About this task */}
            <section className="td-section">
              <span className="td-section-label">About this task</span>
              <div className="td-card">
                <p className="td-body">{task.job_description}</p>
              </div>
            </section>

            {/* Instructions */}
            <section className="td-section">
              <span className="td-section-label">Instructions</span>
              <div className="td-card td-steps">
                {task.instructions.map((step, i) => (
                  <div className="td-step" key={i}>
                    <span className="td-step-num">{i + 1}</span>
                    <p className="td-body">{step}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Requirements */}
            {task.requirements.length > 0 && (
              <section className="td-section">
                <span className="td-section-label">Requirements</span>
                <div className="td-card">
                  <ul className="td-req-list">
                    {task.requirements.map((req, i) => (
                      <li key={i}>
                        <HiOutlineCheckCircle />
                        <span>{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </section>
            )}

            {/* Proof required */}
            <section className="td-section">
              <span className="td-section-label">Proof required</span>
              <div className="td-card td-proof">
                {proofItems.length === 0 ? (
                  <p className="td-body td-muted">
                    No proof required — submissions are approved automatically.
                  </p>
                ) : (
                  proofItems.map((item) => (
                    <div className="td-proof-row" key={item.key}>
                      <span className="td-proof-icon">
                        <item.Icon />
                      </span>
                      <div className="td-proof-info">
                        <span className="td-proof-title">{item.label}</span>
                        <span className="td-proof-sub">{item.sub}</span>
                      </div>
                      <span
                        className={`td-proof-badge ${
                          item.required
                            ? 'td-proof-badge-required'
                            : 'td-proof-badge-optional'
                        }`}
                      >
                        {item.required ? 'Required' : 'Optional'}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </section>

            {/* Submission */}
            {isAdvertiser ? (
              <section className="td-section">
                <span className="td-section-label">Submissions</span>
                <div className="td-card td-advertiser-submissions">
                  <p className="td-body td-muted">
                    Review work submitted by taskers, approve valid proof to pay out
                    instantly, or reject with a reason so they can resubmit.
                  </p>
                  <Link to={`/dashboard/tasks/${task.id}/submissions`} className="td-cta-primary">
                    Review submissions <HiArrowUpRight />
                  </Link>
                </div>
              </section>
            ) : (
              <TaskSubmission
                taskId={task.id}
                proofConfig={task.proof_config}
                disabled={!canSubmit}
              />
            )}

            {/* Evaluation */}
            {task.task_data.scenario || task.task_data.evaluationCriteria.length > 0 ? (
              <section className="td-section">
                <div className="td-section-header">
                  <span className="td-section-label">How you'll be evaluated</span>
                  {task.task_data.experienceType && (
                    <span className="td-section-badge">
                      {humanizeLabel(task.task_data.experienceType)}
                    </span>
                  )}
                </div>
                <div className="td-card">
                  {task.task_data.scenario && (
                    <div className="td-scenario">
                      <span className="td-scenario-icon">
                        <HiOutlineLightBulb />
                      </span>
                      <p className="td-body">{task.task_data.scenario}</p>
                    </div>
                  )}

                  <ul className="td-criteria">
                    {task.task_data.evaluationCriteria.map((criterion) =>
                      criterion.type === 'RATING' ? (
                        <li key={criterion.id} className="td-criterion">
                          <span className="td-criterion-icon td-criterion-icon-rating">
                            <HiOutlineStar />
                          </span>
                          <div className="td-criterion-info">
                            <span className="td-criterion-question">{criterion.question}</span>
                            <span className="td-criterion-meta">
                              Rate on a scale of 1–{criterion.scale}
                            </span>
                          </div>
                        </li>
                      ) : (
                        <li key={criterion.id} className="td-criterion">
                          <span className="td-criterion-icon td-criterion-icon-text">
                            <HiOutlineChatBubbleOvalLeft />
                          </span>
                          <div className="td-criterion-info">
                            <span className="td-criterion-question">{criterion.question}</span>
                            <span className="td-criterion-meta">Written answer</span>
                          </div>
                        </li>
                      )
                    )}
                  </ul>
                </div>
              </section>
            ) : null}

            {/* Task details */}
            <section className="td-section">
              <span className="td-section-label">Task details</span>
              <div className="td-card td-spec">
                <SpecRow label="Status">
                  <span className={`td-spec-status td-spec-status-${task.status}`}>
                    {statusLabel(task.status)}
                  </span>
                </SpecRow>
                <SpecRow label="Reward">
                  {formatNaira(Number(task.worker_earn_kobo))}
                </SpecRow>
                <SpecRow label="Quantity">{task.quantity} task{task.quantity === 1 ? '' : 's'}</SpecRow>
                <SpecRow label="Completed">{task.completed_count}</SpecRow>
                <SpecRow label="Spots remaining">{task.spots_remaining}</SpecRow>
                <SpecRow label="Advertiser">{task.advertiser_username}</SpecRow>
                <SpecRow label="Category">{humanizeLabel(task.category_name)}</SpecRow>
                {task.subcategory_name && (
                  <SpecRow label="Subcategory">{humanizeLabel(task.subcategory_name)}</SpecRow>
                )}
                <SpecRow label="Posted">{formatDate(task.created_at)}</SpecRow>
                <SpecRow label="Expires">
                  {formatDate(task.expires_at)}
                </SpecRow>
                {task.job_link && (
                  <SpecRow label="Job link">
                    <a href={task.job_link} target="_blank" rel="noopener noreferrer">
                      {task.job_link}
                    </a>
                  </SpecRow>
                )}
              </div>
            </section>
          </>
        ) : null}
      </main>

      <BottomNav />
    </div>
  )
}

export default TaskDetailsPage
