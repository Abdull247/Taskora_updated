import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { HiArrowLeft, HiPlus, HiOutlineXMark } from 'react-icons/hi2'
import DashboardTopbar from '../../components/DashboardTopbar/DashboardTopbar'
import BottomNav from '../../components/BottomNav/BottomNav'
import { getTaskCategories, createTask } from '../../lib/tasks'
import { getMe } from '../../lib/me'
import { ApiRequestError } from '../../lib/api'
import type {
  CreateTaskPayload,
  TaskCategoryItem,
  ProofConfigPayloadItem,
} from '../../types/api'
import './CreateTaskPage.css'

const PROOF_TYPE_LABELS: Record<string, string> = {
  text: 'Text response',
  screenshot: 'Screenshot',
  link: 'Link',
  video: 'Video',
}

interface ProofDraft {
  isAllowed: boolean
  isRequired: boolean
  minCount: number
  maxCount: number
}

interface CriterionDraft {
  id: number
  question: string
  type: 'RATING' | 'TEXT'
  scale: number
}

function formatNaira(naira: number) {
  return `₦${naira.toLocaleString('en-NG', {
    minimumFractionDigits: naira % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  })}`
}

function categoryLabel(name: string) {
  return name
    .toLowerCase()
    .split('_')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')
}

function toDatetimeLocal(date: Date) {
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(
    date.getHours()
  )}:${pad(date.getMinutes())}`
}

function defaultExpiry() {
  return toDatetimeLocal(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000))
}

function CreateTaskPage() {
  const navigate = useNavigate()

  const [categories, setCategories] = useState<TaskCategoryItem[]>([])
  const [categoriesLoading, setCategoriesLoading] = useState(true)
  const [categoriesError, setCategoriesError] = useState<string | null>(null)

  const [walletBalanceKobo, setWalletBalanceKobo] = useState<number | null>(null)

  const [activeCategoryId, setActiveCategoryId] = useState<string | null>(null)
  const [activeSubcategoryId, setActiveSubcategoryId] = useState<string | null>(null)

  const [title, setTitle] = useState('')
  const [jobLink, setJobLink] = useState('')
  const [jobDescription, setJobDescription] = useState('')
  const [instructions, setInstructions] = useState<string[]>([''])
  const [requirements, setRequirements] = useState<string[]>([''])

  const [quantity, setQuantity] = useState(10)
  const [payPerTask, setPayPerTask] = useState('')
  const [expiresAt, setExpiresAt] = useState(defaultExpiry())

  const [proofConfig, setProofConfig] = useState<Record<string, ProofDraft>>({
    text: { isAllowed: true, isRequired: true, minCount: 1, maxCount: 1 },
    screenshot: { isAllowed: true, isRequired: true, minCount: 1, maxCount: 3 },
    link: { isAllowed: false, isRequired: false, minCount: 1, maxCount: 1 },
    video: { isAllowed: false, isRequired: false, minCount: 1, maxCount: 1 },
  })

  const [scenario, setScenario] = useState('')
  const [experienceType, setExperienceType] = useState('WEBSITE')
  const [criteria, setCriteria] = useState<CriterionDraft[]>([
    { id: 0, question: '', type: 'RATING', scale: 5 },
  ])
  const criteriaIdRef = useRef(1)

  const [formError, setFormError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const loadBase = useCallback(async () => {
    setCategoriesLoading(true)
    setCategoriesError(null)
    try {
      const [{ categories: cats }, me] = await Promise.all([getTaskCategories(), getMe()])
      setCategories(cats)
      setWalletBalanceKobo(Number(me.user.wallet.balanceKobo))
    } catch (err) {
      if (err instanceof ApiRequestError && err.status === 401) {
        navigate('/login', { replace: true })
        return
      }
      setCategoriesError('Could not load task categories. Please try again.')
    } finally {
      setCategoriesLoading(false)
    }
  }, [navigate])

  useEffect(() => {
    loadBase()
  }, [loadBase])

  const activeCategory = useMemo(() => {
    if (!activeCategoryId) return null
    return categories.find((cat) => cat.categoryId === activeCategoryId) ?? null
  }, [categories, activeCategoryId])

  const activeSubcategory = useMemo(() => {
    if (!activeSubcategoryId) return null
    return (
      activeCategory?.subcategories.find((sub) => sub.subcategoryId === activeSubcategoryId) ??
      null
    )
  }, [activeCategory, activeSubcategoryId])

  const totalBudgetNaira = useMemo(
    () => quantity * (Number(payPerTask) || 0),
    [quantity, payPerTask]
  )

  const insufficientFunds = useMemo(() => {
    if (walletBalanceKobo === null) return false
    return totalBudgetNaira > walletBalanceKobo / 100
  }, [totalBudgetNaira, walletBalanceKobo])

  const updateInstruction = (i: number, value: string) =>
    setInstructions((prev) => prev.map((row, idx) => (idx === i ? value : row)))

  const updateRequirement = (i: number, value: string) =>
    setRequirements((prev) => prev.map((row, idx) => (idx === i ? value : row)))

  const updateCriterion = (i: number, patch: Partial<CriterionDraft>) =>
    setCriteria((prev) => prev.map((row, idx) => (idx === i ? { ...row, ...patch } : row)))

  const updateProof = (type: string, patch: Partial<ProofDraft>) =>
    setProofConfig((prev) => ({
      ...prev,
      [type]: { ...prev[type], ...patch },
    }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormError(null)

    if (!activeSubcategoryId) {
      setFormError('Select a category and subcategory for the task.')
      return
    }
    if (!title.trim()) {
      setFormError('Give the task a short title.')
      return
    }
    if (!jobLink.trim()) {
      setFormError('Provide the job link workers should visit.')
      return
    }
    try {
      const parsed = new URL(jobLink.trim())
      if (!['http:', 'https:'].includes(parsed.protocol)) throw new Error()
    } catch {
      setFormError('The job link must be a valid http(s) URL.')
      return
    }
    if (!jobDescription.trim()) {
      setFormError('Describe the task so workers know what to expect.')
      return
    }
    const cleanInstructions = instructions.map((i) => i.trim()).filter(Boolean)
    if (cleanInstructions.length === 0) {
      setFormError('Add at least one instruction step.')
      return
    }
    if (!Number.isFinite(quantity) || quantity < 1) {
      setFormError('Quantity must be at least 1.')
      return
    }
    const pay = Number(payPerTask)
    if (!payPerTask || !Number.isFinite(pay) || pay <= 0) {
      setFormError('Enter how much each worker will earn.')
      return
    }
    if (activeSubcategory && pay * 100 < activeSubcategory.baseRateKobo) {
      setFormError(
        `Pay per task must be at least the ${categoryLabel(activeSubcategory.displayName)} minimum of ${formatNaira(
          activeSubcategory.baseRateKobo / 100
        )}.`
      )
      return
    }
    if (!expiresAt || new Date(expiresAt).getTime() <= Date.now()) {
      setFormError('Expiry must be in the future.')
      return
    }
    const allowedTypes = Object.entries(proofConfig).filter(([, cfg]) => cfg.isAllowed)
    if (allowedTypes.length === 0) {
      setFormError('Enable at least one proof type.')
      return
    }
    for (const [type, cfg] of allowedTypes) {
      if (cfg.maxCount < 1 || cfg.maxCount < cfg.minCount) {
        setFormError(
          `Fix the ${PROOF_TYPE_LABELS[type]} limits: max must be at least 1 and at least min.`
        )
        return
      }
    }

    const proofPayload: Record<string, ProofConfigPayloadItem> = {
      text: proofConfig.text,
      screenshot: proofConfig.screenshot,
      link: proofConfig.link,
      video: proofConfig.video,
    }

    const payload: CreateTaskPayload = {
      subcategoryId: activeSubcategoryId,
      title: title.trim(),
      jobLink: jobLink.trim(),
      jobDescription: jobDescription.trim(),
      instructions: cleanInstructions,
      requirements: requirements.map((r) => r.trim()).filter(Boolean),
      proofConfig: {
        text: proofPayload.text,
        screenshot: proofPayload.screenshot,
        link: proofPayload.link,
        video: proofPayload.video,
      },
      taskData: {
        scenario: scenario.trim(),
        experienceType: experienceType.trim(),
        evaluationCriteria: criteria
          .filter((c) => c.question.trim())
          .map((c) =>
            c.type === 'RATING'
              ? { question: c.question.trim(), type: 'RATING' as const, scale: c.scale }
              : { question: c.question.trim(), type: 'TEXT' as const }
          ),
      },
      quantity,
      workerEarnNaira: pay,
      expiresAt: new Date(expiresAt).toISOString(),
    }

    setSubmitting(true)
    try {
      await createTask(payload)
      toast.success('Task published — it is now live for workers.')
      navigate('/dashboard/tasks', { replace: true })
    } catch (err) {
      if (err instanceof ApiRequestError && err.status === 401) {
        navigate('/login', { replace: true })
        return
      }
      if (err instanceof ApiRequestError && err.status === 402) {
        setFormError(
          'Your wallet balance is too low to cover this task. Fund your wallet and try again.'
        )
        return
      }
      const message =
        err instanceof ApiRequestError && err.message
          ? err.message
          : 'Could not publish the task. Please try again.'
      setFormError(message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="create-task-page">
      <DashboardTopbar initials="··" hasNotifications />

      <main className="create-task-main">
        <Link to="/dashboard/tasks" className="ct-back">
          <HiArrowLeft /> Browse Tasks
        </Link>

        <div className="ct-heading">
          <h1>Create a task</h1>
          <p>Describe the job, set the proof you expect, and budget for it.</p>
        </div>

        {categoriesLoading ? (
          <div className="ct-loading">
            <div className="ct-skel-card">
              <div className="ct-skel ct-skel-label" />
              <div className="ct-skel ct-skel-line" />
              <div className="ct-skel ct-skel-line ct-skel-short" />
            </div>
            <div className="ct-skel-card">
              <div className="ct-skel ct-skel-label" />
              <div className="ct-skel ct-skel-line" />
              <div className="ct-skel ct-skel-line ct-skel-short" />
            </div>
          </div>
        ) : categoriesError ? (
          <div className="ct-error-banner">
            <p>{categoriesError}</p>
            <button type="button" onClick={loadBase}>
              Retry
            </button>
          </div>
        ) : (
          <form className="ct-form" onSubmit={handleSubmit}>
            {/* Category / subcategory */}
            <section className="ct-section">
              <span className="ct-section-label">What type of task</span>
              <div className="ct-card">
                <span className="ct-field-label">Category</span>
                <div className="ct-chip-row">
                  {categories.map((cat) => (
                    <button
                      key={cat.categoryId}
                      type="button"
                      className={`browse-chip ${
                        activeCategoryId === cat.categoryId ? 'browse-chip-active' : ''
                      }`}
                      onClick={() => {
                        setActiveCategoryId(cat.categoryId)
                        setActiveSubcategoryId(null)
                      }}
                    >
                      {categoryLabel(cat.category)}
                    </button>
                  ))}
                </div>

                {activeCategory && (
                  <>
                    <span className="ct-field-label">Subcategory</span>
                    <div className="ct-chip-row">
                      {activeCategory.subcategories.map((sub) => (
                        <button
                          key={sub.subcategoryId}
                          type="button"
                          className={`browse-chip ${
                            activeSubcategoryId === sub.subcategoryId ? 'browse-chip-active' : ''
                          }`}
                          onClick={() => setActiveSubcategoryId(sub.subcategoryId)}
                        >
                          {sub.displayName}
                        </button>
                      ))}
                    </div>
                  </>
                )}

                {activeSubcategory && (
                  <p className="ct-rate-hint">
                    Minimum pay for this subcategory: {formatNaira(activeSubcategory.baseRateKobo / 100)}{' '}
                    per task
                  </p>
                )}
              </div>
            </section>

            {/* Task details */}
            <section className="ct-section">
              <span className="ct-section-label">Task details</span>
              <div className="ct-card">
                <label className="ct-field-label" htmlFor="ct-title">
                  Title
                </label>
                <input
                  id="ct-title"
                  className="ct-input"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Evaluate our website checkout"
                />

                <label className="ct-field-label" htmlFor="ct-link">
                  Job link
                </label>
                <input
                  id="ct-link"
                  className="ct-input"
                  value={jobLink}
                  onChange={(e) => setJobLink(e.target.value)}
                  placeholder="https://example.com"
                  inputMode="url"
                />

                <label className="ct-field-label" htmlFor="ct-desc">
                  Description
                </label>
                <textarea
                  id="ct-desc"
                  className="ct-input ct-textarea"
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  placeholder="What should workers know before starting?"
                />

                <span className="ct-field-label">Instructions</span>
                <div className="ct-rows">
                  {instructions.map((row, i) => (
                    <div className="ct-row" key={i}>
                      <span className="ct-row-num">{i + 1}</span>
                      <input
                        className="ct-input"
                        value={row}
                        onChange={(e) => updateInstruction(i, e.target.value)}
                        placeholder={`Step ${i + 1}`}
                      />
                      {instructions.length > 1 && (
                        <button
                          type="button"
                          className="ct-remove"
                          onClick={() =>
                            setInstructions((prev) => prev.filter((_, idx) => idx !== i))
                          }
                          aria-label="Remove step"
                        >
                          <HiOutlineXMark />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  className="ct-add"
                  onClick={() => setInstructions((prev) => [...prev, ''])}
                >
                  <HiPlus /> Add step
                </button>

                <span className="ct-field-label">Requirements (optional)</span>
                <div className="ct-rows">
                  {requirements.map((row, i) => (
                    <div className="ct-row" key={i}>
                      <input
                        className="ct-input"
                        value={row}
                        onChange={(e) => updateRequirement(i, e.target.value)}
                        placeholder="e.g. Must have a working microphone"
                      />
                      {requirements.length > 0 && (
                        <button
                          type="button"
                          className="ct-remove"
                          onClick={() =>
                            setRequirements((prev) => prev.filter((_, idx) => idx !== i))
                          }
                          aria-label="Remove requirement"
                        >
                          <HiOutlineXMark />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  className="ct-add"
                  onClick={() => setRequirements((prev) => [...prev, ''])}
                >
                  <HiPlus /> Add requirement
                </button>
              </div>
            </section>

            {/* Proof requirements */}
            <section className="ct-section">
              <span className="ct-section-label">Proof requirements</span>
              <div className="ct-card">
                {Object.entries(PROOF_TYPE_LABELS).map(([type, label]) => {
                  const cfg = proofConfig[type]
                  return (
                    <div className="ct-proof-row" key={type}>
                      <div className="ct-proof-head">
                        <label className="ct-toggle">
                          <input
                            type="checkbox"
                            checked={cfg.isAllowed}
                            onChange={(e) => updateProof(type, { isAllowed: e.target.checked })}
                          />
                          <span className="ct-toggle-track" />
                        </label>
                        <span className="ct-proof-name">{label}</span>
                      </div>

                      {cfg.isAllowed && (
                        <div className="ct-proof-controls">
                          <label className="ct-check">
                            <input
                              type="checkbox"
                              checked={cfg.isRequired}
                              onChange={(e) =>
                                updateProof(type, { isRequired: e.target.checked })
                              }
                            />
                            Required
                          </label>
                          <div className="ct-count">
                            <span>min</span>
                            <input
                              type="number"
                              min={0}
                              className="ct-count-input"
                              value={cfg.minCount}
                              onChange={(e) =>
                                updateProof(type, { minCount: Math.max(0, Number(e.target.value) || 0) })
                              }
                            />
                            <span>max</span>
                            <input
                              type="number"
                              min={1}
                              className="ct-count-input"
                              value={cfg.maxCount}
                              onChange={(e) =>
                                updateProof(type, { maxCount: Math.max(1, Number(e.target.value) || 1) })
                              }
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </section>

            {/* Task data */}
            <section className="ct-section">
              <span className="ct-section-label">Scenario & evaluation</span>
              <div className="ct-card">
                <label className="ct-field-label" htmlFor="ct-scenario">
                  Scenario (optional)
                </label>
                <textarea
                  id="ct-scenario"
                  className="ct-input ct-textarea ct-textarea-sm"
                  value={scenario}
                  onChange={(e) => setScenario(e.target.value)}
                  placeholder="e.g. Act as a first-time customer looking for a product."
                />

                <label className="ct-field-label" htmlFor="ct-exp">
                  Experience type
                </label>
                <input
                  id="ct-exp"
                  className="ct-input"
                  value={experienceType}
                  onChange={(e) => setExperienceType(e.target.value)}
                  placeholder="e.g. WEBSITE, MOBILE_APP, STORE"
                />

                <span className="ct-field-label">Evaluation questions (optional)</span>
                <div className="ct-rows">
                  {criteria.map((criterion, i) => (
                    <div className="ct-row ct-row-criterion" key={criterion.id}>
                      <input
                        className="ct-input"
                        value={criterion.question}
                        onChange={(e) => updateCriterion(i, { question: e.target.value })}
                        placeholder="e.g. How easy was checkout?"
                      />
                      <select
                        className="ct-input ct-select ct-select-type"
                        value={criterion.type}
                        onChange={(e) =>
                          updateCriterion(i, {
                            type: e.target.value as 'RATING' | 'TEXT',
                          })
                        }
                      >
                        <option value="RATING">Rating</option>
                        <option value="TEXT">Text</option>
                      </select>
                      {criterion.type === 'RATING' && (
                        <select
                          className="ct-input ct-select ct-select-scale"
                          value={criterion.scale}
                          onChange={(e) => updateCriterion(i, { scale: Number(e.target.value) })}
                        >
                          <option value={5}>1–5</option>
                          <option value={10}>1–10</option>
                          <option value={3}>1–3</option>
                        </select>
                      )}
                      {criteria.length > 1 && (
                        <button
                          type="button"
                          className="ct-remove"
                          onClick={() =>
                            setCriteria((prev) => prev.filter((_, idx) => idx !== i))
                          }
                          aria-label="Remove question"
                        >
                          <HiOutlineXMark />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  className="ct-add"
                  onClick={() =>
                    setCriteria((prev) => [
                      ...prev,
                      { id: criteriaIdRef.current++, question: '', type: 'RATING', scale: 5 },
                    ])
                  }
                >
                  <HiPlus /> Add question
                </button>
              </div>
            </section>

            {/* Budget */}
            <section className="ct-section">
              <span className="ct-section-label">Budget</span>
              <div className="ct-budget-card">
                <div className="ct-budget-fields">
                  <div className="ct-budget-field">
                    <label className="ct-field-label" htmlFor="ct-qty">
                      Quantity
                    </label>
                    <input
                      id="ct-qty"
                      type="number"
                      min={1}
                      className="ct-input"
                      value={quantity}
                      onChange={(e) =>
                        setQuantity(Math.max(1, Number(e.target.value) || 1))
                      }
                    />
                  </div>
                  <div className="ct-budget-field">
                    <label className="ct-field-label" htmlFor="ct-pay">
                      Pay per task (₦)
                    </label>
                    <input
                      id="ct-pay"
                      type="number"
                      min={0}
                      step="0.01"
                      className="ct-input"
                      value={payPerTask}
                      onChange={(e) => setPayPerTask(e.target.value)}
                      placeholder="0.00"
                    />
                  </div>
                </div>

                <div className="ct-budget-total">
                  <div className="ct-budget-total-info">
                    <span className="ct-budget-total-label">Total budget</span>
                    <span className="ct-budget-total-sub">
                      {quantity} × {payPerTask ? formatNaira(Number(payPerTask)) : '₦0.00'} · held
                      from your wallet on publish
                    </span>
                  </div>
                  <strong className="ct-budget-amount">{formatNaira(totalBudgetNaira)}</strong>
                </div>

                <div className="ct-budget-note">
                  <span>
                    Wallet balance:{' '}
                    <strong>
                      {walletBalanceKobo === null
                        ? '…'
                        : formatNaira(walletBalanceKobo / 100)}
                    </strong>
                  </span>
                  {insufficientFunds && <span className="ct-budget-warn">Insufficient funds</span>}
                </div>
              </div>
            </section>

            {/* Expiry */}
            <section className="ct-section">
              <span className="ct-section-label">Availability</span>
              <div className="ct-card">
                <label className="ct-field-label" htmlFor="ct-expiry">
                  Expires at
                </label>
                <input
                  id="ct-expiry"
                  type="datetime-local"
                  className="ct-input"
                  value={expiresAt}
                  onChange={(e) => setExpiresAt(e.target.value)}
                />
              </div>
            </section>

            {formError && (
              <div className="ct-error-banner">
                <p>{formError}</p>
              </div>
            )}

            <button type="submit" className="ct-submit-btn" disabled={submitting}>
              {submitting ? 'Publishing…' : 'Publish task'}
            </button>
          </form>
        )}
      </main>

      <BottomNav />
    </div>
  )
}

export default CreateTaskPage
