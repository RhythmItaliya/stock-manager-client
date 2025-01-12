import { ApiConfig } from './api.config'

export const uploadCsvFile = async (file: File) => {
  const formData = new FormData()
  formData.append('file', file)
  try {
    const response = await ApiConfig.post('/csv/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return response.data
  } catch (error) {
    console.error('Error uploading CSV file:', error)
    throw error
  }
}

export const getCsvFiles = async () => {
  try {
    const response = await ApiConfig.get('/csv/getcsv')
    return response.data
  } catch (error) {
    console.error('Error fetching CSV file:', error)
    throw error
  }
}

export const updateCsvFile = async (id: string, file: File) => {
  console.log(id,file)
  const formData = new FormData()
  formData.append('file', file)
  try {
    const response = await ApiConfig.put(`/csv/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return response.data
  } catch (error) {
    console.error('Error updating CSV file:', error)
    throw error
  }
}
