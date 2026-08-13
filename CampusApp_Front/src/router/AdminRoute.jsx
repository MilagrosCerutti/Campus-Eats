import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import Spinner from '@/shared/components/Spinner'

export default function AdminRoute() {
  const { user, isAdmin, isLoading } = useAuth()
  if (isLoading) return <Spinner fullscreen />
  if (!user) return <Navigate to="/login" replace />
  if (!isAdmin) return <Navigate to="/pedidos" replace />
  return <Outlet />
}
