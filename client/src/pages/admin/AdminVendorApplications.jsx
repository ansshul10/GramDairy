import React, { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { 
  Users, Search, Clock, CheckCircle2, XCircle, 
  MapPin, Phone, Mail, Building2, MoreHorizontal,
  Loader2, ExternalLink, ShieldCheck, Filter, AlertCircle
} from 'lucide-react'
import adminService from '../../services/adminService'
import toast from 'react-hot-toast'
import { format } from 'date-fns'
import AdminVendorDetailModal from '../../components/admin/AdminVendorDetailModal'

/* ─────────────────────────────────────────────────────────────────────────────
 * VENDOR REQUESTS PAGE
 * Check and approve new vendor requests for the shop.
 * ───────────────────────────────────────────────────────────────────────────── */

const StatusBadge = ({ status }) => {
  const styles = {
    Pending: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
    Approved: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
    Rejected: 'bg-rose-500/10 text-rose-500 border-rose-500/20',
  }
  return (
    <span className={`px-2 py-0.5 border text-[9px] font-black uppercase tracking-widest ${styles[status]}`}>
      {status}
    </span>
  )
}

const AdminVendorApplications = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedVendorId, setSelectedVendorId] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const queryClient = useQueryClient()

  const { data: response, isLoading } = useQuery({
    queryKey: ['vendor-applications'],
    queryFn: adminService.getVendorApplications
  })

  const approveMutation = useMutation({
    mutationFn: (id) => adminService.approveVendorApplication(id),
    onSuccess: (data) => {
      queryClient.invalidateQueries(['vendor-applications'])
      toast.success('Vendor account created successfully.')
      console.log('New Vendor Credentials:', data.data)
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Error creating vendor account.')
    }
  })

  const applications = response?.data || []
  const filteredApps = applications.filter(app => 
    app.farmName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    app.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    app.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary-600 animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* HEADER PAGE SECTION */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-gray-100 dark:border-gray-800">
         <div className="space-y-2">
            <div className="flex items-center gap-2 text-primary-600">
               <ShieldCheck className="w-4 h-4" />
               <span className="text-[10px] font-black uppercase tracking-[0.3em]">Check Requests</span>
            </div>
            <h1 className="text-4xl font-black text-gray-900 dark:text-white tracking-tighter italic uppercase">Vendor Requests</h1>
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Check and approve new vendor requests for the shop.</p>
         </div>

         <div className="flex items-center gap-4">
            <div className="relative">
               <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
               <input 
                  type="text" 
                  placeholder="SEARCH NAME OR FARM..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="h-12 w-80 bg-gray-50 dark:bg-[#0a0a0a] border border-gray-100 dark:border-gray-800 pl-12 pr-4 text-[10px] font-black uppercase tracking-widest text-gray-900 dark:text-white focus:outline-none focus:border-primary-600 transition-colors"
               />
            </div>
         </div>
      </div>

      {/* STATS OVERVIEW */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
         <div className="p-6 bg-white dark:bg-[#0a0a0a] border border-gray-100 dark:border-gray-800 space-y-4">
            <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Total Applications</p>
            <p className="text-3xl font-black text-gray-900 dark:text-white italic tracking-tighter">{applications.length}</p>
         </div>
         <div className="p-6 bg-white dark:bg-[#0a0a0a] border border-gray-100 dark:border-gray-800 space-y-4 border-l-primary-600/50">
            <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Check Soon</p>
            <p className="text-3xl font-black text-amber-500 italic tracking-tighter">
               {applications.filter(a => a.status === 'Pending').length}
            </p>
         </div>
         <div className="p-6 bg-white dark:bg-[#0a0a0a] border border-gray-100 dark:border-gray-800 space-y-4 border-l-emerald-500/50">
            <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Verified Sellers</p>
            <p className="text-3xl font-black text-emerald-500 italic tracking-tighter">
               {applications.filter(a => a.status === 'Approved').length}
            </p>
         </div>
         <div className="p-6 bg-white dark:bg-[#0a0a0a] border border-gray-100 dark:border-gray-800 space-y-4">
            <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Approval Rate</p>
            <p className="text-3xl font-black text-gray-900 dark:text-white italic tracking-tighter">
               {applications.length > 0 ? ((applications.filter(a => a.status === 'Approved').length / applications.length) * 100).toFixed(0) : 0}%
            </p>
         </div>
      </div>

      {/* APPLICATIONS TABLE */}
      <div className="bg-white dark:bg-[#0a0a0a] border border-gray-100 dark:border-gray-800 overflow-hidden shadow-2xl">
         <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
               <thead>
                  <tr className="bg-gray-50 dark:bg-[#0c0c0c] border-b border-gray-100 dark:border-gray-800">
                     <th className="p-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Vendor Info</th>
                     <th className="p-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Farm / Shop</th>
                     <th className="p-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Location / Category</th>
                     <th className="p-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Date</th>
                     <th className="p-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Status</th>
                     <th className="p-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] text-right">Actions</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-gray-50 dark:divide-gray-800/50">
                  {filteredApps.map((app) => (
                     <tr key={app._id} className="hover:bg-gray-50/50 dark:hover:bg-[#111111]/50 transition-colors group">
                        <td className="p-5">
                           <div className="flex items-center gap-4">
                              <div className="w-10 h-10 bg-gray-100 dark:bg-[#151515] flex items-center justify-center font-black text-xs text-gray-400 group-hover:text-primary-600 transition-colors">
                                 {app.fullName.charAt(0)}
                              </div>
                              <div>
                                 <p className="text-xs font-black text-gray-900 dark:text-white uppercase tracking-tight">{app.fullName}</p>
                                 <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{app.email}</p>
                              </div>
                           </div>
                        </td>
                        <td className="p-5">
                           <div className="flex items-center gap-2">
                              <Building2 className="w-3.5 h-3.5 text-gray-400" />
                              <span className="text-[10px] font-black text-gray-700 dark:text-gray-300 uppercase tracking-widest">{app.farmName}</span>
                           </div>
                        </td>
                        <td className="p-5">
                           <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                 <MapPin className="w-3 h-3 text-gray-400" />
                                 <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest truncate max-w-[150px]">{app.address}</span>
                              </div>
                              <div className="inline-block px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 text-[8px] font-black uppercase text-gray-400">
                                 {app.category}
                              </div>
                           </div>
                        </td>
                        <td className="p-5">
                           <div className="flex items-center gap-2">
                              <Clock className="w-3.5 h-3.5 text-gray-400" />
                              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{format(new Date(app.createdAt), 'dd MMM yyyy')}</span>
                           </div>
                        </td>
                        <td className="p-5">
                           <StatusBadge status={app.status} />
                        </td>
                        <td className="p-5 text-right">
                           <div className="flex items-center justify-end gap-3">
                              {app.status === 'Pending' ? (
                                 <>
                                    <button 
                                       onClick={() => {
                                          if(window.confirm(`Approve application for ${app.farmName}?`)) {
                                             approveMutation.mutate(app._id)
                                          }
                                       }}
                                       disabled={approveMutation.isPending}
                                       className="h-10 px-4 flex items-center gap-2 bg-emerald-500 text-white text-[9px] font-black uppercase tracking-widest hover:bg-emerald-600 transition-all disabled:opacity-50"
                                    >
                                       {approveMutation.isPending && approveMutation.variables === app._id ? (
                                          <Loader2 className="w-3 h-3 animate-spin" />
                                       ) : (
                                          <CheckCircle2 className="w-3 h-3" />
                                       )}
                                       Approve
                                    </button>
                                    <button className="h-10 px-4 flex items-center gap-2 border border-rose-500 text-rose-500 text-[9px] font-black uppercase tracking-widest hover:bg-rose-500 hover:text-white transition-all">
                                       <XCircle className="w-3 h-3" /> Reject
                                    </button>
                                 </>
                              ) : (
                                 <button 
                                    onClick={() => {
                                       setSelectedVendorId(app.vendor);
                                       setIsModalOpen(true);
                                    }}
                                    className="h-10 px-4 flex items-center gap-2 bg-gray-100 dark:bg-gray-800 text-gray-500 text-[9px] font-black uppercase tracking-widest hover:text-primary-600 transition-all"
                                 >
                                    <ExternalLink className="w-3 h-3" /> View Details
                                 </button>
                              )}
                           </div>
                        </td>
                     </tr>
                  ))}
                  {filteredApps.length === 0 && (
                     <tr>
                        <td colSpan="6" className="p-20 text-center">
                           <div className="space-y-4">
                              <AlertCircle className="w-10 h-10 text-gray-300 mx-auto" />
                              <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest italic">No requests found.</p>
                           </div>
                        </td>
                     </tr>
                  )}
               </tbody>
            </table>
         </div>
      </div>

      {/* VENDOR DETAIL MODAL */}
      <AdminVendorDetailModal 
         isOpen={isModalOpen}
         onClose={() => setIsModalOpen(false)}
         vendorId={selectedVendorId}
      />
    </div>
  )
}

export default AdminVendorApplications
