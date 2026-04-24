import { useState, useEffect } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
  LifeBuoy,
  Search,
  MessageSquare,
  Clock,
  ChevronDown,
  ChevronUp,
  Send,
  AlertCircle,
  CheckCircle2,
  Languages,
  Plus,
  Minus,
  Paperclip,
  Activity,
  ArrowRight,
  PhoneCall,
  Mail,
  ShieldAlert,
  ShieldCheck,
  Zap
} from 'lucide-react'
import useAuthStore from '../../store/authStore'
import supportService from '../../services/supportService'
import Button from '../../components/ui/Button'
import toast from 'react-hot-toast'
import { cn } from '../../lib/utils'
import { Link } from 'react-router-dom'

/* ─────────────────────────────────────────────────────────────────────────────
 * GALACTIC HELP & SUPPORT COMMAND CENTER
 * A high-density, integrated service terminal with FAQ deflection, 
 * language switching, and smart ticket routing.
 * ───────────────────────────────────────────────────────────────────────────── */

const FAQS = [
  {
    q: "What should I do if the milk is spoiled?",
    a: "Message us immediately by selecting the 'Product Quality' category. We will send a replacement within 2 hours.",
    category: "Product Quality"
  },
  {
    q: "I paid the bill but it still shows as Due?",
    a: "Please upload a photo of the payment and select the 'Payment' category. We will verify and update it within 24 hours.",
    category: "Payment"
  },
  {
    q: "Why is my milk delivery late?",
    a: "Contact your delivery partner directly from the App, or report a 'Delivery Problem'. We will check the route for you.",
    category: "Delivery Problem"
  },
  {
    q: "How can I pause my Milk Plan?",
    a: "Go to the Subscriptions section, click 'Edit Plan', and select your dates to pause or resume.",
    category: "Milk Plan"
  }
];

const TRANSLATIONS = {
  en: {
    heroTitle: "How can we help you today?",
    heroSubtitle: "Get instant answers or send a message to our farm team.",
    faqTitle: "Helpful Answers",
    formTitle: "Send a Message",
    trackTitle: "Track My Message",
    labelName: "Your Name",
    labelEmail: "Email Address",
    labelCategory: "What happened?",
    labelPriority: "How urgent is this?",
    labelSubject: "Short Summary",
    labelMessage: "Tell us everything",
    placeholderMessage: "Type your problem here...",
    btnSubmit: "Send Help Request",
    btnTracking: "Track Request Status",
    successTitle: "Request Received",
    successSubtitle: "Your Ticket ID is",
    responseTime: "Help arriving in 24 hours",
    online: "Support Online",
    busy: "Support Busy",
    charCount: "Characters",
    urgent: "Urgent",
    normal: "Normal",
  },
  hi: {
    heroTitle: "How can we help you today?",
    heroSubtitle: "Get instant answers or send a message to our farm team.",
    faqTitle: "Helpful Answers",
    formTitle: "Send a Message",
    trackTitle: "Track My Message",
    labelName: "Your Name",
    labelEmail: "Email Address",
    labelCategory: "What happened?",
    labelPriority: "How urgent is this?",
    labelSubject: "Short Summary",
    labelMessage: "Tell us everything",
    placeholderMessage: "Type your problem here...",
    btnSubmit: "Send Help Request",
    btnTracking: "Track Request Status",
    successTitle: "Request Received",
    successSubtitle: "Your Ticket ID is",
    responseTime: "Help arriving in 24 hours",
    online: "सपोर्ट उपलब्ध",
    busy: "सपोर्ट व्यस्त",
    charCount: "Characters",
    urgent: "Urgent",
    normal: "Normal",
  }
};

const SupportCenter = () => {
  const { user } = useAuthStore()
  
  const [lang, setLang] = useState('en')
  const [expandedFaq, setExpandedFaq] = useState(null)
  
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    category: 'General Query',
    priority: 'Normal',
    subject: '',
    message: ''
  })
  const [ticketId, setTicketId] = useState(null)
  const t = TRANSLATIONS[lang]

  // Deflection Logic: Suggest FAQs based on typing
  const [suggestions, setSuggestions] = useState([])

  const mutation = useMutation({
    mutationFn: (data) => supportService.createTicket(data),
    onSuccess: (res) => {
      setTicketId(res.data.ticketId)
      toast.success(t.successTitle)
    }
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    mutation.mutate(formData)
  }

  const handleMessageChange = (e) => {
    const val = e.target.value
    setFormData({ ...formData, message: val })

    // Simple deflection logic
    if (val.length > 5) {
      const matched = FAQS.filter(f => f.q.toLowerCase().includes(val.toLowerCase()) || f.category.toLowerCase().includes(val.toLowerCase()))
      setSuggestions(matched.slice(0, 2))
    } else {
      setSuggestions([])
    }
  }

  if (ticketId) {
    return (
      <div className="max-w-4xl mx-auto py-32 px-6 text-center">
        <div className="w-24 h-24 bg-emerald-500/10 border border-emerald-500/20 rounded flex items-center justify-center mx-auto mb-10 ring-8 ring-emerald-500/5">
          <CheckCircle2 className="w-12 h-12 text-emerald-500" />
        </div>
        <h1 className="text-5xl font-bold tracking-tighter text-gray-900 dark:text-white mb-6 uppercase">{t.successTitle}</h1>
        <p className="text-gray-500 font-medium mb-10 max-w-lg mx-auto leading-relaxed">
          {t.successSubtitle} <span className="text-gray-900 dark:text-white font-black bg-gray-100 dark:bg-gray-800 px-4 py-2 ml-2 tracking-widest">{ticketId}</span>
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
          <Link to={`/support/track?id=${ticketId}`}>
            <Button size="lg" className="!rounded-none px-12 uppercase tracking-widest py-6 h-auto">{t.btnTracking}</Button>
          </Link>
          <Button variant="outline" size="lg" onClick={() => setTicketId(null)} className="!rounded-none px-12 uppercase tracking-widest py-6 h-auto">Submit Another</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white dark:bg-[#0a0a0a] font-['Inter',sans-serif]">

      {/* 1. COMMAND PANEL HEADER (HERO) */}
      <div className="w-full border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-[#0c0c0c] pt-24 pb-20 relative overflow-hidden">
        {/* Decorative Grid Lines */}
        <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] pointer-events-none"
          style={{ backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-10">
            <div className="max-w-3xl">
              <div className="flex items-center gap-4 mb-6">
                <span className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 text-[10px] font-bold text-emerald-600 uppercase tracking-widest">
                  <div className="w-2 h-2 rounded-full bg-emerald-500" />
                  {t.online}
                </span>
                <button
                  onClick={() => setLang(lang === 'en' ? 'hi' : 'en')}
                  className="flex items-center gap-2 text-[10px] font-bold text-gray-500 hover:text-gray-900 dark:hover:text-white uppercase tracking-widest transition-colors"
                >
                  <Languages className="w-4 h-4" /> {lang === 'en' ? 'Hindi' : 'English'}
                </button>
              </div>
              <h1 className="text-6xl md:text-7xl font-bold tracking-tighter text-gray-900 dark:text-white leading-none mb-8 uppercase">
                {t.heroTitle.split(' ').slice(0, -2).join(' ')} <span className="text-primary-600 h-24">{t.heroTitle.split(' ').slice(-2).join(' ')}</span>
              </h1>
              <p className="text-lg font-medium text-gray-500 leading-relaxed max-w-xl">
                {t.heroSubtitle}
              </p>
            </div>

            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-4 bg-white dark:bg-[#111111] border border-gray-200 dark:border-gray-800 p-6 shadow-sm">
                <Clock className="w-6 h-6 text-primary-600" />
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Expected Wait</p>
                  <p className="text-sm font-bold text-gray-900 dark:text-white uppercase">{t.responseTime}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-20">

          {/* 2. LEFT PANEL: FAQ & KNOWLEDGE BASE */}
          <div className="lg:col-span-4 space-y-16">
            <div className="space-y-8">
              <h2 className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-[0.4em] flex items-center gap-3">
                <ShieldCheck className="w-4 h-4 text-primary-600" /> {t.faqTitle}
              </h2>
              <div className="space-y-4">
                {FAQS.map((faq, idx) => (
                  <div
                    key={idx}
                    className="border border-gray-100 dark:border-gray-800 bg-white dark:bg-[#0c0c0c] overflow-hidden"
                  >
                    <button
                      onClick={() => setExpandedFaq(expandedFaq === idx ? null : idx)}
                      className="w-full p-6 text-left flex items-start justify-between gap-4 group"
                    >
                      <span className="text-sm font-bold text-gray-700 dark:text-gray-300 group-hover:text-primary-600 transition-colors uppercase tracking-tight">{faq.q}</span>
                      {expandedFaq === idx ? <Minus className="w-4 h-4 shrink-0 mt-1" /> : <Plus className="w-4 h-4 shrink-0 mt-1" />}
                    </button>
                    {expandedFaq === idx && (
                      <div className="px-6 pb-6 animate-in slide-in-from-top-4 duration-300">
                        <p className="text-xs font-medium text-gray-500 leading-relaxed italic border-l-2 border-primary-500 pl-4 py-2">
                          {faq.a}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>


          </div>

          {/* 3. RIGHT PANEL: INTELLIGENT HELP FORM */}
          <div className="lg:col-span-8">
            <div className="bg-white dark:bg-[#0c0c0c] border-2 border-gray-900 dark:border-gray-800 p-8 md:p-12 relative overflow-hidden group">
              {/* Dynamic Progress Strip */}
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gray-100 dark:bg-gray-800">
                <div className="h-full bg-primary-600 transition-all duration-1000" style={{ width: `${(Object.values(formData).filter(v => v.length > 0).length / 6) * 100}%` }} />
              </div>

              <div className="mb-12">
                <h2 className="text-3xl font-black text-gray-900 dark:text-white uppercase tracking-tighter mb-4">{t.formTitle}</h2>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.3em]">Sector: Customer Care / Protocol: SMTP</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  {/* Name */}
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 flex items-center gap-2">
                      <Zap className="w-3 h-3" /> {t.labelName}
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full h-14 bg-gray-50 dark:bg-[#111111] border border-gray-200 dark:border-gray-800 rounded-none px-6 outline-none focus:border-primary-600 focus:bg-white dark:focus:bg-[#0a0a0a] font-bold text-sm tracking-tight text-black dark:text-white transition-all shadow-inner"
                    />
                  </div>

                  {/* Email */}
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 flex items-center gap-2">
                      <Activity className="w-3 h-3" /> {t.labelEmail}
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full h-14 bg-gray-50 dark:bg-[#111111] border border-gray-200 dark:border-gray-800 rounded-none px-6 outline-none focus:border-primary-600 focus:bg-white dark:focus:bg-[#0a0a0a] font-bold text-sm tracking-tight text-black dark:text-white transition-all shadow-inner"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  {/* Category */}
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">{t.labelCategory}</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full h-14 bg-gray-50 dark:bg-[#111111] border border-gray-200 dark:border-gray-800 rounded-none px-6 outline-none focus:border-primary-600 font-bold text-[11px] uppercase tracking-widest text-black dark:text-white appearance-none"
                    >
                      <option>Order Issue</option>
                      <option>Delivery Problem</option>
                      <option>Product Quality</option>
                      <option>Payment</option>
                      <option>General Query</option>
                    </select>
                  </div>

                  {/* Priority */}
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">{t.labelPriority}</label>
                    <div className="flex bg-gray-100 dark:bg-gray-800 p-1">
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, priority: 'Normal' })}
                        className={cn(
                          "flex-1 py-3 text-[10px] font-bold uppercase tracking-widest transition-all",
                          formData.priority === 'Normal' ? "bg-white dark:bg-[#0a0a0a] text-gray-900 dark:text-white shadow-sm" : "text-gray-400 hover:text-gray-600"
                        )}
                      >
                        {t.normal}
                      </button>
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, priority: 'Urgent' })}
                        className={cn(
                          "flex-1 py-3 text-[10px] font-bold uppercase tracking-widest transition-all",
                          formData.priority === 'Urgent' ? "bg-red-600 text-white shadow-sm" : "text-gray-400 hover:text-red-500"
                        )}
                      >
                        {t.urgent}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Subject */}
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">{t.labelSubject}</label>
                  <input
                    type="text"
                    required
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full h-14 bg-gray-50 dark:bg-[#111111] border border-gray-200 dark:border-gray-800 rounded-none px-6 outline-none focus:border-primary-600 font-bold text-sm text-black dark:text-white"
                  />
                </div>

                {/* Message & Deflection */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">{t.labelMessage}</label>
                    <span className="text-[9px] font-mono text-gray-400 font-bold border border-gray-100 dark:border-gray-800 px-2 py-1 uppercase">{formData.message.length} / 1000 {t.charCount}</span>
                  </div>
                  <div className="relative">
                    <textarea
                      required
                      rows={6}
                      value={formData.message}
                      onChange={handleMessageChange}
                      placeholder={t.placeholderMessage}
                      className="w-full bg-gray-50 dark:bg-[#111111] border border-gray-200 dark:border-gray-800 rounded-none p-6 outline-none focus:border-primary-600 font-medium text-sm text-black dark:text-white resize-none"
                    />

                    {/* Deflection Logic Popover */}
                    {suggestions.length > 0 && (
                      <div className="absolute left-0 right-0 bottom-full mb-4 bg-white dark:bg-[#0a0a0a] border-4 border-primary-600 z-20 shadow-2xl p-6 animate-in zoom-in-95 duration-200">
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="text-[10px] font-black uppercase tracking-widest text-primary-600 italic">Wait! This might help:</h4>
                          <button onClick={() => setSuggestions([])} className="text-gray-400 hover:text-black"><Plus className="w-4 h-4 rotate-45" /></button>
                        </div>
                        <div className="space-y-4">
                          {suggestions.map((s, i) => (
                            <div key={i} className="bg-gray-50 dark:bg-[#111111] p-4 border border-gray-100 dark:border-gray-800">
                              <p className="text-xs font-bold uppercase mb-2 text-black dark:text-white">{s.q}</p>
                              <p className="text-[11px] text-gray-500 leading-relaxed italic">{s.a}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-6 flex flex-col md:flex-row items-center gap-6">
                  <Button
                    type="submit"
                    isLoading={mutation.isPending}
                    size="lg"
                    className="w-full md:w-auto px-16 py-6 h-auto !rounded-none uppercase tracking-[0.3em] font-black text-[11px] shadow-xl hover:-translate-y-1 transition-all group"
                  >
                    {t.btnSubmit} <Send className="w-4 h-4 ml-3 group-hover:translate-x-2 transition-all" />
                  </Button>
                  <Link to="/support/track" className="text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-primary-600 flex items-center gap-2 border-b border-transparent hover:border-primary-600 pb-1 transition-all">
                    {t.trackTitle} <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </form>
            </div>

            <div className="mt-12 flex flex-wrap items-center gap-12 text-[10px] font-bold text-gray-400 uppercase tracking-widest justify-center lg:justify-start">
              <div className="flex items-center gap-3">
                <ShieldCheck className="w-4 h-4 text-emerald-500" /> 256-bit Secure
              </div>
              <div className="flex items-center gap-3">
                <PhoneCall className="w-4 h-4 text-primary-500" /> Phone Support
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-orange-500" /> Fast Response
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

export default SupportCenter
