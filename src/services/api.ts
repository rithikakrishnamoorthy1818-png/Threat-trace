import axios, { AxiosHeaders } from 'axios'

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? 'https://threat-trace-gqk9.onrender.com',
  timeout: 20_000,
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('tt_token')
  if (token) {
    const headers = AxiosHeaders.from(config.headers)
    headers.set('Authorization', `Bearer ${token}`)
    config.headers = headers
  }
  return config
})

