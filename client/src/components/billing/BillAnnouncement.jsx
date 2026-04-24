import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { AlertCircle, Clock, ArrowRight, ShieldAlert, Activity } from 'lucide-react'
import axios from 'axios'

/* ─────────────────────────────────────────────────────────────────────────────
 * BILL ANNOUNCEMENT TERMINAL
 * A high-visibility alert for pending billing obligations.
 * ───────────────────────────────────────────────────────────────────────────── */

const BillAnnouncement = () => {
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 })

  // Fetch user's pending bills
  const { data: response } = useQuery({
    queryKey: ['my-bills-summary'],
    queryFn: async () => {
      const res = await axios.get('/api/v1/billing/my-bills')
      return res.data
    },
    // Only fetch if logged in (handled by interceptors, but we can be safe)
    retry: false
  })

  useEffect(() => {
    // Timer logic for the countdown (Assuming 48 hours for the demo/requirement)
    const timer = setInterval(() => {
      const now = new Date()
      const end = new Date()
      end.setHours(23, 59, 59, 999) // Simple EOD timer for demo/placeholder logic
      
      const diff = end - now
      
      if (diff > 0) {
        setTimeLeft({
          hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((diff / 1000 / 60) % 60),
          seconds: Math.floor((diff / 1000) % 60)
        })
      }
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const pendingBill = response?.data?.find(bill => bill.status === 'Pending')

  if (!pendingBill) return null

  return (
    <div className="w-full bg-red-50 dark:bg-red-950/20 border-b border-red-100 dark:border-red-900/30 animate-in fade-in slide-in-from-top duration-700">
      <div className="max-w-[1400px] mx-auto px-6 py-4">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
          
          {/* 1. ALERT STATUS */}
          <div className="flex items-center gap-5">
            <div className="w-10 h-10 bg-white dark:bg-[#0a0a0a] border border-red-200 dark:border-red-900/50 flex items-center justify-center relative">
               <ShieldAlert className="w-5 h-5 text-red-600 animate-pulse" />
               <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-600 rounded-none shadow-lg" />
            </div>
            <div>
              <p className="text-[8px] font-black text-gray-400 uppercase tracking-[0.3em] mb-1 italic leading-none">Status</p>
              <p className="text-[10px] font-black text-rose-500 uppercase tracking-widest italic animate-pulse">Payment Overdue</p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-6 md:gap-12 flex-1 justify-center">
            <p className="text-[10px] md:text-xs font-bold text-gray-400 uppercase tracking-[0.2em] max-w-sm text-center md:text-left leading-relaxed">
              Please pay your outstanding bill to avoid any service interruptions.
            </p>
          </div>

          {/* 2. TELEMETRY TIMER */}
          <div className="flex items-center gap-px bg-red-200 dark:bg-red-900/30 border border-red-200 dark:border-red-900/30 shadow-inner">
             {[
               { val: timeLeft.hours, label: 'HRS' },
               { val: timeLeft.minutes, label: 'MIN' },
               { val: timeLeft.seconds, label: 'SEC' }
             ].map((t, idx) => (
                <div key={idx} className="bg-white dark:bg-[#0a0a0a] min-w-[70px] py-2 px-3 text-center transition-all group hover:bg-red-50">
                  <p className="text-lg font-bold text-gray-900 dark:text-white leading-none tracking-tighter mb-1 font-mono">{t.val.toString().padStart(2, '0')}</p>
                  <p className="text-[7px] font-black text-gray-400 uppercase tracking-[0.2em]">{t.label}</p>
                </div>
             ))}
          </div>

          {/* 3. ACTION VECTOR */}
          <Link 
            to="/billing" 
            className="group flex items-center gap-4 py-3 px-8 bg-black dark:bg-white text-white dark:text-black font-black text-[9px] uppercase tracking-[0.3em] hover:opacity-90 transition-all rounded-none italic shadow-xl"
          >
            Clear Dues Now <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>

        </div>
      </div>
    </div>
  )
}

export default BillAnnouncement
