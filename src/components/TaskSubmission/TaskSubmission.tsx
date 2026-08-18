import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import type { IconType } from 'react-icons'
import {
  HiCheckCircle,
  HiOutlineCamera,
  HiOutlineChatBubbleOvalLeft,
  HiOutlineExclamationCircle,
  HiOutlineInformationCircle,
  HiOutlineLink,
  HiOutlinePaperAirplane,
  HiOutlinePhoto,
  HiOutlineVideoCamera,
  HiOutlineXMark,
  HiPlus,
} from 'react-icons/hi2'
import { submitTaskProof } from '../../lib/tasks'
import { uploadFile } from '../../lib/uploads'
import { ApiRequestError } from '../../lib/api'
import type { ProofConfig, ProofConfigItem, SubmissionProof } from '../../types/api'
import './TaskSubmission.css'

type ProofTypeKey = 'text' | 'screenshot' | 'link' | 'video'

const PROOF_TYPES: ProofTypeKey[] = ['text', 'screenshot', 'link', 'video']

interface VideoRow {
  url: string
  durationSeconds: string
}

interface ScreenshotItem {
  id: string
  file: File
  previewUrl: string
  status: 'uploading' | 'done' | 'error'
  url?: string
  errorMessage?: string
}

interface TaskSubmissionProps {
  taskId: string
  proofConfig: ProofConfig
  disabled: boolean
}

interface SubmittedInfo {
  id?: string
  submittedAt?: string
  alreadySubmitted?: boolean
}

function labelFor(type: ProofTypeKey, plural = false) {
  if (type === 'text') return plural ? 'text responses' : 'text response'
  if (type === 'screenshot') return plural ? 'screenshots' : 'screenshot'
  if (type === 'link') return plural ? 'links' : 'link'
  return plural ? 'videos' : 'video'
}

function iconFor(type: ProofTypeKey): IconType {
  if (type === 'text') return HiOutlineChatBubbleOvalLeft
  if (type === 'screenshot') return HiOutlineCamera
  if (type === 'link') return HiOutlineLink
  return HiOutlineVideoCamera
}

function countHint(type: ProofTypeKey, filled: number, config: ProofConfigItem) {
  const req = config.isRequired ? 'Required' : 'Optional'
  if (config.maxCount <= 1) {
    return `${req} · ${filled > 0 ? 'provided' : 'not provided'}`
  }
  return `${req} · ${filled} of ${config.maxCount} added`
}

function makeId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

function TaskSubmission({ taskId, proofConfig, disabled }: TaskSubmissionProps) {
  const navigate = useNavigate()

  const [state, setState] = useState<'form' | 'submitting' | 'submitted'>('form')
  const [submitted, setSubmitted] = useState<SubmittedInfo | null>(null)
  const [error, setError] = useState<string | null>(null)

  const [textRows, setTextRows] = useState<string[]>([''])
  const [screenshotItems, setScreenshotItems] = useState<ScreenshotItem[]>([])
  const [linkRows, setLinkRows] = useState<string[]>([''])
  const [videoRows, setVideoRows] = useState<VideoRow[]>([{ url: '', durationSeconds: '' }])

  const fileInputRef = useRef<HTMLInputElement>(null)
  const screenshotItemsRef = useRef<ScreenshotItem[]>([])
  screenshotItemsRef.current = screenshotItems

  useEffect(() => {
    return () => {
      screenshotItemsRef.current.forEach((item) => URL.revokeObjectURL(item.previewUrl))
    }
  }, [])

  const updateTextRow = (i: number, value: string) =>
    setTextRows((prev) => prev.map((row, idx) => (idx === i ? value : row)))

  const updateLinkRow = (i: number, value: string) =>
    setLinkRows((prev) => prev.map((row, idx) => (idx === i ? value : row)))

  const updateVideoRow = (i: number, patch: Partial<VideoRow>) =>
    setVideoRows((prev) => prev.map((row, idx) => (idx === i ? { ...row, ...patch } : row)))

  const addRow = (type: ProofTypeKey) => {
    if (type === 'text') setTextRows((prev) => [...prev, ''])
    else if (type === 'link') setLinkRows((prev) => [...prev, ''])
    else if (type === 'video') setVideoRows((prev) => [...prev, { url: '', durationSeconds: '' }])
  }

  const removeRow = (type: ProofTypeKey, i: number) => {
    if (type === 'text') setTextRows((prev) => prev.filter((_, idx) => idx !== i))
    else if (type === 'link') setLinkRows((prev) => prev.filter((_, idx) => idx !== i))
    else if (type === 'video') setVideoRows((prev) => prev.filter((_, idx) => idx !== i))
  }

  const filledCount = (type: ProofTypeKey) => {
    if (type === 'text') return textRows.map((t) => t.trim()).filter(Boolean).length
    if (type === 'screenshot') return screenshotItems.filter((s) => s.status === 'done').length
    if (type === 'link') return linkRows.map((u) => u.trim()).filter(Boolean).length
    return videoRows.filter((v) => v.url.trim() && v.durationSeconds.trim()).length
  }

  const runUpload = async (item: ScreenshotItem) => {
    try {
      const { upload } = await uploadFile(item.file)
      setScreenshotItems((prev) =>
        prev.map((s) => (s.id === item.id ? { ...s, status: 'done', url: upload.url } : s))
      )
    } catch (err) {
      const message =
        err instanceof ApiRequestError && err.message ? err.message : 'Upload failed.'
      setScreenshotItems((prev) =>
        prev.map((s) => (s.id === item.id ? { ...s, status: 'error', errorMessage: message } : s))
      )
    }
  }

  const handleFilesSelected = (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return
    const config = proofConfig.screenshot
    const remainingSlots = config ? config.maxCount - screenshotItems.length : fileList.length
    const files = Array.from(fileList).slice(0, Math.max(0, remainingSlots))

    const newItems: ScreenshotItem[] = files.map((file) => ({
      id: makeId(),
      file,
      previewUrl: URL.createObjectURL(file),
      status: 'uploading',
    }))

    setScreenshotItems((prev) => [...prev, ...newItems])
    newItems.forEach((item) => runUpload(item))

    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const retryUpload = (id: string) => {
    const item = screenshotItems.find((s) => s.id === id)
    if (!item) return
    setScreenshotItems((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status: 'uploading', errorMessage: undefined } : s))
    )
    runUpload({ ...item, status: 'uploading' })
  }

  const removeScreenshot = (id: string) => {
    setScreenshotItems((prev) => {
      const item = prev.find((s) => s.id === id)
      if (item) URL.revokeObjectURL(item.previewUrl)
      return prev.filter((s) => s.id !== id)
    })
  }

  const buildProof = (): { proof: SubmissionProof; error?: string } => {
    const proof: SubmissionProof = {}
    const errors: string[] = []

    for (const type of PROOF_TYPES) {
      const config = proofConfig[type]
      if (!config || !config.isAllowed) continue

      if (type === 'screenshot') {
        const uploading = screenshotItems.some((s) => s.status === 'uploading')
        const failed = screenshotItems.some((s) => s.status === 'error')
        const done = screenshotItems.filter((s) => s.status === 'done')

        if (uploading) {
          errors.push('Please wait for your screenshots to finish uploading.')
        } else if (failed) {
          errors.push('Remove or retry the screenshot(s) that failed to upload.')
        } else if (config.isRequired && done.length < config.minCount) {
          errors.push(
            `Please add at least ${config.minCount} ${labelFor('screenshot', config.minCount > 1)}.`
          )
        } else if (done.length > config.maxCount) {
          errors.push(`At most ${config.maxCount} ${labelFor('screenshot', config.maxCount > 1)} allowed.`)
        }

        if (done.length > 0) proof.screenshot = done.map((s) => s.url!)
        continue
      }

      let items: string[] = []
      if (type === 'text') items = textRows.map((t) => t.trim()).filter(Boolean)
      else if (type === 'link') items = linkRows.map((u) => u.trim()).filter(Boolean)

      if (type === 'video') {
        const valid = videoRows.filter(
          (v) => v.url.trim() && v.durationSeconds.trim() && !Number.isNaN(Number(v.durationSeconds))
        )
        const incomplete = videoRows.filter((v) => v.url.trim() && !v.durationSeconds.trim()).length

        if (incomplete > 0) {
          errors.push('Video proof needs a duration in seconds.')
        }

        if (config.isRequired && valid.length < config.minCount) {
          errors.push(`Please add at least ${config.minCount} video${config.minCount > 1 ? 's' : ''}.`)
        } else if (valid.length > config.maxCount) {
          errors.push(`At most ${config.maxCount} video${config.maxCount > 1 ? 's' : ''} allowed.`)
        }

        if (valid.length > 0) {
          proof.video = valid.map((v) => ({
            url: v.url.trim(),
            durationSeconds: Number(v.durationSeconds),
          }))
        }
        continue
      }

      if (config.isRequired && items.length < config.minCount) {
        errors.push(
          `Please add at least ${config.minCount} ${labelFor(type, config.minCount > 1)}.`
        )
      } else if (items.length > config.maxCount) {
        errors.push(`At most ${config.maxCount} ${labelFor(type, config.maxCount > 1)} allowed.`)
      }

      if (items.length > 0) {
        if (type === 'text') proof.text = items
        else if (type === 'link') proof.link = items
      }
    }

    if (errors.length > 0) {
      return { proof: {}, error: errors.join(' ') }
    }
    return { proof }
  }

  const handleSubmit = async () => {
    setError(null)
    const { proof, error: validationError } = buildProof()
    if (validationError) {
      setError(validationError)
      return
    }

    setState('submitting')
    try {
      const { submission } = await submitTaskProof(taskId, proof)
      setSubmitted({ id: submission.id, submittedAt: submission.submitted_at })
      setState('submitted')
      toast.success('Proof submitted — pending review.')
    } catch (err) {
      if (err instanceof ApiRequestError && err.status === 401) {
        navigate('/login', { replace: true })
        return
      }
      if (err instanceof ApiRequestError && err.status === 409) {
        setSubmitted({ alreadySubmitted: true })
        setState('submitted')
        return
      }
      const message =
        err instanceof ApiRequestError && err.message ? err.message : 'Something went wrong. Please try again.'
      setError(message)
      setState('form')
    }
  }

  if (state === 'submitted' && submitted) {
    return (
      <section className="td-section">
        <div className="td-section-header">
          <span className="td-section-label">Submit your proof</span>
          <span className="td-section-badge td-section-badge-pending">Pending review</span>
        </div>
        <div className="td-card td-submit">
          <div className="td-submit-done">
            <span
              className={`td-submit-done-icon ${
                submitted.alreadySubmitted ? 'td-submit-done-icon-info' : ''
              }`}
            >
              {submitted.alreadySubmitted ? <HiOutlineInformationCircle /> : <HiCheckCircle />}
            </span>
            <h3>{submitted.alreadySubmitted ? 'Already submitted' : 'Submission received'}</h3>
            <p>
              {submitted.alreadySubmitted
                ? 'You have already submitted proof for this task. We will notify you once it has been reviewed.'
                : 'Your proof is in. It will show on your dashboard once the advertiser reviews it.'}
            </p>
            {submitted.id && (
              <span className="td-submit-meta">Submission ID · {submitted.id.slice(0, 8)}</span>
            )}
            {submitted.submittedAt && (
              <span className="td-submit-meta">
                {new Date(submitted.submittedAt).toLocaleString('en-GB', {
                  day: 'numeric',
                  month: 'short',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
            )}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="td-section">
      <div className="td-section-header">
        <span className="td-section-label">Submit your proof</span>
      </div>

      <div className="td-card td-submit">
        {disabled && (
          <div className="td-submit-note-bar">
            This task is no longer accepting submissions.
          </div>
        )}

        {error && (
          <div className="td-submit-error">
            <p>{error}</p>
          </div>
        )}

        {PROOF_TYPES.map((type) => {
          const config = proofConfig[type]
          if (!config || !config.isAllowed) return null

          const Icon = iconFor(type)
          const filled = filledCount(type)

          const isText = type === 'text'
          const isScreenshot = type === 'screenshot'
          const isLink = type === 'link'
          const isVideo = type === 'video'

          const rows =
            isText ? textRows.length
            : isLink ? linkRows.length
            : isVideo ? videoRows.length
            : 0

          return (
            <div className="td-submit-group" key={type}>
              <div className="td-submit-group-head">
                <span className="td-submit-group-icon">
                  <Icon />
                </span>
                <span className="td-submit-label">{labelFor(type, false)}</span>
                <span
                  className={`td-submit-badge ${
                    config.isRequired ? 'td-submit-badge-required' : 'td-submit-badge-optional'
                  }`}
                >
                  {config.isRequired ? 'Required' : 'Optional'}
                </span>
              </div>

              {isScreenshot && (
                <>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    hidden
                    disabled={disabled || state === 'submitting'}
                    onChange={(e) => handleFilesSelected(e.target.files)}
                  />
                  <div className="td-shot-strip">
                    {screenshotItems.map((item) => (
                      <div className="td-shot-thumb" key={item.id}>
                        <img src={item.previewUrl} alt="Screenshot preview" />
                        {item.status === 'uploading' && (
                          <div className="td-shot-overlay">
                            <span className="td-shot-spinner" />
                          </div>
                        )}
                        {item.status === 'done' && (
                          <div className="td-shot-overlay td-shot-overlay-done">
                            <HiCheckCircle className="td-shot-check" />
                          </div>
                        )}
                        {item.status === 'error' && (
                          <button
                            type="button"
                            className="td-shot-overlay td-shot-overlay-error"
                            onClick={() => retryUpload(item.id)}
                            title={item.errorMessage || 'Upload failed — tap to retry'}
                          >
                            <HiOutlineExclamationCircle />
                          </button>
                        )}
                        <button
                          type="button"
                          className="td-shot-remove"
                          onClick={() => removeScreenshot(item.id)}
                          disabled={state === 'submitting'}
                          aria-label="Remove screenshot"
                        >
                          <HiOutlineXMark />
                        </button>
                      </div>
                    ))}

                    {screenshotItems.length < config.maxCount && (
                      <button
                        type="button"
                        className="td-shot-add"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={disabled || state === 'submitting'}
                      >
                        <HiOutlinePhoto />
                        <span>Add</span>
                      </button>
                    )}
                  </div>
                </>
              )}

              {!isScreenshot && (
                <div className="td-submit-fields">
                  {Array.from({ length: rows }, (_, i) => (
                    <div className="td-submit-row" key={i}>
                      {isText && (
                        <textarea
                          className="td-input td-textarea"
                          value={textRows[i]}
                          disabled={disabled || state === 'submitting'}
                          onChange={(e) => updateTextRow(i, e.target.value)}
                          placeholder={`Response ${i + 1}`}
                        />
                      )}

                      {isLink && (
                        <div className="td-input-wrap">
                          <HiOutlineLink className="td-input-icon" />
                          <input
                            type="url"
                            className="td-input td-input-with-icon"
                            value={linkRows[i]}
                            disabled={disabled || state === 'submitting'}
                            onChange={(e) => updateLinkRow(i, e.target.value)}
                            placeholder={`Link URL ${i + 1}`}
                          />
                        </div>
                      )}

                      {isVideo && (
                        <>
                          <div className="td-input-wrap td-input-wrap-video">
                            <HiOutlineLink className="td-input-icon" />
                            <input
                              type="url"
                              className="td-input td-input-with-icon"
                              value={videoRows[i].url}
                              disabled={disabled || state === 'submitting'}
                              onChange={(e) => updateVideoRow(i, { url: e.target.value })}
                              placeholder={`Video URL ${i + 1}`}
                            />
                          </div>
                          <input
                            type="number"
                            min={1}
                            className="td-input td-input-duration"
                            value={videoRows[i].durationSeconds}
                            disabled={disabled || state === 'submitting'}
                            onChange={(e) =>
                              updateVideoRow(i, { durationSeconds: e.target.value })
                            }
                            placeholder="Seconds"
                          />
                        </>
                      )}

                      {rows > 1 && (
                        <button
                          type="button"
                          className="td-submit-remove"
                          onClick={() => removeRow(type, i)}
                          disabled={disabled || state === 'submitting'}
                          aria-label={`Remove ${labelFor(type, false)}`}
                        >
                          <HiOutlineXMark />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {!isScreenshot && rows < config.maxCount && (
                <button
                  type="button"
                  className="td-submit-add"
                  onClick={() => addRow(type)}
                  disabled={disabled || state === 'submitting'}
                >
                  <HiPlus />
                  Add another {labelFor(type, false)}
                </button>
              )}

              <span className="td-submit-hint">{countHint(type, filled, config)}</span>
            </div>
          )
        })}

        <button
          type="button"
          className="td-submit-btn"
          onClick={handleSubmit}
          disabled={
            disabled ||
            state === 'submitting' ||
            screenshotItems.some((s) => s.status === 'uploading')
          }
        >
          {state === 'submitting' ? (
            <>
              <span className="td-submit-spinner" />
              Submitting…
            </>
          ) : (
            <>
              <HiOutlinePaperAirplane />
              Submit Proof
            </>
          )}
        </button>

        <p className="td-submit-footnote">
          Your submission is reviewed by the advertiser. Earnings are credited to your wallet only
          after approval.
        </p>
      </div>
    </section>
  )
}

export default TaskSubmission
