import { Link } from '@tanstack/react-router'
import { Card } from '@/components/ui/card'
import AuthLayout from '../auth-layout'
import { ForgotForm } from './components/forgot-password-form'

export default function ForgotPassword() {
  return (
    <AuthLayout>
      <Card className='p-6'>
        <div className='flex flex-col space-y-2 text-left'>
          <h1 className='text-2xl font-semibold tracking-tight'>
            Forgot Password
          </h1>
          <p className='text-sm text-muted-foreground py-1.5'>
            Enter your registered email and we will send you a link to reset
            your password.
          </p>
        </div>
        <ForgotForm />
        <p className='mt-4 px-8 text-center text-sm text-muted-foreground'>
          Sign in your account?{' '}
          <Link
            to='/sign-in'
            className='underline underline-offset-4 hover:text-primary'
          >
            Sign in
          </Link>
          .
        </p>
      </Card>
    </AuthLayout>
  )
}
