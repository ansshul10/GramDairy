import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import {
  Building2,
  Menu,
  X,
  Sun,
  Moon,
  Bell,
  ShoppingCart,
  ChevronDown,
  LogOut,
  User,
  Package,
  CalendarDays,
  MapPin,
  Settings,
  ShieldCheck,
  Truck,
  Box,
  BarChart3,
  LifeBuoy,
  ArrowRight,
  LayoutDashboard,
  AlertCircle,
  Wallet,
} from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import settingService from '../../services/settingService'
import useAuthStore from '../../store/authStore'
import useCartStore from '../../store/cartStore'
import NotificationBell from '../notifications/NotificationBell'
import { useSocket } from '../../hooks/useSocket'
import { getCookie, setCookie } from '../../lib/cookies'

/* ─────────────────────────────────────────────────────────────────────────────
 * HEADER COMPONENT
 * A professional, high-density navigation header for GramDairy.
 * ───────────────────────────────────────────────────────────────────────────── */

/**
 * Full Shop Menu for Desktop Browsing
 */
const DesktopMegaMenu = ({ isOpen }) => {
  if (!isOpen) return null;

  return (
    <div className="absolute top-full left-1/2 -translate-x-1/2 w-[1000px] bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-gray-800 shadow-[0_30px_100px_rgba(0,0,0,0.2)] dark:shadow-[0_30px_100px_rgba(0,0,0,0.5)] z-50 animate-in slide-in-from-top-4 duration-500">
      <div className="p-16 grid grid-cols-4 gap-16">
        {/* Core Products Category */}
        <div>
          <h3 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-6 flex items-center gap-2">
            <Box className="w-4 h-4 text-primary-600" /> Shop Products
          </h3>
          <ul className="space-y-4">
            <li>
              <Link to="/products?category=milk" className="group flex flex-col">
                <span className="text-sm font-semibold text-gray-900 dark:text-gray-100 group-hover:text-primary-600 transition-colors">Fresh Milk</span>
                <span className="text-xs text-gray-500 mt-0.5">Pure Cow & Buffalo Milk</span>
              </Link>
            </li>
            <li>
              <Link to="/products?category=ghee" className="group flex flex-col">
                <span className="text-sm font-semibold text-gray-900 dark:text-gray-100 group-hover:text-primary-600 transition-colors">Clarified Butter (Ghee)</span>
                <span className="text-xs text-gray-500 mt-0.5">Traditional Bilona Processed</span>
              </Link>
            </li>
            <li>
              <Link to="/products?category=paneer" className="group flex flex-col">
                <span className="text-sm font-semibold text-gray-900 dark:text-gray-100 group-hover:text-primary-600 transition-colors">Cottage Cheese</span>
                <span className="text-xs text-gray-500 mt-0.5">High-protein dietary products</span>
              </Link>
            </li>
          </ul>
        </div>

        {/* Subscription Models */}
        <div>
          <h3 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-6 flex items-center gap-2">
            <CalendarDays className="w-4 h-4 text-primary-600" /> Daily Subscriptions
          </h3>
          <ul className="space-y-4">
            <li>
              <Link to="/subscriptions" className="group flex flex-col">
                <span className="text-sm font-semibold text-gray-900 dark:text-gray-100 group-hover:text-primary-600 transition-colors">Daily Milk Plans</span>
                <span className="text-xs text-gray-500 mt-0.5">Set your recurring delivery</span>
              </Link>
            </li>
            <li>
              <Link to="/subscriptions/manage" className="group flex flex-col">
                <span className="text-sm font-semibold text-gray-900 dark:text-gray-100 group-hover:text-primary-600 transition-colors">Manage Subscriptions</span>
                <span className="text-xs text-gray-500 mt-0.5">Pause or change your plans</span>
              </Link>
            </li>
          </ul>
        </div>

        {/* Work With Us */}
        <div className="col-span-2 bg-gray-50 dark:bg-[#0d0d0d] border border-gray-200 dark:border-gray-800 rounded-none p-8 flex flex-col justify-center">
          <h3 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-4 flex items-center gap-2">
            <Truck className="w-4 h-4 text-primary-600" /> Partner With Us
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-8 leading-relaxed max-w-sm">
            Join the GramDairy team as a delivery partner. We offer competitive earnings and flexible schedules with real-time tracking.
          </p>
          <Link to="/delivery/apply" className="inline-flex items-center justify-center bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-6 py-3 text-[10px] font-black uppercase tracking-widest rounded-none shadow-xl hover:opacity-90 transition-all w-fit">
            Become a Delivery Partner
          </Link>
        </div>
      </div>
    </div>
  );
};

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCatalogMenuOpen, setIsCatalogMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(document.documentElement.classList.contains('dark'));

  const { user, isAuthenticated, logout } = useAuthStore();
  const { getItemCount, openCart } = useCartStore();
  const navigate = useNavigate();
  const location = useLocation();

  const { isConnected } = useSocket(); // Keeps you connected to the store

  const { data: settingsResponse } = useQuery({
    queryKey: ['settings'],
    queryFn: () => settingService.getSettings(),
  });

  const isStoreOnlineSetting = settingsResponse?.data?.isStoreOnline ?? true;
  const isFullyOnline = isConnected && isStoreOnlineSetting;

  /* ──────────────────────────────────────────────────────────────────────────
   * EFFECTS & HANDLERS
   * ────────────────────────────────────────────────────────────────────────── */

  // Close menus on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsCatalogMenuOpen(false);
    setIsProfileMenuOpen(false);
  }, [location.pathname]);

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

  const handleLogoutSequence = async () => {
    await logout();
    navigate('/auth/login');
  };

  const determineHomepageRoute = () => {
    if (!user) return '/';
    switch (user.role) {
      case 'admin': return '/admin';
      case 'delivery-boy': return '/delivery/dashboard';
      case 'vendor': return '/vendor/dashboard';
      default: return '/';
    }
  };

  const isInternalPersonnel = user?.role === 'admin' || user?.role === 'delivery-boy' || user?.role === 'vendor';

  /* ──────────────────────────────────────────────────────────────────────────
   * RENDER BLOCKS
   * ────────────────────────────────────────────────────────────────────────── */

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-[#0a0a0a] border-b border-gray-200 dark:border-gray-800 pt-safe">

        {/* TOP HELP BAR */}
        <div className="flex w-full bg-gray-900 dark:bg-black text-gray-300 py-1.5 px-3 sm:px-6 items-center justify-between border-b border-gray-800 overflow-x-auto scrollbar-hide">
          <div className="flex items-center gap-3 sm:gap-6 text-[9px] sm:text-xs font-semibold tracking-wide shrink-0">
            <Link to="/support" className="flex items-center gap-1.5 hover:text-white transition-colors cursor-pointer"><LifeBuoy className="w-3 h-3 sm:w-3.5 sm:h-3.5" /> Help & Support</Link>
            <Link to="/store-locator" className="flex items-center gap-1.5 hover:text-white transition-colors cursor-pointer"><MapPin className="w-3 h-3 sm:w-3.5 sm:h-3.5" /> Store Locator</Link>
          </div>
          <div className="flex items-center gap-2 sm:gap-4 text-[9px] sm:text-xs font-semibold tracking-wide shrink-0 ml-4">
            <span className="text-gray-500 uppercase hidden sm:inline">Status:</span>
            {isFullyOnline ? (
              <span className="text-emerald-400 flex items-center gap-1.5 flex-row">
                <span className="relative flex h-1.5 w-1.5 sm:h-2 sm:w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 sm:h-2 sm:w-2 bg-emerald-500"></span>
                </span>
                Online
              </span>
            ) : (
              <span className="text-red-400 flex items-center gap-1.5 flex-row">
                <AlertCircle className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                Offline
              </span>
            )}
          </div>
        </div>

        {/* PRIMARY NAVIGATION BAR */}
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 h-16 lg:h-20 flex items-center justify-between relative bg-white dark:bg-[#0a0a0a]">

          {/* Logo / Home Routing */}
          <Link to={determineHomepageRoute()} className="flex items-center gap-3 shrink-0 group">
            <div className="w-9 h-9 lg:w-11 lg:h-11 bg-primary-600 rounded-none flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform duration-500">
              <Building2 className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg lg:text-xl font-black tracking-tighter text-gray-900 dark:text-white leading-tight">Dairy</span>
              <span className="text-[9px] lg:text-[10px] font-bold text-gray-500 uppercase tracking-widest hidden sm:block">Pure Dairy Delivery</span>
            </div>
          </Link>

          {/* DESKTOP NAV: General Public Access */}
          {!isInternalPersonnel && (
            <div className="hidden lg:flex items-center gap-8 absolute left-1/2 -translate-x-1/2">
              <button
                onMouseEnter={() => setIsCatalogMenuOpen(true)}
                onMouseLeave={() => setIsCatalogMenuOpen(false)}
                className="flex items-center gap-1.5 text-sm font-semibold text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-500 h-20"
              >
                Our Shop <ChevronDown className="w-4 h-4 opacity-50" />
                <DesktopMegaMenu isOpen={isCatalogMenuOpen} />
              </button>

              <Link to="/subscriptions" className="text-sm font-semibold text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-500 transition-colors">
                Milk Subscriptions
              </Link>

              <Link to="/delivery/apply" className="text-sm font-semibold text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-500 transition-colors">
                Become a Partner
              </Link>
            </div>
          )}

          {/* DESKTOP NAV: Internal Personnel Access */}
          {isInternalPersonnel && (
            <div className="hidden lg:flex items-center gap-8 absolute left-1/2 -translate-x-1/2 text-sm font-bold tracking-widest uppercase">
              {user.role === 'admin' && (
                <span className="flex items-center gap-2 text-primary-600 dark:text-primary-500 bg-primary-50 dark:bg-primary-900/10 px-4 py-2 rounded-none">
                  Admin Dashboard
                </span>
              )}
              {user.role === 'delivery-boy' && (
                <span className="flex items-center gap-2 text-blue-600 dark:text-blue-500 bg-blue-50 dark:bg-blue-900/10 px-4 py-2 rounded-none">
                  <Truck className="w-4 h-4" /> Delivery Dashboard
                </span>
              )}
              {user.role === 'vendor' && (
                <span className="flex items-center gap-2 text-emerald-600 dark:text-emerald-500 bg-emerald-50 dark:bg-emerald-900/10 px-4 py-2 rounded-none">
                  <ShieldCheck className="w-4 h-4" /> Vendor Dashboard
                </span>
              )}
            </div>
          )}

          {/* UTILITY & ACTION ROW */}
          <div className="flex items-center gap-3 lg:gap-5 shrink-0 h-full">

            {/* Dark Mode Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 border border-gray-200 dark:border-gray-800 rounded-none bg-gray-50 dark:bg-[#0a0a0a] text-gray-600 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-700 transition-colors"
              aria-label="Toggle Dark Mode"
            >
              {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Notifications */}
            {isAuthenticated && (
              <div className="hidden sm:block">
                <NotificationBell />
              </div>
            )}

            {/* Shopping Cart */}
            {!isInternalPersonnel && (
              <button
                onClick={openCart}
                className="relative p-2 border border-gray-200 dark:border-gray-800 rounded-none bg-gray-50 dark:bg-[#0a0a0a] text-gray-600 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-700 transition-colors flex items-center justify-center"
              >
                <ShoppingCart className="w-4 h-4" />
                {getItemCount() > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-primary-600 text-white text-[10px] font-bold flex items-center justify-center rounded-none shadow-sm ring-2 ring-white dark:ring-[#0a0a0a]">
                    {getItemCount()}
                  </span>
                )}
              </button>
            )}

            {/* Profile Dropdown Logic */}
            {isAuthenticated ? (
              <div className="relative h-full flex items-center">
                <button
                  onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                  onBlur={() => setTimeout(() => setIsProfileMenuOpen(false), 200)}
                  className="flex items-center gap-3 pl-3 pr-1.5 py-1.5 border border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 rounded-none bg-gray-50 dark:bg-[#0a0a0a] transition-colors"
                >
                  <div className="flex flex-col items-end hidden sm:flex">
                    <span className="text-xs font-bold text-gray-900 dark:text-gray-100 uppercase tracking-wider">{user.name.split(' ')[0]}</span>
                    <span className="text-[9px] font-semibold text-gray-500 uppercase tracking-widest">{user.role}</span>
                  </div>
                  <div className="w-7 h-7 bg-gray-200 dark:bg-gray-800 text-gray-600 dark:text-gray-400 font-bold rounded-none flex items-center justify-center text-xs">
                    {user.name[0]}
                  </div>
                </button>

                {/* Account Menu */}
                {isProfileMenuOpen && (
                  <div className="absolute right-0 top-[85%] w-64 bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-gray-800 rounded-none shadow-2xl py-2 z-[60] animate-in slide-in-from-top-1 duration-200">
                    <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-[#0a0a0a] mb-2">
                      <p className="text-sm font-bold text-gray-900 dark:text-white truncate">{user.name}</p>
                      <p className="text-xs font-medium text-gray-500 truncate mt-0.5">{user.email}</p>
                    </div>

                    <Link to="/profile" className="flex items-center gap-3 px-4 py-2.5 text-sm font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors">
                      <User className="w-4 h-4 text-gray-400" /> My Profile
                    </Link>

                    <Link to="/notifications" className="flex items-center gap-3 px-4 py-2.5 text-sm font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors">
                      <Bell className="w-4 h-4 text-gray-400" /> My Notifications
                    </Link>


                    {!isInternalPersonnel && (
                      <>
                        <Link to="/orders/myorders" className="flex items-center gap-3 px-4 py-2.5 text-sm font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors">
                          <Package className="w-4 h-4 text-gray-400" /> My Orders
                        </Link>
                        <Link to="/subscriptions" className="flex items-center gap-3 px-4 py-2.5 text-sm font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors">
                          <CalendarDays className="w-4 h-4 text-gray-400" /> My Subscriptions
                        </Link>
                        <Link to="/addresses" className="flex items-center gap-3 px-4 py-2.5 text-sm font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors">
                          <MapPin className="w-4 h-4 text-gray-400" /> My Addresses
                        </Link>
                        <Link to="/wallet" className="flex items-center gap-3 px-4 py-2.5 text-sm font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors">
                          <Wallet className="w-4 h-4 text-gray-400" /> My Wallet
                        </Link>
                      </>
                    )}

                    {user.role === 'admin' && (
                      <>
                        <div className="h-px bg-gray-100 dark:bg-gray-800 my-2" />
                        <Link to="/admin" className="flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/10 transition-colors">
                          <Settings className="w-4 h-4" /> Admin Settings
                        </Link>
                      </>
                    )}

                    {user.role === 'vendor' && (
                      <>
                        <div className="h-px bg-gray-100 dark:bg-gray-800 my-2" />
                        <Link to="/vendor/dashboard" className="flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/10 transition-colors">
                          <LayoutDashboard className="w-4 h-4" /> Vendor Dashboard
                        </Link>
                      </>
                    )}

                    <div className="h-px bg-gray-100 dark:bg-gray-800 my-2" />
                    <button
                      onClick={handleLogoutSequence}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors text-left"
                    >
                      <LogOut className="w-4 h-4" /> Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/auth/login" className="hidden sm:flex items-center justify-center bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-6 py-2.5 text-[10px] font-black uppercase tracking-widest rounded-none shadow-xl hover:opacity-90 transition-all">
                Login
              </Link>
            )}

            {/* Mobile Nav Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 border border-gray-200 dark:border-gray-800 rounded-none bg-gray-50 dark:bg-[#0a0a0a] text-gray-600 dark:text-gray-400 transition-colors"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </nav>

        {/* MOBILE NAVIGATION PORTAL */}
        {isMobileMenuOpen && (
          <div className="lg:hidden absolute top-full left-0 w-full bg-white dark:bg-[#0a0a0a] border-b border-gray-200 dark:border-gray-800 shadow-2xl pb-6">
            {!isInternalPersonnel ? (
              <div className="flex flex-col">
                <div className="px-6 py-4 bg-gray-50 dark:bg-[#111111] border-b border-gray-200 dark:border-gray-800 text-xs font-bold uppercase tracking-widest text-gray-500">
                  Main Menu
                </div>
                <Link to="/" className="px-6 py-4 font-semibold text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
                  Home
                </Link>
                <Link to="/products" className="px-6 py-4 font-semibold text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
                  Shop Products
                </Link>
                <Link to="/subscriptions" className="px-6 py-4 font-semibold text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
                  Subscriptions
                </Link>
                <Link to="/delivery/apply" className="px-6 py-4 font-bold text-primary-600 border-b border-gray-100 dark:border-gray-100 flex items-center justify-between">
                  Become a Delivery Partner <ArrowRight className="w-4 h-4" />
                </Link>
                {!isAuthenticated && (
                  <div className="px-6 pt-6">
                    <Link to="/auth/login" className="flex items-center justify-center w-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-5 py-3 text-[10px] font-black uppercase tracking-widest rounded-none shadow-xl">
                      Sign In
                    </Link>
                  </div>
                )}
              </div>
            ) : (
              <div className="p-6">
                <div className="bg-primary-50 dark:bg-primary-900/10 border border-primary-200 dark:border-primary-800/50 rounded-none p-5">
                  <h3 className="text-sm font-bold text-primary-600 dark:text-primary-500 uppercase tracking-widest mb-2 flex items-center gap-2">
                    {user.role.replace('-', ' ')} Access
                  </h3>
                  <p className="text-xs font-medium text-gray-600 dark:text-gray-400 leading-relaxed">
                    You are logged in as a {user.role.replace('-', ' ')}. You have access to specialized dashboards for your work.
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </header>

      <div className="h-[calc(76px+var(--sat,0px))] lg:h-[calc(104px+var(--sat,0px))] w-full" aria-hidden="true" />
    </>
  )
}
