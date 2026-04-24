import { Routes, Route, useLocation } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import settingService from './services/settingService'
import MaintenancePage from './pages/common/MaintenancePage'
import MainLayout from './components/layout/MainLayout'
import AuthLayout from './components/layout/AuthLayout'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import VerifyOtp from './pages/auth/VerifyOtp'
import ForgotPassword from './pages/auth/ForgotPassword'
import ResetPassword from './pages/auth/ResetPassword'
import ProtectedRoute from './components/auth/ProtectedRoute'

import ProductList from './pages/products/ProductList'
import ProductDetail from './pages/products/ProductDetail'
import Checkout from './pages/orders/Checkout'
import OrderSuccess from './pages/orders/OrderSuccess'
import MyOrders from './pages/orders/MyOrders'
import OrderDetail from './pages/orders/OrderDetail'
import MySubscriptions from './pages/subscriptions/MySubscriptions'
import Profile from './pages/profile/Profile'
import UserBilling from './pages/billing/UserBilling'
import AddressBook from './pages/profile/AddressBook'
import NotificationsPage from './pages/notifications/NotificationsPage'
import CattleDetail from './pages/cattle/CattleDetail'
import DeliveryDashboard from './pages/delivery/DeliveryDashboard'
import DeliveryApplyPage from './pages/delivery/DeliveryApplyPage'
import AdminProductList from './pages/admin/AdminProductList'
import AdminAddProduct from './pages/admin/AdminAddProduct'
import AdminEditProduct from './pages/admin/AdminEditProduct'
import AdminCategoryList from './pages/admin/AdminCategoryList'
import AdminOrderList from './pages/admin/AdminOrderList'
import AdminDeliveryBoys from './pages/admin/AdminDeliveryBoys'
import AdminDeliveryApplications from './pages/admin/AdminDeliveryApplications'
import AdminSubscriptionList from './pages/admin/AdminSubscriptionList'
import AdminReviewList from './pages/admin/AdminReviewList'
import AdminUserList from './pages/admin/AdminUserList'
import AdminCouponList from './pages/admin/AdminCouponList'
import AdminVendorApplications from './pages/admin/AdminVendorApplications'
import AdminNewsletter from './pages/admin/AdminNewsletter'
import AdminLayout from './components/admin/AdminLayout'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminSettings from './pages/admin/AdminSettings'
import AdminBillingDashboard from './pages/admin/AdminBillingDashboard'
import AdminSupportTickets from './pages/admin/AdminSupportTickets'
import AdminStoreLocator from './pages/admin/AdminStoreLocator'
import SupportCenter from './pages/common/SupportCenter'
import StoreLocator from './pages/public/StoreLocator'
import ReferAndEarn from './pages/common/ReferAndEarn'
import TrackTicket from './pages/common/TrackTicket'
import DeliveryBoyVerify from './pages/verify/DeliveryBoyVerify'
import RoleBasedRedirect from './components/auth/RoleBasedRedirect'
import { useRegisterSW } from 'virtual:pwa-register/react'
import PublicProfile from './pages/public/PublicProfile'
import SystemStatus from './pages/public/SystemStatus'
import TrustPolicy from './pages/public/TrustPolicy'
import OurStory from './pages/public/OurStory'
import OurFarm from './pages/public/OurFarm'
import WorkWithUs from './pages/public/WorkWithUs'
import VendorApplyPage from './pages/public/VendorApplyPage'
import VendorDashboard from './pages/vendor/VendorDashboard'
import Unsubscribe from './pages/public/Unsubscribe'
import NotFound from './pages/common/NotFound'
import ErrorBoundary from './components/common/ErrorBoundary'
import GramDairyWallet from './pages/wallet/GramDairyWallet'
import CartDrawer from './components/cart/CartDrawer'
import { Toaster } from 'react-hot-toast'
import { useEffect } from 'react'
import useAuthStore from './store/authStore'
import authService from './services/authService'

function App() {
  // PWA Service Worker registration
  useRegisterSW({
    onRegistered(r) {
      console.log('SW Registered: ' + r)
    },
    onRegisterError(error) {
      console.log('SW registration error', error)
    }
  })

  const { setUser, logout } = useAuthStore()

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await authService.getMe()
        if (response.success) {
          setUser(response.data.user)
        }
      } catch (error) {
        console.error('Session restoration failed:', error.message)
        logout()
      }
    }

    checkAuth()
  }, [setUser, logout])

  const location = useLocation()

  // Fetch settings globally
  const { data: settingsResponse } = useQuery({
    queryKey: ['settings'],
    queryFn: () => settingService.getSettings(),
    staleTime: 1000 * 60 * 5, // Cache for 5 mins to prevent heavy loads
    refetchInterval: 1000 * 60, // Check for maintenance silently every minute
  })

  const settings = settingsResponse?.data || {}
  const isMaintenanceMode = settings.maintenanceMode === true

  // Protect all non-admin routes if maintenance is on
  // We exclude /admin so admins can still log in and turn it off
  const isAdminRoute = location.pathname.startsWith('/admin') || location.pathname.startsWith('/auth')
  if (isMaintenanceMode && !isAdminRoute) {
    return <MaintenancePage supportEmail={settings.supportEmail} />
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen">
      <Routes>
        {/* Public Routes with MainLayout */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<RoleBasedRedirect />} />
          <Route path="/products" element={<ProductList />} />
          <Route path="/products/:slug" element={<ProductDetail />} />
          <Route path="/notifications" element={<NotificationsPage />} />
          <Route 
            path="/checkout" 
            element={
              <ProtectedRoute>
                <Checkout />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/orders/success/:id" 
            element={
              <ProtectedRoute>
                <OrderSuccess />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/orders/myorders" 
            element={
              <ProtectedRoute>
                <MyOrders />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/orders/:id" 
            element={
              <ProtectedRoute>
                <OrderDetail />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/subscriptions" 
            element={
              <ProtectedRoute>
                <MySubscriptions />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/wallet" 
            element={
              <ProtectedRoute>
                <GramDairyWallet />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="refer-and-earn" 
            element={
              <ProtectedRoute>
                <ReferAndEarn />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/profile" 
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/billing" 
            element={
              <ProtectedRoute>
                <UserBilling />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/addresses" 
            element={
              <ProtectedRoute>
                <AddressBook />
              </ProtectedRoute>
            } 
          />
          <Route path="/cattle/:id" element={<CattleDetail />} />
          <Route path="/delivery/apply" element={<DeliveryApplyPage />} />
          <Route path="/verify/delivery-boy/:id" element={<DeliveryBoyVerify />} />
          <Route path="/public/profile/:id" element={<PublicProfile />} />
          <Route 
            path="/delivery/dashboard" 
            element={
              <ProtectedRoute allowedRoles={['delivery-boy', 'admin']}>
                <DeliveryDashboard />
              </ProtectedRoute>
            } 
          />
          <Route path="/support" element={<SupportCenter />} />
          <Route path="/support/track" element={<TrackTicket />} />
          <Route path="/system-status" element={<SystemStatus />} />
          <Route path="/store-locator" element={<StoreLocator />} />
          <Route path="/privacy-policy" element={<TrustPolicy />} />
          <Route path="/our-story" element={<OurStory />} />
          <Route path="/our-farm" element={<OurFarm />} />
          <Route path="/work-with-us" element={<WorkWithUs />} />
          <Route path="/vendor/apply" element={<VendorApplyPage />} />
          <Route path="/unsubscribe" element={<Unsubscribe />} />
          <Route 
            path="/vendor/dashboard" 
            element={
              <ProtectedRoute allowedRoles={['vendor', 'admin']}>
                <VendorDashboard />
              </ProtectedRoute>
            } 
          />
        </Route>

        {/* Auth Routes */}
        <Route path="/auth" element={<AuthLayout />}>
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="verify-otp" element={<VerifyOtp />} />
          <Route path="forgot-password" element={<ForgotPassword />} />
          <Route path="reset-password" element={<ResetPassword />} />
        </Route>

        {/* Admin Routes (Protected) */}
        <Route 
          path="/admin" 
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="products" element={<AdminProductList />} />
          <Route path="products/add" element={<AdminAddProduct />} />
          <Route path="products/edit/:id" element={<AdminEditProduct />} />
          <Route path="categories" element={<AdminCategoryList />} />
          <Route path="orders" element={<AdminOrderList />} />
          <Route path="orders/:id" element={<OrderDetail />} />
          <Route path="delivery-boys" element={<AdminDeliveryBoys />} />
          <Route path="delivery-applications" element={<AdminDeliveryApplications />} />
          <Route path="subscriptions" element={<AdminSubscriptionList />} />
          <Route path="reviews" element={<AdminReviewList />} />
          <Route path="users" element={<AdminUserList />} />
          <Route path="coupons" element={<AdminCouponList />} />
          <Route path="billing" element={<AdminBillingDashboard />} />
          <Route path="vendor-applications" element={<AdminVendorApplications />} />
          <Route path="support" element={<AdminSupportTickets />} />
          <Route path="stores" element={<AdminStoreLocator />} />
          <Route path="newsletter" element={<AdminNewsletter />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>
        
        {/* 404 Page */}
        <Route path="*" element={<NotFound />} />
      </Routes>
      <CartDrawer />
      <Toaster position="top-center" reverseOrder={false} />
      </div>
    </ErrorBoundary>
  )
}

export default App
