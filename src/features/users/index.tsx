import { useEffect, useRef, useState } from 'react'
import { getUsers } from '@/api/api.user'
import { useApi } from '@/hooks/use-api'
import LoadingSpinner from '@/components/ui/loadingSpinner'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { columns } from './components/users-columns'
import { UsersDialogs } from './components/users-dialogs'
import { UsersPrimaryButtons } from './components/users-primary-buttons'
import { UsersTable } from './components/users-table'
import UsersProvider from './context/users-context'

export default function Users() {
  const hasFetchedRef = useRef(false)

  const [usersData, setUsersData] = useState<any[]>([])

  const { isLoading, mutate } = useApi({
    apiCall: getUsers,
    method: 'GET',
    onSuccess: (data) => {
      console.log('Fetched users:', data)
      if (data.status === 'success') {
        setUsersData(data.data)
      }
    },
    onError: (error) => {
      console.error('Error fetching users:', error)
    },
  })

  useEffect(() => {
    if (!hasFetchedRef.current) {
      mutate(undefined)
      hasFetchedRef.current = true
    }
  }, [mutate])

  return (
    <UsersProvider>
      <Header fixed>
        <Search />
        <div className='ml-auto flex items-center space-x-4'>
          <ThemeSwitch />
          <ProfileDropdown />
        </div>
      </Header>

      <Main>
        <div className='mb-2 flex items-center justify-between space-y-2 flex-wrap'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>User List</h2>
            <p className='text-muted-foreground'>
              Manage your users and their roles here.
            </p>
          </div>
          <UsersPrimaryButtons />
        </div>
        <div className='-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0'>
          {isLoading ? (
            <div className='flex justify-center items-center'>
              <LoadingSpinner size='large' />
            </div>
          ) : (
            <UsersTable data={usersData} columns={columns} />
          )}
        </div>
      </Main>

      <UsersDialogs />
    </UsersProvider>
  )
}
