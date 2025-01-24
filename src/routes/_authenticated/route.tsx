import { useEffect, useRef } from 'react'
import Cookies from 'js-cookie'
import { createFileRoute, Outlet, useNavigate } from '@tanstack/react-router'
import { validateToken } from '@/api/api.auth'
import { cn } from '@/lib/utils'
import { SearchProvider } from '@/context/search-context'
import { useApi } from '@/hooks/use-api'
import LoadingSpinner from '@/components/ui/loadingSpinner'
import { SidebarProvider } from '@/components/ui/sidebar'
import { AppSidebar } from '@/components/layout/app-sidebar'
import SkipToMain from '@/components/skip-to-main'

export const Route = createFileRoute('/_authenticated')({
  component: RouteComponent,
})

function RouteComponent() {
  const navigate = useNavigate()
  const defaultOpen = Cookies.get('sidebar:state') !== 'false'

  const accessToken =
    Cookies.get('accessToken') || localStorage.getItem('accessToken')
  if (!accessToken) {
    navigate({ to: '/sign-in' })
    return null
  }

  const { mutate: validate, isLoading } = useApi({
    apiCall: validateToken,
    method: 'POST',
    onError: () => {
      navigate({ to: '/sign-in' })
    },
    onSuccess: () => {
      navigate({ to: '/' })
    },
  })

  const hasFetchedRef = useRef(false)

  useEffect(() => {
    if (accessToken && !hasFetchedRef.current) {
      validate(accessToken)
      hasFetchedRef.current = true
    }
  }, [accessToken, validate])

  if (isLoading) {
    return (
      <div className='flex justify-center items-center h-screen'>
        <LoadingSpinner size='large' />
      </div>
    )
  }

  return (
    <SearchProvider>
      <SidebarProvider defaultOpen={defaultOpen}>
        <SkipToMain />
        <AppSidebar />
        <div
          id='content'
          className={cn(
            'max-w-full w-full ml-auto',
            'peer-data-[state=collapsed]:w-[calc(100%-var(--sidebar-width-icon)-1rem)]',
            'peer-data-[state=expanded]:w-[calc(100%-var(--sidebar-width))]',
            'transition-[width] ease-linear duration-200',
            'h-svh flex flex-col',
            'group-data-[scroll-locked=1]/body:h-full',
            'group-data-[scroll-locked=1]/body:has-[main.fixed-main]:h-svh'
          )}
        >
          <Outlet />
        </div>
      </SidebarProvider>
    </SearchProvider>
  )
}
