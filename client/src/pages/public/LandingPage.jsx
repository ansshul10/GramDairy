import React from 'react'
import { Link } from 'react-router-dom'
import { 
  Building2, 
  ArrowRight, 
  ShieldCheck, 
  Truck, 
  Zap, 
  Globe2, 
  BarChart3, 
  Lock, 
  Users, 
  CheckCircle2, 
  Server,
  Package,
  CalendarDays,
  Target,
  Workflow,
  Activity,
  Terminal,
  Database,
  Fingerprint,
  Box,
  LayoutGrid
} from 'lucide-react'
import BillAnnouncement from '../../components/billing/BillAnnouncement'

/* ─────────────────────────────────────────────────────────────────────────────
 * LANDING PAGE
 * A clean, welcoming entry point for dairy delivery services.
 * ───────────────────────────────────────────────────────────────────────────── */

// ─────────────────────────────────────────────────────────────────────────────
// TECHNICAL UTILITIES
// ─────────────────────────────────────────────────────────────────────────────

const MetricTerminal = ({ icon: Icon, label, value, subtext, color = "primary" }) => (
  <div className="p-8 border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#0a0a0a] flex flex-col gap-6 relative group overflow-hidden">
    <div className={`absolute top-0 right-0 w-16 h-1 ${color === 'primary' ? 'bg-primary-600' : 'bg-emerald-500'}`} />
    <div className="w-12 h-12 bg-gray-50/50 dark:bg-[#111111] border border-gray-100 dark:border-gray-800 flex items-center justify-center text-gray-400 group-hover:text-primary-600 transition-colors">
      <Icon className="w-6 h-6" />
    </div>
    <div>
      <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 mb-2">{label}</p>
      <p className="text-4xl font-bold text-gray-900 dark:text-white tracking-tighter mb-4 italic">{value}</p>
      <div className="flex items-center gap-2 mb-2">
          <Activity className="w-3 h-3 text-emerald-500" />
          <span className="text-[8px] font-bold text-gray-400 uppercase tracking-widest">Active Now</span>
      </div>
      <p className="text-[10px] text-gray-500 font-bold uppercase leading-relaxed tracking-tight">{subtext}</p>
    </div>
  </div>
);

const ModuleBlock = ({ icon: Icon, title, description, links }) => (
  <div className="group border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#0a0a0a] relative overflow-hidden transition-all hover:bg-gray-50/50 dark:hover:bg-[#0c0c0c]">
    <div className="absolute top-0 left-0 w-full h-1 bg-gray-100 dark:bg-gray-800" />
    <div className="absolute top-0 left-0 w-0 h-1 bg-primary-600 transition-all duration-500 group-hover:w-full" />
    
    <div className="p-12 space-y-8">
      <div className="w-16 h-16 border border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-[#111111] flex items-center justify-center text-gray-400 group-hover:text-primary-600 transition-all group-hover:scale-110">
        <Icon className="w-8 h-8" />
      </div>
      
      <div>
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 uppercase tracking-tighter italic">{title}</h3>
        <p className="text-[11px] font-bold text-gray-500 dark:text-gray-400 leading-relaxed uppercase tracking-tight mb-10 max-w-xs">
          {description}
        </p>
        
        <div className="flex flex-col gap-4">
          {links.map((link, idx) => (
            <Link 
              key={idx} 
              to={link.to} 
              className="group/link inline-flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
            >
              <span className="w-4 h-px bg-gray-300 dark:bg-gray-800 group-hover/link:w-8 group-hover/link:bg-primary-600 transition-all" />
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  </div>
);

const TelemetryBadge = ({ icon: Icon, text }) => (
  <span className="inline-flex items-center gap-2 px-6 py-3 bg-gray-50/50 dark:bg-[#111111] border border-gray-100 dark:border-gray-800 text-[9px] font-black uppercase tracking-[0.3em] text-gray-500 dark:text-gray-400 italic">
    <Icon className="w-3.5 h-3.5" /> {text}
  </span>
);

// ─────────────────────────────────────────────────────────────────────────────
// LANDING PAGE INTERFACE
// ─────────────────────────────────────────────────────────────────────────────

const LandingPage = () => {
  return (
    <div className="flex flex-col bg-white dark:bg-[#0a0a0a] min-h-screen">
      <BillAnnouncement />
      
      {/* 1. HERO SECTION */}
      <section className="relative pt-24 pb-16 lg:pt-32 lg:pb-24 px-10 border-b border-gray-200 dark:border-gray-800 overflow-hidden">
        {/* Architectural Structural Grid Overlay */}
        <div className="absolute inset-0 opacity-[0.05] dark:opacity-[0.1] pointer-events-none" 
          style={{ backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)', backgroundSize: '100px 100px' }} 
        />
        
        <div className="max-w-[1400px] mx-auto relative z-10">
          <div className="flex flex-col lg:flex-row gap-24 items-start">
            
            <div className="w-full lg:w-4/7">
              <div className="flex flex-wrap gap-4 mb-12">
                <TelemetryBadge icon={ShieldCheck} text="Dairy Certified" />
                <TelemetryBadge icon={Zap} text="Fast Delivery" />
              </div>
              
              <h1 className="text-5xl lg:text-7xl font-bold text-gray-900 dark:text-white leading-[1.1] tracking-tighter mb-10 italic">
                Pure Dairy, <br />
                <span className="text-primary-600 font-black">Delivered Fresh.</span>
              </h1>
              
              <p className="text-[14px] font-medium text-gray-500 dark:text-gray-400 leading-relaxed mb-16 max-w-2xl uppercase tracking-wider">
                GramDairy delivers farm-fresh milk and dairy products directly to your doorstep with guaranteed purity and on-time delivery every single morning.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-8">
                <Link 
                  to="/products" 
                  className="px-16 py-7 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-black tracking-[0.4em] uppercase text-[10px] shadow-2xl hover:bg-gray-800 transition-all flex items-center justify-center gap-6"
                >
                  <Box className="w-4 h-4" />
                  Shop Products
                </Link>
                <Link 
                  to="/delivery/apply" 
                  className="px-16 py-7 border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white font-black tracking-[0.4em] uppercase text-[10px] hover:bg-gray-50 dark:hover:bg-[#111111] transition-all flex items-center justify-center gap-6"
                >
                  <Truck className="w-4 h-4 text-primary-600" />
                  Partner With Us
                </Link>
              </div>
            </div>

            {/* LIVE FEED BLOCK */}
            <div className="w-full lg:w-3/7 space-y-8">
              <div className="p-10 border border-gray-900 dark:border-white bg-[#0a0a0a] text-white relative shadow-2xl">
                <div className="absolute top-0 right-0 w-24 h-1 bg-primary-600" />
                <div className="flex items-center justify-between mb-12">
                     <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] flex items-center gap-3">
                        Live Stats
                     </h4>
                      <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-none">
                        <div className="w-1.5 h-1.5 rounded-none bg-emerald-500 animate-pulse" />
                        <span className="text-[8px] font-bold text-emerald-500 uppercase tracking-widest">Active</span>
                      </div>
                </div>
                
                <div className="space-y-10">
                  <div className="flex items-center justify-between border-b border-gray-800 pb-6">
                    <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Delivery Partners</span>
                    <span className="text-2xl font-bold tracking-tighter">740+</span>
                  </div>
                  <div className="flex items-center justify-between border-b border-gray-800 pb-6">
                    <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Avg. Delivery Time</span>
                    <span className="text-2xl font-bold tracking-tighter text-emerald-500">{"< 30 mins"}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Product Purity</span>
                    <span className="text-2xl font-bold tracking-tighter italic text-primary-500">100% Guaranteed</span>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-8">
                <div className="p-8 border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#0a0a0a] flex flex-col gap-4 group">
                  <Globe2 className="w-6 h-6 text-gray-300 group-hover:text-primary-600 transition-colors" />
                  <div>
                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Delivery Area</p>
                    <p className="text-sm font-bold text-gray-900 dark:text-white uppercase italic tracking-tighter">Local & Fresh</p>
                  </div>
                </div>
                <div className="p-8 border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#0a0a0a] flex flex-col gap-4 group">
                  <Fingerprint className="w-6 h-6 text-gray-300 group-hover:text-primary-600 transition-colors" />
                  <div>
                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Secure Access</p>
                    <p className="text-sm font-bold text-gray-900 dark:text-white uppercase italic tracking-tighter">Verified Users</p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. KEY METRICS */}
      <section className="bg-gray-50/50 dark:bg-[#0c0c0c] border-b border-gray-200 dark:border-gray-800 py-16 px-10">
        <div className="max-w-[1400px] mx-auto">
          <div className="flex flex-col lg:flex-row justify-between items-end gap-12 mb-24">
            <div className="max-w-xl">
              <h2 className="text-[10px] font-black text-primary-600 uppercase tracking-[0.4em] mb-6 flex items-center gap-3 italic">
                  <BarChart3 className="w-4 h-4" /> Why Choose GramDairy?
              </h2>
              <h3 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tighter leading-tight italic">
                   Quality and reliability verified by <span className="text-gray-400 font-medium">regular farm audits.</span>
              </h3>
            </div>
            <div className="text-[9px] font-bold text-gray-400 uppercase tracking-widest pb-2">
                Last Updated: Today
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-gray-200 dark:bg-gray-800 border border-gray-200 dark:border-gray-800 shadow-2xl">
            <MetricTerminal 
              icon={Server} 
              label="Always On Time" 
              value="99.9%+" 
              subtext="Reliable delivery network ensures you never miss your morning milk." 
            />
            <MetricTerminal 
              icon={ShieldCheck} 
              label="Secure Payments" 
              value="Safe & Fast" 
              subtext="Encrypted transactions for all your purchases and bills." 
              color="emerald"
            />
            <MetricTerminal 
              icon={Activity} 
              label="Fresh Daily" 
              value="Pure & Raw" 
              subtext="Sourced directly from farms and delivered in hours." 
            />
            <MetricTerminal 
              icon={CheckCircle2} 
              label="Quality Certified" 
              value="A+ Grade" 
              subtext="Certified by food safety and local dairy regulators." 
              color="emerald"
            />
          </div>
        </div>
      </section>

      {/* 3. OUR SERVICES */}
      <section className="py-20 px-10 relative">
         {/* Sub-bg element */}
         <div className="absolute top-0 right-0 w-1/3 h-full bg-gray-50 dark:bg-[#080808] -z-10 border-l border-gray-100 dark:border-gray-900" />
         
        <div className="max-w-[1400px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-0 border border-gray-200 dark:border-gray-800 shadow-2xl">
            <ModuleBlock 
              icon={Package}
              title="Fresh Products"
              description="Browse our wide selection of raw milk, ghee, and other dairy products. Guaranteed purity in every order."
              links={[
                { label: 'View Products', to: '/products' },
                { label: 'Our Categories', to: '/products' }
              ]}
            />
            <ModuleBlock 
              icon={CalendarDays}
              title="Daily Subscriptions"
              description="Set up your recurring milk delivery. Pause, resume or change your plan anytime with a single click."
              links={[
                { label: 'Manage Plans', to: '/subscriptions' },
                { label: 'Subscribe Now', to: '/subscriptions' }
              ]}
            />
            <ModuleBlock 
              icon={Workflow}
              title="Join Our Team"
              description="Become a part of our growing delivery network. Excellent earnings and flexible work hours."
              links={[
                { label: 'Apply Now', to: '/delivery/apply' },
                { label: 'Partner Dashboard', to: '/delivery/dashboard' }
              ]}
            />
          </div>
        </div>
      </section>

      {/* 4. TRUST & SECURITY */}
      <section className="bg-gray-900 py-24 px-10 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-primary-600/[0.03] blur-[100px] pointer-events-none" />
        
        <div className="max-w-[1400px] mx-auto relative z-10">
          <div className="flex flex-col lg:flex-row gap-32 items-center">
            <div className="lg:w-1/2 space-y-12">
              <div className="space-y-6">
                <h2 className="text-[10px] font-black text-primary-500 uppercase tracking-[0.5em] italic">Secure & Reliable</h2>
                <h3 className="text-4xl lg:text-6xl font-bold text-white tracking-tighter leading-none italic">
                    Trust the Purity <br />
                    <span className="text-gray-500 font-medium">of GramDairy.</span>
                </h3>
              </div>
              
              <div className="space-y-12 max-w-lg">
                <div className="flex gap-8 group">
                  <div className="w-16 h-16 border border-white/10 bg-white/5 flex items-center justify-center flex-shrink-0 text-primary-400 group-hover:bg-primary-500 group-hover:text-white transition-all">
                    <Lock className="w-7 h-7" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-white mb-3 uppercase tracking-tight italic">Secure Account</h4>
                    <p className="text-[11px] font-bold text-gray-500 leading-relaxed uppercase tracking-tighter">
                      Your data and transactions are protected. Multi-factor verification ensures your account stays safe.
                    </p>
                  </div>
                </div>
                <div className="flex gap-8 group">
                  <div className="w-16 h-16 border border-white/10 bg-white/5 flex items-center justify-center flex-shrink-0 text-blue-400 group-hover:bg-blue-500 group-hover:text-white transition-all">
                    <Target className="w-7 h-7" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-white mb-3 uppercase tracking-tight italic">Smart Delivery</h4>
                    <p className="text-[11px] font-bold text-gray-500 leading-relaxed uppercase tracking-tighter">
                      Our system optimizes delivery routes to ensure your dairy products reach you as fast as possible.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="lg:w-1/2 w-full">
              <div className="p-16 border border-white/10 bg-[#070707] relative shadow-[0_0_80px_rgba(0,0,0,1)]">
                <div className="absolute top-0 right-0 p-8">
                     <Activity className="w-6 h-6 text-emerald-500 animate-pulse" />
                </div>
                <div className="flex items-center gap-6 mb-16">
                  <div className="w-16 h-16 bg-primary-600 flex items-center justify-center">
                       <Building2 className="w-8 h-8 text-black" />
                  </div>
                  <div>
                    <h4 className="text-2xl font-black text-white italic tracking-tighter">GramDairy Network</h4>
                    <p className="text-[9px] font-bold text-gray-600 uppercase tracking-[0.3em] mt-1 italic">Verified System Status</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-x-12 gap-y-12">
                  <div className="space-y-2">
                    <p className="text-[9px] font-black text-gray-600 uppercase tracking-widest">Version</p>
                    <p className="text-sm font-bold text-gray-300 font-mono italic">v1.0.0</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-[9px] font-black text-gray-600 uppercase tracking-widest">Connection Status</p>
                    <p className="text-sm font-bold text-emerald-500 font-mono italic">SECURE</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-[9px] font-black text-gray-600 uppercase tracking-widest">Data Protection</p>
                    <p className="text-sm font-bold text-gray-300 font-mono italic">ACTIVE</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-[9px] font-black text-gray-600 uppercase tracking-widest">System Status</p>
                    <p className="text-sm font-bold text-primary-500 font-mono italic uppercase">Online</p>
                  </div>
                </div>
                
                <div className="mt-16 pt-8 border-t border-white/5 flex items-center justify-between">
                     <span className="text-[9px] font-bold text-gray-700 uppercase tracking-widest">Secure Payments Protected</span>
                     <Link to="/auth/login" className="text-[9px] font-black text-primary-500 uppercase tracking-widest hover:underline underline-offset-4 decoration-2">Login Now</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. START TODAY SECTION */}
      <section className="py-32 px-10 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
          style={{ backgroundImage: 'radial-gradient(circle, #000 1px, transparent 1px)', backgroundSize: '40px 40px' }} 
        />
        
        <div className="max-w-4xl mx-auto relative z-10">
          <h2 className="text-[10px] font-black text-primary-600 uppercase tracking-[0.5em] mb-12 italic">Join GramDairy Today</h2>
          <h3 className="text-4xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-16 tracking-tighter leading-[1.1] italic">
            Start your daily <br />
            <span className="text-gray-400 font-medium whitespace-nowrap">fresh milk delivery.</span>
          </h3>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-10">
            <Link 
              to="/auth/register" 
              className="group px-20 py-8 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-black tracking-[0.5em] uppercase text-[10px] shadow-[0_35px_60px_-15px_rgba(0,0,0,0.3)] hover:scale-105 transition-all w-full sm:w-auto relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-primary-600 translate-y-full group-hover:translate-y-0 transition-transform duration-300 -z-10" />
              Sign Up
            </Link>
            <Link 
              to="/auth/login" 
              className="px-20 py-8 border border-gray-900 dark:border-white text-gray-900 dark:text-white font-black tracking-[0.5em] uppercase text-[10px] hover:bg-gray-50 dark:hover:bg-[#111111] transition-all w-full sm:w-auto"
            >
              Login Now
            </Link>
          </div>
          
          <div className="mt-20 flex flex-col items-center gap-4">
              <div className="w-px h-16 bg-gray-200 dark:bg-gray-800" />
              <p className="text-gray-400 text-[9px] font-black uppercase tracking-[0.3em] italic">
                Secure Delivery Network // Join Thousands of Happy Customers
              </p>
          </div>
        </div>
      </section>

    </div>
  )
}

export default LandingPage
