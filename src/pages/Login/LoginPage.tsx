import { useState, FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import Navbar from '../../components/Navbar/Navbar'
import Footer from '../../components/Footer/Footer'
import { useScrollReveal } from '../../hooks/useScrollReveal'
import { login } from '../../lib/auth'
import { setStoredRole } from '../../lib/me'
import { ApiRequestError } from '../../lib/api'
import { withMinDelay } from '../../lib/useMinDelay'
import { HiOutlineEye, HiOutlineEyeSlash, HiOutlineShieldCheck } from 'react-icons/hi2'
import '../Signup/SignupPage.css'

interface FormData {
  email: string
  password: string
}

interface FormErrors {
  [key: string]: string
}

function LoginPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState<FormData>({ email: '', password: '' })
  const [errors, setErrors] = useState<FormErrors>({})
  const [submitting, setSubmitting] = useState(false)
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

  const validate = (): FormErrors => {
    const next: FormErrors = {}

    if (!form.email.trim()) {
      next.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      next.email = 'Enter a valid email address'
    }

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

  return (
    <div className="signup-page">
      <Navbar />

      <main className="signup-main">
        <div className="signup-container">
          <div ref={headingRef} className="signup-heading reveal reveal-up">
            <span className="signup-eyebrow">
              <HiOutlineShieldCheck /> Welcome back
            </span>
            <h1>Sign In</h1>
            <p>Log in to continue to your TaskBridge account.</p>
          </div>

          <form
            ref={formRef}
            className="signup-form reveal reveal-up reveal-delay-1"
            onSubmit={handleSubmit}
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
                disabled={submitting}
                className={errors.email ? 'input-error' : ''}
              />
              {errors.email && <span className="field-error">{errors.email}</span>}
            </div>

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

            <button
              type="submit"
              className="btn btn-primary btn-block btn-submit"
              disabled={submitting}
            >
              <span className={submitting ? 'btn-label btn-label-hidden' : 'btn-label'}>
                Sign In
              </span>
              {submitting && <span className="btn-spinner" aria-label="Loading" />}
            </button>

            <p className="signup-footnote">
              Don't have an account? <Link to="/signup">Signup</Link>
            </p>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default LoginPage
