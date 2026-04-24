import React, { useEffect, useState } from 'react';
import { 
  History, 
  Heart, 
  Sprout, 
  Flag, 
  Users, 
  ShieldCheck, 
  Globe2, 
  Truck, 
  Leaf, 
  ArrowRight, 
  Zap, 
  CheckCircle2, 
  Mail, 
  ChevronRight,
  Target,
  FlaskConical,
  Trees,
  Gem,
  Star,
  Award,
  ArrowDownCircle
} from 'lucide-react';
import { Link } from 'react-router-dom';

/* ─────────────────────────────────────────────────────────────────────────────
 * OUR STORY — PREMIUM BRAND NARRATIVE
 * A deep-dive into the heritage, mission, and technical excellence of GramDairy.
 * Engineered with high-fidelity components and exhaustive storytelling.
 * ───────────────────────────────────────────────────────────────────────────── */

// ─────────────────────────────────────────────────────────────────────────────
// MODULAR SUB-COMPONENTS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * A technical telemetry badge for core values.
 */
const CoreValueFeature = ({ icon: Icon, title, description, index }) => (
  <div className="group relative p-10 border border-gray-100 dark:border-gray-800 bg-white dark:bg-[#0a0a0a] hover:bg-gray-50/50 dark:hover:bg-[#0c0c0c] transition-all overflow-hidden">
    <div className="absolute top-0 left-0 w-full h-1 bg-gray-100 dark:bg-gray-800" />
    <div className="absolute top-0 left-0 w-0 h-1 bg-primary-600 transition-all duration-500 group-hover:w-full" />
    <div className="flex flex-col gap-10">
      <div className="flex items-center justify-between">
         <div className="w-16 h-16 bg-gray-50 dark:bg-[#111111] border border-gray-100 dark:border-gray-800 flex items-center justify-center text-gray-400 group-hover:text-primary-600 transition-all group-hover:scale-110">
           <Icon className="w-7 h-7" />
         </div>
         <span className="text-[10px] font-black text-gray-200 dark:text-gray-800 uppercase tracking-widest">{String(index).padStart(2, '0')}</span>
      </div>
      <div>
        <h4 className="text-xl font-bold text-gray-900 dark:text-white uppercase tracking-tighter italic mb-4">{title}</h4>
        <p className="text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase leading-loose tracking-tight group-hover:text-gray-900 dark:group-hover:text-gray-200 transition-colors">
          {description}
        </p>
      </div>
    </div>
  </div>
);

/**
 * A milestone item for the vertical timeline.
 */
const LegacyMilestone = ({ year, title, event, icon: Icon, align = 'left' }) => (
  <div className={`relative flex items-center justify-between mb-24 w-full group ${align === 'right' ? 'flex-row-reverse' : ''}`}>
    <div className="hidden lg:block w-5/12" />
    <div className="z-10 flex items-center justify-center w-14 h-14 bg-gray-900 dark:bg-white text-white dark:text-gray-900 shadow-2xl transition-transform group-hover:rotate-12">
      <Icon className="w-6 h-6" />
    </div>
    <div className="w-full lg:w-5/12 p-8 lg:p-12 border border-gray-100 dark:border-gray-800 bg-white dark:bg-[#0a0a0a] shadow-xl hover:shadow-2xl transition-all">
       <div className="flex flex-col gap-4">
          <span className="text-4xl font-black italic tracking-tighter text-primary-600/20 group-hover:text-primary-600/40 transition-colors">{year}</span>
          <h5 className="text-xl font-bold text-gray-900 dark:text-white uppercase tracking-tighter italic">{title}</h5>
          <p className="text-[11px] font-bold text-gray-500 dark:text-gray-400 leading-relaxed uppercase tracking-widest">{event}</p>
       </div>
    </div>
  </div>
);

/**
 * Technical Lab/Standard Badge
 */
const ProtocolBadge = ({ label, text }) => (
  <div className="p-8 border border-gray-100 dark:border-gray-800 bg-gray-50/20 dark:bg-[#0c0c0c] hover:border-emerald-500/30 transition-all group">
    <div className="flex items-center gap-4 mb-4">
       <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
       <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">{label}</span>
    </div>
    <p className="text-[11px] font-black text-gray-900 dark:text-white uppercase tracking-tight leading-relaxed group-hover:text-emerald-500 transition-colors">{text}</p>
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// OUR STORY INTERFACE
// ─────────────────────────────────────────────────────────────────────────────

const OurStory = () => {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (window.pageYOffset / totalScroll) * 100;
      setScrollProgress(progress);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="bg-white dark:bg-[#0a0a0a] min-h-screen selection:bg-primary-500/20 overflow-x-hidden">
      
      {/* 1. TOP PROGRESS BAR */}
      <div className="fixed top-0 left-0 h-1 bg-primary-600 z-[100] transition-all duration-300 pointer-events-none" style={{ width: `${scrollProgress}%` }} />

      {/* 2. INSTITUTIONAL HERO HEADER */}
      <section className="relative pt-40 pb-32 lg:pt-64 lg:pb-48 border-b border-gray-100 dark:border-gray-800 overflow-hidden">
        {/* Structural Grid Overlay */}
        <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] pointer-events-none" 
             style={{ backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)', backgroundSize: '60px 60px' }} 
        />
        
        {/* Blurred Accent Circles */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-primary-500/5 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-emerald-500/5 blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 lg:px-10 relative z-10">
           <div className="flex flex-col items-center text-center max-w-5xl mx-auto">
              <div className="flex items-center gap-6 mb-16 animate-in slide-in-from-bottom-5 duration-700">
                 <div className="w-12 h-px bg-gray-200 dark:bg-gray-800" />
                 <span className="text-[10px] font-black text-primary-600 uppercase tracking-[0.5em] italic">Established MMXXIV</span>
                 <div className="w-12 h-px bg-gray-200 dark:bg-gray-800" />
              </div>
              
              <h1 className="text-6xl lg:text-[140px] font-bold text-gray-900 dark:text-white tracking-tighter leading-[0.85] italic mb-16 animate-in slide-in-from-bottom-5 duration-1000">
                Purity as a <br/>
                <span className="text-gray-300 dark:text-gray-800 font-medium">Sacred Vow.</span>
              </h1>
              
              <p className="text-sm lg:text-xl font-bold text-gray-500 dark:text-gray-400 uppercase tracking-[0.2em] leading-loose max-w-3xl animate-in slide-in-from-bottom-5 duration-1000 delay-200">
                GramDairy began as a humble initiative to bridge the gap between lush, untainted farm pastures and the modern urban doorstep. We don't just sell milk; we deliver heritage.
              </p>

              <div className="pt-20 animate-bounce cursor-pointer opacity-40 hover:opacity-100 transition-opacity">
                 <ArrowDownCircle className="w-10 h-10 text-gray-400" />
              </div>
           </div>
        </div>
      </section>

      {/* 3. FOUNDATION & HERITAGE NARRATIVE */}
      <section className="py-24 lg:py-48 bg-gray-50/30 dark:bg-[#0c0c0c] relative">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 grid lg:grid-cols-2 gap-24 items-center">
           <div className="space-y-12">
              <div className="space-y-4">
                 <h2 className="text-[11px] font-black text-primary-600 uppercase tracking-[0.4em]">The Heritage Nodes</h2>
                 <h3 className="text-4xl lg:text-6xl font-bold text-gray-900 dark:text-white tracking-tighter italic uppercase underline decoration-primary-600/30 decoration-8 underline-offset-[12px]">Our Roots.</h3>
              </div>
              
              <div className="space-y-8 text-[12px] lg:text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest leading-[2] text-justify">
                 <p>
                    The journey of GramDairy didn’t start in a boardroom. It started in the dew-covered fields of Greenfields Valley, where a group of passionate dairy artisans realized that the quality of milk in modern cities had drifted too far from its original essence. 
                 </p>
                 <p>
                    We saw how industrialization was sacrificing the well-being of cattle and the inherent nutritional value of dairy for the sake of mass production. GramDairy was founded as a push-back against this trend—a return to traditional, organic farming ethics backed by 21st-century technological precision.
                 </p>
                 <p>
                    By establishing a direct "Farm-to-Door" protocol, we eliminated the complex web of middlemen and cooling-transfers that often degrade milk quality. Today, we stand as a beacon of institutional-grade purity, serving thousands of families who refuse to settle for anything less than perfection.
                 </p>
              </div>

              <div className="pt-8">
                <blockquote className="border-l-4 border-primary-600 pl-10 py-4 italic">
                   <p className="text-lg lg:text-2xl font-bold text-gray-900 dark:text-white tracking-tight leading-relaxed">
                     "We believe that the shortest distance between a healthy cow and a happy family creates the highest standard of health."
                   </p>
                   <footer className="mt-4 text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">— The Founding Collective</footer>
                </blockquote>
              </div>
           </div>

           <div className="grid grid-cols-2 gap-8 relative">
              <div className="absolute inset-0 bg-primary-600/5 blur-[80px] -z-10" />
              <CoreValueFeature 
                index={1} 
                icon={Trees} 
                title="Ethical Origin" 
                description="Our farms are managed with zero reliance on industrial chemicals or synthetic hormones." 
              />
              <CoreValueFeature 
                index={2} 
                icon={Heart} 
                title="Animal Kinship" 
                description="We prioritize the psychological and physical comfort of our cattle as our primary KPI." 
              />
              <CoreValueFeature 
                index={3} 
                icon={ShieldCheck} 
                title="Gold Standards" 
                description="Every batch undergoes 72 rigorous testing parameters before leaving the facility." 
              />
              <CoreValueFeature 
                index={4} 
                icon={Target} 
                title="Direct Supply" 
                description="Total elimination of distribution nodes to ensure same-morning delivery metrics." 
              />
           </div>
        </div>
      </section>

      {/* 4. TECHNICAL LIFECYCLE: FARM TO DOOR */}
      <section className="py-24 lg:py-48 border-y border-gray-100 dark:border-gray-800">
         <div className="max-w-7xl mx-auto px-6 lg:px-10">
            <div className="flex flex-col lg:flex-row gap-16 lg:items-end justify-between mb-32">
               <div className="max-w-2xl space-y-6">
                  <h3 className="text-4xl lg:text-7xl font-bold text-gray-900 dark:text-white tracking-tighter italic uppercase italic leading-tight">The Cold-Chain <br/> Philosophy.</h3>
                  <p className="text-[11px] font-bold text-gray-500 uppercase tracking-[0.2em] leading-loose">
                    Understanding the logistical rigor required to maintain farm-fresh integrity through a high-velocity urban delivery network.
                  </p>
               </div>
               
               <div className="flex gap-4">
                  <div className="px-8 py-5 border border-gray-100 dark:border-gray-800 flex items-center gap-4 bg-gray-50/50 dark:bg-[#111111]">
                     <Zap className="w-5 h-5 text-primary-600" />
                     <span className="text-[10px] font-black text-gray-900 dark:text-white uppercase tracking-widest leading-none mt-1">4.5ms Latency</span>
                  </div>
                  <div className="px-8 py-5 border border-gray-100 dark:border-gray-800 flex items-center gap-4 bg-gray-50/50 dark:bg-[#111111]">
                     <Globe2 className="w-5 h-5 text-emerald-500" />
                     <span className="text-[10px] font-black text-gray-900 dark:text-white uppercase tracking-widest leading-none mt-1">Global Standard</span>
                  </div>
               </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-0 border-collapse">
               {[
                 { label: 'Phase 01', t: 'Hygienic Milking', d: 'Automated, touch-free milking at dawn within pristine parlor environments.', icon: FlaskConical },
                 { label: 'Phase 02', t: 'Instant Chilling', d: 'Milk temperature is crashed to 4°C within minutes to preserve nutrients.', icon: Zap },
                 { label: 'Phase 03', t: 'Laboratory Check', d: 'Adulteration checks using digital sensors for fat, SNF, and contaminants.', icon: ShieldCheck },
                 { label: 'Phase 04', t: 'Vacuum Sealing', d: 'Secure, zero-leak packaging conducted under pharmaceutical-grade air filtration.', icon: Gem },
                 { label: 'Phase 05', t: 'Smart Routing', d: 'Algorithms dispatch delivery partners for the fastest neighborhood nodes.', icon: Truck },
                 { label: 'Phase 06', t: 'Doorstep Delivery', d: 'Final placement before 7:00 AM, ensuring a direct start to your day.', icon: Home }
               ].map((phase, idx) => (
                 <div key={idx} className="p-12 lg:p-16 border border-gray-100 dark:border-gray-800 group hover:bg-gray-900 dark:hover:bg-white transition-all cursor-default relative">
                    <div className="absolute top-0 right-0 w-16 h-16 opacity-[0.05] group-hover:opacity-[0.1] transition-opacity">
                       <phase.icon className="w-16 h-16 text-gray-500" />
                    </div>
                    <span className="block text-[10px] font-black text-primary-600 uppercase tracking-[0.4em] mb-8">{phase.label}</span>
                    <h4 className="text-2xl font-bold text-gray-900 dark:text-white group-hover:text-white dark:group-hover:text-gray-900 tracking-tighter italic mb-6">{phase.t}</h4>
                    <p className="text-[11px] font-bold text-gray-500 group-hover:text-gray-400 dark:group-hover:text-gray-600 uppercase tracking-widest leading-loose">
                       {phase.d}
                    </p>
                 </div>
               ))}
            </div>
         </div>
      </section>

      {/* 5. MEET THE CATTLE: ANIMAL WELFARE FOCUS */}
      <section className="py-24 lg:py-48 bg-gray-900 text-white relative overflow-hidden">
         <div className="absolute top-0 right-0 w-1/2 h-full bg-primary-600/10 slant-x-12 pointer-events-none" />
         
         <div className="max-w-7xl mx-auto px-6 lg:px-10 relative z-10">
            <div className="flex flex-col lg:flex-row gap-24 items-center">
               <div className="lg:w-1/2 space-y-12">
                  <div className="space-y-4">
                     <span className="text-[10px] font-black text-primary-500 uppercase tracking-[0.6em]">Biosphere Integrity</span>
                     <h3 className="text-4xl lg:text-7xl font-bold italic tracking-tighter leading-tight uppercase underline decoration-primary-600 decoration-8">Royal Care.</h3>
                  </div>
                  
                  <p className="text-sm lg:text-lg font-medium text-gray-400 uppercase tracking-widest leading-loose">
                     We believe that stress-free cows produce life-giving milk. Our cows live in open-air shelters, consume premium-grade fodder, and enjoy regular veterinary wellness audits. We avoid industrial crowding, ensuring each cow has a name and a respectful environment.
                  </p>

                  <div className="grid grid-cols-2 gap-10">
                     <div className="space-y-4">
                        <Star className="w-5 h-5 text-primary-500" />
                        <h5 className="text-[11px] font-black uppercase tracking-widest">Happy Pastures</h5>
                        <p className="text-[10px] font-bold text-gray-500 uppercase leading-relaxed tracking-tight">Free-roaming access to green fields and specialized massage zones.</p>
                     </div>
                     <div className="space-y-4">
                        <Leaf className="w-5 h-5 text-primary-500" />
                        <h5 className="text-[11px] font-black uppercase tracking-widest">Organic Diet</h5>
                        <p className="text-[10px] font-bold text-gray-500 uppercase leading-relaxed tracking-tight">Scientifically balanced, chemical-free nutrition including mineral-rich supplements.</p>
                     </div>
                  </div>
               </div>

               <div className="lg:w-1/2 w-full grid grid-cols-1 gap-8">
                  <div className="p-12 border border-white/10 bg-white/5 backdrop-blur-xl relative group">
                     <div className="absolute top-6 right-6">
                        <Award className="w-12 h-12 text-white/10 group-hover:text-primary-600 transition-colors" />
                     </div>
                     <h4 className="text-2xl font-bold italic mb-6">Ethical Mandate</h4>
                     <p className="text-[11px] font-bold text-gray-400 uppercase tracking-[0.2em] leading-loose">
                        We maintain 100% transparency in our cattle management. Every milk drop comes from animals that are loved, not just harvested. No hormones, no antibiotics, no shortcuts.
                     </p>
                  </div>
                  
                  <div className="flex gap-8">
                     <ProtocolBadge label="CERTIFIED" text="100% Antibiotic Free Protocols" />
                     <ProtocolBadge label="AUDITED" text="Monthly Veterinary Bio-Scans" />
                  </div>
               </div>
            </div>
         </div>
      </section>

      {/* 6. LEGACY MILESTONES: THE TIMELINE */}
      <section className="py-24 lg:py-48 bg-white dark:bg-[#0a0a0a]">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="text-center mb-32 space-y-6">
             <h2 className="text-[11px] font-black text-primary-600 uppercase tracking-[0.4em]">Historical Trajectory</h2>
             <h3 className="text-4xl lg:text-7xl font-bold text-gray-900 dark:text-white tracking-tighter italic uppercase italic leading-tight underline decoration-gray-100 dark:decoration-gray-800 decoration-8 underline-offset-[20px]">GramDairy Archive.</h3>
          </div>

          <div className="relative">
             {/* Timeline Center Line */}
             <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-px bg-gray-100 dark:bg-gray-800 hidden lg:block" />
             
             <LegacyMilestone 
               year="2024" 
               title="Genesis Phase" 
               event="The Founding of GramDairy in Heritage Valley with a focus on fresh milk purity."
               icon={Flag}
               align="left"
             />
             <LegacyMilestone 
               year="2025" 
               title="Smart Delivery Hub" 
               event="Inaugurated our first AI-optimized cold chain distribution center in the capital."
               icon={Truck}
               align="right"
             />
             <LegacyMilestone 
               year="2025" 
               title="Logistical Expansion" 
               event="Expanded to 12 verified farms and introduced glass-bottling for zero-toxicity packaging."
               icon={Globe2}
               align="left"
             />
             <LegacyMilestone 
               year="2026" 
               title="The Digital Frontier" 
               event="Launched the GramDairy Advanced Mobile Interface, connecting 50K+ families to fresh dairy."
               icon={Zap}
               align="right"
             />
          </div>
        </div>
      </section>

      {/* 7. MISSION MANIFESTO FINAL BLOCK */}
      <section className="py-24 lg:py-48 relative overflow-hidden border-t border-gray-100 dark:border-gray-800">
         <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-gray-200 dark:via-gray-800 to-transparent" />
         
         <div className="max-w-5xl mx-auto px-6 lg:px-10 text-center">
            <div className="space-y-12">
               <div className="flex items-center justify-center gap-4">
                  <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                  <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                  <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                  <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                  <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
               </div>
               
               <h3 className="text-4xl lg:text-7xl font-bold text-gray-900 dark:text-white tracking-tighter italic uppercase italic leading-tight">Your Trust is Our <br/> Greatest Legacy.</h3>
               
               <p className="text-sm lg:text-base font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest leading-loose max-w-2xl mx-auto">
                 We invite you to join our network of conscious consumers who value health over convenience and quality over mass production. Experience the GramDairy difference today.
               </p>

               <div className="pt-16 flex flex-col sm:flex-row items-center justify-center gap-8">
                  <Link 
                    to="/products"
                    className="group w-full sm:w-auto px-16 py-7 bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-[11px] font-black uppercase tracking-[0.4em] hover:bg-primary-600 dark:hover:bg-primary-500 dark:hover:text-white transition-all flex items-center justify-center gap-4 shadow-2xl"
                  >
                    View Our Collection <ArrowRight className="w-4 h-4 group-hover:translate-x-3 transition-transform" />
                  </Link>
                  <Link 
                    to="/support"
                    className="w-full sm:w-auto px-16 py-7 border border-gray-200 dark:border-gray-800 text-[11px] font-black uppercase tracking-[0.4em] text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-[#111111] transition-all flex items-center justify-center gap-4"
                  >
                    Visit Our Farms
                  </Link>
               </div>
            </div>
         </div>
         
         {/* Footer Aesthetic Nodes */}
         <div className="mt-48 max-w-7xl mx-auto px-6 lg:px-10 flex flex-wrap gap-12 justify-center opacity-30 grayscale hover:grayscale-0 transition-all">
            {[Flag, ShieldCheck, Heart, Leaf, Zap, Trees].map((Icon, idx) => (
              <Icon key={idx} className="w-12 h-12 text-gray-400" />
            ))}
         </div>
      </section>
      
    </div>
  );
};

// Placeholder for missing Lucide icons used in the phase list
const Home = ({ className }) => <Users className={className} />;

export default OurStory;
