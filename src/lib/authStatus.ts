export function isAuthenticated(): boolean {
  return Boolean(localStorage.getItem('accessToken'))
}
