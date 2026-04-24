import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Link, useNavigate } from 'react-router-dom'
import { User, Mail, Lock, Phone, Eye, EyeOff, Loader2, ShieldAlert, UserPlus, Info, Fingerprint, Terminal, Activity, ShieldCheck, Database, Zap } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import authService from '../../services/authService'
import settingService from '../../services/settingService'
import { cn } from '../../lib/utils'

/* ─────────────────────────────────────────────────────────────────────────────
 * REGISTER PAGE
 * A simple interface for user registration.
 * ───────────────────────────────────────────────────────────────────────────── */

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters.'),
  email: z.string().email('Please enter a valid email address.'),
  password: z.string().min(6, 'Password must be at least 6 characters.'),
  phoneNumber: z.string().regex(/^[6-9]\d{9}$/, 'Please enter a valid 10-digit phone number.'),
  appliedReferralCode: z.string().optional(),
})

const Register = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(registerSchema),
  })

  // Check if we are allowing new accounts right now
  const { data: settingsResponse, isLoading: isSettingsLoading } = useQuery({
    queryKey: ['settings'],
    queryFn: () => settingService.getSettings(),
  })

  const isRegistrationEnabled = settingsResponse?.data?.enableRegistration !== false

  const onSubmit = async (data) => {
    try {
      setError('')
      await authService.register(data)
      navigate('/auth/verify-otp', { state: { email: data.email } })
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.')
    }
  }

  return (
    <div className="w-full max-w-lg mx-auto animate-in fade-in duration-700">
      
      {/* Register Header */}
      <div className="mb-12 border-b border-gray-100 dark:border-gray-800 pb-8">
        <div className="flex items-center gap-3 mb-4">
             <UserPlus className="w-5 h-5 text-primary-600" />
             <span className="text-[10px] font-bold text-primary-600 uppercase tracking-[0.4em] italic">Join GramDairy</span>
        </div>
        <h3 className="text-4xl font-bold tracking-tighter text-gray-900 dark:text-white leading-none">
          Create <span className="text-gray-400 font-medium">Account</span>
        </h3>
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-4 leading-relaxed">
          {isRegistrationEnabled ? 'Register below to get started' : 'Registration is currently closed'}
        </p>
      </div>

      {/* Register Form */}
      <div className="bg-white dark:bg-[#0a0a0a] border border-gray-900 dark:border-white shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-1 bg-primary-600" />
        
        {/* Error Sequence Bar */}
        {error && (
            <div className="p-6 bg-red-500/10 border-b border-red-500/20 animate-in slide-in-from-top duration-300">
                <div className="flex items-center gap-3">
                    <ShieldAlert className="w-4 h-4 text-red-600" />
                    <span className="text-[9px] font-black text-red-600 uppercase tracking-widest italic">{error}</span>
                </div>
            </div>
        )}

        {/* Form Content */}
        {isSettingsLoading ? (
            <div className="p-20 flex flex-col items-center justify-center opacity-30">
                <Loader2 className="w-8 h-8 animate-spin" />
                <p className="text-[10px] font-bold uppercase tracking-[0.3em] mt-4">Loading...</p>
            </div>
        ) : !isRegistrationEnabled ? (
            <div className="p-12 space-y-8 bg-amber-500/5">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 border border-amber-500/20 bg-amber-500/10 flex items-center justify-center text-amber-600">
                        <ShieldAlert className="w-6 h-6" />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white uppercase tracking-tight italic leading-none">Registration Closed</h3>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-2">We are currently not accepting new registrations.</p>
                    </div>
                </div>
                <p className="text-[11px] font-bold text-gray-600 dark:text-gray-400 leading-relaxed uppercase italic">
                    Public registration is temporarily suspended. Please contact our support team if you believe this is an error.
                </p>
                <div className="pt-4">
                    <Link to="/auth/login" className="w-full inline-flex items-center justify-center py-4 border border-gray-200 dark:border-gray-800 text-[10px] font-bold uppercase tracking-widest hover:bg-white dark:hover:bg-[#0a0a0a] transition-all dark:text-white">
                        Back to Login
                    </Link>
                </div>
            </div>
        ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="p-10 space-y-10">
              
              <div className="space-y-10">
                {/* Personal Details */}
                <div className="space-y-4">
                    <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] flex items-center gap-2">
                        <User className="w-3.5 h-3.5" /> Your Info
                    </h3>
                    <div className="grid grid-cols-1 gap-6">
                        <div className="space-y-2">
                            <label className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">Full Name</label>
                            <input
                              {...register('name')}
                              type="text"
                              className={cn(
                                "block w-full px-5 py-4 bg-gray-50/50 dark:bg-[#111111] border rounded-none text-gray-900 dark:text-white text-[11px] font-bold tracking-widest placeholder:text-gray-300 focus:outline-none focus:ring-1 focus:ring-primary-600 focus:border-primary-600 transition-all",
                                errors.name ? "border-red-500/50" : "border-gray-200 dark:border-gray-800"
                              )}
                              placeholder="Enter your full name"
                            />
                            {errors.name && <p className="text-[9px] font-bold text-red-600 uppercase italic">{errors.name.message}</p>}
                        </div>

                        <div className="space-y-2">
                            <label className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">Email Address</label>
                            <input
                              {...register('email')}
                              type="email"
                              className={cn(
                                "block w-full px-5 py-4 bg-gray-50/50 dark:bg-[#111111] border rounded-none text-gray-900 dark:text-white text-[11px] font-bold tracking-widest placeholder:text-gray-300 focus:outline-none focus:ring-1 focus:ring-primary-600 focus:border-primary-600 transition-all",
                                errors.email ? "border-red-500/50" : "border-gray-200 dark:border-gray-800"
                              )}
                              placeholder="your.email@example.com"
                            />
                            {errors.email && <p className="text-[9px] font-bold text-red-600 uppercase italic">{errors.email.message}</p>}
                        </div>
                    </div>
                </div>

                {/* Contact & Security */}
                <div className="space-y-4">
                    <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] flex items-center gap-2">
                        <Lock className="w-3.5 h-3.5" /> Login Info
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-2">
                            <label className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">Phone Number</label>
                            <input
                              {...register('phoneNumber')}
                              type="tel"
                              className={cn(
                                "block w-full px-5 py-4 bg-gray-50/50 dark:bg-[#111111] border rounded-none text-gray-900 dark:text-white text-[11px] font-bold tracking-widest placeholder:text-gray-300 focus:outline-none focus:ring-1 focus:ring-primary-600 focus:border-primary-600 transition-all",
                                errors.phoneNumber ? "border-red-500/50" : "border-gray-200 dark:border-gray-800"
                              )}
                              placeholder="10-digit mobile number"
                            />
                            {errors.phoneNumber && <p className="text-[9px] font-bold text-red-600 uppercase italic">{errors.phoneNumber.message}</p>}
                        </div>

                        <div className="space-y-2">
                            <label className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">Password</label>
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

                        {/* Referral Code */}
                        <div className="space-y-2 md:col-span-2 mt-2">
                            <label className="text-[9px] font-bold text-gray-500 uppercase tracking-widest flex justify-between">
                              Referral Code
                              <span className="text-gray-300 italic">Optional</span>
                            </label>
                            <input
                              {...register('appliedReferralCode')}
                              type="text"
                              className={cn(
                                "block w-full px-5 py-4 bg-emerald-50/50 dark:bg-emerald-900/10 border rounded-none text-emerald-900 dark:text-emerald-400 text-[11px] font-black tracking-widest placeholder:text-gray-300 focus:outline-none focus:ring-1 focus:ring-emerald-600 focus:border-emerald-600 transition-all uppercase",
                                errors.appliedReferralCode ? "border-red-500/50" : "border-emerald-200 dark:border-emerald-800"
                              )}
                              placeholder="e.g. GDA1B2C3"
                            />
                            {errors.appliedReferralCode && <p className="text-[9px] font-bold text-red-600 uppercase italic">{errors.appliedReferralCode.message}</p>}
                        </div>
                    </div>
                </div>
              </div>

              {/* Register Button */}
              <div className="pt-6">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center gap-4 bg-gray-900 dark:bg-white text-white dark:text-gray-900 py-6 px-4 rounded-none font-black text-[10px] uppercase tracking-[0.3em] shadow-2xl hover:bg-gray-800 dark:hover:bg-gray-50 transition-all disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" /> 
                      Creating Account...
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-4 h-4" />
                      Create Account
                    </>
                  )}
                </button>
                <div className="flex items-start gap-4 mt-8 py-4 px-6 bg-blue-500/5 border border-blue-500/10 italic">
                    <Info className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
                    <p className="text-[9px] leading-relaxed text-blue-600 dark:text-blue-400 font-bold uppercase tracking-widest">
                        A secret code will be sent to your email after you join.
                    </p>
                </div>
              </div>
            </form>
        )}
      </div>

      {/* Login Link */}
      <div className="mt-12 text-center">
        <p className="text-[11px] font-bold text-gray-600 dark:text-gray-400 uppercase tracking-widest">
          Already have an account?{' '}
          <Link to="/auth/login" className="text-gray-900 dark:text-white font-black hover:underline underline-offset-8 decoration-2 decoration-primary-600">
            Sign In Now
          </Link>
        </p>
      </div>
    </div>
  )
}

export default Register
