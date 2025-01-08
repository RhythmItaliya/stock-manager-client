'use client'

import { useState } from 'react'
import { IconAlertTriangle } from '@tabler/icons-react'
import { toast } from '@/hooks/use-toast'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { deleteInstrumentKey } from '../../../api/api.marketFeed'
import { WatchMarket } from '../data/schema'

interface Props {
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
  const [isLoading, setIsLoading] = useState(false)

  const handleDelete = async () => {
    setIsLoading(true)
    try {
      await deleteInstrumentKey([currentRow.displayName])
      onOpenChange(false)
      onDeleteSuccess(currentRow)
      toast({
        title: `The following WatchMarket has been deleted: ${currentRow.displayName}`,
      })
    } catch (error) {
      toast({
        title: 'Error deleting WatchMarket',
        description: 'Something went wrong while deleting the item.',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
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
