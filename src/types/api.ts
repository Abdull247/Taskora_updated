export type UserRole = 'worker' | 'advertiser'

export interface BusinessDetailsPayload {
  businessName?: string
  businessIndustry?: string
  businessWebsite?: string
}

export interface WaitlistPayload {
  firstName: string
  lastName: string
  username: string
  email: string
  phoneNumber: string
  password: string
  role: UserRole
  referredByCode?: string
  businessDetails?: BusinessDetailsPayload
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

// ---- Email verification (service-to-service, separate from user auth) ----

export interface SendVerificationPayload {
  email: string
}

export interface SendVerificationResponse {
  status: 'sent'
  email: string
  taskId: string
  expiresAt: string
}

export interface VerifyCodePayload {
  code: string
  taskId: string
}

export interface VerifyCodeResponse {
  status: 'verified'
  email: string
}

export interface ResendVerificationPayload {
  taskId?: string
  email?: string
}

export interface ResendVerificationResponse {
  status: 'resent'
  email: string
  taskId: string
  resendCount: number
  expiresAt: string
}


export interface LoginPayload {
  email: string
  password: string
}

export interface LoginUser {
  id: string
  firstName: string
  lastName: string
  username: string
  email: string
  role: UserRole
}

export interface LoginResponse {
  accessToken: string
  refreshToken: string
  user: LoginUser
}
