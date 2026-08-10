import { ReactNode } from 'react'
import './FlowCenterShell.css'

interface FlowCenterShellProps {
  heading: string
  subheading: string
  children: ReactNode
}

function FlowCenterShell({ heading, subheading, children }: FlowCenterShellProps) {
  return (
    <div className="center-shell">
      <div className="center-shell-inner">
        <div className="center-shell-brand">
          <img src="/logo.png" alt="TaskBridge logo" className="center-shell-logo" />
          <span className="center-shell-brand-text">TaskBridge</span>
        </div>

        <h1 className="center-shell-heading">{heading}</h1>
        <p className="center-shell-subheading">{subheading}</p>

        <div className="center-shell-body">{children}</div>
      </div>
    </div>
  )
}

export default FlowCenterShell
