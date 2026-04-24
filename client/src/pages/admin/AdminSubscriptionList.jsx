import { useQuery } from '@tanstack/react-query'
import { Calendar, Package, User, Clock, CheckCircle2, AlertCircle, Search, Filter, Database, Terminal, ShieldCheck, Activity, RefreshCw } from 'lucide-react'
import subscriptionService from '../../services/subscriptionService'
import { formatCurrency, cn } from '../../lib/utils'
import Badge from '../../components/ui/Badge'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import Modal from '../../components/ui/Modal'
import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import axios from 'axios'
import { Edit2, Play, Pause, Trash2, Mail, Phone, MapPin, Info, ArrowUpRight } from 'lucide-react'

const AdminSubscriptionList = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['admin-subscriptions'],
    queryFn: () => subscriptionService.getAllSubscriptions(),
  })

  const subscriptions = data?.data || []
  const queryClient = useQueryClient()

  const [selectedSub, setSelectedSub] = useState(null)
  const [isDetailOpen, setIsDetailOpen] = useState(false)
  const [reason, setReason] = useState('')

  const handleRowClick = (sub) => {
    setSelectedSub(sub)
    setIsDetailOpen(true)
  }

  const toggleMutation = useMutation({
    mutationFn: ({ id, status, reason }) => axios.patch(`/api/v1/subscriptions/admin/toggle/${id}`, { status, reason }),
    onSuccess: () => {
      toast.success('Subscription Updated')
      queryClient.invalidateQueries(['admin-subscriptions'])
      setIsDetailOpen(false)
      setReason('')
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Error updating subscription')
  })

  // Mock pricing logic for display - in real app would sum from orders
  const dailyPrice = (selectedSub?.product?.discountPrice || selectedSub?.product?.price || 0) * (selectedSub?.quantity || 0)

  return (
    <div className="space-y-10 animate-in fade-in duration-700 pb-20">

      {/* 1. OPERATIONS HEADER */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 border-b border-gray-100 dark:border-gray-800 pb-12">
        <div>
          <h2 className="text-[10px] font-bold text-primary-600 uppercase tracking-[0.4em] mb-3 flex items-center gap-2 italic">
            <Database className="w-4 h-4" /> Subscriptions
          </h2>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white tracking-tighter leading-none mb-4">
            Subscription <span className="text-gray-400 font-medium text-3xl italic">List</span>
          </h1>
          <p className="text-[10px] text-gray-400 font-mono uppercase tracking-widest flex items-center gap-2">
            Active Subscriptions: <span className="text-emerald-500 font-black">{subscriptions.length}</span>
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-primary-600 transition-colors" />
            <Input
              placeholder="Search Subscribers..."
              className="pl-12 w-full lg:w-72 !rounded-none !bg-gray-50/50 dark:!bg-[#111111] !border-gray-200 dark:!border-gray-800"
            />
          </div>
          <Button variant="outline" className="!rounded-none h-11 border-gray-200 dark:border-gray-800 bg-white dark:bg-[#0a0a0a]">
            <Filter className="w-4 h-4 mr-2" /> Filter
          </Button>
        </div>
      </div>

      {/* 2. DATA TERMINAL */}
      <div className="border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#0a0a0a] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-1 bg-primary-600" />

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-[#0c0c0c] text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
                <th className="px-8 py-5">Sub ID</th>
                <th className="px-8 py-5">Customer</th>
                <th className="px-8 py-5">Product</th>
                <th className="px-8 py-5">Frequency</th>
                <th className="px-8 py-5">Started On</th>
                <th className="px-8 py-5 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
              {isLoading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan="6" className="px-8 py-10 bg-gray-50/10 dark:bg-gray-800/5" />
                  </tr>
                ))
              ) : subscriptions.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-8 py-20 text-center">
                    <div className="flex flex-col items-center gap-4 opacity-20">
                      <RefreshCw className="w-12 h-12" />
                      <p className="text-[10px] font-black uppercase tracking-[0.3em]">No subscriptions found</p>
                    </div>
                  </td>
                </tr>
              ) : (
                subscriptions.map((sub) => (
                  <tr
                    key={sub._id}
                    onClick={() => handleRowClick(sub)}
                    className="hover:bg-gray-50/50 dark:hover:bg-[#111111] transition-colors group cursor-pointer"
                  >
                    <td className="px-8 py-6">
                      <p className="text-[11px] font-bold font-mono text-primary-600 uppercase tracking-tighter">#{sub._id.slice(-8).toUpperCase()}</p>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-8 h-8 bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-[10px] font-black">
                          {sub.user?.name?.[0]}
                        </div>
                        <div>
                          <p className="text-[11px] font-bold text-gray-900 dark:text-white uppercase tracking-tight">{sub.user?.name}</p>
                          <p className="text-[8px] text-gray-400 font-bold uppercase tracking-widest mt-1 italic">{sub.user?.phoneNumber}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-3">
                        <Package className="w-3.5 h-3.5 text-gray-400" />
                        <span className="text-[11px] font-bold text-gray-700 dark:text-gray-300 uppercase tracking-tight">{sub.product?.name}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2">
                        <Clock className="w-3.5 h-3.5 text-primary-600" />
                        <span className="text-[10px] font-black text-gray-900 dark:text-white uppercase tracking-widest">{sub.frequency}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                        Since {new Date(sub.startDate).toLocaleDateString()}
                      </p>
                    </td>
                    <td className="px-8 py-6 text-right flex items-center justify-end gap-3">
                      {sub.lastReactivationMessage && (
                        <div className="flex items-center gap-1.5 animate-pulse">
                          <div className="w-1.5 h-1.5 rounded-full bg-primary-600" />
                          <span className="text-[8px] font-black text-primary-600 uppercase tracking-widest">New Request</span>
                        </div>
                      )}
                      <AdminStatusBadge status={sub.status} />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 3. SUBSCRIPTION DETAIL MODAL */}
      <Modal
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        title="Subscription Details"
        className="max-w-3xl !rounded-none border-4 border-gray-900 dark:border-gray-800 shadow-2xl"
      >
        {selectedSub && (
          <div className="space-y-10 p-2">

            {/* USER DISCLOSURE */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="p-8 bg-gray-50 dark:bg-[#111111] border border-gray-200 dark:border-gray-800 relative">
                <User className="absolute top-4 right-4 w-12 h-12 text-gray-100 dark:text-gray-900 z-0" />
                <div className="relative z-10 space-y-4">
                  <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-primary-600 italic">Customer Details</h4>
                  <div>
                    <p className="text-xl font-bold text-gray-900 dark:text-white tracking-tighter uppercase">{selectedSub.user?.name}</p>
                    <div className="flex flex-col gap-2 mt-4">
                      <div className="flex items-center gap-2 text-[10px] font-bold text-gray-500 uppercase tracking-widest italic">
                        <Phone className="w-3.5 h-3.5" /> {selectedSub.user?.phoneNumber}
                      </div>
                      <div className="flex items-center gap-2 text-[10px] font-bold text-gray-500 uppercase tracking-widest italic">
                        <Mail className="w-3.5 h-3.5" /> {selectedSub.user?.email || 'N/A'}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-8 border border-gray-100 dark:border-gray-800 space-y-6">
                <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 italic">Delivery Details</h4>
                <div className="space-y-4">
                  <div className="flex justify-between items-end border-b border-gray-50 dark:border-gray-900 pb-3">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Daily Quota</span>
                    <span className="text-sm font-bold text-gray-900 dark:text-white uppercase">{selectedSub.quantity} L</span>
                  </div>
                  <div className="flex justify-between items-end border-b border-gray-50 dark:border-gray-900 pb-3">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Daily Revenue</span>
                    <span className="text-sm font-bold text-emerald-600 uppercase">₹{dailyPrice}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* LOGISTICS HISTORY (MOCK FOR NOW) */}
            <div className="space-y-4">
              <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 flex items-center gap-2 italic">
                <Activity className="w-4 h-4" /> Recent Delivery Logs
              </h4>
              <div className="bg-gray-50 dark:bg-[#0c0c0c] border border-gray-200 dark:border-gray-800 overflow-hidden">
                <div className="p-6 text-center text-[10px] font-black text-gray-500 uppercase tracking-[0.4em] italic opacity-50">
                  Automatic delivery tracking enabled
                </div>
              </div>
            </div>

            {/* CUSTOMER REACTIVATION MESSAGE */}
            {selectedSub.lastReactivationMessage && (
              <div className="border-2 border-primary-600/30 bg-primary-50/5 dark:bg-primary-900/5 p-8 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-2 opacity-50">
                  <ArrowUpRight className="w-8 h-8 text-primary-600/20" />
                </div>
                <div className="relative z-10 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary-600 text-black">
                      <Terminal className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-primary-600 italic">Reactivation Protocol Request</h4>
                      <p className="text-[9px] text-gray-500 font-bold uppercase tracking-widest mt-0.5">Origin: Customer Dashboard • Channel: Direct</p>
                    </div>
                  </div>
                  
                  <div className="bg-white dark:bg-[#0a0a0a] border border-gray-100 dark:border-gray-800 p-6 shadow-inner">
                    <p className="text-xs font-bold text-gray-900 dark:text-gray-100 leading-relaxed italic">
                      "{selectedSub.lastReactivationMessage}"
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[9px] font-black text-emerald-600 uppercase tracking-widest">Awaiting Command Authorization</span>
                  </div>
                </div>
              </div>
            )}

            {/* CONTROL TERMINAL */}
            <div className="pt-8 border-t border-gray-100 dark:border-gray-800 space-y-6">
              <div className="flex items-center gap-3">
                <AlertCircle className="w-4 h-4 text-primary-600" />
                <h4 className="text-[10px] font-bold text-gray-900 dark:text-white uppercase tracking-[0.3em] italic">Change Subscription Status</h4>
              </div>
              <div className="space-y-6">
                <Input
                  placeholder="REASON FOR CHANGING STATUS..."
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="!rounded-none !bg-gray-50/50 dark:!bg-[#111111] !border-gray-200 dark:!border-gray-800 placeholder:italic font-bold"
                />
                <div className="border border-gray-200 dark:border-gray-800">
                  <button
                    onClick={() => {
                        const newStatus = selectedSub.status === 'Active' ? 'Paused' : 'Active';
                        toggleMutation.mutate({ id: selectedSub._id, status: newStatus, reason });
                    }}
                    disabled={toggleMutation.isPending || !reason}
                    className={cn(
                        "w-full px-6 py-8 font-black uppercase text-[11px] tracking-[0.4em] flex items-center justify-center gap-4 transition-all disabled:opacity-50 shadow-xl",
                        selectedSub.status === 'Active' 
                            ? "bg-red-600 hover:bg-rose-700 text-white" 
                            : "bg-emerald-600 hover:bg-emerald-700 text-white"
                    )}
                  >
                    {toggleMutation.isPending ? (
                      <RefreshCw className="w-5 h-5 animate-spin" />
                    ) : selectedSub.status === 'Active' ? (
                        <><Pause className="w-5 h-5" /> Stop Subscription</>
                    ) : (
                        <><Play className="w-5 h-5" /> Start Subscription</>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}

const AdminStatusBadge = ({ status }) => {
  const baseClass = "px-4 py-1.5 text-[8px] font-black uppercase tracking-[0.2em] border rounded-none italic"
  switch (status) {
    case 'active':
      return <span className={cn(baseClass, "bg-emerald-500/10 text-emerald-600 border-emerald-500/20")}>Active</span>
    case 'paused':
      return <span className={cn(baseClass, "bg-amber-500/10 text-amber-600 border-amber-500/20")}>Paused</span>
    case 'cancelled':
      return <span className={cn(baseClass, "bg-red-500/10 text-red-600 border-red-500/20")}>Cancelled</span>
    default:
      return <span className={cn(baseClass, "bg-gray-500/10 text-gray-600 border-gray-500/20")}>{status}</span>
  }
}

export default AdminSubscriptionList
