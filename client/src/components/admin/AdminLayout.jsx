import { useState } from 'react'
import { Link, useLocation, Outlet, useNavigate } from 'react-router-dom'
import {
  BarChart3,
  Package,
  Users,
  ShoppingCart,
  Settings,
  Tag,
  MessageSquare,
  Calendar,
  LogOut,
  ChevronLeft,
  LayoutDashboard,
  Menu,
  X,
  Bell,
  Truck,
  UserPlus,
  Sun,
  Moon,
  LifeBuoy,
  Building2,
  MapPin,
  Mail
} from 'lucide-react'
import useAuthStore from '../../store/authStore'
import { setCookie } from '../../lib/cookies'
import Button from '../ui/Button'

const AdminLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const { logout, user } = useAuthStore()
  const [isDarkMode, setIsDarkMode] = useState(document.documentElement.classList.contains('dark'))

  const toggleTheme = () => {
    const isDark = !isDarkMode;
    setIsDarkMode(isDark);
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    setCookie('theme', isDark ? 'dark' : 'light', 365);
  };

  const navItems = [
    { label: 'Dashboard', icon: LayoutDashboard, path: '/admin' },
    { label: 'Products', icon: Package, path: '/admin/products' },
    { label: 'Categories', icon: Tag, path: '/admin/categories' },
    { label: 'Orders', icon: ShoppingCart, path: '/admin/orders' },
    { label: 'Delivery Boys', icon: Truck, path: '/admin/delivery-boys' },
    { label: 'New Joiners', icon: UserPlus, path: '/admin/delivery-applications' },
    { label: 'New Partners', icon: Building2, path: '/admin/vendor-applications' },
    { label: 'Subscriptions', icon: Calendar, path: '/admin/subscriptions' },
    { label: 'Billing', icon: BarChart3, path: '/admin/billing' },
    { label: 'Coupons', icon: Tag, path: '/admin/coupons' },
    { label: 'Reviews', icon: MessageSquare, path: '/admin/reviews' },
    { label: 'Users', icon: Users, path: '/admin/users' },
    { label: 'Newsletter', icon: Mail, path: '/admin/newsletter' },
    { label: 'Support', icon: LifeBuoy, path: '/admin/support' },
    { label: 'Live Chat', icon: MessageSquare, path: '/admin/live-chat' },
    { label: 'Stores Map', icon: MapPin, path: '/admin/stores' },
    { label: 'Settings', icon: Settings, path: '/admin/settings' },
  ]

  const handleLogout = async () => {
    await logout()
    navigate('/auth/login')
  }

  const isActive = (path) => location.pathname === path

  return (
    <div className="min-h-screen bg-white dark:bg-[#0a0a0a] flex selection:bg-primary-500/20">
      {/* Sidebar - Desktop */}
      <aside
        className={`fixed top-0 left-0 h-full bg-white dark:bg-[#0a0a0a] border-r border-gray-100 dark:border-gray-800 transition-all duration-300 z-50 hidden md:block ${isSidebarOpen ? 'w-64' : 'w-20'
          }`}
      >
        <div className="h-20 flex items-center justify-between px-6 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-[#0c0c0c]">
          {isSidebarOpen ? (
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary-600 rounded-none flex items-center justify-center text-white font-black shadow-lg">G</div>
              <span className="font-black text-gray-900 dark:text-white uppercase tracking-tighter">Admin Portal</span>
            </Link>
          ) : (
            <div className="w-8 h-8 bg-primary-600 rounded-none flex items-center justify-center text-white font-black mx-auto shadow-lg">G</div>
          )}
        </div>

        <nav className="p-4 space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 p-3 rounded-none transition-all relative group ${isActive(item.path)
                  ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 shadow-xl'
                  : 'text-gray-500 hover:bg-gray-50 dark:hover:bg-[#111111]'
                }`}
            >
              {isActive(item.path) && <div className="absolute left-0 top-0 w-1 h-full bg-primary-600" />}
              <item.icon className="w-4 h-4 flex-shrink-0" />
              {isSidebarOpen && <span className="font-bold text-[11px] uppercase tracking-wider">{item.label}</span>}
            </Link>
          ))}
        </nav>

        <div className="absolute bottom-0 left-0 w-full p-4 border-t border-gray-100 dark:border-gray-800">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 p-3 rounded-none text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 transition-all"
          >
            <LogOut className="w-4 h-4 flex-shrink-0" />
            {isSidebarOpen && <span className="font-bold text-[11px] uppercase tracking-wider">Sign Out</span>}
          </button>
        </div>

        {/* Sidebar Toggle */}
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="absolute top-24 -right-3 w-6 h-6 bg-white dark:bg-[#0a0a0a] border border-gray-100 dark:border-gray-800 rounded-none flex items-center justify-center shadow-lg text-gray-400 hover:text-primary-600 transition-colors z-50"
        >
          <ChevronLeft className={`w-3 h-3 transition-transform ${isSidebarOpen ? '' : 'rotate-180'}`} />
        </button>
      </aside>

      {/* Main Content */}
      <main className={`flex-1 transition-all duration-300 relative ${isSidebarOpen ? 'md:ml-64' : 'md:ml-20'}`}>
        {/* Architectural Structural Grid Overlay */}
        <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] pointer-events-none z-0"
          style={{ backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)', backgroundSize: '60px 60px' }}
        />

        {/* Header */}
        <header className="h-20 bg-white dark:bg-[#0a0a0a] border-b border-gray-200 dark:border-gray-800 flex items-center justify-between px-4 sm:px-8 sticky top-0 z-40">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="md:hidden p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-none transition-all"
            >
              <Menu className="w-6 h-6" />
            </button>
            <h2 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tighter italic">
              {location.pathname.split('/').pop() || 'Overview'}
            </h2>
          </div>

          <div className="flex items-center gap-4">
            {/* Theme Toggle Interface */}
            <button
              onClick={toggleTheme}
              className="p-2 border border-gray-200 dark:border-gray-800 rounded-none bg-gray-50 dark:bg-[#0a0a0a] text-gray-600 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-700 transition-colors"
              aria-label="Toggle Dark Mode"
            >
              {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-none transition-all text-gray-400">
              <Bell className="w-5 h-5" />
            </button>
            <div className="w-10 h-10 rounded-none bg-gray-50 dark:bg-[#111111] border border-gray-200 dark:border-gray-800 flex items-center justify-center text-gray-900 dark:text-white font-black text-sm">
              {user?.name?.[0]}
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="p-6 sm:p-10 relative z-10">
          <Outlet />
        </div>
      </main>

      {/* Mobile Menu Sidebar */}
      {isMobileMenuOpen && (
        <>
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] md:hidden" onClick={() => setIsMobileMenuOpen(false)} />
          <aside className="fixed top-0 left-0 h-full w-72 bg-white dark:bg-[#0a0a0a] z-[110] animate-in slide-in-from-left duration-500 border-r border-gray-100 dark:border-gray-800 flex flex-col">
            <div className="h-20 flex items-center justify-between px-6 border-b border-gray-100 dark:border-gray-800">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-primary-600 rounded-none flex items-center justify-center text-white font-black shadow-lg">G</div>
                <span className="font-black text-gray-900 dark:text-white uppercase tracking-tighter">Admin Panel</span>
              </div>
              <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-none">
                <X className="w-6 h-6" />
              </button>
            </div>

            <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center gap-3 p-4 rounded-none transition-all ${isActive(item.path)
                      ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900'
                      : 'text-gray-500 hover:bg-gray-50 dark:hover:bg-[#111111]'
                    }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="font-bold text-xs uppercase tracking-widest">{item.label}</span>
                </Link>
              ))}
            </nav>

            <div className="p-4 border-t border-gray-100 dark:border-gray-800">
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 p-4 rounded-none text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 transition-all font-bold uppercase text-[10px] tracking-widest"
              >
                <LogOut className="w-5 h-5" />
                Sign Out
              </button>
            </div>
          </aside>
        </>
      )}
    </div>
  )
}

export default AdminLayout
