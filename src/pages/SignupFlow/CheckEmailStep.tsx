import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import FlowShell from '../../components/FlowShell/FlowShell'
import { useSignupFlow } from '../../context/SignupFlowContext'
import { resendVerificationCode } from '../../lib/emailVerification'
import { ApiRequestError } from '../../lib/api'
import { HiOutlineEnvelope } from 'react-icons/hi2'
import './SignupFlow.css'

function CheckEmailStep() {
  const navigate = useNavigate()
  const { data, updateData } = useSignupFlow()
  const [resending, setResending] = useState(false)

  const handleResend = async () => {
    if (resending) return
    setResending(true)
    try {
      const { taskId } = await resendVerificationCode(
        data.verificationTaskId
          ? { taskId: data.verificationTaskId }
          : { email: data.email }
      )
      updateData({ verificationTaskId: taskId })
      toast.success('Verification code resent.')
    } catch (err) {
      if (err instanceof ApiRequestError) {
        if (err.status === 429) {
          toast.error(err.message)
        } else if (err.status === 409) {
          toast.error('This email is already verified.')
        } else {
          toast.error(err.message || 'Could not resend the code. Please try again.')
        }
      } else {
        toast.error('Could not reach the server. Check your connection and try again.')
      }
    } finally {
      setResending(false)
    }
  }

  return (
    <FlowShell>
      <div className="flow-step-body flow-step-body-center">
        <h1 className="flow-heading">Check your email</h1>
        <p className="flow-subheading">
          We sent a 6-digit code to <strong>{data.email || 'your email'}</strong>
        </p>

        <div className="flow-email-icon">
          <HiOutlineEnvelope />
        </div>

        <button
          type="button"
          className="btn btn-primary btn-block"
          onClick={() => navigate('/signup/otp')}
        >
          Enter Verification Code
        </button>

        <p className="flow-resend-line">
          Didn't receive the email?{' '}
          <button type="button" className="flow-resend-link" onClick={handleResend} disabled={resending}>
            {resending ? 'Resending…' : 'Resend code'}
          </button>
        </p>
      </div>
    </FlowShell>
  )
}

export default CheckEmailStep

