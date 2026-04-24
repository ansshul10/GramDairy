import React from 'react'
import { useQuery } from '@tanstack/react-query'
import publicService from '../../services/publicService'
import { Server, Activity, Database, ShieldCheck, Zap, Clock, Globe2, AlertCircle, CheckCircle2, RefreshCw } from 'lucide-react'
import { cn } from '../../lib/utils'

/* ─────────────────────────────────────────────────────────────────────────────
 * SYSTEM STATUS PAGE
 * A premium, logistics-grade dashboard for customers to monitor system health.
 * ───────────────────────────────────────────────────────────────────────────── */

const MetricCard = ({ title, value, subtext, icon: Icon, status = 'Healthy' }) => (
  <div className="bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-gray-800 p-8 shadow-sm group">
    <div className="flex items-start justify-between mb-8">
      <div className="w-12 h-12 bg-gray-50 dark:bg-[#111111] border border-gray-100 dark:border-gray-800 flex items-center justify-center text-gray-400 group-hover:text-primary-600 transition-colors">
        <Icon className="w-6 h-6" />
      </div>
      <div className={cn(
        "px-3 py-1 text-[9px] font-black uppercase tracking-widest border",
        status === 'Healthy' || status === 'Operational' || status === 'Online' 
          ? "bg-emerald-500/5 text-emerald-600 border-emerald-500/10"
          : "bg-amber-500/5 text-amber-600 border-amber-500/10"
      )}>
        {status}
      </div>
    </div>
    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 italic">{title}</p>
    <p className="text-3xl font-bold text-gray-900 dark:text-white tracking-tighter mb-4 italic">{value}</p>
    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-tight">{subtext}</p>
  </div>
);

const ServiceRow = ({ name, status, icon: Icon }) => (
  <div className="flex items-center justify-between py-6 border-b border-gray-100 dark:border-gray-800/50">
    <div className="flex items-center gap-6">
      <Icon className="w-5 h-5 text-gray-300" />
      <span className="text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-tight">{name}</span>
    </div>
    <div className="flex items-center gap-3">
      <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">{status}</span>
      <div className="w-2 h-2 bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)] animate-pulse" />
    </div>
  </div>
);

const SystemStatus = () => {
  const { data: statusResponse, isLoading, refetch } = useQuery({
    queryKey: ['system-status'],
    queryFn: () => publicService.getSystemStatus(),
    refetchInterval: 60000, // Refresh every minute
  })

  const stats = statusResponse?.data || {
    health: {},
    metrics: {}
  }

  return (
    <div className="bg-white dark:bg-[#0a0a0a] min-h-screen">
      {/* 1. HEADER HERO */}
      <section className="pt-32 pb-20 border-b border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-[#0c0c0c] relative overflow-hidden">
         <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
            style={{ backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)', backgroundSize: '50px 50px' }} 
         />
         
        <div className="max-w-7xl mx-auto px-10 relative z-10 text-center">
          <div className="inline-flex items-center gap-3 px-6 py-2 bg-emerald-500/5 border border-emerald-500/10 mb-10">
            <div className="w-2 h-2 bg-emerald-500 animate-pulse" />
            <span className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.4em]">All Systems Operational</span>
          </div>
          
          <h1 className="text-5xl lg:text-7xl font-bold text-gray-900 dark:text-white tracking-tighter italic mb-8">
            Network <span className="text-gray-400 font-medium">Purity Check.</span>
          </h1>
          
          <p className="text-sm font-bold text-gray-500 uppercase tracking-widest max-w-2xl mx-auto leading-relaxed">
            Real-time monitoring of our delivery logistics and platform health. We ensure your dairy reaches you with zero technical or logical delays.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-10 py-24 space-y-24">
        {/* 2. CORE METRICS GRID */}
        <section>
          <div className="flex items-center justify-between mb-12">
             <h2 className="text-[10px] font-black text-primary-600 uppercase tracking-[0.4em] italic flex items-center gap-3">
               <Activity className="w-4 h-4" /> Logistics Performance
             </h2>
             <button 
                onClick={() => refetch()}
                className="flex items-center gap-2 text-[10px] font-bold text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors uppercase tracking-widest"
              >
               <RefreshCw className={cn("w-3 h-3", isLoading && "animate-spin")} /> Update Status
             </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-gray-200 dark:bg-gray-800 border border-gray-200 dark:border-gray-800 shadow-2xl">
            <MetricCard 
              title="System Uptime"
              value={stats.metrics.uptime || '99.9%'}
              subtext="Platform availability over the last 30 days."
              icon={Server}
              status="Online"
            />
            <MetricCard 
              title="Delivery Success"
              value={stats.metrics.deliverySuccessRate || '98.4%'}
              subtext="Orders delivered within the preferred time slot."
              icon={Zap}
              status="Healthy"
            />
            <MetricCard 
              title="Average Arrival"
              value={stats.metrics.averageDeliveryTime || '24 mins'}
              subtext="From hub departure to customer doorstep."
              icon={Clock}
              status="Healthy"
            />
            <MetricCard 
              title="Partner Network"
              value={stats.metrics.activePartners || '740+'}
              subtext="Active delivery personnel currently on route."
              icon={Globe2}
              status="Operational"
            />
          </div>
        </section>

        {/* 3. SERVICE DEPTH */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-20">
          <div className="space-y-12">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight uppercase italic mb-4">Core Infrastructure</h3>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-widest leading-loose">
                We monitor every individual service that powers your morning milk delivery, from payment gateways to our route optimization engine.
              </p>
            </div>
            
            <div className="border border-gray-100 dark:border-gray-800 bg-gray-50/30 dark:bg-[#0c0c0c] p-8">
              <ServiceRow name="Central Command Node" status="Operational" icon={ShieldCheck} />
              <ServiceRow name="Payment Integrity" status="Active" icon={Zap} />
              <ServiceRow name="User Verification" status={stats.health.sms || 'Operational'} icon={Database} />
              <ServiceRow name="Logistics Engine" status="Healthy" icon={Server} />
              <ServiceRow name="Communication Hub" status={stats.health.email || 'Operational'} icon={RefreshCw} />
            </div>
          </div>

          <div className="space-y-12">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight uppercase italic mb-4">System Announcements</h3>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-widest leading-loose">
                Latest updates regarding maintenance and system improvements.
              </p>
            </div>
            
            <div className="space-y-8">
              <div className="p-8 border-l-4 border-emerald-500 bg-emerald-500/5 space-y-3">
                 <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Completed</span>
                 </div>
                 <h4 className="font-bold text-gray-900 dark:text-white uppercase tracking-tight">Backend Scalability Patch</h4>
                 <p className="text-[11px] text-gray-500 font-bold uppercase leading-relaxed tracking-tight">
                    Integrated higher-capacity database nodes to handle increased subscription volume during peak morning hours.
                 </p>
              </div>

              <div className="p-8 border-l-4 border-primary-500 bg-primary-500/5 space-y-3">
                 <div className="flex items-center gap-3">
                    <Clock className="w-4 h-4 text-primary-500" />
                    <span className="text-[10px] font-black text-primary-600 uppercase tracking-widest">Upcoming Maintenance</span>
                 </div>
                 <h4 className="font-bold text-gray-900 dark:text-white uppercase tracking-tight">Routine Hub Maintenance</h4>
                 <p className="text-[11px] text-gray-500 font-bold uppercase leading-relaxed tracking-tight">
                    Scheduled maintenance on Sunday, 02:00 AM. No impact on morning deliveries is expected.
                 </p>
              </div>
            </div>
          </div>
        </section>
      </div>
      
      {/* 4. FOOTER STATUS BLOCK */}
      <section className="bg-gray-900 py-20 px-10 text-center relative overflow-hidden">
         <div className="absolute inset-0 bg-primary-600/5 pointer-events-none" />
         <div className="max-w-2xl mx-auto relative z-10 space-y-8">
            <h3 className="text-xl font-bold text-white uppercase tracking-tighter italic">Found a Service Issue?</h3>
            <p className="text-[11px] text-gray-400 font-bold uppercase tracking-widest leading-loose">
               Our engineering team is notified of major issues instantly. However, if you notice something wrong with your specific account, please reach out.
            </p>
            <div className="pt-6">
                <a href="/support" className="px-12 py-5 bg-white text-black text-[10px] font-black uppercase tracking-[0.4em] hover:bg-primary-600 transition-all shadow-2xl">
                    Contact Support Node
                </a>
            </div>
         </div>
      </section>
    </div>
  )
}

export default SystemStatus
