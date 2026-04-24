import { useState, useRef, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Loader2, ArrowLeft, ShieldCheck, Terminal, Activity, Zap, Fingerprint, AlertCircle } from 'lucide-react'
import authService from '../../services/authService'
import useAuthStore from '../../store/authStore'
import { cn } from '../../lib/utils'

/* ─────────────────────────────────────────────────────────────────────────────
 * OTP VERIFICATION
 * A simple interface for verifying your account via email code.
 * ───────────────────────────────────────────────────────────────────────────── */

const VerifyOtp = () => {
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const inputRefs = useRef([])
  const location = useLocation()
  const navigate = useNavigate()
  const { setUser } = useAuthStore()

  const email = location.state?.email

  useEffect(() => {
    if (!email) {
      navigate('/auth/login')
    }
  }, [email, navigate])

  const handleChange = (index, value) => {
    if (isNaN(value)) return

    const newOtp = [...otp]
    newOtp[index] = value.substring(value.length - 1)
    setOtp(newOtp)

    // Move to next input if value is entered
    if (value && index < 5) {
      inputRefs.current[index + 1].focus()
    }
  }

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus()
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const otpString = otp.join('')
    if (otpString.length !== 6) {
      setError('Please enter the 6-digit code.')
      return
    }

    try {
      setIsSubmitting(true)
      setError('')
      const response = await authService.verifyOtp({ email, otp: otpString })
      setUser(response.data.user)
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid code. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="w-full max-w-md mx-auto animate-in fade-in duration-700">

      {/* 1. HANDSHAKE HEADER */}
      <div className="mb-12 border-b border-gray-100 dark:border-gray-800 pb-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest hover:text-gray-900 dark:hover:text-white transition-colors mb-8"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Cancel
        </button>
        <div className="flex items-center gap-3 mb-4">
          <ShieldCheck className="w-5 h-5 text-primary-600" />
          <span className="text-[10px] font-bold text-primary-600 uppercase tracking-[0.4em] italic">Secure Access</span>
        </div>
        <h2 className="text-4xl font-bold tracking-tighter text-gray-900 dark:text-white leading-none">
          Verify <span className="text-gray-400 font-medium">Account</span>
        </h2>
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-4 leading-relaxed">
          Code sent to: <span className="text-gray-900 dark:text-white underline decoration-primary-600 underline-offset-4">{email}</span>
        </p>
      </div>

      {/* 2. VERIFICATION MODULE */}
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

        <form onSubmit={handleSubmit} className="p-10 space-y-12">

          {/* MATRIX INPUT GROUP */}
          <div className="space-y-4 text-center">
            <p className="text-[9px] font-black text-gray-400 uppercase tracking-[0.3em]">Enter the 6-digit code sent to your email</p>
            <div className="flex justify-between gap-3">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => (inputRefs.current[index] = el)}
                  type="text"
                  maxLength="1"
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className="w-full h-16 text-center text-3xl font-bold bg-gray-50/50 dark:bg-[#111111] border border-gray-200 dark:border-gray-800 rounded-none focus:border-primary-600 focus:outline-none transition-all dark:text-white"
                />
              ))}
            </div>
          </div>

          {/* COMMIT HANDSHAKE BUTTON */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-4 bg-gray-900 dark:bg-white text-white dark:text-gray-900 py-5 px-4 rounded-none font-black text-[10px] uppercase tracking-[0.3em] shadow-xl hover:bg-gray-800 dark:hover:bg-gray-50 transition-all disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Verifying...
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  Verify Account
                </>
              )}
            </button>
            <div className="flex items-center gap-2 justify-center mt-8 py-2 px-4 bg-gray-50/50 dark:bg-[#111111] border border-gray-100 dark:border-gray-800 italic">
              <ShieldCheck className="w-3 h-3 text-emerald-500" />
              <span className="text-[8px] font-bold text-gray-400 uppercase tracking-[0.2em]">Secure Session Active</span>
            </div>
          </div>
        </form>
      </div>

      {/* 3. RETRY LOGIC */}
      <div className="mt-12 text-center">
        <p className="text-[11px] font-bold text-gray-600 dark:text-gray-400 uppercase tracking-widest">
          Didn't receive the code?{' '}
          <button className="text-gray-900 dark:text-white font-black hover:underline underline-offset-8 decoration-2 decoration-primary-600">
            Resend Code
          </button>
        </p>
      </div>
    </div>
  )
}

export default VerifyOtp
