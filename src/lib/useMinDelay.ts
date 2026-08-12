/**
 * Wraps an async action so that whatever "loading" state you flip on stays
 * true for at least `minMs`, even if the action resolves (or rejects) faster.
 * Purely cosmetic — makes button spinners feel real instead of flickering.
 */
export async function withMinDelay<T>(action: () => Promise<T>, minMs = 700): Promise<T> {
  const start = Date.now()
  try {
    return await action()
  } finally {
    const elapsed = Date.now() - start
    if (elapsed < minMs) {
      await new Promise((resolve) => setTimeout(resolve, minMs - elapsed))
    }
  }
}
