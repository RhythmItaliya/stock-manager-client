import { useAuthStore } from '@/stores/authStore'
import { Role } from '@/stores/types'
import { userTypes } from '../data/data'

const rolePermissions: Record<Role, Role[]> = {
  'super-admin': ['sub-admin', 'manager', 'user'],
  'sub-admin': ['manager', 'user'],
  manager: ['user'],
  user: [],
}

export const useAvailableRoles = () => {
  const { user } = useAuthStore((state) => state.auth)
  const allowedRoles =
    user?.role === 'super-admin'
      ? userTypes.map((t) => t.value)
      : rolePermissions[(user?.role as Role) ?? 'user']

  const availableRoles = userTypes.filter((role) =>
    allowedRoles.includes(role.value as Role)
  )
  return availableRoles
}
