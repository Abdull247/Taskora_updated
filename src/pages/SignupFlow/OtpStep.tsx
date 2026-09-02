import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import FlowShell from '../../components/FlowShell/FlowShell'
import OtpInput from '../../components/OtpInput/OtpInput'
import { useSignupFlow, generateUsernameBase, generateUsernameFallback } from '../../context/SignupFlowContext'
import { verifyEmailCode, resendVerificationCode } from '../../lib/emailVerification'
import { joinWaitlist } from '../../lib/waitlist'
import { ApiRequestError } from '../../lib/api'
import { withMinDelay } from '../../lib/useMinDelay'
import type { BusinessDetailsPayload } from '../../types/api'
import './SignupFlow.css'

const EXPIRY_SECONDS = 5 * 60

function formatTime(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
}

function OtpStep() {
  const navigate = useNavigate()
  const { data, updateData } = useSignupFlow()
  const [otp, setOtp] = useState<string[]>(Array(6).fill(''))
  const [error, setError] = useState('')
  const [verifying, setVerifying] = useState(false)
  const [resending, setResending] = useState(false)
  const [secondsLeft, setSecondsLeft] = useState(EXPIRY_SECONDS)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    // No verification session yet (e.g. direct navigation) — send them back to start over.
    if (!data.verificationTaskId) {
      navigate('/signup', { replace: true })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setSecondsLeft((s) => (s > 0 ? s - 1 : 0))
    }, 1000)
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [])

  const createAccount = async () => {
    const role = data.role ?? 'worker'
    const usernameBase = generateUsernameBase(data.firstName, data.lastName)
    const businessDetails: BusinessDetailsPayload | undefined =
      role === 'advertiser'
        ? {
            businessName: data.businessName.trim(),
            businessIndustry: data.industry.trim(),
            businessWebsite: data.website.trim() || undefined,
          }
        : undefined

    const submitWithUsername = (username: string) =>
      withMinDelay(() =>
        joinWaitlist({
          firstName: data.firstName.trim(),
          lastName: data.lastName.trim(),
          username,
          email: data.email.trim(),
          phoneNumber: data.phoneNumber.trim(),
          password: data.password,
          role,
          businessDetails,
          referredByCode: data.referredByCode.trim() || undefined,
        })
      )

    try {
      const { user } = await submitWithUsername(usernameBase)
      updateData({ username: usernameBase })
      toast.success(`Welcome, ${user.first_name}!`)
      navigate('/signup/done')
    } catch (err) {
      if (err instanceof ApiRequestError && err.status === 409) {
        const fallbackUsername = generateUsernameFallback(usernameBase)
        try {
          const { user } = await submitWithUsername(fallbackUsername)
          updateData({ username: fallbackUsername })
          toast.success(`Welcome, ${user.first_name}!`)
          navigate('/signup/done')
        } catch (retryErr) {
          if (retryErr instanceof ApiRequestError) {
            toast.error(
              retryErr.status === 409
                ? 'That email or phone number is already registered.'
                : retryErr.message
            )
          } else {
            toast.error('Could not reach the server. Check your connection and try again.')
          }
        }
      } else if (err instanceof ApiRequestError) {
        toast.error(err.message || 'Something went wrong on our end. Please try again shortly.')
      } else {
        toast.error('Could not reach the server. Check your connection and try again.')
      }
    }
  }

  const handleVerify = async () => {
    const code = otp.join('')
    if (code.length < 6) {
      setError('Enter the full 6-digit code')
      return
    }
    setError('')
    setVerifying(true)

    try {
      await withMinDelay(() => verifyEmailCode({ code, taskId: data.verificationTaskId }))
      updateData({ emailVerified: true })
      await createAccount()
      setVerifying(false)
    } catch (err) {
      setVerifying(false)
      if (err instanceof ApiRequestError) {
        if (err.status === 401) {
          setError('Incorrect code. Please try again.')
        } else if (err.status === 410) {
          setError('This code has expired. Request a new one.')
        } else if (err.status === 409) {
          // Already verified — safe to just continue creating the account.
          updateData({ emailVerified: true })
          setVerifying(true)
          await createAccount()
          setVerifying(false)
          return
        } else if (err.status === 404) {
          setError('Verification session not found. Request a new code.')
        } else {
          setError(err.message || 'Could not verify the code. Please try again.')
        }
      } else {
        toast.error('Could not reach the server. Check your connection and try again.')
      }
    }
  }

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
      setSecondsLeft(EXPIRY_SECONDS)
      setOtp(Array(6).fill(''))
      setError('')
      toast.success('A new code has been sent.')
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
          <button type="button" className="flow-resend-link" onClick={handleResend} disabled={resending}>
            {resending ? 'Resending…' : 'Resend'}
          </button>
        </p>
      </div>
    </FlowShell>
  )
}

export default OtpStep
