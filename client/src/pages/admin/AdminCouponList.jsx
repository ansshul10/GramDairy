import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Plus, Trash2, Tag, Calendar, ShoppingBag, Loader2, Database, ShieldCheck, Terminal, X, RefreshCw, Activity } from 'lucide-react'
import couponService from '../../services/couponService'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import Badge from '../../components/ui/Badge'
import Modal from '../../components/ui/Modal'
import { useForm } from 'react-hook-form'
import { cn } from '../../lib/utils'

/* ─────────────────────────────────────────────────────────────────────────────
 * COUPON MANAGEMENT (Admin Coupon List)
 * A clean interface for managing store-wide promotional coupons.
 * ───────────────────────────────────────────────────────────────────────────── */

const AdminCouponList = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const queryClient = useQueryClient()

  const { data, isLoading } = useQuery({
    queryKey: ['admin-coupons'],
    queryFn: () => couponService.getCoupons(),
  })

  const deleteMutation = useMutation({
    mutationFn: (id) => couponService.deleteCoupon(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-coupons'])
    },
  })

  const coupons = data?.data || []

  return (
    <div className="space-y-12 animate-in fade-in duration-700 bg-white dark:bg-[#0a0a0a]">
      
      {/* COUPON HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-8 border-b border-gray-100 dark:border-gray-800 pb-10">
        <div>
          <h2 className="text-[10px] font-bold text-primary-600 uppercase tracking-[0.4em] mb-3 flex items-center gap-2 italic">
            Active Store Coupons
          </h2>
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white tracking-tighter leading-none italic">
            Manage <span className="text-gray-400 font-medium">Coupons</span>
          </h1>
        </div>
        <button 
           onClick={() => setIsModalOpen(true)}
           className="px-8 py-4 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-bold uppercase tracking-[0.2em] text-[10px] flex items-center gap-3 hover:opacity-90 transition-all shadow-2xl rounded-none"
        >
          <Plus className="w-4 h-4" /> Add New Coupon
        </button>
      </div>

      {/* 2. PROMO MODULE GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-gray-200 dark:bg-gray-800 border border-gray-200 dark:border-gray-800">
        {isLoading ? (
          [...Array(3)].map((_, i) => (
            <div key={i} className="h-64 bg-white dark:bg-[#0a0a0a] animate-pulse" />
          ))
        ) : (
          coupons.map((coupon) => (
            <div key={coupon._id} className="bg-white dark:bg-[#0a0a0a] p-8 group transition-colors hover:bg-gray-50 dark:hover:bg-[#111111]/30 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-6">
                <button 
                  onClick={() => deleteMutation.mutate(coupon._id)}
                  disabled={deleteMutation.isPending && deleteMutation.variables === coupon._id}
                  className="p-2 text-gray-300 hover:text-red-500 transition-colors disabled:opacity-50 rounded-none shadow-sm"
                >
                  {deleteMutation.isPending && deleteMutation.variables === coupon._id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                </button>
              </div>

              <div className="flex items-center gap-5 mb-8">
                <div className="w-12 h-12 border border-primary-600/20 bg-primary-50 dark:bg-primary-900/10 flex items-center justify-center text-primary-600 rounded-none shadow-sm">
                  <Tag className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white uppercase tracking-tighter leading-none mb-2">{coupon.code}</h3>
                  <span className={cn(
                    "px-2 py-0.5 text-[8px] font-black uppercase tracking-widest italic rounded-none",
                    coupon.isActive ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20" : "bg-gray-500/10 text-gray-600 border border-gray-500/20"
                  )}>
                    {coupon.isActive ? 'ACTIVE' : 'EXPIRED'}
                  </span>
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t border-gray-50 dark:border-gray-800">
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Discount Value</span>
                  <span className="text-[11px] font-black text-primary-600 tracking-widest">₹{coupon.discountAmount} OFF</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Min. Purchase</span>
                  <span className="text-[11px] font-bold text-gray-900 dark:text-white tracking-widest font-mono">₹{coupon.minPurchase}</span>
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-gray-50 dark:border-gray-800 italic opacity-50">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-gray-400" />
                    <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Expiry Date</span>
                  </div>
                  <span className="text-[10px] font-bold text-gray-600 dark:text-gray-400">
                    {new Date(coupon.endDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <CouponModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  )
}

const CouponModal = ({ isOpen, onClose }) => {
  const queryClient = useQueryClient()
  const { register, handleSubmit, reset, formState: { errors } } = useForm()

  const mutation = useMutation({
    mutationFn: (data) => couponService.createCoupon(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-coupons'])
      reset()
      onClose()
    },
    onError: (err) => {
      alert(err.response?.data?.message || 'Failed to create coupon')
    }
  })

  const onSubmit = (data) => {
    mutation.mutate({
      ...data,
      discountAmount: Number(data.discountAmount),
      minPurchase: Number(data.minPurchase),
    })
  }

  return (
    <Modal 
       isOpen={isOpen} 
       onClose={onClose} 
       title="Add New Coupon"
       className="!rounded-none border-4 border-gray-900 dark:border-white shadow-2xl"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="p-2 space-y-8">
        <div className="space-y-2">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Coupon Code</label>
            <Input className="!rounded-none !bg-gray-50/50 dark:!bg-[#111111] !border-gray-200 dark:!border-gray-800" {...register('code', { required: 'Code required' })} placeholder="e.g. WELCOME50" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Discount (₹)</label>
                <Input className="!rounded-none !bg-gray-50/50 dark:!bg-[#111111] !border-gray-200 dark:!border-gray-800" type="number" {...register('discountAmount', { required: 'Value required' })} placeholder="0.00" />
            </div>
            <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Min. Order (₹)</label>
                <Input className="!rounded-none !bg-gray-50/50 dark:!bg-[#111111] !border-gray-200 dark:!border-gray-800" type="number" {...register('minPurchase', { required: 'Min required' })} placeholder="0.00" />
            </div>
        </div>

        <div className="space-y-2">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Expiry Date</label>
            <Input className="!rounded-none !bg-gray-50/50 dark:!bg-[#111111] !border-gray-200 dark:!border-gray-800" type="date" {...register('endDate', { required: 'Date required' })} />
        </div>
        
        <div className="flex justify-between items-center pt-8 border-t border-gray-100 dark:border-gray-800">
          <button 
             type="button" 
             onClick={onClose}
             className="text-[10px] font-bold text-gray-400 hover:text-gray-900 dark:hover:text-white uppercase tracking-widest transition-colors"
          >
            Cancel
          </button>
          <button 
             type="submit" 
             disabled={mutation.isPending}
             className="px-10 py-5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-bold uppercase tracking-[0.2em] text-[10px] shadow-2xl hover:opacity-90 transition-all flex items-center gap-3 disabled:opacity-50 rounded-none"
          >
            {mutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Tag className="w-4 h-4" />}
            Create Coupon
          </button>
        </div>
      </form>
    </Modal>
  )
}

export default AdminCouponList
