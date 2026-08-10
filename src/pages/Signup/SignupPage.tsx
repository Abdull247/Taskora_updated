import { useState, FormEvent, useEffect } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import Navbar from '../../components/Navbar/Navbar'
import Footer from '../../components/Footer/Footer'
import RoleSelect from '../../components/RoleSelect/RoleSelect'
import { useScrollReveal } from '../../hooks/useScrollReveal'
import { joinWaitlist } from '../../lib/waitlist'
import { ApiRequestError } from '../../lib/api'
import type { UserRole } from '../../types/api'
import { HiOutlineEye, HiOutlineEyeSlash, HiOutlineShieldCheck } from 'react-icons/hi2'
import './SignupPage.css'

interface FormData {
  firstName: string
  lastName: string
  username: string
  email: string
  phoneNumber: string
  password: string
  confirmPassword: string
  role: UserRole
  referredByCode: string
  agreedToTerms: boolean
}

interface FormErrors {
  [key: string]: string
}

const initialForm: FormData = {
  firstName: '',
  lastName: '',
  username: '',
  email: '',
  phoneNumber: '',
  password: '',
  confirmPassword: '',
  role: 'worker',
  referredByCode: '',
  agreedToTerms: false,
}

function isValidRole(value: string | null): value is UserRole {
  return value === 'worker' || value === 'advertiser'
}

function SignupPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [form, setForm] = useState<FormData>(initialForm)
  const [errors, setErrors] = useState<FormErrors>({})
  const [submitting, setSubmitting] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const headingRef = useScrollReveal<HTMLDivElement>({ threshold: 0 })
  const formRef = useScrollReveal<HTMLFormElement>({ threshold: 0, rootMargin: '0px' })

  useEffect(() => {
    const roleParam = searchParams.get('role')
    if (isValidRole(roleParam)) {
      setForm((prev) => ({ ...prev, role: roleParam }))
    }
  }, [searchParams])

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value, type, checked } = e.target
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev }
        delete next[name]
        return next
      })
    }
  }

  const handleRoleChange = (role: UserRole) => {
    setForm((prev) => ({ ...prev, role }))
  }

  const validate = (): FormErrors => {
    const next: FormErrors = {}

    if (!form.firstName.trim()) next.firstName = 'First name is required'
    if (!form.lastName.trim()) next.lastName = 'Last name is required'

    if (!form.username.trim()) {
      next.username = 'Username is required'
    } else if (!/^[a-zA-Z0-9_]{3,20}$/.test(form.username)) {
      next.username = '3-20 characters, letters/numbers/underscore only'
    }

    if (!form.email.trim()) {
      next.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      next.email = 'Enter a valid email address'
    }

    if (!form.phoneNumber.trim()) {
      next.phoneNumber = 'Phone number is required'
    } else if (!/^\+?[0-9]{7,15}$/.test(form.phoneNumber.replace(/\s/g, ''))) {
      next.phoneNumber = 'Enter a valid phone number (with country code)'
    }

    if (!form.password) {
      next.password = 'Password is required'
    } else if (form.password.length < 8) {
      next.password = 'Password must be at least 8 characters'
    }

    if (!form.confirmPassword) {
      next.confirmPassword = 'Please confirm your password'
    } else if (form.confirmPassword !== form.password) {
      next.confirmPassword = 'Passwords do not match'
    }

    if (!form.agreedToTerms) {
      next.agreedToTerms = 'You must agree to the Terms and Privacy Policy to continue'
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
      const { user } = await joinWaitlist({
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        username: form.username.trim(),
        email: form.email.trim(),
        phoneNumber: form.phoneNumber.trim(),
        password: form.password,
        role: form.role,
        referredByCode: form.referredByCode.trim() || undefined,
      })

      toast.success(`You're on the waitlist, ${user.first_name}! Check your email for confirmation.`)

      setTimeout(() => {
        navigate('/', { state: { waitlistJoined: true } })
      }, 1800)
    } catch (err) {
      if (err instanceof ApiRequestError) {
        if (err.status === 409) {
          toast.error('That email, username, or phone number is already registered.')
        } else if (err.status === 400) {
          toast.error(err.message)
        } else {
          toast.error('Something went wrong on our end. Please try again shortly.')
        }
      } else {
        toast.error('Could not reach the server. Check your connection and try again.')
      }
      setSubmitting(false)
    }
  }

  return (
    <div className="signup-page">
      <Navbar />

      <main className="signup-main">
        <div className="signup-container">
          <div ref={headingRef} className="signup-heading reveal reveal-up">
            <span className="signup-eyebrow">
              <HiOutlineShieldCheck /> Early access
            </span>
            <h1>Join the Waitlist</h1>
            <p>Create your account to get early access to TaskBridge.</p>
          </div>

          <form
            ref={formRef}
            className="signup-form reveal reveal-up reveal-delay-1"
            onSubmit={handleSubmit}
            noValidate
          >
            <div className="form-row">
              <div className="form-field">
                <label htmlFor="firstName">First name</label>
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  placeholder="Ada"
                  value={form.firstName}
                  onChange={handleChange}
                  disabled={submitting}
                  className={errors.firstName ? 'input-error' : ''}
                />
                {errors.firstName && <span className="field-error">{errors.firstName}</span>}
              </div>

              <div className="form-field">
                <label htmlFor="lastName">Last name</label>
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  placeholder="Lovelace"
                  value={form.lastName}
                  onChange={handleChange}
                  disabled={submitting}
                  className={errors.lastName ? 'input-error' : ''}
                />
                {errors.lastName && <span className="field-error">{errors.lastName}</span>}
              </div>
            </div>

            <div className="form-field">
              <label htmlFor="username">Username</label>
              <input
                id="username"
                name="username"
                type="text"
                placeholder="adalovelace"
                value={form.username}
                onChange={handleChange}
                disabled={submitting}
                className={errors.username ? 'input-error' : ''}
              />
              {errors.username && <span className="field-error">{errors.username}</span>}
            </div>

            <div className="form-field">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="ada@taskbridge.dev"
                value={form.email}
                onChange={handleChange}
                disabled={submitting}
                className={errors.email ? 'input-error' : ''}
              />
              {errors.email && <span className="field-error">{errors.email}</span>}
            </div>

            <div className="form-field">
              <label htmlFor="phoneNumber">Phone number</label>
              <input
                id="phoneNumber"
                name="phoneNumber"
                type="tel"
                placeholder="+2348012345678"
                value={form.phoneNumber}
                onChange={handleChange}
                disabled={submitting}
                className={errors.phoneNumber ? 'input-error' : ''}
              />
              {errors.phoneNumber && (
                <span className="field-error">{errors.phoneNumber}</span>
              )}
            </div>

            <div className="form-field">
              <label htmlFor="password">Password</label>
              <div className="password-input-wrap">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="At least 8 characters"
                  value={form.password}
                  onChange={handleChange}
                  disabled={submitting}
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

            <div className="form-field">
              <label htmlFor="confirmPassword">Confirm password</label>
              <div className="password-input-wrap">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Re-enter your password"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  disabled={submitting}
                  className={errors.confirmPassword ? 'input-error' : ''}
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

            <div className="form-field">
              <label htmlFor="role">I want to join as</label>
              <RoleSelect
                id="role"
                value={form.role}
                onChange={handleRoleChange}
                disabled={submitting}
              />
            </div>

            <div className="form-field">
              <label htmlFor="referredByCode">
                Referral code <span className="optional-tag">(optional)</span>
              </label>
              <input
                id="referredByCode"
                name="referredByCode"
                type="text"
                placeholder="d2ad66c7"
                value={form.referredByCode}
                onChange={handleChange}
                disabled={submitting}
              />
            </div>

            <div className="terms-field">
              <label className="terms-checkbox-label">
                <input
                  type="checkbox"
                  name="agreedToTerms"
                  checked={form.agreedToTerms}
                  onChange={handleChange}
                  disabled={submitting}
                  className="terms-checkbox-input"
                />
                <span className={`terms-checkbox-box ${errors.agreedToTerms ? 'terms-checkbox-box-error' : ''}`}>
                  <svg viewBox="0 0 16 16" className="terms-checkbox-tick">
                    <path d="M3 8.5L6.5 12L13 4.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
                <span className="terms-checkbox-text">
                  I agree to TaskBridge's{' '}
                  <a href="/terms" target="_blank" rel="noopener noreferrer">Terms of Service</a>{' '}
                  and{' '}
                  <a href="/privacy" target="_blank" rel="noopener noreferrer">Privacy Policy</a>
                </span>
              </label>
              {errors.agreedToTerms && (
                <span className="field-error field-error-terms">{errors.agreedToTerms}</span>
              )}
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-block btn-submit"
              disabled={submitting}
            >
              <span className={submitting ? 'btn-label btn-label-hidden' : 'btn-label'}>
                Join Waitlist
              </span>
              {submitting && <span className="btn-spinner" aria-label="Loading" />}
            </button>

            <p className="signup-footnote">
              Already have an account? <Link to="/login">Sign in</Link>
            </p>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default SignupPage
