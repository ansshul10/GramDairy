import { Navigate, useLocation } from 'react-router-dom'
import useAuthStore from '../../store/authStore'

/**
 * ProtectedRoute component - used to wrap sensitive routes
 */
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, isAuthenticated } = useAuthStore()
  const location = useLocation()

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
