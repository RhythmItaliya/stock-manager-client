import {
  IconCash,
  IconShield,
  IconUsersGroup,
  IconUserShield,
} from '@tabler/icons-react'
import { UserStatus } from './schema'

export const callTypes = new Map<UserStatus, string>([
  ['active', 'bg-teal-100/30 text-teal-900 dark:text-teal-200 border-teal-200'],
  ['inactive', 'bg-neutral-300/40 border-neutral-300'],
  [
    'suspended',
    'bg-destructive/10 dark:bg-destructive/50 text-destructive dark:text-primary border-destructive/10',
  ],
])

export const userTypes = [
  {
    label: 'Super-admin',
    value: 'super-admin',
    icon: IconShield,
  },
  {
    label: 'Sub-admin',
    value: 'sub-admin',
    icon: IconUserShield,
  },
  {
    label: 'Manager',
    value: 'manager',
    icon: IconUsersGroup,
  },
  {
    label: 'User',
    value: 'user',
    icon: IconCash,
  },
] as const
