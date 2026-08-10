import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import FlowShell from '../../components/FlowShell/FlowShell'
import OtpInput from '../../components/OtpInput/OtpInput'
import './SignupFlow.css'

const EXPIRY_SECONDS = 4 * 60 + 32

function formatTime(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
}

function OtpStep() {
  const navigate = useNavigate()
  const [otp, setOtp] = useState<string[]>(Array(6).fill(''))
  const [error, setError] = useState('')
  const [verifying, setVerifying] = useState(false)
  const [secondsLeft, setSecondsLeft] = useState(EXPIRY_SECONDS)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setSecondsLeft((s) => (s > 0 ? s - 1 : 0))
    }, 1000)
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [])

  const handleVerify = () => {
    const code = otp.join('')
    if (code.length < 6) {
      setError('Enter the full 6-digit code')
      return
    }
    setError('')
    setVerifying(true)

    // Demo only — no real verification yet
    setTimeout(() => {
      setVerifying(false)
      navigate('/signup/password')
    }, 1200)
  }

  const handleResend = () => {
    setSecondsLeft(EXPIRY_SECONDS)
    setOtp(Array(6).fill(''))
    toast.success('A new code has been sent.')
  }

  return (
    <FlowShell>
      <div className="flow-step-body">
        <h1 className="flow-heading">Enter OTP</h1>
        <p className="flow-subheading">Enter the 6-digit code we sent to your email</p>

        <OtpInput value={otp} onChange={setOtp} disabled={verifying} error={!!error} />
        {error && <span className="field-error flow-otp-error">{error}</span>}

        <button
          type="button"
          className="btn btn-primary btn-block btn-submit flow-otp-submit"
          onClick={handleVerify}
          disabled={verifying}
        >
          <span className={verifying ? 'btn-label btn-label-hidden' : 'btn-label'}>
            Verify Code
          </span>
          {verifying && <span className="btn-spinner" aria-label="Loading" />}
        </button>

        <p className="flow-expiry-line">
          Code expires in <strong>{formatTime(secondsLeft)}</strong>
        </p>

        <p className="flow-resend-line">
          Didn't receive it?{' '}
          <button type="button" className="flow-resend-link" onClick={handleResend}>
            Resend
          </button>
        </p>
      </div>
    </FlowShell>
  )
}

export default OtpStep
