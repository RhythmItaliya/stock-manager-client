// api.config.ts
import axios from 'axios'

export const ApiConfig = axios.create({
  baseURL: 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

export function getUserId(): string {
  return localStorage.getItem('userId') || 'user123'
}

export function getAuthToken(): string | null {
  const token = localStorage.getItem('accessToken')
  if (!token) {
    console.error('No access token found')
    return null
  }
  return token
}
