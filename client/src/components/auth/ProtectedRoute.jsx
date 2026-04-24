import { Navigate, useLocation } from 'react-router-dom'
import useAuthStore from '../../store/authStore'

/**
 * ProtectedRoute component - used to wrap sensitive routes.
 * Shows a loading spinner while the initial auth check is in progress,
 * then redirects to login if the user is not authenticated.
 */
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, isAuthenticated, isLoading } = useAuthStore()
  const location = useLocation()

  // While auth is being checked (on page refresh), show a loading state
  // instead of immediately redirecting to login
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin" />
          <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Loading...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    // Redirect to login but save the location they were trying to go to
    return <Navigate to="/auth/login" state={{ from: location }} replace />
  }

  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    // If user role is not allowed, redirect to home
    return <Navigate to="/" replace />
  }

  return children
}

export default ProtectedRoute
