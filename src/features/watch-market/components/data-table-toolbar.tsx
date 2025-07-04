import { useState } from 'react'
import { Cross2Icon, PlusCircledIcon } from '@radix-ui/react-icons'
import { Table } from '@tanstack/react-table'
import { useMarketWatchStore } from '@/stores/MarketWatchState'
import { useAuthStore } from '@/stores/authStore'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { AddStockDialog } from './data-add-stock-Dialog'
import { AddMarketNameDialog } from './data-list-market-name'
import { DataTableViewOptions } from './data-table-view-options'
import { createWatchMarketSubscriptionAction } from './hook/use-watch-market'

interface DataTableToolbarProps<TData> {
  table: Table<TData>
}

export function DataTableToolbar<TData>({
  table,
}: DataTableToolbarProps<TData>) {
  const [isDialogOpen, setDialogOpen] = useState(false)
  const [isMarketWatchDialogOpen, setMarketWatchDialogOpen] = useState(false)
  const [selectedStock, setSelectedStock] = useState<any>(null)
  const isFiltered = table.getState().columnFilters.length > 0
  const { user } = useAuthStore((state) => state.auth)
  const { defaultMarketWatch } = useMarketWatchStore()

  const { mutate: createSubscription, isLoading } =
    createWatchMarketSubscriptionAction(
      {
        userId: user?.id || '',
        instrumentKeys: selectedStock ? [selectedStock.instrument_key] : [],
        marketWatchName: defaultMarketWatch || 'default',
      },
      setMarketWatchDialogOpen
    )

  const handleAddClick = () => {
    setDialogOpen(true)
  }

  const handleDialogClose = () => {
    setDialogOpen(false)
  }

  const handleMarketWatchDialogOpen = () => {
    setMarketWatchDialogOpen(true)
  }

  const handleMarketWatchDialogClose = () => {
    setMarketWatchDialogOpen(false)
  }

  const handleSelectStock = (stock: any) => {
    setSelectedStock(stock)
    if (stock && user) {
      createSubscription(undefined)
    }
  }

  return (
    <div className='flex items-center justify-between'>
      <div className='flex flex-1 flex-col-reverse items-start gap-y-2 sm:flex-row sm:items-center sm:space-x-2'>
        <Input
          placeholder='Filter tasks...'
          value={
            (table.getColumn('displayName')?.getFilterValue() as string) ?? ''
          }
          onChange={(event) =>
            table.getColumn('displayName')?.setFilterValue(event.target.value)
          }
          className='h-8 w-[150px] lg:w-[250px]'
        />
        <Button
          variant='ghost'
          onClick={handleAddClick}
          className='h-8 px-2 lg:px-3'
        >
          <PlusCircledIcon className='ml-2 h-4 w-4' />
          Add
        </Button>

        <Button
          variant='ghost'
          onClick={handleMarketWatchDialogOpen}
          className='h-8 px-2 lg:px-3'
        >
          <PlusCircledIcon className='ml-2 h-4 w-4' />
          Add Market Watch
        </Button>

        {isFiltered && (
          <Button
            variant='ghost'
            onClick={() => table.resetColumnFilters()}
            className='h-8 px-2 lg:px-3'
          >
            Reset
            <Cross2Icon className='ml-2 h-4 w-4' />
          </Button>
        )}
      </div>
      <DataTableViewOptions table={table} />

      <AddStockDialog
        isOpen={isDialogOpen}
        onClose={handleDialogClose}
        onSelect={handleSelectStock}
        isLoading={isLoading}
      />

      <AddMarketNameDialog
        isOpen={isMarketWatchDialogOpen}
        onClose={handleMarketWatchDialogClose}
      />
    </div>
  )
}
