import { useEffect, useState, FormEvent } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import FlowCenterShell from '../../components/FlowCenterShell/FlowCenterShell'
import { SEO } from '../../components/SEO/SEO'
import { verifyResetToken, confirmPasswordReset } from '../../lib/auth'
import { ApiRequestError } from '../../lib/api'
import { withMinDelay } from '../../lib/useMinDelay'
import { HiOutlineEye, HiOutlineEyeSlash, HiCheck, HiOutlineExclamationCircle } from 'react-icons/hi2'
import '../SignupFlow/SignupFlow.css'
import './ResetPasswordVerifyPage.css'

interface FormErrors {
  [key: string]: string
}

type PageState = 'verifying' | 'invalid' | 'ready' | 'done'

function ResetPasswordVerifyPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token') ?? ''

  const [state, setState] = useState<PageState>('verifying')
  const [invalidReason, setInvalidReason] = useState('This reset link is no longer valid.')
  const [email, setEmail] = useState('')

  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [errors, setErrors] = useState<FormErrors>({})
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (!token) {
      setInvalidReason('This reset link is missing its token. Please request a new one.')
      setState('invalid')
      return
    }

    let cancelled = false

    withMinDelay(() => verifyResetToken({ token }), 500)
      .then((res) => {
        if (cancelled) return
        if (!res.valid) {
          setInvalidReason(
            res.used
              ? 'This reset link has already been used.'
              : 'This reset link has expired. Please request a new one.'
          )
          setState('invalid')
          return
        }
        setEmail(res.email)
        setState('ready')
      })
      .catch((err) => {
        if (cancelled) return
        if (err instanceof ApiRequestError && err.status === 404) {
          setInvalidReason('This reset link is invalid. Please request a new one.')
        } else {
          setInvalidReason('Could not verify this reset link. Please try again.')
        }
        setState('invalid')
      })

    return () => {
      cancelled = true
    }
  }, [token])

  const validate = (): FormErrors => {
    const next: FormErrors = {}

    if (!password) {
      next.password = 'Password is required'
    } else if (password.length < 8) {
      next.password = 'Password must be at least 8 characters'
    }

    if (!confirmPassword) {
      next.confirmPassword = 'Please confirm your password'
    } else if (confirmPassword !== password) {
      next.confirmPassword = 'Passwords do not match'
    }

    return next
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    const validationErrors = validate()
    setErrors(validationErrors)
    if (Object.keys(validationErrors).length > 0) return

    setSubmitting(true)
    try {
      await withMinDelay(() => confirmPasswordReset({ email, token, newPassword: password }))
      toast.success('Password reset — you can sign in now.')
      setState('done')
    } catch (err) {
      if (err instanceof ApiRequestError) {
        if (err.status === 409) {
          setInvalidReason('This reset link has already been used.')
          setState('invalid')
        } else if (err.status === 410) {
          setInvalidReason('This reset link has expired. Please request a new one.')
          setState('invalid')
        } else if (err.status === 401) {
          setInvalidReason('This reset link is invalid. Please request a new one.')
          setState('invalid')
        } else if (err.status === 400) {
          toast.error(err.message || 'Please check your new password and try again.')
        } else {
          toast.error(err.message || 'Something went wrong on our end. Please try again shortly.')
        }
      } else {
        toast.error('Could not reach the server. Check your connection and try again.')
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="reset-verify-page">
      <SEO title="Reset Password | TaskBridge" description="Set a new password for your TaskBridge account." noindex />

      {state === 'verifying' && (
        <div className="reset-verify-loading-wrap">
          <div className="reset-verify-loading-box">
            <span className="reset-verify-spinner" aria-hidden="true" />
            <p className="reset-verify-loading-text">Verifying reset token…</p>
          </div>
        </div>
      )}

      {state === 'invalid' && (
        <FlowCenterShell heading="Link no longer valid" subheading={invalidReason}>
          <div className="reset-verify-invalid-icon">
            <HiOutlineExclamationCircle />
          </div>
          <Link to="/login" className="btn btn-primary btn-block">
            Back to Sign In
          </Link>
        </FlowCenterShell>
      )}

      {state === 'ready' && (
        <div className="reset-verify-ready reveal reveal-up reveal-visible">
          <FlowCenterShell heading="Set a new password" subheading={`Choose a new password for ${email}`}>
            <form className="flow-step-body" onSubmit={handleSubmit} noValidate>
              <div className="form-field">
                <label htmlFor="password">New password</label>
                <div className="password-input-wrap">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="At least 8 characters"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value)
                      if (errors.password) setErrors((p) => ({ ...p, password: '' }))
                    }}
                    className={errors.password ? 'input-error' : ''}
                    disabled={submitting}
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPassword((s) => !s)}
                    tabIndex={-1}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <HiOutlineEyeSlash /> : <HiOutlineEye />}
                  </button>
                </div>
                {errors.password && <span className="field-error">{errors.password}</span>}
              </div>

              <div className="form-field">
                <label htmlFor="confirmPassword">Confirm new password</label>
                <div className="password-input-wrap">
                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Re-enter your new password"
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value)
                      if (errors.confirmPassword) setErrors((p) => ({ ...p, confirmPassword: '' }))
                    }}
                    className={errors.confirmPassword ? 'input-error' : ''}
                    disabled={submitting}
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowConfirmPassword((s) => !s)}
                    tabIndex={-1}
                    aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                  >
                    {showConfirmPassword ? <HiOutlineEyeSlash /> : <HiOutlineEye />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <span className="field-error">{errors.confirmPassword}</span>
                )}
              </div>

              <button
                type="submit"
                className="btn btn-primary btn-block btn-submit"
                disabled={submitting}
              >
                <span className={submitting ? 'btn-label btn-label-hidden' : 'btn-label'}>
                  Reset password
                </span>
                {submitting && <span className="btn-spinner" aria-label="Loading" />}
              </button>
            </form>
          </FlowCenterShell>
        </div>
      )}

      {state === 'done' && (
        <FlowCenterShell heading="Password reset" subheading="Your password has been updated successfully.">
          <div className="reset-success-circle">
            <HiCheck className="reset-success-check" />
          </div>
          <button
            type="button"
            className="btn btn-primary btn-block"
            onClick={() => navigate('/login')}
          >
            Back to Sign In
          </button>
        </FlowCenterShell>
      )}
    </div>
  )
}

export default ResetPasswordVerifyPage
