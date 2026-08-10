import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import FlowShell from '../../components/FlowShell/FlowShell'
import { useSignupFlow } from '../../context/SignupFlowContext'
import { HiOutlineEnvelope } from 'react-icons/hi2'
import './SignupFlow.css'

function CheckEmailStep() {
  const navigate = useNavigate()
  const { data } = useSignupFlow()

  const handleResend = () => {
    toast.success('Verification code resent.')
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
          <button type="button" className="flow-resend-link" onClick={handleResend}>
            Resend code
          </button>
        </p>
      </div>
    </FlowShell>
  )
}

export default CheckEmailStep
