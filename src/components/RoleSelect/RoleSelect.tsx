import { useState, useRef, useEffect } from 'react'
import { HiChevronDown, HiOutlineIdentification, HiOutlineMegaphone, HiCheck } from 'react-icons/hi2'
import type { UserRole } from '../../types/api'
import './RoleSelect.css'

interface RoleSelectProps {
  value: UserRole
  onChange: (role: UserRole) => void
  disabled?: boolean
  id?: string
}

const options: { value: UserRole; label: string; description: string; icon: JSX.Element }[] = [
  {
    value: 'worker',
    label: 'Tasker',
    description: 'Find tasks and earn rewards',
    icon: <HiOutlineIdentification />,
  },
  {
    value: 'advertiser',
    label: 'Advertiser',
    description: 'Post tasks and get things done',
    icon: <HiOutlineMegaphone />,
  },
]

function RoleSelect({ value, onChange, disabled, id }: RoleSelectProps) {
  const [open, setOpen] = useState(false)
  const wrapRef = useRef<HTMLDivElement>(null)
  const selected = options.find((o) => o.value === value) ?? options[0]

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className="role-select" ref={wrapRef}>
      <button
        id={id}
        type="button"
        className={`role-select-trigger ${open ? 'role-select-trigger-open' : ''}`}
        onClick={() => !disabled && setOpen((o) => !o)}
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className="role-select-icon">{selected.icon}</span>
        <span className="role-select-text">
          <span className="role-select-label">{selected.label}</span>
          <span className="role-select-description">{selected.description}</span>
        </span>
        <HiChevronDown className="role-select-chevron" />
      </button>

      <div className={`role-select-panel ${open ? 'role-select-panel-open' : ''}`} role="listbox">
        {options.map((option) => (
          <button
            key={option.value}
            type="button"
            role="option"
            aria-selected={option.value === value}
            className={`role-select-option ${option.value === value ? 'role-select-option-active' : ''}`}
            onClick={() => {
              onChange(option.value)
              setOpen(false)
            }}
          >
            <span className="role-select-option-icon">{option.icon}</span>
            <span className="role-select-text">
              <span className="role-select-label">{option.label}</span>
              <span className="role-select-description">{option.description}</span>
            </span>
            {option.value === value && <HiCheck className="role-select-check" />}
          </button>
        ))}
      </div>
    </div>
  )
}

export default RoleSelect
