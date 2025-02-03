export type Role = 'super-admin' | 'sub-admin' | 'manager' | 'user'

export interface AuthUser {
  id: string
  email: string
  role: Role
  username: string
  exp: number
}

export const RolePermissions: Record<Role, Role[]> = {
  'super-admin': ['sub-admin', 'manager', 'user'],
  'sub-admin': ['manager', 'user'],
  'manager': ['user'],
  'user': [],
}
