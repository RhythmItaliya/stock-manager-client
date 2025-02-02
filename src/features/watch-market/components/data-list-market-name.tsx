import { useState, useEffect } from 'react'
import { IconSearch, IconX } from '@tabler/icons-react'
import { useMarketWatchStore } from '@/stores/MarketWatchState'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import LoadingSpinner from '@/components/ui/loadingSpinner'
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table'
import {
  getMarketWatchNames,
  postMarketWatch,
  deleteMarketWatch,
  getMarketWatchInstruments,
  setDefaultMarketWatch,
} from '../../../api/api.marketWatch'

interface AddMarketNameDialogProps {
  isOpen: boolean
  onClose: () => void
}

interface Stock {
  id: string
  name: string
  isDefault: boolean
}

interface MarketWatch {
  name: string
  isDefaultMarket: boolean
}

export function AddMarketNameDialog({
  isOpen,
  onClose,
}: AddMarketNameDialogProps) {
  const [search, setSearch] = useState('')
  const [stocks, setStocks] = useState<Stock[]>([])
  const [filteredStocks, setFilteredStocks] = useState<Stock[]>([])
  const [loading, setLoading] = useState(false)
  const [newMarketName, setNewMarketName] = useState('')
  const [isAddingNewMarket, setIsAddingNewMarket] = useState(false)

  useEffect(() => {
    const fetchMarketWatchNames = async () => {
      setLoading(true)
      try {
        const response = await getMarketWatchNames()
        const marketWatchNames: MarketWatch[] = response.data || []
        const stockList = marketWatchNames.map((stock, index) => ({
          id: `${index + 1}`,
          name: stock.name,
          isDefault: stock.isDefaultMarket,
        }))
        setStocks(stockList)
        setFilteredStocks(stockList)

        const defaultMarketWatch = marketWatchNames.find(
          (marketWatch) => marketWatch.isDefaultMarket
        )
        if (defaultMarketWatch) {
          useMarketWatchStore
            .getState()
            .setDefaultMarketWatch(defaultMarketWatch.name)
        }
      } catch (error) {
        console.error('Error fetching market watches:', error)
      } finally {
        setLoading(false)
      }
    }

    if (isOpen) {
      fetchMarketWatchNames()
    }
  }, [isOpen])

  const handleClear = () => {
    setSearch('')
    setFilteredStocks(stocks)
  }

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value)
    const filtered = stocks.filter((stock) =>
      stock.name.toLowerCase().includes(e.target.value.toLowerCase())
    )
    setFilteredStocks(filtered)
  }

  const handleDeleteMarketWatch = async (stockId: string) => {
    try {
      const stock = stocks.find((stock) => stock.id === stockId)
      if (stock) {
        const response = await deleteMarketWatch(stock.name)
        console.log('Market watch deleted:', response)
        setStocks((prevStocks) =>
          prevStocks.filter((stock) => stock.id !== stockId)
        )
        setFilteredStocks((prevStocks) =>
          prevStocks.filter((stock) => stock.id !== stockId)
        )
      }
    } catch (error) {
      console.error('Error deleting market watch:', error)
    }
  }

  const handleCreateNewMarket = async () => {
    if (newMarketName.trim()) {
      try {
        const response = await postMarketWatch(newMarketName)
        console.log('New market added:', response)

        const newStock = {
          id: `${stocks.length + 1}`,
          name: newMarketName,
          isDefault: false,
        }
        setStocks((prevStocks) => [...prevStocks, newStock])
        setFilteredStocks((prevStocks) => [...prevStocks, newStock])
        setNewMarketName('')
        setIsAddingNewMarket(false)
      } catch (error) {
        console.error('Error creating new market watch:', error)
      }
    }
  }

  const handleSelectMarketWatch = async (stockId: string) => {
    try {
      const stock = stocks.find((stock) => stock.id === stockId)
      if (stock) {
        const response = await getMarketWatchInstruments(stock.name)
        console.log('Market watch instruments:', response.data)
        onClose()
      }
    } catch (error) {
      console.error('Error selecting market watch:', error)
    }
  }

  const handleSetDefaultMarketWatch = async (stockId: string) => {
    try {
      const stock = stocks.find((stock) => stock.id === stockId)
      if (stock) {
        const response = await setDefaultMarketWatch(stock.name)
        console.log('Market watch set as default:', response)
        useMarketWatchStore.getState().setDefaultMarketWatch(stock.name)
        setStocks((prevStocks) =>
          prevStocks.map((s) =>
            s.id === stockId
              ? { ...s, isDefault: true }
              : { ...s, isDefault: false }
          )
        )
        setFilteredStocks((prevStocks) =>
          prevStocks.map((s) =>
            s.id === stockId
              ? { ...s, isDefault: true }
              : { ...s, isDefault: false }
          )
        )
        onClose()
      }
    } catch (error) {
      console.error('Error setting market watch as default:', error)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogTrigger asChild></DialogTrigger>
      <DialogContent>
        <DialogTitle>Market Watch</DialogTitle>
        <DialogDescription>
          Use the search input below to find a market to add to your watch list.
        </DialogDescription>

        <div className='relative flex gap-5'>
          <IconSearch
            aria-hidden='true'
            className='absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground'
          />

          <Input
            placeholder='Search market...'
            value={search}
            onChange={handleSearchChange}
            className='pl-10 pr-12 h-9 w-full rounded-md text-sm'
          />

          {search && (
            <IconX
              aria-hidden='true'
              onClick={handleClear}
              className='absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground cursor-pointer'
            />
          )}

          <Button onClick={() => setIsAddingNewMarket(true)}>
            Add New Market Watch
          </Button>
        </div>

        {isAddingNewMarket && (
          <div className='mt-4'>
            <Input
              value={newMarketName}
              onChange={(e) => setNewMarketName(e.target.value)}
              placeholder='Enter new market name'
              className='w-full mb-4'
            />
            <Button onClick={handleCreateNewMarket}>Create Market</Button>
          </div>
        )}

        <div className='mt-4'>
          {loading ? (
            <div className='flex justify-center items-center'>
              <LoadingSpinner size='small' />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className='px-4 py-2'>Market Watch Name</TableHead>
                  <TableHead className='px-4 py-2'>Watch Market</TableHead>
                  <TableHead className='px-4 py-2 text-center'>
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStocks.length > 0 ? (
                  filteredStocks.map((stock) => (
                    <TableRow key={stock.id}>
                      <TableCell className='px-4 py-2'>{stock.name}</TableCell>
                      <TableCell className='px-4 py-2'>
                        <Button
                          onClick={() => handleSelectMarketWatch(stock.id)}
                          variant='outline'
                        >
                          Watch Market
                        </Button>
                      </TableCell>

                      <TableCell className='px-4 py-2 justify-center flex'>
                        {!stock.isDefault && (
                          <Button
                            onClick={() =>
                              handleSetDefaultMarketWatch(stock.id)
                            }
                            variant='secondary'
                          >
                            Default
                          </Button>
                        )}
                        {stock.isDefault && (
                          <Button
                            variant='secondary'
                            className='text-green-600'
                          >
                            Default
                          </Button>
                        )}
                        <Button
                          onClick={() => handleDeleteMarketWatch(stock.id)}
                          variant='link'
                        >
                          Delete
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={3} className='text-center px-4 py-2'>
                      No market watch found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
