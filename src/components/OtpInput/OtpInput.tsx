import { useRef, KeyboardEvent, ClipboardEvent, ChangeEvent } from 'react'
import './OtpInput.css'

interface OtpInputProps {
  length?: number
  value: string[]
  onChange: (value: string[]) => void
  disabled?: boolean
  error?: boolean
}

function OtpInput({ length = 6, value, onChange, disabled, error }: OtpInputProps) {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  const handleChange = (index: number, e: ChangeEvent<HTMLInputElement>) => {
    const digit = e.target.value.replace(/\D/g, '').slice(-1)
    const next = [...value]
    next[index] = digit
    onChange(next)

    if (digit && index < length - 1) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !value[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault()
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, length)
    if (!pasted) return
    const next = Array(length).fill('')
    pasted.split('').forEach((char, i) => {
      next[i] = char
    })
    onChange(next)
    const lastFilled = Math.min(pasted.length, length) - 1
    inputRefs.current[lastFilled]?.focus()
  }

  return (
    <div className={`otp-input-row ${error ? 'otp-input-row-error' : ''}`}>
      {Array.from({ length }).map((_, index) => (
        <input
          key={index}
          ref={(el) => (inputRefs.current[index] = el)}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={value[index] || ''}
          onChange={(e) => handleChange(index, e)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          onPaste={handlePaste}
          disabled={disabled}
          className="otp-box"
          autoFocus={index === 0}
        />
      ))}
    </div>
  )
}

export default OtpInput
