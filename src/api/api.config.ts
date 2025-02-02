// api.config.ts
import axios from 'axios'
import Cookies from 'js-cookie'
import { useAuthStore } from '@/stores/authStore'

export const ApiConfig = axios.create({
  baseURL: 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

export function getUserId(): string | null {
  try {
    const user = useAuthStore.getState().auth.user
    return user?.id || null
  } catch (error) {
    console.error('Error retrieving user ID:', error)
    return null
  }
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
