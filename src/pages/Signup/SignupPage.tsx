import { useState, FormEvent, useEffect } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import Navbar from '../../components/Navbar/Navbar'
import Footer from '../../components/Footer/Footer'
import { useScrollReveal } from '../../hooks/useScrollReveal'
import { joinWaitlist } from '../../lib/waitlist'
import { ApiRequestError } from '../../lib/api'
import type { UserRole } from '../../types/api'
import { HiChevronDown } from 'react-icons/hi2'
import './SignupPage.css'

interface FormData {
  firstName: string
  lastName: string
  username: string
  email: string
  phoneNumber: string
  password: string
  role: UserRole
  referredByCode: string
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
  role: 'worker',
  referredByCode: '',
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

  const headingRef = useScrollReveal<HTMLDivElement>({ threshold: 0 })
  const formRef = useScrollReveal<HTMLFormElement>({ threshold: 0, rootMargin: '0px' })

  useEffect(() => {
    const roleParam = searchParams.get('role')
    if (isValidRole(roleParam)) {
      setForm((prev) => ({ ...prev, role: roleParam }))
    }
  }, [searchParams])

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
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
        navigate('/success', { state: { 
          role: form.role,
        }
      })
      }, 1800);
    }catch (err) {
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
            <h1>Join the Waitlist</h1>
            <p>Create your account to get early access to Taskora.</p>
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
                placeholder="ada@taskora.dev"
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
              <input
                id="password"
                name="password"
                type="password"
                placeholder="At least 8 characters"
                value={form.password}
                onChange={handleChange}
                disabled={submitting}
                className={errors.password ? 'input-error' : ''}
              />
              {errors.password && <span className="field-error">{errors.password}</span>}
            </div>

            <div className="form-field">
              <label htmlFor="role">I want to join as</label>
              <div className="select-wrap">
                <select
                  id="role"
                  name="role"
                  value={form.role}
                  onChange={handleChange}
                  disabled={submitting}
                >
                  <option value="worker">Tasker</option>
                  <option value="advertiser">Advertiser</option>
                </select>
                <HiChevronDown className="select-icon" />
              </div>
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
