import { authFetch, apiRequest } from './api'
import type {
  RecommendedTasksResponse,
  TaskCategoriesResponse,
  TaskDetailResponse,
  TasksResponse,
  SubmissionProof,
  SubmitTaskProofResponse,
} from '../types/api'

/**
 * Worker-only. Returns a randomly rotated batch of eligible tasks.
 * Callers should not invoke this for advertiser accounts (backend
 * returns 403 — there is no advertiser-facing equivalent yet).
 */
export function getRecommendedTasks(limit = 10) {
  return authFetch<RecommendedTasksResponse>(`/recommended?limit=${limit}`, {
    method: 'GET',
  })
}


/**
 * No auth required. Returns all task categories, their subcategories,
 * and floor rates — used to populate the category chip row / picker.
 */
export function getTaskCategories() {
  return apiRequest<TaskCategoriesResponse>('/tasks/categories', {
    method: 'GET',
  })
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
  return authFetch<TasksResponse>(`/tasks${qs ? `?${qs}` : ''}`, {
    method: 'GET',
  })
}

/**
 * Worker-facing task detail. Requires auth — the backend returns the full
 * task payload (instructions, proof config, evaluation criteria, etc.).
 */
export function getTaskById(id: string) {
  return authFetch<TaskDetailResponse>(`/tasks/${encodeURIComponent(id)}`, {
    method: 'GET',
  })
}

/**
 * Worker-only. Submits task proof for review. Returns 201 on success and
 * 409 if the worker already has a pending/approved submission.
 */
export function submitTaskProof(id: string, proof: SubmissionProof) {
  return authFetch<SubmitTaskProofResponse>(`/tasks/${encodeURIComponent(id)}/submit`, {
    method: 'POST',
    body: { proof },
  })
}
