import { ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { HiArrowLeft } from 'react-icons/hi2'
import './FlowShell.css'

interface FlowShellProps {
  children: ReactNode
  onBack?: () => void
  hideBack?: boolean
}

function FlowShell({ children, onBack, hideBack }: FlowShellProps) {
  const navigate = useNavigate()

  const handleBack = () => {
    if (onBack) {
      onBack()
    } else {
      navigate(-1)
    }
  }

  return (
    <div className="flow-shell">
      {!hideBack && (
        <button className="flow-back" onClick={handleBack}>
          <HiArrowLeft />
          <span>Back</span>
        </button>
      )}
      <div className="flow-shell-content">{children}</div>
    </div>
  )
}

export default FlowShell
