import React, { useEffect } from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import type { AppDispatch, RootState } from '@/store/store'
import { fetchUserProfile } from '@/store/slices/authSlice'
import { UserRole } from '@/types'

interface ProtectedRouteProps {
  allowedRoles?: UserRole[]
}

/**
 * A stored bearer token is not proof of an active session or an authorised role.
 * Reload the account from the backend before rendering protected screens.
 */
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles }) => {
  const dispatch = useDispatch<AppDispatch>()
  const { isAuthenticated, user, isLoading } = useSelector((state: RootState) => state.auth)
  const location = useLocation()

  useEffect(() => {
    if (isAuthenticated && !user && !isLoading) {
      void dispatch(fetchUserProfile())
    }
  }, [dispatch, isAuthenticated, user, isLoading])

  if (isLoading || (isAuthenticated && !user)) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center" role="status" aria-live="polite">
        <p className="text-sm text-gray-600 dark:text-gray-300">Checking your session…</p>
      </div>
    )
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  if (allowedRoles && !allowedRoles.includes(user.role as UserRole)) {
    return <Navigate to="/unauthorized" replace />
  }

  return <Outlet />
}

export default ProtectedRoute
