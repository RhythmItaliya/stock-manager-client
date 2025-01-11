import { useState } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { IconCloudUpload } from '@tabler/icons-react'
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

  function onSubmit(data: CSVUploadFormValues) {
    const file = data.file
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        const binaryData = reader.result
        console.log('Binary data:', binaryData)
        toast({
          title: 'File uploaded successfully',
          description: `File: ${file.name}, Binary data loaded.`,
        })

        setSelectedFile(null)
        setFileError('')
        form.reset()
      }
      reader.onerror = (error) => {
        console.error('Error reading file:', error)
        toast({
          title: 'Error',
          description: 'Failed to read the file.',
        })
      }
      reader.readAsArrayBuffer(file)
    }
  }

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
          <Button type='submit' className='w-full'>
            Upload File
          </Button>
        </form>
      </Form>
    </Card>
  )
}
