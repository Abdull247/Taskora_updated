import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import FlowCenterShell from '../../components/FlowCenterShell/FlowCenterShell'
import { useSignupFlow } from '../../context/SignupFlowContext'
import { sendVerificationCode } from '../../lib/emailVerification'
import { ApiRequestError } from '../../lib/api'
import { withMinDelay } from '../../lib/useMinDelay'
import './SignupFlow.css'

interface FormErrors {
  [key: string]: string
}

function BusinessInfoStep() {
  const navigate = useNavigate()
  const { data, updateData } = useSignupFlow()
  const [errors, setErrors] = useState<FormErrors>({})
  const [submitting, setSubmitting] = useState(false)

  const validate = (): FormErrors => {
    const next: FormErrors = {}
    if (!data.businessName.trim()) next.businessName = 'Business name is required'
    if (!data.industry.trim()) next.industry = 'Industry is required'
    return next
  }

  const handleSubmit = async () => {
    const validationErrors = validate()
    setErrors(validationErrors)
    if (Object.keys(validationErrors).length > 0) return

    setSubmitting(true)
    try {
      const { taskId } = await withMinDelay(() => sendVerificationCode({ email: data.email.trim() }))
      updateData({ verificationTaskId: taskId, emailVerified: false })
      navigate('/signup/verify-email')
    } catch (err) {
      if (err instanceof ApiRequestError) {
        toast.error(err.message || 'Could not send a verification code. Please try again.')
      } else {
        toast.error('Could not reach the server. Check your connection and try again.')
      }
      setSubmitting(false)
    }
  }

  return (
    <FlowCenterShell
      heading="Tell us about your business"
      subheading="This helps us show your tasks to the right people"
    >
      <div className="form-field">
        <label htmlFor="businessName">Business name</label>
        <input
          id="businessName"
          type="text"
          placeholder="Acme Technologies Ltd"
          value={data.businessName}
          onChange={(e) => {
            updateData({ businessName: e.target.value })
            if (errors.businessName) setErrors((p) => ({ ...p, businessName: '' }))
          }}
          className={errors.businessName ? 'input-error' : ''}
          disabled={submitting}
        />
        {errors.businessName && <span className="field-error">{errors.businessName}</span>}
      </div>

      <div className="form-field">
        <label htmlFor="industry">Industry</label>
        <input
          id="industry"
          type="text"
          placeholder="e.g. Fintech, E-commerce, Music"
          value={data.industry}
          onChange={(e) => {
            updateData({ industry: e.target.value })
            if (errors.industry) setErrors((p) => ({ ...p, industry: '' }))
          }}
          className={errors.industry ? 'input-error' : ''}
          disabled={submitting}
        />
        {errors.industry && <span className="field-error">{errors.industry}</span>}
      </div>

      <div className="form-field">
        <label htmlFor="website">
          Website <span className="optional-tag">(optional)</span>
        </label>
        <input
          id="website"
          type="url"
          placeholder="https://yourbusiness.com"
          value={data.website}
          onChange={(e) => updateData({ website: e.target.value })}
          disabled={submitting}
        />
      </div>

      <button
        type="button"
        className="btn btn-primary btn-block btn-submit"
        onClick={handleSubmit}
        disabled={submitting}
      >
        <span className={submitting ? 'btn-label btn-label-hidden' : 'btn-label'}>
          Continue
        </span>
        {submitting && <span className="btn-spinner" aria-label="Loading" />}
      </button>
    </FlowCenterShell>
  )
}

export default BusinessInfoStep
