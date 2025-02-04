import { getUpstoxLoginURL } from '@/api/api.upstox'
import { useApi } from '@/hooks/use-api'
import { toast } from '@/hooks/use-toast'
import { Button } from '@/components/ui/button'

export const UpstoxLinkGenerator = () => {
  const { isLoading, mutate } = useApi({
    apiCall: getUpstoxLoginURL,
    onSuccess: (data) => {
      const authUrl = data?.data?.auth_url
      console.log('Received Upstox Login URL:', authUrl)
      if (authUrl) {
        window.open(
          authUrl,
          '_blank',
          'width=auto,height=auto,noopener,noreferrer'
        )
        toast({
          title: 'Received Upstox Login URL',
          description: `Click the link to login: 
                    ${authUrl}`,
        })
      }
    },
    onError: (error) => {
      console.error('Error generating Upstox URL:', error)
      toast({
        title: 'Error',
        description: 'There was an error generating the login URL.',
        variant: 'destructive',
      })
    },
    method: 'GET',
  })

  const GenerateUpstoxLink = () => {
    mutate(undefined)
  }

  return (
    <Button
      type='button'
      onClick={GenerateUpstoxLink}
      className='w-full'
      disabled={isLoading}
    >
      {isLoading ? 'Generating Link...' : 'Generate Upstox Link'}
    </Button>
  )
}
