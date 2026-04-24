import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
   FileText,
   Search,
   CreditCard,
   ShieldCheck,
   Clock,
   CheckCircle2,
   AlertCircle,
   ArrowRight,
   Upload,
   Image as ImageIcon,
   Activity,
   Zap,
   Info
} from 'lucide-react'
import billingService from '../../services/billingService'
import { formatCurrency, cn } from '../../lib/utils'
import Badge from '../../components/ui/Badge'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import Modal from '../../components/ui/Modal'
import toast from 'react-hot-toast'
import useAuthStore from '../../store/authStore'

const UserBilling = () => {
   const queryClient = useQueryClient()
   const { user } = useAuthStore()
   const [selectedBill, setSelectedBill] = useState(null)
   const [isPayModalOpen, setIsPayModalOpen] = useState(false)
   const [transactionId, setTransactionId] = useState('')
   const [imageUrl, setImageUrl] = useState('') // Placeholder for actual upload logic

   const { data: response, isLoading } = useQuery({
      queryKey: ['my-bills'],
      queryFn: () => billingService.getMyBills(),
   })

   const bills = response?.data || []

   const payMutation = useMutation({
      mutationFn: ({ id, data }) => billingService.submitProof(id, data),
      onSuccess: () => {
         toast.success('Payment Record Sent for Approval')
         setIsPayModalOpen(false)
         setTransactionId('')
         setImageUrl('')
         queryClient.invalidateQueries(['my-bills'])
      },
      onError: (err) => toast.error(err.response?.data?.message || 'Error submitting proof')
   })

   const handleOpenPay = (bill) => {
      setSelectedBill(bill)
      setIsPayModalOpen(true)
   }

   return (
      <div className="max-w-[1400px] mx-auto px-6 py-12 lg:py-20 animate-in fade-in duration-700 space-y-12">

         {/* 1. FINANCIAL HEADER */}
         <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-10 border-b border-gray-100 dark:border-gray-800 pb-12">
            <div>
               <h2 className="text-[10px] font-bold text-primary-600 uppercase tracking-[0.4em] mb-4 flex items-center gap-3 italic">
                  <Zap className="w-4 h-4" /> My Dues
               </h2>
               <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white tracking-tighter leading-none mb-6">
                  My <span className="text-gray-400 font-medium italic">Bills</span>
               </h1>
               <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2">
                     <ShieldCheck className="w-4 h-4 text-emerald-500" />
                     <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">Account Active</span>
                  </div>
               </div>
            </div>

            {/* AMOUNT DUE CARD */}
            <div className="p-8 bg-[#0a0a0a] border border-gray-900 text-white flex flex-col items-center justify-center min-w-[300px] shadow-2xl relative overflow-hidden group">
               <div className="absolute top-0 right-0 w-16 h-1 bg-primary-600" />
               <p className="text-[9px] font-black text-gray-500 uppercase tracking-[0.4em] mb-4">Total To Pay</p>
               <p className="text-5xl font-bold tracking-tighter text-white italic group-hover:scale-105 transition-transform">
                  ₹{user?.totalPendingBill || 0}
               </p>
               <div className={`mt-6 inline-flex items-center gap-2 px-4 py-1.5 border ${user?.totalPendingBill > 0 ? 'border-red-500/20 text-red-500 bg-red-500/5' : 'border-emerald-500/20 text-emerald-500 bg-emerald-500/5'} text-[8px] font-black uppercase tracking-widest`}>
                  <div className={`w-1.5 h-1.5 rounded-none ${user?.totalPendingBill > 0 ? 'bg-red-500 animate-pulse' : 'bg-emerald-500'}`} />
                  {user?.totalPendingBill > 0 ? 'Payment Due' : 'No Balance'}
               </div>
            </div>
         </div>

         {/* 2. BILLING HISTORY */}
         <div className="space-y-8">
            <h3 className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-[0.3em] flex items-center gap-3">
               <FileText className="w-4 h-4" /> Previous Bills
            </h3>

            <div className="border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#0a0a0a] shadow-2xl overflow-hidden relative">
               <div className="absolute top-0 left-0 w-24 h-1 bg-gray-200 dark:bg-gray-800" />
               <div className="overflow-x-auto">
                  <table className="w-full text-left">
                     <thead>
                        <tr className="bg-gray-50/50 dark:bg-[#0c0c0c] border-b border-gray-100 dark:border-gray-800 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
                           <th className="px-8 py-6">Invoice Number</th>
                           <th className="px-8 py-6">Month / Year</th>
                           <th className="px-8 py-6">Amount (₹)</th>
                           <th className="px-8 py-6">Due Date</th>
                           <th className="px-8 py-6">Status</th>
                           <th className="px-8 py-6 text-right">Action</th>
                        </tr>
                     </thead>
                     <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                        {isLoading ? (
                           [...Array(3)].map((_, i) => <tr key={i} className="animate-pulse"><td colSpan="6" className="px-8 py-10" /></tr>)
                        ) : bills.length === 0 ? (
                           <tr><td colSpan="6" className="px-8 py-24 text-center text-gray-400 uppercase text-[9px] font-bold tracking-widest italic opacity-40">No past records found</td></tr>
                        ) : (
                           bills.map(bill => (
                              <tr key={bill._id} className="hover:bg-gray-50/50 dark:hover:bg-[#111111] transition-colors group">
                                 <td className="px-8 py-8 px-8">
                                    <span className="text-[10px] font-black font-mono text-primary-600">#{bill._id.slice(-8).toUpperCase()}</span>
                                 </td>
                                 <td className="px-8 py-8">
                                    <span className="text-[11px] font-bold text-gray-900 dark:text-white uppercase italic">{bill.month} / {bill.year}</span>
                                 </td>
                                 <td className="px-8 py-8">
                                    <span className="text-lg font-bold text-gray-900 dark:text-white tracking-tighter italic">₹{bill.totalAmount}</span>
                                 </td>
                                 <td className="px-8 py-8">
                                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{new Date(bill.dueDate).toLocaleDateString()}</span>
                                 </td>
                                 <td className="px-8 py-8">
                                    <BillStatusBadge status={bill.status} />
                                 </td>
                                 <td className="px-8 py-8 text-right">
                                    {bill.status === 'Pending' && (
                                       <Button
                                          size="sm"
                                          onClick={() => handleOpenPay(bill)}
                                          className="!rounded-none bg-gray-900 dark:bg-white text-white dark:text-black font-black uppercase text-[8px] tracking-[0.2em] px-6 h-10 shadow-xl"
                                       >
                                          Pay Now
                                       </Button>
                                    )}
                                 </td>
                              </tr>
                           ))
                        )}
                     </tbody>
                  </table>
               </div>
            </div>
         </div>

         {/* 3. PAYMENT MODAL */}
         <Modal
            isOpen={isPayModalOpen}
            onClose={() => setIsPayModalOpen(false)}
            title="Pay Bill"
            className="max-w-xl !rounded-none border-4 border-gray-900 dark:border-gray-800 shadow-2xl"
         >
            {selectedBill && (
               <div className="space-y-10 p-2">
                  <div className="flex items-center justify-between p-6 bg-gray-50 dark:bg-[#111111] border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white">
                     <div>
                        <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1 italic">Total Amount</p>
                        <p className="text-3xl font-bold tracking-tighter italic">₹{selectedBill.totalAmount}</p>
                     </div>
                     <div className="text-right">
                        <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1 italic">Invoice No.</p>
                        <p className="text-[11px] font-black font-mono text-primary-600">#{selectedBill._id.slice(-8).toUpperCase()}</p>
                     </div>
                  </div>

                  <div className="space-y-6">
                     <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2 italic">
                           <Activity className="w-3 h-3" /> Transaction Number
                        </label>
                        <Input
                           placeholder="ENTER UTR OR TXN REFERENCE..."
                           value={transactionId}
                           onChange={(e) => setTransactionId(e.target.value)}
                           className="!rounded-none !bg-white dark:!bg-[#0a0a0a] font-bold text-sm tracking-widest uppercase italic"
                        />
                     </div>

                     <div className="p-8 border-2 border-dashed border-gray-200 dark:border-gray-800 flex flex-col items-center gap-6 group hover:border-primary-600/30 transition-colors bg-gray-50/50 dark:bg-[#111111]/50 cursor-pointer">
                        <div className="w-16 h-16 bg-white dark:bg-[#0a0a0a] border border-gray-100 dark:border-gray-800 flex items-center justify-center text-gray-300 group-hover:text-primary-600 transition-colors">
                           <ImageIcon className="w-8 h-8" />
                        </div>
                        <div className="text-center">
                           <p className="text-[10px] font-black text-gray-900 dark:text-white uppercase tracking-[0.3em] mb-2 italic">Add Payment Picture</p>
                           <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest italic leading-relaxed">Upload a photo of your transaction to get it checked.</p>
                        </div>
                        {/* For now we use a mocked imageUrl as actual upload service might not be fully configured in sandbox */}
                        <Input
                           placeholder="PROOF IMAGE URL (SIMULATED)"
                           className="!rounded-none !bg-white dark:!bg-[#0a0a0a] !text-[10px]"
                           value={imageUrl}
                           onChange={(e) => setImageUrl(e.target.value)}
                        />
                     </div>
                  </div>

                  <div className="pt-6 border-t border-gray-100 dark:border-gray-800">
                     <Button
                        onClick={() => payMutation.mutate({ id: selectedBill._id, data: { transactionId, imageUrl } })}
                        disabled={payMutation.isPending || !transactionId || !imageUrl}
                        className="w-full h-16 bg-primary-600 hover:bg-primary-700 text-black font-black uppercase text-[10px] tracking-[0.4em] shadow-xl disabled:opacity-50"
                     >
                        {payMutation.isPending ? <Activity className="w-4 h-4 animate-spin" /> : "Submit Payment"}
                     </Button>
                  </div>

                  <div className="flex items-center gap-4 p-4 bg-amber-500/5 border border-amber-500/10">
                     <Info className="w-4 h-4 text-amber-600" />
                     <p className="text-[8px] font-black text-amber-600 uppercase tracking-widest italic leading-relaxed">
                        Submitting incorrect or fake information will result in your account being blocked.
                     </p>
                  </div>
               </div>
            )}
         </Modal>
      </div>
   )
}

const BillStatusBadge = ({ status }) => {
   const baseClass = "px-4 py-1.5 text-[8px] font-black uppercase tracking-[0.2em] italic border"
   switch (status) {
      case 'Paid':
         return <span className={cn(baseClass, "bg-emerald-500/10 text-emerald-600 border-emerald-500/20")}>Paid</span>
      case 'Review':
         return <span className={cn(baseClass, "bg-amber-500/10 text-amber-600 border-amber-500/20")}>Checking Payment</span>
      case 'Pending':
         return <span className={cn(baseClass, "bg-red-500/10 text-red-600 border-red-500/20")}>Due</span>
      default:
         return <span className={cn(baseClass, "bg-gray-500/10 text-gray-600 border-gray-500/20")}>{status}</span>
   }
}

export default UserBilling
