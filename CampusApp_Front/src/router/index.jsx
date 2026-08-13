import { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import ProtectedRoute from './ProtectedRoute'
import AdminRoute from './AdminRoute'
import PublicRoute from './PublicRoute'
import PageLayout from '@/shared/components/PageLayout'
import Spinner from '@/shared/components/Spinner'

const LandingPage      = lazy(() => import('@/features/landing/pages/LandingPage'))
const LoginPage        = lazy(() => import('@/features/auth/pages/LoginPage'))
const RegisterPage     = lazy(() => import('@/features/auth/pages/RegisterPage'))
const DashboardPage    = lazy(() => import('@/features/dashboard/pages/DashboardPage'))
const MenusPage        = lazy(() => import('@/features/menus/pages/MenusPage'))
const PedidosPage      = lazy(() => import('@/features/pedidos/pages/PedidosPage'))
const PedidoDetailPage = lazy(() => import('@/features/pedidos/pages/PedidoDetailPage'))
const PedidoFormPage   = lazy(() => import('@/features/pedidos/pages/PedidoFormPage'))
const AdminDashboard   = lazy(() => import('@/features/admin/pages/AdminDashboard'))
const AdminMenusPage   = lazy(() => import('@/features/admin/pages/AdminMenusPage'))
const AdminSedesPage   = lazy(() => import('@/features/admin/pages/AdminSedesPage'))
const AdminUsuariosPage = lazy(() => import('@/features/admin/pages/AdminUsuariosPage'))
const HistorialPage    = lazy(() => import('@/features/admin/pages/HistorialPage'))
const NotFoundPage     = lazy(() => import('./NotFoundPage'))
const PerfilPage       = lazy(() => import('@/features/perfil/pages/PerfilPage'))

export default function AppRouter() {
  return (
    <Suspense fallback={<Spinner fullscreen />}>
      <Routes>
        <Route element={<PublicRoute />}>
          <Route path="/"         element={<LandingPage />} />
          <Route path="/login"    element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route element={<PageLayout />}>
            <Route path="/dashboard"           element={<DashboardPage />} />
            <Route path="/menus"               element={<MenusPage />} />
            <Route path="/pedidos"             element={<PedidosPage />} />
            <Route path="/pedidos/nuevo"       element={<PedidoFormPage />} />
            <Route path="/pedidos/:id"         element={<PedidoDetailPage />} />
            <Route path="/pedidos/:id/editar"  element={<PedidoFormPage />} />
            <Route path="/perfil"              element={<PerfilPage />} />
          </Route>
        </Route>

        <Route element={<AdminRoute />}>
          <Route element={<PageLayout />}>
            <Route path="/admin"                        element={<AdminDashboard />} />
            <Route path="/admin/menus"                  element={<AdminMenusPage />} />
            <Route path="/admin/sedes"                  element={<AdminSedesPage />} />
            <Route path="/admin/usuarios"               element={<AdminUsuariosPage />} />
            <Route path="/admin/pedidos/:id/historial"  element={<HistorialPage />} />
          </Route>
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  )
}
