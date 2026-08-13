import { authFetch, apiRequest } from './api'
import { cachedGet, cacheDelete, cacheDeletePrefix } from './cache'
import type {
  ApproveSubmissionResponse,
  CreateTaskPayload,
  CreateTaskResponse,
  MineTasksResponse,
  RecommendedTasksResponse,
  RejectSubmissionResponse,
  SubmissionProof,
  SubmissionsResponse,
  SubmitTaskProofResponse,
  TaskCategoriesResponse,
  TaskDetailResponse,
  TasksResponse,
} from '../types/api'

/**
 * Worker-only. Returns a randomly rotated batch of eligible tasks.
 * Callers should not invoke this for advertiser accounts (backend
 * returns 403 — there is no advertiser-facing equivalent yet).
 */
export function getRecommendedTasks(limit = 10) {
  return cachedGet(`recommended:${limit}`, () =>
    authFetch<RecommendedTasksResponse>(`/recommended?limit=${limit}`, {
      method: 'GET',
    })
  )
}

/**
 * No auth required. Returns all task categories, their subcategories,
 * and floor rates — used to populate the category chip row / picker.
 */
export function getTaskCategories() {
  return cachedGet('task-categories', () =>
    apiRequest<TaskCategoriesResponse>('/tasks/categories', {
      method: 'GET',
    })
  )
}

export interface GetTasksParams {
  limit?: number
  offset?: number
  categoryId?: string
  subcategoryId?: string
}

/**
 * The worker feed. Excludes tasks created by the logged-in user and
 * tasks they've already submitted to. Ordered newest-first.
 */
export function getTasks(params: GetTasksParams = {}) {
  const query = new URLSearchParams()
  if (params.limit !== undefined) query.set('limit', String(params.limit))
  if (params.offset !== undefined) query.set('offset', String(params.offset))
  if (params.categoryId) query.set('categoryId', params.categoryId)
  if (params.subcategoryId) query.set('subcategoryId', params.subcategoryId)

  const qs = query.toString()
  const key = `tasks:${params.categoryId ?? ''}:${params.subcategoryId ?? ''}:${params.limit ?? ''}:${params.offset ?? ''}`
  return cachedGet(key, () =>
    authFetch<TasksResponse>(`/tasks${qs ? `?${qs}` : ''}`, {
      method: 'GET',
    })
  )
}

/**
 * Worker-facing task detail. Requires auth — the backend returns the full
 * task payload (instructions, proof config, evaluation criteria, etc.).
 */
export function getTaskById(id: string) {
  return cachedGet(`task:${id}`, () =>
    authFetch<TaskDetailResponse>(`/tasks/${encodeURIComponent(id)}`, {
      method: 'GET',
    })
  )
}

/**
 * Worker-only. Submits task proof for review. Returns 201 on success and
 * 409 if the worker already has a pending/approved submission.
 */
export async function submitTaskProof(id: string, proof: SubmissionProof) {
  const res = await authFetch<SubmitTaskProofResponse>(
    `/tasks/${encodeURIComponent(id)}/submit`,
    {
      method: 'POST',
      body: { proof },
    }
  )
  cacheDelete(`task:${id}`)
  cacheDelete('submissions-mine')
  cacheDeletePrefix('tasks:')
  cacheDelete('me')
  return res
}

/**
 * Advertiser-only. Creates a new task and holds the budget from the wallet.
 */
export async function createTask(payload: CreateTaskPayload) {
  const res = await authFetch<CreateTaskResponse>('/tasks', {
    method: 'POST',
    body: payload,
  })
  cacheDelete('tasks-mine')
  cacheDeletePrefix('tasks:')
  cacheDelete('wallet')
  cacheDelete('me')
  return res
}

/**
 * Advertiser-only. All tasks created by the logged-in advertiser.
 */
export function getMyTasks() {
  return cachedGet('tasks-mine', () =>
    authFetch<MineTasksResponse>('/tasks/mine', { method: 'GET' })
  )
}

/**
 * Advertiser-only (must own the task). All submissions for a task.
 */
export function getTaskSubmissions(taskId: string) {
  return cachedGet(`task-submissions:${taskId}`, () =>
    authFetch<SubmissionsResponse>(
      `/tasks/${encodeURIComponent(taskId)}/submissions`,
      { method: 'GET' }
    )
  )
}

/**
 * Worker-only. The worker's submission history.
 */
export function getMySubmissions() {
  return cachedGet('submissions-mine', () =>
    authFetch<SubmissionsResponse>('/submissions/mine', { method: 'GET' })
  )
}

/**
 * Advertiser-only. Approves a submission and pays the worker.
 */
export async function approveSubmission(submissionId: string) {
  const res = await authFetch<ApproveSubmissionResponse>(
    `/submissions/${encodeURIComponent(submissionId)}/approve`,
    { method: 'POST' }
  )
  cacheDeletePrefix('task-submissions:')
  cacheDelete('wallet')
  cacheDelete('me')
  return res
}

/**
 * Advertiser-only. Rejects a submission with a reason the worker can read.
 */
export async function rejectSubmission(submissionId: string, reason: string) {
  const res = await authFetch<RejectSubmissionResponse>(
    `/submissions/${encodeURIComponent(submissionId)}/reject`,
    { method: 'POST', body: { reason } }
  )
  cacheDeletePrefix('task-submissions:')
  cacheDelete('me')
  return res
}
