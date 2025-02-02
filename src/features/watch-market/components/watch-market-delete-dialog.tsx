'use client'

import { IconAlertTriangle } from '@tabler/icons-react'
import { useAuthStore } from '@/stores/authStore'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { WatchMarket } from '../data/schema'
import { deleteWatchMarketSubscriptionAction } from './hook/use-watch-market'

export interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentRow: WatchMarket
  onDeleteSuccess: (deletedMarket: WatchMarket) => void
}

export function WatchMarketsDeleteDialog({
  open,
  onOpenChange,
  currentRow,
  onDeleteSuccess,
}: Props) {
  const { user } = useAuthStore((state) => state.auth)
  if (!user) {
    console.error('Error: User is not authenticated')
    return null
  }

  const displayName = currentRow.displayName
  if (!displayName) {
    console.error('Error: displayName is undefined for the current row')
    return null
  }
  const { mutate: deleteMarket, isLoading } =
    deleteWatchMarketSubscriptionAction([displayName], user.id, onOpenChange)
  const handleDelete = () => {
    deleteMarket(undefined)
    onDeleteSuccess(currentRow)
  }

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      handleConfirm={handleDelete}
      confirmText='Delete'
      destructive
      isLoading={isLoading}
      title={
        <span className='text-destructive'>
          <IconAlertTriangle
            className='mr-1 inline-block stroke-destructive'
            size={18}
          />{' '}
          Delete WatchMarket
        </span>
      }
      desc={
        <div className='space-y-4'>
          <p className='mb-2'>
            Are you sure you want to delete{' '}
            <span className='font-bold'>{currentRow.displayName}</span> ?
          </p>

          <Alert variant='destructive'>
            <AlertTitle>Warning!</AlertTitle>
            <AlertDescription>
              Please be careful, this operation cannot be rolled back.
            </AlertDescription>
          </Alert>
        </div>
      }
    />
  )
}
