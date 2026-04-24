import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { 
  LifeBuoy, 
  Search, 
  MessageSquare, 
  Clock, 
  Reply, 
  CheckCircle2, 
  AlertCircle, 
  Filter, 
  MoreHorizontal, 
  ArrowRight,
  ShieldCheck,
  User,
  Mail,
  Zap,
  Tag,
  Loader2,
  Trash2,
  X,
  Send,
  ExternalLink
} from 'lucide-react'
import supportService from '../../services/supportService'
import Button from '../../components/ui/Button'
import Badge from '../../components/ui/Badge'
import Modal from '../../components/ui/Modal'
import toast from 'react-hot-toast'
import { cn } from '../../lib/utils'

/* ─────────────────────────────────────────────────────────────────────────────
 * ADMIN SUPPORT COMMAND CENTER
 * Integrated terminal for managing help requests, internal team notes,
 * and automated email communication.
 * ───────────────────────────────────────────────────────────────────────────── */

const AdminSupportTickets = () => {
  const queryClient = useQueryClient()
  const [filter, setFilter] = useState({ status: '', category: '', priority: '' })
  const [selectedTicket, setSelectedTicket] = useState(null)
  const [replyMessage, setReplyMessage] = useState('')
  const [internalNotes, setInternalNotes] = useState('')

  const { data: ticketsResponse, isLoading } = useQuery({
    queryKey: ['admin-support-tickets', filter],
    queryFn: () => supportService.getAllTickets(filter),
  })

  const replyMutation = useMutation({
    mutationFn: (data) => supportService.replyToTicket(selectedTicket._id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-support-tickets'])
      toast.success('Reply and Email sent successfully')
      setSelectedTicket(null)
      setReplyMessage('')
    }
  })

  const updateMutation = useMutation({
    mutationFn: (data) => supportService.updateTicket(selectedTicket._id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-support-tickets'])
      toast.success('Ticket updated')
    }
  })

  const tickets = ticketsResponse?.data || []
  const stats = {
    total: tickets.length,
    open: tickets.filter(t => t.status === 'Open').length,
    urgent: tickets.filter(t => t.priority === 'Urgent' || t.priority === 'Emergency').length,
    solved: tickets.filter(t => t.status === 'Resolved').length
  }

  const handleOpenTicket = (ticket) => {
    setSelectedTicket(ticket)
    setInternalNotes(ticket.internalNotes || '')
  }

  const getPriorityColor = (p) => {
    switch (p) {
      case 'Emergency': return 'bg-red-500 text-white'
      case 'Urgent': return 'bg-orange-500 text-white'
      default: return 'bg-gray-100 dark:bg-gray-800 text-gray-400'
    }
  }

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      
      {/* 1. SECTOR STATS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-1 bg-gray-100 dark:bg-gray-800 border border-gray-100 dark:border-gray-800">
        {[
          { label: 'Cumulative Total', value: stats.total, icon: Zap },
          { label: 'Active Pipeline', value: stats.open, icon: MessageSquare, color: 'text-primary-600' },
          { label: 'Urgent Ops', value: stats.urgent, icon: AlertCircle, color: 'text-red-600' },
          { label: 'Solutions Dispatched', value: stats.solved, icon: CheckCircle2, color: 'text-emerald-600' }
        ].map((s, i) => (
          <div key={i} className="bg-white dark:bg-[#0a0a0a] p-6 flex items-center justify-between border border-gray-100 dark:border-gray-800 shadow-sm">
             <div>
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 mb-1">{s.label}</p>
                <p className={cn("text-3xl font-black tracking-tighter", s.color)}>{s.value}</p>
             </div>
             <s.icon className={cn("w-8 h-8 opacity-20", s.color)} />
          </div>
        ))}
      </div>

      {/* 2. OPS CONTROL BAR */}
      <div className="flex flex-wrap items-center justify-between gap-6 pb-6 border-b border-gray-100 dark:border-gray-800">
        <div className="flex flex-wrap items-center gap-4">
           <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search Ticket ID..." 
                className="pl-11 pr-6 py-3 bg-gray-50 dark:bg-[#111111] border border-gray-200 dark:border-gray-800 rounded-none text-xs font-bold uppercase tracking-widest outline-none focus:border-primary-600"
              />
           </div>
           <select 
             className="px-6 py-3 bg-gray-50 dark:bg-[#111111] border border-gray-200 dark:border-gray-800 rounded-none text-[10px] font-black uppercase tracking-widest outline-none appearance-none"
             value={filter.status}
             onChange={(e) => setFilter({...filter, status: e.target.value})}
           >
              <option value="">All Status</option>
              <option value="Open">Open Only</option>
              <option value="Replied">Awaiting User</option>
              <option value="Resolved">Resolved</option>
           </select>
           <select 
             className="px-6 py-3 bg-gray-50 dark:bg-[#111111] border border-gray-200 dark:border-gray-800 rounded-none text-[10px] font-black uppercase tracking-widest outline-none appearance-none"
             value={filter.priority}
             onChange={(e) => setFilter({...filter, priority: e.target.value})}
           >
              <option value="">All Priorities</option>
              <option value="Normal">Normal</option>
              <option value="Urgent">Urgent</option>
              <option value="Emergency">Emergency</option>
           </select>
        </div>
        <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
           System Status: <span className="text-emerald-500 font-black">Active Stream</span>
        </div>
      </div>

      {/* 3. TICKET GRID */}
      <div className="bg-white dark:bg-[#0a0a0a] border border-gray-100 dark:border-gray-800 shadow-xl overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[1000px]">
          <thead>
            <tr className="bg-gray-50 dark:bg-[#0c0c0c] border-b border-gray-100 dark:border-gray-800">
              <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Identity</th>
              <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Category / Urgency</th>
              <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Subject Log</th>
              <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Submission Time</th>
              <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400 text-right">Ops</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 dark:divide-gray-800/30">
            {isLoading ? (
              [...Array(5)].map((_, i) => (
                <tr key={i} className="animate-pulse">
                  <td colSpan={5} className="px-8 py-10 bg-gray-50/10" />
                </tr>
              ))
            ) : tickets.length === 0 ? (
               <tr>
                <td colSpan={5} className="px-8 py-20 text-center text-gray-400 font-bold uppercase text-[10px] tracking-widest">No matching help requests in orbit</td>
               </tr>
            ) : (
              tickets.map((t) => (
                <tr key={t._id} className="group hover:bg-gray-50 dark:hover:bg-[#0e0e0e] transition-colors">
                  <td className="px-8 py-8">
                     <div className="flex flex-col gap-1">
                        <span className="text-sm font-black tracking-widest text-gray-900 dark:text-white uppercase">{t.ticketId}</span>
                        <span className="text-[10px] font-bold text-gray-400 italic">{t.name}</span>
                     </div>
                  </td>
                  <td className="px-8 py-8">
                     <div className="flex items-center gap-3">
                        <span className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-[9px] font-black uppercase text-gray-500 tracking-widest border border-gray-200 dark:border-gray-700">{t.category}</span>
                        <span className={cn("w-2 h-2 rounded-full", t.priority === 'Emergency' ? 'bg-red-500' : (t.priority === 'Urgent' ? 'bg-orange-500' : 'bg-gray-300'))} />
                     </div>
                  </td>
                  <td className="px-8 py-8">
                     <div className="flex flex-col gap-1 max-w-xs xl:max-w-md">
                        <span className="text-xs font-bold text-gray-800 dark:text-gray-200 truncate uppercase tracking-tight">{t.subject}</span>
                        <div className="flex items-center gap-3">
                           <span className={cn(
                             "text-[9px] font-black uppercase px-2 py-0.5",
                             t.status === 'Open' ? 'text-orange-500 border border-orange-500/20 bg-orange-50/5' : 'text-emerald-500 border border-emerald-500/20 bg-emerald-50/5'
                           )}>{t.status}</span>
                           {t.replies?.length > 0 && <span className="text-[9px] font-bold text-gray-400 italic">| {t.replies.length} replies</span>}
                        </div>
                     </div>
                  </td>
                  <td className="px-8 py-8 text-[10px] font-mono text-gray-400 uppercase">
                     {new Date(t.createdAt).toLocaleString()}
                  </td>
                  <td className="px-8 py-8 text-right">
                     <button 
                       onClick={() => handleOpenTicket(t)}
                       className="p-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-primary-600 dark:hover:bg-primary-500 hover:text-white transition-all shadow-md group-hover:-translate-x-1"
                     >
                        <ArrowRight className="w-4 h-4" />
                     </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* 4. DETAIL & RESPONSE MODAL */}
      <Modal
        isOpen={!!selectedTicket}
        onClose={() => setSelectedTicket(null)}
        title={`Help Request Terminal: ${selectedTicket?.ticketId}`}
        className="!p-0 !rounded-none border-4 border-gray-900 dark:border-gray-800 shadow-2xl max-w-5xl"
      >
        {selectedTicket && (
          <div className="flex flex-col lg:flex-row h-[80vh] bg-white dark:bg-[#0a0a0a]">
            
            {/* Ticket Information Sidebar */}
            <div className="w-full lg:w-80 border-r border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-[#0c0c0c] p-10 space-y-12 overflow-y-auto">
               <div className="space-y-6">
                  <div className="flex items-center justify-between">
                     <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400 italic">User Profile</h4>
                     <Link to={`/admin/users?id=${selectedTicket.user?._id}`} className="text-primary-600 hover:underline"><ExternalLink className="w-3.5 h-3.5" /></Link>
                  </div>
                  <div className="space-y-2">
                     <p className="text-sm font-black text-gray-900 dark:text-white uppercase leading-none">{selectedTicket.name}</p>
                     <p className="text-[10px] font-bold text-gray-500 italic lowercase">{selectedTicket.email}</p>
                     <p className="text-[11px] font-bold text-gray-600 uppercase tracking-widest">{selectedTicket.phoneNumber || 'No Phone'}</p>
                  </div>
               </div>

               <div className="space-y-6">
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400 italic">Sector Data</h4>
                  <div className="space-y-4">
                     <div>
                        <p className="text-[9px] font-bold text-gray-400 uppercase mb-1">Status</p>
                        <select 
                          value={selectedTicket.status}
                          onChange={(e) => updateMutation.mutate({ status: e.target.value })}
                          className="w-full bg-white dark:bg-[#111111] border border-gray-200 dark:border-gray-800 p-3 text-[10px] font-black uppercase tracking-widest outline-none"
                        >
                           <option>Open</option>
                           <option>In Progress</option>
                           <option>Replied</option>
                           <option>Resolved</option>
                           <option>Closed</option>
                        </select>
                     </div>
                     <div>
                        <p className="text-[9px] font-bold text-gray-400 uppercase mb-1">Priority</p>
                        <select 
                          value={selectedTicket.priority}
                          onChange={(e) => updateMutation.mutate({ priority: e.target.value })}
                          className="w-full bg-white dark:bg-[#111111] border border-gray-200 dark:border-gray-800 p-3 text-[10px] font-black uppercase tracking-widest outline-none"
                        >
                           <option>Normal</option>
                           <option>Urgent</option>
                           <option>Emergency</option>
                        </select>
                     </div>
                  </div>
               </div>

               <div className="space-y-4">
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400 italic">Internal Staff Notes</h4>
                  <textarea 
                    value={internalNotes}
                    onChange={(e) => setInternalNotes(e.target.value)}
                    placeholder="Private notes for team..."
                    className="w-full h-32 bg-yellow-50/30 dark:bg-yellow-900/5 border border-yellow-500/10 p-4 text-[11px] font-medium italic text-yellow-800 dark:text-yellow-200 outline-none resize-none shadow-inner"
                  />
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full !rounded-none text-[9px] font-black uppercase tracking-widest"
                    onClick={() => updateMutation.mutate({ internalNotes })}
                  >
                    Save Notes
                  </Button>
               </div>
            </div>

            {/* Conversation Timeline & Reply Lab */}
            <div className="flex-1 flex flex-col min-w-0">
               
               {/* Timeline Header */}
               <div className="p-8 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                     <div className="w-10 h-10 bg-gray-100 dark:bg-gray-800 flex items-center justify-center border border-gray-200 dark:border-gray-700">
                        <MessageSquare className="w-5 h-5 text-gray-400" />
                     </div>
                     <div>
                        <h4 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-tight leading-none">{selectedTicket.subject}</h4>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Full Communication History</p>
                     </div>
                  </div>
               </div>

               {/* Scrollable Timeline */}
               <div className="flex-1 overflow-y-auto p-10 space-y-12">
                  {/* Original Customer Message */}
                  <div className="flex gap-6">
                     <div className="w-10 h-10 border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#0a0a0a] flex items-center justify-center shrink-0">
                        <User className="w-4 h-4 text-gray-400" />
                     </div>
                     <div className="space-y-4 max-w-2xl min-w-0">
                        <div className="flex items-center gap-4">
                           <span className="text-[10px] font-black uppercase text-gray-900 dark:text-white tracking-widest">Customer Submission</span>
                           <span className="text-[9px] font-mono text-gray-400">{new Date(selectedTicket.createdAt).toLocaleString()}</span>
                        </div>
                        <div className="p-6 bg-gray-50 dark:bg-[#111111] border border-gray-100 dark:border-gray-800 text-sm font-medium text-gray-600 dark:text-gray-400 italic leading-relaxed break-words whitespace-pre-wrap">
                           "{selectedTicket.message}"
                        </div>
                        {selectedTicket.metadata?.orderId && (
                          <div className="flex items-center gap-3 p-3 border border-primary-500/20 bg-primary-500/5 text-[10px] font-black uppercase text-primary-600 tracking-widest shadow-inner">
                             <Zap className="w-3 h-3" /> Related Order: <span className="underline cursor-pointer">{selectedTicket.metadata.orderId}</span>
                          </div>
                        )}
                     </div>
                  </div>

                  {/* Replies Timeline */}
                  {selectedTicket.replies?.map((r, i) => (
                    <div key={i} className="flex gap-6 flex-row-reverse">
                       <div className={cn("w-10 h-10 flex items-center justify-center shrink-0", r.sender === 'Admin' ? 'bg-primary-600' : 'bg-gray-100 dark:bg-gray-800')}>
                          {r.sender === 'Admin' ? <ShieldCheck className="w-4 h-4 text-white" /> : <User className="w-4 h-4 text-gray-400" />}
                       </div>
                       <div className="space-y-4 max-w-2xl text-right min-w-0">
                          <div className="flex items-center justify-between flex-row-reverse">
                             <span className={cn("text-[10px] font-black uppercase tracking-widest", r.sender === 'Admin' ? "text-primary-600 italic" : "text-gray-900 dark:text-white")}>{r.sender === 'Admin' ? 'Support Response' : 'User Reply'}</span>
                             <span className="text-[9px] font-mono text-gray-400">{new Date(r.createdAt).toLocaleString()}</span>
                          </div>
                          <div className={cn(
                            "p-6 text-sm leading-relaxed shadow-sm break-words whitespace-pre-wrap",
                            r.sender === 'Admin' ? "bg-primary-50/20 dark:bg-primary-900/5 border border-primary-500/10 text-primary-900 dark:text-primary-100 font-bold" : "bg-white dark:bg-[#111111] border border-gray-100 dark:border-gray-800 text-gray-600 dark:text-gray-400 font-medium italic"
                          )}>
                             {r.message}
                          </div>
                       </div>
                    </div>
                  ))}
               </div>

               {/* Reply Entry Hub (The Console) */}
               <div className="p-10 border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-[#0c0c0c]">
                  <div className="relative group">
                     <textarea 
                        value={replyMessage}
                        onChange={(e) => setReplyMessage(e.target.value)}
                        placeholder="Type your official response here... This will be sent as an email automatically."
                        className="w-full h-40 bg-white dark:bg-[#111111] border-2 border-gray-900 dark:border-gray-800 p-6 text-sm font-bold text-gray-900 dark:text-white outline-none focus:border-primary-600 shadow-2xl transition-all resize-none"
                     />
                     <div className="absolute bottom-6 right-6 flex items-center gap-6">
                        <select 
                          className="bg-transparent border-none text-[10px] font-black uppercase tracking-widest text-gray-400 outline-none"
                          value={selectedTicket.status}
                          onChange={(e) => setSelectedTicket({...selectedTicket, status: e.target.value})}
                        >
                           <option>Replied</option>
                           <option>Resolved</option>
                           <option>Closed</option>
                        </select>
                        <Button 
                          isLoading={replyMutation.isPending}
                          disabled={!replyMessage.trim()}
                          className="!rounded-none px-12 uppercase tracking-[0.3em] font-black text-[10px] shadow-xl group-hover:-translate-y-1 transition-all py-4 h-auto"
                          onClick={() => replyMutation.mutate({ message: replyMessage, status: selectedTicket.status })}
                        >
                           Send Response <Send className="w-4 h-4 ml-4" />
                        </Button>
                     </div>
                  </div>
                  <div className="mt-6 flex items-center justify-between opacity-40 text-[9px] font-black uppercase tracking-widest italic">
                     <span className="flex items-center gap-2"><Mail className="w-3.5 h-3.5" /> Automated Email Dispatch Active</span>
                     <span className="flex items-center gap-2"><Zap className="w-3.5 h-3.5" /> Real-time notification trigger</span>
                  </div>
               </div>

            </div>
          </div>
        )}
      </Modal>

    </div>
  )
}

export default AdminSupportTickets
