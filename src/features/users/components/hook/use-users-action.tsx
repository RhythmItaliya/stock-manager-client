// changed file

import { useState, useEffect, useRef } from 'react'
import { createUser, deleteUser, updateUser } from '@/api/api.user'
import { getUsers } from '@/api/api.user'
import { useApi } from '@/hooks/use-api'
import { toast } from '@/hooks/use-toast'
import { useUsers } from '../../context/users-context'

export function getUsersAction() {
  const [usersData, setUsersData] = useState<any[]>([])
  const hasFetchedRef = useRef(false)
  const { isLoading, mutate } = useApi({
    apiCall: getUsers,
    method: 'GET',
    onSuccess: (data) => {
      if (data.status === 'success') {
        setUsersData(data.data)
      }
    },
    onError: (error) => {
      console.error('Error fetching users:', error)
    },
  })

  useEffect(() => {
    if (!hasFetchedRef.current) {
      mutate(undefined)
      hasFetchedRef.current = true
    }
  }, [mutate])

  return { usersData, isLoading, mutate }
}

export function createUserAction(
  form: any,
  onOpenChange: (open: boolean) => void
) {
  const { setUsersData } = useUsers()
  const { mutate, isLoading } = useApi({
    apiCall: createUser,
    onSuccess: (data) => {
      toast({
        title: 'User Created Successfully',
        description: (
          <pre className='mt-2 w-[340px] rounded-md bg-slate-950 p-4'>
            <code className='text-white'>{JSON.stringify(data, null, 2)}</code>
          </pre>
        ),
      })
      form.reset()
      setUsersData((prevUsersData) => [...prevUsersData, data.data])
      onOpenChange(false)
    },
    onError: (error: any) => {
      console.error('Error creating user:', error)
      toast({
        title: 'Error',
        description: `Error creating the user: ${error.message}`,
        variant: 'destructive',
      })
    },
    method: 'POST',
  })

  return { mutate, isLoading }
}

export function updateUserAction(
  userId: string,
  updatedUserData: any,
  onOpenChange: (open: boolean) => void
) {
  const { setUsersData } = useUsers()
  const { mutate, isLoading } = useApi({
    apiCall: () => updateUser(userId, updatedUserData),
    onSuccess: (data) => {
      toast({
        title: 'User Updated Successfully',
        description: (
          <pre className='mt-2 w-[340px] rounded-md bg-slate-950 p-4'>
            <code className='text-white'>{JSON.stringify(data, null, 2)}</code>
          </pre>
        ),
      })
      setUsersData((prevUsersData) =>
        prevUsersData.map((user) =>
          user._id === userId ? { ...user, ...data.data } : user
        )
      )
      onOpenChange(false)
    },
    onError: (error: any) => {
      console.error('Error updating user:', error)
      toast({
        title: 'Error',
        description: `Error updating the user: ${error.message}`,
        variant: 'destructive',
      })
    },
    method: 'PATCH',
  })

  return { mutate, loading: isLoading }
}

export function deleteUserAction(
  userId: string,
  onOpenChange: (open: boolean) => void
) {
  const { setUsersData } = useUsers()
  const { mutate, isLoading } = useApi({
    apiCall: () => deleteUser(userId),
    onSuccess: (data) => {
      toast({
        title: 'User Deleted Successfully',
        description: (
          <pre className='mt-2 w-[340px] rounded-md bg-slate-950 p-4'>
            <code className='text-white'>{JSON.stringify(data, null, 2)}</code>
          </pre>
        ),
      })
      setUsersData((prevUsersData) =>
        prevUsersData.filter((user) => user._id !== userId)
      )
      onOpenChange(false)
    },
    onError: (error: any) => {
      console.error('Error deleting user:', error)
      toast({
        title: 'Error',
        description: `Error deleting the user: ${error.message}`,
        variant: 'destructive',
      })
    },
    method: 'DELETE',
  })

  return { mutate, loading: isLoading }
}
