import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import Spinner from '@/shared/components/Spinner'

export default function PublicRoute() {
  const { user, isAdmin, isLoading } = useAuth()
  if (isLoading) return <Spinner fullscreen />
  if (user) return <Navigate to={isAdmin ? '/admin' : '/dashboard'} replace />
  return <Outlet />
}
