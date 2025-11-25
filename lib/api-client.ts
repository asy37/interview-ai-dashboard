import axios, { AxiosHeaders, type AxiosError, type InternalAxiosRequestConfig } from 'axios'

const apiClient = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

const attachAuthToken = (config: InternalAxiosRequestConfig) => {
  if (typeof window === 'undefined') {
    return config
  }

  const token = localStorage.getItem('auth-token')
  if (token) {
    const headers = AxiosHeaders.from(config.headers ?? {})
    headers.set('Authorization', `Bearer ${token}`)
    config.headers = headers
  }

  return config
}

apiClient.interceptors.request.use(
  (config) => attachAuthToken(config),
  (error: AxiosError) => Promise.reject(error)
)

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (typeof window !== 'undefined' && error.response?.status === 401) {
      localStorage.removeItem('auth-token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export type ApiClient = typeof apiClient

export default apiClient
