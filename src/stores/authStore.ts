import Cookies from 'js-cookie'
import { jwtDecode } from 'jwt-decode'
import { create } from 'zustand'
import { AuthUser } from './types'

const ACCESS_TOKEN = 'accessToken'

interface AuthState {
  auth: {
    user: AuthUser | null
    setUser: (user: AuthUser | null) => void
    accessToken: string
    setAccessToken: (accessToken: string) => void
    resetAccessToken: () => void
    reset: () => void
  }
}

export const useAuthStore = create<AuthState>()((set) => {
  const cookieState = Cookies.get(ACCESS_TOKEN)
  const initToken = cookieState || ''
  const initUser = initToken ? jwtDecode<AuthUser>(initToken) : null

  return {
    auth: {
      user: initUser,
      setUser: (user: AuthUser | null) =>
        set((state) => ({
          ...state,
          auth: { ...state.auth, user },
        })),
      accessToken: initToken,
      setAccessToken: (accessToken: string) =>
        set((state) => {
          Cookies.set(ACCESS_TOKEN, accessToken, { expires: 1 })
          const decodedUser = jwtDecode<AuthUser>(accessToken)
          return {
            ...state,
            auth: { ...state.auth, accessToken, user: decodedUser },
          }
        }),
      resetAccessToken: () =>
        set((state) => {
          Cookies.remove(ACCESS_TOKEN)
          return {
            ...state,
            auth: { ...state.auth, accessToken: '' },
          }
        }),
      reset: () =>
        set((state) => {
          Cookies.remove(ACCESS_TOKEN)
          return {
            ...state,
            auth: { ...state.auth, user: null, accessToken: '' },
          }
        }),
    },
  }
})
