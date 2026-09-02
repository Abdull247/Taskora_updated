import { useEffect, useState } from 'react'
import { HiCheck, HiOutlineXMark, HiOutlineGift, HiOutlineEnvelope } from 'react-icons/hi2'
import { redeemAccessCode } from '../../lib/waitlist'
import { ApiRequestError } from '../../lib/api'
import type { MeUser, WaitlistRewardResponse } from '../../types/api'
import './AccessCodeRedeemDialog.css'

interface AccessCodeRedeemDialogProps {
  user: MeUser
  onSuccess: () => void
  onDismiss: () => void
}

type Phase = 'input' | 'submitting' | 'success' | 'error'

const ACCESS_CODE_PATTERN = /^FA-[A-Z0-9]{4,}$/

function normalizeAccessCode(value: string) {
  return value.trim().toUpperCase()
}

function AccessCodeRedeemDialog({ user, onSuccess, onDismiss }: AccessCodeRedeemDialogProps) {
  const [phase, setPhase] = useState<Phase>('input')
  const [accessCode, setAccessCode] = useState(() =>
    user.firstAccessCode ? normalizeAccessCode(user.firstAccessCode) : ''
  )
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [reward, setReward] = useState<WaitlistRewardResponse | null>(null)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && phase !== 'submitting') {
        onDismiss()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onDismiss, phase])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (phase === 'submitting') return

    const code = normalizeAccessCode(accessCode)
    if (!code) {
      setErrorMessage('Enter your first-access code to continue.')
      return
    }
    if (!ACCESS_CODE_PATTERN.test(code)) {
      setErrorMessage('Codes look like FA-XXXXXX (letters and digits).')
      return
    }

    setPhase('submitting')
    setErrorMessage(null)

    try {
      const res = await redeemAccessCode({
        accessCode: code,
        email: user.email,
      })
      setReward(res)
      setPhase('success')
    } catch (err) {
      const message =
        err instanceof ApiRequestError
          ? err.status === 409
            ? 'This access code has already been redeemed.'
            : err.status === 404
            ? 'We could not match that code to your account.'
            : err.status === 400
            ? err.message
            : err.status === 401
            ? 'Your session expired. Please sign in again.'
            : 'Something went wrong. Please try again.'
          : 'Network error. Please try again.'
      setErrorMessage(message)
      setPhase('error')
    }
  }

  const handleSuccessClose = () => {
    onSuccess()
  }

  const handleDismiss = () => {
    onDismiss()
  }

  return (
    <div
      className="acrd-backdrop"
      role="dialog"
      aria-modal="true"
      aria-labelledby="acrd-title"
      onClick={(e) => {
        if (e.target === e.currentTarget && phase !== 'submitting') handleDismiss()
      }}
    >
      <div className="acrd-card">
        {phase !== 'success' && phase !== 'submitting' && (
          <button
            type="button"
            className="acrd-close"
            onClick={handleDismiss}
            aria-label="Close dialog"
          >
            <HiOutlineXMark />
          </button>
        )}

        {phase === 'success' ? (
          <div className="acrd-success">
            <div className="acrd-success-animation">
              <span className="acrd-spark acrd-spark-1" />
              <span className="acrd-spark acrd-spark-2" />
              <span className="acrd-spark acrd-spark-3" />
              <span className="acrd-spark acrd-spark-4" />
              <div className="acrd-success-circle">
                <HiCheck className="acrd-check-icon" />
              </div>
            </div>

            <div className="acrd-success-text">
              <h2 id="acrd-title">
                ₦{reward?.amount ?? 100} <span className="acrd-blue-txt">credited!</span>
              </h2>
              <p>
                {reward?.message ?? '100 naira credited to wallet'} — your wallet has been
                topped up.
              </p>
            </div>

            <button
              type="button"
              className="acrd-primary-btn"
              onClick={handleSuccessClose}
            >
              Awesome
            </button>
          </div>
        ) : (
          <form className="acrd-form" onSubmit={handleSubmit} noValidate>
            <div className="acrd-icon-circle">
              <HiOutlineGift />
            </div>

            <div className="acrd-headings">
              <h2 id="acrd-title">Redeem your first-access code</h2>
              <p>
                Enter the code we sent during the waitlist to credit{' '}
                <strong>₦100</strong> to your wallet instantly.
              </p>
            </div>

            <label className="acrd-field">
              <span className="acrd-label">First-access code</span>
              <input
                type="text"
                inputMode="text"
                autoCapitalize="characters"
                autoCorrect="off"
                spellCheck={false}
                autoComplete="off"
                placeholder="FA-XXXXXXXX"
                value={accessCode}
                onChange={(e) => {
                  setAccessCode(e.target.value.toUpperCase())
                  if (errorMessage) setErrorMessage(null)
                }}
                className="acrd-input"
                disabled={phase === 'submitting'}
                aria-invalid={Boolean(errorMessage)}
                aria-describedby={errorMessage ? 'acrd-error' : undefined}
              />
            </label>

            <label className="acrd-field acrd-field-readonly">
              <span className="acrd-label">
                <HiOutlineEnvelope className="acrd-label-icon" />
                Email on file
              </span>
              <input
                type="email"
                value={user.email}
                readOnly
                className="acrd-input acrd-input-readonly"
              />
              <span className="acrd-hint">
                Used to verify the code belongs to your account.
              </span>
            </label>

            {errorMessage && (
              <p id="acrd-error" className="acrd-error" role="alert">
                {errorMessage}
              </p>
            )}

            <button
              type="submit"
              className="acrd-primary-btn"
              disabled={phase === 'submitting'}
            >
              {phase === 'submitting' ? 'Redeeming…' : 'Redeem ₦100'}
            </button>

            <button
              type="button"
              className="acrd-secondary-btn"
              onClick={handleDismiss}
              disabled={phase === 'submitting'}
            >
              Maybe later
            </button>
          </form>
        )}
      </div>
    </div>
  )
}

export default AccessCodeRedeemDialog