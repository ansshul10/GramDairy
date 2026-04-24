import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { 
  BarChart3, 
  Search, 
  Filter, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  Activity, 
  RefreshCw, 
  FileText, 
  Download, 
  ExternalLink,
  ShieldCheck,
  Zap,
  User,
  MoreVertical,
  CreditCard
} from 'lucide-react'
import billingService from '../../services/billingService'
import { formatCurrency, cn } from '../../lib/utils'
import Badge from '../../components/ui/Badge'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import Modal from '../../components/ui/Modal'
import toast from 'react-hot-toast'

/* ─────────────────────────────────────────────────────────────────────────────
 * ADMIN BILLING OPERATIONS TERMINAL
 * Specialized interface for managing corporate accounts and debt recovery.
 * ───────────────────────────────────────────────────────────────────────────── */

const AdminBillingDashboard = () => {
  const queryClient = useQueryClient()
  const [filterStatus, setFilterStatus] = useState('')
  const [genMonth, setGenMonth] = useState(new Date().getMonth() + 1)
  const [genYear, setGenYear] = useState(new Date().getFullYear())
  const [selectedBill, setSelectedBill] = useState(null)
  const [isVerifyOpen, setIsVerifyOpen] = useState(false)

  const { data: response, isLoading } = useQuery({
    queryKey: ['admin-bills', filterStatus],
    queryFn: () => billingService.getAllBills(filterStatus),
  })

  const generateMutation = useMutation({
    mutationFn: () => billingService.generateBills(genMonth, genYear),
    onSuccess: (data) => {
      toast.success(`Success: ${data.data.count} bills generated protocols.`)
      queryClient.invalidateQueries(['admin-bills'])
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Error executing cycle')
  })

  const verifyMutation = useMutation({
    mutationFn: ({ id, status }) => billingService.verifyBill(id, status),
    onSuccess: () => {
      toast.success('Protocol Verified')
      queryClient.invalidateQueries(['admin-bills'])
    }
  })

  const bills = response?.data || []

  return (
    <div className="space-y-12 animate-in fade-in duration-700 pb-20">
      
      {/* 1. OPERATIONS HEADER */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-10 border-b border-gray-100 dark:border-gray-800 pb-12">
        <div>
          <h2 className="text-[10px] font-bold text-primary-600 uppercase tracking-[0.4em] mb-3 flex items-center gap-2 italic">
            <CreditCard className="w-4 h-4" /> Bill Management
          </h2>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white tracking-tighter leading-none mb-4">
            Billing <span className="text-gray-400 font-medium text-3xl italic">Dashboard</span>
          </h1>
          <div className="flex items-center gap-6">
             <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-none bg-emerald-500" />
                <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest leading-none">Active Cycle: Verified</span>
             </div>
             <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-none bg-primary-600" />
                <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest leading-none">Gateway Status: Online</span>
             </div>
          </div>
        </div>

        {/* CYCLE GENERATION CONTROL */}
        <div className="p-8 bg-gray-50/50 dark:bg-[#111111] border border-gray-200 dark:border-gray-800 space-y-6 lg:w-96 shadow-sm">
           <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 italic">Generate Monthly Cycles</h3>
           <div className="grid grid-cols-2 gap-4">
              <Input 
                 type="number" 
                 placeholder="MM" 
                 value={genMonth}
                 onChange={(e) => setGenMonth(e.target.value)}
                 className="!rounded-none !bg-white dark:!bg-[#0a0a0a]"
              />
              <Input 
                 type="number" 
                 placeholder="YYYY" 
                 value={genYear}
                 onChange={(e) => setGenYear(e.target.value)}
                 className="!rounded-none !bg-white dark:!bg-[#0a0a0a]"
              />
           </div>
           <Button 
             onClick={() => generateMutation.mutate()}
             disabled={generateMutation.isPending}
             className="!rounded-none h-11 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-black px-8 text-[10px] uppercase tracking-widest shadow-xl w-full"
           >
             {generateMutation.isPending ? "Generating..." : "Generate Monthly Bills"}
           </Button>
        </div>
      </div>

      {/* 2. DATA GRID */}
      <div className="space-y-8">
        <div className="flex items-center justify-between">
           <div className="flex items-center gap-4">
              {['', 'Pending', 'Review', 'Paid'].map(s => (
                <button 
                  key={s}
                  onClick={() => setFilterStatus(s)}
                  className={cn(
                    "px-6 py-2 text-[9px] font-black uppercase tracking-widest transition-all italic border-b-2",
                    filterStatus === s 
                      ? "border-primary-600 text-gray-900 dark:text-white" 
                      : "border-transparent text-gray-400 hover:text-gray-600"
                  )}
                >
                  {s || 'All Bills'}
                </button>
              ))}
           </div>
        </div>

        <div className="border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#0a0a0a] overflow-hidden shadow-2xl relative">
          <div className="absolute top-0 left-0 w-24 h-1 bg-primary-600" />
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50 dark:bg-[#0c0c0c] border-b border-gray-100 dark:border-gray-800 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
                   <th className="px-8 py-6">Bill ID</th>
                   <th className="px-8 py-6">User Details</th>
                   <th className="px-8 py-6">Total Amount (₹)</th>
                   <th className="px-8 py-6">Payment Status</th>
                   <th className="px-8 py-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                {isLoading ? (
                  [...Array(5)].map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td colSpan="5" className="px-8 py-12 bg-gray-50/10" />
                    </tr>
                  ))
                ) : bills.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-8 py-32 text-center">
                      <div className="flex flex-col items-center gap-6 opacity-20">
                          <FileText className="w-16 h-16" />
                          <p className="text-[10px] font-black uppercase tracking-[0.4em]">No financial data cached</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  bills.map((bill) => (
                    <tr key={bill._id} className="hover:bg-gray-50/50 dark:hover:bg-[#111111] transition-colors group">
                      <td className="px-8 py-8">
                         <p className="text-[11px] font-black font-mono text-gray-900 dark:text-white">#{bill._id.slice(-8).toUpperCase()}</p>
                      </td>
                      <td className="px-8 py-8">
                         <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-gray-100 dark:bg-gray-800 flex items-center justify-center relative">
                               <User className="w-4 h-4 text-gray-400" />
                            </div>
                            <div>
                               <p className="text-[11px] font-bold text-gray-900 dark:text-white uppercase tracking-tight italic">{bill.user?.name}</p>
                               <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest mt-1">{bill.month} / {bill.year}</p>
                            </div>
                         </div>
                      </td>
                      <td className="px-8 py-8">
                         <span className="text-lg font-bold text-gray-900 dark:text-white tracking-tighter italic">
                           ₹{bill.totalAmount}
                         </span>
                      </td>
                      <td className="px-8 py-8">
                         <BillStatusBadge status={bill.status} />
                      </td>
                      <td className="px-8 py-8 text-right">
                         {bill.status === 'Review' && (
                            <Button 
                              size="sm" 
                              onClick={() => { setSelectedBill(bill); setIsVerifyOpen(true); }}
                              className="!rounded-none bg-emerald-500 hover:bg-emerald-600 text-white font-black uppercase text-[8px] tracking-[0.2em] px-4"
                            >
                              Verify Payment
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

      <Modal isOpen={isVerifyOpen} onClose={() => setIsVerifyOpen(false)} title="Verify Payment">
         {selectedBill && (
            <div className="space-y-8">
               <div className="flex justify-between items-start">
                  <div>
                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1 italic">Bill Amount</p>
                    <p className="text-3xl font-bold tracking-tighter italic">₹{selectedBill.totalAmount}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1 italic">Bill ID</p>
                    <p className="text-[11px] font-black font-mono text-primary-600">#{selectedBill._id.slice(-8).toUpperCase()}</p>
                  </div>
               </div>

               <div className="space-y-4">
                  <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic flex items-center gap-2">
                     <ShieldCheck className="w-3.5 h-3.5" /> Payment Proof Details
                  </h4>
                  <div className="p-6 bg-gray-50 dark:bg-[#0c0c0c] border border-gray-100 dark:border-gray-800 space-y-4">
                     <div>
                        <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest leading-none mb-2">Transaction ID</p>
                        <p className="text-sm font-black tracking-widest text-gray-900 dark:text-white uppercase italic">{selectedBill.paymentProof?.transactionId}</p>
                     </div>
                  </div>
                  <div className="border border-gray-200 dark:border-gray-800 p-2">
                     <img src={selectedBill.paymentProof?.imageUrl} className="w-full h-auto grayscale hover:grayscale-0 transition-all cursor-zoom-in" alt="Payment Evidence" />
                  </div>
               </div>

               <Button 
                  onClick={() => verifyMutation.mutate({ id: selectedBill._id, status: 'Paid' })}
                  disabled={verifyMutation.isPending}
                  className="w-full h-16 bg-primary-600 hover:bg-primary-700 text-black font-black uppercase text-[10px] tracking-[0.4em] shadow-xl disabled:opacity-50"
               >
                  {verifyMutation.isPending ? "Validating..." : "Approve & Settle"}
               </Button>
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
      return <span className={cn(baseClass, "bg-emerald-500/10 text-emerald-600 border-emerald-500/20")}>Verified / Paid</span>
    case 'Review':
      return <span className={cn(baseClass, "bg-amber-500/10 text-amber-600 border-amber-500/20")}>In Review</span>
    case 'Pending':
      return <span className={cn(baseClass, "bg-red-500/10 text-red-600 border-red-500/20")}>Unpaid</span>
    default:
      return <span className={cn(baseClass, "bg-gray-500/10 text-gray-600 border-gray-500/20")}>{status}</span>
  }
}

export default AdminBillingDashboard
