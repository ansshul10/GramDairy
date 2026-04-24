import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { User, Calendar, Activity, Database, ShieldCheck, Clock, CheckCircle2, Package, Mail, MapPin, Zap } from 'lucide-react'
import axios from 'axios'

/* ─────────────────────────────────────────────────────────────────────────────
 * PUBLIC PROFILE / QR DISCLOSURE PAGE
 * An enterprise-grade disclosure of user delivery statistics and status.
 * ───────────────────────────────────────────────────────────────────────────── */

const PublicProfile = () => {
  const { id } = useParams()

  const { data: response, isLoading, isError } = useQuery({
    queryKey: ['public-profile', id],
    queryFn: async () => {
      const res = await axios.get(`/api/v1/public/profile/${id}`)
      return res.data
    },
  })

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-10">
        <Activity className="w-12 h-12 text-gray-200 animate-pulse mb-6" />
        <p className="text-[10px] font-bold uppercase tracking-[0.5em] text-gray-400 animate-pulse">Initializing Protocol...</p>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-10 text-center">
        <Database className="w-12 h-12 text-red-500 mb-6 opacity-20" />
        <h1 className="text-xl font-bold text-gray-900 uppercase tracking-tighter mb-2">Protocol Error</h1>
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-relaxed">The requested customer identity could not be verified in the secure database.</p>
      </div>
    )
  }

  const { user, stats } = response.data

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-[#050505] p-6 lg:p-20 font-sans selection:bg-primary-600 selection:text-white">

      {/* 1. HEADER */}
      <div className="max-w-4xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-5 duration-1000">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 border-b-2 border-gray-900 dark:border-white pb-12">
          <div>
            <h2 className="text-[10px] font-bold text-primary-600 uppercase tracking-[0.4em] mb-3 flex items-center gap-2 italic">
              <Zap className="w-4 h-4" /> Public Profile
            </h2>
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white tracking-tighter leading-none mb-6">
              Customer <span className="text-gray-400 font-medium italic">Details</span>
            </h1>
            <div className="flex flex-wrap items-center gap-6">
              <div className="flex items-center gap-2">
                <Database className="w-3.5 h-3.5 text-primary-600" />
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">ID: #{user._id.slice(-8).toUpperCase()}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-3.5 h-3.5 text-gray-400" />
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest italic">Since: {new Date(stats.customerSince).toLocaleDateString(undefined, { year: 'numeric', month: 'long' })}</span>
              </div>
            </div>
          </div>

          <div className="p-4 bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-gray-800 shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-2 h-2 bg-emerald-500" />
            <div className="w-24 h-24 bg-gray-50 dark:bg-gray-900/50 flex items-center justify-center">
              <User className="w-10 h-10 text-gray-200" />
            </div>
          </div>
        </div>

        {/* 2. ACTIVITY LOG */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-gray-200 dark:bg-gray-800 border border-gray-200 dark:border-gray-800 shadow-2xl">

          {/* STAT A: DELIVERIES */}
          <div className="bg-white dark:bg-[#0a0a0a] p-10 space-y-4 group">
            <div className="w-10 h-10 border border-gray-100 dark:border-gray-800 flex items-center justify-center transition-colors group-hover:border-primary-600/30">
              <Package className="w-4 h-4 text-gray-400 group-hover:text-primary-600" />
            </div>
            <div>
              <p className="text-[42px] font-bold text-gray-900 dark:text-white leading-none tracking-tighter mb-2 italic">
                {stats.deliveriesThisMonth}
              </p>
              <p className="text-[10px] font-black text-primary-600 uppercase tracking-[0.3em]">Monthly Deliveries</p>
            </div>
          </div>

          {/* STAT B: VOLUME */}
          <div className="bg-white dark:bg-[#0a0a0a] p-10 space-y-4 group">
            <div className="w-10 h-10 border border-gray-100 dark:border-gray-800 flex items-center justify-center transition-colors group-hover:border-primary-600/30">
              <Activity className="w-4 h-4 text-gray-400 group-hover:text-primary-600" />
            </div>
            <div>
              <p className="text-[42px] font-bold text-gray-900 dark:text-white leading-none tracking-tighter mb-2 italic">
                {stats.milkQuantityThisMonth}<span className="text-xl ml-1 text-gray-400 font-medium">L</span>
              </p>
              <p className="text-[10px] font-black text-primary-600 uppercase tracking-[0.3em]">Total Volume</p>
            </div>
          </div>

          {/* STAT C: RELIABILITY */}
          <div className="bg-white dark:bg-[#0a0a0a] p-10 space-y-4 md:col-span-2 lg:col-span-1 border-t md:border-t-0 border-gray-100 dark:border-gray-800">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-black text-gray-900 dark:text-white uppercase tracking-[0.3em]">Status</span>
            </div>
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-gray-50 dark:border-gray-900 pb-4">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest italic">Reliability</span>
                <span className="text-[11px] font-black text-emerald-500 uppercase tracking-tighter">Grade: A+</span>
              </div>
              <div className="flex items-center justify-between pt-2">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest italic">Level</span>
                <span className="text-[11px] font-black text-blue-500 uppercase tracking-tighter italic">Verified</span>
              </div>
            </div>
          </div>
        </div>

        {/* 3. DATA BLOCK */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="p-10 bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-gray-800 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-1 bg-primary-600" />
            <h3 className="text-[9px] font-black text-gray-400 uppercase tracking-[0.4em] mb-8 italic">Account Profile</h3>
            <div className="space-y-8 relative z-10">
              <div className="space-y-6">
                <div className="flex items-center gap-6 group">
                  <div className="w-12 h-12 bg-gray-50 dark:bg-[#111111] flex items-center justify-center rounded-none group-hover:bg-primary-600 group-hover:text-white transition-all">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1 italic">Customer Since</p>
                    <p className="text-[13px] font-black text-gray-900 dark:text-white uppercase tracking-tighter">
                      {new Date(stats.customerSince).toLocaleDateString(undefined, { day: '2-digit', month: '2-digit', year: 'numeric' })}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="p-10 bg-gray-900 text-white rounded-none relative overflow-hidden group shadow-2xl">
            <div className="absolute bottom-0 right-0 w-32 h-32 bg-white/5 -mb-16 -mr-16 rotate-45 transition-transform group-hover:scale-110" />
            <h3 className="text-[9px] font-black text-gray-400 uppercase tracking-[0.4em] mb-8 italic flex items-center gap-3">
              <Activity className="w-4 h-4" /> Delivery Records
            </h3>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest leading-loose mb-10 italic">
              This profile is a verified record. Any data shown here is for transparency and historical verification purposes only.
            </p>
            <div className="flex items-center gap-4 border-t border-white/10 pt-8 mt-auto">
              <CheckCircle2 className="w-5 h-5 text-emerald-500" />
            </div>
          </div>
        </div>

        {/* 4. FOOTER IDENTIFICATION */}
        <div className="text-center pt-20 border-t border-gray-100 dark:border-gray-900 pb-20">
          <p className="text-[9px] font-bold text-gray-300 dark:text-gray-700 uppercase tracking-[0.8em]">GramDairy Secure Protocol v4.0.12</p>
        </div>
      </div>
    </div>
  )
}

export default PublicProfile