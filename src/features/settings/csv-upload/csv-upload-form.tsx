import { useEffect, useRef, useState } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { IconCloudUpload } from '@tabler/icons-react'
import { getCsvFiles, updateCsvFile, uploadCsvFile } from '@/api/api.csv-upload'
import { useApi } from '@/hooks/use-api'
import { toast } from '@/hooks/use-toast'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'

const CSVUploadFormSchema = z.object({
  file: z
    .instanceof(File)
    .refine((file) => file.type === 'text/csv', 'Only CSV files are allowed.')
    .or(z.undefined())
    .refine((file) => file !== undefined, 'Please select a file.'),
})

type CSVUploadFormValues = z.infer<typeof CSVUploadFormSchema>

export function CSVUploadForm() {
  const form = useForm<CSVUploadFormValues>({
    resolver: zodResolver(CSVUploadFormSchema),
  })

  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [fileError, setFileError] = useState<string>('')
  const [latestCsvFile, setLatestCsvFile] = useState<{
    id: string
    fileURL: string
    lastUpdatedDate: string
  } | null>(null)

  const { isLoading: isFetching, mutate: fetchCsvFiles } = useApi({
    apiCall: getCsvFiles,
    method: 'GET',
    onError: (err) => console.error('Error fetching CSV files:', err),
    onSuccess: (data) => {
      if (Array.isArray(data.data)) {
        const sortedFiles = data.data.sort((a: any, b: any) => {
          return (
            new Date(b.lastUpdatedDate).getTime() -
            new Date(a.lastUpdatedDate).getTime()
          )
        })
        const latestFile = sortedFiles[0]
        setLatestCsvFile({
          id: latestFile?._id,
          fileURL: latestFile?.csvFileUrl,
          lastUpdatedDate: latestFile?.lastUpdatedDate,
        })
      } else {
        console.error('Fetched data is not in the expected format:', data)
      }
    },
  })

  const hasFetched = useRef(false)
  useEffect(() => {
    if (!hasFetched.current) {
      fetchCsvFiles(undefined)
      hasFetched.current = true
    }
  }, [fetchCsvFiles])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.type !== 'text/csv') {
        setFileError('Only CSV files are allowed.')
        setSelectedFile(null)
      } else {
        setFileError('')
        setSelectedFile(file)
      }
    }
  }

  const { isLoading: isUploading, mutate: uploadFile } = useApi({
    apiCall: uploadCsvFile,
    method: 'POST',
    onSuccess: (data) => {
      console.log(data)
      toast({
        title: 'File uploaded successfully',
        description: `File: ${selectedFile?.name} uploaded.`,
      })
      setSelectedFile(null)
      form.reset()
    },
    onError: (error) => {
      console.error('Error uploading file:', error)
      toast({
        title: 'Upload failed',
        description: 'There was an error uploading the file.',
        variant: 'destructive',
      })
    },
  })

  const { isLoading: isUpdating, mutate: updateFile } = useApi({
    apiCall: updateCsvFile,
    onSuccess: (data) => {
      console.log(data);
      toast({
        title: 'File updated successfully',
        description: `File: ${selectedFile?.name} updated.`,
      })
      setSelectedFile(null)
      form.reset()
    },
    onError: (error) => {
      console.error('Error updating file:', error)
      toast({
        title: 'Update failed',
        description: 'There was an error updating the file.',
        variant: 'destructive',
      })
    },
    method: 'PUT',
  })

  const onSubmit = async (data: CSVUploadFormValues) => {
    const file = data.file
    if (file) {
      if (latestCsvFile && latestCsvFile.id) {
        updateFile(latestCsvFile.id, file)
      } else {
        uploadFile(file)
      }
    }
  }

  const isLoading = isUploading || isUpdating || isFetching

  return (
    <Card className='w-full max-w-md p-6 flex justify-center items-center mx-auto'>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
          <FormField
            control={form.control}
            name='file'
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className='flex items-center space-x-4'>
                    <FormLabel
                      htmlFor='fileInput'
                      className='flex items-center space-x-3 cursor-pointer border border-dashed p-3 rounded-md hover:underline transition'
                    >
                      <IconCloudUpload size={30} />
                      {selectedFile && !fileError && (
                        <div className='mt-2 text-sm'>
                          <span>{selectedFile.name}</span>
                        </div>
                      )}
                      {!selectedFile && !fileError && (
                        <div className='mt-2 text-sm'>
                          <span>Choose a CSV file</span>
                        </div>
                      )}
                    </FormLabel>
                    <input
                      id='fileInput'
                      type='file'
                      accept='.csv'
                      onChange={(e) => {
                        handleFileChange(e)
                        field.onChange(e.target.files?.[0] || undefined)
                      }}
                      className='hidden'
                    />
                  </div>
                </FormControl>
                {fileError && (
                  <FormMessage className='text-sm text-red-500'>
                    {fileError}
                  </FormMessage>
                )}
              </FormItem>
            )}
          />
          <Button type='submit' className='w-full' disabled={isLoading}>
            {isLoading ? 'Processing...' : 'Upload File'}
          </Button>
        </form>
      </Form>
    </Card>
  )
}
