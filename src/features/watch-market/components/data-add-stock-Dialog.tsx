import { useState } from 'react'
import { IconSearch, IconX } from '@tabler/icons-react'
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'

interface AddStockDialogProps {
  isOpen: boolean
  onClose: () => void
}

export function AddStockDialog({ isOpen, onClose }: AddStockDialogProps) {
  const [search, setSearch] = useState('')

  const handleClear = () => {
    setSearch('')
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogTrigger asChild></DialogTrigger>
      <DialogContent>
        <DialogTitle>Search Stocks</DialogTitle>
        <DialogDescription>
          Use the search input below to find stocks.
        </DialogDescription>

        <div className='relative'>
          <IconSearch
            aria-hidden='true'
            className='absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground'
          />

          <Input
            placeholder='Search market...'
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className='pl-10 pr-12 h-9 w-full rounded-md text-sm'
          />

          {search && (
            <IconX
              aria-hidden='true'
              onClick={handleClear}
              className='absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground cursor-pointer'
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
