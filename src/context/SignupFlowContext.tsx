import { createContext, useContext, useState, ReactNode } from 'react'
import type { UserRole } from '../types/api'

export interface SignupFlowData {
  fullName: string
  email: string
  phoneNumber: string
  agreedToTerms: boolean
  password: string
  role: UserRole | null
  businessName: string
  industry: string
  website: string
}

interface SignupFlowContextValue {
  data: SignupFlowData
  updateData: (patch: Partial<SignupFlowData>) => void
  reset: () => void
}

const initialData: SignupFlowData = {
  fullName: '',
  email: '',
  phoneNumber: '',
  agreedToTerms: false,
  password: '',
  role: null,
  businessName: '',
  industry: '',
  website: '',
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
