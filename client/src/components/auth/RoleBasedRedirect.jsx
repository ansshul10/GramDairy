import React from 'react'
import { Navigate } from 'react-router-dom'
import useAuthStore from '../../store/authStore'
import LandingPage from '../../pages/public/LandingPage'

const RoleBasedRedirect = () => {
  const { user, isAuthenticated } = useAuthStore()

  if (isAuthenticated) {
    if (user?.role === 'admin') {
      return <Navigate to="/admin" replace />
    }
    
    if (user?.role === 'delivery-boy') {
      return <Navigate to="/delivery/dashboard" replace />
    }
  }

  // For guest users or normal customers, show the premium Enterprise Landing Page
  return <LandingPage />
}

export default RoleBasedRedirect
