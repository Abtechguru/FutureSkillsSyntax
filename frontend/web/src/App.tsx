import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Suspense, lazy } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Toaster } from 'react-hot-toast'
import { SnackbarProvider } from 'notistack'

// Layout Components
import Layout from '@/components/layout/Layout'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import ProtectedRoute from '@/components/auth/ProtectedRoute'

// Lazy-loaded pages
const Home = lazy(() => import('@/pages/Home'))
const Login = lazy(() => import('@/pages/Auth/Login'))
const Register = lazy(() => import('@/pages/Auth/Register'))
const ForgotPassword = lazy(() => import('@/pages/Auth/ForgotPassword'))
const ResetPassword = lazy(() => import('@/pages/Auth/ResetPassword'))
const Dashboard = lazy(() => import('@/pages/Dashboard'))
const CareerAssessment = lazy(() => import('@/pages/Career/Assessment'))
const CareerPathways = lazy(() => import('@/pages/Career/Pathways'))
const SkillGapAnalysis = lazy(() => import('@/pages/Career/SkillGapAnalysis'))
const MentorshipDashboard = lazy(() => import('@/pages/Mentorship/Dashboard'))
const MentorshipSessions = lazy(() => import('@/pages/Mentorship/Sessions'))
const LearningPaths = lazy(() => import('@/pages/Learning'))
const GamificationHub = lazy(() => import('@/pages/Dashboard')) // Placeholder as actual hub is missing
const Profile = lazy(() => import('@/pages/Profile/UserProfile'))
const Settings = lazy(() => import('@/pages/Profile/UserProfile')) // Placeholder
const AdminDashboard = lazy(() => import('@/pages/Admin'))
const NotFound = lazy(() => import('@/pages/NotFound'))

// Roles
import { UserRole } from '@/types'

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
        <AnimatePresence mode="wait">
          <Suspense
            fallback={
              <div className="min-h-screen flex items-center justify-center">
                <LoadingSpinner size="xl" />
              </div>
            }
          >
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Layout />}>
                <Route
                  index
                  element={
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                    >
                      <Home />
                    </motion.div>
                  }
                />
                <Route path="login" element={<Login />} />
                <Route path="register" element={<Register />} />
                <Route path="forgot-password" element={<ForgotPassword />} />
                <Route path="reset-password/:token" element={<ResetPassword />} />

                {/* Protected Routes */}
                <Route element={<ProtectedRoute />}>
                  <Route path="dashboard" element={<Dashboard />} />
                  <Route path="career">
                    <Route path="assessment" element={<CareerAssessment />} />
                    <Route path="pathways" element={<CareerPathways />} />
                    <Route path="skill-gap" element={<SkillGapAnalysis />} />
                  </Route>
                  <Route path="mentorship">
                    <Route index element={<MentorshipDashboard />} />
                    <Route path="sessions" element={<MentorshipSessions />} />
                  </Route>
                  <Route path="learning">
                    <Route path="paths" element={<LearningPaths />} />
                  </Route>
                  <Route path="gamification">
                    <Route index element={<GamificationHub />} />
                  </Route>
                  <Route path="profile">
                    <Route index element={<Profile />} />
                    <Route path="settings" element={<Settings />} />
                  </Route>
                </Route>

                {/* Admin Routes */}
                <Route element={<ProtectedRoute allowedRoles={[UserRole.ADMIN, UserRole.MENTOR]} />}>
                  <Route path="admin">
                    <Route index element={<AdminDashboard />} />
                  </Route>
                </Route>

                {/* 404 */}
                <Route path="*" element={<NotFound />} />
              </Route>
            </Routes>
          </Suspense>
        </AnimatePresence>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
            },
            success: {
              duration: 3000,
              iconTheme: {
                primary: '#4caf50',
                secondary: '#fff',
              },
            },
            error: {
              duration: 4000,
              iconTheme: {
                primary: '#f44336',
                secondary: '#fff',
              },
            },
          }}
        />
      </SnackbarProvider>
    </Router>
  )
}

export default App