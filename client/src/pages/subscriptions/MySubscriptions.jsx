import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Link, useNavigate } from 'react-router-dom'
import { Calendar, Play, Pause, Trash2, Clock, Package, Loader2, Info, Activity, Settings, RefreshCw, AlertCircle, MessageSquare, ShieldCheck, Send, Terminal, Tag, ArrowUpRight, Check, Gift, ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react'
import subscriptionService from '../../services/subscriptionService'
import couponService from '../../services/couponService'
import { formatCurrency, cn } from '../../lib/utils'
import Badge from '../../components/ui/Badge'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import EditSubscriptionModal from '../../components/subscription/EditSubscriptionModal'
import InteractiveCalendar from '../../components/subscription/InteractiveCalendar'
import { Edit2 } from 'lucide-react'
import toast from 'react-hot-toast'

/* ─────────────────────────────────────────────────────────────────────────────
 * MY SUBSCRIPTIONS
 * Manage your recurring milk and dairy deliveries.
 * ───────────────────────────────────────────────────────────────────────────── */

const MySubscriptions = () => {
  const queryClient = useQueryClient()
  const { data: subsResponse, isLoading: isLoadingSubs } = useQuery({
    queryKey: ['my-subscriptions'],
    queryFn: () => subscriptionService.getMySubscriptions(),
  })

  const { data: couponsResponse } = useQuery({
    queryKey: ['active-coupons'],
    queryFn: () => couponService.getActiveCoupons(),
  })

  if (isLoadingSubs) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-[#0a0a0a]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
          <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-gray-400">Opening Your Milk Plans...</p>
        </div>
      </div>
    )
  }

  const subscriptions = subsResponse?.data || []
  const coupons = couponsResponse?.data || []

  return (
    <div className="bg-white dark:bg-[#0a0a0a] min-h-screen pb-32">
      {/* 1. WELCOME HEADER */}
      <div className="border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-[#0a0a0a] pt-24 pb-12 lg:pt-32 lg:pb-16">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-[10px] font-bold text-primary-600 uppercase tracking-[0.4em] mb-4 flex items-center gap-2 italic font-mono">
            <RefreshCw className="w-4 h-4" /> Welcome Back, Customer
          </h2>
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white tracking-tighter leading-none mb-4">
            Your Milk <span className="text-gray-400 font-medium text-4xl">Plans</span>
          </h1>
          <p className="text-xs text-gray-500 font-bold uppercase tracking-widest leading-loose max-w-2xl">
            Track your daily deliveries, check your monthly bill, and manage your service from this central dashboard.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-12 lg:py-20 space-y-20">
        {subscriptions.length === 0 ? (
          <div className="text-center py-40 border-4 border-dashed border-gray-100 dark:border-gray-800 bg-gray-50/30 dark:bg-[#0a0a0a]">
            <Package className="w-16 h-16 text-gray-200 dark:text-gray-800 mx-auto mb-6" />
            <h2 className="text-xl font-bold text-gray-900 dark:text-white uppercase tracking-widest mb-2 italic">No Active Plans Found</h2>
            <p className="text-[10px] text-gray-500 font-black uppercase tracking-[0.2em] mb-8">Start your journey with fresh milk today!</p>
            <Link to="/products">
              <button className="px-12 py-4 bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-[10px] font-black uppercase tracking-[0.3em] shadow-2xl hover:bg-primary-600 hover:text-white transition-all">
                Browse Products
              </button>
            </Link>
          </div>
        ) : (
          <div className="space-y-24">
            {subscriptions.map((sub) => (
              <SubscriptionDashboardCard key={sub._id} sub={sub} coupons={coupons} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

/**
 * COMMAND CARD: THE MAIN MILK PLAN DASHBOARD COMPONENT
 */
const SubscriptionDashboardCard = ({ sub, coupons }) => {
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const [contactMessage, setContactMessage] = useState('')
  const [isEditOpen, setIsEditOpen] = useState(false)
  
  // NAVIGATION STATE: Default to current month/year
  const now = new Date()
  const [viewDate, setViewDate] = useState({ 
    month: now.getMonth() + 1, 
    year: now.getFullYear() 
  })

  const { data: snapshotData, isLoading: isLoadingSnapshot } = useQuery({
    queryKey: ['sub-snapshot', sub._id, viewDate.month, viewDate.year],
    queryFn: () => subscriptionService.getSubscriptionSnapshot(sub._id, viewDate.month, viewDate.year),
  })

  const updateMutation = useMutation({
    mutationFn: (data) => subscriptionService.updateSubscription(sub._id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['my-subscriptions'])
      queryClient.invalidateQueries(['sub-snapshot', sub._id, viewDate.month, viewDate.year])
      toast.success('Your plan has been updated successfully.')
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to update plan status.')
    }
  })

  const handleRequestReactivation = async () => {
    if (!contactMessage) return
    try {
      await subscriptionService.requestReactivation(sub._id, contactMessage)
      toast.success('Your message has been sent to the farm team.')
      setContactMessage('')
    } catch (err) {
      toast.error('Failed to send message. Please try again later.')
    }
  }

  const handlePrevMonth = () => {
    setViewDate(prev => {
      let newMonth = prev.month - 1
      let newYear = prev.year
      if (newMonth < 1) {
        newMonth = 12
        newYear -= 1
      }
      return { month: newMonth, year: newYear }
    })
  }

  const handleNextMonth = () => {
    setViewDate(prev => {
      let newMonth = prev.month + 1
      let newYear = prev.year
      if (newMonth > 12) {
        newMonth = 1
        newYear += 1
      }
      return { month: newMonth, year: newYear }
    })
  }

  const snapshot = snapshotData?.data || {}
  const calendar = snapshot.calendar || []
  const accruedAmount = snapshot.accruedAmount || 0
  const bill = snapshot.bill
  const isCurrentMonth = snapshot.isCurrentMonth

  return (
    <div className="relative group overflow-visible">
      
      {/* FLEX CONTAINER FOR PLAN DETAILS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-px bg-gray-100 dark:bg-gray-800 border border-gray-100 dark:border-gray-800 shadow-2xl">
        
        {/* LEFT PANEL: PLAN STATS & CONTROL */}
        <div className="lg:col-span-4 bg-white dark:bg-[#0a0a0a] p-10 space-y-10 border-r border-gray-50 dark:border-gray-900">
          <div className="flex items-start justify-between">
            <div className="relative w-28 h-28 bg-white dark:bg-[#0d0d0d] border border-gray-100 dark:border-gray-800 p-4 shadow-inner">
               <img src={sub.product?.images[0]} className="w-full h-full object-contain grayscale group-hover:grayscale-0 transition-all duration-1000" />
               <div className="absolute -top-3 -right-3 z-10">
                  <SubscriptionStatusBadge status={sub.status} />
               </div>
            </div>
            <div className="text-right">
               <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest italic mb-2">
                 {isCurrentMonth ? 'Running Total' : 'Monthly Bill Total'}
               </p>
               <h3 className="text-4xl font-bold text-gray-900 dark:text-white tracking-tighter">₹{accruedAmount}</h3>
               
               <div className="mt-4">
                 {isCurrentMonth ? (
                   <div className="flex flex-col items-end gap-1">
                      <span className="text-[9px] text-primary-600 font-bold uppercase tracking-widest bg-primary-600/5 px-2 py-0.5 border border-primary-600/10">Cycle Active</span>
                      <p className="text-[8px] text-gray-400 font-bold uppercase tracking-widest italic">Ends: {new Date(now.getFullYear(), now.getMonth() + 1, 0).toLocaleDateString()}</p>
                   </div>
                 ) : (
                   <BillStatusIndicator bill={bill} />
                 )}
               </div>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <h4 className="text-xl font-bold text-gray-900 dark:text-white uppercase tracking-tight">{sub.product?.name}</h4>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest italic mt-2">Rate: ₹{sub.product?.discountPrice || sub.product?.price} / {sub.product?.unit.split(' ')[1] || 'L'}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
               <div className="p-4 bg-gray-50/50 dark:bg-[#111111] border border-gray-100 dark:border-gray-800">
                  <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-1">Daily Qty</p>
                  <p className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-tighter">{sub.quantity} {sub.product?.unit.split(' ')[1] || 'L'}</p>
               </div>
               <div className="p-4 bg-gray-50/50 dark:bg-[#111111] border border-gray-100 dark:border-gray-800">
                  <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-1">Time Preference</p>
                  <p className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-tighter truncate">{sub.deliverySlot}</p>
               </div>
            </div>
          </div>

          <div className="pt-2">
             {!isCurrentMonth && bill && bill.status === 'Pending' ? (
               <button 
                 onClick={() => navigate('/billing')} 
                 className="w-full h-14 bg-primary-600 text-black text-[10px] font-black uppercase tracking-[0.3em] shadow-xl hover:bg-black hover:text-white transition-all flex items-center justify-center gap-3 animate-pulse"
               >
                 <CreditCard className="w-4 h-4" /> Finalize Payment
               </button>
             ) : (
               <div className="grid grid-cols-2 gap-2">
                 <button onClick={() => setIsEditOpen(true)} className="h-12 bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-[10px] font-black uppercase tracking-widest hover:bg-gray-800 dark:hover:bg-gray-100 transition-all flex items-center justify-center gap-2">
                    <Settings className="w-3 h-3" /> Settings
                 </button>
                 {sub.status === 'Active' ? (
                   <button 
                     onClick={() => updateMutation.mutate({ status: 'Paused' })}
                     disabled={updateMutation.isPending}
                     className="h-12 bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-400 text-[10px] font-black uppercase tracking-widest hover:bg-gray-50 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                   >
                     {updateMutation.isPending ? <Loader2 className="w-3 h-3 animate-spin" /> : <Pause className="w-3 h-3" />} Stop
                   </button>
                 ) : (
                   <button 
                     onClick={() => {
                       if (sub.pausedBy === 'Admin') return toast.error('This plan is locked by administration.');
                       updateMutation.mutate({ status: 'Active' });
                     }}
                     disabled={updateMutation.isPending}
                     className={cn(
                        "h-12 text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 disabled:opacity-50",
                        sub.pausedBy === 'Admin' ? "bg-red-500/10 text-red-600 cursor-not-allowed border border-red-500/10" : "bg-emerald-600 text-white hover:bg-emerald-700"
                     )}
                   >
                      {updateMutation.isPending ? <Loader2 className="w-3 h-3 animate-spin" /> : <Play className="w-3 h-3" />} {sub.pausedBy === 'Admin' ? 'Locked' : 'Start'}
                   </button>
                 )}
               </div>
             )}
          </div>
        </div>

        {/* RIGHT PANEL: INTERACTIVE DELIVERY CALENDAR */}
        <div className="lg:col-span-8 bg-gray-50/10 dark:bg-[#0c0c0c] p-6 lg:p-10 space-y-8">
          <InteractiveCalendar
            sub={sub}
            snapshot={snapshot}
            viewDate={viewDate}
            onPrevMonth={handlePrevMonth}
            onNextMonth={handleNextMonth}
            isLoadingSnapshot={isLoadingSnapshot}
          />

           {/* MONTHLY METRICS */}
           <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t border-gray-100 dark:border-gray-800">
              <div className="space-y-4">
                <h4 className="text-[9px] font-black uppercase tracking-[0.4em] text-gray-400 italic flex items-center gap-2">
                   <Activity className="w-3 h-3 text-primary-600" /> Plan Statistics
                </h4>
                <div className="grid grid-cols-2 gap-px bg-gray-100 dark:bg-gray-800 border border-gray-100 dark:border-gray-800">
                   <div className="p-6 bg-white dark:bg-[#0a0a0a]">
                      <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-1 italic">Deliveries</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white tracking-tighter italic">{calendar.filter(d => d.status === 'Delivered').length}</p>
                   </div>
                   <div className="p-6 bg-white dark:bg-[#0a0a0a]">
                      <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-1 italic">Skipped Days</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white tracking-tighter italic">{(sub.dayOverrides || []).filter(o => o.action === 'Skip').length}</p>
                   </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-[9px] font-black uppercase tracking-[0.4em] text-gray-400 italic flex items-center gap-2 underline decoration-primary-600 underline-offset-4">
                   <ArrowUpRight className="w-3 h-3" /> Quick Navigation
                </h4>
                <div className="space-y-2">
                   <button onClick={() => navigate('/billing')} className="w-full h-12 border border-gray-200 dark:border-gray-800 flex items-center justify-between px-6 group hover:bg-gray-50 dark:hover:bg-[#111111] transition-all">
                      <span className="text-[10px] font-black uppercase tracking-widest text-gray-600 dark:text-gray-400">Check Full Bill</span>
                      <ExternalLink className="w-3 h-3 opacity-30 group-hover:opacity-100 transition-opacity" />
                   </button>
                   <button onClick={() => navigate('/wallet')} className="w-full h-12 border border-gray-200 dark:border-gray-800 flex items-center justify-between px-6 group hover:bg-gray-50 dark:hover:bg-[#111111] transition-all">
                      <span className="text-[10px] font-black uppercase tracking-widest text-gray-600 dark:text-gray-400">My Wallet</span>
                      <ArrowUpRight className="w-3 h-3 opacity-30 group-hover:opacity-100 transition-opacity" />
                   </button>
                </div>
              </div>
           </div>
        </div>
      </div>

      {/* ADMINISTRATION MESSAGING TERMINAL */}
      {sub.pausedBy === 'Admin' && (
        <div className="mt-8 bg-black dark:bg-[#0d0d0d] border border-gray-800 p-10 space-y-6 relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-32 h-1 bg-primary-600" />
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
            <div className="space-y-4 max-w-xl">
              <div className="flex items-center gap-3">
                 <Terminal className="w-4 h-4 text-primary-600" />
                 <h5 className="text-[10px] font-black text-white uppercase tracking-[0.5em] italic">Ask to Resume Your Plan</h5>
              </div>
              <p className="text-[11px] text-gray-400 font-bold uppercase tracking-widest leading-relaxed">
                Your service is currently stopped. Send a message to the farm team to start it again.
              </p>
            </div>
            <div className="flex-1 flex gap-3">
              <Input 
                placeholder="TYPE YOUR MESSAGE HERE..."
                value={contactMessage}
                onChange={(e) => setContactMessage(e.target.value)}
                className="!rounded-none !bg-[#151515] !border-gray-800 text-white font-mono text-[11px] h-14 placeholder:italic"
              />
              <button 
                onClick={handleRequestReactivation}
                className="h-14 bg-white text-black px-12 text-[10px] font-black uppercase tracking-widest hover:bg-primary-600 transition-all shadow-2xl"
              >
                Send Message
              </button>
            </div>
          </div>
        </div>
      )}

      <EditSubscriptionModal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        subscription={sub}
      />
    </div>
  )
}

const BillStatusIndicator = ({ bill }) => {
  if (!bill) {
    return (
      <div className="flex items-center gap-1.5 px-3 py-1 border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-[#0d0d0d]">
        <Clock className="w-2.5 h-2.5 text-gray-400" />
        <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest italic">Processing</span>
      </div>
    )
  }

  const baseClass = "px-3 py-1 inline-flex items-center gap-2 border text-[9px] font-black uppercase tracking-widest italic"

  switch (bill.status) {
    case 'Paid':
      return (
        <div className={cn(baseClass, "bg-emerald-500/5 text-emerald-600 border-emerald-500/20")}>
          <Check className="w-3 h-3" /> Paid
        </div>
      )
    case 'Review':
      return (
        <div className={cn(baseClass, "bg-amber-500/5 text-amber-600 border-amber-500/20 animate-pulse")}>
          <Clock className="w-3 h-3" /> Checking Payment
        </div>
      )
    default:
      return (
        <div className={cn(baseClass, "bg-red-500/5 text-red-600 border-red-500/20")}>
          <AlertCircle className="w-3 h-3" /> Still Unpaid
        </div>
      )
  }
}


const SubscriptionStatusBadge = ({ status }) => {
  const baseClass = "px-3 py-1 text-[9px] font-black uppercase tracking-widest shadow-sm ring-2 ring-white dark:ring-[#0a0a0a]"
  switch (status) {
    case 'Active': return <span className={`${baseClass} bg-emerald-600 text-white`}>Active</span>
    case 'Paused': return <span className={`${baseClass} bg-amber-500 text-white`}>Paused</span>
    case 'Cancelled': return <span className={`${baseClass} bg-red-600 text-white`}>Cancelled</span>
    default: return <span className={`${baseClass} bg-gray-500 text-white`}>{status}</span>
  }
}

export default MySubscriptions
