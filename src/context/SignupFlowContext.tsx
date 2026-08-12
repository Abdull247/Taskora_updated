import { createContext, useContext, useState, ReactNode } from 'react'
import type { UserRole } from '../types/api'

export interface SignupFlowData {
  firstName: string
  lastName: string
  username: string
  email: string
  phoneNumber: string
  agreedToTerms: boolean
  password: string
  role: UserRole | null
  businessName: string
  industry: string
  website: string
  /** Session id returned by /emailverification/send, used by /verify and /resend */
  verificationTaskId: string
  /** Set once /emailverification/verify succeeds; not sent to the backend directly */
  emailVerified: boolean
}

interface SignupFlowContextValue {
  data: SignupFlowData
  updateData: (patch: Partial<SignupFlowData>) => void
  reset: () => void
}

const initialData: SignupFlowData = {
  firstName: '',
  lastName: '',
  username: '',
  email: '',
  phoneNumber: '',
  agreedToTerms: false,
  password: '',
  role: null,
  businessName: '',
  industry: '',
  website: '',
  verificationTaskId: '',
  emailVerified: false,
}

const SignupFlowContext = createContext<SignupFlowContextValue | undefined>(undefined)

export function SignupFlowProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<SignupFlowData>(initialData)

  const updateData = (patch: Partial<SignupFlowData>) => {
    setData((prev) => ({ ...prev, ...patch }))
  }

  const reset = () => setData(initialData)

  return (
    <SignupFlowContext.Provider value={{ data, updateData, reset }}>
      {children}
    </SignupFlowContext.Provider>
  )
}

export function useSignupFlow() {
  const ctx = useContext(SignupFlowContext)
  if (!ctx) {
    throw new Error('useSignupFlow must be used within a SignupFlowProvider')
  }
  return ctx
}

/**
 * Derives a username candidate from first/last name, e.g. "Ada Lovelace" -> "adalovelace".
 * Strips anything that isn't a-z/0-9 after lowercasing, so accents/punctuation/spaces are dropped.
 */
export function generateUsernameBase(firstName: string, lastName: string): string {
  const clean = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, '')
  const base = `${clean(firstName)}${clean(lastName)}`
  return base || 'user'
}

/** Appends a short random numeric suffix, used as a collision fallback on 409. */
export function generateUsernameFallback(base: string): string {
  const suffix = Math.floor(1000 + Math.random() * 9000) // 4 digits
  return `${base}${suffix}`
}

