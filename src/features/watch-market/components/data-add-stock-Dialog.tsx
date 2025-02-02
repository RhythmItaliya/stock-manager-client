import { useEffect, useState } from 'react'
import { IconSearch, IconX } from '@tabler/icons-react'
import { CsvData, fetchAndFilterCsvData } from '@/api/api.fetchAndFilterCsvData'
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
  onSelect: (stock: any) => void
  isLoading: boolean
}

export function AddStockDialog({
  isOpen,
  onClose,
  onSelect,
}: AddStockDialogProps) {
  const [search, setSearch] = useState('')
  const [csvData, setCsvData] = useState<CsvData[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5

  const handleClear = () => {
    setSearch('')
  }

  useEffect(() => {
    if (!isOpen) return

    const fetchData = async () => {
      setLoading(true)
      try {
        const filteredData = await fetchAndFilterCsvData()
        setCsvData(filteredData)
      } catch (error) {
        setError('Error fetching CSV data')
      } finally {
        setLoading(false)
      }
    }

    fetchData()

    return () => {
      setCsvData([])
      setLoading(true)
    }
  }, [isOpen])

  const filteredCsvData = csvData.filter((row) => {
    const lowerCaseSearch = search.toLowerCase()
    return (
      row.name.toLowerCase().includes(lowerCaseSearch) ||
      row.option_type.toLowerCase().includes(lowerCaseSearch) ||
      row.instrument_key.toLowerCase().includes(lowerCaseSearch)
    )
  })

  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = filteredCsvData.slice(indexOfFirstItem, indexOfLastItem)

  const handleNextPage = () => {
    if (currentPage < Math.ceil(filteredCsvData.length / itemsPerPage)) {
      setCurrentPage(currentPage + 1)
    }
  }

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1)
    }
  }

  const handleRowClick = (row: any) => {
    onSelect(row)
    onClose()
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

        <div className='mt-4'>
          {loading ? (
            <p>Loading...</p>
          ) : error ? (
            <p>{error}</p>
          ) : (
            <table className='min-w-full table-auto'>
              <thead>
                <tr>
                  <th className='px-4 py-2 border'>Instrument Key</th>
                  <th className='px-4 py-2 border'>Exchange Token</th>
                  <th className='px-4 py-2 border'>Tradingsymbol</th>
                  <th className='px-4 py-2 border'>Name</th>
                  <th className='px-4 py-2 border'>Last Price</th>
                  <th className='px-4 py-2 border'>Expiry</th>
                  <th className='px-4 py-2 border'>Strike</th>
                  <th className='px-4 py-2 border'>Tick Size</th>
                  <th className='px-4 py-2 border'>Lot Size</th>
                  <th className='px-4 py-2 border'>Instrument Type</th>
                  <th className='px-4 py-2 border'>Option Type</th>
                  <th className='px-4 py-2 border'>Exchange</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map((row, index) => (
                  <tr
                    key={index}
                    onClick={() => handleRowClick(row)}
                    className='cursor-pointer hover:bg-gray-200'
                  >
                    <td className='px-4 py-2 border'>{row.instrument_key}</td>
                    <td className='px-4 py-2 border'>{row.exchange_token}</td>
                    <td className='px-4 py-2 border'>{row.tradingsymbol}</td>
                    <td className='px-4 py-2 border'>{row.name}</td>
                    <td className='px-4 py-2 border'>{row.last_price}</td>
                    <td className='px-4 py-2 border'>{row.expiry}</td>
                    <td className='px-4 py-2 border'>{row.strike}</td>
                    <td className='px-4 py-2 border'>{row.tick_size}</td>
                    <td className='px-4 py-2 border'>{row.lot_size}</td>
                    <td className='px-4 py-2 border'>{row.instrument_type}</td>
                    <td className='px-4 py-2 border'>{row.option_type}</td>
                    <td className='px-4 py-2 border'>{row.exchange}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className='flex justify-between mt-4'>
          <button
            onClick={handlePrevPage}
            disabled={currentPage === 1}
            className='px-4 py-2 bg-gray-300 rounded-md disabled:opacity-50'
          >
            Previous
          </button>

          <span>
            Page {currentPage} of{' '}
            {Math.ceil(filteredCsvData.length / itemsPerPage)}
          </span>

          <button
            onClick={handleNextPage}
            disabled={
              currentPage === Math.ceil(filteredCsvData.length / itemsPerPage)
            }
            className='px-4 py-2 bg-gray-300 rounded-md disabled:opacity-50'
          >
            Next
          </button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
