// api.config.ts
import axios from 'axios'
import Cookies from 'js-cookie'

export const ApiConfig = axios.create({
  baseURL: 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

export function getUserId(): string {
  return localStorage.getItem('accessToken') || 'user123'
}

export function getAuthToken(): string | null {
  const token =
    Cookies.get('accessToken') || localStorage.getItem('accessToken')
  if (!token) {
    console.error('No access token found')
    return null
  }
  return token
}
