import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import FlowShell from '../../components/FlowShell/FlowShell'
import { useSignupFlow } from '../../context/SignupFlowContext'
import { withMinDelay } from '../../lib/useMinDelay'
import { HiOutlineEye, HiOutlineEyeSlash } from 'react-icons/hi2'
import './SignupFlow.css'

interface FormErrors {
  [key: string]: string
}

function CreatePasswordStep() {
  const navigate = useNavigate()
  const { data, updateData } = useSignupFlow()
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [errors, setErrors] = useState<FormErrors>({})
  const [submitting, setSubmitting] = useState(false)

  const validate = (): FormErrors => {
    const next: FormErrors = {}

    if (!data.password) {
      next.password = 'Password is required'
    } else if (data.password.length < 8) {
      next.password = 'Password must be at least 8 characters'
    }

    if (!confirmPassword) {
      next.confirmPassword = 'Please confirm your password'
    } else if (confirmPassword !== data.password) {
      next.confirmPassword = 'Passwords do not match'
    }

    return next
  }

  const handleSubmit = async () => {
    const validationErrors = validate()
    setErrors(validationErrors)
    if (Object.keys(validationErrors).length > 0) return

    setSubmitting(true)
    await withMinDelay(async () => {})
    setSubmitting(false)
    navigate('/signup/role')
  }

  return (
    <FlowShell>
      <div className="flow-step-body">
        <h1 className="flow-heading">Create a password</h1>
        <p className="flow-subheading">Choose a strong password to protect your account</p>

        <div className="form-field">
          <label htmlFor="password">Password</label>
          <div className="password-input-wrap">
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="At least 8 characters"
              value={data.password}
              onChange={(e) => {
                updateData({ password: e.target.value })
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
          <label htmlFor="confirmPassword">Confirm password</label>
          <div className="password-input-wrap">
            <input
              id="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="Re-enter your password"
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
          {errors.confirmPassword && <span className="field-error">{errors.confirmPassword}</span>}
        </div>

        <button
          type="button"
          className="btn btn-primary btn-block btn-submit"
          onClick={handleSubmit}
          disabled={submitting}
        >
          <span className={submitting ? 'btn-label btn-label-hidden' : 'btn-label'}>
            Set Password
          </span>
          {submitting && <span className="btn-spinner" aria-label="Loading" />}
        </button>
      </div>
    </FlowShell>
  )
}

export default CreatePasswordStep
