// api.config.ts
import axios from 'axios'

export const ApiConfig = axios.create({
  baseURL: 'http://localhost:3000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

export function getUserId(): string {
  return localStorage.getItem('userId') || 'user123'
}
