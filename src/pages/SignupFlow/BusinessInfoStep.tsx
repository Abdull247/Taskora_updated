import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import FlowCenterShell from '../../components/FlowCenterShell/FlowCenterShell'
import { useSignupFlow } from '../../context/SignupFlowContext'
import './SignupFlow.css'

interface FormErrors {
  [key: string]: string
}

function BusinessInfoStep() {
  const navigate = useNavigate()
  const { data, updateData } = useSignupFlow()
  const [errors, setErrors] = useState<FormErrors>({})

  const validate = (): FormErrors => {
    const next: FormErrors = {}
    if (!data.businessName.trim()) next.businessName = 'Business name is required'
    if (!data.industry.trim()) next.industry = 'Industry is required'
    return next
  }

  const handleSubmit = () => {
    const validationErrors = validate()
    setErrors(validationErrors)
    if (Object.keys(validationErrors).length > 0) return

    navigate('/signup/done')
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
        />
      </div>

      <button type="button" className="btn btn-primary btn-block" onClick={handleSubmit}>
        Go to Dashboard
      </button>
    </FlowCenterShell>
  )
}

export default BusinessInfoStep
