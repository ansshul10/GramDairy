import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useLocation, useNavigate } from 'react-router-dom'
import { Lock, Eye, EyeOff, Loader2, ShieldCheck, Terminal, Activity, Zap, Fingerprint, ShieldAlert, Key } from 'lucide-react'
import authService from '../../services/authService'
import { cn } from '../../lib/utils'

/* ─────────────────────────────────────────────────────────────────────────────
 * RESET PASSWORD TERMINAL
 * A simple interface for updating user credentials.
 * ───────────────────────────────────────────────────────────────────────────── */

const resetPasswordSchema = z.object({
  otp: z.string().length(6, 'Verification code must be 6 digits.'),
  password: z.string().min(6, 'Password must be at least 6 characters.'),
  confirmPassword: z.string().min(1, 'Confirm your new password.'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match.",
  path: ["confirmPassword"],
})

const ResetPassword = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  
  const email = location.state?.email

  useEffect(() => {
    if (!email) {
      navigate('/auth/login')
    }
  }, [email, navigate])

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(resetPasswordSchema),
  })

  const onSubmit = async (data) => {
    try {
      setError('')
      await authService.resetPassword({ email, otp: data.otp, password: data.password })
      setSuccess(true)
      setTimeout(() => {
        navigate('/auth/login')
      }, 2000)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reset password. Please try again.')
    }
  }

  return (
    <div className="w-full max-w-md mx-auto animate-in fade-in duration-700">
      
      {/* 1. RECALIBRATION HEADER */}
      <div className="mb-12 border-b border-gray-100 dark:border-gray-800 pb-8">
        <div className="flex items-center gap-3 mb-4">
             <Key className="w-5 h-5 text-primary-600" />
             <span className="text-[10px] font-bold text-primary-600 uppercase tracking-[0.4em] italic">Security Update</span>
        </div>
        <h2 className="text-4xl font-bold tracking-tighter text-gray-900 dark:text-white leading-none">
          Reset <span className="text-gray-400 font-medium">Password</span>
        </h2>
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-4 leading-relaxed">
          Resetting password for: <span className="text-gray-900 dark:text-white underline decoration-primary-600 underline-offset-4">{email}</span>
        </p>
      </div>

      {/* 2. RE-INITIALIZATION MODULE */}
      <div className="bg-white dark:bg-[#0a0a0a] border border-gray-900 dark:border-white shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-24 h-1 bg-primary-600" />
        
        {/* Status Sequence Banners */}
        {error && (
            <div className="p-6 bg-red-500/10 border-b border-red-500/20 animate-in slide-in-from-top duration-300">
                <div className="flex items-center gap-3">
                    <Terminal className="w-4 h-4 text-red-600" />
                    <span className="text-[9px] font-black text-red-600 uppercase tracking-widest italic">{error}</span>
                </div>
            </div>
        )}

        {success && (
            <div className="p-6 bg-emerald-500/10 border-b border-emerald-500/20 animate-in slide-in-from-top duration-300">
                <div className="flex items-center gap-3">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span className="text-[9px] font-black text-emerald-600 uppercase tracking-widest italic">Password updated successfully. Redirecting to login...</span>
                </div>
            </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="p-10 space-y-10">
          
          {/* MATRIX POINT FIELD */}
          <div className="space-y-3">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] flex items-center gap-2">
              <Zap className="w-3.5 h-3.5" /> Enter Verification Code (OTP)
            </label>
            <input
              {...register('otp')}
              type="text"
              maxLength="6"
              className={cn(
                "block w-full px-5 py-4 bg-gray-50/50 dark:bg-[#111111] border rounded-none text-center text-2xl font-bold tracking-[0.5em] text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-primary-600 focus:border-primary-600 transition-all",
                errors.otp ? "border-red-500/50" : "border-gray-200 dark:border-gray-800"
              )}
              placeholder="000000"
            />
            {errors.otp && <p className="text-[9px] font-bold text-red-600 uppercase italic text-center">{errors.otp.message}</p>}
          </div>

          {/* NEW ENTROPY INPUTS */}
          <div className="space-y-8">
            <div className="space-y-3">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] flex items-center gap-2">
                    <Lock className="w-3.5 h-3.5" /> New Password
                </label>
                <div className="relative group">
                    <input
                        {...register('password')}
                        type={showPassword ? 'text' : 'password'}
                        className={cn(
                            "block w-full px-5 py-4 bg-gray-50/50 dark:bg-[#111111] border rounded-none text-[11px] font-bold tracking-widest text-gray-900 dark:text-white placeholder:text-gray-300 focus:outline-none focus:ring-1 focus:ring-primary-600 focus:border-primary-600 transition-all",
                            errors.password ? "border-red-500/50" : "border-gray-200 dark:border-gray-800"
                        )}
                        placeholder="••••••••"
                    />
                </div>
                {errors.password && <p className="text-[9px] font-bold text-red-600 uppercase italic">{errors.password.message}</p>}
            </div>

            <div className="space-y-3">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] flex items-center gap-2">
                    <ShieldCheck className="w-3.5 h-3.5" /> Confirm Sequence
                </label>
                <div className="relative group">
                    <input
                        {...register('confirmPassword')}
                        type={showPassword ? 'text' : 'password'}
                        className={cn(
                            "block w-full px-5 py-5 bg-gray-50/50 dark:bg-[#111111] border rounded-none text-[11px] font-bold tracking-widest text-gray-900 dark:text-white placeholder:text-gray-300 focus:outline-none focus:ring-1 focus:ring-primary-600 focus:border-primary-600 transition-all",
                            errors.confirmPassword ? "border-red-500/50" : "border-gray-200 dark:border-gray-800"
                        )}
                        placeholder="••••••••"
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 px-5 flex items-center text-gray-400 hover:text-primary-600 transition-colors"
                    >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                </div>
                {errors.confirmPassword && <p className="text-[9px] font-bold text-red-600 uppercase italic">{errors.confirmPassword.message}</p>}
            </div>
          </div>

          {/* COMMIT BUTTON */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={isSubmitting || success}
              className="w-full flex items-center justify-center gap-4 bg-gray-900 dark:bg-white text-white dark:text-gray-900 py-5 px-4 rounded-none font-black text-[10px] uppercase tracking-[0.3em] shadow-xl hover:bg-gray-800 dark:hover:bg-gray-50 transition-all disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> 
                  Updating Password...
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  Update Password
                </>
              )}
            </button>
            <div className="flex items-center gap-2 justify-center mt-8 py-2 px-4 bg-gray-50/50 dark:bg-[#111111] border border-gray-100 dark:border-gray-800 italic">
                <Activity className="w-3 h-3 text-emerald-500" />
                <span className="text-[8px] font-bold text-gray-400 uppercase tracking-[0.2em]">Security update active</span>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ResetPassword
