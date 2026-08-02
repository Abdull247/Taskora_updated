const isDev = import.meta.env.DEV

// In dev, hit the backend directly (needs CORS_ORIGINS to include localhost).
// In production on Vercel, use the same-origin /api proxy defined in vercel.json,
// which forwards to the Render backend server-side (no CORS needed).
const API_BASE_URL = isDev
  ? (import.meta.env.VITE_API_BASE_URL as string)
  : '/api'

if (isDev && !API_BASE_URL) {
  console.warn(
    'VITE_API_BASE_URL is not set. Add it to your .env file, e.g. VITE_API_BASE_URL=http://127.0.0.1:3000'
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
