import Papa from 'papaparse'

export type CsvData = {
  option_type: string
  [key: string]: string
}

export const fetchAndFilterCsvData = async (): Promise<CsvData[]> => {
  try {
    const response = await fetch('/complete.csv')
    const csvText = await response.text()

    return new Promise((resolve, reject) => {
      Papa.parse(csvText, {
        header: true,
        skipEmptyLines: true,
        complete: (result) => {
          const filteredRows = (result.data as CsvData[]).filter((row) =>
            ['FF', 'CE', 'PE'].includes(row.option_type)
          )
          resolve(filteredRows)
        },
        error: (error: any) => reject(error),
      })
    })
  } catch (error) {
    console.error('Error fetching or parsing CSV:', error)
    throw new Error('Error fetching or parsing CSV')
  }
}
