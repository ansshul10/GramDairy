import React from 'react'
import { Link } from 'react-router-dom'
import { Truck, Home, UserCheck, TrendingUp, Clock, ShieldCheck, MapPin, Zap, ArrowRight, Activity, CheckCircle2, Users } from 'lucide-react'

/* ─────────────────────────────────────────────────────────────────────────────
 * WORK WITH US PAGE
 * A vibrant, recruitment-focused page for potential delivery partners and farms.
 * ───────────────────────────────────────────────────────────────────────────── */

const BenefitCard = ({ icon: Icon, title, desc }) => (
   <div className="bg-white dark:bg-[#0a0a0a] border border-gray-100 dark:border-gray-800 p-10 hover:border-primary-600 transition-all group">
      <div className="w-14 h-14 bg-gray-50 dark:bg-[#111111] border border-gray-100 dark:border-gray-800 flex items-center justify-center text-gray-400 group-hover:text-primary-600 transition-colors mb-8">
         <Icon className="w-6 h-6" />
      </div>
      <h4 className="text-xl font-bold text-gray-900 dark:text-white uppercase tracking-tight italic mb-4">{title}</h4>
      <p className="text-[11px] text-gray-500 font-bold uppercase tracking-widest leading-loose">{desc}</p>
   </div>
);

const StepCard = ({ number, title, desc }) => (
   <div className="relative p-10 bg-gray-50/50 dark:bg-[#0c0c0c] border border-gray-100 dark:border-gray-800 space-y-6">
      <div className="absolute -top-4 -left-4 w-12 h-12 bg-gray-900 dark:bg-white text-white dark:text-gray-900 flex items-center justify-center font-black text-xl italic shadow-xl">
         {number}
      </div>
      <h4 className="text-lg font-bold text-gray-900 dark:text-white uppercase tracking-tight italic">{title}</h4>
      <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest leading-relaxed">{desc}</p>
   </div>
);

const WorkWithUs = () => {
   return (
      <div className="bg-white dark:bg-[#0a0a0a] min-h-screen">
         {/* 1. HERO SECTION */}
         <section className="pt-32 pb-24 border-b border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-[#0c0c0c] relative overflow-hidden">
            <div className="max-w-[1400px] mx-auto px-10 relative z-10">
               <div className="flex flex-col lg:flex-row gap-20 items-center">
                  <div className="lg:w-1/2 space-y-12">
                     <div className="inline-flex items-center gap-3 px-6 py-2 bg-primary-600/5 border border-primary-600/10">
                        <Users className="w-4 h-4 text-primary-600" />
                        <span className="text-[10px] font-black text-primary-600 uppercase tracking-[0.4em]">Partner Recruitment Open</span>
                     </div>

                     <h1 className="text-5xl lg:text-7xl font-bold text-gray-900 dark:text-white leading-[1.1] tracking-tighter italic">
                        Grow your <span className="text-gray-400 font-medium">dairy future.</span>
                     </h1>

                     <p className="text-sm font-bold text-gray-500 uppercase tracking-widest leading-loose max-w-xl">
                        Whether you are a local delivery hero or a farm owner with high-quality products, join the GramDairy family and help us deliver health to every home.
                     </p>

                     <div className="flex flex-col sm:flex-row gap-8 pt-4">
                        <Link to="/delivery/apply" className="px-16 py-7 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-black tracking-[0.4em] uppercase text-[10px] shadow-2xl hover:bg-primary-600 hover:text-white transition-all flex items-center justify-center gap-3">
                           Start Earning
                        </Link>
                        <a href="/support" className="px-16 py-7 border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white font-black tracking-[0.4em] uppercase text-[10px] hover:bg-gray-50 transition-all flex items-center justify-center gap-2">
                           Farm Partnership
                        </a>
                     </div>
                  </div>

                  <div className="lg:w-1/2 w-full grid grid-cols-2 gap-10">
                     <div className="p-10 border border-gray-900 dark:border-white bg-[#0a0a0a] text-white space-y-4 shadow-2xl">
                        <Activity className="w-6 h-6 text-emerald-500 animate-pulse" />
                        <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Global Payouts</p>
                        <p className="text-4xl font-bold tracking-tighter italic">₹12.4M+</p>
                        <p className="text-[8px] font-bold text-gray-500 uppercase tracking-widest">Sent to our partners this year</p>
                     </div>
                     <div className="p-10 bg-gray-50/50 dark:bg-[#111111] border border-gray-100 dark:border-gray-800 space-y-4">
                        <MapPin className="w-6 h-6 text-primary-600" />
                        <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Active Hubs</p>
                        <p className="text-4xl font-bold text-gray-900 dark:text-white tracking-tighter italic">45+</p>
                        <p className="text-[8px] font-bold text-gray-500 uppercase tracking-widest">Expanding rapidly every day</p>
                     </div>
                  </div>
               </div>
            </div>
         </section>

         <div className="max-w-7xl mx-auto px-10 py-32 space-y-32">
            {/* 2. BENEFITS GRID */}
            <section className="space-y-16">
               <div className="text-center space-y-4">
                  <h2 className="text-[10px] font-black text-primary-600 uppercase tracking-[0.5em] italic">Why work with us</h2>
                  <h3 className="text-3xl font-bold text-gray-900 dark:text-white italic tracking-tighter uppercase">Support. Earnings. Growth.</h3>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-gray-200 dark:bg-gray-800 border border-gray-200 dark:border-gray-800 shadow-2xl">
                  <BenefitCard icon={TrendingUp} title="Excellent Earnings" desc="Receive competitive payouts for every delivery. We value your hard work and reward performance with bonuses." />
                  <BenefitCard icon={Clock} title="Flexible Hours" desc="Choose your own working window. Our system allows you to manage your time effectively while maintaining your personal life." />
                  <BenefitCard icon={Zap} title="Instant Payouts" desc="No waiting for weeks. Our automated billing system ensures you receive your earnings directly to your bank account." />
                  <BenefitCard icon={ShieldCheck} title="Complete Safety" desc="Every delivery partner is insured. We provide safety gear and training to ensure you are safe on the road." />
                  <BenefitCard icon={Home} title="Local Focus" desc="Work within your own neighborhood. Deliver to local homes and become a hero in your own community." />
                  <BenefitCard icon={UserCheck} title="Full Training" desc="New to dairy delivery? We provide a complete step-by-step guide and training to help you succeed from day one." />
               </div>
            </section>

            {/* 3. PARTNERSHIP PATHWAYS */}
            <section className="bg-gray-900 p-16 lg:p-24 relative overflow-hidden">
               <div className="absolute top-0 right-0 w-2/3 h-full bg-primary-600/5 blur-[120px] pointer-events-none" />
               <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
                  <div className="space-y-10">
                     <h2 className="text-4xl font-bold text-white tracking-tighter italic leading-none">
                        Are you a <span className="text-primary-500 underline decoration-2 underline-offset-8">local farm owner?</span>
                     </h2>
                     <p className="text-sm font-bold text-gray-400 uppercase tracking-widest leading-loose">
                        We are always looking for reliable farms that prioritize animal health and product purity. If you have fresh raw milk or organic dairy, we want to deliver it to our customers.
                     </p>
                     <div className="pt-4">
                        <Link to="/vendor/apply" className="px-16 py-6 bg-white text-black text-[10px] font-black uppercase tracking-[0.4em] hover:bg-primary-600 hover:text-white transition-all shadow-2xl inline-block text-center">
                           Apply as a Vendor
                        </Link>
                     </div>
                  </div>

                  <div className="bg-white/5 border border-white/10 p-12 space-y-8">
                     <div className="flex items-center gap-4">
                        <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                        <span className="text-xs font-bold text-white uppercase tracking-widest">Quality Compliance Required</span>
                     </div>
                     <h4 className="text-xl font-bold text-white uppercase tracking-tight italic">Farmer Partnership Package</h4>
                     <ul className="space-y-6">
                        <li className="flex items-start gap-4">
                           <ArrowRight className="w-3.5 h-3.5 mt-1 text-gray-500" />
                           <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Access to our massive 50k+ customer base.</span>
                        </li>
                        <li className="flex items-start gap-4">
                           <ArrowRight className="w-3.5 h-3.5 mt-1 text-gray-500" />
                           <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Guaranteed logistics - we handle all deliveries.</span>
                        </li>
                        <li className="flex items-start gap-4">
                           <ArrowRight className="w-3.5 h-3.5 mt-1 text-gray-500" />
                           <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Fair pricing and long-term supply contracts.</span>
                        </li>
                     </ul>
                  </div>
               </div>
            </section>

            {/* 4. APPLICATION STEPS */}
            <section className="space-y-16">
               <div className="text-center space-y-4">
                  <h2 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.5em] italic">Simple Process</h2>
                  <h3 className="text-3xl font-bold text-gray-900 dark:text-white italic tracking-tighter uppercase">How to Get Started</h3>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
                  <StepCard
                     number="01"
                     title="Application"
                     desc="Fill out the digital application form with your basic details and valid ID proof."
                  />
                  <StepCard
                     number="02"
                     title="Verification"
                     desc="Our team checks your details and verifies your background within 48 hours."
                  />
                  <StepCard
                     number="03"
                     title="Quick Training"
                     desc="Complete a short online orientation about our delivery safety and quality standards."
                  />
                  <StepCard
                     number="04"
                     title="Go Live"
                     desc="Download the partner app, choose your area, and start delivering fresh products."
                  />
               </div>
            </section>
         </div>

         {/* 5. CTA BLOCK */}
         <section className="py-32 px-10 text-center relative overflow-hidden flex flex-col items-center">
            <div className="absolute inset-0 bg-gray-50 dark:bg-[#0c0c0c] -z-10" />
            <div className="max-w-3xl space-y-10">
               <h3 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white tracking-tighter italic">
                  Ready to earn with <span className="text-primary-600">GramDairy?</span>
               </h3>
               <p className="text-sm font-bold text-gray-500 uppercase tracking-widest leading-loose">
                  Join the fastest growing dairy logistics network and start building your reliable income stream today.
               </p>
               <div className="pt-8">
                  <Link to="/delivery/apply" className="px-20 py-8 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-bold uppercase tracking-[0.4em] text-[11px] shadow-[0_35px_60px_-15px_rgba(0,0,0,0.3)] hover:bg-primary-600 hover:text-white transition-all w-full sm:w-auto inline-block">
                     Apply to Join Now
                  </Link>
               </div>
            </div>
         </section>
      </div>
   )
}

export default WorkWithUs
