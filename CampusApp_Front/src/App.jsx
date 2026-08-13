import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from '@/context/AuthContext'
import { Toaster } from '@/components/ui/sonner'
import AppRouter from '@/router'
import ErrorBoundary from '@/shared/components/ErrorBoundary'
import AccessDeniedDialog from '@/shared/components/AccessDeniedDialog'

export default function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <AuthProvider>
          <AppRouter />
          <AccessDeniedDialog />
          <Toaster
            theme="light"
            position="top-right"
            richColors
            closeButton
            visibleToasts={4}
            toastOptions={{
              classNames: {
                toast: 'cn-toast !border-border !shadow-xl',
                title: 'font-orbitron text-xs tracking-wider',
                description: '!text-muted-foreground',
              },
            }}
          />
        </AuthProvider>
      </BrowserRouter>
    </ErrorBoundary>
  )
}
