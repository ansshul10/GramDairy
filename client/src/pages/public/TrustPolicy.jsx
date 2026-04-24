import React, { useState, useEffect } from 'react'
import { 
  ShieldCheck, 
  Lock, 
  Eye, 
  Database, 
  UserCheck, 
  Globe2, 
  ChevronRight, 
  Mail, 
  FileLock2, 
  Scale, 
  Fingerprint,
  ArrowRight,
  ShieldAlert
} from 'lucide-react'

/* ─────────────────────────────────────────────────────────────────────────────
 * PREMIUM PRIVACY POLICY (TRUST POLICY)
 * A sophisticated, professional document designed for high-trust environments.
 * Features: Sticky Navigation, Glassmorphism, Structural Grid Aesthetics.
 * ───────────────────────────────────────────────────────────────────────────── */

const sections = [
  { id: 'collection', label: 'Data Collection', icon: Database },
  { id: 'usage', label: 'Usage & Purpose', icon: Fingerprint },
  { id: 'security', label: 'Security Infrastructure', icon: Lock },
  { id: 'sharing', label: 'Third-Party Sharing', icon: Eye },
  { id: 'rights', label: 'User Rights', icon: Scale },
  { id: 'cookies', label: 'Cookie Policy', icon: Globe2 },
];

const TrustPolicy = () => {
  const [activeSection, setActiveSection] = useState('collection');

  // Handle intersection observer for sticky nav highlighting
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.5, rootMargin: "-10% 0px -40% 0px" }
    );

    sections.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 100; // Account for sticky nav
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="bg-white dark:bg-[#0a0a0a] min-h-screen selection:bg-primary-500/20">
      
      {/* 1. ARCHITECTURAL HERO */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden border-b border-gray-100 dark:border-gray-800">
        {/* Structural Grid Overlay */}
        <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] pointer-events-none" 
             style={{ backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)', backgroundSize: '40px 40px' }} 
        />
        
        <div className="max-w-7xl mx-auto px-6 lg:px-10 relative z-10">
          <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-3 px-4 py-2 bg-primary-50 dark:bg-primary-500/5 border border-primary-100 dark:border-primary-500/10 rounded-none mb-10">
              <ShieldCheck className="w-4 h-4 text-primary-600" />
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary-700 dark:text-primary-400">Institutional Trust Protocol</span>
            </div>
            
            <h1 className="text-5xl lg:text-8xl font-bold text-gray-900 dark:text-white tracking-tighter italic leading-[0.9] mb-12">
              Privacy as a <br />
              <span className="text-gray-300 dark:text-gray-700 font-medium">Standard of Excellence.</span>
            </h1>
            
            <p className="text-sm lg:text-base font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest leading-loose max-w-2xl">
              At GramDairy, we treat your personal information with the same clinical precision and respect as our premium farm products. Transparency is our foundation.
            </p>
          </div>
        </div>
      </section>

      {/* 2. NAVIGATION & CONTENT GRID */}
      <section className="max-w-7xl mx-auto px-6 lg:px-10 py-20 lg:py-32">
        <div className="flex flex-col lg:flex-row gap-20">
          
          {/* STICKY SIDEBAR (Desktop) / TOP BAR (Mobile) */}
          <aside className="lg:w-1/4">
            <div className="sticky top-32 space-y-10">
              <div className="hidden lg:block space-y-2">
                 <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.4em] mb-6 mb-10">Document Index</p>
                 {sections.map(({ id, label, icon: Icon }) => (
                   <button
                    key={id}
                    onClick={() => scrollToSection(id)}
                    className={`group w-full flex items-center gap-4 py-4 px-6 border transition-all text-left ${
                      activeSection === id 
                        ? 'bg-gray-900 dark:bg-white border-gray-900 dark:border-white text-white dark:text-gray-900 shadow-2xl' 
                        : 'bg-transparent border-transparent text-gray-400 hover:text-gray-900 dark:hover:text-white'
                    }`}
                   >
                     <Icon className="w-4 h-4" />
                     <span className="text-[11px] font-black uppercase tracking-wider">{label}</span>
                     {activeSection === id && <ChevronRight className="w-3 h-3 ml-auto animate-pulse" />}
                   </button>
                 ))}
              </div>

              {/* Mobile Index Bar */}
              <div className="lg:hidden flex items-center gap-4 overflow-x-auto pb-6 scrollbar-hide border-b border-gray-100 dark:border-gray-800">
                 {sections.map(({ id, label, icon: Icon }) => (
                   <button
                    key={id}
                    onClick={() => scrollToSection(id)}
                    className={`flex-shrink-0 flex items-center gap-3 px-6 py-3 border text-[10px] font-black uppercase tracking-widest ${
                      activeSection === id 
                        ? 'bg-primary-600 border-primary-600 text-white' 
                        : 'border-gray-200 dark:border-gray-800 text-gray-400'
                    }`}
                   >
                     <Icon className="w-4 h-4" />
                     {label}
                   </button>
                 ))}
              </div>

              <div className="p-8 border border-gray-100 dark:border-gray-800 bg-gray-50/30 dark:bg-[#0c0c0c] hidden lg:block">
                 <div className="flex items-center gap-3 mb-6">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest leading-none mt-1">Live Document Status</span>
                 </div>
                 <p className="text-[10px] font-bold text-gray-500 uppercase leading-relaxed tracking-tight">
                    This document was last updated on <span className="text-gray-900 dark:text-white">April 19, 2026</span> and is legally binding.
                 </p>
              </div>
            </div>
          </aside>

          {/* MAIN CONTENT AREA */}
          <div className="flex-1 space-y-32">
            
            {/* DATA COLLECTION */}
            <article id="collection" className="scroll-mt-32 space-y-12 animate-in fade-in slide-in-from-bottom-5 duration-700">
               <div className="flex items-center gap-6">
                  <div className="w-16 h-16 bg-gray-900 dark:bg-white text-white dark:text-gray-900 flex items-center justify-center shadow-xl">
                     <Database className="w-7 h-7" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tighter italic uppercase underline decoration-primary-600/30 decoration-4 underline-offset-8">Data Collection</h2>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mt-2">Section 01 / Database Protocols</p>
                  </div>
               </div>
               
               <div className="grid md:grid-cols-2 gap-10">
                  <div className="p-10 border border-gray-100 dark:border-gray-800 space-y-6">
                     <FileLock2 className="w-6 h-6 text-primary-600" />
                     <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-900 dark:text-white">Direct Intelligence</h4>
                     <p className="text-sm font-medium text-gray-500 dark:text-gray-400 leading-loose">
                        We capture essential identification datasets inclusive of legal names, logistical coordinates (addresses), and encrypted verification tokens (passwords) to facilitate secure account initialization.
                     </p>
                  </div>
                  <div className="p-10 border border-gray-100 dark:border-gray-800 space-y-6">
                     <Eye className="w-6 h-6 text-primary-600" />
                     <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-900 dark:text-white">Logistical Telemetry</h4>
                     <p className="text-sm font-medium text-gray-500 dark:text-gray-400 leading-loose">
                        To optimize rapid fulfillment, we track geostatial movement relative to our distribution centers and automated subscription cycle triggers.
                     </p>
                  </div>
               </div>
            </article>

            {/* USAGE & PURPOSE */}
            <article id="usage" className="scroll-mt-32 space-y-12">
               <div className="flex items-center gap-6">
                  <div className="w-16 h-16 bg-gray-900 dark:bg-white text-white dark:text-gray-900 flex items-center justify-center shadow-xl">
                     <Fingerprint className="w-7 h-7" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tighter italic uppercase underline decoration-primary-600/30 decoration-4 underline-offset-8">Usage & Purpose</h2>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mt-2">Section 02 / Operational Intent</p>
                  </div>
               </div>
               
               <p className="text-sm lg:text-base font-medium text-gray-500 dark:text-gray-400 leading-loose max-w-4xl">
                  Information processed by our neural network serves the singular purpose of operational excellence. This includes route optimization for delivery partners, predictive analytics for supply-chain management, and transactional verification. We do not engage in data harvesting for non-operational utilization.
               </p>
            </article>

            {/* SECURITY INFRASTRUCTURE */}
            <article id="security" className="scroll-mt-32">
               <div className="p-12 lg:p-20 bg-gray-900 dark:bg-white text-white dark:text-gray-900 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-48 h-1 bg-primary-600" />
                  <div className="absolute -bottom-10 -right-10 opacity-10 group-hover:scale-110 transition-transform duration-1000">
                     <Lock className="w-64 h-64" />
                  </div>
                  
                  <div className="relative z-10 space-y-10">
                    <div className="flex items-center gap-3">
                       <ShieldAlert className="w-5 h-5 text-primary-500" />
                       <span className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400 dark:text-gray-500">Security Architecture</span>
                    </div>
                    <h3 className="text-4xl lg:text-6xl font-bold italic tracking-tighter leading-tight">Fortified <br/> Encryption.</h3>
                    <p className="text-sm lg:text-lg font-medium text-gray-300 dark:text-gray-600 max-w-2xl leading-relaxed">
                       Our infrastructure utilizes AES-256 bit encryption at rest and TLS 1.3 in transit. Financial transactions are conducted through Tier-1 PCI-compliant gateways where no raw sensitive payment data enters our internal vectors.
                    </p>
                  </div>
               </div>
            </article>

            {/* THIRD-PARTY / RIGHTS / COOKIES (Combined for flow) */}
            <div className="grid lg:grid-cols-1 gap-32">
              <section id="sharing" className="scroll-mt-32 space-y-8">
                <h4 className="text-[11px] font-black uppercase tracking-[0.4em] text-gray-400 flex items-center gap-4">
                  <span className="w-10 h-px bg-gray-200" /> External Nodes
                </h4>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white italic uppercase tracking-tight">Third-Party Policy</h3>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 leading-loose max-w-3xl">
                   We maintain a strictly isolated ecosystem. Data is only shared with licensed logistics partners (for execution) and statutory authorities (where mandated by legal injunction). We hold a zero-tolerance policy towards the dissemination of user vectors to external advertisers.
                </p>
              </section>

              <section id="rights" className="scroll-mt-32 space-y-10">
                <h4 className="text-[11px] font-black uppercase tracking-[0.4em] text-gray-400 flex items-center gap-4">
                  <span className="w-10 h-px bg-gray-200" /> Sovereignty
                </h4>
                <div className="grid md:grid-cols-2 gap-10">
                   {[
                     { t: 'Access & Portability', d: 'Request a comprehensive export of your stored datasets at any time.' },
                     { t: 'Rectification', d: 'Modify or update your logistical coordinates via the User Control Panel.' },
                     { t: 'Right to Erasure', d: 'The "Right to be Forgotten" is integrated into our core decommissioning protocol.' },
                     { t: 'Restrict Processing', d: 'Opt-out of non-critical telemetry and newsletter broadasts.' }
                   ].map((item, i) => (
                     <div key={i} className="space-y-4">
                        <p className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-wider italic">{item.t}</p>
                        <p className="text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest leading-loose">{item.d}</p>
                     </div>
                   ))}
                </div>
              </section>

              <section id="cookies" className="scroll-mt-32 space-y-8 p-12 lg:p-16 border border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-[#0c0c0c]">
                <Globe2 className="w-8 h-8 text-primary-600 mb-6" />
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white italic uppercase tracking-tight">Cookie Protocol</h3>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 leading-loose">
                   Our application utilizes essential session descriptors and persistent security tokens to maintain verification state. These are non-invasive and contain no PII (Personally Identifiable Information). Third-party tracking cookies are strictly prohibited across all GramDairy subdomains.
                </p>
              </section>
            </div>

            {/* 3. CONTACT FINAL CALL */}
            <div className="pt-20 border-t border-gray-100 dark:border-gray-800 text-center space-y-12">
               <div className="max-w-2xl mx-auto space-y-8">
                  <h3 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tighter italic uppercase">Need specific clarity?</h3>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400 leading-relaxed uppercase tracking-widest">
                     Our Data Privacy Officer (DPO) is available to handle complex queries regarding specialized datasets or regional compliance requirements.
                  </p>
                  <div className="pt-10 flex flex-col sm:flex-row items-center justify-center gap-6">
                     <a href="/support" className="group w-full sm:w-auto px-12 py-6 bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-[10px] font-black uppercase tracking-[0.4em] hover:bg-primary-600 dark:hover:bg-primary-500 dark:hover:text-white transition-all flex items-center justify-center gap-4 shadow-2xl">
                        Contact Privacy Liaison <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
                     </a>
                     <button className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400 hover:text-primary-600 transition-colors p-6">
                        Download PDF Charter
                     </button>
                  </div>
               </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  )
}

export default TrustPolicy
