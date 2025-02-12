// changed file
'use client'

import { useEffect, useState } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { getManagersList } from '@/api/api.user'
import { useAuthStore } from '@/stores/authStore'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import LoadingSpinner from '@/components/ui/loadingSpinner'
import { ScrollArea } from '@/components/ui/scroll-area'
import { PasswordInput } from '@/components/password-input'
import { SelectDropdown } from '@/components/select-dropdown'
import { User } from '../data/schema'
import { useAvailableRoles } from '../utility/useAvailableRoles'
import { createUserAction, updateUserAction } from './hook/use-users-action'

const formSchema = z
  .object({
    username: z.string().min(1, { message: 'Username is required.' }),
    email: z
      .string()
      .min(1, { message: 'Email is required.' })
      .email({ message: 'Email is invalid.' }),
    password: z.string().transform((pwd) => pwd.trim()),
    role: z.string().min(1, { message: 'Role is required.' }),
    confirmPassword: z.string().transform((pwd) => pwd.trim()),
    isEdit: z.boolean(),
    managerId: z.string().optional(),
  })
  .superRefine(({ isEdit, password, confirmPassword }, ctx) => {
    if (!isEdit || (isEdit && password !== '')) {
      if (password === '') {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Password is required.',
          path: ['password'],
        })
      }

      if (password.length < 8) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Password must be at least 8 characters long.',
          path: ['password'],
        })
      }

      if (!password.match(/[a-z]/)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Password must contain at least one lowercase letter.',
          path: ['password'],
        })
      }

      if (!password.match(/\d/)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Password must contain at least one number.',
          path: ['password'],
        })
      }

      if (password !== confirmPassword) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Passwords don't match.",
          path: ['confirmPassword'],
        })
      }
    }
  })
type UserForm = z.infer<typeof formSchema>

interface Props {
  currentRow?: User
  open: boolean
  onOpenChange: (open: boolean) => void
}

interface Manager {
  _id: string
  username: string
}

export function UsersActionDialog({ currentRow, open, onOpenChange }: Props) {
  const isEdit = !!currentRow
  const form = useForm<UserForm>({
    resolver: zodResolver(formSchema),
    defaultValues: isEdit
      ? {
          ...currentRow,
          password: '',
          confirmPassword: '',
          isEdit,
          managerId: currentRow?.managerId || '',
        }
      : {
          username: '',
          email: '',
          role: '',
          password: '',
          confirmPassword: '',
          isEdit,
          managerId: '',
        },
  })

  const { user } = useAuthStore((state) => state.auth)

  const [selectedRole, setSelectedRole] = useState(form.getValues('role'))

  const [managersData, setManagersData] = useState<Manager[]>([])
  const [isManagersLoading, setIsManagersLoading] = useState(false)
  const [managersFetched, setManagersFetched] = useState(false)

  const { mutate: createMutate, isLoading: createUserLoading } =
    createUserAction(form, onOpenChange)
  const [updatedUser, setUpdatedUser] = useState<Partial<UserForm> | null>(null)
  const { mutate: updateMutate, loading: updateUserLoading } = updateUserAction(
    currentRow?._id || '',
    updatedUser,
    onOpenChange
  )

  const isLoading = updateUserLoading || createUserLoading

  const availableRoles = useAvailableRoles()
  const onSubmit = (values: UserForm) => {
    console.log('UserForm', values)

    const finalPayload: Partial<UserForm> = {
      username: values.username,
      email: values.email,
      role: values.role,
    }

    if (values.role === 'user') {
      finalPayload.managerId = values.managerId
    }

    if (values.password) {
      finalPayload.password = values.password
      finalPayload.confirmPassword = values.confirmPassword
    }
    if (isEdit) {
      setUpdatedUser(finalPayload)
      updateMutate(values)
    } else {
      createMutate(values)
    }
  }
  const isPasswordTouched = !!form.formState.dirtyFields.password

  const fetchManagers = async () => {
    setIsManagersLoading(true)
    try {
      const response = await getManagersList()
      if (response.status === 'success' && Array.isArray(response.data)) {
        setManagersData(response.data)
      } else {
        console.error('Invalid response structure or empty data')
      }
    } catch (error) {
      console.error('Failed to fetch managers:', error)
    } finally {
      setIsManagersLoading(false)
    }
  }

  const handleRoleChange = (value: string) => {
    setSelectedRole(value)
    form.setValue('managerId', '')
    if (
      value === 'user' &&
      (user?.role === 'super-admin' || user?.role === 'sub-admin')
    ) {
      if (!managersFetched) {
        fetchManagers()
        setManagersFetched(true)
      }
    }
  }

  useEffect(() => {
    if (
      selectedRole === 'user' &&
      (user?.role === 'super-admin' || user?.role === 'sub-admin') &&
      !managersFetched
    ) {
      fetchManagers()
    }
  }, [selectedRole, managersFetched, user?.role])

  return (
    <Dialog
      open={open}
      onOpenChange={(state) => {
        form.reset()
        onOpenChange(state)
      }}
    >
      <DialogContent className='sm:max-w-lg'>
        <DialogHeader className='text-left'>
          <DialogTitle>{isEdit ? 'Edit User' : 'Add New User'}</DialogTitle>
          <DialogDescription>
            {isEdit ? 'Update the user here. ' : 'Create new user here. '}
            Click save when you&apos;re done.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className='h-[26.25rem] w-full pr-4 -mr-4 py-1'>
          <Form {...form}>
            <form
              id='user-form'
              onSubmit={form.handleSubmit(onSubmit)}
              className='space-y-4 p-0.5'
            >
              <FormField
                control={form.control}
                name='username'
                render={({ field }) => (
                  <FormItem className='grid grid-cols-6 items-center gap-x-4 gap-y-1 space-y-0'>
                    <FormLabel className='col-span-2 text-right'>
                      Username
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder='john_doe'
                        className='col-span-4'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className='col-span-4 col-start-3' />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='email'
                render={({ field }) => (
                  <FormItem className='grid grid-cols-6 items-center gap-x-4 gap-y-1 space-y-0'>
                    <FormLabel className='col-span-2 text-right'>
                      Email
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder='john.doe@gmail.com'
                        className='col-span-4'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className='col-span-4 col-start-3' />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='role'
                render={({ field }) => (
                  <FormItem className='grid grid-cols-6 items-center gap-x-4 gap-y-1 space-y-0'>
                    <FormLabel className='col-span-2 text-right'>
                      Role
                    </FormLabel>
                    <SelectDropdown
                      defaultValue={field.value}
                      onValueChange={(value) => {
                        field.onChange(value)
                        handleRoleChange(value)
                      }}
                      placeholder='Select a role'
                      className='col-span-4'
                      items={availableRoles.map(({ label, value }) => ({
                        label,
                        value,
                      }))}
                    />
                    <FormMessage className='col-span-4 col-start-3' />
                  </FormItem>
                )}
              />

              {selectedRole === 'user' &&
                (user?.role === 'super-admin' ||
                  user?.role === 'sub-admin') && (
                  <FormField
                    control={form.control}
                    name='managerId'
                    render={({ field }) => (
                      <FormItem className='grid grid-cols-6 items-center gap-x-4 gap-y-1 space-y-0'>
                        <FormLabel className='col-span-2 text-right'>
                          Manager
                        </FormLabel>
                        <FormControl>
                          {isManagersLoading ? (
                            <LoadingSpinner size='small' />
                          ) : (
                            <SelectDropdown
                              defaultValue={field.value}
                              onValueChange={field.onChange}
                              placeholder='Select a Manager'
                              className='col-span-4'
                              items={managersData.map((manager) => ({
                                label: manager.username,
                                value: manager._id,
                              }))}
                            />
                          )}
                        </FormControl>
                        <FormMessage className='col-span-4 col-start-3' />
                      </FormItem>
                    )}
                  />
                )}

              <FormField
                control={form.control}
                name='password'
                render={({ field }) => (
                  <FormItem className='grid grid-cols-6 items-center gap-x-4 gap-y-1 space-y-0'>
                    <FormLabel className='col-span-2 text-right'>
                      Password
                    </FormLabel>
                    <FormControl>
                      <PasswordInput
                        placeholder='e.g., S3cur3P@ssw0rd'
                        className='col-span-4'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className='col-span-4 col-start-3' />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='confirmPassword'
                render={({ field }) => (
                  <FormItem className='grid grid-cols-6 items-center gap-x-4 gap-y-1 space-y-0'>
                    <FormLabel className='col-span-2 text-right'>
                      Confirm Password
                    </FormLabel>
                    <FormControl>
                      <PasswordInput
                        disabled={!isPasswordTouched}
                        placeholder='e.g., S3cur3P@ssw0rd'
                        className='col-span-4'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className='col-span-4 col-start-3' />
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </ScrollArea>
        <DialogFooter>
          <Button type='submit' form='user-form' disabled={isLoading}>
            {isLoading ? 'Saving...' : 'Save changes'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
