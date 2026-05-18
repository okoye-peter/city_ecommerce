import axios, {
  AxiosError,
  AxiosInstance,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios'
import { storage } from './storage'
import type { ApiResponse, AuthTokens } from '@/types'

export const BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL

const api: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' },
})

// Injected at app startup — breaks the circular dependency between
// axios.ts and the Redux store without using require().
let _onSessionExpired: (() => Promise<void>) | null = null

export function setSessionExpiredHandler(handler: () => Promise<void>) {
  _onSessionExpired = handler
}

// ─── Request interceptor — attach access token ────────────────────────────────

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = storage.getAccessToken()
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error),
)

// ─── Response interceptor — 401 / token refresh ───────────────────────────────

let isRefreshing = false

type QueueEntry = {
  resolve: (response: AxiosResponse) => void
  reject: (error: unknown) => void
}
let failedQueue: QueueEntry[] = []

function processQueue(error: unknown, retryFn?: () => Promise<AxiosResponse>) {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error || !retryFn) {
      reject(error)
    } else {
      retryFn().then(resolve).catch(reject)
    }
  })
  failedQueue = []
}

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean
    }

    if (error.response?.status !== 401 || originalRequest._retry) {
      return Promise.reject(error)
    }

    if (isRefreshing) {
      return new Promise<AxiosResponse>((resolve, reject) => {
        failedQueue.push({ resolve, reject })
      })
    }

    originalRequest._retry = true
    isRefreshing = true

    try {
      const refreshToken = await storage.getRefreshToken()
      if (!refreshToken) throw new Error('No refresh token')

      const { data: response } = await axios.post<ApiResponse<AuthTokens>>(
        `${BASE_URL}/auth/refresh`,
        { refreshToken },
      )

      const { accessToken, refreshToken: newRefreshToken } = response.data

      storage.setAccessToken(accessToken)
      if (newRefreshToken) await storage.setRefreshToken(newRefreshToken)

      originalRequest.headers.Authorization = `Bearer ${accessToken}`

      const retry = () => api(originalRequest)
      processQueue(null, retry)
      return retry()
    } catch (refreshError) {
      processQueue(refreshError)
      await _onSessionExpired?.()
      return Promise.reject(refreshError)
    } finally {
      isRefreshing = false
    }
  },
)

export default api
