import { useCallback, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import {
  HiArrowLeft,
  HiOutlineWallet,
  HiOutlineEnvelope,
  HiOutlineSquare2Stack,
  HiArrowTopRightOnSquare,
  HiOutlineShieldCheck,
  HiOutlineLockClosed,
} from 'react-icons/hi2'
import DashboardTopbar from '../../components/DashboardTopbar/DashboardTopbar'
import BottomNav from '../../components/BottomNav/BottomNav'
import { getWallet, formatNairaFromKobo } from '../../lib/wallet'
import { getMe } from '../../lib/me'
import { initializeDeposit, verifyDeposit } from '../../lib/payments'
import { ApiRequestError } from '../../lib/api'
import './DepositPage.css'

const QUICK_AMOUNTS = [1000, 5000, 10000, 25000]

function DepositPage() {
  const navigate = useNavigate()

  const [email, setEmail] = useState<string | null>(null)
  const [balanceKobo, setBalanceKobo] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)

  const [amount, setAmount] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [amountError, setAmountError] = useState<string | null>(null)

  const [result, setResult] = useState<{ authorizationUrl: string; reference: string } | null>(null)
  const [copied, setCopied] = useState(false)
  const [verifying, setVerifying] = useState(false)
  const pendingReferenceRef = useRef<string | null>(null)

  const load = useCallback(() => {
    let cancelled = false
    setLoading(true)
    setLoadError(null)

    Promise.all([getWallet(), getMe()])
      .then(([walletRes, meRes]) => {
        if (cancelled) return
        setBalanceKobo(walletRes.wallet.balance)
        setEmail(meRes.user.email)
      })
      .catch((err) => {
        if (cancelled) return
        if (err instanceof ApiRequestError && err.status === 401) {
          navigate('/login', { replace: true })
          return
        }
        setLoadError('Could not load your wallet. Please try again.')
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

  // Paystack opens in a new tab; the user comes back to this tab once
  // they've paid (or given up). Check the reference against the backend
  // as soon as this tab regains focus, instead of only relying on the
  // webhook — that way a pending deposit gets resolved even if the
  // webhook is delayed or never reaches the server (common in local/dev
  // setups where the backend isn't publicly reachable).
  useEffect(() => {
    const checkPending = () => {
      const reference = pendingReferenceRef.current
      if (!reference || document.hidden) return

      setVerifying(true)
      verifyDeposit(reference)
        .then((res) => {
          if (res.status === 'success' || res.status === 'already_resolved') {
            pendingReferenceRef.current = null
            toast.success('Deposit confirmed! Your balance has been updated.')
            load()
          } else if (res.status === 'failed') {
            pendingReferenceRef.current = null
            toast.error('That payment did not go through. You can try again.')
          }
          // still pending on Paystack's side — leave the ref in place and
          // check again next time the tab regains focus
        })
        .catch(() => {
          // Silent — the webhook may still resolve this, and we'll retry
          // on the next focus event anyway.
        })
        .finally(() => setVerifying(false))
    }

    window.addEventListener('focus', checkPending)
    document.addEventListener('visibilitychange', checkPending)
    return () => {
      window.removeEventListener('focus', checkPending)
      document.removeEventListener('visibilitychange', checkPending)
    }
  }, [load])

  const handleQuickAmount = (value: number) => {
    setAmount(String(value))
    setAmountError(null)
  }

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/[^\d]/g, '')
    setAmount(raw)
    if (amountError) setAmountError(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const amountNaira = Number(amount)
    if (!amount || Number.isNaN(amountNaira) || amountNaira <= 0) {
      setAmountError('Enter a valid amount to deposit.')
      return
    }
    if (amountNaira < 100) {
      setAmountError('Minimum deposit is ₦100.')
      return
    }

    setSubmitting(true)
    try {
      const res = await initializeDeposit({ amountNaira })
      setResult(res)
      pendingReferenceRef.current = res.reference
      const opened = window.open(res.authorizationUrl, '_blank', 'noopener,noreferrer')
      if (!opened) {
        toast.error('Popup blocked — use the button below to open the payment page.')
      }
    } catch (err) {
      if (err instanceof ApiRequestError && err.status === 401) {
        navigate('/login', { replace: true })
        return
      }
      const message =
        err instanceof ApiRequestError ? err.message : 'Could not start your deposit. Please try again.'
      toast.error(message)
    } finally {
      setSubmitting(false)
    }
  }

  const handleOpenPaymentPage = () => {
    if (!result) return
    window.open(result.authorizationUrl, '_blank', 'noopener,noreferrer')
  }

  const handleCopyReference = async () => {
    if (!result) return
    try {
      await navigator.clipboard.writeText(result.reference)
      setCopied(true)
      toast.success('Reference copied!')
      setTimeout(() => setCopied(false), 2000)
    } catch {
      toast.error('Could not copy. Please copy it manually.')
    }
  }

  const handleStartAnother = () => {
    setResult(null)
    setAmount('')
    setAmountError(null)
  }

  return (
    <div className="deposit-page">
      <DashboardTopbar hasNotifications />

      <main className="deposit-main">
        <div className="deposit-heading">
          <button
            type="button"
            className="deposit-back"
            onClick={() => navigate('/dashboard/wallet')}
            aria-label="Back to wallet"
          >
            <HiArrowLeft />
          </button>
          <h1>Deposit Funds</h1>
        </div>

        {loadError ? (
          <div className="deposit-error">
            <p>{loadError}</p>
            <button type="button" className="btn btn-primary btn-block" onClick={load}>
              Try again
            </button>
          </div>
        ) : (
          <>
            {/* Balance card */}
            <div className="deposit-balance-card">
              <span className="deposit-card-icon">
                <HiOutlineWallet />
              </span>
              <div className="deposit-balance-info">
                <span className="deposit-balance-label">Available Balance</span>
                <div className="deposit-balance-value">
                  {loading ? '—' : formatNairaFromKobo(balanceKobo ?? 0)}
                </div>
              </div>
            </div>

            {/* Account / email card */}
            <div className="deposit-account-card">
              <span className="deposit-card-icon deposit-card-icon-neutral">
                <HiOutlineEnvelope />
              </span>
              <div className="deposit-account-info">
                <span className="deposit-account-label">Depositing as</span>
                <span className="deposit-account-value">{loading ? '—' : email}</span>
              </div>
            </div>

            {!result ? (
              /* Amount form */
              <form className="deposit-form" onSubmit={handleSubmit}>
                <div className="deposit-form-field">
                  <label htmlFor="deposit-amount">Amount</label>
                  <div className={`deposit-amount-wrap ${amountError ? 'deposit-amount-wrap-error' : ''}`}>
                    <span className="deposit-amount-prefix">₦</span>
                    <input
                      id="deposit-amount"
                      type="text"
                      inputMode="numeric"
                      placeholder="0"
                      value={amount}
                      onChange={handleAmountChange}
                      disabled={submitting}
                      autoComplete="off"
                    />
                  </div>
                  {amountError && <span className="deposit-field-error">{amountError}</span>}
                </div>

                <div className="deposit-quick-amounts">
                  {QUICK_AMOUNTS.map((value) => (
                    <button
                      key={value}
                      type="button"
                      className={`deposit-quick-chip ${amount === String(value) ? 'deposit-quick-chip-active' : ''}`}
                      onClick={() => handleQuickAmount(value)}
                      disabled={submitting}
                    >
                      ₦{value.toLocaleString('en-NG')}
                    </button>
                  ))}
                </div>

                <button
                  type="submit"
                  className="btn btn-primary btn-block btn-submit"
                  disabled={submitting || loading}
                >
                  <span className={submitting ? 'btn-label btn-label-hidden' : 'btn-label'}>
                    Continue to Payment
                  </span>
                  {submitting && <span className="btn-spinner" aria-label="Loading" />}
                </button>
              </form>
            ) : (
              /* Reference / open payment card */
              <div className="deposit-result-card">
                <div className="deposit-result-header">
                  <span className="deposit-result-badge">Payment Initialized</span>
                </div>

                <p className="deposit-result-copy">
                  Your payment page has been opened in a new tab. If it didn't open, use the button below.
                </p>

                <div className="deposit-reference-row">
                  <div className="deposit-reference-info">
                    <span className="deposit-reference-label">Reference</span>
                    <span className="deposit-reference-value">{result.reference}</span>
                  </div>
                  <button
                    type="button"
                    className="deposit-copy-btn"
                    onClick={handleCopyReference}
                    aria-label="Copy reference"
                  >
                    <HiOutlineSquare2Stack />
                    {copied ? 'Copied' : 'Copy'}
                  </button>
                </div>

                <button
                  type="button"
                  className="btn btn-primary btn-block deposit-open-btn"
                  onClick={handleOpenPaymentPage}
                >
                  <HiArrowTopRightOnSquare />
                  Open Payment Page
                </button>

                <button type="button" className="deposit-start-another" onClick={handleStartAnother}>
                  Start a new deposit
                </button>
              </div>
            )}

            {/* Security notes */}
            <div className="deposit-security-notes">
              <div className="deposit-security-row">
                <HiOutlineLockClosed />
                <span>Payments are processed securely by Paystack — TaskBridge never sees or stores your card details.</span>
              </div>
              <div className="deposit-security-row">
                <HiOutlineShieldCheck />
                <span>Your balance updates automatically once the payment is confirmed. Keep this reference until then.</span>
              </div>
            </div>
          </>
        )}
      </main>

      <BottomNav />
    </div>
  )
}

export default DepositPage
