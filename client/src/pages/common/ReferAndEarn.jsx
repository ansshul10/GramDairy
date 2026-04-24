import { useState, useEffect } from 'react'
import { Gift, Copy, Share2, Activity, ShieldCheck, ArrowRight, Wallet, History, Users, ArrowUpRight, ArrowDownLeft, ChevronRight, CheckCircle2 } from 'lucide-react'
import authService from '../../services/authService'
import toast from 'react-hot-toast'
import useAuthStore from '../../store/authStore'
import { Link } from 'react-router-dom'

/* ─────────────────────────────────────────────────────────────────────────────
 * REFER & EARN PAGE (WALLET SYSTEM)
 * Contains Wallet Balance, Referral Actions, Policy, and Transaction Ledger
 * ───────────────────────────────────────────────────────────────────────────── */

const ReferAndEarn = () => {
  const { user } = useAuthStore()
  const [stats, setStats] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const response = await authService.getProfileStats()
      setStats(response.data)
    } catch (err) {
      toast.error('Failed to load wallet data')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCopyCode = () => {
    if (stats?.referralCode) {
      navigator.clipboard.writeText(stats.referralCode)
      toast.success('Referral code copied to clipboard!')
    }
  }

  const handleShare = async () => {
    if (navigator.share && stats?.referralCode) {
      try {
        await navigator.share({
          title: 'Join GramDairy & Get ₹50!',
          text: `Use my referral code ${stats.referralCode} to join GramDairy and we both get 50 Wallet Points (₹50) instantly!`,
          url: `${window.location.origin}/auth/register`
        })
      } catch (err) {
        console.error('Share failed', err)
      }
    } else {
      handleCopyCode()
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Activity className="w-8 h-8 text-emerald-500 animate-spin" />
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 lg:py-20 animate-in fade-in duration-700 min-h-screen">
      
      {/* ── HEADER ──────────────────────────────────────────────────────────── */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 border-b border-gray-100 dark:border-gray-800 pb-12 mb-12">
        <div>
          <h2 className="text-[10px] font-bold text-emerald-600 uppercase tracking-[0.4em] mb-2 flex items-center gap-2 italic">
            <Gift className="w-4 h-4" /> GramDairy Rewards
          </h2>
          <h1 className="text-4xl lg:text-5xl font-black text-gray-900 dark:text-white tracking-tighter leading-none mb-3">
            Refer & <span className="text-emerald-500 font-medium">Earn</span>
          </h1>
          <div className="flex items-center gap-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest italic">
             <span>Share GramDairy, Earn Cash</span>
             <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
             <span className="text-emerald-500">1 Point = ₹1</span>
          </div>
        </div>

        {/* Wallet Hero Widget */}
        <div className="bg-emerald-500 text-white p-8 lg:w-96 shadow-2xl relative overflow-hidden">
           <div className="absolute top-0 right-0 p-4 opacity-20">
              <Wallet className="w-32 h-32 transform rotate-12 translate-x-8 -translate-y-8" />
           </div>
           <div className="relative z-10">
              <p className="text-[10px] font-black uppercase tracking-[0.3em] mb-2 opacity-80">Available Wallet Balance</p>
              <h2 className="text-6xl font-black italic tracking-tighter">
                <span className="text-3xl inline-block -translate-y-4">₹</span>{stats?.walletBalance || 0}
              </h2>
              <p className="text-[10px] font-bold uppercase tracking-widest mt-4 opacity-90 inline-flex items-center gap-2">
                 <ShieldCheck className="w-4 h-4" /> Valid for any checkout
              </p>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* ── LEFT COLUMN (Referral & Policies) ────────────────────────────── */}
        <div className="lg:col-span-7 space-y-12">
          
          {/* Share Code Section */}
          <div className="p-8 lg:p-12 border border-gray-100 dark:border-gray-800 bg-white dark:bg-[#0c0c0c] space-y-8">
             <h3 className="text-xs font-black text-gray-900 dark:text-white uppercase tracking-[0.2em] flex items-center gap-3 italic">
                <Users className="w-4 h-4 text-emerald-500" /> Invite Friends
             </h3>
             <p className="text-gray-500 text-sm font-medium pr-8">
               Share your unique code. When your friend registers using this code, both of you instantly get ₹50 in your GramDairy wallet!
             </p>

             <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 border-2 border-dashed border-emerald-500/50 bg-emerald-500/5 px-6 py-4 flex items-center justify-between">
                   <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400 tracking-widest uppercase truncate">
                      {stats?.referralCode || 'GDXXXXXX'}
                   </span>
                </div>
                <button 
                  onClick={handleCopyCode}
                  className="h-16 px-8 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-black text-[10px] uppercase tracking-[0.2em] flex items-center gap-3 hover:opacity-90 transition-all shrink-0"
                >
                  <Copy className="w-4 h-4" /> Copy Code
                </button>
                <button 
                  onClick={handleShare}
                  className="h-16 px-8 bg-emerald-500 text-white font-black text-[10px] uppercase tracking-[0.2em] flex items-center gap-3 hover:bg-emerald-600 transition-all shrink-0"
                >
                  <Share2 className="w-4 h-4" /> Share
                </button>
             </div>
          </div>

          {/* Policy & How It Works */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
             <div className="p-8 border border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-white/5">
                <div className="w-12 h-12 bg-white dark:bg-[#0a0a0a] border border-gray-100 dark:border-gray-800 flex items-center justify-center mb-6">
                   <Gift className="w-5 h-5 text-emerald-500" />
                </div>
                <h4 className="text-sm font-black uppercase tracking-tight mb-2">₹50 Sign-Up Bonus</h4>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-relaxed">
                  Both the referrer and the new friend get 50 Wallet Points as soon as the friend verifies their email OTP.
                </p>
             </div>
             <div className="p-8 border border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-white/5">
                <div className="w-12 h-12 bg-white dark:bg-[#0a0a0a] border border-gray-100 dark:border-gray-800 flex items-center justify-center mb-6">
                   <Wallet className="w-5 h-5 text-blue-500" />
                </div>
                <h4 className="text-sm font-black uppercase tracking-tight mb-2">2% Shopping Cashback</h4>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-relaxed">
                  For every physical order you place, earn a sweet 2% cashback directly into your GramDairy Wallet.
                </p>
             </div>
          </div>
          
          <div className="flex items-center gap-4 py-4 px-6 bg-emerald-500/5 border border-emerald-500/10 italic">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
              <p className="text-[9px] leading-relaxed text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-widest">
                  Points can be redeemed 100% on any checkout screen. Points never expire. 1 Point is strictly equal to 1 Rupee (₹1).
              </p>
          </div>
        </div>

        {/* ── RIGHT COLUMN (Ledger) ─────────────────────────────────────────── */}
        <div className="lg:col-span-5 space-y-8">
          
          <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-4">
             <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 flex items-center gap-2 italic">
               <History className="w-3.5 h-3.5" /> Transaction Ledger
             </h4>
          </div>

          <div className="space-y-4">
            {stats?.walletTransactions?.length > 0 ? (
              stats.walletTransactions.map((txn, idx) => (
                <div key={idx} className="p-5 border border-gray-100 dark:border-gray-800 bg-white dark:bg-[#0c0c0c] flex items-center justify-between gap-4 group hover:border-gray-200 dark:hover:border-gray-700 transition-colors">
                   <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 flex items-center justify-center shrink-0 ${txn.type === 'Credit' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'}`}>
                         {txn.type === 'Credit' ? <ArrowDownLeft className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
                      </div>
                      <div>
                         <p className="text-xs font-black tracking-tight line-clamp-1">{txn.description}</p>
                         <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mt-1">
                           {new Date(txn.timestamp).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                         </p>
                      </div>
                   </div>
                   <div className="text-right shrink-0">
                      <p className={`text-sm font-black italic ${txn.type === 'Credit' ? 'text-emerald-500' : 'text-red-500'}`}>
                         {txn.type === 'Credit' ? '+' : '-'}₹{Math.abs(txn.amount)}
                      </p>
                   </div>
                </div>
              ))
            ) : (
              <div className="py-20 text-center border border-dashed border-gray-200 dark:border-gray-800">
                 <History className="w-6 h-6 text-gray-300 mx-auto mb-4" />
                 <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest italic">No wallet history found.</p>
                 <p className="text-[9px] font-bold text-gray-500 uppercase tracking-widest mt-2">Placed orders or refer friends to start earning.</p>
              </div>
            )}
          </div>
          
          <Link to="/products" className="w-full flex items-center justify-center gap-3 p-4 border border-gray-200 dark:border-gray-800 text-[10px] font-bold uppercase tracking-widest hover:bg-gray-50 dark:hover:bg-white/5 transition-all text-gray-900 dark:text-white">
             Shop Now to earn cashback <ArrowRight className="w-3.5 h-3.5" />
          </Link>

        </div>
      </div>
    </div>
  )
}

export default ReferAndEarn
