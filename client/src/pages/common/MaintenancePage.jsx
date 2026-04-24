import React, { useState } from 'react';
import { 
  Building2, 
  Clock, 
  MonitorOff, 
  Mail, 
  MapPin, 
  PhoneCall, 
  ShieldCheck, 
  Server, 
  Database,
  Globe2,
  CalendarDays,
  FileText,
  HelpCircle,
  ArrowRight,
  ChevronDown,
  Info
} from 'lucide-react';

/* ─────────────────────────────────────────────────────────────────────────────
 * ENTERPRISE MAINTENANCE PAGE 
 * A highly structured, professional, and sleek maintenance layout designed for 
 * corporate applications and large-scale e-commerce operations.
 * This architecture avoids unnecessary animations while maintaining a premium,
 * high-fidelity visual aesthetic.
 * ───────────────────────────────────────────────────────────────────────────── */

/* -------------------------------------------------------------------------- */
/* GLOBAL CONSTANTS & STATIC DATA                                             */
/* -------------------------------------------------------------------------- */

const INCIDENT_LOGS = [
  {
    id: 'INC-2026-A1',
    time: '08:00 AM IST',
    status: 'Scheduled',
    message: 'Maintenance window officially initiated. Routing traffic to fallback pages.'
  },
  {
    id: 'INC-2026-A2',
    time: '08:15 AM IST',
    status: 'In Progress',
    message: 'Primary database schema migration starting. All transactional engines paused.'
  },
  {
    id: 'INC-2026-A3',
    time: '08:45 AM IST',
    status: 'In Progress',
    message: 'Applying security patches to the payment gateway microservices.'
  }
];

const FAQ_DATA = [
  {
    category: 'General',
    questions: [
      {
        q: "Why is GramDairy currently unavailable?",
        a: "We are executing our scheduled quarterly infrastructure upgrade. This process ensures our platform remains highly secure, exceptionally fast, and capable of handling increasing order volumes."
      },
      {
        q: "When will the platform be operational again?",
        a: "This maintenance window is scheduled for approximately 4 hours. Our engineering team is closely monitoring the deployment, and services will be restored as swiftly as possible."
      }
    ]
  },
  {
    category: 'Orders & Payments',
    questions: [
      {
        q: "Will my current active order be delivered?",
        a: "Yes. Our logistics and delivery fleet operate on a decentralized system. Any order that was dispatched prior to this maintenance window will be fulfilled according to the standard schedule."
      },
      {
        q: "Are my payment details secure during this upgrade?",
        a: "Absolutely. We do not store sensitive payment data on our primary servers. All financial transactions are managed by highly regulated, tier-1 payment gateways."
      }
    ]
  }
];

const SYSTEM_NODES = [
  { name: 'Core API Gateway', icon: Globe2, status: 'Active (Read-Only)' },
  { name: 'Identity & Auth', icon: ShieldCheck, status: 'Active' },
  { name: 'Order Processing', icon: Server, status: 'Suspended (Maintenance)' },
  { name: 'Database Cluster', icon: Database, status: 'Migrating' }
];

/* -------------------------------------------------------------------------- */
/* UI COMPONENTS                                                              */
/* -------------------------------------------------------------------------- */

/**
 * Top Navigation Bar (Static)
 */
const TopNavigationBar = () => (
  <nav className="w-full border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-[#0a0a0a]/80 backdrop-blur-md sticky top-0 z-50">
    <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
      {/* Brand Logo */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-primary-600 rounded flex items-center justify-center shadow-sm">
          <Building2 className="w-6 h-6 text-white" />
        </div>
        <div className="flex flex-col">
          <span className="text-xl font-bold tracking-tight text-gray-900 dark:text-white leading-tight">GramDairy</span>
          <span className="text-[10px] font-medium text-gray-500 uppercase tracking-widest">Enterprise Platform</span>
        </div>
      </div>

      {/* Status Indicator */}
      <div className="hidden sm:flex items-center gap-2 px-4 py-1.5 bg-gray-100 dark:bg-gray-800/80 rounded-full border border-gray-200 dark:border-gray-700">
        <div className="w-2 h-2 rounded-full bg-amber-500" />
        <span className="text-xs font-semibold text-gray-600 dark:text-gray-300">System Maintenance</span>
      </div>
    </div>
  </nav>
);

/**
 * Main Hero Banner Section
 */
const HeroSection = () => (
  <section className="relative w-full py-20 lg:py-32 overflow-hidden border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-[#111111]">
    <div className="absolute inset-0 opacity-[0.02] dark:opacity-[0.04] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
    
    <div className="max-w-7xl mx-auto px-6 relative z-10">
      <div className="max-w-3xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm rounded text-sm font-medium text-gray-600 dark:text-gray-300 mb-6">
          <MonitorOff className="w-4 h-4 text-primary-600" />
          Scheduled Upgrade Window
        </div>
        
        <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-gray-900 dark:text-white tracking-tight leading-[1.1] mb-6">
          Infrastructure <br />
          <span className="text-gray-400 dark:text-gray-500">Enhancement.</span>
        </h1>
        
        <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed max-w-2xl">
          GramDairy is currently undergoing a planned system-wide architectural upgrade. 
          This essential maintenance enables us to provide higher reliability, unmatched performance, 
          and advanced security for your daily transactions.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row gap-4">
          <div className="flex items-center gap-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-4 rounded shadow-sm">
            <div className="w-12 h-12 bg-primary-50 dark:bg-primary-900/20 text-primary-600 rounded flex items-center justify-center">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Estimated Duration</p>
              <p className="text-gray-900 dark:text-white font-bold text-lg mt-0.5">Approx. 4 Hours</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-4 rounded shadow-sm">
            <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/20 text-blue-600 rounded flex items-center justify-center">
              <CalendarDays className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Current Date</p>
              <p className="text-gray-900 dark:text-white font-bold text-lg mt-0.5">{new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);

/**
 * System Status Node Card
 */
const StatusNode = ({ name, icon: Icon, status }) => {
  const getStatusColor = (statusText) => {
    if (statusText.includes('Active')) return 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800';
    if (statusText.includes('Suspended')) return 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800';
    return 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800';
  };

  return (
    <div className="flex items-center justify-between p-5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded shadow-sm transition-colors hover:border-gray-300 dark:hover:border-gray-700">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded flex items-center justify-center text-gray-500">
          <Icon className="w-5 h-5" />
        </div>
        <span className="font-semibold text-gray-900 dark:text-gray-100 text-sm md:text-base">{name}</span>
      </div>
      <div className={`px-3 py-1.5 rounded text-xs font-semibold border ${getStatusColor(status)}`}>
        {status}
      </div>
    </div>
  );
};

/**
 * Incident Log Item
 */
const LogItem = ({ log, isLast }) => (
  <div className="flex gap-6 relative">
    {/* Timeline vertical line */}
    {!isLast && <div className="absolute top-10 left-[19px] bottom-[-24px] w-px bg-gray-200 dark:bg-gray-800" />}
    
    <div className="flex-none mt-1">
      <div className="w-10 h-10 bg-white dark:bg-gray-900 rounded-full border-2 border-gray-200 dark:border-gray-700 flex items-center justify-center shadow-sm z-10 relative">
        <div className="w-3 h-3 bg-gray-300 dark:bg-gray-600 rounded-full" />
      </div>
    </div>
    
    <div className="flex-1 pb-8">
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-5 rounded shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider">{log.id}</span>
          <span className="text-xs font-medium text-gray-500 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">{log.time}</span>
        </div>
        <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">{log.message}</p>
      </div>
    </div>
  </div>
);

/**
 * Technical Status Board
 */
const TechnicalStatusBoard = () => (
  <section className="py-20 bg-white dark:bg-[#0a0a0a]">
    <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-16">
      
      {/* Left Column: System Nodes */}
      <div className="lg:col-span-7 space-y-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight flex items-center gap-3 mb-2">
            <Server className="w-6 h-6 text-primary-600" /> System Module Status
          </h2>
          <p className="text-gray-500 text-sm">Real-time overview of primary microservices and their operational states.</p>
        </div>
        
        <div className="grid grid-cols-1 gap-4">
          {SYSTEM_NODES.map((node, i) => (
            <StatusNode key={i} name={node.name} icon={node.icon} status={node.status} />
          ))}
        </div>

        <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30 rounded flex items-start gap-4">
          <Info className="w-5 h-5 text-blue-600 mt-0.5 flex-none" />
          <p className="text-sm text-blue-800 dark:text-blue-300 leading-relaxed">
            Data integrity holds our highest priority. All internal routing mechanisms are strictly restricted to manual oversight during the entirety of this window.
          </p>
        </div>
      </div>

      {/* Right Column: Deployment Log */}
      <div className="lg:col-span-5 space-y-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight flex items-center gap-3 mb-2">
            <FileText className="w-6 h-6 text-primary-600" /> Deployment Log
          </h2>
          <p className="text-gray-500 text-sm">Chronological updates from the engineering team.</p>
        </div>

        <div className="pt-2">
          {INCIDENT_LOGS.map((log, i) => (
            <LogItem key={i} log={log} isLast={i === INCIDENT_LOGS.length - 1} />
          ))}
        </div>
      </div>

    </div>
  </section>
);

/**
 * Sleek Accordion for FAQs
 */
const SleekAccordionItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-gray-200 dark:border-gray-800 last:border-0 hover:bg-gray-50 dark:hover:bg-[#111111] transition-colors">
      <button 
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between py-5 text-left focus:outline-none"
      >
        <span className="font-semibold text-gray-900 dark:text-gray-100 text-base">{question}</span>
        <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform duration-300 ease-in-out ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      <div 
        className="overflow-hidden transition-all duration-300 ease-in-out"
        style={{ maxHeight: isOpen ? '500px' : '0px', opacity: isOpen ? 1 : 0 }}
      >
        <div className="pb-6 text-gray-600 dark:text-gray-400 text-sm leading-relaxed pr-8">
          {answer}
        </div>
      </div>
    </div>
  );
};

/**
 * FAQ Section
 */
const FAQSection = () => (
  <section className="py-20 bg-gray-50 dark:bg-[#111111] border-t border-gray-200 dark:border-gray-800">
    <div className="max-w-4xl mx-auto px-6">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">Frequently Asked Questions</h2>
        <p className="mt-4 text-gray-500">Find clarity on how this maintenance affects your regular operations.</p>
      </div>

      <div className="bg-white dark:bg-[#0a0a0a] rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
        {FAQ_DATA.map((section, idx) => (
          <div key={idx} className={idx !== 0 ? 'border-t-4 border-gray-50 dark:border-[#111111]' : ''}>
            <div className="bg-gray-50 dark:bg-[#111111] px-6 py-3 border-b border-gray-200 dark:border-gray-800">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">{section.category}</span>
            </div>
            <div className="px-6">
              {section.questions.map((q, i) => (
                <SleekAccordionItem key={i} question={q.q} answer={q.a} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

/**
 * Minimalist Contact Directory
 */
const ContactDirectory = ({ supportEmail, supportPhone }) => {
  const defaultEmail = 'support@gramdairy.com';
  const defaultPhone = '+91 1800-DAIRY-HELP';
  const emailToUse = supportEmail || defaultEmail;
  const phoneToUse = supportPhone || defaultPhone;

  return (
    <section className="py-20 bg-white dark:bg-[#0a0a0a] border-t border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-10">
          
          <div className="max-w-lg">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight flex items-center gap-3">
              <HelpCircle className="w-8 h-8 text-primary-600" /> Need Assistance?
            </h2>
            <p className="mt-4 text-gray-600 dark:text-gray-400 leading-relaxed text-lg">
              Our dedicated enterprise support desk remains completely operational. 
              Reach out through our specialized channels below if you encounter urgent anomalies.
            </p>
          </div>

          <div className="flex-1 w-full grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            <a href={`mailto:${emailToUse}`} className="group p-6 bg-gray-50 dark:bg-[#111111] rounded border border-gray-200 dark:border-gray-800 hover:border-primary-300 dark:hover:border-primary-800 transition-colors">
              <Mail className="w-6 h-6 text-gray-400 group-hover:text-primary-600 transition-colors mb-4" />
              <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-1">Email Support</h3>
              <p className="text-gray-500 text-sm truncate font-mono">{emailToUse}</p>
            </a>

            <a href={`tel:${phoneToUse}`} className="group p-6 bg-gray-50 dark:bg-[#111111] rounded border border-gray-200 dark:border-gray-800 hover:border-primary-300 dark:hover:border-primary-800 transition-colors">
              <PhoneCall className="w-6 h-6 text-gray-400 group-hover:text-primary-600 transition-colors mb-4" />
              <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-1">Direct Hotline</h3>
              <p className="text-gray-500 text-sm truncate font-mono">{phoneToUse}</p>
            </a>

            {/* Corporate Location (Static Design Element) */}
            <div className="group p-6 bg-gray-50 dark:bg-[#111111] rounded border border-gray-200 dark:border-gray-800 sm:col-span-2">
              <MapPin className="w-6 h-6 text-gray-400 mb-4" />
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-1">Corporate Headquarters</h3>
                  <p className="text-gray-500 text-sm">GramDairy Logistics Hub, Sector 45, India</p>
                </div>
                <button type="button" className="inline-flex items-center gap-2 text-sm font-semibold text-primary-600 hover:text-primary-700 transition-colors">
                  View Operating Hours <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};

/**
 * Enterprise Footer (Static)
 */
const CorporateFooter = () => (
  <footer className="py-8 bg-gray-50 dark:bg-[#111111] border-t border-gray-200 dark:border-gray-800">
    <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
      <div className="flex items-center gap-2 opacity-60">
        <div className="w-6 h-6 bg-gray-300 dark:bg-gray-700 rounded-sm flex items-center justify-center">
          <Building2 className="w-4 h-4 text-white dark:text-[#111111]" />
        </div>
        <span className="text-xs font-bold text-gray-600 dark:text-gray-400 tracking-wider">GRAMDAIRY SYSTEMS</span>
      </div>
      
      <div className="flex items-center gap-6 text-xs font-semibold text-gray-500">
        <span className="hover:text-gray-900 dark:hover:text-white cursor-pointer transition-colors">Privacy Policy</span>
        <span className="hover:text-gray-900 dark:hover:text-white cursor-pointer transition-colors">Terms of Service</span>
        <span className="hover:text-gray-900 dark:hover:text-white cursor-pointer transition-colors">Compliance</span>
      </div>

      <div className="text-xs text-gray-400">
        &copy; {new Date().getFullYear()} GramDairy Inc. All rights reserved.
      </div>
    </div>
  </footer>
);

/* -------------------------------------------------------------------------- */
/* MAIN EXPORT: MAINTENANCE PAGE                                              */
/* -------------------------------------------------------------------------- */

const MaintenancePage = ({ supportEmail, supportPhone }) => {
  return (
    <div className="min-h-screen bg-white dark:bg-[#0a0a0a] font-sans selection:bg-primary-500/30 font-['Inter',system-ui,sans-serif]">
      {/* Structural composition of the corporate maintenance portal */}
      <TopNavigationBar />
      <main>
        <HeroSection />
        <TechnicalStatusBoard />
        <FAQSection />
        <ContactDirectory supportEmail={supportEmail} supportPhone={supportPhone} />
      </main>
      <CorporateFooter />
    </div>
  );
};

/* Provide robust component metadata to aid react-refresh and static analysis tools */
MaintenancePage.displayName = 'EnterpriseMaintenancePage';

export default MaintenancePage;
