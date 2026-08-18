import { authFetch } from './api'
import type { UploadFileResponse } from '../types/api'

/**
 * Uploads a single file to the backend's R2-backed file store via
 * multipart/form-data. Returns the public URL to use as a screenshot
 * proof value (or anywhere else a stored file URL is needed).
 */
export async function uploadFile(file: File) {
  const formData = new FormData()
  formData.append('file', file)

  return authFetch<UploadFileResponse>('/file/upload', {
    method: 'POST',
    body: formData,
  })
}
