/** True unless VITE_USE_MOCK is explicitly `"false"`. */
export function isMockMode(): boolean {
  return import.meta.env.VITE_USE_MOCK !== 'false'
}

export function apiBaseUrl(): string {
  return (import.meta.env.VITE_API_BASE_URL as string | undefined)?.replace(/\/$/, '') ?? ''
}
