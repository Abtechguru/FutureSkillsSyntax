import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Suspense, lazy } from 'react'
import { Toaster } from 'react-hot-toast'
import { SnackbarProvider } from 'notistack'

// Layout Components
import Layout from '@/components/layout/Layout'
import LoadingSpinner from '@/components/ui/LoadingSpinner'

// Lazy-loaded pages
const Home = lazy(() => import('@/pages/Home'))
const Login = lazy(() => import('@/pages/Auth/Login'))
const Register = lazy(() => import('@/pages/Auth/Register'))
const ForgotPassword = lazy(() => import('@/pages/Auth/ForgotPassword'))
const ResetPassword = lazy(() => import('@/pages/Auth/ResetPassword'))
const VerifyEmail = lazy(() => import('@/pages/Auth/VerifyEmail'))
const Dashboard = lazy(() => import('@/pages/Dashboard'))
const Profile = lazy(() => import('@/pages/Profile/UserProfile'))
const AdminDashboard = lazy(() => import('@/pages/Admin/Dashboard'))
const NotFound = lazy(() => import('@/pages/NotFound'))

import ProtectedRoute from '@/components/auth/ProtectedRoute'

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
              <Route index element={<Home />} />
              <Route path="login" element={<Login />} />
              <Route path="register" element={<Register />} />
              <Route path="forgot-password" element={<ForgotPassword />} />
              <Route path="reset-password/:token" element={<ResetPassword />} />
              <Route path="verify-email" element={<VerifyEmail />} />

              <Route element={<ProtectedRoute />}>
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="profile">
                  <Route index element={<Profile />} />
                </Route>
                <Route path="admin" element={<AdminDashboard />} />
              </Route>

              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </Suspense>
        <Toaster position="top-right" />
      </SnackbarProvider>
    </Router>
  )
}

export default App