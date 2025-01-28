import { useState, useEffect, useRef } from 'react'
import { createUser } from '@/api/api.user'
import { getUsers } from '@/api/api.user'
import { useApi } from '@/hooks/use-api'
import { toast } from '@/hooks/use-toast'

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
