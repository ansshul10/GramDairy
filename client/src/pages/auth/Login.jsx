import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Link, useNavigate } from 'react-router-dom'
import { Mail, Lock, Eye, EyeOff, Loader2, AlertCircle, LogIn } from 'lucide-react'
import authService from '../../services/authService'
import useAuthStore from '../../store/authStore'
import { cn } from '../../lib/utils'

/* ─────────────────────────────────────────────────────────────────────────────
 * LOGIN PAGE
 * ───────────────────────────────────────────────────────────────────────────── */

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address.'),
  password: z.string().min(1, 'Password is required.'),
})

const Login = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')

  const { setUser } = useAuthStore()
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data) => {
    try {
      setError('')
      const response = await authService.login(data)
      const user = response.data.user
      setUser(user)
      handleNavigation(user)
    } catch (err) {
      if (err.response?.data?.data?.needsVerification) {
        navigate('/auth/verify-otp', { state: { email: data.email } })
      } else {
        setError(err.response?.data?.message || 'Login failed. Please check your email and password.')
      }
    }
  }

  const handleNavigation = (user) => {
    if (user.role === 'admin') {
      navigate('/admin')
    } else if (user.role === 'delivery-boy') {
      navigate('/delivery/dashboard')
    } else {
      navigate('/')
    }
  }

  return (
    <div className="w-full max-w-md mx-auto animate-in fade-in duration-700">

      {/* Login Header */}
      <div className="mb-12 border-b border-gray-100 dark:border-gray-800 pb-8">
        <div className="flex items-center gap-3 mb-4">
          <LogIn className="w-5 h-5 text-primary-600" />
          <span className="text-[10px] font-bold text-primary-600 uppercase tracking-[0.4em] italic">Login</span>
        </div>
        <h2 className="text-4xl font-bold tracking-tighter text-gray-900 dark:text-white leading-none">
          Welcome <span className="text-gray-400 font-medium">Back</span>
        </h2>
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-4 leading-relaxed">
          Please enter your email and password below
        </p>
      </div>

      {/* Login Form */}
      <div className="bg-white dark:bg-[#0a0a0a] border border-gray-900 dark:border-white shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-24 h-1 bg-primary-600" />

        {/* Error Message */}
        {error && (
          <div className="p-6 bg-red-500/10 border-b border-red-500/20 animate-in slide-in-from-top duration-300">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-4 h-4 text-red-600" />
              <span className="text-[9px] font-black text-red-600 uppercase tracking-widest italic">{error}</span>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="p-10 space-y-10">
          {/* Email Field */}
          <div className="space-y-3">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] flex items-center gap-2">
              <Mail className="w-3.5 h-3.5" /> Email Address
            </label>
            <div className="relative group">
              <input
                {...register('email')}
                type="email"
                className={cn(
                  "block w-full px-5 py-4 bg-gray-50/50 dark:bg-[#111111] border rounded-none text-gray-900 dark:text-white text-[11px] font-bold tracking-widest placeholder:text-gray-300 focus:outline-none focus:ring-1 focus:ring-primary-600 focus:border-primary-600 transition-all",
                  errors.email ? "border-red-500/50" : "border-gray-200 dark:border-gray-800"
                )}
                placeholder="your.email@example.com"
              />
            </div>
            {errors.email && <p className="text-[9px] font-bold text-red-600 uppercase italic">{errors.email.message}</p>}
          </div>

          {/* Password Field */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] flex items-center gap-2">
                <Lock className="w-3.5 h-3.5" /> Password
              </label>
              <Link
                to="/auth/forgot-password"
                className="text-[9px] font-bold text-primary-600 uppercase tracking-widest hover:text-primary-800 transition-colors"
              >
                Forgot Password?
              </Link>
            </div>
            <div className="relative group">
              <input
                {...register('password')}
                type={showPassword ? 'text' : 'password'}
                className={cn(
                  "block w-full px-5 py-4 bg-gray-50/50 dark:bg-[#111111] border rounded-none text-gray-900 dark:text-white text-[11px] font-bold tracking-widest placeholder:text-gray-300 focus:outline-none focus:ring-1 focus:ring-primary-600 focus:border-primary-600 transition-all",
                  errors.password ? "border-red-500/50" : "border-gray-200 dark:border-gray-800"
                )}
                placeholder="••••••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 px-5 flex items-center text-gray-400 hover:text-primary-600 transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors.password && <p className="text-[9px] font-bold text-red-600 uppercase italic">{errors.password.message}</p>}
          </div>

          {/* Login Button */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-4 bg-gray-900 dark:bg-white text-white dark:text-gray-900 py-5 px-4 rounded-none font-black text-[10px] uppercase tracking-[0.3em] shadow-xl hover:bg-gray-800 dark:hover:bg-gray-50 transition-all disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  <LogIn className="w-4 h-4" />
                  Sign In
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Register Link */}
      <div className="mt-12 text-center">
        <p className="text-[11px] font-bold text-gray-600 dark:text-gray-400 uppercase tracking-widest">
          New to GramDairy?{' '}
          <Link to="/auth/register" className="text-gray-900 dark:text-white font-black hover:underline underline-offset-8 decoration-2 decoration-primary-600">
            Create an Account
          </Link>
        </p>
      </div>
    </div>
  )
}

export default Login
