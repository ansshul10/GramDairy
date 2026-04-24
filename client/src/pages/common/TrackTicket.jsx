import { useState, useEffect } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { 
  Search, 
  MessageSquare, 
  ArrowLeft, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  User, 
  ShieldCheck, 
  Mail,
  Zap
} from 'lucide-react'
import supportService from '../../services/supportService'
import Button from '../../components/ui/Button'
import { cn } from '../../lib/utils'

/* ─────────────────────────────────────────────────────────────────────────────
 * TICKET TRACKING SYSTEM
 * Users can check the status of their help requests using their Unique ID.
 * ───────────────────────────────────────────────────────────────────────────── */

const TrackTicket = () => {
  const [searchParams] = useSearchParams()
  const [ticketId, setTicketId] = useState(searchParams.get('id') || '')
  const [email, setEmail] = useState('')
  const [ticket, setTicket] = useState(null)

  const mutation = useMutation({
    mutationFn: ({ ticketId, email }) => supportService.trackTicket(ticketId, email),
    onSuccess: (res) => {
      setTicket(res.data)
    }
  })

  // Auto-search if ID is in URL
  useEffect(() => {
    // If we have an ID from URL, we still need the email for security
    // So we don't auto-fetch unless email is also provided or we are logged in
  }, [])

  const handleTrack = (e) => {
    e.preventDefault()
    mutation.mutate({ ticketId, email })
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'Open': return 'text-orange-600 bg-orange-50/50 border-orange-200'
      case 'In Progress': return 'text-blue-600 bg-blue-50/50 border-blue-200'
      case 'Replied': return 'text-emerald-600 bg-emerald-50/50 border-emerald-200'
      case 'Resolved': return 'text-gray-900 bg-gray-50 border-gray-200 dark:bg-gray-800 dark:text-white'
      default: return 'text-gray-500 bg-gray-50'
    }
  }

  return (
    <div className="min-h-screen bg-white dark:bg-[#0a0a0a] pt-12 pb-32 font-['Inter',sans-serif]">
      
      {/* 1. SECTOR HEADER */}
      <div className="max-w-4xl mx-auto px-6 mb-16">
        <Link to="/support" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-black dark:hover:text-white transition-all mb-12 border border-gray-100 dark:border-gray-800 px-4 py-2">
          <ArrowLeft className="w-4 h-4" /> Back to Help Center
        </Link>
        <h1 className="text-6xl font-black tracking-tighter text-gray-900 dark:text-white uppercase leading-none mb-6">Track Your <span className="text-gray-400 font-medium italic">Message</span></h1>
        <p className="text-gray-500 font-medium max-w-xl">Enter your Ticket ID and Email used during submission to check the current status of your request.</p>
      </div>

      <div className="max-w-4xl mx-auto px-6">
        {!ticket ? (
          <div className="bg-white dark:bg-[#0c0c0c] border-4 border-gray-900 dark:border-gray-800 p-10 md:p-16 shadow-[20px_20px_0px_rgba(0,0,0,0.05)]">
            <form onSubmit={handleTrack} className="space-y-10 group">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 flex items-center gap-2">
                    <Zap className="w-3 h-3 text-primary-600" /> Ticket ID
                  </label>
                  <input 
                    type="text"
                    required
                    placeholder="e.g. GD-2026-X812"
                    value={ticketId}
                    onChange={(e) => setTicketId(e.target.value.toUpperCase())}
                    className="w-full h-16 bg-gray-50 dark:bg-[#111111] border border-gray-200 dark:border-gray-800 rounded-none px-6 outline-none focus:border-primary-600 font-black tracking-widest text-black dark:text-white"
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 flex items-center gap-2">
                    <Mail className="w-3 h-3 text-primary-600" /> Email Used
                  </label>
                  <input 
                    type="email"
                    required
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full h-16 bg-gray-50 dark:bg-[#111111] border border-gray-200 dark:border-gray-800 rounded-none px-6 outline-none focus:border-primary-600 font-bold text-black dark:text-white"
                  />
                </div>
              </div>
              <Button 
                type="submit" 
                isLoading={mutation.isPending}
                className="w-full py-8 !rounded-none uppercase tracking-[0.4em] font-black text-xs shadow-xl"
              >
                Track Now <Search className="w-4 h-4 ml-4" />
              </Button>
              {mutation.isError && (
                <div className="flex items-center gap-3 p-4 bg-red-50 dark:bg-red-900/10 border border-red-500/20 text-red-600 text-xs font-bold uppercase">
                  <AlertCircle className="w-4 h-4" /> {mutation.error.response?.data?.message || 'Verification failed'}
                </div>
              )}
            </form>
          </div>
        ) : (
          <div className="space-y-12 animate-in slide-in-from-bottom-6 duration-500">
             
             {/* Ticket Identity Card */}
             <div className="bg-gray-900 text-white p-10 flex flex-col md:flex-row md:items-center justify-between gap-10">
                <div>
                   <span className="text-[10px] font-black uppercase tracking-[0.4em] opacity-60 mb-2 block">Help Request ID</span>
                   <h2 className="text-4xl font-black tracking-widest mb-2">{ticket.ticketId}</h2>
                   <p className="text-xs font-medium opacity-60 italic">{ticket.subject}</p>
                </div>
                <div className="flex items-center gap-6">
                   <div className={cn("px-6 py-3 border text-xs font-black uppercase tracking-widest", getStatusColor(ticket.status))}>
                      {ticket.status}
                   </div>
                   <button onClick={() => setTicket(null)} className="text-[10px] font-black uppercase tracking-widest opacity-40 hover:opacity-100 transition-opacity underline">Reset Search</button>
                </div>
             </div>

             {/* Live Progress Timeline */}
             <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {[
                  { label: 'Submitted', active: true, done: true },
                  { label: 'Under Review', active: ticket.status !== 'Open', done: ['Replied', 'Resolved', 'Closed'].includes(ticket.status) },
                  { label: 'Searching Solution', active: ['Replied', 'Resolved', 'Closed'].includes(ticket.status), done: ['Resolved', 'Closed'].includes(ticket.status) },
                  { label: 'Finished', active: ticket.status === 'Resolved' || ticket.status === 'Closed', done: ticket.status === 'Resolved' || ticket.status === 'Closed' }
                ].map((step, i) => (
                  <div key={i} className={cn(
                    "p-6 border flex flex-col items-center gap-3",
                    step.done ? "border-emerald-500/30 bg-emerald-50/5 dark:bg-emerald-900/5 text-emerald-600" : (step.active ? "border-primary-500 bg-primary-50/5 shadow-inner" : "border-gray-100 dark:border-gray-800 opacity-30")
                  )}>
                    {step.done ? <CheckCircle2 className="w-5 h-5" /> : <Clock className="w-5 h-5" />}
                    <span className="text-[10px] font-black uppercase tracking-widest">{step.label}</span>
                  </div>
                ))}
             </div>

             {/* Conversation Stream */}
             <div className="space-y-8 bg-gray-50 dark:bg-[#0c0c0c] border border-gray-100 dark:border-gray-800 p-8 md:p-12">
                <h3 className="text-xs font-black uppercase tracking-[0.4em] text-gray-400 mb-10 flex items-center gap-3">
                  <MessageSquare className="w-4 h-4" /> Message Log
                </h3>
                
                <div className="space-y-12">
                   {/* User Message */}
                   <div className="flex gap-6">
                      <div className="w-10 h-10 bg-white dark:bg-[#111111] border border-gray-200 dark:border-gray-800 flex items-center justify-center shrink-0">
                         <User className="w-5 h-5 text-gray-400" />
                      </div>
                      <div className="space-y-4 flex-1 min-w-0">
                         <div className="flex items-center justify-between">
                            <span className="text-[10px] font-black uppercase tracking-widest text-gray-900 dark:text-white">You (Customer)</span>
                            <span className="text-[10px] font-mono text-gray-400">{new Date(ticket.createdAt).toLocaleString()}</span>
                         </div>
                         <div className="bg-white dark:bg-[#111111] border border-gray-100 dark:border-gray-800 p-6 text-sm text-gray-600 dark:text-gray-400 leading-relaxed font-medium break-words whitespace-pre-wrap">
                            {ticket.message}
                         </div>
                      </div>
                   </div>

                   {/* Admin Replies */}
                   {ticket.replies.map((reply, idx) => (
                      <div key={idx} className="flex gap-6 flex-row-reverse">
                         <div className="w-10 h-10 bg-primary-600 flex items-center justify-center shrink-0">
                            <ShieldCheck className="w-5 h-5 text-white" />
                         </div>
                         <div className="space-y-4 flex-1 text-right min-w-0">
                            <div className="flex items-center justify-between flex-row-reverse">
                               <span className="text-[10px] font-black uppercase tracking-widest text-primary-600 italic">Farm Support Specialist</span>
                               <span className="text-[10px] font-mono text-gray-400">{new Date(reply.createdAt).toLocaleString()}</span>
                            </div>
                            <div className="bg-primary-50/20 dark:bg-primary-900/5 border border-primary-500/20 p-6 text-sm text-gray-800 dark:text-primary-100 leading-relaxed font-bold italic shadow-sm break-words whitespace-pre-wrap">
                               "{reply.message}"
                            </div>
                         </div>
                      </div>
                   ))}

                   {ticket.replies.length === 0 && (
                      <div className="py-20 text-center">
                         <Loader2 className="w-8 h-8 text-primary-600 animate-spin mx-auto mb-6" />
                         <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Searching for a solution... Our team is reviewing your case.</p>
                      </div>
                   )}
                </div>
             </div>

             {/* Footer Policy */}
             <div className="pt-8 border-t border-gray-100 dark:border-gray-800 flex flex-wrap gap-8 justify-center opacity-50 text-[9px] font-bold uppercase tracking-widest">
                <span className="flex items-center gap-2"><ShieldCheck className="w-4 h-4" /> Secure Transmission</span>
                <span className="flex items-center gap-2"><Mail className="w-4 h-4" /> Email Verification Required</span>
                <span className="flex items-center gap-2"><Clock className="w-4 h-4" /> Real-time Sync</span>
             </div>

          </div>
        )}
      </div>
    </div>
  )
}

export default TrackTicket
