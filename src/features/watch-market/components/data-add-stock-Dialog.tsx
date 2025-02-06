import { useEffect, useState } from 'react'
import { IconSearch, IconX } from '@tabler/icons-react'
import { CsvData, fetchAndFilterCsvData } from '@/api/api.fetchAndFilterCsvData'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
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
  const [selectedOption, setSelectedOption] = useState<string>('ALL')
  const [optionTypeFilter, setOptionTypeFilter] = useState<string>('ALL')
  const [exchangeFilter, setExchangeFilter] = useState<string>('ALL')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 6

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

  const filteredCsvData = csvData
    .filter((row) => {
      const lowerCaseSearch = search.toLowerCase()
      const matchesSearch =
        row.name.toLowerCase().includes(lowerCaseSearch) ||
        row.instrument_key.toLowerCase().includes(lowerCaseSearch)

      if (selectedOption === 'ALL') return matchesSearch
      if (selectedOption === 'OPTIONS') {
        const matchesOptionType =
          optionTypeFilter === 'ALL' || row.option_type === optionTypeFilter
        return (
          matchesSearch &&
          (row.option_type === 'CE' || row.option_type === 'PE') &&
          matchesOptionType
        )
      }
      return row.option_type === selectedOption && matchesSearch
    })
    .filter((row) => {
      if (exchangeFilter === 'ALL') return true
      return row.exchange === exchangeFilter
    })

  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = filteredCsvData.slice(indexOfFirstItem, indexOfLastItem)

  const handleClear = () => {
    setSearch('')
  }

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

  const handleOptionSelect = (option: string) => {
    setSelectedOption(option)
    setCurrentPage(1)

    if (option !== 'OPTIONS') {
      setOptionTypeFilter('ALL')
    }
  }

  const handleOptionTypeSelect = (type: string) => {
    setOptionTypeFilter(type)
    setCurrentPage(1)
  }

  const handleExchangeSelect = (exchange: string) => {
    setExchangeFilter(exchange)
    setCurrentPage(1)
  }

  useEffect(() => {
    if (!isOpen) {
      setCurrentPage(1)
      setSearch('')
      setSelectedOption('ALL')
      setExchangeFilter('ALL')
    }
  }, [isOpen])

  useEffect(() => {
    setCurrentPage(1)
  }, [selectedOption])

  const handleReset = () => {
    setSearch('')
    setSelectedOption('ALL')
    setOptionTypeFilter('ALL')
    setExchangeFilter('ALL')
    setCurrentPage(1)
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
          <table className='max-w-full table-auto text-center'>
            <thead>
              <tr>
                <th className='px-4 py-2 border'>Types</th>
                {selectedOption === 'OPTIONS' && (
                  <th className='px-4 py-2 border'>Options Types</th>
                )}
                <th className='px-4 py-2 border'>Exchange Types</th>
                {(optionTypeFilter !== 'ALL' ||
                  selectedOption !== 'ALL' ||
                  exchangeFilter !== 'ALL') && (
                  <th className='px-4 py-2 border'>Reset Filter</th>
                )}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className='px-4 py-2 border'>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant='outline'>
                        {selectedOption === 'ALL'
                          ? 'ALL'
                          : selectedOption === 'FF'
                            ? 'Futures'
                            : selectedOption === 'OPTIONS'
                              ? 'Options'
                              : selectedOption}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem
                        onClick={() => handleOptionSelect('ALL')}
                      >
                        ALL
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleOptionSelect('FF')}
                      >
                        Futures
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleOptionSelect('OPTIONS')}
                      >
                        Options
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>
                {selectedOption === 'OPTIONS' && (
                  <td className='px-4 py-2 border'>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant='outline'>
                          {optionTypeFilter === 'ALL'
                            ? 'ALL'
                            : optionTypeFilter === 'CE'
                              ? 'Call'
                              : optionTypeFilter === 'PE'
                                ? 'Put'
                                : optionTypeFilter}
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem
                          onClick={() => handleOptionTypeSelect('ALL')}
                        >
                          All
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleOptionTypeSelect('CE')}
                        >
                          Call
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleOptionTypeSelect('PE')}
                        >
                          Put
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                )}
                <td className='px-4 py-2 border'>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant='outline'>
                        {exchangeFilter === 'ALL'
                          ? 'ALL'
                          : exchangeFilter === 'NSE_FO'
                            ? 'NSE'
                            : exchangeFilter === 'BSE_FO'
                              ? 'BSE'
                              : exchangeFilter === 'NCD_FO'
                                ? 'MCX'
                                : exchangeFilter === 'MCX_FO'
                                  ? 'MCX'
                                  : exchangeFilter}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem
                        onClick={() => handleExchangeSelect('ALL')}
                      >
                        ALL
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleExchangeSelect('NSE_FO')}
                      >
                        NSE
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleExchangeSelect('BSE_FO')}
                      >
                        BSE
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleExchangeSelect('NCD_FO')}
                      >
                        NCD
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleExchangeSelect('MCX_FO')}
                      >
                        MCX
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>
                {(optionTypeFilter !== 'ALL' ||
                  selectedOption !== 'ALL' ||
                  exchangeFilter !== 'ALL') && (
                  <td className='px-4 py-2 border'>
                    <Button variant='outline' onClick={handleReset}>
                      Reset Filter
                    </Button>
                  </td>
                )}
              </tr>
            </tbody>
          </table>
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
                  <th className='px-4 py-2 border'>Name</th>
                  <th className='px-4 py-2 border'>Tradingsymbol</th>
                  <th className='px-4 py-2 border'>Expiry</th>
                  <th className='px-4 py-2 border'>Strike</th>
                  <th className='px-4 py-2 border'>Lot Size</th>
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
                    <td className='px-4 py-2 border'>{row.name}</td>
                    <td className='px-4 py-2 border'>{row.tradingsymbol}</td>
                    <td className='px-4 py-2 border'>
                      {new Date(row.expiry).toLocaleDateString('en-GB', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </td>
                    <td className='px-4 py-2 border'>{row.strike}</td>
                    <td className='px-4 py-2 border'>{row.lot_size}</td>
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
