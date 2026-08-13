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

async function rawRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
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

export async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  return rawRequest<T>(path, options)
}

// ---------------------------------------------------------------------------
// Authenticated requests (user JWT) with silent refresh-on-401.
//
// Per the backend docs: user access tokens expire in 15 minutes. On a 401
// from a normal app route, call /auth/refresh with the stored refreshToken,
// store the new accessToken, and retry the original request once. This does
// NOT apply to /admin/* or /service/*//emailverification/* routes.
// ---------------------------------------------------------------------------

let refreshInFlight: Promise<string> | null = null

function getStoredTokens() {
  return {
    accessToken: localStorage.getItem('accessToken'),
    refreshToken: localStorage.getItem('refreshToken'),
  }
}

async function refreshAccessToken(): Promise<string> {
  // Dedupe concurrent 401s into a single refresh call.
  if (refreshInFlight) return refreshInFlight

  refreshInFlight = (async () => {
    const { refreshToken } = getStoredTokens()
    if (!refreshToken) {
      throw new ApiRequestError(401, 'No refresh token available')
    }

    try {
      const { accessToken } = await rawRequest<{ accessToken: string }>('/auth/refresh', {
        method: 'POST',
        body: { refreshToken },
      })
      localStorage.setItem('accessToken', accessToken)
      return accessToken
    } catch (err) {
      // Refresh token itself is invalid/expired/revoked — clear session.
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
      throw err
    } finally {
      refreshInFlight = null
    }
  })()

  return refreshInFlight
}

/**
 * Like apiRequest, but attaches the stored user access token and
 * transparently retries once after a silent refresh if the server
 * responds 401 (expired/invalid access token).
 *
 * Throws ApiRequestError(401) if there's no session or the refresh
 * itself fails — callers should treat that as "logged out".
 */
export async function authFetch<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { accessToken } = getStoredTokens()
  if (!accessToken) {
    throw new ApiRequestError(401, 'Not authenticated')
  }

  const { headers, ...rest } = options

  try {
    return await rawRequest<T>(path, {
      ...rest,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        ...headers,
      },
    })
  } catch (err) {
    const isExpiredToken =
      err instanceof ApiRequestError &&
      err.status === 401 &&
      /invalid or expired access token/i.test(err.message)

    if (!isExpiredToken) throw err

    const newAccessToken = await refreshAccessToken()

    return rawRequest<T>(path, {
      ...rest,
      headers: {
        Authorization: `Bearer ${newAccessToken}`,
        ...headers,
      },
    })
  }
}
