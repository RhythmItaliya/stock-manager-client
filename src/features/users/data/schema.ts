import { z } from 'zod'

const userStatusSchema = z.union([
  z.literal('active'),
  z.literal('inactive'),
  z.literal('suspended'),
])
export type UserStatus = z.infer<typeof userStatusSchema>

const userRoleSchema = z.union([
  z.literal('super-admin'),
  z.literal('sub-admin'),
  z.literal('manager'),
  z.literal('user'),
])

const userSchema = z.object({
  _id: z.string(),
  id: z.string(),
  username: z.string(),
  createdBy: z.string(),
  email: z.string(),
  managerId: z.string().optional(),
  status: userStatusSchema,
  role: userRoleSchema,
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})
export type User = z.infer<typeof userSchema>

export const userListSchema = z.array(userSchema)
