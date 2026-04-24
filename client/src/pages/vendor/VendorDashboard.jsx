import React from 'react'
import { useQuery } from '@tanstack/react-query'
import {
   BarChart3, Box, TrendingUp, Users,
   ArrowUpRight, Clock, MapPin, ShieldCheck,
   Activity, Package, DollarSign, ArrowRight, Loader2
} from 'lucide-react'
import vendorService from '../../services/vendorService'
import { format } from 'date-fns'

/* ─────────────────────────────────────────────────────────────────────────────
 * MY WORK DASHBOARD
 * Simple tool for farm owners to manage milk sent to the shop.
 * ───────────────────────────────────────────────────────────────────────────── */

const StatCard = ({ label, value, subtext, icon: Icon, trend }) => (
   <div className="bg-white/70 dark:bg-[#0a0a0a]/70 backdrop-blur-xl border border-gray-100 dark:border-gray-800 p-6 lg:p-7 space-y-6 shadow-[0_10px_30px_rgba(0,0,0,0.03)] dark:shadow-none hover:border-emerald-500/30 transition-all group relative overflow-hidden">
      <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 blur-[40px] pointer-events-none group-hover:bg-emerald-500/10 transition-colors" />
      <div className="flex justify-between items-start relative z-10">
         <div className="w-12 h-12 bg-gray-50 dark:bg-[#111111] border border-gray-100 dark:border-gray-800 flex items-center justify-center text-gray-400 group-hover:text-emerald-500 group-hover:scale-105 transition-all duration-500">
            <Icon className="w-5 h-5" />
         </div>
         {trend && (
            <div className={`flex items-center gap-1.5 px-3 py-1 bg-gray-900 dark:bg-white text-[9px] font-black uppercase tracking-widest ${trend > 0 ? 'text-emerald-400 dark:text-emerald-600' : 'text-rose-400 dark:text-rose-600'}`}>
               {trend > 0 ? '+' : ''}{trend}% <ArrowUpRight className="w-3 h-3" />
            </div>
         )}
      </div>
      <div className="space-y-1.5 relative z-10">
         <p className="text-[9px] font-black text-gray-500 uppercase tracking-[0.2em]">{label}</p>
         <p className="text-3xl lg:text-4xl font-black text-gray-900 dark:text-white italic tracking-tighter leading-none">{value}</p>
      </div>
      <div className="text-[9px] font-bold text-gray-400 uppercase tracking-[0.1em] border-t border-gray-100 dark:border-gray-800/50 pt-4 flex items-center gap-2">
         <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> {subtext}
      </div>
   </div>
);

const VendorDashboard = () => {
   // Use simulated data if the API isn't fully ready yet, or the user hasn't supplied products.
   const { data: response, isLoading } = useQuery({
      queryKey: ['vendor-stats'],
      queryFn: vendorService.getDashboardStats,
      retry: false
   })

   // Simulated fallback for initial display
   const stats = response?.data || {
      totalEarnings: '₹0.00',
      activeProducts: 0,
      deliveriesThisMonth: 0,
      rating: 5.0,
      recentSupplies: []
   }

   if (isLoading) {
      return (
         <div className="flex h-screen items-center justify-center bg-white dark:bg-[#0a0a0a]">
            <div className="flex flex-col items-center gap-4">
               <Loader2 className="w-8 h-8 text-emerald-600 animate-spin" />
               <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Opening Dashboard...</p>
            </div>
         </div>
      )
   }

   return (
      <div className="max-w-[1400px] mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-6 duration-1000 px-6 lg:px-10 pb-16">
         {/* 1. HEADER */}
         <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-10 pt-8 pb-10 border-b border-gray-200 dark:border-gray-800">
            <div className="space-y-5">
               <div className="inline-flex items-center gap-2.5 px-4 py-1.5 bg-emerald-500/5 border border-emerald-500/10 backdrop-blur-md">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                  <span className="text-[9px] font-black text-emerald-500 uppercase tracking-[0.4em]">Verified Shop Owner</span>
               </div>
               <h1 className="text-4xl lg:text-6xl font-black text-gray-900 dark:text-white tracking-tighter italic leading-none uppercase">
                  Vendor <span className="text-gray-400 font-medium tracking-tight">Dashboard.</span>
               </h1>
               <div className="flex flex-wrap items-center gap-8 pt-2">
                  <div className="flex items-center gap-2.5">
                     <Activity className="w-3.5 h-3.5 text-emerald-500 animate-pulse" />
                     <span className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Connected</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                     <Clock className="w-3.5 h-3.5 text-gray-400" />
                     <span className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Update: {format(new Date(), 'HH:mm')}</span>
                  </div>
               </div>
            </div>

            <div className="w-full lg:w-80 p-8 bg-gray-900 dark:bg-white text-white dark:text-gray-900 space-y-4 shadow-xl dark:shadow-none hover:translate-y-[-2px] transition-transform duration-500">
               <div className="flex justify-between items-center">
                  <p className="text-[9px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest">Available Balance</p>
                  <DollarSign className="w-4 h-4 text-emerald-500" />
               </div>
               <p className="text-4xl font-black tracking-tighter italic">₹0.00</p>
               <button className="w-full h-12 bg-emerald-500 dark:bg-gray-900 text-white text-[9px] font-black uppercase tracking-[0.4em] hover:bg-emerald-600 transition-all">Take Payment</button>
            </div>
         </div>

         {/* 2. STATS GRID */}
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
               label="Total Earnings"
               value={stats.totalEarnings}
               subtext="Money from Items Sent"
               icon={DollarSign}
               trend={12.4}
            />
            <StatCard
               label="Live Products"
               value={stats.activeProducts}
               subtext="Items for Sale"
               icon={Package}
            />
            <StatCard
               label="Monthly Supplies"
               value={stats.deliveriesThisMonth}
               subtext="Items Sent this Month"
               icon={BarChart3}
               trend={-4.2}
            />
            <StatCard
               label="Your Rating"
               value={`${stats.rating.toFixed(1)}`}
               subtext="Based on Quality"
               icon={TrendingUp}
            />
         </div>

         {/* 3. OPERATIONS VIEW */}
         <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

            {/* LEFT: SUPPLY HISTORY */}
            <div className="lg:col-span-2 space-y-8">
               <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-4">
                  <h3 className="text-base font-black text-gray-900 dark:text-white uppercase tracking-[0.2em] italic">Sent Items History</h3>
                  <button className="text-[9px] font-black text-emerald-500 uppercase tracking-[0.4em] hover:tracking-[0.5em] transition-all border-b border-emerald-500/30 pb-0.5">Search History</button>
               </div>

               <div className="bg-white/50 dark:bg-[#0a0a0a]/50 backdrop-blur-md border border-gray-100 dark:border-gray-800 divide-y divide-gray-100 dark:divide-gray-800/50 overflow-hidden shadow-lg">
                  {stats.recentSupplies.length > 0 ? (
                     stats.recentSupplies.map((supply, i) => (
                        <div key={i} className="p-6 flex items-center justify-between hover:bg-gray-50/50 dark:hover:bg-emerald-500/5 transition-all group">
                           <div className="flex items-center gap-6">
                              <div className="w-11 h-11 bg-gray-50 dark:bg-[#151515] border border-gray-100 dark:border-gray-800 flex items-center justify-center group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                                 <Box className="w-5 h-5" />
                              </div>
                              <div className="space-y-0.5">
                                 <p className="text-xs font-black text-gray-900 dark:text-white uppercase italic tracking-tight">{supply.productName}</p>
                                 <div className="text-[9px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> ID: {supply.batchId}
                                 </div>
                              </div>
                           </div>
                           <div className="text-right space-y-1">
                              <p className="text-lg font-black text-gray-900 dark:text-white italic">₹{supply.amount}</p>
                              <p className="text-[8px] font-black text-gray-400 uppercase tracking-[0.2em]">{supply.date}</p>
                           </div>
                        </div>
                     ))
                  ) : (
                     <div className="p-24 text-center space-y-6 bg-gray-50/30 dark:bg-black/20">
                        <div className="w-16 h-16 bg-white dark:bg-[#111111] border border-gray-100 dark:border-gray-800 flex items-center justify-center mx-auto text-gray-300 relative">
                           <Activity className="w-8 h-8 animate-pulse text-emerald-500/20" />
                           <div className="absolute inset-0 border border-emerald-500/5 animate-ping" />
                        </div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.4em] italic max-w-[200px] mx-auto leading-loose">No supplies found yet. Ready to add your first item.</p>
                     </div>
                  )}
               </div>
            </div>

            {/* RIGHT: FARM PROFILE / ACTION HUB */}
            <div className="space-y-10">
               <div className="bg-gray-900 dark:bg-white p-10 space-y-10 shadow-2xl relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 dark:bg-emerald-500/5 blur-[60px] pointer-events-none group-hover:scale-125 transition-transform duration-1000" />
                  <h3 className="text-xl font-black text-white dark:text-gray-900 uppercase tracking-tighter italic leading-none border-l-4 border-emerald-500 pl-5">My Farm Info</h3>

                  <div className="space-y-6">
                     <div className="flex gap-5 items-start pb-6 border-b border-white/10 dark:border-gray-200">
                        <div className="w-9 h-9 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                           <MapPin className="w-3.5 h-3.5 text-emerald-500" />
                        </div>
                        <div className="space-y-1.5">
                           <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Farm Location</p>
                           <p className="text-[11px] font-black text-white dark:text-gray-900 uppercase tracking-tight italic">Verified Pickup Point</p>
                        </div>
                     </div>
                     <div className="flex gap-5 items-start">
                        <div className="w-9 h-9 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                           <Users className="w-3.5 h-3.5 text-emerald-500" />
                        </div>
                        <div className="space-y-1.5">
                           <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Admin Contact</p>
                           <p className="text-[11px] font-black text-white dark:text-gray-900 uppercase tracking-tight italic">Support Center</p>
                        </div>
                     </div>
                  </div>

                  <div className="pt-6 space-y-4">
                     <button className="w-full h-14 bg-emerald-500 text-white text-[9px] font-black uppercase tracking-[0.4em] hover:bg-emerald-600 transition-all shadow-xl group/btn overflow-hidden relative">
                        <span className="relative z-10">Add Sent Item</span>
                        <div className="absolute inset-0 bg-white/10 translate-y-full group-hover/btn:translate-y-0 transition-transform" />
                     </button>
                     <button className="w-full h-14 border border-white/20 dark:border-gray-200 text-white dark:text-gray-900 text-[9px] font-black uppercase tracking-[0.4em] hover:bg-white/10 hover:text-black transition-all">Get Support</button>
                  </div>
               </div>

               <div className="p-10 border-2 border-gray-100 dark:border-gray-800 space-y-6 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-1.5 h-full bg-primary-600 group-hover:w-full transition-all duration-700 opacity-5" />
                  <h4 className="text-[10px] font-black text-gray-900 dark:text-white uppercase tracking-[0.5em] italic">Alert Message</h4>
                  <p className="text-[11px] font-bold text-gray-500 uppercase tracking-widest leading-loose">
                     Please make sure your supplies are checked before the delivery person arrives.
                  </p>
                  <button className="text-[8px] font-black text-primary-600 uppercase tracking-widest flex items-center gap-2">
                     Read Manual <ArrowRight className="w-2.5 h-2.5" />
                  </button>
               </div>
            </div>

         </div>
      </div>
   )
}

export default VendorDashboard
