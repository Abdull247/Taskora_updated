import { useState, FormEvent, useEffect } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import Navbar from '../../components/Navbar/Navbar'
import Footer from '../../components/Footer/Footer'
import { useSignupFlow } from '../../context/SignupFlowContext'
import { useScrollReveal } from '../../hooks/useScrollReveal'
import { withMinDelay } from '../../lib/useMinDelay'
import type { UserRole } from '../../types/api'
import './SignupFlow.css'

interface FormErrors {
  [key: string]: string
}

function isValidRole(value: string | null): value is UserRole {
  return value === 'worker' || value === 'advertiser'
}

function CreateAccountStep() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { data, updateData } = useSignupFlow()
  const [errors, setErrors] = useState<FormErrors>({})
  const [submitting, setSubmitting] = useState(false)
  const headingRef = useScrollReveal<HTMLDivElement>({ threshold: 0 })
  const formRef = useScrollReveal<HTMLFormElement>({ threshold: 0, rootMargin: '0px' })

  useEffect(() => {
    const roleParam = searchParams.get('role')
    if (isValidRole(roleParam)) {
      updateData({ role: roleParam })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams])

  const validate = (): FormErrors => {
    const next: FormErrors = {}

    if (!data.firstName.trim()) next.firstName = 'First name is required'
    if (!data.lastName.trim()) next.lastName = 'Last name is required'

    if (!data.email.trim()) {
      next.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      next.email = 'Enter a valid email address'
    }

    if (!data.phoneNumber.trim()) {
      next.phoneNumber = 'Phone number is required'
    } else if (!/^\+?[0-9]{7,15}$/.test(data.phoneNumber.replace(/\s/g, ''))) {
      next.phoneNumber = 'Enter a valid phone number (with country code)'
    }

    if (!data.agreedToTerms) {
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
    await withMinDelay(async () => {})
    updateData({ email: data.email.trim() })
    setSubmitting(false)
    navigate('/signup/password')
  }

  return (
    <div className="signup-page">
      <Navbar />

      <main className="signup-main">
        <div className="signup-container">
          <div ref={headingRef} className="signup-heading reveal reveal-up">
            <h1>Create your account</h1>
            <p>Join 120,000+ Nigerians earning on TaskBridge</p>
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
                  type="text"
                  placeholder="Ada"
                  value={data.firstName}
                  onChange={(e) => {
                    updateData({ firstName: e.target.value })
                    if (errors.firstName) setErrors((p) => ({ ...p, firstName: '' }))
                  }}
                  className={errors.firstName ? 'input-error' : ''}
                  disabled={submitting}
                />
                {errors.firstName && <span className="field-error">{errors.firstName}</span>}
              </div>

              <div className="form-field">
                <label htmlFor="lastName">Last name</label>
                <input
                  id="lastName"
                  type="text"
                  placeholder="Lovelace"
                  value={data.lastName}
                  onChange={(e) => {
                    updateData({ lastName: e.target.value })
                    if (errors.lastName) setErrors((p) => ({ ...p, lastName: '' }))
                  }}
                  className={errors.lastName ? 'input-error' : ''}
                  disabled={submitting}
                />
                {errors.lastName && <span className="field-error">{errors.lastName}</span>}
              </div>
            </div>

            <div className="form-field">
              <label htmlFor="email">Email address</label>
              <input
                id="email"
                type="email"
                placeholder="ada@taskbridge.dev"
                value={data.email}
                onChange={(e) => {
                  updateData({ email: e.target.value })
                  if (errors.email) setErrors((p) => ({ ...p, email: '' }))
                }}
                className={errors.email ? 'input-error' : ''}
                disabled={submitting}
              />
              {errors.email && <span className="field-error">{errors.email}</span>}
            </div>

            <div className="form-field">
              <label htmlFor="phoneNumber">Phone number</label>
              <input
                id="phoneNumber"
                type="tel"
                placeholder="+2348012345678"
                value={data.phoneNumber}
                onChange={(e) => {
                  updateData({ phoneNumber: e.target.value })
                  if (errors.phoneNumber) setErrors((p) => ({ ...p, phoneNumber: '' }))
                }}
                className={errors.phoneNumber ? 'input-error' : ''}
                disabled={submitting}
              />
              {errors.phoneNumber && <span className="field-error">{errors.phoneNumber}</span>}
            </div>

            <div className="terms-field">
              <label className="terms-checkbox-label">
                <input
                  type="checkbox"
                  checked={data.agreedToTerms}
                  onChange={(e) => {
                    updateData({ agreedToTerms: e.target.checked })
                    if (errors.agreedToTerms) setErrors((p) => ({ ...p, agreedToTerms: '' }))
                  }}
                  className="terms-checkbox-input"
                  disabled={submitting}
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

            <button type="submit" className="btn btn-primary btn-block btn-submit" disabled={submitting}>
              <span className={submitting ? 'btn-label btn-label-hidden' : 'btn-label'}>
                Create Account
              </span>
              {submitting && <span className="btn-spinner" aria-label="Loading" />}
            </button>

            <p className="signup-footnote">
              Already have an account? <Link to="/login">Login</Link>
            </p>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default CreateAccountStep
