import { Outlet, Navigate } from 'react-router-dom'
import { Building2, ShieldCheck, Fingerprint, Banknote } from 'lucide-react'
import useAuthStore from '../../store/authStore'

const AuthLayout = () => {
  const { isAuthenticated } = useAuthStore()

  if (isAuthenticated) {
    return <Navigate to="/" replace />
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0a] flex selection:bg-primary-500/30 font-['Inter',system-ui,sans-serif] overflow-hidden">

      {/* ────────────────────────────────────────────────────────────────────────
       * LEFT COLUMN: BRAND & VALUE PROPOSITION (Enterprise Side)
       * ──────────────────────────────────────────────────────────────────────── */}
      <div className="hidden lg:flex w-1/2 bg-[#0a0a0a] dark:bg-[#111111] border-r border-gray-800 text-white flex-col justify-between p-12 relative overflow-hidden">

        {/* Subtle grid background pattern */}
        <div
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '32px 32px' }}
        />

        {/* Top Header */}
        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary-600 rounded-none flex items-center justify-center shadow-sm">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold tracking-tight text-white leading-tight">GramDairy</span>
              <span className="text-[10px] font-medium text-gray-400 uppercase tracking-widest">Fresh & Natural</span>
            </div>
          </div>
        </div>

        {/* Central Value Proposition */}
        <div className="relative z-10 max-w-lg mt-auto mb-auto">
          <h1 className="text-4xl xl:text-5xl font-bold tracking-tight mb-6 leading-tight">
            Fresh dairy products <br />
            <span className="text-primary-500">delivered daily.</span>
          </h1>
          <p className="text-gray-400 text-lg leading-relaxed mb-12">
            Welcome to GramDairy. Log in to manage your daily milk subscriptions, track your morning deliveries, and browse our catalog of fresh dairy essentials.
          </p>

          <div className="space-y-6">
            <div className="flex items-start gap-4 p-4 rounded-none bg-white/5 border border-white/10 backdrop-blur-sm">
              <div className="w-10 h-10 rounded-none bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 text-emerald-400 flex-shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold text-white text-sm">Safe & Secure</h3>
                <p className="text-xs text-gray-400 mt-1">Your transactions and personal data are always protected.</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 rounded-none bg-white/5 border border-white/10 backdrop-blur-sm">
              <div className="w-10 h-10 rounded-none bg-blue-500/10 flex items-center justify-center border border-blue-500/20 text-blue-400 flex-shrink-0">
                <Fingerprint className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold text-white text-sm">Verified Account</h3>
                <p className="text-xs text-gray-400 mt-1">Secure login ensures that only you can access your GramDairy profile.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Footer block */}
        <div className="relative z-10 flex items-center justify-between text-xs font-semibold text-gray-500">
          <span>&copy; {new Date().getFullYear()} GramDairy Inc.</span>
          <div className="flex gap-4">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
          </div>
        </div>
      </div>

      {/* ────────────────────────────────────────────────────────────────────────
       * RIGHT COLUMN: AUTHENTICATION FORM ENCLOSURE
       * ──────────────────────────────────────────────────────────────────────── */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 md:p-24 bg-white dark:bg-[#0a0a0a] overflow-y-auto">
        <div className="w-full max-w-md">
          {/* Mobile Logo (Only visible on small screens) */}
          <div className="flex lg:hidden items-center gap-3 mb-10">
            <div className="w-10 h-10 bg-primary-600 rounded-none flex items-center justify-center shadow-sm">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold tracking-tight text-gray-900 dark:text-white leading-tight">GramDairy</span>
              <span className="text-[10px] font-medium text-gray-500 uppercase tracking-widest">Fresh & Natural</span>
            </div>
          </div>

          <Outlet />

        </div>
      </div>
    </div>
  )
}

export default AuthLayout
