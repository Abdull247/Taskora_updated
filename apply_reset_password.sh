#!/data/data/com.termux/files/usr/bin/bash
set -e
cd /data/data/org.smartide.code/files/home/projects/TaskoraFrontend/src

echo "→ Creating directories"
mkdir -p pages/ResetPassword

echo "→ Writing pages/Login/LoginPage.tsx"
cat > "pages/Login/LoginPage.tsx" << 'FILE_EOF'
import { useState, FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import Navbar from '../../components/Navbar/Navbar'
import Footer from '../../components/Footer/Footer'
import { useScrollReveal } from '../../hooks/useScrollReveal'
import { SEO } from '../../components/SEO/SEO'
import { login, requestPasswordReset } from '../../lib/auth'
import { setStoredRole } from '../../lib/me'
import { ApiRequestError } from '../../lib/api'
import { withMinDelay } from '../../lib/useMinDelay'
import { HiOutlineEye, HiOutlineEyeSlash, HiOutlineShieldCheck, HiCheck } from 'react-icons/hi2'
import '../Signup/SignupPage.css'
import './LoginPage.css'

interface FormData {
  email: string
  password: string
}

interface FormErrors {
  [key: string]: string
}

type LoginMode = 'login' | 'reset' | 'reset-sent'

function LoginPage() {
  const navigate = useNavigate()
  const [mode, setMode] = useState<LoginMode>('login')
  const [form, setForm] = useState<FormData>({ email: '', password: '' })
  const [errors, setErrors] = useState<FormErrors>({})
  const [submitting, setSubmitting] = useState(false)
  const [resetting, setResetting] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const headingRef = useScrollReveal<HTMLDivElement>({ threshold: 0 })
  const formRef = useScrollReveal<HTMLFormElement>({ threshold: 0, rootMargin: '0px' })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev }
        delete next[name]
        return next
      })
    }
  }

  const validateEmail = (): FormErrors => {
    const next: FormErrors = {}
    if (!form.email.trim()) {
      next.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      next.email = 'Enter a valid email address'
    }
    return next
  }

  const validate = (): FormErrors => {
    const next = validateEmail()

    if (!form.password) {
      next.password = 'Password is required'
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
      const { accessToken, refreshToken, user } = await withMinDelay(() =>
        login({ email: form.email.trim(), password: form.password })
      )

      localStorage.setItem('accessToken', accessToken)
      localStorage.setItem('refreshToken', refreshToken)
      setStoredRole(user.role)

      toast.success(`Welcome back, ${user.firstName}!`)

      setTimeout(() => {
        navigate('/dashboard')
      }, 600)
    } catch (err) {
      if (err instanceof ApiRequestError) {
        if (err.status === 401) {
          toast.error('Incorrect email or password.')
        } else if (err.status === 404) {
          toast.error('No account found with that email.')
        } else {
          toast.error(err.message || 'Something went wrong on our end. Please try again shortly.')
        }
      } else {
        toast.error('Could not reach the server. Check your connection and try again.')
      }
      setSubmitting(false)
    }
  }

  const enterResetMode = () => {
    setErrors({})
    setMode('reset')
  }

  const cancelResetMode = () => {
    setErrors({})
    setMode('login')
  }

  const handleResetSubmit = async (e: FormEvent) => {
    e.preventDefault()
    const validationErrors = validateEmail()
    setErrors(validationErrors)

    if (Object.keys(validationErrors).length > 0) return

    setResetting(true)
    try {
      await withMinDelay(() => requestPasswordReset({ email: form.email.trim() }))
      toast.success('Reset link sent — check your email.')
      setMode('reset-sent')
    } catch (err) {
      if (err instanceof ApiRequestError) {
        if (err.status === 404) {
          toast.error('No account found with that email.')
        } else if (err.status === 429) {
          toast.error(err.message || 'Too many reset attempts. Try again later.')
        } else if (err.status === 502) {
          toast.error('Could not send the reset email. Please try again shortly.')
        } else {
          toast.error(err.message || 'Something went wrong on our end. Please try again shortly.')
        }
      } else {
        toast.error('Could not reach the server. Check your connection and try again.')
      }
    } finally {
      setResetting(false)
    }
  }

  if (mode === 'reset-sent') {
    return (
      <div className="signup-page">
        <SEO
          title="Reset link sent | TaskBridge"
          description="We've sent a password reset link to your email."
          noindex
        />
        <Navbar />

        <main className="signup-success-main">
          <div className="signup-success-card reveal reveal-up reveal-visible">
            <div className="reset-success-circle">
              <HiCheck className="reset-success-check" />
            </div>
            <h2>Check your email</h2>
            <p>
              We've sent a password reset link to <strong>{form.email.trim()}</strong>. It expires
              in 60 minutes.
            </p>
            <button
              type="button"
              className="btn btn-primary btn-block"
              onClick={() => setMode('login')}
            >
              Back to Sign In
            </button>
          </div>
        </main>

        <Footer />
      </div>
    )
  }

  const isReset = mode === 'reset'

  return (
    <div className="signup-page">
      <SEO
        title="Sign In to TaskBridge: Manage Your Tasks and Rewards"
        description="Access your TaskBridge account to track your earnings, manage your tasks, and connect with Advertisers or Taskers."
      />
      <Navbar />

      <main className="signup-main">
        <div className="signup-container">
          <div ref={headingRef} className="signup-heading reveal reveal-up">
            <span className="signup-eyebrow">
              <HiOutlineShieldCheck /> {isReset ? 'Reset password' : 'Welcome back'}
            </span>
            <h1>{isReset ? 'Reset Password' : 'Sign In'}</h1>
            <p>
              {isReset
                ? "Enter your account email and we'll send you a link to reset your password."
                : 'Log in to continue to your TaskBridge account.'}
            </p>
          </div>

          <form
            ref={formRef}
            className="signup-form reveal reveal-up reveal-delay-1"
            onSubmit={isReset ? handleResetSubmit : handleSubmit}
            noValidate
          >
            <div className="form-field">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="ada@taskbridge.dev"
                value={form.email}
                onChange={handleChange}
                disabled={submitting || resetting}
                className={errors.email ? 'input-error' : ''}
              />
              {errors.email && <span className="field-error">{errors.email}</span>}
            </div>

            <div className={`login-password-collapse ${isReset ? 'login-password-collapsed' : ''}`}>
              <div className="login-password-collapse-inner">
                <div className="form-field">
                  <label htmlFor="password">Password</label>
                  <div className="password-input-wrap">
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Your password"
                      value={form.password}
                      onChange={handleChange}
                      disabled={submitting || isReset}
                      tabIndex={isReset ? -1 : 0}
                      className={errors.password ? 'input-error' : ''}
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

                <div className="login-forgot-row">
                  <button type="button" className="login-forgot-link" onClick={enterResetMode}>
                    Reset password
                  </button>
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-block btn-submit"
              disabled={isReset ? resetting : submitting}
            >
              <span
                className={
                  (isReset ? resetting : submitting) ? 'btn-label btn-label-hidden' : 'btn-label'
                }
              >
                {isReset ? 'Reset password' : 'Sign In'}
              </span>
              {(isReset ? resetting : submitting) && (
                <span className="btn-spinner" aria-label="Loading" />
              )}
            </button>

            {isReset ? (
              <p className="signup-footnote">
                <button type="button" className="login-forgot-link" onClick={cancelResetMode}>
                  ← Back to Sign In
                </button>
              </p>
            ) : (
              <p className="signup-footnote">
                Don't have an account? <Link to="/signup">Signup</Link>
              </p>
            )}
          </form>
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default LoginPage
FILE_EOF

echo "→ Writing pages/Login/LoginPage.css"
cat > "pages/Login/LoginPage.css" << 'FILE_EOF'
/* ===== Forgot / reset password link ===== */
.login-forgot-row {
  display: flex;
  justify-content: flex-end;
  margin-top: -6px;
}

.login-forgot-link {
  background: none;
  border: none;
  padding: 2px 0;
  font-family: var(--font-label);
  font-size: 13px;
  font-weight: 600;
  color: var(--color-primary);
  cursor: pointer;
  text-align: right;
}

.login-forgot-link:hover {
  text-decoration: underline;
}

/* ===== Smooth password-field collapse (login <-> reset mode) ===== */
.login-password-collapse {
  display: grid;
  grid-template-rows: 1fr;
  opacity: 1;
  transition: grid-template-rows 0.32s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.22s ease;
}

.login-password-collapse-inner {
  overflow: hidden;
  display: flex;
  flex-direction: column;
  gap: 20px;
  min-height: 0;
}

.login-password-collapsed {
  grid-template-rows: 0fr;
  opacity: 0;
}

@media (prefers-reduced-motion: reduce) {
  .login-password-collapse {
    transition: none;
  }
}

/* ===== Reset-link-sent success icon (mirrors the signup success circle,
   but sized down to sit inside .signup-success-card) ===== */
.reset-success-circle {
  width: 88px;
  height: 88px;
  margin: 0 auto 20px;
  border-radius: 50%;
  background: #EEF4FF;
  border: 10px solid #D9E8FF;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: reset-pop 0.45s ease;
}

.reset-success-check {
  font-size: 40px;
  color: var(--color-primary);
}

@keyframes reset-pop {
  0% {
    transform: scale(0.6);
    opacity: 0;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}
FILE_EOF

echo "→ Writing pages/ResetPassword/ResetPasswordVerifyPage.tsx"
cat > "pages/ResetPassword/ResetPasswordVerifyPage.tsx" << 'FILE_EOF'
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
FILE_EOF

echo "→ Writing pages/ResetPassword/ResetPasswordVerifyPage.css"
cat > "pages/ResetPassword/ResetPasswordVerifyPage.css" << 'FILE_EOF'
.reset-verify-page {
  background: var(--color-surface);
  min-height: 100vh;
}

/* ===== Verifying state: centered spinner in a styled box ===== */
.reset-verify-loading-wrap {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px var(--margin-mobile);
}

.reset-verify-loading-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 18px;
  width: 100%;
  max-width: 320px;
  background: var(--color-surface-container-lowest);
  border-radius: var(--radius-xl);
  padding: 40px 28px;
  box-shadow: 0 1px 2px rgba(15, 23, 42, 0.06), 0 12px 32px rgba(15, 23, 42, 0.08);
  animation: reset-verify-fade-in 0.3s ease;
}

.reset-verify-spinner {
  width: 40px;
  height: 40px;
  border: 3.5px solid var(--color-brand-blue-tint);
  border-top-color: var(--color-primary);
  border-radius: 50%;
  animation: reset-verify-spin 0.8s linear infinite;
}

.reset-verify-loading-text {
  margin: 0;
  font-family: var(--font-label);
  font-size: 14px;
  font-weight: 600;
  color: var(--color-on-surface-variant);
  text-align: center;
}

@keyframes reset-verify-spin {
  to {
    transform: rotate(360deg);
  }
}

@keyframes reset-verify-fade-in {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: none;
  }
}

/* ===== Invalid-token state ===== */
.reset-verify-invalid-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 64px;
  height: 64px;
  margin: 0 auto 24px;
  border-radius: 50%;
  background: #fef2f2;
  color: #ba1a1a;
  font-size: 30px;
}

/* ===== Ready state (set-new-password form) ===== */
.reset-verify-ready .flow-step-body {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* ===== Success icon (mirrors LoginPage's reset-link-sent icon) ===== */
.reset-success-circle {
  width: 88px;
  height: 88px;
  margin: 0 auto 20px;
  border-radius: 50%;
  background: #EEF4FF;
  border: 10px solid #D9E8FF;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: reset-pop 0.45s ease;
}

.reset-success-check {
  font-size: 40px;
  color: var(--color-primary);
}

@keyframes reset-pop {
  0% {
    transform: scale(0.6);
    opacity: 0;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

@media (prefers-reduced-motion: reduce) {
  .reset-verify-loading-box,
  .reset-success-circle {
    animation: none;
  }

  .reset-verify-spinner {
    animation-duration: 1.2s;
  }
}
FILE_EOF

echo "→ Writing lib/auth.ts"
cat > "lib/auth.ts" << 'FILE_EOF'
import { apiRequest } from './api'
import type {
  LoginPayload,
  LoginResponse,
  RequestPasswordResetPayload,
  RequestPasswordResetResponse,
  VerifyResetTokenPayload,
  VerifyResetTokenResponse,
  ConfirmPasswordResetPayload,
  ConfirmPasswordResetResponse,
} from '../types/api'

export function login(payload: LoginPayload) {
  return apiRequest<LoginResponse>('/auth/login', {
    method: 'POST',
    body: payload,
  })
}

/**
 * Step 1 of the reset flow. No auth required — same as /auth/login.
 * Backend returns a distinct 404 for unregistered emails (not masked).
 */
export function requestPasswordReset(payload: RequestPasswordResetPayload) {
  return apiRequest<RequestPasswordResetResponse>('/auth/resetpassword', {
    method: 'POST',
    body: payload,
  })
}

/**
 * Step 2 (optional, read-only). Checks token validity without consuming it —
 * used to gate the "set new password" form when the user lands from the email link.
 */
export function verifyResetToken(payload: VerifyResetTokenPayload) {
  return apiRequest<VerifyResetTokenResponse>('/auth/resetpassword/verify', {
    method: 'POST',
    body: payload,
  })
}

/**
 * Step 3. Submits the token + new password. On success all of the user's
 * existing refresh tokens are revoked server-side.
 */
export function confirmPasswordReset(payload: ConfirmPasswordResetPayload) {
  return apiRequest<ConfirmPasswordResetResponse>('/auth/resetpassword/confirm', {
    method: 'POST',
    body: payload,
  })
}
FILE_EOF

echo "→ Patching App.tsx (import + route for ResetPasswordVerifyPage)"
if grep -q "ResetPasswordVerifyPage" App.tsx; then
  echo "   ⚠ App.tsx already references ResetPasswordVerifyPage — skipping"
else
  sed -i "s#import WaitlistSuccessPage from './pages/WaitlistSuccess/WaitlistSuccessPage'#import WaitlistSuccessPage from './pages/WaitlistSuccess/WaitlistSuccessPage'\nimport ResetPasswordVerifyPage from './pages/ResetPassword/ResetPasswordVerifyPage'#" App.tsx
  sed -i 's#<Route path="/login" element={<LoginPage />} />#<Route path="/login" element={<LoginPage />} />\n          <Route path="/reset-password" element={<ResetPasswordVerifyPage />} />#' App.tsx
  echo "   ✓ App.tsx patched"
fi

echo "→ Patching types/api.ts (adding password reset types)"
if grep -q "Password reset ----" types/api.ts; then
  echo "   ⚠ types/api.ts already has password reset types — skipping"
else
  awk '
    /^\/\/ ---- \/me ----$/ && !done {
      print "// ---- Password reset ----"
      print ""
      print "export interface RequestPasswordResetPayload {"
      print "  email: string"
      print "}"
      print ""
      print "export interface RequestPasswordResetResponse {"
      print "  status: '\''sent'\''"
      print "  email: string"
      print "  expiresInMinutes: number"
      print "}"
      print ""
      print "export interface VerifyResetTokenPayload {"
      print "  token: string"
      print "}"
      print ""
      print "export interface VerifyResetTokenResponse {"
      print "  email: string"
      print "  valid: boolean"
      print "  used: boolean"
      print "  usedAt: string | null"
      print "  expired: boolean"
      print "  expiresAt: string"
      print "  requestedAt: string"
      print "}"
      print ""
      print "export interface ConfirmPasswordResetPayload {"
      print "  email: string"
      print "  token: string"
      print "  newPassword: string"
      print "}"
      print ""
      print "export interface ConfirmPasswordResetResponse {"
      print "  status: '\''reset'\''"
      print "  email: string"
      print "}"
      print ""
      done = 1
    }
    { print }
  ' types/api.ts > types/api.ts.tmp && mv types/api.ts.tmp types/api.ts
  echo "   ✓ types/api.ts patched"
fi

echo ""
echo "✅ All done. Review with: git diff  (or just check the files)"
