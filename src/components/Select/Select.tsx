import { useEffect, useRef, useState } from 'react'
import { HiChevronDown, HiCheck } from 'react-icons/hi2'
import './Select.css'

export interface SelectOption<T extends string | number> {
  value: T
  label: string
}

interface SelectProps<T extends string | number> {
  value: T
  options: SelectOption<T>[]
  onChange: (value: T) => void
  disabled?: boolean
  className?: string
  ariaLabel?: string
}

function Select<T extends string | number>({
  value,
  options,
  onChange,
  disabled,
  className = '',
  ariaLabel,
}: SelectProps<T>) {
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
    <div className={`select ${className}`} ref={wrapRef}>
      <button
        type="button"
        className={`select-trigger ${open ? 'select-trigger-open' : ''}`}
        onClick={() => !disabled && setOpen((o) => !o)}
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={ariaLabel}
      >
        <span className="select-value">{selected?.label ?? ''}</span>
        <HiChevronDown className="select-chevron" />
      </button>

      <div className={`select-panel ${open ? 'select-panel-open' : ''}`} role="listbox">
        {options.map((option) => (
          <button
            key={option.value}
            type="button"
            role="option"
            aria-selected={option.value === value}
            className={`select-option ${option.value === value ? 'select-option-active' : ''}`}
            onClick={() => {
              onChange(option.value)
              setOpen(false)
            }}
          >
            <span className="select-option-label">{option.label}</span>
            {option.value === value && <HiCheck className="select-check" />}
          </button>
        ))}
      </div>
    </div>
  )
}

export default Select
