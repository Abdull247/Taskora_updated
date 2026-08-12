import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import FlowCenterShell from '../../components/FlowCenterShell/FlowCenterShell'
import RoleSelect from '../../components/RoleSelect/RoleSelect'
import { useSignupFlow } from '../../context/SignupFlowContext'
import { sendVerificationCode } from '../../lib/emailVerification'
import { ApiRequestError } from '../../lib/api'
import { withMinDelay } from '../../lib/useMinDelay'
import type { UserRole } from '../../types/api'
import './SignupFlow.css'

function RoleStep() {
  const navigate = useNavigate()
  const { data, updateData } = useSignupFlow()
  const role = data.role ?? 'worker'
  const [submitting, setSubmitting] = useState(false)

  const handleChange = (newRole: UserRole) => {
    updateData({ role: newRole })
  }

  const handleContinue = async () => {
    if (role === 'advertiser') {
      navigate('/signup/business')
      return
    }

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
      heading="How will you use TaskBridge?"
      subheading="This choice is permanent and cannot be changed later"
    >
      <RoleSelect value={role} onChange={handleChange} />

      <button
        type="button"
        className="btn btn-primary btn-block btn-submit"
        onClick={handleContinue}
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

export default RoleStep
