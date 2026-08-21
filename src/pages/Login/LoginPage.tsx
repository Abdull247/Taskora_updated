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
