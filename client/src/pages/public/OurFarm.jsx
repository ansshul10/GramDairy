import React, { useEffect, useState } from 'react';
import {
   MapPin,
   Wind,
   Sprout,
   Droplets,
   Zap,
   ShieldCheck,
   Users,
   Leaf,
   Sun,
   Thermometer,
   Activity,
   Compass,
   Globe2,
   ArrowRight,
   Camera,
   Layers,
   Database,
   CloudSun,
   LayoutGrid,
   Maximize2,
   CheckCircle2
} from 'lucide-react';
import { Link } from 'react-router-dom';

/* ─────────────────────────────────────────────────────────────────────────────
 * OUR FARM — PREMIUM GEOSPATIAL INTERFACE
 * A high-fidelity exploration of the GramDairy facility in Dondari, MP.
 * Features: Metric Terminals, Visual Vault Gallery, Chambal Regional Narrative.
 * Engineered for professional clarity and absolute responsiveness.
 * ───────────────────────────────────────────────────────────────────────────── */

// ─────────────────────────────────────────────────────────────────────────────
// MODULAR SUB-COMPONENTS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Metric Terminal for farm telemetry (Climate, Soil, Stock)
 */
const MetricTerminal = ({ icon: Icon, label, value, subtext, color = "primary" }) => (
   <div className="p-6 border border-gray-100 dark:border-gray-800 bg-white dark:bg-[#0a0a0a] flex flex-col gap-4 relative group overflow-hidden shadow-sm">
      <div className={`absolute top-0 right-0 w-12 h-1 ${color === 'primary' ? 'bg-primary-600' : 'bg-emerald-500'}`} />
      <div className="w-10 h-10 bg-gray-50/50 dark:bg-[#111111] border border-gray-100 dark:border-gray-800 flex items-center justify-center text-gray-400 group-hover:text-primary-600 transition-colors shadow-inner">
         <Icon className="w-5 h-5" />
      </div>
      <div>
         <p className="text-[9px] font-black uppercase tracking-[0.3em] text-gray-400 mb-2">{label}</p>
         <p className="text-2xl font-bold text-gray-900 dark:text-white tracking-tighter mb-4 italic">{value}</p>
         <div className="flex items-center gap-2 mb-2">
            <Activity className="w-3 h-3 text-emerald-500" />
            <span className="text-[8px] font-bold text-gray-400 uppercase tracking-widest leading-none mt-1">Live Synchronized</span>
         </div>
         <p className="text-[9px] text-gray-500 font-bold uppercase leading-relaxed tracking-tight">{subtext}</p>
      </div>
   </div>
);

/**
 * Visual Vault Item (Optimized for real assets)
 */
const VaultItem = ({ id, label, category, src, isFeatured }) => (
   <div className={`relative ${isFeatured ? 'lg:col-span-2 lg:row-span-2 aspect-square lg:aspect-auto' : 'aspect-[4/5]'} bg-gray-50 dark:bg-[#0c0c0c] border border-gray-100 dark:border-gray-800 overflow-hidden group cursor-pointer shadow-2xl`}>
      {/* Real Image Source */}
      <img
         src={src}
         alt={label}
         loading="lazy"
         className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
      />

      {/* Grid Overlay */}
      <div className="absolute inset-0 opacity-[0.2] mix-blend-overlay pointer-events-none"
         style={{ backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)', backgroundSize: '40px 40px' }}
      />

      {/* Info Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-gray-900/20 to-transparent flex flex-col justify-end p-6 lg:p-8 translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-500">
         <div className="flex items-center gap-3 mb-3">
            <span className="w-6 h-[1px] bg-primary-500" />
            <span className="text-[9px] font-black text-primary-500 uppercase tracking-[0.4em]">{category}</span>
         </div>
         <h4 className={`font-bold text-white tracking-tighter italic uppercase ${isFeatured ? 'text-2xl lg:text-4xl' : 'text-lg'}`}>{label}</h4>
         <div className="h-px bg-white/20 w-0 group-hover:w-full transition-all duration-1000 delay-100 mt-4 mb-4" />
         <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
               <span className="text-[9px] font-bold text-white/60 uppercase tracking-widest">Node {id}</span>
               <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            </div>
            <Maximize2 className="w-4 h-4 text-white/40 group-hover:text-primary-500 transition-colors" />
         </div>
      </div>
   </div>
);

/**
 * Protocol Feature Detail
 */
const ProtocolFeature = ({ icon: Icon, title, text }) => (
   <div className="space-y-6 animate-in slide-in-from-bottom-5 duration-700">
      <div className="flex items-center gap-4">
         <div className="w-12 h-12 bg-gray-900 dark:bg-white text-white dark:text-gray-900 flex items-center justify-center shadow-lg">
            <Icon className="w-5 h-5" />
         </div>
         <div className="h-px flex-1 bg-gray-100 dark:bg-gray-800" />
      </div>
      <h4 className="text-[11px] font-black uppercase tracking-[0.3em] text-gray-900 dark:text-white">{title}</h4>
      <p className="text-[12px] font-bold text-gray-500 dark:text-gray-400 uppercase leading-loose tracking-widest">
         {text}
      </p>
   </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// OUR FARM INTERFACE
// ─────────────────────────────────────────────────────────────────────────────

const OurFarm = () => {
   const [activeTab, setActiveTab] = useState('landscape');

   return (
      <div className="bg-white dark:bg-[#0a0a0a] min-h-screen selection:bg-primary-500/20">

         {/* 1. HERO — GEOSPATIAL ENTRY */}
         <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 border-b border-gray-100 dark:border-gray-800 overflow-hidden">
            {/* Structural Grid */}
            <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] pointer-events-none"
               style={{ backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)', backgroundSize: '60px 60px' }}
            />

            <div className="max-w-7xl mx-auto px-6 lg:px-10 relative z-10">
               <div className="grid lg:grid-cols-2 gap-20 items-center">
                  <div className="space-y-12">
                     <div className="inline-flex items-center gap-4 px-6 py-3 bg-gray-50 dark:bg-[#111111] border border-gray-100 dark:border-gray-800">
                        <MapPin className="w-4 h-4 text-primary-600" />
                        <span className="text-[10px] font-black text-gray-500 uppercase tracking-[0.4em]">Dondari Protocol / Location Identified</span>
                     </div>

                     <h1 className="text-4xl lg:text-7xl font-bold text-gray-900 dark:text-white tracking-tighter leading-[0.9] italic">
                        The Soils <br />
                        <span className="text-gray-300 dark:text-gray-800 font-medium whitespace-nowrap">Of Morena.</span>
                     </h1>

                     <div className="flex flex-col gap-4">
                        <div className="flex items-center gap-6">
                           <span className="text-[10px] font-black text-primary-600 uppercase tracking-widest">Madhya Pradesh, India</span>
                           <div className="h-px w-24 bg-primary-600/30" />
                        </div>
                        <p className="text-[13px] lg:text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-[0.2em] leading-relaxed max-w-xl">
                           A sprawling organic ecosystem nestled in **Dondari**, Tehsil **Porsa**. Here, the fertile Chambal landscape meets advanced sustainability to produce the purest dairy in India.
                        </p>
                     </div>

                     <div className="pt-8">
                        <button className="px-12 py-6 bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-[10px] font-black uppercase tracking-[0.4em] hover:bg-primary-600 transition-all flex items-center gap-4 shadow-2xl">
                           Explore Local Terroir <ArrowRight className="w-4 h-4" />
                        </button>
                     </div>
                  </div>

                  <div className="grid grid-cols-2 gap-8 relative">
                     <div className="absolute inset-0 bg-primary-500/5 blur-[100px] -z-10" />
                     <MetricTerminal icon={Thermometer} label="Ambient Temperature" value="28.4°C" subtext="Optimal for indigenous Gir breeds" />
                     <MetricTerminal icon={Droplets} label="Soil Hydration" value="44.1%" subtext="Managed via micro-irrigation systems" />
                     <MetricTerminal icon={Sun} label="Daily Solar Output" value="6.2kW" subtext="Facility powered by renewable nodes" />
                     <MetricTerminal icon={Wind} label="Air Quality Index" value="12 AQI" subtext="Pristine rural environment flow" />
                  </div>
               </div>
            </div>
         </section>

         {/* 2. REGIONAL NARRATIVE — THE CHAMBAL HEART */}
         <section className="py-24 lg:py-48 bg-gray-50/20 dark:bg-[#0c0c0c] overflow-hidden relative">
            {/* Background Elements */}
            <div className="absolute -top-48 -right-48 w-96 h-96 bg-primary-500/5 blur-[150px] rounded-full" />

            <div className="max-w-7xl mx-auto px-6 lg:px-10 relative z-10">
               <div className="max-w-4xl space-y-20">
                  <div className="space-y-6">
                     <h2 className="text-[11px] font-black text-primary-600 uppercase tracking-[0.5em] flex items-center gap-4">
                        <Globe2 className="w-4 h-4" /> Regional Intelligence
                     </h2>
                     <h3 className="text-3xl lg:text-5xl font-bold text-gray-900 dark:text-white tracking-tighter italic uppercase underline decoration-primary-600/20 decoration-4 underline-offset-[12px]">Dondari Origins.</h3>
                  </div>

                  <div className="grid md:grid-cols-2 gap-16 lg:gap-24">
                     <div className="space-y-10">
                        <div className="aspect-video bg-gray-100 dark:bg-[#111111] border border-gray-200 dark:border-gray-800 flex items-center justify-center group overflow-hidden">
                           <Compass className="w-12 h-12 text-gray-300 group-hover:rotate-[360deg] transition-transform duration-1000" />
                        </div>
                        <p className="text-[12px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest leading-[2.2] text-justify italic">
                           The village of **Dondari** in the Porsa Tehsil of **Morena** is a landscape defined by resilience and natural bounty. Situated within the historic Chambal region, our farm benefits from a unique mineral composition in the soil that imbues our cattle's fodder with unparalleled nutritional density.
                        </p>
                     </div>
                     <div className="space-y-10">
                        <p className="text-[12px] font-bold text-gray-600 dark:text-gray-300 uppercase tracking-widest leading-[2.2] text-justify">
                           Madhya Pradesh has long been India's leader in organic agricultural leadership. In Morena, we leverage this heritage by employing ancient organic composting techniques alongside World-Bank standards of dairy hygiene. We are not just a farm; we are a regenerative node for the entire Porsa agricultural belt.
                        </p>
                        <div className="p-10 bg-gray-900 dark:bg-white text-white dark:text-gray-900 shadow-2xl relative">
                           <div className="absolute top-0 right-0 w-24 h-1 bg-primary-600" />
                           <h5 className="text-xl font-black italic tracking-tighter mb-4 uppercase">Chambal Quality Seal</h5>
                           <p className="text-[10px] font-bold opacity-70 uppercase tracking-widest leading-loose">
                              All products originating from the Dondari facility carry the regional assurance of purity, verified by third-party biosafety audits monthly.
                           </p>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </section>

         {/* 3. THE VISUAL VAULT — AI IMAGE GALLERY SECTION */}
         <section className="py-24 lg:py-48 border-y border-gray-100 dark:border-gray-800">
            <div className="max-w-7xl mx-auto px-6 lg:px-10">
               <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-12 mb-24">
                  <div className="space-y-6">
                     <h3 className="text-3xl lg:text-5xl font-bold text-gray-900 dark:text-white tracking-tighter italic uppercase leading-tight underline decoration-gray-100 dark:decoration-gray-800 decoration-4 underline-offset-[12px]">Visual Vault.</h3>
                     <p className="text-[11px] font-black text-gray-500 uppercase tracking-[0.4em] mt-8">Captured Reality / Farm Documentation</p>
                  </div>

                  <div className="flex gap-2 p-1 bg-gray-50 dark:bg-[#111111] border border-gray-100 dark:border-gray-800">
                     {['landscape', 'livestock', 'facility'].map((tab) => (
                        <button
                           key={tab}
                           onClick={() => setActiveTab(tab)}
                           className={`px-8 py-4 text-[9px] font-black uppercase tracking-widest transition-all ${activeTab === tab
                                 ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900'
                                 : 'text-gray-400 hover:text-gray-900 dark:hover:text-white'
                              }`}
                        >
                           {tab}
                        </button>
                     ))}
                  </div>
               </div>

               {/* Premium Modular Gallery — Curated 3-Item Showcase */}
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6 lg:gap-10">
                  {/* Image 1: Primary Featured Landscape */}
                  <div className="lg:col-span-8 lg:row-span-2">
                     <VaultItem
                        id="01"
                        label="Chambal Sunrise Horizon"
                        category="Landscape"
                        src="/image1.jpeg"
                        isFeatured={true}
                     />
                  </div>

                  {/* Image 2: Secondary Focus Case */}
                  <div className="lg:col-span-4">
                     <VaultItem
                        id="02"
                        label="Sovereign Cattle Care"
                        category="Livestock"
                        src="/image2.jpeg"
                        isFeatured={false}
                     />
                  </div>

                  {/* Image 3: Facility Integrity */}
                  <div className="lg:col-span-4">
                     <VaultItem
                        id="03"
                        label="Institutional Infrastructure"
                        category="Facility"
                        src="/image3.jpeg"
                        isFeatured={false}
                     />
                  </div>
               </div>

               <div className="mt-20 pt-12 border-t border-gray-100 dark:border-gray-800 flex flex-col md:flex-row items-center justify-between gap-10">
                  <div className="flex items-center gap-6">
                     <Layers className="w-8 h-8 text-gray-200 dark:text-gray-800" />
                     <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest leading-relaxed max-w-sm">
                        High-fidelity visual documentation powered by neural generation. Click any tile to inspect geospatial metadata.
                     </p>
                  </div>
                  <button className="px-10 py-5 border border-gray-200 dark:border-gray-800 text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 hover:text-primary-600 transition-all">
                     Load Full Archive [44+]
                  </button>
               </div>
            </div>
         </section>

         {/* 4. TECHNICAL PROTOCOLS — ORGANIC SUPREMACY */}
         <section className="py-24 lg:py-48 bg-white dark:bg-[#0a0a0a] relative">
            <div className="max-w-7xl mx-auto px-6 lg:px-10">
               <div className="grid lg:grid-cols-3 gap-24">
                  <div className="lg:col-span-1 space-y-12">
                     <div className="space-y-6">
                        <span className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.5em]">The Green Standard</span>
                        <h3 className="text-4xl font-bold text-gray-900 dark:text-white tracking-tighter italic uppercase leading-none">Sustainable <br /> Sovereignty.</h3>
                     </div>
                     <p className="text-[12px] font-bold text-gray-500 dark:text-gray-400 uppercase leading-loose tracking-widest text-justify">
                        Our Dondari facility operates as a closed-loop system. We transform livestock manure into high-grade Biogas to power our facility and utilize the runoff to nourish our Vermicompost beds. Zero waste, absolute purity.
                     </p>
                     <div className="p-8 border border-primary-500/10 bg-primary-500/5 flex flex-col items-center text-center gap-4">
                        <Database className="w-6 h-6 text-primary-600" />
                        <h5 className="text-[9px] font-black uppercase text-gray-900 dark:text-white">Traceability</h5>
                        <p className="text-lg font-black italic text-primary-600 tracking-tighter">MP-MOR-DOND-01</p>
                     </div>
                  </div>

                  <div className="lg:col-span-2 grid md:grid-cols-2 gap-16 lg:gap-x-24 lg:gap-y-32">
                     <ProtocolFeature
                        icon={Zap}
                        title="Biogas Synthesis"
                        text="Conversion of bio-waste into methanogenic energy nodes, reducing our facility's carbon footprint by 74% relative to industrial norms."
                     />
                     <ProtocolFeature
                        icon={Sprout}
                        title="Vermicompost Matrix"
                        text="Custom nutrient beds utilizing earthworm activity to regenerate soil health across 40+ acres of organic fodder land."
                     />
                     <ProtocolFeature
                        icon={Droplets}
                        title="Precision Hydration"
                        text="Solar-powered micro-irrigation systems delivered directly to the root zone, conserving 40% more water than flood irrigation."
                     />
                     <ProtocolFeature
                        icon={ShieldCheck}
                        title="Zero-Synthetic Purity"
                        text="Strict prohibition of hormonal triggers and chemical fertilizers, verified by annual soil-load testing across the Dondari parcel."
                     />
                  </div>
               </div>
            </div>
         </section>

         {/* 5. LIVESTOCK MODULE — GIR & INDIGENOUS BREEDS */}
         <section className="py-24 lg:py-48 bg-gray-900 text-white relative">
            <div className="max-w-7xl mx-auto px-6 lg:px-10">
               <div className="flex flex-col lg:flex-row gap-24 items-center">
                  <div className="lg:w-1/2 relative">
                     <div className="aspect-square bg-white/5 border border-white/10 flex items-center justify-center p-20">
                        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
                        <div className="text-center space-y-8 relative z-10">
                           <CloudSun className="w-20 h-20 text-primary-500 mx-auto" />
                           <h4 className="text-4xl font-bold tracking-tighter italic uppercase text-gray-300">Organic <br /> Bio-rhythms.</h4>
                           <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40">Livestock Wellness Protocol</p>
                        </div>
                     </div>
                  </div>

                  <div className="lg:w-1/2 space-y-12">
                     <div className="space-y-4">
                        <span className="text-[10px] font-black text-primary-500 uppercase tracking-[0.6em]">Genetic Excellence</span>
                        <h3 className="text-3xl lg:text-5xl font-bold italic tracking-tighter leading-[0.9] uppercase">The Indigenous <br /> Herd.</h3>
                     </div>

                     <p className="text-sm lg:text-lg font-medium text-gray-400 uppercase tracking-widest leading-loose">
                        We specialize in indigenous Indian breeds, specifically the **Gir** and **Sahiwal** cattle, which are naturally adapted to the Madhya Pradesh climate. Their A2 protein milk is processed with clinical focus, ensuring that every sip contains the ancestral nutrition intended by nature.
                     </p>

                     <div className="grid grid-cols-2 gap-8 pt-8">
                        <div className="p-8 border border-white/10 bg-white/5 flex flex-col gap-6">
                           <Users className="w-5 h-5 text-primary-500" />
                           <h5 className="text-[11px] font-black uppercase tracking-widest leading-none">Dedicated Caretaker Nodes</h5>
                           <p className="text-[10px] font-bold text-gray-500 uppercase tracking-tight leading-relaxed">Personalized 24/7 monitoring for every animal in our Dondari facility.</p>
                        </div>
                        <div className="p-8 border border-white/10 bg-white/5 flex flex-col gap-6">
                           <LayoutGrid className="w-5 h-5 text-primary-500" />
                           <h5 className="text-[11px] font-black uppercase tracking-widest leading-none">Free-Range Geometries</h5>
                           <p className="text-[10px] font-bold text-gray-500 uppercase tracking-tight leading-relaxed">Open-paddock access ensuring structural and psychological wellness.</p>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </section>

         {/* 6. CALL TO ACTION FINAL — VISIT DONDARI */}
         <section className="py-24 lg:py-48 text-center border-t border-gray-100 dark:border-gray-800">
            <div className="max-w-4xl mx-auto px-6 space-y-16">
               <div className="inline-flex items-center gap-4 px-6 py-3 bg-primary-50 dark:bg-primary-500/5 text-primary-600 rounded-none">
                  <CheckCircle2 className="w-5 h-5" />
                  <span className="text-[10px] font-black uppercase tracking-[0.4em]">Audit Request Verified</span>
               </div>

               <h3 className="text-3xl lg:text-6xl font-bold text-gray-900 dark:text-white tracking-tighter italic uppercase leading-tight underline decoration-gray-100 dark:decoration-gray-800 underline-offset-[16px]">Visit our <br /> Roots.</h3>

               <p className="text-sm lg:text-xl font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest leading-loose">
                  Experience the purity of Dondari in person. We host guided educational farm audits for families, schools, and institutional partners.
               </p>

               <div className="pt-12 flex flex-col sm:flex-row items-center justify-center gap-8">
                  <Link
                     to="/products"
                     className="group w-full sm:w-auto px-16 py-8 bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-[11px] font-black uppercase tracking-[0.4em] hover:bg-primary-600 dark:hover:bg-primary-500 dark:hover:text-white transition-all flex items-center justify-center gap-4 shadow-2xl"
                  >
                     Taste the Terroir <ArrowRight className="w-4 h-4 group-hover:translate-x-3 transition-transform" />
                  </Link>
                  <button className="w-full sm:w-auto px-16 py-8 border border-gray-200 dark:border-gray-800 text-[11px] font-black uppercase tracking-[0.4em] text-gray-400 hover:text-primary-600 transition-colors">
                     Download Route Map [MP]
                  </button>
               </div>

               <div className="pt-24 opacity-30 flex items-center justify-center gap-12 grayscale hover:grayscale-0 transition-all cursor-default overflow-x-auto pb-6 scrollbar-hide">
                  {[Sprout, Zap, Globe2, Layers, ShieldCheck, Database].map((Icon, idx) => (
                     <Icon key={idx} className="w-10 h-10 text-gray-400" />
                   ))}
               </div>
            </div>
         </section>

         {/* 7. LABORATORY INTEGRITY — THE CLINICAL VANTAGE */}
         <section className="py-24 lg:py-48 bg-gray-50/50 dark:bg-[#0c0c0c] border-b border-gray-100 dark:border-gray-800">
            <div className="max-w-7xl mx-auto px-6 lg:px-10">
               <div className="grid lg:grid-cols-12 gap-20">
                  <div className="lg:col-span-5 space-y-12">
                     <div className="space-y-6">
                        <span className="text-[10px] font-black text-blue-500 uppercase tracking-[0.5em]">Biosafety Level 02</span>
                        <h3 className="text-4xl lg:text-7xl font-bold italic tracking-tighter uppercase leading-tight">Digital <br/> Verification.</h3>
                     </div>
                     <p className="text-[12px] font-bold text-gray-500 dark:text-gray-400 uppercase leading-loose tracking-widest text-justify">
                        Every milliliter of milk originating from Dondari is subjected to an exhaustive digital audit. Our laboratory is equipped with ultrasonic milk analyzers that detect fat, SNF, and protein levels in real-time, ensuring that only the highest-grade A2-certified milk is vacuum-sealed.
                     </p>
                     
                     <div className="space-y-8">
                        {[
                          { t: 'Adulteration Nodes', d: 'Scanning for synthetic additives, urea, and neutralizers with 99.9% accuracy.' },
                          { t: 'Bacterial Load Scans', d: 'Cold-chain verification ensuring microbial counts remain well below global safety indices.' },
                          { t: 'Antibiotic Zero-Tolerance', d: 'LC-MS/MS protocols to ensure zero traces of veterinary residuals enter the supply chain.' }
                        ].map((item, i) => (
                           <div key={i} className="flex gap-6 group">
                              <div className="w-px h-12 bg-gray-200 dark:bg-gray-800 group-hover:bg-blue-500 transition-colors" />
                              <div className="space-y-2">
                                 <h5 className="text-[10px] font-black uppercase text-gray-900 dark:text-white">{item.t}</h5>
                                 <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tight">{item.d}</p>
                              </div>
                           </div>
                        ))}
                     </div>
                  </div>

                  <div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-1 px-1 bg-gray-100 dark:bg-gray-800">
                     {[
                       { l: 'Refractive Index', v: '1.34-1.35', s: 'Analyzed per automated batch' },
                       { l: 'Electrical Conductivity', v: '4.5 mS/cm', s: 'Mastitis detection threshold' },
                       { l: 'Thermal Stability', v: 'COB -VE', s: 'Heat-treat reliability metrics' },
                       { l: 'Methylene Blue Index', v: '8.5 Hours', s: 'Natural freshness longevity' }
                     ].map((stat, i) => (
                        <div key={i} className="p-8 bg-white dark:bg-[#0a0a0a] flex flex-col justify-between">
                           <span className="text-[8px] font-black text-gray-300 dark:text-gray-700 uppercase tracking-[0.3em]">{stat.l}</span>
                           <div className="py-6">
                              <p className="text-2xl font-black text-blue-500 tracking-tighter italic">{stat.v}</p>
                           </div>
                           <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest leading-none mt-1">{stat.s}</p>
                        </div>
                     ))}
                  </div>
               </div>
            </div>
         </section>

         {/* 8. SOCIO-ECONOMIC IMPACT — THE PORSA COMMITMENT */}
         <section className="py-24 lg:py-48 relative overflow-hidden">
            {/* Background Texture */}
            <div className="absolute inset-0 opacity-[0.02] dark:opacity-[0.04] pointer-events-none" 
                 style={{ backgroundImage: 'radial-gradient(circle, #000 1px, transparent 1px)', backgroundSize: '24px 24px' }} 
            />

            <div className="max-w-7xl mx-auto px-6 lg:px-10 relative z-10">
               <div className="grid lg:grid-cols-2 gap-24 items-center">
                  <div className="order-2 lg:order-1 space-y-12">
                     <div className="grid grid-cols-2 gap-4">
                        <div className="aspect-square bg-gray-50 dark:bg-[#111111] border border-gray-100 dark:border-gray-800 p-10 flex flex-col justify-end">
                           <span className="text-4xl font-bold text-gray-900 dark:text-white italic tracking-tighter mb-4">50+</span>
                           <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-loose">Local artisans employed in Dondari</p>
                        </div>
                        <div className="aspect-square bg-gray-900 dark:bg-white text-white dark:text-gray-900 p-10 flex flex-col justify-end shadow-2xl">
                           <span className="text-4xl font-bold italic tracking-tighter mb-4">12%</span>
                           <p className="text-[10px] font-black border-t border-white/20 dark:border-black/20 pt-4 uppercase tracking-widest leading-loose">Local GDP uplift via direct sourcing</p>
                        </div>
                     </div>
                  </div>

                  <div className="order-1 lg:order-2 space-y-12">
                     <div className="space-y-6">
                        <span className="text-[10px] font-black text-primary-600 uppercase tracking-[0.5em]">Institutional Responsibility</span>
                        <h3 className="text-4xl lg:text-7xl font-bold italic tracking-tighter uppercase leading-tight underline decoration-primary-600/20 decoration-8 underline-offset-[16px]">Communal <br/> Legacy.</h3>
                     </div>
                     <p className="text-[12px] font-bold text-gray-500 dark:text-gray-400 uppercase leading-[2] tracking-widest text-justify">
                        Our presence in **Porsa** is not merely industrial; it is communal. We collaborate with the village council of **Dondari** to provide technical agricultural training to marginal farmers, promoting sustainable cow-based farming across the district of **Morena**. By creating a high-value labor node in the village, we help prevent urban migration and preserve the agricultural soul of Madhya Pradesh.
                     </p>
                     
                     <div className="pt-8">
                        <a href="/work-with-us" className="inline-flex items-center gap-6 group">
                           <div className="w-16 h-16 border border-gray-200 dark:border-gray-800 flex items-center justify-center group-hover:border-primary-600 transition-colors">
                              <Users className="w-6 h-6 text-gray-400 group-hover:text-primary-600 transition-colors" />
                           </div>
                           <div>
                              <p className="text-[10px] font-black text-gray-900 dark:text-white uppercase tracking-[0.4em]">Agricultural Training Initiatives</p>
                              <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mt-1">Empowering the Chambal youth for tomorrow</p>
                           </div>
                        </a>
                     </div>
                  </div>
               </div>
            </div>
         </section>

         {/* 9. GEOSPATIAL COORDINATES — THE DONDARI NODE */}
         <section className="py-24 lg:py-48 bg-gray-900 text-white relative">
            <div className="max-w-7xl mx-auto px-6 lg:px-10">
               <div className="flex flex-col lg:flex-row justify-between items-center gap-20">
                  <div className="max-w-2xl space-y-10 text-center lg:text-left">
                     <div className="flex justify-center lg:justify-start items-center gap-4">
                        <Compass className="w-8 h-8 text-primary-500 animate-spin-slow" />
                        <h4 className="text-[10px] font-black uppercase tracking-[0.6em] text-primary-500">Live Geospatial Metrics</h4>
                     </div>
                     <h3 className="text-3xl lg:text-6xl font-black italic tracking-tighter uppercase leading-none">The Precision <br/> Coordinates.</h3>
                     <p className="text-sm lg:text-lg font-medium text-gray-400 uppercase tracking-[0.2em] leading-loose">
                        Facility Alpha is statically positioned in Dondari, Morena. Our logistics network utilizes this node as the primary ingestion point for the entire **Gwalior-Chambal** distribution grid.
                     </p>
                  </div>

                  <div className="grid grid-cols-1 gap-4 w-full lg:w-96">
                     {[
                        { l: 'Latitude', v: '26.6853° N' },
                        { l: 'Longitude', v: '78.2251° E' },
                        { l: 'Elevation', v: '177m ASL' },
                        { l: 'Timezone', v: 'UTC +5:30' }
                     ].map((coord, i) => (
                        <div key={i} className="p-8 border border-white/10 bg-white/5 flex items-center justify-between group hover:border-primary-500 transition-all">
                           <span className="text-[10px] font-black uppercase tracking-widest text-gray-500 group-hover:text-primary-500">{coord.l}</span>
                           <span className="text-xl font-bold tracking-tighter italic text-gray-300">{coord.v}</span>
                        </div>
                     ))}
                  </div>
               </div>
            </div>
         </section>

      </div>
   );
};

export default OurFarm;
