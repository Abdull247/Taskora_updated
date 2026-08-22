import { apiRequest, ApiRequestError } from './api'
import { AvailabilityResponse } from '../types/api'

export default async function checkEmailAvailability(value: string): Promise<AvailabilityResponse> {
  const trimmed = value.trim()

  if (!trimmed) {
    throw new Error(`No email provided`)
  }

  const params = new URLSearchParams({ email: trimmed })

  const result = await apiRequest<AvailabilityResponse>(`/checkEmail?${params.toString()}`, {
    method: 'GET',
  })
  return result
}