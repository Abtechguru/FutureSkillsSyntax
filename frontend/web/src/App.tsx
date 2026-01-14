import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Suspense, lazy } from 'react'
import { Toaster } from 'react-hot-toast'
import { SnackbarProvider } from 'notistack'

// Layout Components
import Layout from '@/components/layout/Layout'
import LoadingSpinner from '@/components/ui/LoadingSpinner'

// Lazy-loaded pages
// const Home = lazy(() => import('@/pages/Home'))

function App() {
  return (
    <Router>
      <SnackbarProvider
        maxSnack={3}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <Suspense
          fallback={
            <div className="min-h-screen flex items-center justify-center">
              <LoadingSpinner size="xl" />
            </div>
          }
        >
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<div>Layout Test Only</div>} />
            </Route>
          </Routes>
        </Suspense>
        <Toaster position="top-right" />
      </SnackbarProvider>
    </Router>
  )
}

export default App