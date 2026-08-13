import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import Spinner from '@/shared/components/Spinner'

export default function ProtectedRoute() {
  const { user, isLoading } = useAuth()
  if (isLoading) return <Spinner fullscreen />
  if (!user) return <Navigate to="/login" replace />
  return <Outlet />
}
