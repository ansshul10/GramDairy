import React, { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
   X, Mail, Phone, MapPin, Building2,
   ShieldAlert, Trash2, MessageSquare,
   CheckCircle, Loader2, AlertTriangle,
   User, Calendar, Activity, ExternalLink, ShieldCheck
} from 'lucide-react'
import adminService from '../../services/adminService'
import toast from 'react-hot-toast'
import { format } from 'date-fns'

/* ─────────────────────────────────────────────────────────────────────────────
 * ADMIN VENDOR DETAIL MODAL
 * High-density management interface for an active farm partner.
 * ───────────────────────────────────────────────────────────────────────────── */

const AdminVendorDetailModal = ({ isOpen, onClose, vendorId }) => {
   const queryClient = useQueryClient()
   const [isNotifyOpen, setIsNotifyOpen] = useState(false)
   const [notifyData, setNotifyData] = useState({ title: '', message: '' })

   const { data: response, isLoading } = useQuery({
      queryKey: ['vendor-detail', vendorId],
      queryFn: () => adminService.getVendorDetail(vendorId),
      enabled: isOpen && !!vendorId
   })

   // STATUS UPDATE MUTATION
   const statusMutation = useMutation({
      mutationFn: (status) => adminService.updateVendorStatus(vendorId, status),
      onSuccess: () => {
         queryClient.invalidateQueries(['vendor-detail', vendorId])
         queryClient.invalidateQueries(['vendor-applications'])
         toast.success('System protocol updated.')
      }
   })

   // DELETE MUTATION
   const deleteMutation = useMutation({
      mutationFn: () => adminService.deleteVendor(vendorId),
      onSuccess: () => {
         queryClient.invalidateQueries(['vendor-applications'])
         toast.error('Vendor purged from network records.')
         onClose()
      }
   })

   // NOTIFICATION MUTATION
   const notifyMutation = useMutation({
      mutationFn: (data) => adminService.sendUserNotification(response?.data?.user?._id, data),
      onSuccess: () => {
         toast.success('Notification dispatched.')
         setIsNotifyOpen(false)
         setNotifyData({ title: '', message: '' })
      }
   })

   if (!isOpen) return null

   const vendor = response?.data

   return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 sm:p-10">
         <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={onClose} />

         <div className="w-full max-w-4xl bg-white dark:bg-[#0a0a0a] border border-gray-100 dark:border-gray-800 shadow-2xl relative z-10 overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-300">

            {/* MODAL HEADER */}
            <div className="p-8 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between bg-gray-50/50 dark:bg-[#0c0c0c]">
               <div className="flex items-center gap-6">
                  <div className="w-16 h-16 bg-emerald-500/10 dark:bg-emerald-500/5 flex items-center justify-center border border-emerald-500/20">
                     <Building2 className="w-8 h-8 text-emerald-500" />
                  </div>
                  <div className="space-y-1">
                     <div className="flex items-center gap-2">
                        <h2 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tighter italic">
                           {vendor?.farmName || 'Loading...'}
                        </h2>
                        {vendor?.status === 'Active' ? (
                           <span className="px-2 py-0.5 bg-emerald-500 text-white text-[8px] font-black uppercase tracking-widest">Active</span>
                        ) : (
                           <span className="px-2 py-0.5 bg-amber-500 text-white text-[8px] font-black uppercase tracking-widest">{vendor?.status}</span>
                        )}
                     </div>
                     <div className="flex items-center gap-3 text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                        <span>Vendor ID: {vendor?.vendorId}</span>
                        <span className="w-1 h-1 rounded-full bg-gray-300" />
                        <span className="flex items-center gap-1">
                           <ShieldCheck className={`w-3 h-3 ${vendor?.user?.isVerified ? 'text-emerald-500' : 'text-gray-400'}`} />
                           {vendor?.user?.isVerified ? 'Verified Account' : 'Unverified'}
                        </span>
                     </div>
                  </div>
               </div>
               <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                  <X className="w-6 h-6 text-gray-400" />
               </button>
            </div>

            <div className="flex-1 overflow-y-auto p-10 space-y-12 text-gray-900 dark:text-white">
               {isLoading ? (
                  <div className="flex h-96 items-center justify-center">
                     <Loader2 className="w-8 h-8 text-primary-600 animate-spin" />
                  </div>
               ) : !vendor ? (
                  <div className="flex h-96 items-center justify-center text-[10px] font-black uppercase tracking-widest text-gray-500 italic">
                     Vendor data not found.
                  </div>
               ) : (
                  <>
                     {/* CORE INFO GRID */}
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-12">

                        {/* ACCOUNT IDENTITY */}
                        <div className="space-y-8">
                           <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.5em] italic">Personal Information</h4>

                           <div className="space-y-6">
                              <div className="flex items-center gap-4">
                                 <div className="w-12 h-12 bg-gray-50 dark:bg-[#111111] flex items-center justify-center font-black text-xl text-gray-400">
                                    {vendor.user.name[0]}
                                 </div>
                                 <div>
                                    <p className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-tight">{vendor.user.name}</p>
                                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{vendor.vendorId}</p>
                                 </div>
                              </div>

                              <div className="grid grid-cols-1 gap-4">
                                 <div className="flex items-center gap-3">
                                    <Mail className="w-4 h-4 text-gray-400" />
                                    <span className="text-xs font-bold text-gray-600 dark:text-gray-300">{vendor.user.email}</span>
                                 </div>
                                 <div className="flex items-center gap-3">
                                    <Phone className="w-4 h-4 text-gray-400" />
                                    <span className="text-xs font-bold text-gray-600 dark:text-gray-300">{vendor.phoneNumber}</span>
                                 </div>
                                 <div className="flex items-center gap-3">
                                    <Calendar className="w-4 h-4 text-gray-400" />
                                    <span className="text-xs font-bold text-gray-600 dark:text-gray-300">Member Since: {format(new Date(vendor.user.createdAt), 'dd MMM yyyy')}</span>
                                 </div>
                              </div>
                           </div>
                        </div>

                        {/* BUSINESS INFO */}
                        <div className="space-y-8">
                           <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.5em] italic">Business Details</h4>

                           <div className="space-y-6">
                              <div className="flex items-start gap-4">
                                 <Building2 className="w-4 h-4 text-primary-600 mt-1" />
                                 <div>
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Business Name</p>
                                    <p className="text-xs font-black text-gray-900 dark:text-white uppercase tracking-tight italic">{vendor.farmName}</p>
                                 </div>
                              </div>
                              <div className="flex items-start gap-4">
                                 <Activity className="w-4 h-4 text-primary-600 mt-1" />
                                 <div>
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Business Category</p>
                                    <p className="text-xs font-black text-gray-900 dark:text-white uppercase tracking-tight italic">{vendor.category}</p>
                                 </div>
                              </div>
                              <div className="flex items-start gap-4">
                                 <MapPin className="w-4 h-4 text-primary-600 mt-1" />
                                 <div>
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Address</p>
                                    <p className="text-xs font-bold text-gray-600 dark:text-gray-400 leading-relaxed max-w-[250px]">{vendor.businessAddress}</p>
                                 </div>
                              </div>
                           </div>
                        </div>

                     </div>

                     {/* ACTION HUB */}
                     <div className="space-y-8 pt-8 border-t border-gray-100 dark:border-gray-800">
                        <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.5em] italic">Quick Actions</h4>

                        <div className="flex flex-wrap gap-4">
                           <button
                              onClick={() => setIsNotifyOpen(!isNotifyOpen)}
                              className="h-14 px-8 border border-gray-900 dark:border-white text-gray-900 dark:text-white text-[10px] font-black uppercase tracking-widest hover:bg-gray-900 hover:text-white dark:hover:bg-white dark:hover:text-black transition-all flex items-center gap-3"
                           >
                              <MessageSquare className="w-4 h-4" /> Send Notification
                           </button>

                           {vendor.status === 'Active' ? (
                              <button
                                 onClick={() => {
                                    if (window.confirm('Suspending this vendor will hide all their products. Continue?')) {
                                       statusMutation.mutate('Suspended')
                                    }
                                 }}
                                 disabled={statusMutation.isPending}
                                 className="h-14 px-8 border border-amber-500 text-amber-500 text-[10px] font-black uppercase tracking-widest hover:bg-amber-500 hover:text-white transition-all flex items-center gap-3"
                              >
                                 <ShieldAlert className="w-4 h-4" /> {statusMutation.isPending ? 'Suspending...' : 'Suspend Vendor'}
                              </button>
                           ) : (
                              <button
                                 onClick={() => statusMutation.mutate('Active')}
                                 className="h-14 px-8 border border-emerald-500 text-emerald-500 text-[10px] font-black uppercase tracking-widest hover:bg-emerald-500 hover:text-white transition-all flex items-center gap-3"
                              >
                                 <CheckCircle className="w-4 h-4" /> Activate Vendor
                              </button>
                           )}

                           <button
                              onClick={() => {
                                 if (window.confirm('Are you sure? This will delete the vendor and their account permanently.')) {
                                    deleteMutation.mutate()
                                 }
                              }}
                              disabled={deleteMutation.isPending}
                              className="h-14 px-8 border border-rose-500 text-rose-500 text-[10px] font-black uppercase tracking-widest hover:bg-rose-500 hover:text-white transition-all flex items-center gap-3"
                           >
                              <Trash2 className="w-4 h-4" /> {deleteMutation.isPending ? 'Deleting...' : 'Delete Vendor'}
                           </button>
                        </div>

                        {/* NOTIFICATION SUB-MODAL */}
                        {isNotifyOpen && (
                           <div className="p-8 bg-gray-50 dark:bg-[#0d0d0d] border border-gray-100 dark:border-gray-800 space-y-6 animate-in slide-in-from-top-2">
                              <div className="grid grid-cols-1 gap-6">
                                 <div className="space-y-2">
                                    <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Message Title</label>
                                    <input
                                       value={notifyData.title}
                                       onChange={(e) => setNotifyData(prev => ({ ...prev, title: e.target.value }))}
                                       className="w-full h-12 bg-white dark:bg-black border border-gray-200 dark:border-gray-800 px-4 text-xs font-bold"
                                       placeholder="e.g. Quality Check Required..."
                                    />
                                 </div>
                                 <div className="space-y-2">
                                    <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Message Content</label>
                                    <textarea
                                       value={notifyData.message}
                                       onChange={(e) => setNotifyData(prev => ({ ...prev, message: e.target.value }))}
                                       className="w-full h-24 bg-white dark:bg-black border border-gray-200 dark:border-gray-800 p-4 text-xs font-bold resize-none"
                                       placeholder="Write your message here..."
                                    />
                                 </div>
                                 <button
                                    onClick={() => notifyMutation.mutate(notifyData)}
                                    disabled={notifyMutation.isPending || !notifyData.title || !notifyData.message}
                                    className="h-12 w-fit px-10 bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-[9px] font-black uppercase tracking-widest hover:opacity-90 disabled:opacity-50"
                                 >
                                    {notifyMutation.isPending ? 'Sending...' : 'Send Now'}
                                 </button>
                              </div>
                           </div>
                        )}
                     </div>
                  </>
               )}
            </div>

            {/* FOOTER METADATA */}
            {!isLoading && vendor && (
               <div className="p-6 bg-gray-50 dark:bg-[#0c0c0c] border-t border-gray-100 dark:border-gray-800 flex justify-between items-center px-10 text-[9px] font-black text-gray-400 uppercase tracking-[0.2em]">
                  <span>Verified: {vendor.status === 'Suspended' ? 'NO' : 'YES'}</span>
                  <span>Dashboard ID: {vendor._id}</span>
               </div>
            )}
         </div>
      </div>
   )
}

export default AdminVendorDetailModal
