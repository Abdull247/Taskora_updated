interface CacheEntry<T> {
  value: T
  expiresAt: number | null
}

const store = new Map<string, CacheEntry<unknown>>()
const inFlight = new Map<string, Promise<unknown>>()

const hasExpired = (entry: CacheEntry<unknown>) =>
  entry.expiresAt !== null && entry.expiresAt <= Date.now()

export function cacheGet<T>(key: string): T | undefined {
  const entry = store.get(key)
  if (!entry) return undefined
  if (hasExpired(entry)) {
    store.delete(key)
    return undefined
  }
  return entry.value as T
}

export function cacheSet<T>(key: string, value: T, ttlMs: number | null = null): void {
  store.set(key, {
    value,
    expiresAt: ttlMs === null ? null : Date.now() + ttlMs,
  })
}

export function cacheDelete(key: string): void {
  store.delete(key)
}

export function cacheDeletePrefix(prefix: string): void {
  for (const key of Array.from(store.keys())) {
    if (key.startsWith(prefix)) store.delete(key)
  }
}

export function cacheClear(): void {
  store.clear()
}

/**
 * Resolves from the in-memory cache when present (no network request),
 * otherwise runs the fetcher and stores the result for the rest of the
 * session. The cache lives in module memory only, so a full page reload
 * naturally starts with an empty cache and fetches fresh data.
 */
export async function cachedGet<T>(
  key: string,
  fetcher: () => Promise<T>,
  ttlMs: number | null = null
): Promise<T> {
  const cached = cacheGet<T>(key)
  if (cached !== undefined) return cached

  const existing = inFlight.get(key) as Promise<T> | undefined
  if (existing) return existing

  const request = fetcher()
    .then((value) => {
      cacheSet(key, value, ttlMs)
      return value
    })
    .finally(() => {
      inFlight.delete(key)
    })

  inFlight.set(key, request)
  return request
}
