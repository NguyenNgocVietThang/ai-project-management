import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios'
import { authStore } from '@/store/authStore'
import type { TokenResponse } from '@/types/auth.types'

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000/api/v1'

/** Main API client used by every service. Carries the access token automatically. */
export const api = axios.create({
  baseURL: API_BASE_URL,
})

/** Bare client for the refresh call itself — must never go through the interceptors below. */
const refreshClient = axios.create({ baseURL: API_BASE_URL })

api.interceptors.request.use((config) => {
  const token = authStore.getState().accessToken
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

type RetriableConfig = InternalAxiosRequestConfig & { _retry?: boolean }

// Multiple requests can 401 at once (e.g. a page firing several queries after the access
// token expires). Only the first triggers a refresh; the rest wait on this shared promise.
let refreshPromise: Promise<string> | null = null

async function refreshAccessToken(): Promise<string> {
  const refreshToken = authStore.getState().refreshToken
  if (!refreshToken) throw new Error('No refresh token available')

  const { data } = await refreshClient.post<TokenResponse>('/auth/refresh', {
    refresh_token: refreshToken,
  })
  authStore.getState().setTokens(data)
  return data.access_token
}

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as RetriableConfig | undefined
    const isAuthEndpoint = originalRequest?.url?.includes('/auth/login') || originalRequest?.url?.includes('/auth/refresh')

    if (error.response?.status === 401 && originalRequest && !originalRequest._retry && !isAuthEndpoint) {
      originalRequest._retry = true
      try {
        refreshPromise ??= refreshAccessToken().finally(() => {
          refreshPromise = null
        })
        const newAccessToken = await refreshPromise
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`
        }
        return api(originalRequest)
      } catch (refreshError) {
        authStore.getState().clear()
        if (typeof window !== 'undefined') {
          window.location.href = '/login'
        }
        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error)
  }
)
