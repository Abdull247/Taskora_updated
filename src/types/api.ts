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

// ---- /me ----

export interface MeWallet {
  id: string
  balanceKobo: string
  currency: string
}

export interface MeWorkerStats {
  pendingApprovals: number
  completedTasks: number
  completedThisWeek: number
  earningsThisMonthKobo: number
  earningsLastMonthKobo: number
  earningsDeltaKobo: number
}

export interface MeAdvertiserStats {
  pendingApprovals: number
  completedTasks: number
  completedThisWeek: number
  spentThisMonthKobo: number
  spentLastMonthKobo: number
  spentDeltaKobo: number
}

export type MeStats = MeWorkerStats | MeAdvertiserStats

export interface MeUser {
  id: string
  firstName: string
  lastName: string
  username: string
  email: string
  phoneNumber: string
  role: UserRole
  referralCode: string
  referredBy: string | null
  isVerified: boolean
  emailVerifiedAt: string | null
  isFirstAccess: boolean
  firstAccessCode: string | null
  firstAccessRewardGranted: boolean
  businessName: string | null
  businessIndustry: string | null
  businessWebsite: string | null
  createdAt: string
  updatedAt: string
  wallet: MeWallet
  referralCount: number
  stats: MeStats
}

export interface MeResponse {
  user: MeUser
}

// Narrowing helpers — the /me stats shape depends on role.
export function isWorkerStats(stats: MeStats): stats is MeWorkerStats {
  return 'earningsThisMonthKobo' in stats
}

export function isAdvertiserStats(stats: MeStats): stats is MeAdvertiserStats {
  return 'spentThisMonthKobo' in stats
}

// ---- /tasks/categories ----

export interface TaskSubcategoryItem {
  subcategory: string
  displayName: string
  baseRateKobo: number
  subcategoryId: string
}

export interface TaskCategoryItem {
  category: string
  description: string
  categoryId: string
  subcategories: TaskSubcategoryItem[]
}

export interface TaskCategoriesResponse {
  categories: TaskCategoryItem[]
}

// ---- /recommended (and /tasks — same row shape) ----

export interface TaskListItem {
  id: string
  title?: string
  job_link: string
  job_description: string
  proof_required: boolean
  proof_type: string | null
  quantity: number
  worker_earn_kobo: string
  completed_count: number
  spots_remaining: number
  expires_at: string
  created_at: string
  category_name: string
  subcategory_name: string
  advertiser_username: string
  status?: TaskStatus
}

export interface RecommendedTasksResponse {
  tasks: TaskListItem[]
}

export interface TasksResponse {
  tasks: TaskListItem[]
}

// ---- /tasks/:id ----

export type TaskStatus =
  | 'draft'
  | 'active'
  | 'paused'
  | 'completed'
  | 'cancelled'
  | 'expired'

export interface ProofConfigItem {
  maxCount: number
  minCount: number
  isAllowed: boolean
  isRequired: boolean
}

export interface ProofConfig {
  text: ProofConfigItem
  screenshot: ProofConfigItem
  link?: ProofConfigItem
  video?: ProofConfigItem
}

export interface RatingCriterion {
  id: string
  type: 'RATING'
  scale: number
  question: string
}

export interface TextCriterion {
  id: string
  type: 'TEXT'
  question: string
}

export type EvaluationCriterion = RatingCriterion | TextCriterion

export interface TaskData {
  scenario: string
  experienceType: string
  evaluationCriteria: EvaluationCriterion[]
}

export interface TaskDetail {
  id: string
  title: string
  job_link: string
  job_description: string
  instructions: string[]
  requirements: string[]
  proof_config: ProofConfig
  task_data: TaskData
  quantity: number
  worker_earn_kobo: string
  completed_count: number
  expires_at: string
  created_at: string
  spots_remaining: number
  category_name: string
  subcategory_name: string
  advertiser_username: string
  status: TaskStatus
}

export interface TaskDetailResponse {
  task: TaskDetail
}

// ---- POST /tasks/:id/submit ----

export type SubmissionStatus = 'pending' | 'approved' | 'rejected'

export interface SubmissionVideoItem {
  url: string
  durationSeconds: number
}

export type SubmissionProof = {
  text?: string[]
  screenshot?: string[]
  link?: string[]
  video?: SubmissionVideoItem[]
}

export interface Submission {
  id: string
  task_id: string
  worker_id: string
  proof: SubmissionProof
  status: SubmissionStatus
  submitted_at: string
}

export interface SubmitTaskProofResponse {
  submission: Submission
}

// ---- Advertiser task management / submissions ----

export interface ProofConfigPayloadItem {
  isAllowed: boolean
  isRequired: boolean
  minCount?: number
  maxCount?: number
}

export interface VideoProofConfigPayload extends ProofConfigPayloadItem {
  minDurationSeconds?: number
  maxDurationSeconds?: number
}

export interface CreateTaskPayload {
  subcategoryId: string
  title: string
  jobLink: string
  jobDescription: string
  instructions: string[]
  requirements?: string[]
  proofConfig?: {
    screenshot?: ProofConfigPayloadItem
    text?: ProofConfigPayloadItem
    link?: ProofConfigPayloadItem
    video?: VideoProofConfigPayload
  }
  taskData?: Record<string, unknown>
  quantity: number
  workerEarnKobo: number
  expiresAt: string
}

export interface CreateTaskResponse {
  task?: { id: string }
  id?: string
}

export interface MineTasksResponse {
  tasks: TaskListItem[]
}

export interface SubmissionWorker {
  id: string
  username?: string
  first_name?: string
  last_name?: string
}

export interface SubmissionTaskRef {
  id: string
  title?: string
  job_description?: string
  worker_earn_kobo?: string
}

export interface SubmissionListItem {
  id: string
  task_id: string
  worker_id: string
  proof: SubmissionProof
  status: SubmissionStatus
  rejection_reason: string | null
  submitted_at: string
  reviewed_at: string | null
  worker?: SubmissionWorker
  task?: SubmissionTaskRef
}

export interface SubmissionsResponse {
  submissions: SubmissionListItem[]
}

export interface ApproveSubmissionResponse {
  status: 'approved'
  submissionId: string
  workerPaidKobo: number
}

export interface RejectSubmissionResponse {
  status: 'rejected'
  submissionId: string
  reason: string
}

// ---- /wallet ----

export interface Wallet {
  id: string
  balance: string
  currency: string
  updated_at: string
}

export interface WalletResponse {
  wallet: Wallet
}

export type WalletTransactionType =
  | 'deposit'
  | 'withdrawal'
  | 'task_payment'
  | 'task_earning'
  | 'refund'
  | 'fee'

export interface WalletTransaction {
  id: string
  type: WalletTransactionType
  amount: string
  balance_after: string
  reference: string
  status: string
  metadata: Record<string, unknown> | null
  created_at: string
}

export interface WalletTransactionsResponse {
  transactions: WalletTransaction[]
}

