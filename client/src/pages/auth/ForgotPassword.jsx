import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Mail, Loader2, ShieldAlert, Terminal, Activity, Zap, ShieldCheck } from 'lucide-react'
import authService from '../../services/authService'
import { cn } from '../../lib/utils'

/* ─────────────────────────────────────────────────────────────────────────────
 * FORGOT PASSWORD TERMINAL
 * A simple interface for initializing account recovery.
 * ───────────────────────────────────────────────────────────────────────────── */

const forgotPasswordSchema = z.object({
  email: z.string().email('Please enter a valid email address.'),
})

const ForgotPassword = () => {
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(forgotPasswordSchema),
  })

  const onSubmit = async (data) => {
    try {
      setError('')
      await authService.forgotPassword(data.email)
      setSuccess(true)
      setTimeout(() => {
        navigate('/auth/reset-password', { state: { email: data.email } })
      }, 2000)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send reset link. Please try again.')
    }
  }

  return (
    <div className="w-full max-w-md mx-auto animate-in fade-in duration-700">
      
      {/* 1. RECOVERY HEADER */}
      <div className="mb-12 border-b border-gray-100 dark:border-gray-800 pb-8">
        <button 
          onClick={() => navigate('/auth/login')}
          className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest hover:text-gray-900 dark:hover:text-white transition-colors mb-8"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Login
        </button>
        <div className="flex items-center gap-3 mb-4">
             <ShieldAlert className="w-5 h-5 text-amber-500" />
             <span className="text-[10px] font-bold text-amber-500 uppercase tracking-[0.4em] italic">Forgot Password</span>
        </div>
        <h2 className="text-4xl font-bold tracking-tighter text-gray-900 dark:text-white leading-none">
          Recover <span className="text-gray-400 font-medium">Account</span>
        </h2>
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-4 leading-relaxed">
          Enter your email to receive a reset link
        </p>
      </div>

      {/* 2. INITIATION MODULE */}
      <div className="bg-white dark:bg-[#0a0a0a] border border-gray-900 dark:border-white shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-24 h-1 bg-amber-500" />
        
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
                    <span className="text-[9px] font-black text-emerald-600 uppercase tracking-widest italic">Reset link sent to your email. Redirecting...</span>
                </div>
            </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="p-10 space-y-10">
          
          {/* TARGET UID FIELD */}
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

          {/* INITIATE BUTTON */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={isSubmitting || success}
              className="w-full flex items-center justify-center gap-4 bg-gray-900 dark:bg-white text-white dark:text-gray-900 py-5 px-4 rounded-none font-black text-[10px] uppercase tracking-[0.3em] shadow-xl hover:bg-gray-800 dark:hover:bg-gray-50 transition-all disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> 
                  Sending Reset Link...
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4" />
                  Send Reset Link
                </>
              )}
            </button>
            <div className="flex items-center gap-2 justify-center mt-8 py-2 px-4 bg-gray-50/50 dark:bg-[#111111] border border-gray-100 dark:border-gray-800 italic">
                <Activity className="w-3 h-3 text-amber-500" />
                <span className="text-[8px] font-bold text-gray-400 uppercase tracking-[0.2em]">Verification system active</span>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ForgotPassword
