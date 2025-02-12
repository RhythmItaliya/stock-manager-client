// changed file
import { useState } from 'react'
import { useMutation, UseMutationOptions } from '@tanstack/react-query'
import { toast } from '@/hooks/use-toast'

interface UseApiProps<TData, TVariables> {
  apiCall: (variables: TVariables) => Promise<TData>
  onSuccess?: (data: TData) => void
  onError?: (error: unknown) => void
  onSubmit?: (variables: TVariables) => void
  options?: UseMutationOptions<TData, unknown, TVariables, unknown>
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
}

export function useApi<TData, TVariables>({
  apiCall,
  onSuccess,
  onError,
  onSubmit,
  options = {},
  method = 'GET',
}: UseApiProps<TData, TVariables>) {
  const [isLoading, setLoading] = useState(false)

  const mutation = useMutation<TData, unknown, TVariables>({
    mutationFn: apiCall,
    onMutate: (variables) => {
      setLoading(true)
      if (onSubmit) onSubmit(variables)
    },
    onSuccess: (data) => {
      setLoading(false)
      if (onSuccess) onSuccess(data)
    },
    onError: (error) => {
      setLoading(false)
      if (onError) onError(error)
      toast({
        title: 'Error occurred',
        description: error instanceof Error ? error.message : 'Unknown error',
        variant: 'destructive',
      })
    },
    ...options,
  })

  return {
    isLoading,
    mutate: mutation.mutate,
    refetch: mutation.mutate,
    isSuccess: mutation.isSuccess,
    isError: mutation.isError,
    error: mutation.error,
    data: mutation.data,
    mutateAsync: mutation.mutateAsync,
    isIdle: mutation.isIdle,
    isPaused: mutation.isPaused,
    failureCount: mutation.failureCount,
    failureReason: mutation.failureReason,
    reset: mutation.reset,
    status: mutation.status,
    method,
  }
}
