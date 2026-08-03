const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api'

if (!API_BASE_URL) {
  console.warn(
    'VITE_API_BASE_URL is not set. Add it to your .env file, e.g. VITE_API_BASE_URL=https://your-backend.onrender.com'
  )
}

export class ApiRequestError extends Error {
  status: number
  payload: Record<string, unknown>

  constructor(status: number, message: string, payload: Record<string, unknown> = {}) {
    super(message)
    this.name = 'ApiRequestError'
    this.status = status
    this.payload = payload
  }
}

interface RequestOptions extends Omit<RequestInit, 'body'> {
  body?: Record<string, unknown>
}

export async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { body, headers, ...rest } = options

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...rest,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
    body: body ? JSON.stringify(body) : undefined,
  })

  let data: Record<string, unknown> = {}
  try {
    data = await response.json()
  } catch {
    // no JSON body (e.g. network error before response)
  }

  if (!response.ok) {
    const message =
      typeof data.error === 'string' ? data.error : `Request failed with status ${response.status}`
    throw new ApiRequestError(response.status, message, data)
  }

  return data as T
}
