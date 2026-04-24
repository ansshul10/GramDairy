import { useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useQuery, useMutation } from '@tanstack/react-query'
import { 
  Heart, 
  ShieldCheck, 
  Lock, 
  Calendar, 
  Activity, 
  Info, 
  ChevronLeft,
  Loader2,
  Unlock,
  AlertCircle,
  Database,
  Terminal,
  MapPin,
  Zap,
  ShieldAlert,
  Fingerprint,
  FileText,
  Share2,
  Dna,
  Scale,
  ArrowLeft
} from 'lucide-react'
import cattleService from '../../services/cattleService'
import Button from '../../components/ui/Button'
import SEO from '../../components/common/SEO'
import { cn } from '../../lib/utils'

/* ─────────────────────────────────────────────────────────────────────────────
 * CATTLE INFORMATION PAGE
 * A simple interface for viewing health and details about our cattle.
 * ───────────────────────────────────────────────────────────────────────────── */

const CattleDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [pin, setPin] = useState('')
  const [privateData, setPrivateData] = useState(null)
  const [error, setError] = useState('')

  const { data: publicData, isLoading } = useQuery({
    queryKey: ['cattle', id],
    queryFn: () => cattleService.getCattleById(id),
  })

  const privateMutation = useMutation({
    mutationFn: (pinCode) => cattleService.getPrivateInfo(id, pinCode),
    onSuccess: (data) => {
      setPrivateData(data.data)
      setError('')
    },
    onError: (err) => {
      setError('Error: Invalid PIN. Please try again.')
    }
  })

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-[#0a0a0a]">
         <div className="flex flex-col items-center gap-4">
            <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-gray-400">Loading cattle details...</p>
         </div>
      </div>
    )
  }

  const cattle = publicData?.data

  if (!cattle) {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-white dark:bg-[#0a0a0a] pt-20 px-6 text-center">
          <ShieldAlert className="w-16 h-16 text-gray-300 dark:text-gray-700 mb-8" />
          <h2 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-[0.2em]">Cattle Not Found</h2>
          <p className="text-[10px] text-gray-500 font-medium uppercase tracking-widest mt-2 mb-10 max-w-sm">
            The cattle with ID [ {id} ] could not be found in our farm records.
          </p>
          <Button onClick={() => navigate(-1)} variant="primary" className="!rounded-none !px-12">Go Back</Button>
        </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 lg:py-20 animate-in fade-in duration-700 space-y-12 pb-32">
      <SEO title={cattle.name} description={`Meet ${cattle.name}, one of our healthy ${cattle.breed}s.`} />
      
      {/* 1. OPERATIONS HEADER */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 border-b border-gray-100 dark:border-gray-800 pb-12">
        <div className="flex items-start gap-6">
            <button 
                onClick={() => navigate(-1)}
                className="p-3 border border-gray-200 dark:border-gray-800 text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
                <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
                <h2 className="text-[10px] font-bold text-primary-600 uppercase tracking-[0.4em] mb-3 flex items-center gap-2 italic">
                    <Heart className="w-4 h-4" /> Healthy & Active
                </h2>
                <h1 className="text-4xl font-bold text-gray-900 dark:text-white tracking-tighter leading-none mb-4 uppercase">
                    {cattle.name} <span className="text-gray-400 font-medium text-3xl">Profile</span>
                </h1>
                <p className="text-[10px] text-gray-400 font-mono uppercase tracking-widest flex items-center gap-4">
                  <span className="flex items-center gap-2">ID: {cattle._id.toUpperCase()}</span>
                  <span className="w-px h-3 bg-gray-200 dark:bg-gray-800" />
                  <span className="flex items-center gap-2"><MapPin className="w-3.5 h-3.5" /> Farm: Main Sector</span>
                </p>
            </div>
        </div>
        <div className="flex items-center gap-6">
           <Badge className="!rounded-none !px-6 !py-3 !text-[10px] !font-black !uppercase !tracking-[0.2em] italic border shadow-lg bg-emerald-500/10 text-emerald-600 border-emerald-500/20">
              HEALTHY
           </Badge>
           <button className="p-4 bg-gray-900 dark:bg-white text-white dark:text-gray-900 border border-gray-900 dark:border-white hover:bg-gray-800 transition-all shadow-xl">
              <Share2 className="w-4 h-4" />
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* LEFT: PHENOTYPIC & BIOLOGICAL PARAMETERS */}
        <div className="lg:col-span-8 space-y-12">
          
          {/* PRIMARY IMAGE TERMINAL */}
          <div className="relative border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#0a0a0a] overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-black/20 to-transparent pointer-events-none z-10" />
            <img 
              src={cattle.photo || 'https://images.unsplash.com/photo-1546445317-29f4545e9d53?q=80&w=800&auto=format&fit=crop'} 
              alt={cattle.name} 
              className="w-full h-[500px] object-cover grayscale dark:opacity-80 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-1000" 
            />
            <div className="absolute bottom-8 left-8 z-20">
              <div className="p-6 bg-white/10 backdrop-blur-xl border border-white/20 inline-block shadow-2xl">
                 <p className="text-[10px] font-black text-white uppercase tracking-[0.3em] mb-1">Cattle Name</p>
                 <h3 className="text-4xl font-black text-white italic tracking-tighter uppercase">{cattle.name}</h3>
              </div>
            </div>
            {/* CORNER DECORATION */}
            <div className="absolute top-0 right-0 p-8 z-20">
                <div className="w-16 h-16 border-t-2 border-r-2 border-white/30" />
            </div>
          </div>

          <div className="p-8 border border-gray-200 dark:border-gray-800 bg-gray-50/30 dark:bg-[#0c0c0c]">
             <p className="text-gray-500 font-medium text-lg leading-relaxed uppercase italic tracking-tight">
               {cattle.description || 'One of our primary dairy cows. She is healthy and provides high-quality milk.'}
             </p>
          </div>

          {/* PARAMETER GRID */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-gray-200 dark:bg-gray-800 border border-gray-200 dark:border-gray-800 shadow-2xl">
             <DataNode icon={Dna} label="Breed" value={cattle.breed} />
             <DataNode icon={Calendar} label="Age" value={`${cattle.age} YRS`} />
             <DataNode icon={Fingerprint} label="Gender" value={cattle.gender} />
             <DataNode icon={Heart} label="Health" value="NORMAL" highlight />
          </div>

          {/* HEALTH METRICS */}
          <div className="p-8 lg:p-12 border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#0a0a0a] relative">
             <div className="absolute top-0 right-0 w-32 h-1 bg-primary-600" />
             <h3 className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-[0.2em] mb-10 flex items-center gap-3">
               <Activity className="w-4 h-4 text-primary-600" /> Health Snapshot
             </h3>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div className="space-y-6">
                   <div className="flex justify-between items-end">
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Oxygen Level</span>
                      <span className="text-[11px] font-black text-emerald-500 uppercase">98.4%</span>
                   </div>
                   <div className="h-1 bg-gray-100 dark:bg-gray-800">
                      <div className="h-full bg-emerald-500 w-[98.4%]" />
                   </div>
                </div>
                <div className="space-y-6">
                   <div className="flex justify-between items-end">
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Body Temperature</span>
                      <span className="text-[11px] font-black text-emerald-500 uppercase">38.5°C</span>
                   </div>
                   <div className="h-1 bg-gray-100 dark:bg-gray-800">
                      <div className="h-full bg-emerald-500 w-[70%]" />
                   </div>
                </div>
             </div>
          </div>
        </div>

        {/* RIGHT: SECURE HANDSHAKE & CORE METADATA */}
        <div className="lg:col-span-4 space-y-12">
          
          {/* PRIVATE DATA GATEWAY */}
          {!privateData ? (
            <div className="p-8 border border-gray-900 dark:border-white bg-[#0a0a0a] text-white space-y-10 relative shadow-2xl overflow-hidden">
               <div className="absolute top-0 right-0 w-24 h-1 bg-primary-600" />
               <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-primary-600 flex items-center gap-3 italic">
                 <Lock className="w-4 h-4" /> Comprehensive Records
               </h3>
               <p className="text-[11px] font-bold text-gray-400 leading-relaxed uppercase tracking-tight">
                 Detailed health and history records are restricted. Please enter your access PIN to view more information.
               </p>
               <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Access PIN</label>
                    <input 
                      type="password" 
                      maxLength={4}
                      value={pin}
                      onChange={(e) => setPin(e.target.value)}
                      placeholder="Enter PIN"
                      className="w-full bg-white/5 border border-white/10 px-6 py-4 outline-none focus:border-primary-600 text-3xl font-black tracking-[0.5em] text-center placeholder:text-white/10 transition-colors"
                    />
                  </div>
                  <button 
                    onClick={() => privateMutation.mutate(pin)}
                    disabled={privateMutation.isPending}
                    className="w-full h-16 bg-white dark:bg-white text-gray-900 font-black text-[10px] uppercase tracking-[0.3em] flex items-center justify-center gap-4 hover:bg-gray-100 transition-all disabled:opacity-50"
                  >
                    {privateMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4" />}
                    Unlock Records
                  </button>
                  {error && (
                    <div className="flex items-center gap-3 text-red-500 text-[10px] font-bold uppercase tracking-widest animate-in fade-in slide-in-from-top-1">
                      <ShieldAlert className="w-4 h-4" />
                      {error}
                    </div>
                  )}
               </div>
            </div>
          ) : (
            <div className="p-8 border border-gray-900 dark:border-white bg-[#0a0a0a] text-white space-y-12 relative shadow-2xl animate-in flip-in-y duration-700">
               <div className="absolute top-0 right-0 w-24 h-1 bg-emerald-500" />
               <div className="flex items-center justify-between">
                  <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-500 italic flex items-center gap-3">
                     <Unlock className="w-4 h-4" /> Records Unlocked
                  </h3>
                  <button onClick={() => {setPrivateData(null); setPin('')}} className="text-[9px] font-bold text-gray-500 hover:text-white uppercase tracking-widest transition-colors">Lock Records</button>
               </div>
               
               <div className="space-y-8">
                  <div>
                    <h4 className="text-[12px] font-black text-white uppercase tracking-widest mb-4">Granular Analytics</h4>
                    <div className="space-y-4">
                       <SummaryItem label="Last Checkup Epoch" value={new Date(privateData.lastCheckup).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase()} />
                       <SummaryItem label="Vaccination Protocol" value="COMPLIANT_ACTIVE" />
                       <SummaryItem label="Regional Deployment" value="FARM-SEC-01" />
                    </div>
                  </div>
                  <div className="pt-8 border-t border-white/10 space-y-6">
                     <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Dietary Regimen</p>
                     <p className="text-[11px] font-bold text-gray-500 uppercase italic leading-relaxed">
                        {privateData.dietRoutine || "Organic feed with natural minerals."}
                     </p>
                  </div>
               </div>
            </div>
          )}

          {/* STATUS FEED */}
          <div className="p-8 border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#0a0a0a] space-y-8">
             <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-6">
                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Activity Log</h3>
                <Zap className="w-4 h-4 text-primary-600 animate-pulse" />
             </div>
             <div className="space-y-6">
                <LogItem time="14:20:42" event="Health Check - OK" />
                <LogItem time="14:15:10" event="Temperature - Normal" />
                <LogItem time="12:00:00" event="Feeding - Done" />
             </div>
          </div>

        </div>
      </div>
    </div>
  )
}

const DataNode = ({ icon: Icon, label, value, highlight }) => (
  <div className="bg-white dark:bg-[#0a0a0a] p-8 flex flex-col items-center gap-4 group hover:bg-gray-50/50 dark:hover:bg-[#111111]/30 transition-all text-center">
    <div className="w-10 h-10 border border-gray-100 dark:border-gray-800 flex items-center justify-center text-gray-400 group-hover:text-primary-600 transition-colors">
       <Icon className="w-5 h-5" />
    </div>
    <div className="space-y-1">
      <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest leading-none">{label}</p>
      <p className={cn("text-xl font-black italic tracking-tighter uppercase", highlight ? "text-emerald-500" : "text-gray-900 dark:text-white")}>{value}</p>
    </div>
  </div>
)

const SummaryItem = ({ label, value }) => (
  <div className="flex justify-between items-end gap-4 overflow-hidden">
    <span className="text-[8px] font-bold text-gray-500 uppercase tracking-widest whitespace-nowrap">{label}</span>
    <div className="flex-1 border-b border-dotted border-white/10 mb-1" />
    <span className="text-[11px] font-black text-white italic tracking-tighter">{value}</span>
  </div>
)

const LogItem = ({ time, event }) => (
  <div className="flex items-center gap-4">
    <span className="text-[9px] font-mono text-gray-400">{time}</span>
    <div className="w-1 h-1 rounded-full bg-gray-200 dark:bg-gray-800" />
    <span className="text-[10px] font-bold text-gray-600 dark:text-gray-300 uppercase tracking-widest truncate">{event}</span>
  </div>
)

export default CattleDetail

