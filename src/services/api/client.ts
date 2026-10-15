import axios from 'axios'
import type { AxiosError } from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3000/api'

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
})

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ error?: string; message?: string }>) => {
    const message = error.response?.data?.error ?? error.response?.data?.message ?? error.message
    return Promise.reject(new Error(message))
  },
)
