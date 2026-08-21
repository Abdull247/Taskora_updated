import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  HiArrowUpRight,
  HiOutlineArrowRight,
  HiOutlineCamera,
  HiOutlineLink,
  HiOutlineVideoCamera,
  HiOutlineXCircle,
} from 'react-icons/hi2'
import DashboardTopbar from '../../components/DashboardTopbar/DashboardTopbar'
import BottomNav from '../../components/BottomNav/BottomNav'
import { getMySubmissions } from '../../lib/tasks'
import { ApiRequestError } from '../../lib/api'
import type { SubmissionListItem, SubmissionProof } from '../../types/api'
import './MySubmissionsPage.css'

type StatusFilter = 'all' | 'pending' | 'approved' | 'rejected'

function formatWhen(iso: string) {
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return '—'
  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

function taskLabel(sub: SubmissionListItem) {
  if (sub.task?.title) return sub.task.title
  if (sub.task?.job_description) return sub.task.job_description
  return `Task ${sub.task_id.slice(0, 8)}`
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

  return (
    <div className="my-proof">
      {chips.map(({ label, Icon }, i) => (
        <span className="my-proof-chip" key={i}>
          <Icon /> {label}
        </span>
      ))}
      {!chips.length && <span className="my-proof-none">No proof attached</span>}
    </div>
  )
}

function MySubmissionsPage() {
  const navigate = useNavigate()

  const [submissions, setSubmissions] = useState<SubmissionListItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filter, setFilter] = useState<StatusFilter>('all')

  const load = useCallback(() => {
    let cancelled = false
    setLoading(true)
    setError(null)

    getMySubmissions()
      .then(({ submissions: res }) => {
        if (!cancelled) setSubmissions(res)
      })
      .catch((err) => {
        if (cancelled) return
        if (err instanceof ApiRequestError && err.status === 401) {
          navigate('/login', { replace: true })
          return
        }
        setError('Could not load your submissions. Please try again.')
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

  return (
    <div className="my-submissions-page">
      <DashboardTopbar hasNotifications />

      <main className="my-submissions-main">
        <div className="my-heading">
          <h1>My submissions</h1>
          <p>Track the status of work you have submitted.</p>
        </div>

        {loading ? (
          <div className="my-loading">
            {[0, 1, 2].map((i) => (
              <div className="my-skel-card" key={i}>
                <div className="my-skel my-skel-top" />
                <div className="my-skel my-skel-line" />
                <div className="my-skel my-skel-line my-skel-short" />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="my-empty">
            <p>{error}</p>
            <button type="button" className="my-retry" onClick={load}>
              Try again
            </button>
          </div>
        ) : (
          <>
            <div className="my-filters">
              {(['all', 'pending', 'approved', 'rejected'] as StatusFilter[]).map((f) => (
                <button
                  key={f}
                  type="button"
                  className={`my-filter ${filter === f ? 'my-filter-active' : ''}`}
                  onClick={() => setFilter(f)}
                >
                  {f === 'all' ? 'All' : f.charAt(0).toUpperCase() + f.slice(1)}
                  <span className="my-filter-count">{counts[f]}</span>
                </button>
              ))}
            </div>

            {filtered.length === 0 ? (
              <div className="my-empty">
                <p>
                  {filter === 'all'
                    ? 'You have not submitted any work yet.'
                    : `No ${filter} submissions.`}
                </p>
                <Link to="/dashboard/tasks" className="my-browse-link">
                  Browse tasks <HiOutlineArrowRight />
                </Link>
              </div>
            ) : (
              <div className="my-list">
                {filtered.map((sub) => (
                  <div className="my-card" key={sub.id}>
                    <div className="my-card-top">
                      <span className={`my-status my-status-${sub.status}`}>
                        {sub.status === 'pending'
                          ? 'Pending'
                          : sub.status === 'approved'
                          ? 'Approved'
                          : 'Rejected'}
                      </span>
                      <span className="my-when">{formatWhen(sub.submitted_at)}</span>
                    </div>

                    <h3 className="my-task-title">{taskLabel(sub)}</h3>

                    <ProofSummary proof={sub.proof} />

                    {sub.status === 'rejected' && sub.rejection_reason && (
                      <div className="my-rejection">
                        <HiOutlineXCircle />
                        <p>{sub.rejection_reason}</p>
                      </div>
                    )}

                    <div className="my-card-foot">
                      {sub.status === 'pending' && (
                        <span className="my-note">Pending advertiser review</span>
                      )}
                      {sub.status === 'rejected' && (
                        <Link to={`/dashboard/tasks/${sub.task_id}`} className="my-resubmit">
                          Resubmit proof <HiArrowUpRight />
                        </Link>
                      )}
                    </div>
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

export default MySubmissionsPage
