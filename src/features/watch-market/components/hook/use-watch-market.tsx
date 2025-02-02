import {
  createSubscription,
  deleteInstrumentKeys,
  getSubscriptions,
} from '@/api/api.subscription'
import { useApi } from '@/hooks/use-api'
import { toast } from '@/hooks/use-toast'

export function deleteWatchMarketSubscriptionAction(
  instrumentKeys: string[],
  userId: string,
  onOpenChange: (open: boolean) => void
) {
  const { mutate, isLoading } = useApi({
    apiCall: () => deleteInstrumentKeys(userId, instrumentKeys),
    onSuccess: (data) => {
      toast({
        title: 'WatchMarket Deleted Successfully',
        description: (
          <pre className='mt-2 w-[340px] rounded-md bg-slate-950 p-4'>
            <code className='text-white'>{JSON.stringify(data, null, 2)}</code>
          </pre>
        ),
      })
      onOpenChange(false)
    },
    onError: (error: any) => {
      console.error('Error deleting WatchMarket:', error)
      toast({
        title: 'Error',
        description: `Error deleting the WatchMarket: ${error.message}`,
        variant: 'destructive',
      })
    },
    method: 'DELETE',
  })

  return { mutate, isLoading }
}

export function createWatchMarketSubscriptionAction(
  subscriptionData: {
    userId: string
    instrumentKeys: string[]
    marketWatchName: string
  },
  onOpenChange: (open: boolean) => void
) {
  const { mutate, isLoading } = useApi({
    apiCall: () => createSubscription(subscriptionData),
    onSuccess: (data) => {
      toast({
        title: 'WatchMarket Subscription Created Successfully',
        description: (
          <pre className='mt-2 w-[340px] rounded-md bg-slate-950 p-4'>
            <code className='text-white'>{JSON.stringify(data, null, 2)}</code>
          </pre>
        ),
      })
      onOpenChange(false)
      getSubscriptions(subscriptionData.userId)
    },
    onError: (error: any) => {
      console.error('Error creating WatchMarket subscription:', error)
      toast({
        title: 'Error',
        description: `Error creating the subscription: ${error.message}`,
        variant: 'destructive',
      })
    },
    method: 'POST',
  })

  return { mutate, isLoading }
}
