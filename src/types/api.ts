export type UserRole = 'worker' | 'advertiser'

export interface WaitlistPayload {
  firstName: string
  lastName: string
  username: string
  email: string
  phoneNumber: string
  password: string
  role: UserRole
  referredByCode?: string
}

export interface WaitlistUser {
  id: string
  first_name: string
  last_name: string
  username: string
  email: string
  phone_number: string
  role: UserRole
  referral_code: string
  is_first_access: boolean
  first_access_code: string
  created_at: string
}

export interface WaitlistResponse {
  user: WaitlistUser
}

export interface ApiError {
  error: string
  minimumNaira?: number
  requiredNaira?: number
  currentBalanceNaira?: number
}
