export type Role = 'super-admin' | 'sub-admin' | 'manager' | 'user'

export interface AuthUser {
  id: string
  email: string
  role: Role
  username: string
  exp: number
}
