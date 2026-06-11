import { getIdToken } from './firebase'
import { apiBaseUrl } from './config'

export class HttpError extends Error {
  status: number

  constructor(message: string, status: number) {
    super(message)
    this.name = 'HttpError'
    this.status = status
  }
}

function parseErrorMessage(body: unknown, fallback: string): string {
  if (!body || typeof body !== 'object') return fallback
  const msg = (body as { message?: string | string[] }).message
  if (Array.isArray(msg)) return msg.join(', ')
  if (typeof msg === 'string') return msg
  return fallback
}

export async function request<T>(
  path: string,
  options: RequestInit & { auth?: boolean } = {},
): Promise<T> {
  const { auth: requireAuth = false, ...init } = options
  const headers = new Headers(init.headers)

  if (init.body && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json')
  }

  const token = await getIdToken()
  if (token) {
    headers.set('Authorization', `Bearer ${token}`)
  } else if (requireAuth) {
    throw new HttpError('Not signed in.', 401)
  }

  const base = apiBaseUrl()
  const url = `${base}/api${path}`
  const res = await fetch(url, { ...init, headers })

  if (!res.ok) {
    const body = await res.json().catch(() => null)
    throw new HttpError(parseErrorMessage(body, res.statusText), res.status)
  }

  if (res.status === 204) return undefined as T
  return res.json() as Promise<T>
}
