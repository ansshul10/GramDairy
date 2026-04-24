import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { 
  FileText, 
  CheckCircle2, 
  XCircle, 
  Eye, 
  Truck, 
  Phone, 
  Mail, 
  Calendar,
  AlertCircle,
  Loader2,
  ExternalLink,
  Search,
  UserPlus,
  Terminal,
  Activity,
  Database,
  ShieldCheck,
  X,
  MapPin,
  CreditCard
} from 'lucide-react'
import deliveryService from '../../services/deliveryService'
import Button from '../../components/ui/Button'
import Badge from '../../components/ui/Badge'
import Input from '../../components/ui/Input'
import { cn } from '../../lib/utils'

/* ─────────────────────────────────────────────────────────────────────────────
 * ADMIN DELIVERY APPLICATIONS MANAGEMENT
 * A simple interface for reviewing and approving delivery partner applications.
 * ───────────────────────────────────────────────────────────────────────────── */

const AdminDeliveryApplications = () => {
  const queryClient = useQueryClient()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedApp, setSelectedApp] = useState(null)
  const [rejectReason, setRejectReason] = useState('')

  const { data: appsData, isLoading } = useQuery({
    queryKey: ['admin-delivery-apps'],
    queryFn: () => deliveryService.getApplications()
  })

  const approveMutation = useMutation({
    mutationFn: (id) => deliveryService.approveApplication(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-delivery-apps'])
      queryClient.invalidateQueries(['admin-delivery-boys'])
      setSelectedApp(null)
      alert('Success: Application approved. Delivery partner account created.')
    }
  })

  const rejectMutation = useMutation({
    mutationFn: ({ id, reason }) => deliveryService.rejectApplication(id, reason),
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-delivery-apps'])
      setSelectedApp(null)
      setRejectReason('')
      alert('Success: Application rejected.')
    }
  })

  const apps = appsData?.data || []
  const filteredApps = apps.filter(a => 
    a.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-32 bg-white dark:bg-[#0a0a0a]">
        <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
        <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-gray-400 mt-4">Loading applications...</p>
      </div>
    )
  }

  return (
    <div className="space-y-12 animate-in fade-in duration-700 bg-white dark:bg-[#0a0a0a]">
      
      {/* 1. INTAKE COMMAND HEADER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-gray-100 dark:border-gray-800 pb-10">
        <div>
          <h2 className="text-[10px] font-bold text-primary-600 uppercase tracking-[0.4em] mb-3 flex items-center gap-2 italic">
            <Activity className="w-4 h-4" /> New Applications
          </h2>
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white tracking-tighter leading-none italic">
            Application <span className="text-gray-400 font-medium">Review</span>
          </h1>
        </div>
        <div className="relative group w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              className="w-full pl-12 pr-6 py-3 bg-gray-50/50 dark:bg-[#111111] border border-gray-200 dark:border-gray-800 outline-none text-[11px] font-bold uppercase tracking-widest placeholder:text-gray-300 focus:border-primary-600 transition-colors dark:text-white rounded-none shadow-sm"
              placeholder="Search by application ID or Name..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
        </div>
      </div>

      {/* 2. APPLICATION LEDGER TERMINAL */}
      <div className="bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-gray-800 relative overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white dark:bg-[#0a0a0a] border-b border-gray-100 dark:border-gray-800 text-[9px] uppercase tracking-widest font-black text-gray-400">
                <th className="px-8 py-5">Applicant Details</th>
                <th className="px-8 py-5">Vehicle Info</th>
                <th className="px-8 py-5">Submission Date</th>
                <th className="px-8 py-5">Status</th>
                <th className="px-8 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
              {filteredApps.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-8 py-20 text-center">
                    <div className="flex flex-col items-center opacity-30">
                      <FileText className="w-12 h-12 mb-4 text-gray-300" />
                      <p className="text-[10px] font-bold uppercase text-gray-400 tracking-widest">No applications found.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredApps.map((app) => (
                  <tr key={app._id} className="hover:bg-gray-50/50 dark:hover:bg-[#111111] transition-colors group">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-gray-800 flex items-center justify-center text-gray-400 font-bold text-lg grayscale group-hover:grayscale-0 transition-all rounded-none">
                          {app.fullName[0]}
                        </div>
                        <div>
                          <p className="text-[11px] font-bold text-gray-900 dark:text-white uppercase tracking-tight">{app.fullName}</p>
                          <p className="text-[9px] text-gray-400 font-bold uppercase tracking-[0.1em] mt-1 flex items-center gap-1">
                            <Mail className="w-3 h-3" /> {app.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-3 text-gray-500">
                        <Truck className="w-4 h-4 opacity-30" />
                        <div>
                          <p className="text-[10px] font-bold text-gray-900 dark:text-white uppercase tracking-widest">{app.vehicleType}</p>
                          <p className="text-[9px] uppercase font-bold text-gray-400 tracking-tighter mt-0.5 italic">{app.vehicleNumber}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
                        <Calendar className="w-3.5 h-3.5" />
                        {new Date(app.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </p>
                    </td>
                    <td className="px-8 py-6">
                      <span className={cn(
                        "px-2 py-1 text-[9px] font-black uppercase tracking-widest italic rounded-none",
                        app.status === 'Approved' ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20" : 
                        app.status === 'Pending' ? "bg-amber-500/10 text-amber-600 border border-amber-500/20" : 
                        "bg-red-500/10 text-red-600 border border-red-500/20"
                      )}>
                        {app.status}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <button 
                        className="p-2.5 border border-gray-200 dark:border-gray-800 text-gray-400 hover:text-primary-600 transition-all group-hover:border-primary-600/30 rounded-none shadow-sm"
                        onClick={() => setSelectedApp(app)}
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 3. APPLICATION DETAILS */}
      {selectedApp && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-gray-950/40 animate-in fade-in duration-300">
          <div className="bg-white dark:bg-[#0a0a0a] border border-gray-900 dark:border-white shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col relative">
            
            {/* Modal Header */}
            <div className="p-8 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between bg-gray-50/50 dark:bg-[#0c0c0c]">
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 border border-primary-600/20 bg-primary-50 dark:bg-primary-900/10 flex items-center justify-center text-primary-600 rounded-none shadow-xl">
                  <UserPlus className="w-8 h-8" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white uppercase tracking-tighter leading-none italic">{selectedApp.fullName}</h2>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mt-2 italic">Application ID: {selectedApp._id.slice(-12).toUpperCase()}</p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedApp(null)}
                className="p-3 border border-gray-200 dark:border-gray-800 text-gray-400 hover:text-gray-900 transition-colors rounded-none"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="flex-1 overflow-y-auto p-12 custom-scrollbar">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
                
                {/* Metadata Column */}
                <div className="lg:col-span-12 xl:col-span-5 space-y-12">
                  <section className="space-y-6">
                    <h3 className="text-[10px] font-black uppercase text-gray-400 tracking-[0.3em] flex items-center gap-3">
                        <Terminal className="w-3.5 h-3.5" /> Personal Details
                    </h3>
                    <div className="grid grid-cols-1 gap-4">
                      <div className="flex items-center justify-between p-5 bg-gray-50/50 dark:bg-[#0c0c0c] border border-gray-100 dark:border-gray-800 rounded-none">
                        <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Email Address</span>
                        <span className="text-[11px] font-bold text-gray-900 dark:text-white italic">{selectedApp.email}</span>
                      </div>
                      <div className="flex items-center justify-between p-5 bg-gray-50/50 dark:bg-[#0c0c0c] border border-gray-100 dark:border-gray-800 rounded-none">
                        <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Phone Number</span>
                        <span className="text-[11px] font-bold text-gray-900 dark:text-white italic">{selectedApp.phone}</span>
                      </div>
                      <div className="p-5 bg-gray-50/50 dark:bg-[#0c0c0c] border border-gray-100 dark:border-gray-800 space-y-4 rounded-none">
                        <div className="flex items-center gap-3 border-b border-gray-100 dark:border-gray-800 pb-3">
                          <Truck className="w-4 h-4 text-primary-600" />
                          <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Vehicle Details</span>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-[11px] font-bold text-gray-900 dark:text-white uppercase italic">{selectedApp.vehicleType}</p>
                                <p className="text-[9px] font-bold text-gray-400 uppercase tracking-tighter mt-1 italic">{selectedApp.vehicleNumber}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest leading-none mb-1">License Details</p>
                                <p className="text-[11px] font-bold text-gray-900 dark:text-white font-mono">{selectedApp.licenseNumber.toUpperCase()}</p>
                            </div>
                        </div>
                      </div>
                    </div>
                  </section>

                  <section className="space-y-6">
                    <h3 className="text-[10px] font-black uppercase text-gray-400 tracking-[0.3em] flex items-center gap-3">
                        <MapPin className="w-3.5 h-3.5" /> Applicant Home Address
                    </h3>
                    <div className="p-6 bg-gray-50/50 dark:bg-[#0c0c0c] border border-gray-100 dark:border-gray-800 rounded-none shadow-sm">
                      <p className="text-[11px] font-bold leading-relaxed text-gray-600 dark:text-gray-300 uppercase italic">
                        {selectedApp.address}
                      </p>
                    </div>
                  </section>
                </div>

                {/* ID Asset Column */}
                <div className="lg:col-span-12 xl:col-span-7 space-y-6">
                  <h3 className="text-[10px] font-black uppercase text-gray-400 tracking-[0.3em] flex items-center gap-3">
                      <CreditCard className="w-3.5 h-3.5" /> ID Card Image
                  </h3>
                  <div className="relative aspect-video bg-[#0c0c0c] border border-gray-900 flex items-center justify-center group overflow-hidden">
                    {selectedApp.idCardImage ? (
                      <>
                        <img 
                          src={selectedApp.idCardImage} 
                          alt="ID Card Intake" 
                          className="w-full h-full object-contain grayscale group-hover:grayscale-0 transition-all duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-8">
                            <a 
                              href={selectedApp.idCardImage} 
                              target="_blank" 
                              rel="noreferrer"
                              className="px-6 py-3 bg-white text-gray-900 text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-gray-100 transition-colors rounded-none shadow-2xl"
                            >
                              <ExternalLink className="w-4 h-4" /> View Full Image
                            </a>
                        </div>
                        {/* Technical Overlay */}
                        <div className="absolute top-4 left-4 border-l border-t border-white/20 w-8 h-8 pointer-events-none" />
                        <div className="absolute top-4 right-4 border-r border-t border-white/20 w-8 h-8 pointer-events-none" />
                        <div className="absolute bottom-4 left-4 border-l border-b border-white/20 w-8 h-8 pointer-events-none" />
                        <div className="absolute bottom-4 right-4 border-r border-b border-white/20 w-8 h-8 pointer-events-none" />
                      </>
                    ) : (
                      <p className="text-[10px] font-bold uppercase text-gray-700 tracking-widest flex items-center gap-3">
                        <AlertCircle className="w-4 h-4 text-red-500" /> [Error]: No ID card image found
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer Controls */}
            {selectedApp.status === 'Pending' && (
              <div className="p-10 border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-[#0c0c0c]">
                <div className="flex flex-col gap-10">
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="flex-1 relative">
                        <input 
                          type="text"
                          placeholder="Enter rejection reason (Optional)..."
                          className="w-full bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-gray-800 px-6 py-4 text-[11px] font-bold uppercase tracking-widest placeholder:text-gray-300 focus:border-primary-600 outline-none transition-colors dark:text-white rounded-none shadow-sm"
                          value={rejectReason}
                          onChange={(e) => setRejectReason(e.target.value)}
                        />
                    </div>
                    <div className="flex gap-px bg-gray-200 dark:bg-gray-800 border border-gray-200 dark:border-gray-800 shadow-2xl">
                        <button 
                          className="px-10 py-4 bg-white dark:bg-[#0a0a0a] text-red-600 text-[10px] font-black uppercase tracking-widest flex items-center gap-3 hover:bg-red-50 transition-colors disabled:opacity-50 rounded-none"
                          onClick={() => rejectMutation.mutate({ id: selectedApp._id, reason: rejectReason })}
                          disabled={rejectMutation.isPending}
                        >
                          {rejectMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <XCircle className="w-4 h-4" />}
                          Reject Application
                        </button>
                        <button 
                          className="px-12 py-4 bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-[10px] font-black uppercase tracking-widest flex items-center gap-3 hover:opacity-90 transition-colors disabled:opacity-50 rounded-none"
                          onClick={() => approveMutation.mutate(selectedApp._id)}
                          disabled={approveMutation.isPending}
                        >
                          {approveMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                          Approve Application
                        </button>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 justify-center py-3 px-6 bg-white dark:bg-[#0a0a0a] border border-gray-100 dark:border-gray-800 italic rounded-none shadow-sm">
                      <ShieldCheck className="w-4 h-4 text-emerald-500" />
                      <p className="text-[9px] text-gray-400 font-bold uppercase tracking-[0.2em] text-center">
                        Caution: Approving this application will create a delivery partner account.
                      </p>
                  </div>
                </div>
              </div>
            )}
            
            {selectedApp.status === 'Approved' && (
              <div className="p-8 border-t border-emerald-500/20 bg-emerald-50/20 dark:bg-emerald-900/10 text-center rounded-none shadow-inner">
                <p className="text-emerald-600 text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-3 italic">
                  <CheckCircle2 className="w-4 h-4" /> Application approved. Delivery partner account active.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminDeliveryApplications
