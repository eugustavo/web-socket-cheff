import axios from 'axios'
import { useRouter } from 'next/router'

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
})

api.interceptors.request.use(config => {
  const token = localStorage.getItem('token')

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

api.interceptors.response.use(
  response => response,
  error => {
    if (error.response && error.response.status === 401) {
      const router = useRouter()
      router.push('/login')
    }
    return Promise.reject(error)
  }
)
