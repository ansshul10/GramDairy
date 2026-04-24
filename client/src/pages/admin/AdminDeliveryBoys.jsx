import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { 
  Users, 
  ShieldAlert, 
  ShieldOff, 
  Mail, 
  MoreVertical, 
  Search, 
  Phone, 
  Truck,
  AlertTriangle,
  Loader2,
  Ban,
  UserCheck,
  Power,
  X,
  CreditCard,
  Send,
  Trash2,
  Terminal,
  Activity,
  Database,
  ShieldCheck
} from 'lucide-react'
import { cn } from '../../lib/utils'
import deliveryService from '../../services/deliveryService'
import Button from '../../components/ui/Button'
import Badge from '../../components/ui/Badge'
import Input from '../../components/ui/Input'

/* ─────────────────────────────────────────────────────────────────────────────
 * ADMIN DELIVERY PARTNERS MANAGEMENT
 * A simple interface for managing and communicating with delivery partners.
 * ───────────────────────────────────────────────────────────────────────────── */

const AdminDeliveryBoys = () => {
  const queryClient = useQueryClient()
  const [searchTerm, setSearchTerm] = useState('')
  const [contactBoy, setContactBoy] = useState(null)
  const [contactForm, setContactForm] = useState({ subject: '', message: '' })

  const { data: boysData, isLoading } = useQuery({
    queryKey: ['admin-delivery-boys'],
    queryFn: () => deliveryService.getDeliveryBoys()
  })

  const statusMutation = useMutation({
    mutationFn: ({ id, status }) => deliveryService.updateDeliveryBoyStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-delivery-boys'])
      alert('Success: Status updated.')
    }
  })

  const contactMutation = useMutation({
    mutationFn: ({ id, subject, message }) => deliveryService.contactDeliveryBoy(id, subject, message),
    onSuccess: () => {
      alert('Success: Message sent.')
      setContactBoy(null)
      setContactForm({ subject: '', message: '' })
    }
  })

  const deleteMutation = useMutation({
    mutationFn: (id) => deliveryService.deleteDeliveryBoy(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-delivery-boys'])
      alert('Success: Delivery partner deleted.')
    },
    onError: (err) => {
      alert(err.response?.data?.message || 'Error: Failed to delete partner.')
    }
  })

  const boys = boysData?.data || []
  const filteredBoys = boys.filter(b => 
    b.user?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.employeeId?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-32 bg-white dark:bg-[#0a0a0a]">
        <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
        <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-gray-400 mt-4">Loading delivery partners...</p>
      </div>
    )
  }

  return (
    <div className="space-y-12 animate-in fade-in duration-700 bg-white dark:bg-[#0a0a0a]">
      
      {/* 1. FLEET COMMAND HEADER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-gray-100 dark:border-gray-800 pb-10">
        <div>
          <h2 className="text-[10px] font-bold text-primary-600 uppercase tracking-[0.4em] mb-3 flex items-center gap-2 italic">
            Delivery Team
          </h2>
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white tracking-tighter leading-none italic">
            Delivery <span className="text-gray-400 font-medium">Partners</span>
          </h1>
        </div>
        <div className="relative group w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              className="w-full pl-12 pr-6 py-3 bg-gray-50/50 dark:bg-[#111111] border border-gray-200 dark:border-gray-800 outline-none text-[11px] font-bold uppercase tracking-widest placeholder:text-gray-300 focus:border-primary-600 transition-colors dark:text-white rounded-none"
              placeholder="Search by ID or Name..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
        </div>
      </div>

      {/* 2. PERSONNEL MODULE STREAM */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-px bg-gray-200 dark:bg-gray-800 border border-gray-200 dark:border-gray-800">
        {filteredBoys.length === 0 ? (
          <div className="col-span-full py-32 bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-gray-800 text-center flex flex-col items-center">
            <Users className="w-12 h-12 mb-6 text-gray-200 dark:text-gray-700" />
            <p className="text-[11px] font-bold uppercase tracking-widest text-gray-400">No delivery partners found.</p>
          </div>
        ) : (
          filteredBoys.map((boy) => (
            <div key={boy._id} className="bg-white dark:bg-[#0a0a0a] p-8 group transition-colors hover:bg-gray-50 dark:hover:bg-[#111111]/30">
              <div className="flex flex-col md:flex-row gap-10">
                
                {/* Visual Identity Terminal */}
                <div className="relative shrink-0">
                  <div className="w-24 h-24 bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-gray-800 p-1 group-hover:border-primary-600 transition-colors rounded-none">
                    {boy.user?.avatar ? (
                      <img src={boy.user.avatar} alt={boy.user.name} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 rounded-none" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-50 dark:bg-[#111111] text-lg font-bold text-gray-300 rounded-none">
                        {boy.user?.name?.[0]}
                      </div>
                    )}
                  </div>
                  <div className={`absolute -bottom-2 -right-2 w-6 h-6 border-4 border-white dark:border-[#0a0a0a] rounded-none ${boy.isAvailable ? 'bg-emerald-500 shadow-lg shadow-emerald-500/20' : 'bg-gray-400'}`} title={boy.isAvailable ? 'Available' : 'Busy'} />
                </div>

                <div className="flex-1 space-y-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white uppercase tracking-tighter leading-none italic">{boy.user?.name}</h3>
                        <span className={cn(
                          "px-2 py-0.5 text-[8px] font-black uppercase tracking-widest rounded-none",
                          boy.status === 'active' ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20" : "bg-red-500/10 text-red-600 border border-red-500/20"
                        )}>
                          {boy.status}
                        </span>
                      </div>
                      <p className="text-[10px] font-mono font-bold text-primary-600 uppercase tracking-tighter">
                        Partner ID: {boy.employeeId || 'UNREGISTERED'}
                      </p>
                      <div className="flex items-center gap-6 mt-4">
                         <div className="flex items-center gap-2 text-[9px] font-bold text-gray-400 uppercase tracking-widest">
                           <Phone className="w-3.5 h-3.5" /> {boy.phone}
                         </div>
                         <div className="flex items-center gap-2 text-[9px] font-bold text-gray-400 uppercase tracking-widest">
                           {boy.vehicleType.toUpperCase()}
                         </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-px bg-gray-200 dark:bg-gray-800 border border-gray-200 dark:border-gray-800">
                      <button 
                        className="p-3 bg-white dark:bg-[#0a0a0a] text-gray-400 hover:text-primary-600 transition-colors rounded-none"
                        onClick={() => setContactBoy(boy)}
                        title="Send Message"
                      >
                        <Mail className="w-4 h-4" />
                      </button>
                      <button 
                        className="p-3 bg-white dark:bg-[#0a0a0a] text-gray-400 hover:text-red-600 transition-colors border-l border-gray-100 dark:border-gray-800 rounded-none"
                        onClick={() => {
                          if (window.confirm(`Warning: Are you sure you want to permanently delete partner: ${boy.user?.name}?`)) {
                            deleteMutation.mutate(boy._id)
                          }
                        }}
                        title="Delete Partner"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Performance Analytics Grid */}
                  <div className="grid grid-cols-3 gap-px bg-gray-100 dark:bg-gray-800 border border-gray-100 dark:border-gray-800 bg-white shadow-inner">
                    <div className="p-4 bg-white dark:bg-[#0c0c0c] text-center">
                      <p className="text-[8px] uppercase font-black text-gray-400 tracking-[0.2em] mb-1">Rating</p>
                      <p className="text-sm font-bold text-gray-900 dark:text-white tracking-widest italic">{boy.ratings || '0.0'}/5</p>
                    </div>
                    <div className="p-4 bg-white dark:bg-[#0c0c0c] text-center">
                      <p className="text-[8px] uppercase font-black text-gray-400 tracking-[0.2em] mb-1">Active Orders</p>
                      <p className="text-sm font-bold text-gray-900 dark:text-white tracking-widest italic">{boy.activeOrders?.length || 0}</p>
                    </div>
                    <div className="p-4 bg-white dark:bg-[#0c0c0c] text-center">
                      <p className="text-[8px] uppercase font-black text-gray-400 tracking-[0.2em] mb-1">Joined</p>
                      <p className="text-[10px] font-bold text-gray-900 dark:text-white tracking-widest uppercase">
                        {new Date(boy.createdAt).toLocaleDateString('en-IN', { month: 'short', year: '2-digit' })}
                      </p>
                    </div>
                  </div>

                  {/* Account Controls */}
                  <div className="pt-6 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
                    <div className="flex gap-4">
                      {boy.status === 'active' ? (
                        <button 
                          className="px-4 py-2 border border-red-500/20 bg-red-500/5 text-[9px] font-bold uppercase tracking-widest text-red-600 hover:bg-red-500/10 transition-colors flex items-center gap-2 rounded-none"
                          onClick={() => statusMutation.mutate({ id: boy._id, status: 'banned' })}
                        >
                          <ShieldAlert className="w-3.5 h-3.5" /> Ban Account
                        </button>
                      ) : (
                        <button 
                          className="px-4 py-2 border border-emerald-500/20 bg-emerald-500/5 text-[9px] font-bold uppercase tracking-widest text-emerald-600 hover:bg-emerald-500/10 transition-colors flex items-center gap-2 rounded-none"
                          onClick={() => statusMutation.mutate({ id: boy._id, status: 'active' })}
                        >
                          <UserCheck className="w-3.5 h-3.5" /> Activate Account
                        </button>
                      )}
                      {boy.status !== 'terminated' && (
                        <button 
                          className="px-4 py-2 text-[9px] font-bold uppercase tracking-widest text-gray-400 hover:text-red-600 transition-colors flex items-center gap-2 rounded-none"
                          onClick={() => {
                          if (window.confirm(`Warning: Are you sure you want to terminate partner: ${boy.user.name}?`)) {
                                statusMutation.mutate({ id: boy._id, status: 'terminated' })
                              }
                            }}
                          >
                            <Power className="w-3.5 h-3.5" /> Terminate Partner
                        </button>
                      )}
                    </div>
                    <button 
                      className="p-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-800 text-gray-400 hover:text-primary-600 transition-all flex items-center gap-3 group/id rounded-none"
                      onClick={() => {
                        if (boy.idCardImageUrl) window.open(boy.idCardImageUrl, '_blank')
                        else alert('Error: ID image not found.')
                      }}
                    >
                      <CreditCard className="w-4 h-4" />
                      <span className="text-[9px] font-bold uppercase tracking-widest overflow-hidden block max-w-0 group-hover/id:max-w-[100px] transition-all duration-300">Auth Image</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* 3. SECURE COMMS TERMINAL */}
      {contactBoy && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-gray-950/40 animate-in fade-in duration-300">
          <div className="bg-white dark:bg-[#0a0a0a] border border-gray-900 dark:border-white shadow-2xl w-full max-w-lg relative overflow-hidden">
            <div className="p-8 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between bg-gray-50/50 dark:bg-[#0c0c0c]">
              <div className="flex items-center gap-5">
                <div className="w-12 h-12 border border-primary-600/20 bg-primary-50 dark:bg-primary-900/10 flex items-center justify-center text-primary-600 rounded-none">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white uppercase tracking-tighter italic">Send Message</h2>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1 italic">To: {contactBoy.user?.email}</p>
                </div>
              </div>
              <button 
                onClick={() => setContactBoy(null)}
                className="p-3 border border-gray-200 dark:border-gray-800 text-gray-400 hover:text-gray-900 transition-colors rounded-none"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-8 space-y-8">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Message Subject</label>
                <Input 
                   className="!rounded-none !bg-gray-50/50 dark:!bg-[#111111] !border-gray-200 dark:!border-gray-800"
                   placeholder="e.g., Documents Pending, Perf. Review"
                   value={contactForm.subject}
                   onChange={(e) => setContactForm(prev => ({ ...prev, subject: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Message Body</label>
                <textarea 
                  className="w-full bg-gray-50/50 dark:bg-[#111111] border border-gray-200 dark:border-gray-800 rounded-none p-4 text-[11px] font-bold placeholder:text-gray-300 outline-none focus:border-primary-600 transition-all min-h-[150px] dark:text-white"
                  placeholder="Type your message here..."
                  value={contactForm.message}
                  onChange={(e) => setContactForm(prev => ({ ...prev, message: e.target.value }))}
                />
              </div>
            </div>

            <div className="p-8 border-t border-gray-100 dark:border-gray-800 flex flex-col gap-4">
              <button 
                className="w-full py-5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-bold uppercase tracking-[0.3em] text-[10px] flex items-center justify-center gap-4 hover:opacity-90 transition-all disabled:opacity-50 shadow-2xl rounded-none"
                onClick={() => contactMutation.mutate({ 
                  id: contactBoy._id, 
                  ...contactForm 
                })}
                disabled={contactMutation.isPending}
              >
                {contactMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                Send Message
              </button>
              <div className="flex items-center gap-3 justify-center">
                  <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Private & Secure</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminDeliveryBoys
